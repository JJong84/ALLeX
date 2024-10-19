from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Substance

router = APIRouter()

@router.get("/substances/")
def get_substances(db: Session = Depends(get_db)):
    return db.query(Substance).all()
