import asyncio
from contextlib import asynccontextmanager
import logging
from pathlib import Path
import time
from typing import Annotated

from fastapi import Cookie, Depends, FastAPI, Header, HTTPException, Query, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlmodel import Field, Session, SQLModel, create_engine, select
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.sessions import SessionMiddleware

# 1. Logging Setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("api")

# 2. Database & Lifespan
SQLITE_URL = "sqlite:///database.db"
engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(title="Product API Service", lifespan=lifespan)

# 3. Middlewares
app.add_middleware(SessionMiddleware, secret_key="change-me-secret-key")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def catch_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except (HTTPException, StarletteHTTPException):
        raise
    except Exception as exc:
        logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"},
        )

@app.middleware("http")
async def log_and_track_time(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{duration:.6f}"
    logger.info(f"{request.method} {request.url.path} -> {response.status_code} ({duration:.3f}s)")
    return response

# 4. Static Files & Templates
BASE_DIR = Path(__file__).resolve().parent
static_dir = BASE_DIR / "static"
frontend_dir = BASE_DIR.parent / "frontend" if (BASE_DIR.parent / "frontend").exists() else BASE_DIR / "frontend"
templates_dir = BASE_DIR / "templates"
for directory in (static_dir, frontend_dir, templates_dir):
    directory.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=str(static_dir), html=True), name="static")
app.mount("/frontend", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")
templates = Jinja2Templates(directory=str(templates_dir))

# 5. Database Models & Schemas
class ItemBase(SQLModel):
    name: str
    price: float

class Item(ItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    pass

# 6. Dependencies
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

def pagination_params(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
) -> dict[str, int]:
    return {"skip": skip, "limit": limit}

PaginationDep = Annotated[dict[str, int], Depends(pagination_params)]

def verify_api_key(
    x_api_key: Annotated[str, Header(description="API Key bảo mật")]
) -> str:
    if x_api_key != "expected-secret":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
    return x_api_key

_sessions_cart: dict[str, list[str]] = {}

def get_or_create_session_id(request: Request, response: Response) -> str:
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = f"user_{int(time.time() * 1000)}"
        response.set_cookie(key="session_id", value=session_id, httponly=True, samesite="lax")
    return session_id

# 7. Basic & Auth Endpoints
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

@app.get("/boom")
def boom():
    return 1 / 0

@app.get("/secure-data", dependencies=[Depends(verify_api_key)])
def secure_data():
    return {"ok": True, "message": "Bạn đã vượt qua lớp kiểm tra bảo mật!"}

@app.get("/secure-profile")
def secure_profile(api_key: Annotated[str, Depends(verify_api_key)]):
    return {"ok": True, "verified_key": api_key}

# 8. Cookie & Session Endpoints
@app.get("/visits")
def count_visits(response: Response, visits: Annotated[str | None, Cookie()] = None):
    count = int(visits) if visits and visits.isdigit() else 0
    count += 1
    response.set_cookie(key="visits", value=str(count), httponly=True, samesite="lax")
    return {"visits": count}

@app.get("/login")
def login(response: Response):
    response.set_cookie(key="session_id", value="abc123", httponly=True, samesite="lax")
    return {"status": "logged in"}

@app.get("/session/set")
def set_session_value(request: Request):
    request.session["user_id"] = 42
    return {"status": "set", "user_id": 42}

@app.post("/cart/items")
def add_cart_item(item_name: str, session_id: Annotated[str, Depends(get_or_create_session_id)]):
    _sessions_cart.setdefault(session_id, []).append(item_name)
    return {"session_id": session_id, "cart": _sessions_cart[session_id]}

@app.get("/cart")
def get_cart(session_id: Annotated[str, Depends(get_or_create_session_id)]):
    return {"session_id": session_id, "items": _sessions_cart.get(session_id, [])}

# 9. Items CRUD Endpoints
@app.post("/items", response_model=Item, status_code=status.HTTP_201_CREATED)
def create_item(data: ItemCreate, session: SessionDep):
    item = Item.model_validate(data)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@app.get("/items", response_model=list[Item])
def list_items(
    session: SessionDep,
    page: PaginationDep,
    q: Annotated[str | None, Query(min_length=2)] = None,
):
    query = select(Item)
    if q:
        query = query.where(Item.name.contains(q))
    return session.exec(query.offset(page["skip"]).limit(page["limit"])).all()

@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int, session: SessionDep):
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item

@app.put("/items/{item_id}", response_model=Item)
def update_item(item_id: int, data: ItemUpdate, session: SessionDep):
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    item.name = data.name
    item.price = data.price
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, session: SessionDep):
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    session.delete(item)
    session.commit()
    return None

@app.get("/items-page")
def items_page(request: Request, session: SessionDep):
    items = session.exec(select(Item)).all()
    return templates.TemplateResponse(request=request, name="list.html", context={"items": items})