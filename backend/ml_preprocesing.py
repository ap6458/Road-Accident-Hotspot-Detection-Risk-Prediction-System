import pandas as pd

def load_ml_data():

    df = pd.read_csv("dataset/accidents.csv", low_memory=False)

    df = df[
        [
            "latitude",
            "longitude",
            "accident_severity",
            "number_of_casualties",
            "speed_limit",
            "road_type",
            "weather_conditions"
        ]
    ]

    df = df.dropna()

    return df