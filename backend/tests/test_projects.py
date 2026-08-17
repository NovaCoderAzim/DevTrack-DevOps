from fastapi.testclient import TestClient


def test_create_and_list_projects(client: TestClient, auth_headers):
    # Create Project
    response = client.post(
        "/api/v1/projects/",
        json={
            "name": "DevTrack Core API",
            "key": "DTC",
            "description": "Core FastAPI backend service"
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "DevTrack Core API"
    assert data["key"] == "DTC"
    project_id = data["id"]

    # List Projects
    list_resp = client.get("/api/v1/projects/", headers=auth_headers)
    assert list_resp.status_code == 200
    projects = list_resp.json()
    assert any(p["id"] == project_id for p in projects)
