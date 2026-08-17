from fastapi.testclient import TestClient


def test_issue_lifecycle(client: TestClient, auth_headers):
    # 1. Create Project first
    proj_resp = client.post(
        "/api/v1/projects/",
        json={
            "name": "Frontend Web App",
            "key": "FWA",
            "description": "React TypeScript Web App"
        },
        headers=auth_headers
    )
    assert proj_resp.status_code == 201
    proj_id = proj_resp.json()["id"]

    # 2. Create Issue
    issue_resp = client.post(
        "/api/v1/issues/",
        json={
            "title": "Fix Navigation Header Alignment",
            "description": "Ensure navigation links are aligned to the right.",
            "status": "TODO",
            "priority": "HIGH",
            "project_id": proj_id
        },
        headers=auth_headers
    )
    assert issue_resp.status_code == 201
    issue_data = issue_resp.json()
    assert issue_data["title"] == "Fix Navigation Header Alignment"
    assert issue_data["issue_key"].startswith("FWA-")
    issue_id = issue_data["id"]

    # 3. Update Issue Status to IN_PROGRESS
    update_resp = client.put(
        f"/api/v1/issues/{issue_id}",
        json={"status": "IN_PROGRESS"},
        headers=auth_headers
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "IN_PROGRESS"

    # 4. Add Comment
    comment_resp = client.post(
        f"/api/v1/issues/{issue_id}/comments",
        json={"content": "Working on this header alignment fix now."},
        headers=auth_headers
    )
    assert comment_resp.status_code == 201
    assert comment_resp.json()["content"] == "Working on this header alignment fix now."

    # 5. Get Dashboard Stats
    stats_resp = client.get("/api/v1/stats/dashboard", headers=auth_headers)
    assert stats_resp.status_code == 200
    assert stats_resp.json()["total_issues"] >= 1
