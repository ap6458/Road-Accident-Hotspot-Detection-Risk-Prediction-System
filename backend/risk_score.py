def calculate_risk_score(row):

    score = 0

    # 🔴 accident severity (main factor)
    if row["accident_severity"] == 1:
        score += 10
    elif row["accident_severity"] == 2:
        score += 8
    else:
        score += 3

    # 👥 casualties
    score += row["number_of_casualties"] * 2

    # 🚗 speed risk
    if row["speed_limit"] >= 60:
        score += 4
    elif row["speed_limit"] >= 40:
        score += 2

    # 🌧 weather risk
    if row["weather_conditions"] in [2,3,5,6,7]:
        score += 5

    # 🛣 dangerous road types
    if row["road_type"] in [1,7]:  # roundabout / slip road
        score += 2

    return score