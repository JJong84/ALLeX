from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import LabInventory, Substance, Lab

router = APIRouter()

@router.get("/labs/{lab_id}/substances")
def get_substances_in_lab(lab_id: int, db: Session = Depends(get_db)):
    # Ensure the lab exists
    lab = db.query(Lab).filter(Lab.id == lab_id).first()
    if not lab:
        raise HTTPException(status_code=404, detail=f"Lab with id {lab_id} not found")

    # Fetch all entities in the lab
    inventory = db.query(LabInventory, Substance).join(Substance).filter(LabInventory.lab_id == lab_id).all()

    if not inventory:
        raise HTTPException(status_code=404, detail=f"No substances found in lab with id {lab_id}")

    # Prepare the response
    result = {
        "lab_id": lab.id,
        "lab_name": lab.lab_name,
        "substances": []
    }
    
    for item in inventory:
        entity = item[0]
        substance = item[1]
        result["substances"].append({
            "entity_id": entity.entity_id,
            "substance_name": substance.substance_name,
            "x": entity.x,
            "y": entity.y,
            "case_type": entity.case_type
        })

    return result
