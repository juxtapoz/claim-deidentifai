import sys
import os
from pathlib import Path

# Add the project directory to Python path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

from src.deidentification_service import app
import uvicorn.workers

# Create ASGI application
application = app