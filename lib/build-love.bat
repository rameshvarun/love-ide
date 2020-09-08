@echo off
if [%1]==[] goto usage
cd %1
powershell Compress-Archive * compressed.zip
set lovepath=%2
IF [%lovepath%]==[] ( goto :searchInEnVar )
IF ["%lovepath%"]==["love"] ( goto :searchInEnVar )
IF ["%lovepath%"]==["love.exe"] ( goto :searchInEnVar )
IF NOT EXIST "%2" ( goto :searchInEnVar )

:build
copy %lovepath% .
for %%I in (.) do set CurrDirName=%%~nxI
echo Building...
copy /by love.exe+compressed.zip "%CurrDirName%.exe"
del /f compressed.zip
del /f love.exe
start explorer.exe .
goto :end

:searchInEnVar
echo Searching for love.exe in the environment variables...
for %%a in ("%PATH:;=" "%") do (
	Echo.%%a | findstr /C:"LOVE">nul && (
		pushd %%a
		IF EXIST "love.exe" (
			Echo.Found on %%a
			set lovepath=%%a\love.exe
			popd
			goto :build
		)
		popd
		Echo.Still searching...
	) || (
    		Echo.Still searching...
	)
)
Echo.Cannot find love.exe
pause
goto :end

:usage
echo Error: missing argument.
echo USAGE: %~nx0 TargetDirectory [love.exe path]
pause

:end
exit