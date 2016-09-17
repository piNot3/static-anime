var fs         = require("fs")
  , mkdirp     = require('mkdirp')
  , parallel   = require("run-parallel")
  , waterfall  = require("run-waterfall")
  , mustache   = require("mustache")
  , minifyhtml = require("html-minifier").minify
  , anime = "some-anime"
  , path = "site/json/" + anime + "/"
  , read = function(path, callback) {
        fs.readFile(path, callback);
    }
  , write = function(path, text, callback) {
        fs.writeFile(path, text, callback);
    };

parallel({
    files: function(callback) {
        fs.readdir(path, callback);
    },
    html: function(callback) {
        read("site/html/2.html", callback);
    },
    json: function(callback) {
        read("site/json/" + anime + ".json", callback);
    }
}, function(error, objects) {
    if(error) return console.log("Error while reading html/json file!");

    for(var n in objects.files) {
        parallel({
            folder: function(callback) { callback(null, "public/" + anime + "/" + objects.files[n].slice(0, -5)) },
            obj1: function(callback) {
                callback(null, JSON.parse(objects.json));
            },
            obj2: function(callback) {
                read("site/json/some-anime/" + objects.files[n], function(error, text) {
                if(error) return console.log("Error while reading json file!");
                    callback(null, JSON.parse(text))
                });
            }
        }, function(error, results) {
            if(error) return console.log("Error while parsing json!");
            waterfall([
                function(callback) {
                 // Return an object of obj1 + obj2
                    callback(null, Object.assign({}, results.obj1, results.obj2));
                },
                function(object, callback) {
                 // Return a rendered html from text + object
                    callback(null, mustache.to_html(
                        objects.html.toString(),
                        object
                    ));
                },
                function(html, callback) {
                 // Return a minified html from html
                    callback(null,
                        minifyhtml(
                            html,
                            {
                                removeAttributeQuotes: true,
                                collapseWhitespace: true,
                                collapseInlineTagWhitespace: true,
                                removeComments: true
                            }
                        )
                    );
                },
                function(html) {
                    mkdirp(results.folder, function() {
                        write(results.folder + "/index.html", html, callback);
                    });
                },
                function() {
                    console.log(results.folder)
                }
            ]);
            //minify();
            //render(objects.html.toString(), merge(objs.obj1, objs.obj2))
        });
    }
});
// Wondering why need parallel and waterfall? It aloud me to write multiple file at the same time!