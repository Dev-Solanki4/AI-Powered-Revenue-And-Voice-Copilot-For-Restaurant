# ==========================================
# PetPooja Backend - FastAPI Application
# ==========================================

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from database import init_db, close_db
from redis_client import init_redis, close_redis
from routes.auth_routes import router as auth_router
from routes.menu_routes import router as menu_router
from routes.table_routes import router as table_router
from routes.inventory_routes import router as inventory_router
from routes.order_routes import router as order_router
from routes.dashboard_routes import router as dashboard_router
from routes.heatmap_routes import router as heatmap_router
from routes.customer_routes import router as customer_router
from routes.analytics_routes import router as analytics_router
from routes.recipe_routes import router as recipe_router


# ==========================================
# Lifespan: startup / shutdown
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Connecting to PostgreSQL...")
    await init_db()
    print("✅ PostgreSQL connected.")

    print("🔗 Connecting to Redis...")
    await init_redis()
    print("✅ Redis connected.")

    yield

    # Shutdown
    print("🔌 Closing connections...")
    await close_db()
    await close_redis()
    print("✅ All connections closed.")


# ==========================================
# FastAPI App
# ==========================================
app = FastAPI(
    title="PetPooja API",
    description="Secure backend API for PetPooja Restaurant POS",
    version="1.0.0",
    lifespan=lifespan,
)

# ==========================================
# CORS Middleware
# ==========================================
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins],
    allow_credentials=True,       # Required for HTTPOnly cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Routers
# ==========================================
app.include_router(auth_router)
app.include_router(menu_router)
app.include_router(table_router)
app.include_router(inventory_router)
app.include_router(order_router)
app.include_router(dashboard_router)
app.include_router(heatmap_router)
app.include_router(customer_router)
app.include_router(analytics_router)
app.include_router(recipe_router)


# ==========================================
# Health Check
# ==========================================
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "petpooja-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
