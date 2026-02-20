from sklearn.cluster import DBSCAN
from risk_score import calculate_risk_score

def detect_hotspots(df):

    df["risk_score"] = df.apply(calculate_risk_score, axis=1)

    coords = df[["latitude","longitude"]].values

    model = DBSCAN(
        eps=0.003,
        min_samples=40
    )

    labels = model.fit_predict(coords)

    df["cluster"] = labels

    hotspots = []

    for c in set(labels):

        if c == -1:
            continue

        cluster = df[df["cluster"] == c]

        avg_risk = cluster["risk_score"].mean()

        if avg_risk > 8:
            risk = "high"
        elif avg_risk > 6:
            risk = "moderate"
        else:
            risk = "low"

        hotspots.append({
            "lat": cluster["latitude"].mean(),
            "lon": cluster["longitude"].mean(),
            "risk": risk,
            "score": float(avg_risk)
        })

    return hotspots