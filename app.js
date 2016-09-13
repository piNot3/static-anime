var fs         = require("fs"),
    mustache   = require("mustache"),
    minifyhtml = require("html-minifier").minify;

var readDIR = function(path) {
        return fs.readdirSync(path);
    },
    readFILE = function(path) {
        return fs.readFileSync(path, "utf8");
    },
    openJSON = function(path) {
        return JSON.parse(readFILE("site/json/" + path));
    },
    writeFILE = function(writeHere, n, object) {
        fs.writeFileSync(
            "public/" + writeHere,
            minifyhtml(
                mustache.to_html(
                    readFILE("site/html/" + n + ".html"),
                    object
                ),
                {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    collapseInlineTagWhitespace: true,
                    removeComments: true
                }
            )
        )
    };
    
var app = {
    0: function() {
        var content = [];
        var list = readDIR("site/json/");
        for(var i in list) {
            if(list[i].slice(-5) == ".json") {
                var json = openJSON(list[i]);
                content.push( [ json[0], json[1], json[2] ] );
            }
        }
        writeFILE("index.html", 0, content);
        console.log("Done.");
    },
    1: function(anime) {
        var infos = openJSON(anime + ".json");

        var content = {};
        content.a = infos[0]; // a = some-anime
        content.b = infos[1]; // b = Some Anime
        content.c = infos[2]; // c = 2 Seasons * 25 Episodes
        content.d = [];       // d = [ {"season": "Season 1", "list": [{"1-1": "Start"}]}, {"season": "Season 2", "list": [{"2-1": "End"}]} ]

        // Read files from folder of the anime > site/json/some-anime/*
        var files = readDIR("site/json/" + anime);

        // Loop through the seasons of the list
        for(var i in files) {

            // Open json and parse object
            var json = openJSON(anime + "/" + files[i]);

            // Append the season name to list "content"
            if(json.season!=undefined) {
                content.d.push({ "season": json.season, "list": [] });
            }

            // Push object (with episode and title) to array "list"
            content.d.slice(-1)[0].list.push({ "episode": json.episode, "title": json.title });
        }

		if(fs.existsSync("public/" + anime) == false) {
            fs.mkdirSync("public/" + anime);
        }

        writeFILE(anime + "/index.html", 1, content);
        console.log("Done.");
    },
    2: function(anime, episode) {
        var json = openJSON(anime + ".json");
        var content = openJSON(anime + "/" + episode + ".json");
        content.anime = json[1];
        if(fs.existsSync("public/" + anime + "/" + episode) == false) {
            fs.mkdirSync("public/" + anime + "/" + episode);
        }
        writeFILE(anime + "/" + episode + "/index.html", 2, content);
        console.log("Done.");
    }
}

if(process.argv[2] == "1" && process.argv[3] == undefined) {
    console.log("Not enough parameter(s)");
    console.log("> npm run 1 -- some-anime");
    process.exit();
} else if(process.argv[2] == "2" && process.argv[3] == undefined && process.argv[4] == undefined) {
    console.log("Not enough parameter(s)");
    console.log("> npm run 2 -- some-anime 1-1");
    process.exit();
}

app[process.argv[2]](process.argv[3], process.argv[4])
