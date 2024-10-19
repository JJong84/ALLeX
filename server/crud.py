from sqlalchemy.orm import Session
from models import Lab, Substance, LabInventory
from typing import List

# CRUD functions for each table

def get_labs(db: Session):
    return db.query(Lab).all()

def create_lab(db: Session, lab_name: str, substances: List):
    # Step 1: Create the lab
    new_lab = Lab(lab_name=lab_name)
    db.add(new_lab)
    db.commit()
    db.refresh(new_lab)  # Get the new lab ID after commit

    # Step 2: For each substance, check if it exists and add it to the lab_inventory
    for substance_data in substances:
        # Access the substance_name and count directly from the Pydantic object
        substance = db.query(Substance).filter(Substance.substance_name == substance_data.substance_name).first()
        
        if not substance:
            # Create the substance if it doesn't exist
            substance = Substance(substance_name=substance_data.substance_name)
            db.add(substance)
            db.commit()
            db.refresh(substance)  # Get the new substance ID

        # Step 3: Add the substance and its count to the lab_inventory table
        new_inventory = LabInventory(
            lab_id=new_lab.id,
            substance_id=substance.substance_id,
            count=substance_data.count  # Access count directly
        )
        db.add(new_inventory)

    # Commit the changes to the inventory
    db.commit()

    return {
        "lab_name": new_lab.lab_name,
        "substances": [{"substance_name": s.substance_name, "count": s.count} for s in substances]
    }
