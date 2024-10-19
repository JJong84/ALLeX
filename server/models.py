from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Lab(Base):
    __tablename__ = "labs"
    id = Column(Integer, primary_key=True, index=True)
    lab_name = Column(String(255), unique=True, index=True)

class Substance(Base):
    __tablename__ = "substances"
    substance_id = Column(Integer, primary_key=True, index=True)
    substance_name = Column(String(255), unique=True, index=True)

class Experiment(Base):
    __tablename__ = "experiments"
    substance_id1 = Column(Integer, ForeignKey("substances.substance_id"), primary_key=True)
    substance_id2 = Column(Integer, ForeignKey("substances.substance_id"), primary_key=True)
    reaction = Column(Text)

class LabInventory(Base):
    __tablename__ = "lab_inventory"
    lab_id = Column(Integer, ForeignKey("labs.id"), primary_key=True)
    substance_id = Column(Integer, ForeignKey("substances.substance_id"), primary_key=True)
    count = Column(Integer)
