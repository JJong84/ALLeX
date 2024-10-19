from sqlalchemy.orm import Session
from models import Lab, Substance, LabInventory
from typing import List

# CRUD functions for each table

def get_labs(db: Session):
    return db.query(Lab).all()

def create_lab(db: Session, lab_name: str, goal: str, substances: List):
    # Step 1: Create the lab with the goal
    new_lab = Lab(lab_name=lab_name, goal=goal)
    db.add(new_lab)
    db.commit()
    db.refresh(new_lab)  # Make sure to refresh to get the auto-generated id
    
    # Step 2: For each substance, check if it exists and add it to the lab_inventory
    for substance_data in substances:
        substance = db.query(Substance).filter(Substance.substance_name == substance_data.substance_name).first()
        if not substance:
            # Create the substance if it doesn't exist
            substance = Substance(substance_name=substance_data.substance_name)
            db.add(substance)
            db.commit()
            db.refresh(substance)  # Get the new substance ID

        # Step 3: Add the substance and its details to the lab_inventory table
        new_inventory = LabInventory(
            lab_id=new_lab.id,
            substance_id=substance.substance_id,
            x=substance_data.x,
            y=substance_data.y,
            case_type=substance_data.case_type
        )
        db.add(new_inventory)

    # Commit the changes to the inventory
    db.commit()

    # Return the new lab with its id, lab_name, and goal
    return new_lab
