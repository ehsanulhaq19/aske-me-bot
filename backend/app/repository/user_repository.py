from app.models.user import User, TYPE_ADMIN, TYPE_USER, TYPE_BOT
from app.schemas.user import UserCreate, UserOut, UserOutExtended
from app.core.security import hash_password
from app.db.session import get_db

def get_user_by_email(email: str):
    with get_db() as db:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        return UserOutExtended.from_orm(user)

def create_user(user: UserCreate):
    with get_db() as db:
        db_user = User(
            name=user.name,
            email=user.email,
            hashed_password=hash_password(user.password)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return UserOut.from_orm(db_user)

def delete_user(user_id: int):
    with get_db() as db:
        user = db.query(User).get(user_id)
        if user:
            db.delete(user)
            db.commit()
        return True

def create_admin_user(user: UserCreate):
    with get_db() as db:
        admin_email = user.email
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                name=user.name,
                email=user.email,
                hashed_password=hash_password(user.password),
                type=TYPE_ADMIN
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
        return UserOut.from_orm(admin)
    
def is_admin_user(user: UserOut):
    return user.type == TYPE_ADMIN if user else False

def is_normal_user(user: UserOut):
    return user.type == TYPE_USER if user else False

def is_bot_user(user: UserOut):
    return user.type == TYPE_BOT if user else False

def is_admin_or_normal_user(user: UserOut):
    return is_admin_user(user) or is_normal_user(user)