from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Experiment, Substance

router = APIRouter()

@router.get("/experiments/")
def get_reaction(substance_name1: str, substance_name2: str, db: Session = Depends(get_db)):
    # Get substance_id1 from substance_name1
    substance1 = db.query(Substance).filter(Substance.substance_name == substance_name1).first()
    if not substance1:
        raise HTTPException(status_code=404, detail=f"Substance '{substance_name1}' not found")

    # Get substance_id2 from substance_name2
    substance2 = db.query(Substance).filter(Substance.substance_name == substance_name2).first()
    if not substance2:
        raise HTTPException(status_code=404, detail=f"Substance '{substance_name2}' not found")

    # Find the reaction in the experiments table
    experiment = db.query(Experiment).filter(
        Experiment.substance_id1 == substance1.substance_id,
        Experiment.substance_id2 == substance2.substance_id
    ).first()

    if not experiment:
        raise HTTPException(status_code=404, detail="Reaction not found between the two substances")

    return experiment.reaction
