var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var app = express();

function onHttpStart() {
    console.log("Express http server listening on " + HTTP_PORT);
  }

app.use(express.static("./public/"));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "./views/index.html"));
});


app.listen(HTTP_PORT, onHttpStart);