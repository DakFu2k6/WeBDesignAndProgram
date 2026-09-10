import asyncio
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, Web!"}

@app.get("/hello/{name}") 
def hello(name: str):
    return {"greeting": f"Hello {name}"}

@app.get("/add") 
def add(a: int , b: int):
    return {"a": a, "b": b, "sum": a + b}

@app.get("/product")
def product(a: int, b: int):
    return {"a": a, "b": b, "product": a * b}

@app.get("/slow")
async def slow():
    await asyncio. sleep(1) 
    return {"done": True}