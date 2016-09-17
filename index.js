var fs         = require("fs"),
    async      = require("async"),
    mkdirp     = require('mkdirp'),
    mustache   = require("mustache"),
    minifyhtml = require("html-minifier").minify;

var anime = "some-anime";

var path = "site/json/" + anime + "/";

var list = fs.readdirSync(path);

async.parallel({
    json: (callback) => {
        // Open some-anime.json
        async.waterfall([
            (callback) => {
                fs.readFile("site/json/" + anime + ".json", callback);
            },
            (data) => {
                callback(null, JSON.parse(data));
            }
        ], () => {
            console.log("Error while reading json file")
        });
    },
    html: (callback) => {
        // Open html
        async.waterfall([
            (callback) => {
                fs.readFile("site/html/2.html", callback);
            },
            (data) => {
                callback(null, data.toString());
            }
        ], () => {
            console.log("Error while reading html file")
        });
    }
}, (error, data) => {
 // Fired only if no error cause already error handler
    async.map(list, (file) => {
        async.waterfall([
            (callback) => {
             // Read file's text
                fs.readFile(path + file, callback);
            },
            (text, callback) => {
             // Parse text to json
                callback(null, JSON.parse(text));
            },
            (json, callback) => {
             // Merge two objects into one
                callback(null, Object.assign({}, data.json, json));
            },
            (json, callback) => {
             // Render from html file with json object
                callback(null, mustache.to_html(data.html, json));
            },
            (html, callback) => {
             // Minify html
                callback(
                    null,
                    minifyhtml(html, {
                        removeAttributeQuotes: true,
                        collapseWhitespace: true,
                        collapseInlineTagWhitespace: true,
                        removeComments: true
                    })
                );
            },
            (html, callback) => {
             // Make the folder
                var folder = "public/" + anime + "/" + file.slice(0, -5);
                mkdirp(folder, callback(null, folder, html));
            },
            (folder, text) => {
             // Write new html file into folder "public"
                fs.writeFile(folder + "/index.html", text);
            }
        ], () => {
            console.log("Error while reading/fetching/writing data!");
        });
    });
});