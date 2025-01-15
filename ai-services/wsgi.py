import sys
import os

# Add the ai-services directory to Python path
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.append(path)

from src.deidentification_service import app

# Create WSGI application
application = app