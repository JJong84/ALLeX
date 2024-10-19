from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
from typing import List
import crud

router = APIRouter()

class SubstanceInput(BaseModel):
    substance_name: str
    count: int

class LabCreate(BaseModel):
    lab_name: str
    substances: List[SubstanceInput]

@router.get("/labs/")
def get_labs(db: Session = Depends(get_db)):
    return crud.get_labs(db)

@router.post("/labs/")
def create_lab(lab_data: LabCreate, db: Session = Depends(get_db)):
    return crud.create_lab(db, lab_data.lab_name, lab_data.substances)
