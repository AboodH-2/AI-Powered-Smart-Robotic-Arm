@echo off
echo Installing required Python packages...
pip install -r ASL_Detection/sign-language-detector-python-master/requirements.txt

echo Installing frontend API requirements...
pip install -r Frontend/requirements.txt

echo.
echo Installation complete. Please run test_imports.py to verify installation.
pause 