def create_team(client, name="Avengers", headquarters="New York"):
    response = client.post("/teams", json={"name": name, "headquarters": headquarters,},)
    assert response.status_code == 201
    return response.json()

def create_hero(client, name, age, team_id):
    response = client.post("/heroes", json={"name": name, "age": age, "team_id": team_id, "secret_name": f"Secret {name}",},)
    assert response.status_code == 201
    return response.json()

def test_create_team(client):
    response = client.post("/teams", json={"name": "Avengers", "headquarters": "New York",},)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["name"] == "Avengers"
    assert data["headquarters"] == "New York"

def test_list_teams(client):
    create_team(client, "Avengers", "New York")
    create_team(client, "X-Men", "Westchester")
    response = client.get("/teams")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "Avengers"
    assert data[1]["name"] == "X-Men"

def test_duplicate_team_returns_409(client):
    create_team(client, "Avengers", "New York")
    response = client.post("/teams", json={"name": "Avengers", "headquarters": "Los Angeles",},)
    assert response.status_code == 409
    assert response.json()["detail"] == "Team name already exists"

def test_get_team_heroes(client):
    team = create_team(client, "Avengers")
    create_hero(client, "Tony", 45, team["id"],)
    create_hero(client, "Natasha", 35, team["id"],)
    response = client.get(f"/teams/{team['id']}/heroes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {hero["name"] for hero in data} == {"Tony", "Natasha",}

def test_team_without_heroes_returns_empty_list(client):
    team = create_team(client)
    response = client.get(f"/teams/{team['id']}/heroes")
    assert response.status_code == 200
    assert response.json() == []

def test_unknown_team_returns_404(client):
    response = client.get("/teams/999999/heroes")
    assert response.status_code == 404
    assert response.json()["detail"] == "Team not found"

def test_heroes_from_different_teams_are_separated(client):
    avengers = create_team(client, "Avengers", "New York",)
    xmen = create_team(client, "X-Men", "Westchester",)
    create_hero(client, "Tony", 45, avengers["id"],)
    create_hero(client, "Logan", 150, xmen["id"],)
    response = client.get(f"/teams/{avengers['id']}/heroes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Tony"
    response = client.get(f"/teams/{xmen['id']}/heroes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Logan"