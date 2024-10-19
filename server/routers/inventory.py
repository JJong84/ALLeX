from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import LabInventory

router = APIRouter()

@router.get("/labs/{lab_id}/substances")
def get_substances_in_lab(lab_id: int, db: Session = Depends(get_db)):
    inventory = db.query(LabInventory).filter(LabInventory.lab_id == lab_id).all()
    return inventory
