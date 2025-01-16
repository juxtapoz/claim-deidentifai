import os
import sys

# Add the project root and ai_services to the Python path
project_home = '/home/sloveland/claim-deidentifai'
ai_services_path = os.path.join(project_home, 'ai_services')
if project_home not in sys.path:
    sys.path.insert(0, project_home)
if ai_services_path not in sys.path:
    sys.path.insert(0, ai_services_path)

from src.deidentification_service import app
import uvicorn.middleware.wsgi

# Create WSGI application
application = app