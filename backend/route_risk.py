import numpy as np
from risk import severity_to_score

def calculate_route_risk(route_points, df):

    total_risk = 0

    for lat, lon in route_points:

        nearby = df[
            (abs(df["latitude"] - lat) < 0.01) &
            (abs(df["longitude"] - lon) < 0.01)
        ]

        for _, row in nearby.iterrows():
            total_risk += severity_to_score(row["accident_severity"])

    return total_risk
def risk_to_color(score):

    if score > 100:
        return "red"
    elif score > 50:
        return "yellow"
    else:
        return "blue"