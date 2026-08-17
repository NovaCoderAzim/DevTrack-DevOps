from fastapi.testclient import TestClient


def test_register_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Jane Dev",
            "email": "jane@devtrack.io",
            "password": "securepassword123",
            "role": "DEVELOPER"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "jane@devtrack.io"
    assert "password" not in data


def test_login_user(client: TestClient, test_user):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "testadmin@devtrack.io",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_get_me(client: TestClient, auth_headers):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "testadmin@devtrack.io"
