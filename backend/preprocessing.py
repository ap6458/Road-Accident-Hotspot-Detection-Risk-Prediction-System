import pandas as pd

def load_data():

    df = pd.read_csv(
    "dataset/accidents.csv",
    encoding="latin1",
    low_memory=False
)
    
    df = df[[
        "latitude",
        "longitude",
        "accident_severity"   # severity column
    ]]

    df = df.dropna()

    return df