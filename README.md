# Static File Genarator for Animes

This is a simple file generator that let you make the fastest website for anime. This work on Windows only.

## Dependencies

First, you have to install some dependencies.

```
npm install
```

## Commands

Run this to render "index.html" under "public/"

```
npm run 0
```

Run this to render "index.html" under "public/some-anime/"

```
npm run 1 -- some-anime
```

Run this to render "index.html" under "public/some-anime/1-1/"

```
npm run 2 -- some-anime 1-1
```

Run this to render the css files under "public/static/"

```
npm run css
```

Run this to render the js files under "public/static/"

```
npm run js
```