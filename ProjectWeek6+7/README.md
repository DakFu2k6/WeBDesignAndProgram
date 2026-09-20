````markdown
# FastAPI House Price Prediction & Items API

A FastAPI project developed for **Week 07 — Extended Lab (Lab 4, Take-Home)**.

The project extends the previous House Price Prediction API by adding:

- RESTful item management
- PATCH partial updates
- Filtering
- Searching
- Sorting
- Pagination
- Duplicate-name validation
- HTTP 409 Conflict handling
- Response envelope pattern
- Pydantic request validation
- A toy house-price prediction endpoint
- Separate HTML, CSS and JavaScript frontend

---

## 1. Project Structure

```text
project/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
````

---

## 2. Technologies

* Python 3.10+
* FastAPI
* Pydantic
* Uvicorn
* HTML5
* CSS3
* JavaScript
* REST API
* JSON

---

## 3. Features

### House Price Prediction

The project provides two prediction styles.

#### GET /predict

Example:

```http
GET /predict?area=80&bedrooms=3&location=hanoi
```

Response:

```json
{
    "area": 80,
    "bedrooms": 3,
    "location": "hanoi",
    "predicted_price": 2210000000
}
```

---

### POST /predict

Request body:

```json
{
    "area": 80,
    "bedrooms": 3,
    "location": "hanoi"
}
```

---

### POST /predict/house-price

This endpoint demonstrates how FastAPI can later be connected to a real machine-learning model.

Request:

```json
{
    "area_sqm": 80,
    "bedrooms": 3,
    "distance_to_center_km": 5
}
```

Response:

```json
{
    "predicted_price": 1215000000,
    "currency": "VND"
}
```

The current implementation uses a simple formula instead of a trained ML model.

The formula can later be replaced with:

```python
model.predict(...)
```

without changing the API structure.

---

# 4. Items API

The project also contains an in-memory Items API.

## GET /items

Returns a paginated list of items.

Example:

```http
GET /items
```

Response:

```json
{
    "items": [
        {
            "id": 1,
            "name": "Laptop",
            "price": 25000000
        }
    ],
    "total": 5,
    "skip": 0,
    "limit": 10
}
```

---

## 5. Filtering

Filter by minimum price:

```http
GET /items?min_price=1000000
```

Filter by maximum price:

```http
GET /items?max_price=5000000
```

Combine both:

```http
GET /items?min_price=1000000&max_price=10000000
```

---

## 6. Searching

Search item names using:

```http
GET /items?q=lap
```

The search is:

* Case-insensitive
* Substring-based

For example:

```text
q=lap
```

can match:

```text
Laptop
Gaming Laptop
Laptop Stand
```

The `q` parameter requires at least 2 characters.

---

# 7. Sorting

Sort by ID:

```http
GET /items?sort_by=id
```

Sort by name:

```http
GET /items?sort_by=name
```

Sort by price:

```http
GET /items?sort_by=price
```

Descending order:

```http
GET /items?sort_by=price&order=desc
```

Supported values:

```text
sort_by:
    id
    name
    price

order:
    asc
    desc
```

Invalid values are automatically rejected by FastAPI.

---

# 8. Pagination

Pagination uses:

```text
skip
limit
```

Example:

```http
GET /items?skip=0&limit=5
```

Second page:

```http
GET /items?skip=5&limit=5
```

The API applies operations in this order:

```text
All Items
    ↓
Filtering
    ↓
Searching
    ↓
Sorting
    ↓
Count total
    ↓
Pagination
    ↓
Response
```

Filtering and sorting must happen before pagination.

---

# 9. POST /items

Create a new item.

Request:

```json
{
    "name": "Webcam",
    "price": 1500000
}
```

Successful response:

```text
201 Created
```

---

# 10. Duplicate Names

Item names must be unique.

The comparison is case-insensitive.

For example, if:

```text
Laptop
```

already exists, creating:

```text
laptop
```

will return:

```text
409 Conflict
```

Response:

```json
{
    "detail": "Item with this name already exists"
}
```

---

# 11. PUT /items/{id}

PUT performs a full replacement.

Example:

```http
PUT /items/1
```

Request:

```json
{
    "name": "Gaming Laptop",
    "price": 30000000
}
```

Both fields represent the complete new state of the item.

---

# 12. PATCH /items/{id}

PATCH performs a partial update.

Example:

```http
PATCH /items/1
```

Request:

```json
{
    "price": 28000000
}
```

Only the price is changed.

The existing name remains unchanged.

This is implemented using:

```python
item.model_dump(exclude_unset=True)
```

Therefore, only fields explicitly supplied by the client are updated.

---

# 13. DELETE /items/{id}

Example:

```http
DELETE /items/1
```

If the item does not exist:

```text
404 Not Found
```

---

# 14. Validation

The project uses Pydantic for request validation.

For the house-price prediction endpoint:

```python
class HousePriceRequest(BaseModel):
    area_sqm: float = Field(gt=0)
    bedrooms: int = Field(ge=0)
    distance_to_center_km: float = Field(ge=0)
