var fs         = require("fs"),
    async      = require("async"),
    mkdirp     = require('mkdirp'),
    mustache   = require("mustache"),
    minifyhtml = require("html-minifier").minify;
/*
async.waterfall([
    (callback) => {
        fs.readFile("site/json/some-anime.json", callback);
    },
    (data, callback) => {
        callback(null, JSON.parse(data));
    },
    (json) => {
        console.log(json[0])
    }
], () => {
    console.log("Error while reading/fetching data!");
});*/

//fs.readdir(path, callback);

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
/*
async.waterfall([
    () => {
        
    }
    (callback) => {
        
    },
    (data, callback) => {
        
    },
    (html) => {
        
    }
]);
*/

// async.parallel();
/*
async.parallel([
    function() {
        console.log("0")
        fs.readFile("site/json/some-anime/0.json", function(e, data) {
            console.log(JSON.parse(data))
        });
    },
    function() {
        console.log("1")
        fs.readFile("site/json/some-anime/1.json", function(e, data) {
            console.log(JSON.parse(data))
        });
    }
],
// optional callback
function(err, results) {
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
    console.log(results)
});*/
















/*
var $ = {}
    
module.exports = {}

var data = "";
var file = "site/json/some-anime.json";
var html = fs.createReadStream("site/html/0.html");

var files = fs.readdirSync("site/json/some-anime/");

for(var file in files) {
    if(file.slice(-5) != ".json")
        continue
    jsonfile.readFile("site/jon/some-anime/" + file, function(err, obj) {
      console.log(err)
    })
}*/

/*
fs.createReadStream("site/json/some-anime/1-1.json" )
.on("data", (chunk) => {
    data += chunk; // 1
}).on("end", () => {
    console.log(data); // 3
});

fs.createReadStream("site/json/some-anime/1-2.json" )
.on("data", (chunk) => {
    data += chunk;  // 2
}).on("end", () => {
    console.log(data); // 4
});



html.on("data", (chunk) => {
    data += chunk;
});

var json = fs.createReadStream("site/json/0.html");

read.on("data", (chunk) => {
    data += chunk;
});

read.on("end", () => {
    //console.log(data);
});

read.on("error", () => {
    console.log("Error while reading the file");
});

console.log("hello");*/
/*
var fileToWrite = fs.createWriteStream("test.txt");

fileToWrite.on('finish', function() {
    console.log("Write completed.");
});

fileToWrite.write("hello my name is issam");
fileToWrite.end("coco");*/

/*
var writer = fs.createWriteStream("test.txt");
read.pipe(writer);

writer.on("finish", () => {
    console.log("J'ai lu le fichier");
});*/