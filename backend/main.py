"""
FastAPI Entry Point for DAWN AI RAG Service.
Run with:
    uvicorn main:app --reload --port 8000
or:
    python main.py
"""

import uvicorn
from app.main import app, create_application
from app.core.config import get_settings

settings = get_settings()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
