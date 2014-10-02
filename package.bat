set _7ZIP="%~dp0tools\7za.exe"
set _PACKAGE="iZoom.zip"

%_7ZIP% a -tzip "%_PACKAGE%" _locales\ media\ scripts\ stylesheets\ background.html izoom.js manifest.json options.html popup.html