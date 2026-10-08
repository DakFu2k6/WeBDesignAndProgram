def create_team(client, name="Avengers"):
    response = client.post("/teams", json={"name": name, "headquarters": "New York",},)
    assert response.status_code == 201
    return response.json()

def create_hero(client, name="Peter", age=16, team_id=None):
    response = client.post("/heroes", json={"name": name, "age": age, "team_id": team_id, "secret_name": "Spider-Man",},)
    assert response.status_code == 201
    return response.json()

def test_create_hero(client):
    response = client.post("/heroes", json={"name": "Peter", "age": 16, "team_id": None, "secret_name": "Spider-Man",},)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["name"] == "Peter"
    assert data["age"] == 16
    assert data["team_id"] is None
    assert "secret_name" not in data

def test_list_heroes(client):
    create_hero(client, "Peter", 16)
    create_hero(client, "Tony", 45)
    create_hero(client, "Natasha", 35)
    response = client.get("/heroes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]["name"] == "Peter"
    assert data[1]["name"] == "Tony"
    assert data[2]["name"] == "Natasha"

def test_get_hero(client):
    hero = create_hero(client)
    response = client.get(f"/heroes/{hero['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == hero["id"]
    assert data["name"] == "Peter"
    assert "secret_name" not in data

def test_get_unknown_hero_returns_404(client):
    response = client.get("/heroes/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Hero not found"

def test_update_hero(client):
    hero = create_hero(client, "Peter", 16)
    response = client.patch(f"/heroes/{hero['id']}", json={"age": 17,},)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == hero["id"]
    assert data["name"] == "Peter"
    assert data["age"] == 17

def test_partial_update_does_not_overwrite_other_fields(client):
    hero = create_hero(client, "Peter", 16)
    response = client.patch(f"/heroes/{hero['id']}", json={"age": 17,},)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Peter"
    assert data["age"] == 17

def test_update_unknown_hero_returns_404(client):
    response = client.patch("/heroes/999999", json={"age": 20,},)
    assert response.status_code == 404
    assert response.json()["detail"] == "Hero not found"

def test_delete_hero(client):
    hero = create_hero(client)
    response = client.delete(f"/heroes/{hero['id']}")
    assert response.status_code == 204
    response = client.get(f"/heroes/{hero['id']}")
    assert response.status_code == 404

def test_delete_unknown_hero_returns_404(client):
    response = client.delete("/heroes/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Hero not found"

def test_filter_by_min_age(client):
    create_hero(client, "Peter", 16)
    create_hero(client, "Tony", 45)
    create_hero(client, "Natasha", 35)
    response = client.get("/heroes?min_age=18")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {hero["name"] for hero in data} == {"Tony", "Natasha"}

def test_filter_by_team_id(client):
    avengers = create_team(client, "Avengers")
    xmen = create_team(client, "X-Men")
    create_hero(client, "Tony", 45, avengers["id"])
    create_hero(client, "Natasha", 35, avengers["id"])
    create_hero(client, "Logan", 150, xmen["id"])
    response = client.get(f"/heroes?team_id={avengers['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {hero["name"] for hero in data} == {"Tony", "Natasha",}

def test_filter_by_name(client):
    create_hero(client, "Tony", 45)
    create_hero(client, "Tony Stark", 45)
    create_hero(client, "Natasha", 35)
    response = client.get("/heroes?name=ton")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {hero["name"] for hero in data} == {"Tony", "Tony Stark",}

def test_combined_filters(client):
    avengers = create_team(client)
    create_hero(client, "Tony", 45, avengers["id"])
    create_hero(client, "Natasha", 35, avengers["id"])
    create_hero(client, "Peter", 16, avengers["id"])
    response = client.get(f"/heroes?min_age=40&team_id={avengers['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Tony"

def test_create_hero_with_unknown_team_returns_404(client):
    response = client.post("/heroes", json={"name": "Unknown Hero", "age": 20, "team_id": 999999, "secret_name": "Unknown",},)
    assert response.status_code == 404
    assert response.json()["detail"] == "Team not found"