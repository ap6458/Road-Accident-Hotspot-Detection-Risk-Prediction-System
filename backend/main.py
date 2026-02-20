from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

# ⭐ ML imports
from ml_preprocesing import load_ml_data
from ml_hotspots import detect_hotspots

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- LOAD DATA (FOR MAP SPOTS) ----------------
df = pd.read_csv(
    "dataset/accidents.csv",
    encoding="latin1",
    low_memory=False
)

df = df[
    ["latitude", "longitude", "accident_severity"]
]

df = df.dropna()

# ---------------- LOAD DATA (FOR AI MODEL) ----------------
ml_df = load_ml_data()


# ============================================================
# BASIC ACCIDENT SPOTS (YOUR EXISTING FEATURE)
# ============================================================
@app.get("/accident-spots")
def accident_spots():

    # limit markers for performance
    sample = df.sample(2000)

    return sample.to_dict(orient="records")


# ============================================================
# AI FUTURE HOTSPOT PREDICTION
# ============================================================
@app.get("/future-hotspots")
def future_hotspots():

    hotspots = detect_hotspots(ml_df)

    return hotspots