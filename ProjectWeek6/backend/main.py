from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(
    title="Mini House-Price Prediction API",
    description="A simple API for predicting house prices.",
    version="1.0.0"
)

def predict_price(area: float, bedrooms: int, location: str) -> float:
    price = 500_000_000
    price += 15_000_000 * area
    price += 50_000_000 * bedrooms
    location_lower = location.lower()
    if location_lower == "hanoi":
        price *= 1.3
    elif location_lower == "hcmc":
        price *= 1.25
    price = round(price / 1_000_000) * 1_000_000
    return float(price)

@app.get("/predict")
def predict(area: float, bedrooms: int, location: str = "other"):
    predicted_price = predict_price(area=area, bedrooms=bedrooms, location=location)
    return {"area": area, "bedrooms": bedrooms, "location": location, "predicted_price": predicted_price}

class HouseInput(BaseModel):
    area: float
    bedrooms: int
    location: str = "other"

@app.post("/predict")
def predict_post(house: HouseInput):
    predicted_price = predict_price(area=house.area, bedrooms=house.bedrooms, location=house.location)
    return {"area": house.area, "bedrooms": house.bedrooms, "location": house.location, "predicted_price": predicted_price}

app.mount("/static", StaticFiles(directory="../frontend"), name="static")