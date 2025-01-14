import regex as re
from typing import List, Dict
import dateutil.parser

class PHIDetector:
    def __init__(self):
        # Common patterns for PHI detection
        self.patterns = {
            'name': r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b',
            'ssn': r'\b\d{3}[-]?\d{2}[-]?\d{4}\b',
            'date': r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b',
            'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            'address': r'\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)\b'
        }

    def detect_phi(self, text_segments: List[str]) -> List[Dict]:
        phi_locations = []
        
        for segment in text_segments:
            current_phi = []
            
            for pattern_type, pattern in self.patterns.items():
                matches = re.finditer(pattern, segment, re.IGNORECASE)
                for match in matches:
                    current_phi.append(match.group())
            
            if current_phi:
                phi_locations.append({
                    'segment': segment,
                    'phi_tokens': list(set(current_phi))
                })
                
        return phi_locations 