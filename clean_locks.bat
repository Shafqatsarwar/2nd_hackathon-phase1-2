@echo off
echo Cleaning lockfiles...
del /F /Q src\frontend\package-lock.json
del /F /Q package-lock.json
del /F /Q src\package-lock.json
del /F /Q api\package-lock.json
echo Done.
