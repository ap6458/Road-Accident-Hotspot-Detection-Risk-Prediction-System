from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from preprocessing import load_data
from route_risk import calculate_route_risk, risk_to_color

app = FastAPI()

# Load dataset once when server starts
df = load_data()


# ---------- DATA MODEL (IMPORTANT) ----------
class RouteRequest(BaseModel):
    route: List[List[float]]   # [[lat, lon], [lat, lon]]


# ---------- HOME ROUTE ----------
@app.get("/")
def home():
    return {"message": "Backend running successfully"}


# ---------- ROUTE RISK API ----------
@app.post("/route-risk")
def route_risk(request: RouteRequest):

    route_points = request.route

    score = calculate_route_risk(route_points, df)
    color = risk_to_color(score)

    return {
        "risk_score": score,
        "color": color,
        "polyline": route_points
    }