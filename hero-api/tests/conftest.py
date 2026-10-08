import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel, Session, create_engine
from app.database import get_session
from app.main import app
import app.main as main_module

@pytest.fixture()
def test_engine():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool,)
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)

@pytest.fixture()
def client(test_engine):
    def override_get_session():
        with Session(test_engine) as session:
            yield session
    app.dependency_overrides[get_session] = override_get_session
    original_engine = main_module.engine
    main_module.engine = test_engine
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        main_module.engine = original_engine
        app.dependency_overrides.clear()