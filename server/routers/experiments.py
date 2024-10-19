from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Experiment, Substance
from pydantic import BaseModel

router = APIRouter()

# Pydantic model for adding a new experiment
class ExperimentCreate(BaseModel):
    substance_name1: str
    substance_name2: str
    color_change: str
    explosion: int  # should be between 0 and 10

# GET: Fetch the experiment result
@router.get("/experiments/")
def get_reaction(substance_name1: str, substance_name2: str, db: Session = Depends(get_db)):
    substance1 = db.query(Substance).filter(Substance.substance_name == substance_name1).first()
    if not substance1:
        raise HTTPException(status_code=404, detail=f"Substance '{substance_name1}' not found")

    substance2 = db.query(Substance).filter(Substance.substance_name == substance_name2).first()
    if not substance2:
        raise HTTPException(status_code=404, detail=f"Substance '{substance_name2}' not found")

    experiment = db.query(Experiment).filter(
        Experiment.substance_id1 == substance1.substance_id,
        Experiment.substance_id2 == substance2.substance_id
    ).first()

    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found between the two substances")

    return {
        "color_change": experiment.color_change,
        "explosion": experiment.explosion
    }

# POST: Add a new experiment
@router.post("/experiments/")
def add_experiment(experiment_data: ExperimentCreate, db: Session = Depends(get_db)):
    # Get substance_id1 from substance_name1
    substance1 = db.query(Substance).filter(Substance.substance_name == experiment_data.substance_name1).first()
    if not substance1:
        raise HTTPException(status_code=404, detail=f"Substance '{experiment_data.substance_name1}' not found")

    # Get substance_id2 from substance_name2
    substance2 = db.query(Substance).filter(Substance.substance_name == experiment_data.substance_name2).first()
    if not substance2:
        raise HTTPException(status_code=404, detail=f"Substance '{experiment_data.substance_name2}' not found")

    # Check if the experiment already exists
    existing_experiment = db.query(Experiment).filter(
        Experiment.substance_id1 == substance1.substance_id,
        Experiment.substance_id2 == substance2.substance_id
    ).first()

    if existing_experiment:
        raise HTTPException(status_code=400, detail="Experiment already exists between these two substances")

    # Insert the new experiment
    new_experiment = Experiment(
        substance_id1=substance1.substance_id,
        substance_id2=substance2.substance_id,
        color_change=experiment_data.color_change,
        explosion=experiment_data.explosion
    )

    db.add(new_experiment)
    db.commit()
    db.refresh(new_experiment)

    return {
        "message": "Experiment added successfully",
        "color_change": new_experiment.color_change,
        "explosion": new_experiment.explosion
    }
