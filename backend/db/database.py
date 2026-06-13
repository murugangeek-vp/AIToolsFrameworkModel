import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/aitools")

# Try to create the engine for the configured DATABASE_URL. If the required
# DB driver (e.g., psycopg2) is not installed or connection fails at import
# time, fall back to a local SQLite file to allow local runs and tests.
try:
    engine = create_engine(DATABASE_URL)
except Exception as e:
    fallback_path = os.path.join(os.path.dirname(__file__), '..', 'backend_fallback.db')
    fallback_url = f"sqlite:///{os.path.abspath(fallback_path)}"
    engine = create_engine(fallback_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
