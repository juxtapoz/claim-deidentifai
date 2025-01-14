import uuid
from datetime import datetime
import regex as re

class Deidentifier:
    def __init__(self):
        self.token_map = {}
        
    def deidentify(self, segments, phi_locations):
        deidentified_segments = segments.copy()
        
        for phi_loc in phi_locations:
            segment = phi_loc['segment']
            phi_tokens = phi_loc['phi_tokens']
            
            for token in phi_tokens:
                if token not in self.token_map:
                    # Determine type of PHI for better token generation
                    token_type = self._determine_token_type(token)
                    self.token_map[token] = self._generate_token(token_type)
                
                # Replace in segment
                segment = segment.replace(token, self.token_map[token])
                
        return {
            'id': str(uuid.uuid4()),
            'segments': deidentified_segments,
            'processed_at': datetime.utcnow().isoformat()
        }
        
    def _generate_token(self, token_type: str) -> str:
        """Generate HIPAA-compliant replacement token"""
        return f"{token_type}_{uuid.uuid4().hex[:8]}"
        
    def _determine_token_type(self, token: str) -> str:
        """Determine type of PHI for appropriate replacement"""
        if re.match(r'\b\d{3}[-]?\d{2}[-]?\d{4}\b', token):
            return 'SSN'
        elif re.match(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', token):
            return 'PHONE'
        elif re.match(r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b', token):
            return 'DATE'
        elif re.match(r'\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)\b', token):
            return 'ADDR'
        else:
            return 'NAME'  # Default to NAME for unrecognized patterns 