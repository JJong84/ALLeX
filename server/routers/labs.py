from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from typing import List  # <-- Add this import for List
import crud
from schemas import LabCreate, LabResponse  # Importing the Pydantic models from schemas

router = APIRouter()

# Endpoint to get all labs
@router.get("/labs/", response_model=List[LabResponse])  # Define the response model
def get_labs(db: Session = Depends(get_db)):
    labs = crud.get_labs(db)
    if not labs:
        raise HTTPException(status_code=404, detail="No labs found")
    return labs

# Endpoint to create a lab
@router.post("/labs/", response_model=LabResponse)  # Define the response model
def create_lab(lab_data: LabCreate, db: Session = Depends(get_db)):
    # Call the CRUD function to handle lab creation
    new_lab = crud.create_lab(db, lab_data.lab_name, lab_data.goal, lab_data.substances)
    
    # Return the newly created lab as a response
    return new_lab
