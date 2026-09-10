# 🏠 Mini House-Price Prediction API

> **Week 06 Assignment — Web Design and Programming**
> Faculty of Data Science and Artificial Intelligence

A small full-stack web application that demonstrates how a **HTML frontend communicates with a Python FastAPI backend** to calculate and display a predicted house price.

This project focuses on understanding the complete web data flow:

```text
User Input
    ↓
HTML Form
    ↓
JavaScript fetch()
    ↓
HTTP GET Request
    ↓
FastAPI Endpoint
    ↓
Python Prediction Function
    ↓
JSON Response
    ↓
JavaScript
    ↓
Predicted Price Displayed
```

The prediction itself is intentionally based on a **simplified fixed formula**, rather than a trained machine-learning model. The main purpose of this assignment is to practice backend development, API design, HTTP requests, frontend-backend integration, validation, and serving static files with FastAPI.

---

## 📋 Table of Contents

* [Project Overview](#-project-overview)
* [Learning Objectives](#-learning-objectives)
* [Features](#-features)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [How the Application Works](#-how-the-application-works)
* [Prediction Formula](#-prediction-formula)
* [Installation](#-installation)
* [Running the Application](#-running-the-application)
* [Using the Web Interface](#-using-the-web-interface)
* [API Documentation](#-api-documentation)
* [GET /predict](#1-get-predict)
* [POST /predict](#2-post-predict-bonus)
* [Testing](#-testing)
* [Example Calculations](#-example-calculations)
* [Frontend and Backend Integration](#-frontend-and-backend-integration)
* [Why No CORS Is Required](#-why-no-cors-is-required)
* [Why Relative URLs Work](#-why-relative-urls-work)
* [Required and Optional Parameters](#-required-and-optional-parameters)
* [HTTP 422 Validation](#-http-422-validation)
* [Synchronous Endpoint Design](#-synchronous-endpoint-design)
* [Bonus: POST and JSON Request Body](#-bonus-post-and-json-request-body)
* [Troubleshooting](#-troubleshooting)
* [Learning Outcomes](#-learning-outcomes)
* [Assignment Requirements Checklist](#-assignment-requirements-checklist)
* [Future Improvements](#-future-improvements)
* [Conclusion](#-conclusion)

---

# 📌 Project Overview

The project is a mini house-price prediction application consisting of two main parts:

### Frontend

The frontend is an HTML form that collects:

* House area in square meters
* Number of bedrooms
* Location

JavaScript reads these values and sends them to the backend using the browser's `fetch()` API.

### Backend

The backend is built with **FastAPI**.

It provides:

* A Python `predict_price()` function
* A `GET /predict` API endpoint
* A `POST /predict` API endpoint as an optional bonus
* Automatic request validation
* Automatically generated Swagger documentation
* Static file serving for the frontend

The frontend and backend are served from the same origin:

```text
http://127.0.0.1:8000
```

This allows the frontend to communicate with the API without requiring CORS configuration.

---

# 🎯 Learning Objectives

This project is designed to practice the following concepts:

1. Writing a normal Python function and exposing it through an HTTP API.
2. Using FastAPI type hints for automatic request validation.
3. Understanding required and optional query parameters.
4. Testing APIs through Swagger UI at `/docs`.
5. Testing API endpoints directly from a browser URL.
6. Serving a static HTML frontend using FastAPI.
7. Connecting JavaScript to a backend API using `fetch()`.
8. Parsing JSON responses in JavaScript.
9. Handling failed HTTP requests gracefully.
10. Understanding the difference between query parameters and JSON request bodies.
11. Understanding the basic structure of a client-server application.

---

# ✨ Features

## Core Features

* ✅ House-price prediction using a fixed formula
* ✅ FastAPI backend
* ✅ `GET /predict` endpoint
* ✅ Required `area` parameter
* ✅ Required `bedrooms` parameter
* ✅ Optional `location` parameter
* ✅ Automatic type validation
* ✅ HTTP 422 validation for invalid or missing parameters
* ✅ Swagger UI documentation
* ✅ Browser-based API testing
* ✅ Static frontend served by FastAPI
* ✅ JavaScript `fetch()` integration
* ✅ Human-readable price formatting
* ✅ Frontend error handling
* ✅ Same-origin frontend and backend

## Bonus Feature

* ⭐ `POST /predict`
* ⭐ Pydantic request model
* ⭐ JSON request body
* ⭐ Automatic validation of structured input

---

# 🛠 Technology Stack

| Technology | Purpose                              |
| ---------- | ------------------------------------ |
| Python     | Backend programming language         |
| FastAPI    | Web framework for building the API   |
| Uvicorn    | ASGI server used to run FastAPI      |
| Pydantic   | Request data validation              |
| HTML5      | Frontend structure                   |
| CSS3       | Frontend styling                     |
| JavaScript | Frontend logic and API communication |
| Fetch API  | Sending HTTP requests                |
| Swagger UI | Interactive API documentation        |

---

# 📁 Project Structure

```text
project/
│
├── frontend/
│   └── house_form.html
│
├── backend/
│   └── main.py
│
└── README.md
```

### `frontend/house_form.html`

Contains:

* House information form
* Area input
* Bedroom input
* Location selection
* Prediction result area
* JavaScript `fetch()` logic
* Error handling

### `backend/main.py`

Contains:

* FastAPI application
* `predict_price()` function
* `GET /predict`
* `POST /predict` bonus endpoint
* Pydantic model
* Static file configuration

### `README.md`

Contains project documentation, setup instructions, API information, testing procedures, and explanations of the main technical concepts.

---

# 🔄 How the Application Works

The application follows a simple client-server architecture.

```text
┌─────────────────────────────┐
│       User / Browser        │
│                             │
│  Area: 80                   │
│  Bedrooms: 3                │
│  Location: Hanoi            │
└──────────────┬──────────────┘
               │
               │ JavaScript fetch()
               ▼
┌─────────────────────────────┐
│        FastAPI API          │
│                             │
│       GET /predict          │
└──────────────┬──────────────┘
               │
               │ Function call
               ▼
┌─────────────────────────────┐
│      predict_price()        │
│                             │
│ Base price                  │
│ + Area contribution         │
│ + Bedroom contribution     │
│ × Location multiplier      │
│ Round to nearest million    │
└──────────────┬──────────────┘
               │
               │ Python result
               ▼
┌─────────────────────────────┐
│       JSON Response         │
│                             │
│ predicted_price             │
│ 2405000000                  │
└──────────────┬──────────────┘
               │
               │ JSON parsing
               ▼
┌─────────────────────────────┐
│      Browser Interface      │
│                             │
│ Predicted Price:            │
│ 2,405,000,000 VND           │
└─────────────────────────────┘
```

---

# 🧮 Prediction Formula

The prediction is calculated using the exact formula specified in the assignment.

## Step 1 — Base Price

Every house starts with:

```text
500,000,000 VND
```

## Step 2 — Area Contribution

The application adds:

```text
15,000,000 VND × area
```

where `area` is measured in square meters.

## Step 3 — Bedroom Contribution

The application adds:

```text
50,000,000 VND × bedrooms
```

## Step 4 — Location Multiplier

The location is checked without considering letter case.

### Hanoi

```text
× 1.30
```

### HCMC

```text
× 1.25
```

### Other locations

```text
No multiplier
```

## Step 5 — Rounding

The final result is rounded to the nearest million VND.

Conceptually:

```python
round(price / 1_000_000) * 1_000_000
```

---

# 📊 Example Calculation

Consider the following input:

```text
Area:       80 m²
Bedrooms:   3
Location:   Hanoi
```

First calculate the base amount:

```text
500,000,000
```

Area contribution:

```text
80 × 15,000,000
= 1,200,000,000
```

Bedroom contribution:

```text
3 × 50,000,000
= 150,000,000
```

Subtotal:

```text
500,000,000
+ 1,200,000,000
+ 150,000,000

= 1,850,000,000 VND
```

Because the location is Hanoi:

```text
1,850,000,000 × 1.30
= 2,405,000,000 VND
```

Therefore:

```text
Predicted Price = 2,405,000,000 VND
```

---

# 💻 Installation

## 1. Check Python

Make sure Python is installed:

```bash
python --version
```

or:

```bash
python3 --version
```

Python 3.9+ is recommended.

---

## 2. Create or activate a virtual environment

From the project directory:

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

---

## 3. Install dependencies

Install FastAPI and Uvicorn:

```bash
pip install fastapi "uvicorn[standard]"
```

Pydantic is installed automatically as a dependency of FastAPI.

You can verify the installation with:

```bash
pip show fastapi
```

and:

```bash
pip show uvicorn
```

---

# ▶️ Running the Application

The Uvicorn server must be started from the `backend/` directory.

First navigate to the backend:

```bash
cd project/backend
```

Then start the server:

```bash
uvicorn main:app --reload
```

A successful startup should display a message similar to:

```text
Uvicorn running on http://127.0.0.1:8000
```

The `--reload` option automatically reloads the server when Python source files are changed during development.

---

# 🌐 Using the Web Interface

Once the server is running, open:

```text
http://127.0.0.1:8000/static/house_form.html
```

The page contains a form where the user can enter:

```text
Area
Number of bedrooms
Location
```

For example:

```text
Area:       80
Bedrooms:   3
Location:   Hanoi
```

After clicking:

```text
Predict Price
```

the frontend sends a request to the backend.

The predicted result is then displayed in a human-readable format:

```text
Predicted Price: 2,405,000,000 VND
```

---

# 🔌 API Documentation

FastAPI automatically generates interactive API documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

The Swagger UI allows the API to be tested directly from the browser without writing additional client code.

The project provides two endpoints:

```text
GET  /predict
POST /predict
```

The POST endpoint is included as the optional bonus task.

---

# 1. GET `/predict`

The main endpoint accepts house information through URL query parameters.

## Endpoint

```text
GET /predict
```

## Parameters

| Parameter  | Type    | Required | Default | Description                 |
| ---------- | ------- | -------: | ------- | --------------------------- |
| `area`     | `float` |      Yes | —       | House area in square meters |
| `bedrooms` | `int`   |      Yes | —       | Number of bedrooms          |
| `location` | `str`   |       No | `other` | House location              |

---

## Example Request

```text
http://127.0.0.1:8000/predict?area=80&bedrooms=3&location=hanoi
```

## Example Response

```json
{
    "area": 80.0,
    "bedrooms": 3,
    "location": "hanoi",
    "predicted_price": 2405000000.0
}
```

The predicted price is:

```text
2,405,000,000 VND
```

---

# 🧪 Testing `/predict` Through Swagger UI

1. Open:

```text
http://127.0.0.1:8000/docs
```

2. Find:

```text
GET /predict
```

3. Click:

```text
Try it out
```

4. Enter:

```text
area = 80
bedrooms = 3
location = hanoi
```

5. Click:

```text
Execute
```

6. Verify that the response contains:

```json
"predicted_price": 2405000000.0
```

This confirms that the endpoint is working correctly.

---

# 🌍 Testing `/predict` Directly From the Browser

The same API can be tested using the browser's address bar.

Open:

```text
http://127.0.0.1:8000/predict?area=80&bedrooms=3&location=hanoi
```

The browser should return a JSON response similar to:

```json
{
    "area": 80.0,
    "bedrooms": 3,
    "location": "hanoi",
    "predicted_price": 2405000000.0
}
```

This demonstrates that the API can be accessed directly through HTTP without the HTML frontend.

---

# ❓ Testing Without `location`

The following request intentionally omits the location:

```text
http://127.0.0.1:8000/predict?area=80&bedrooms=3
```

The request still works.

The response contains:

```json
{
    "area": 80.0,
    "bedrooms": 3,
    "location": "other",
    "predicted_price": 1850000000.0
}
```

## Why does this work?

The endpoint defines:

```python
location: str = "other"
```

The default value makes `location` an optional query parameter.

If the client does not provide it, FastAPI automatically assigns:

```text
location = "other"
```

Since `"other"` does not receive a location multiplier, the base calculation remains unchanged.

---

# ❌ Testing Without `area`

Now try:

```text
http://127.0.0.1:8000/predict?bedrooms=3
```

The API returns:

```text
422 Unprocessable Entity
```

This happens because `area` is declared as:

```python
area: float
```

There is no default value, so FastAPI considers it a required parameter.

FastAPI automatically validates the incoming request and reports that the required `area` field is missing.

This automatic validation is one of the major advantages of using type annotations with FastAPI.

---

# 📦 GET Response Structure

A successful response contains exactly four main pieces of information:

```json
{
    "area": 80.0,
    "bedrooms": 3,
    "location": "hanoi",
    "predicted_price": 2405000000.0
}
```

The fields are:

### `area`

The submitted house area.

### `bedrooms`

The submitted number of bedrooms.

### `location`

The submitted location or `"other"` when omitted.

### `predicted_price`

The calculated house price in VND.

---

# 2. POST `/predict` — Bonus

The project also implements the optional POST endpoint.

Unlike GET, this endpoint accepts the house information as a JSON request body.

## Endpoint

```text
POST /predict
```

---

## Request Body

```json
{
    "area": 80,
    "bedrooms": 3,
    "location": "hanoi"
}
```

The Pydantic model is:

```python
class HouseInput(BaseModel):
    area: float
    bedrooms: int
    location: str = "other"
```

---

## Example Response

```json
{
    "area": 80.0,
    "bedrooms": 3,
    "location": "hanoi",
    "predicted_price": 2405000000.0
}
```

---

# 🔀 Query Parameters vs JSON Body

There is an important difference between the two API designs.

## GET

Data is included directly in the URL:

```text
/predict?area=80&bedrooms=3&location=hanoi
```

This is called using **query parameters**.

## POST

Data is included in the HTTP request body:

```json
{
    "area": 80,
    "bedrooms": 3,
    "location": "hanoi"
}
```

This is called a **JSON request body**.

For this assignment, query parameters are convenient because the request can be tested directly from the browser address bar.

A JSON request body is useful when an application needs to send structured data that may become more complex.

---

# 🔗 Frontend and Backend Integration

The frontend communicates with the API using JavaScript's `fetch()` function.

The basic request looks like:

```javascript
const response = await fetch(
    `/predict?area=${area}&bedrooms=${bedrooms}&location=${location}`
);
```

The response is then converted from JSON:

```javascript
const data = await response.json();
```

Finally, the frontend accesses:

```javascript
data.predicted_price
```

and displays the result.

---

# 🌍 Why No CORS Is Required

CORS stands for **Cross-Origin Resource Sharing**.

A browser considers two URLs to have different origins if their scheme, hostname, or port differs.

For example:

```text
Frontend:
http://127.0.0.1:5500

Backend:
http://127.0.0.1:8000
```

These are different origins because their ports are different:

```text
5500 ≠ 8000
```

A browser may therefore block requests between them unless the backend explicitly enables the appropriate CORS policy.

However, this assignment avoids that situation entirely.

The frontend is served by FastAPI:

```text
http://127.0.0.1:8000/static/house_form.html
```

The API is also served by FastAPI:

```text
http://127.0.0.1:8000/predict
```

Both use:

```text
http://127.0.0.1:8000
```

Therefore, they have the same origin.

No CORS middleware is necessary for this assignment.

---

# 🔗 Why Relative URLs Work

The JavaScript uses:

```javascript
fetch("/predict?...") 
```

instead of:

```javascript
fetch("http://127.0.0.1:8000/predict?...") 
```

The URL:

```text
/predict
```

is a relative/root-relative URL.

Because the frontend is loaded from:

```text
http://127.0.0.1:8000/static/house_form.html
```

the browser automatically resolves:

```text
/predict
```

to:

```text
http://127.0.0.1:8000/predict
```

This works because the frontend and API share the same origin.

Using a relative URL also makes the frontend less dependent on a hard-coded hostname and port.

---

# 🔐 Required and Optional Parameters

FastAPI uses Python function signatures to determine which query parameters are required.

The endpoint is defined as:

```python
def predict(
    area: float,
    bedrooms: int,
    location: str = "other"
):
```

Therefore:

```text
area       → required
bedrooms   → required
location   → optional
```

## Required parameter

```python
area: float
```

No default value is provided.

The client must supply it.

## Optional parameter

```python
location: str = "other"
```

A default value is provided.

The client may omit it.

This design allows FastAPI to perform validation automatically.

---

# ⚠️ HTTP 422 Validation

FastAPI returns:

```text
422 Unprocessable Entity
```

when the request cannot satisfy the endpoint's expected input requirements.

For example:

```text
/predict?bedrooms=3
```

is invalid because the required `area` parameter is missing.

FastAPI identifies this before the prediction function is executed.

This is useful because the backend does not need to manually check every required query parameter.

---

# 🧠 Type Hints and Automatic Validation

The endpoint uses:

```python
area: float
bedrooms: int
location: str
```

These type annotations tell FastAPI what kind of values are expected.

For example:

```text
area → floating-point number
bedrooms → integer
location → string
```

FastAPI uses these declarations to:

* Validate incoming requests
* Convert compatible values to the expected types
* Generate API documentation
* Report invalid requests automatically

This is why type hints are important for this assignment.

---

# ⚙️ Synchronous Endpoint Design

The endpoint intentionally uses:

```python
def predict(...)
```

instead of:

```python
async def predict(...)
```

The reason is that the prediction function only performs a small amount of synchronous CPU calculation and does not perform asynchronous I/O such as database queries, network requests, or file operations.

Therefore, using a normal `def` function is simpler and appropriate for this task.

The API is not performing any operation that requires asynchronous programming.

---

# 🧪 Testing the Frontend

After starting Uvicorn, open:

```text
http://127.0.0.1:8000/static/house_form.html
```

Enter:

```text
Area: 80
Bedrooms: 3
Location: Hanoi
```

Click:

```text
Predict Price
```

The expected result is:

```text
Predicted Price: 2,405,000,000 VND
```

---

# 🖥️ Checking the Uvicorn Terminal

Every time the frontend sends a request, Uvicorn logs the HTTP request.

For example:

```text
INFO: 127.0.0.1:xxxxx - 
"GET /predict?area=80&bedrooms=3&location=hanoi HTTP/1.1"
200 OK
```

The `200 OK` status indicates that the request was successfully processed.

This provides useful evidence that:

```text
HTML
  ↓
JavaScript
  ↓
fetch()
  ↓
FastAPI
```

is actually working as a complete pipeline.

---

# 🧾 Example Test Cases

| Test             | Input             | Expected Result     |
| ---------------- | ----------------- | ------------------- |
| Hanoi            | `80, 3, hanoi`    | `2,405,000,000 VND` |
| HCMC             | `80, 3, hcmc`     | `2,312,500,000 VND` |
| Other            | `80, 3, other`    | `1,850,000,000 VND` |
| Missing location | `80, 3`           | Uses `"other"`      |
| Missing area     | `3` bedrooms only | `422` error         |
| Case insensitive | `80, 3, HANOI`    | Hanoi multiplier    |
| Case insensitive | `80, 3, Hanoi`    | Hanoi multiplier    |
| Case insensitive | `80, 3, hCmC`     | HCMC multiplier     |

---

# 🧮 Additional Example Calculations

## Example 1 — Hanoi

```text
Area = 100
Bedrooms = 4
Location = Hanoi
```

Calculation:

```text
500,000,000
+ (100 × 15,000,000)
+ (4 × 50,000,000)

= 2,200,000,000
```

Hanoi multiplier:

```text
2,200,000,000 × 1.3
= 2,860,000,000 VND
```

Final:

```text
2,860,000,000 VND
```

---

## Example 2 — HCMC

```text
Area = 80
Bedrooms = 3
Location = HCMC
```

Subtotal:

```text
500,000,000
+ 1,200,000,000
+ 150,000,000

= 1,850,000,000
```

HCMC multiplier:

```text
1,850,000,000 × 1.25
= 2,312,500,000 VND
```

Final:

```text
2,313,000,000 VND
```

after rounding to the nearest million VND.

---

## Example 3 — Other Location

```text
Area = 80
Bedrooms = 3
Location = Other
```

No location multiplier is applied:

```text
500,000,000
+ 1,200,000,000
+ 150,000,000

= 1,850,000,000 VND
```

Final:

```text
1,850,000,000 VND
```

---

# 🐛 Troubleshooting

## Problem 1 — `uvicorn` command not found

Make sure the virtual environment is activated and Uvicorn is installed:

```bash
pip install "uvicorn[standard]"
```

Then try:

```bash
uvicorn main:app --reload
```

---

## Problem 2 — Cannot import `main`

Make sure you are running Uvicorn from the `backend/` directory:

```bash
cd project/backend
```

Then:

```bash
uvicorn main:app --reload
```

The command:

```text
main:app
```

means:

```text
main → main.py
app  → FastAPI application object
```

---

## Problem 3 — Frontend returns 404

Make sure the URL is:

```text
http://127.0.0.1:8000/static/house_form.html
```

Also verify that:

```text
frontend/
└── house_form.html
```

exists.

---

## Problem 4 — API returns 422

Check whether all required parameters are included.

For GET:

```text
area
bedrooms
```

are required.

For example, this is valid:

```text
/predict?area=80&bedrooms=3
```

This is invalid:

```text
/predict?bedrooms=3
```

because `area` is missing.

---

## Problem 5 — Frontend does not display the price

Check that the JavaScript accesses the correct response field:

```javascript
data.predicted_price
```

The backend returns:

```json
{
    "predicted_price": 2405000000.0
}
```

Therefore, the frontend must use:

```javascript
data.predicted_price
```

not:

```javascript
data.price
```

or:

```javascript
data.prediction
```

---

## Problem 6 — CORS error

Do not open the HTML file through Live Server for this assignment.

Avoid:

```text
http://127.0.0.1:5500
```

Instead, open:

```text
http://127.0.0.1:8000/static/house_form.html
```

This ensures that the frontend and backend share the same origin.

---

# 📚 Learning Outcomes

After completing this project, I understand the basic structure of a web application where a frontend communicates with a backend through HTTP.

In particular, this project demonstrates an understanding of:

### 1. Python backend functions

A normal Python function can contain the application logic:

```python
def predict_price(...):
    ...
```

and can then be called from an HTTP endpoint.

### 2. FastAPI endpoints

FastAPI can expose Python functions as web APIs using decorators:

```python
@app.get("/predict")
def predict(...):
    ...
```

### 3. Query parameters

Client data can be passed through a URL:

```text
/predict?area=80&bedrooms=3
```

### 4. Automatic validation

Python type annotations allow FastAPI to validate incoming requests automatically.

### 5. JSON responses

The backend can return Python dictionaries that FastAPI converts into JSON responses.

### 6. Static file serving

FastAPI can serve frontend files using:

```python
app.mount(
    "/static",
    StaticFiles(directory="../frontend"),
    name="static"
)
```

### 7. JavaScript Fetch API

The frontend can communicate with the backend using:

```javascript
fetch("/predict?...") 
```

### 8. Same-origin communication

Serving the frontend and API from the same origin avoids the cross-origin problem introduced by using separate development servers.

### 9. HTTP methods

The project demonstrates both:

```text
GET
POST
```

and the difference between query parameters and JSON request bodies.

---

# ✅ Assignment Requirements Checklist

## Task 1 — Prediction Function

* [x] `predict_price()` implemented
* [x] Correct function signature
* [x] Correct base price
* [x] Correct area contribution
* [x] Correct bedroom contribution
* [x] Hanoi multiplier
* [x] HCMC multiplier
* [x] Case-insensitive location handling
* [x] Rounded to nearest million VND
* [x] Function tested independently

## Task 2 — GET Endpoint

* [x] `GET /predict`
* [x] `area: float`
* [x] `bedrooms: int`
* [x] `location: str = "other"`
* [x] Correct JSON response
* [x] Synchronous `def` endpoint
* [x] Explanation of synchronous design

## Task 3 — API Testing

* [x] Swagger UI tested
* [x] Browser URL tested
* [x] Request without `location` tested
* [x] Request without `area` tested
* [x] HTTP 422 behavior explained

## Task 4 — Static Frontend

* [x] FastAPI `StaticFiles`
* [x] Frontend served from FastAPI
* [x] `/static/house_form.html`
* [x] Same origin
* [x] No unnecessary CORS configuration

## Task 5 — Frontend Integration

* [x] Reads area
* [x] Reads bedrooms
* [x] Reads location
* [x] Uses `fetch()`
* [x] Uses a relative URL
* [x] Awaits HTTP response
* [x] Parses JSON
* [x] Displays predicted price
* [x] Formats price with thousands separators
* [x] Handles request errors
* [x] Uvicorn request logs can be observed

## Task 6 — Bonus

* [x] `POST /predict`
* [x] Pydantic `BaseModel`
* [x] JSON request body
* [x] Automatic request validation
* [x] Difference between query parameters and JSON body explained

---

# 🚀 Future Improvements

Although this project successfully demonstrates the required API and frontend-backend data flow, the prediction algorithm is intentionally simple.

A production-ready house-price prediction system could be improved in several ways.

## 1. Machine Learning Model

Replace the fixed formula with a trained regression model such as:

* Linear Regression
* Random Forest
* Gradient Boosting
* XGBoost
* Neural Network

The model could be trained using a real house-price dataset.

---

## 2. More Features

The prediction could consider additional information:

```text
Area
Bedrooms
Bathrooms
Floor
Property age
Location
Distance to city center
Parking
Legal status
Furnished/unfurnished
House type
```

---

## 3. Database Integration

A database could store:

* Historical house listings
* User requests
* Prediction results
* Property information

Possible technologies include:

```text
SQLite
PostgreSQL
MySQL
```

---

## 4. Better Validation

The API could enforce business rules such as:

```text
area > 0
bedrooms >= 1
bedrooms <= 20
```

and provide more descriptive error messages.

---

## 5. Production Deployment

The application could eventually be deployed using:

```text
Docker
Cloud platforms
Linux servers
Reverse proxies
HTTPS
```

---

## 6. Authentication

A larger application could introduce:

* User accounts
* Authentication
* Authorization
* API keys
* Rate limiting

These features are outside the scope of this assignment.

---

# 🏗️ Architecture Summary

The final architecture is intentionally simple:

```text
                 Browser
                    │
                    │
        ┌───────────▼───────────┐
        │       Frontend        │
        │   house_form.html     │
        │                       │
        │ HTML + CSS + JS       │
        └───────────┬───────────┘
                    │
                    │ fetch()
                    │
                    ▼
        ┌───────────────────────┐
        │        FastAPI        │
        │                       │
        │    GET /predict       │
        │    POST /predict      │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   predict_price()     │
        │                       │
        │   Fixed Formula       │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │      JSON Response    │
        │                       │
        │ predicted_price       │
        └───────────────────────┘
```

---

# 📝 Conclusion

This project implements a complete mini web application for house-price prediction using FastAPI.

The most important achievement is not the accuracy of the prediction formula, but the successful implementation of the complete request-response pipeline:

```text
HTML Form
   ↓
JavaScript
   ↓
fetch()
   ↓
HTTP Request
   ↓
FastAPI
   ↓
Python Function
   ↓
JSON
   ↓
JavaScript
   ↓
Displayed Result
```

The application also demonstrates FastAPI's automatic validation, Swagger documentation, static file serving, same-origin communication, and the difference between GET query parameters and POST JSON request bodies.

The project therefore provides a practical introduction to connecting a frontend application with a Python backend API and establishes a foundation for more advanced backend and machine-learning applications in future projects.

---

## 👨‍💻 Project Status

**Status:** Completed

**Core Assignment:** ✅ Complete

**Bonus Task:** ⭐ Complete

**Frontend:** ✅ Integrated

**Backend API:** ✅ Working

**Swagger Documentation:** ✅ Available

**Static Frontend Serving:** ✅ Implemented

**Error Handling:** ✅ Implemented

**GET `/predict`:** ✅ Implemented

**POST `/predict`:** ⭐ Implemented

---

> **Note:** This project uses a simplified deterministic pricing formula for educational purposes. It is not intended to represent real-world property valuation or investment advice.
