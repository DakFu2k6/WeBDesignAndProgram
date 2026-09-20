from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from fastapi.responses import FileResponse

app = FastAPI(title="Mini House-Price Prediction & Items API", description="Week 07 Extended Lab - Routing, Request/Response", version="2.0.0")

# HOUSE PRICE PREDICTION
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

# PART E — TOY PREDICTION ENDPOINT
class HousePriceRequest(BaseModel):
    area_sqm: float = Field(gt=0)
    bedrooms: int = Field(ge=0)
    distance_to_center_km: float = Field(ge=0)

class HousePricePrediction(BaseModel):
    predicted_price: float
    currency: str = "VND"

@app.post("/predict/house-price", response_model=HousePricePrediction)
def predict_house_price(request: HousePriceRequest):
    price = (
        request.area_sqm * 15_000_000
        - request.distance_to_center_km * 5_000_000
        + request.bedrooms * 20_000_000
    )
    return {"predicted_price": float(price), "currency": "VND"}

# PART A-D — ITEMS API
class ItemCreate(BaseModel):
    name: str
    price: float = Field(ge=0)

class ItemUpdate(BaseModel):
    name: str | None = None
    price: float | None = Field(default=None, ge=0)

class ItemPublic(BaseModel):
    id: int
    name: str
    price: float

class ItemListResponse(BaseModel):
    items: list[ItemPublic]
    total: int
    skip: int
    limit: int

items_db = [
    {
        "id": 1,
        "name": "Laptop",
        "price": 25_000_000
    },
    {
        "id": 2,
        "name": "Mouse",
        "price": 500_000
    },
    {
        "id": 3,
        "name": "Keyboard",
        "price": 1_200_000
    },
    {
        "id": 4,
        "name": "Monitor",
        "price": 5_000_000
    },
    {
        "id": 5,
        "name": "Headphones",
        "price": 2_000_000
    }
]

def find_item(item_id: int):
    for item in items_db:
        if item["id"] == item_id:
            return item
    return None

def name_exists(name: str, exclude_id: int | None = None):
    for item in items_db:
        if exclude_id is not None and item["id"] == exclude_id:
            continue
        if item["name"].lower() == name.lower():
            return True
    return False

# PART B + PART D
@app.get("/items", response_model=ItemListResponse)
def list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    min_price: float | None = Query(None),
    max_price: float | None = Query(None),
    q: str | None = Query(None, min_length=2),
    sort_by: str = Query("id", pattern="^(id|name|price)$"),
    order: str = Query("asc", pattern="^(asc|desc)$")
    ):

    # 1. Start with all items
    filtered_items = items_db.copy()

    # 2. Filter by minimum price
    if min_price is not None:
        filtered_items = [
            item
            for item in filtered_items
            if item["price"] >= min_price
        ]

    # 3. Filter by maximum price
    if max_price is not None:
        filtered_items = [
            item
            for item in filtered_items
            if item["price"] <= max_price
        ]

    # 4. Search by name
    if q is not None:
        search_text = q.lower()
        filtered_items = [item for item in filtered_items if search_text in item["name"].lower()]

    # 5. Sort
    filtered_items.sort(key=lambda item: item[sort_by].lower() if sort_by == "name" else item[sort_by], reverse=(order == "desc"))

    # 6. Count AFTER filtering
    total = len(filtered_items)

    # 7. Pagination
    paginated_items = filtered_items[skip:skip + limit]

    # 8. Envelope response
    return {"items": paginated_items, "total": total,"skip": skip, "limit": limit}

@app.get("/items/{item_id}", response_model=ItemPublic)
def get_item(item_id: int):
    item = find_item(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

# PART C — Duplicate Names
@app.post("/items", response_model=ItemPublic, status_code=201)
def create_item(item: ItemCreate):
    if name_exists(item.name):
        raise HTTPException(status_code=409, detail="Item with this name already exists")
    new_id = max(
        [item["id"] for item in items_db],
        default=0
    ) + 1
    new_item = {"id": new_id, "name": item.name, "price": item.price}
    items_db.append(new_item)
    return new_item

@app.put("/items/{item_id}", response_model=ItemPublic)
def update_item(item_id: int, item: ItemCreate):
    existing_item = find_item(item_id)
    if existing_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    if (
        item.name.lower() != existing_item["name"].lower()
        and name_exists(item.name, exclude_id=item_id)
    ):
        raise HTTPException(status_code=409, detail="Item with this name already exists")
    existing_item["name"] = item.name
    existing_item["price"] = item.price
    return existing_item

# PART A — Partial Update
@app.patch("/items/{item_id}", response_model=ItemPublic)
def patch_item(item_id: int, item: ItemUpdate):
    existing_item = find_item(item_id)
    if existing_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    update_data = item.model_dump(exclude_unset=True)
    if "name" in update_data:
        if (
            update_data["name"].lower()
            != existing_item["name"].lower()
            and name_exists(update_data["name"], exclude_id=item_id)
        ):
            raise HTTPException(status_code=409, detail="Item with this name already exists") 
    for field, value in update_data.items():
        existing_item[field] = value
    return existing_item

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    item = find_item(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    items_db.remove(item)
    return {"message": "Item deleted successfully"}

@app.get("/")
def home():
    return FileResponse("../frontend/index.html")

app.mount("/static", StaticFiles(directory="../frontend"), name="static")