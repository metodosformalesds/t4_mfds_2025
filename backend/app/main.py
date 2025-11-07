from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
from api.routes import users

# Crear tablas en RDS
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Reborn API",
    description="Backend para plataforma de artesanías mexicanas",
    version="1.."
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclir roters
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

@app.get("/")
async def root():
    return {"message": "Reborn API Rnning", "version": "1.."}

@app.get("/health")
async def health_check():
    return {"stats": "healthy", "database": "connected"}