@echo off
IF "%1"=="css" (
    node_modules\.bin\cleancss -o public/static/css.css site/static/css.css
) ELSE IF "%1"=="js" (
    node_modules\.bin\uglifyjs -o public/static/js.js site/static/js.js
) ELSE IF NOT "%2"=="" (
    IF EXIST "site\json\%1\%2.json" (
        node app.js 2 %1 %2
    ) ELSE (
        echo Episode doesn't exist!
    )
) ELSE IF NOT "%1"=="" (
    IF EXIST "site\json\%1.json" (
        node app.js 1 %1
    ) ELSE (
        echo Anime doesn't exist!
    )
) ELSE (
    node app.js 0
)