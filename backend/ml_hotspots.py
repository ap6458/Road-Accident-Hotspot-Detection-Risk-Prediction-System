import os
import pandas as pd
from sklearn.cluster import DBSCAN
import numpy as np

# ── Path to dataset ───────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "dataset", "accidents.csv")

# ── In-memory cache so CSV is read only once per server start ─────────────────
_df_cache: pd.DataFrame | None = None

# ── Severity normalisation map ────────────────────────────────────────────────
SEVERITY_MAP = {
    "severe": "severe", "fatal": "severe", "serious": "severe",
    "moderate": "moderate", "slight": "moderate", "medium": "moderate",
    "light": "light", "minor": "light", "low": "light",
    "1": "severe", "2": "moderate", "3": "light",
}


def _load_df() -> pd.DataFrame:
    """Load and clean the CSV. Cached after first read."""
    global _df_cache
    if _df_cache is not None:
        return _df_cache

    if not os.path.exists(CSV_PATH):
        print(f"[WARNING] Dataset not found at {CSV_PATH}")
        return pd.DataFrame(columns=["latitude", "longitude", "severity"])

    # low_memory=False silences the DtypeWarning for mixed-type columns
    df = pd.read_csv(CSV_PATH, low_memory=False)

    # Normalise column names (strip spaces, lowercase)
    df.columns = df.columns.str.strip().str.lower()

    # Try to find lat/lng columns even if named differently
    lat_candidates = ["latitude", "lat", "y"]
    lng_candidates = ["longitude", "lng", "lon", "long", "x"]

    lat_col = next((c for c in lat_candidates if c in df.columns), None)
    lng_col = next((c for c in lng_candidates if c in df.columns), None)

    if lat_col is None or lng_col is None:
        print(f"[WARNING] Could not find lat/lng columns. Found: {list(df.columns)}")
        return pd.DataFrame(columns=["latitude", "longitude", "severity"])

    df = df.rename(columns={lat_col: "latitude", lng_col: "longitude"})

    # Try to find severity column
    sev_candidates = ["severity", "accident_severity", "sev", "type", "level"]
    sev_col = next((c for c in sev_candidates if c in df.columns), None)

    if sev_col:
        df = df.rename(columns={sev_col: "severity"})
        df["severity"] = (
            df["severity"]
            .astype(str).str.strip().str.lower()
            .map(SEVERITY_MAP)
            .fillna("light")
        )
    else:
        df["severity"] = "light"

    # Drop rows with missing coordinates
    df = df.dropna(subset=["latitude", "longitude"])
    df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
    df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")
    df = df.dropna(subset=["latitude", "longitude"])

    df = df[["latitude", "longitude", "severity"]]
    _df_cache = df  # cache so next request skips disk read
    return df


def get_accidents() -> list[dict]:
    """Return all accident records as a list of dicts."""
    df = _load_df()
    if df.empty:
        return []
    return df.to_dict(orient="records")


def get_hotspots(
    eps_km: float = 0.5,
    min_samples: int = 5,
) -> list[dict]:
    """
    Run DBSCAN on accident coordinates and return cluster centre points.

    eps_km      – neighbourhood radius in kilometres (approx)
    min_samples – minimum points to form a dense cluster
    """
    df = _load_df()
    if df.empty or len(df) < min_samples:
        return []

    coords = df[["latitude", "longitude"]].values

    # DBSCAN expects radians when using haversine metric
    coords_rad = np.radians(coords)
    eps_rad = eps_km / 6371.0  # Earth radius in km

    db = DBSCAN(
        eps=eps_rad,
        min_samples=min_samples,
        algorithm="ball_tree",
        metric="haversine",
    ).fit(coords_rad)

    df = df.copy()
    df["cluster"] = db.labels_

    hotspots = []
    for cluster_id in set(db.labels_):
        if cluster_id == -1:
            continue  # noise points
        cluster_points = df[df["cluster"] == cluster_id]
        hotspots.append({
            "latitude": float(cluster_points["latitude"].mean()),
            "longitude": float(cluster_points["longitude"].mean()),
            "count": int(len(cluster_points)),
        })

    # Sort by count descending so the biggest hotspots are first
    hotspots.sort(key=lambda x: x["count"], reverse=True)
    return hotspots
