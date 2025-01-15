class EDIParser:
    def __init__(self):
        self.segment_terminators = ['~', '\n']
        self.element_separator = '*'
        
    def parse(self, content: bytes) -> list:
        text = content.decode('utf-8')
        segments = []
        
        # Split into segments
        current_segment = ''
        for char in text:
            current_segment += char
            if char in self.segment_terminators:
                if current_segment.strip():
                    segments.append(current_segment.strip())
                current_segment = ''
                
        return segments 