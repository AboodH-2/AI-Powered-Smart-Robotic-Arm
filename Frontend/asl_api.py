from flask import Flask, request, jsonify
import sys
import os
import subprocess
import threading
import time
import json
import base64
import numpy as np
import cv2
import pickle
import mediapipe as mp
from flask_cors import CORS

# This API provides endpoints for ASL detection directly from camera frames
# It now uses the exact same detection code as the working standalone application
# from ASL_Detection/sign-language-detector-python-master/asl_sentence_builder.py

# Add ASL_Detection to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ASL_Detection', 'sign-language-detector-python-master'))

# Global variables for ASL detection
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

# Current detection state
current_sign = None
detection_active = False
detection_thread = None
model = None
le = None
class_mapping = {}

# Load ASL detection model - exact same code as in ASL_Detection
def load_model():
    global model, le, class_mapping
    try:
        print("Loading model...")
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, '..', 'ASL_Detection', 'sign-language-detector-python-master', 'model.p')
        print(f"Loading model from: {model_path}")
        model_dict = pickle.load(open(model_path, 'rb'))
        model = model_dict['model']
        le = model_dict.get('label_encoder', None)
        
        # Read class mapping from file
        class_mapping_path = os.path.join(current_dir, '..', 'ASL_Detection', 'sign-language-detector-python-master', 'data', 'class_mapping.txt')
        print(f"Looking for class mapping at: {class_mapping_path}")
        if os.path.exists(class_mapping_path):
            with open(class_mapping_path, 'r') as f:
                for line in f:
                    idx, label = line.strip().split(':', 1)
                    class_mapping[int(idx)] = label.strip()
            print(f"Loaded {len(class_mapping)} classes from mapping file")
        else:
            print("Warning: No class mapping file found")
            # Fallback default mapping
            class_mapping = {0: 'A', 1: 'B', 2: 'C'}
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

# Process image for ASL detection - using the exact same algorithm as ASL_Detection
def process_image(image_data):
    global model, le, class_mapping, hands
    
    try:
        # Variables to store the landmark coordinates
        data_aux = []
        x_ = []
        y_ = []
        
        # Process with MediaPipe Hands
        results = hands.process(image_data)
        
        if not results.multi_hand_landmarks:
            return None  # No hands detected
        
        # Extract landmark coordinates - exact same process as in ASL_Detection
        for hand_landmarks in results.multi_hand_landmarks:
            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y
                
                x_.append(x)
                y_.append(y)
            
            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y
                data_aux.append(x - min(x_))
                data_aux.append(y - min(y_))
        
        # Ensure data has the right shape for the model - exact same code as ASL_Detection
        if hasattr(model, 'n_features_in_'):
            max_length = model.n_features_in_
        else:
            max_length = 21 * 2 * 2  # 21 landmarks, x and y, normalized coordinates
        
        # Pad or trim data - exact same code as ASL_Detection
        if len(data_aux) < max_length:
            data_aux = data_aux + [0.0] * (max_length - len(data_aux))
        elif len(data_aux) > max_length:
            data_aux = data_aux[:max_length]
        
        # Make prediction using the exact same approach as ASL_Detection
        prediction = model.predict([np.asarray(data_aux)])
        prediction_index = int(prediction[0])
        
        # Get the prediction based on model output - exact same code as ASL_Detection
        if le is not None:
            original_label = le.inverse_transform([prediction_index])[0]
            detected_sign = class_mapping.get(int(original_label), f"Unknown ({original_label})")
        else:
            detected_sign = class_mapping.get(prediction_index, f"Unknown ({prediction_index})")
            
        print(f"Detected sign: {detected_sign} (index: {prediction_index})")
        return detected_sign
    except Exception as e:
        print(f"Error processing image: {e}")
        import traceback
        traceback.print_exc()
        return None

