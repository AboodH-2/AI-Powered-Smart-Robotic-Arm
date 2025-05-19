# Capstone Project: Interactive Sign Language Recognition System

This capstone project implements a comprehensive sign language recognition system that combines real-time American Sign Language (ASL) detection with an interactive web interface. The project showcases the integration of computer vision, machine learning, and modern web technologies to create an accessible and user-friendly sign language learning and recognition tool.

## Project Overview

The project consists of two main components:

### 1. ASL Detection System
- Real-time American Sign Language recognition using webcam input
- Powered by MediaPipe for accurate hand landmark detection
- Machine learning implementation using RandomForest classifier
- Modern web interface built with Next.js for seamless user experience
- Flask backend API for efficient sign language processing

### 2. Rock Paper Scissors Game (Coming Soon)
- Interactive game implementation using hand gestures
- Real-time gesture recognition for gaming
- Score tracking and game statistics
- Educational component for learning basic hand signs
- Integration with the main ASL detection system

## Features

### ASL Detection
- Real-time ASL detection through webcam
- Modern web interface built with Next.js
- Flask backend API for sign language processing
- Support for special signs (space, delete)
- Manual text input option
- 75% camera view for optimal detection
- 4-second interval detection system

### Upcoming RPS Game Features
- Real-time rock, paper, scissors gesture recognition
- Player vs Computer gameplay
- Interactive scoring system
- Practice mode for learning gestures
- Performance statistics and analytics

## Project Structure

```
.
├── Frontend/           # Next.js web application
├── ASL_Detection/      # Core ASL detection logic and models
├── RPS/               # Rock Paper Scissors game implementation (Coming Soon)
├── start_project.bat   # Windows startup script
├── start_asl_app.bat   # ASL application startup
├── install_packages.bat # Package installation script
└── run_asl.bat         # ASL runtime script
```

## Prerequisites

- Python 3.8 or higher
- Node.js 14.x or higher
- Webcam access
- Windows 10 (for .bat scripts)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AboodH-2/Capstone-Project.git
   cd Capstone-Project
   ```

2. Install Python dependencies:
   ```bash
   install_packages.bat
   ```

3. Install Frontend dependencies:
   ```bash
   cd Frontend
   npm install
   ```

## Running the Application

1. Start the application using the provided batch script:
   ```bash
   start_project.bat
   ```

   This will:
   - Start the Flask backend server
   - Launch the Next.js frontend
   - Open the application in your default browser

## Technical Implementation

### ASL Detection System
- **Frontend**: Next.js application with real-time webcam integration
- **Backend**: Flask API server handling image processing and sign detection
- **ML Model**: RandomForest classifier trained on hand landmark data
- **Computer Vision**: MediaPipe for accurate hand tracking and landmark detection

### RPS Game (Under Development)
- Real-time gesture recognition system
- Integration with existing hand tracking infrastructure
- Custom game logic and state management
- Interactive user interface for game interaction

## Development

- Backend API: The Flask API is located in `asl_api.py`
- Frontend: The Next.js frontend is in the `Frontend` directory
- ASL Detection: Core detection logic is in the `ASL_Detection` directory
- RPS Game: Game implementation will be in the `RPS` directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- Integration of additional sign language datasets
- Support for different sign language systems
- Mobile application development
- Enhanced gesture recognition accuracy
- Expanded game modes and educational features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- MediaPipe for hand landmark detection
- scikit-learn for machine learning implementation
- Next.js team for the frontend framework
- Flask team for the backend framework
- Contributors and testers who helped improve the system

## Team

- AboodH-2 (ASL Detection System) - [GitHub Profile](https://github.com/AboodH-2)
- Collaborator (RPS Game Implementation) - Coming Soon

## Contact

For questions and support, please reach out through:
- GitHub Issues
- [AboodH-2's GitHub Profile](https://github.com/AboodH-2) 