@echo off
IF "%1"=="css" (
    node_modules\.bin\cleancss -o public/static/css.css site/static/css.css
) ELSE IF "%1"=="js" (
    node_modules\.bin\uglifyjs -o public/static/js.js site/static/js.js
) ELSE (
    node app.js %*
)