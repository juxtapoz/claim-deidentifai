from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
from typing import Dict
import json
from processors.edi_parser import EDIParser
from processors.phi_detector import PHIDetector
from processors.deidentifier import Deidentifier

app = FastAPI(title="837 De-identifAI Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://sloveland.pythonanywhere.com",  # Your PythonAnywhere domain
        "http://sloveland.pythonanywhere.com",   # HTTP version
        "https://www.sloveland.pythonanywhere.com", # www subdomain
        "http://localhost:4200",  # For local development
        "http://localhost"        # For local development without port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ProcessingResponse(BaseModel):
    status: str
    message: str
    file_id: str = None
    file_content: str = None
    errors: Dict = None

@app.post("/api/process", response_model=ProcessingResponse)
async def process_edi_file(file: UploadFile = File(...)):
    logger.debug(f"API endpoint called at {app.root_path}")
    try:
        logger.info(f"Received file: {file.filename}")
        if not file.filename.endswith(('.edi', '.txt')):
            logger.warning(f"Invalid file format: {file.filename}")
            raise HTTPException(400, "Invalid file format. Only .edi or .txt files allowed")

        # Read file content
        content = await file.read()
        logger.info(f"File size: {len(content)} bytes")
        
        # Initialize processors
        parser = EDIParser()
        detector = PHIDetector()
        deidentifier = Deidentifier()

        # Process in memory with logging
        try:
            parsed_data = parser.parse(content)
            logger.info(f"Parsed {len(parsed_data)} segments")
        except Exception as e:
            logger.error(f"Parsing error: {str(e)}")
            raise

        try:
            phi_locations = detector.detect_phi(parsed_data)
            logger.info(f"Found PHI in {len(phi_locations)} locations")
        except Exception as e:
            logger.error(f"PHI detection error: {str(e)}")
            raise

        try:
            deidentified_data = deidentifier.deidentify(parsed_data, phi_locations)
            logger.info("De-identification complete")
            logger.debug(f"De-identified data structure: {deidentified_data.keys()}")
        except Exception as e:
            logger.error(f"De-identification error: {str(e)}")
            raise

        # Join the segments back into a file
        deidentified_content = '\n'.join(deidentified_data['segments'])
        
        return ProcessingResponse(
            status="success",
            message="File processed successfully",
            file_id=deidentified_data['id'],
            file_content=deidentified_content
        )

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}", exc_info=True)  # Added stack trace
        raise HTTPException(500, f"Processing error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 