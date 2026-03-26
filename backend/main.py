from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ml_hotspots import get_accidents, get_hotspots

app = FastAPI(title="NHAI Road Accident API", version="1.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
# This allows the Next.js frontend (port 3000) to call this API.
# Without this, the browser will block every request with a CORS error.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "NHAI Road Intelligence API is running ✅"}


@app.get("/accidents")
def accidents():
    """
    Returns all accident records as a list of objects:
    [{ "latitude": float, "longitude": float, "severity": "severe"|"moderate"|"light" }, ...]
    """
    return get_accidents()


@app.get("/hotspots")
def hotspots():
    """
    Returns AI-predicted hotspot cluster centres:
    [{ "latitude": float, "longitude": float, "count": int }, ...]
    """
    return get_hotspots()