from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Lab(Base):
    __tablename__ = "labs"
    id = Column(Integer, primary_key=True, index=True)
    lab_name = Column(String(255), unique=True, index=True)
    goal = Column(String(255)) 
    
class Substance(Base):
    __tablename__ = "substances"
    substance_id = Column(Integer, primary_key=True, index=True)
    substance_name = Column(String(255), unique=True, index=True)

class Experiment(Base):
    __tablename__ = "experiments"
    substance_id1 = Column(Integer, ForeignKey("substances.substance_id"), primary_key=True)
    substance_id2 = Column(Integer, ForeignKey("substances.substance_id"), primary_key=True)
    color_change = Column(String(255))
    explosion = Column(Integer)

class LabInventory(Base):
    __tablename__ = "lab_inventory"
    entity_id = Column(Integer, primary_key=True, autoincrement=True)
    lab_id = Column(Integer, ForeignKey("labs.id"))
    substance_id = Column(Integer, ForeignKey("substances.substance_id"))
    x = Column(Integer)  # X-coordinate for location
    y = Column(Integer)  # Y-coordinate for location
    case_type = Column(String(255))  # Type of container (e.g., flask, vial)
