# ASL Recognition Project

This project uses computer vision to recognize American Sign Language (ASL) alphabet gestures.

## Project Structure

```
C:\Users\legion\Downloads\full_asl_data\       # Data directory
├── asl_alphabet_train/                       # Training data
└── asl_alphabet_test/                        # Test data

C:\Users\legion\Desktop\Programming\Projects\asldraft\asl4draft\  # Code directory
├── asl_sentence_builder.py                    # Creates sentences from recognized ASL gestures
├── create_dataset.py                          # Utility to create the dataset from raw images
├── inference_classifier.py                    # Run inference with the trained model
├── process_asl_data.py                        # Process and prepare the ASL data
└── train_classifier.py                        # Train the ASL recognition model
```

## Setup and Installation

1. Make sure you have Python 3.7+ installed
2. Install required packages:
   ```
   pip install numpy opencv-python tensorflow scikit-learn matplotlib
   ```

## How to Run

1. The data is already organized:
   - Training images in `C:\Users\legion\Downloads\full_asl_data\asl_alphabet_train\`
   - Test images in `C:\Users\legion\Downloads\full_asl_data\asl_alphabet_test\`

2. To train the model, run:
   ```
   cd C:\Users\legion\Desktop\Programming\Projects\asldraft\asl4draft\
   python train_classifier.py
   ```

3. To run inference on test data:
   ```
   cd C:\Users\legion\Desktop\Programming\Projects\asldraft\asl4draft\
   python inference_classifier.py
   ```

4. To build ASL sentences:
   ```
   cd C:\Users\legion\Desktop\Programming\Projects\asldraft\asl4draft\
   python asl_sentence_builder.py
   ```

## Notes

- You may need to update the data paths in the code if they don't match the current locations.
- The Python scripts expect the data to be in specific folders - make sure the paths in the code match the actual locations.
- The training process may take some time depending on your hardware. 