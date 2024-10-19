from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import labs, experiments, inventory, substances
from database import engine
from models import Base

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware to allow specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://b1c6-210-218-207-6.ngrok-free.app"],  # Explicitly allow origins
    allow_credentials=True,  # Allow credentials
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Create the database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(labs.router)
app.include_router(experiments.router)
app.include_router(inventory.router)
app.include_router(substances.router)
