from contextlib import contextmanager
from . import database

@contextmanager
def get_db():
    db = database.SessionLocal()
    try:
        yield db
        db.commit()
    except:
        db.rollback()
        raise
    finally:
        db.close()
