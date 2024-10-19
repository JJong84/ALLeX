from fastapi import FastAPI
from routers import labs, experiments, inventory, substances
from database import engine
from models import Base

# Initialize FastAPI
app = FastAPI()

# Create the database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(labs.router)
app.include_router(experiments.router)
app.include_router(inventory.router)
app.include_router(substances.router)