```

Therefore:

```json
{
    "area_sqm": -10,
    "bedrooms": 3,
    "distance_to_center_km": 5
}
```

will automatically return:

```text
422 Unprocessable Entity
```

No manual validation is required inside the endpoint.

---

# 15. Running the Project

## Step 1 — Open the project

Open the project folder in VS Code.

Example:

```text
project/
├── backend/
└── frontend/
```

Open the terminal in the project root.

---

## Step 2 — Create a virtual environment

Windows:

```bash
python -m venv venv
```

This creates:

```text
venv/
```

---

## Step 3 — Activate the virtual environment

### Windows CMD

```cmd
venv\Scripts\activate
```

### Windows PowerShell

```powershell
venv\Scripts\Activate.ps1
```

### Git Bash

```bash
source venv/Scripts/activate
```

After activation, the terminal should show something similar to:

```text
(venv)
```

---

# 16. Install Dependencies

Upgrade pip:

```bash
python -m pip install --upgrade pip
```

Install FastAPI and Uvicorn:

```bash
pip install fastapi uvicorn
```

Check installation:

```bash
pip list
```

You should see packages including:

```text
fastapi
uvicorn
pydantic
```

---

# 17. Start the FastAPI Server

Navigate to the backend folder:

```bash
cd backend
```

Run:

```bash
uvicorn main:app --reload
```

You should see:

```text
Uvicorn running on http://127.0.0.1:8000
```

---

# 18. Open the Web Application

Open:

```text
http://127.0.0.1:8000/
```

The frontend will be loaded from:

```text
frontend/index.html
```

FastAPI serves the CSS and JavaScript through:

```text
/static/style.css
/static/script.js
```

---

# 19. FastAPI Swagger Documentation

FastAPI automatically provides interactive API documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

This page can be used to test:

* GET /predict
* POST /predict
* POST /predict/house-price
* GET /items
* GET /items/{item_id}
* POST /items
* PUT /items/{item_id}
* PATCH /items/{item_id}
* DELETE /items/{item_id}

---

# 20. ReDoc

FastAPI also provides ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

# 21. Example API Testing

### Create an item

```http
POST /items
```

```json
{
    "name": "Webcam",
    "price": 1500000
}
```

---

### Partial update

```http
PATCH /items/1
```

```json
{
    "price": 22000000
}
```

---

### Search

```http
GET /items?q=lap
```

---

### Filter

```http
GET /items?min_price=1000000&max_price=10000000
```

---

### Sort

```http
GET /items?sort_by=price&order=desc
```

---

### Pagination

```http
GET /items?skip=0&limit=5
```

---

# 22. HTTP Status Codes Used

| Status Code | Meaning                               |
| ----------- | ------------------------------------- |
| 200         | Successful request                    |
| 201         | Resource successfully created         |
| 404         | Resource not found                    |
| 409         | Conflict, such as duplicate item name |
| 422         | Validation error                      |

---

# 23. Project Learning Goals

This project demonstrates the following FastAPI concepts:

```text
FastAPI
│
├── Routing
│
├── Path Parameters
│
├── Query Parameters
│   ├── Filtering
│   ├── Searching
│   ├── Sorting
│   └── Pagination
│
├── Request Body
│
├── Pydantic Models
│
├── Field Validation
│
├── Response Models
│
├── PATCH
│
├── PUT
│
├── HTTPException
│
├── HTTP Status Codes
│
└── Static Files
```

---

# 24. Future Development

The current project uses an in-memory Python list as a simple database.

A future version can replace it with:

* PostgreSQL
* MySQL
* SQLite

The toy house-price formula can also be replaced with a real machine-learning model:

```python
prediction = model.predict(features)
```

This makes FastAPI suitable as a backend API for a real Data Science / Machine Learning project.

---

## Author

FastAPI Week 07 Extended Lab

House Price Prediction & Items Management API

```
```