# Setup Flask app with CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# Legacy function - no longer used, remove in future versions
def run_asl_detection():
    global detection_active, current_sign
    
    try:
        while detection_active:
            time.sleep(1)
            import random
            signs = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
                    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "SPACE", "DELETE"]
            current_sign = random.choice(signs)
            print(f"Simulated sign: {current_sign}")
    except Exception as e:
        print(f"Error in ASL detection thread: {e}")
        detection_active = False

# Legacy endpoint - no longer needed but kept for backwards compatibility
@app.route('/start_detection', methods=['POST', 'OPTIONS'])
def start_detection():
    """Start the ASL detection process."""
    global detection_active, detection_thread
    
    if request.method == 'OPTIONS':
        return '', 200
    
    if detection_active:
        return jsonify({"status": "already_running"})
    
    detection_active = True
    detection_thread = threading.Thread(target=run_asl_detection)
    detection_thread.daemon = True
    detection_thread.start()
    
    print("Detection started")
    return jsonify({"status": "started"})

# Legacy endpoint - no longer needed but kept for backwards compatibility
@app.route('/stop_detection', methods=['POST', 'OPTIONS'])
def stop_detection():
    """Stop the ASL detection process."""
    global detection_active
    
    if request.method == 'OPTIONS':
        return '', 200
    
    if not detection_active:
        return jsonify({"status": "not_running"})
    
    detection_active = False
    print("Detection stopped")
    return jsonify({"status": "stopped"})

# Legacy endpoint - no longer needed but kept for backwards compatibility
@app.route('/get_current_sign', methods=['GET'])
def get_current_sign():
    """Get the current detected sign."""
    global current_sign
    
    if not detection_active:
        return jsonify({"status": "detection_not_active", "sign": None})
    
    print(f"Returning sign: {current_sign}")
    return jsonify({"status": "success", "sign": current_sign})

@app.route('/process_frame', methods=['POST', 'OPTIONS'])
def process_frame():
    """Process a single frame from the web app camera using the ASL_Detection logic."""
    if request.method == 'OPTIONS':
        return '', 200
    
    # Check if model is loaded
    global model, current_sign
    if model is None:
        if not load_model():
            return jsonify({"status": "error", "message": "Failed to load ASL detection model"})
    
    try:
        # Get the image data from the request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({"status": "error", "message": "No image data provided"})
        
        # Decode the base64 image
        image_b64 = data['image'].split(',')[1] if ',' in data['image'] else data['image']
        image_bytes = base64.b64decode(image_b64)
        image_np = np.frombuffer(image_bytes, dtype=np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        
        # Flip the image horizontally for more intuitive interaction (same as in ASL_Detection)
        image = cv2.flip(image, 1)
        
        # Convert to RGB for MediaPipe
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Process the image with the exact same code as ASL_Detection
        detected_sign = process_image(image_rgb)
        
        if detected_sign:
            # Update the current_sign so it can be accessed by get_current_sign endpoint
            current_sign = detected_sign
            print(f"Detected sign: {detected_sign}")
            return jsonify({"status": "success", "sign": detected_sign})
        else:
            return jsonify({"status": "no_hand_detected", "sign": None})
    
    except Exception as e:
        print(f"Error processing frame: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)})

# Deprecated - this functionality is now handled by the frontend camera
@app.route('/launch_asl_app', methods=['POST', 'OPTIONS'])
def launch_asl_app():
    """This endpoint is deprecated. ASL detection is now done via the API."""
    if request.method == 'OPTIONS':
        return '', 200
        
    return jsonify({
        "status": "deprecated", 
        "message": "The standalone app is deprecated. ASL detection is now handled through the API."
    })

@app.route('/', methods=['GET'])
def index():
    """Root endpoint to check if API is running."""
    return jsonify({"status": "API is running"})

if __name__ == '__main__':
    # Load model on startup
    load_model()
    
    # Run the app with CORS enabled
    app.run(host='0.0.0.0', port=5000, debug=True) 