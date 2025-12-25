@echo off
echo Deleting old files...
del /f /q src\frontend\lib\auth.ts
del /f /q src\frontend\next.config.js
del /f /q src\frontend\package.json
del /f /q package.json
del /f /q src\package.json
del /f /q package-lock.json
del /f /q src\frontend\package-lock.json
del /f /q src\package-lock.json

echo Copying new files...
copy /y fix_dir\auth.ts src\frontend\lib\auth.ts
copy /y config_fix.js src\frontend\next.config.js
copy /y fe_pkg_fix.json src\frontend\package.json
copy /y root_pkg_fix.json package.json

echo Verification...
type src\frontend\lib\auth.ts
