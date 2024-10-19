from pydantic import BaseModel
from typing import List
from typing import Optional

class SubstanceInput(BaseModel):
    substance_name: str
    x: int
    y: int
    case_type: str

class LabCreate(BaseModel):
    lab_name: str
    goal: str  # Add this field to include the goal of the lab
    substances: List[SubstanceInput]

class LabResponse(BaseModel):
    id: int
    lab_name: str
    goal: Optional[str]  # Make the goal field optional to allow None values

    class Config:
        orm_mode = True