import asyncio
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, HTTPException, Query, Request, status
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

app = FastAPI(title="Product API Service")
BASE_DIR = Path(__file__).resolve().parent

# 1. Mount Static, Frontend & Templates (Lab 3)
static_dir = BASE_DIR / "static"
frontend_dir = BASE_DIR.parent / "frontend" if (BASE_DIR.parent / "frontend").exists() else BASE_DIR / "frontend"
templates_dir = BASE_DIR / "templates"

static_dir.mkdir(exist_ok=True)
frontend_dir.mkdir(exist_ok=True)
templates_dir.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=str(static_dir), html=True), name="static")
app.mount("/frontend", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")

templates = Jinja2Templates(directory=str(templates_dir))


# 2. Pydantic Schemas (Lab 2)
class ItemBase(BaseModel):
    name: str
    price: float

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    pass

class ItemPublic(ItemBase):
    id: int

# 3. Database Mock & Helper Functions (Lab 1)
_items: list[ItemPublic] = []
_next_id: int = 1

def _find(item_id: int) -> ItemPublic | None:
    return next((item for item in _items if item.id == item_id), None)

def _find_index(item_id: int) -> int | None:
    for idx, item in enumerate(_items):
        if item.id == item_id:
            return idx
    return None

def _all() -> list[ItemPublic]:
    return _items

# 4. Basic & Utility Endpoints 
@app.get("/")
def read_root():
    return {"message": "Hello, Web!"}

@app.get("/hello/{name}")
def hello(name: str):
    return {"greeting": f"Hello {name}"}

@app.get("/add")
def add(a: int, b: int):
    return {"a": a, "b": b, "sum": a + b}

@app.get("/product")
def product(a: int, b: int):
    return {"a": a, "b": b, "product": a * b}

@app.get("/slow")
async def slow():
    await asyncio.sleep(1)
    return {"done": True}

# 5. Item Endpoints: Full CRUD (Lab 1, Lab 2, Lab 3)
@app.post(
    "/items",
    response_model=ItemPublic,
    status_code=status.HTTP_201_CREATED,
)
def create_item(data: ItemCreate):
    global _next_id
    item = ItemPublic(id=_next_id, name=data.name, price=data.price)
    _items.append(item)
    _next_id += 1
    return item

@app.get("/items", response_model=list[ItemPublic])
def list_items(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    q: Annotated[str | None, Query(min_length=2)] = None,
):
    results = _items
    if q:
        results = [item for item in results if q.lower() in item.name.lower()]
    return results[skip : skip + limit]

@app.get("/items/{item_id}", response_model=ItemPublic)
def get_item(item_id: int):
    item = _find(item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )
    return item

@app.put("/items/{item_id}", response_model=ItemPublic)
def update_item(item_id: int, data: ItemUpdate):
    idx = _find_index(item_id)
    if idx is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )
    updated_item = ItemPublic(id=item_id, name=data.name, price=data.price)
    _items[idx] = updated_item
    return updated_item

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int):
    idx = _find_index(item_id)
    if idx is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )
    _items.pop(idx)
    return None

# 6. Template (HTML View) 
@app.get("/items-page")
def items_page(request: Request):
    return templates.TemplateResponse(
        "list.html",
        {"request": request, "items": _all()},
    )