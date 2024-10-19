from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Substance
from pydantic import BaseModel

router = APIRouter()

class SubstanceCreate(BaseModel):
    substance_name: str
    
@router.get("/substances/")
def get_substances(db: Session = Depends(get_db)):
    return db.query(Substance).all()

# POST route to add a new substance
@router.post("/substances/")
def create_substance(substance: SubstanceCreate, db: Session = Depends(get_db)):
    # Check if the substance already exists
    db_substance = db.query(Substance).filter(Substance.substance_name == substance.substance_name).first()
    if db_substance:
        raise HTTPException(status_code=400, detail="Substance already exists")

    # Create a new substance
    new_substance = Substance(substance_name=substance.substance_name)
    db.add(new_substance)
    db.commit()
    db.refresh(new_substance)
    
    return {"substance_id": new_substance.substance_id, "substance_name": new_substance.substance_name}
