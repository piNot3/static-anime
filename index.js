var fs         = require("fs");
var mustache   = require("mustache");
var minifyhtml = require("html-minifier").minify;

function readDir(path) {
    
}

function readFile(path) {
    
}

function openFile(path) {
    return JSON.parse(readFile("site/json/" + path));
}

var render = function(path1, path2, content) {
    // "site/html/" + n + ".html"
};

var $ = {
    read: function(path) {
        fs.readFile(path, function(err, content) {
            if(!err & content) {
                return content;
            } else {
                console.log("The file seem missing!");
                process.exit(1);
            }
        });
    },
    write: function() {
        fs.writeFile(path, content, function(err) {
            if(err) {
                console.log("Can't write on file!");
                process.exit(1);
            }
        });
    },
    lister: function(path) {
        fs.readdir(path, function(err, files) {
            if(!err & files) {
                return files;
            } else {
                console.log("The folder seem missing!");
                process.exit(1);
            }
        });
    },
    jsonify: function(content) {
        return JSON.parse(content);
    },
    minify: function(content) {
        return minifyhtml(content, {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            removeComments: true
        });
    },
    render: function() {
        return mustache.to_html(readFile(path), content);
    },
    build: function(path1, path2, content) {
        write(
            path1,
            minify(
                render(
                    path2,
                    content
                )
            )
        );
    }
}
    
module.exports = {
    main: function() {

        var content = [];

        var list = $.lister("site/json/");

        for(var i in list) {

            if(list[i].slice(-5) == ".json") {

                var json = $.jsonify( $.open("site/json/" + list[i]) );

                content.push( [ json[0], json[1], json[2] ] );

            }

        }

        build("public/index.html", "site/");

    },
    anime: function(anime) {
        var infos = $.jsonify( $.open("site/json/" + anime + ".json") );

        var content = {};
        content.a = infos[0]; // a = some-anime
        content.b = infos[1]; // b = Some Anime
        content.c = infos[2]; // c = 2 Seasons * 25 Episodes
        content.d = [];       // d = [ {"season": "Season 1", "list": [{"1-1": "Start"}]}, {"season": "Season 2", "list": [{"2-1": "End"}]} ]

        // Read files from folder of the anime > site/json/some-anime/*
        var files = $.lister("site/json/" + anime);

        // Loop through the seasons of the list
        for(var i in files) {

            // Open json and parse object
            var json = openJSON(anime + "/" + files[i]);

            // $end the season name to list "content"
            if(json.season!=undefined) {
                content.d.push({ "season": json.season, "list": [] });
            }

            // Push object (with episode and title) to array "list"
            content.d.slice(-1)[0].list.push({ "episode": json.episode, "title": json.title });
        }

		if(fs.existsSync("public/" + anime) == false) {
            fs.mkdirSync("public/" + anime);
        }

        write(
            "public/" + anime + "/index.json",
            minify(
                render(
                    "site/html/1.html",
                    content
                )
            )
        );

        console.log("Done.");
    },
    episode: function(anime, episode) {
        var json = openJSON(anime + ".json");
        var content = openJSON(anime + "/" + episode + ".json");
        content.anime = json[1];
        if(fs.existsSync("public/" + anime + "/" + episode) == false) {
            fs.mkdirSync("public/" + anime + "/" + episode);
        }
        write(
            "public/" + anime + "/" + episode + "/index.json",
            minify(
                render(
                    "site/html/2.html",
                    content
                )
            )
        );
        console.log("Done.");
    }
}

// 1 = path/to/$.js
// 2 = 0 or 1 or 2
// 3 = some-anime
// 4 = 1-1
// $[process.argv[2]](process.argv[3], process.argv[4]);