try:
    import cv2
    print("OpenCV imported successfully:", cv2.__version__)
except ImportError as e:
    print("Error importing OpenCV:", str(e))

try:
    import mediapipe as mp
    print("MediaPipe imported successfully:", mp.__version__)
except ImportError as e:
    print("Error importing MediaPipe:", str(e))

try:
    import sklearn
    print("Scikit-learn imported successfully:", sklearn.__version__)
except ImportError as e:
    print("Error importing Scikit-learn:", str(e))

try:
    from PIL import Image
    import PIL
    print("Pillow imported successfully:", PIL.__version__)
except ImportError as e:
    print("Error importing Pillow:", str(e))

import sys
print("\nPython PATH:")
for p in sys.path:
    print(p) 