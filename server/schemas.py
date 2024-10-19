from pydantic import BaseModel

class LabCreate(BaseModel):
    lab_name: str

class LabResponse(BaseModel):
    id: int
    lab_name: str

    class Config:
        orm_mode = True
