var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

var http = require('http');
var express = require('express'),
    app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(port);  //listen on port 80
var fs = require("fs");

app.get('/',function(req,res){

   fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200,{'content-type':'text/html'});
            res.end(data);
        });
});

app.use(express.static(__dirname + '/public'));
/* app.get('/camera.js',function(req, res){
    fs.readFile(__dirname + 'js/camera.js',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading camera.js');
            }
            res.writeHead(200,{'content-type':'text/javascript'});
            res.end(data);
        });

});
app.get('/bootstrap.css',function(req, res){
    fs.readFile(__dirname + 'css/bootstrap.css',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading bootstrap.css');
            }
            res.writeHead(200,{'content-type':'text/css'});
            res.end(data);
        });

});
app.get('/style.css',function(req, res){
    fs.readFile(__dirname + 'css/style.css',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading style.css');
            }
            res.writeHead(200,{'content-type':'text/css'});
            res.end(data);
        });

});
app.get('/jquery.min.js',function(req, res){
    fs.readFile(__dirname + 'js/jquery.min.js',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading Jquery.js');
            }
            res.writeHead(200,{'content-type':'text/javascript'});
            res.end(data);
        });

}); */
//server.listen(port);

/*function handler(req, res) {

    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
}
*/



io.sockets.on('connection', function (socket) {
    
    socket.on('join',function(data){
        socket.join(data.email);
    })
    //when recieving the data from the server, push the same message to client.
    socket.on("clientMsg", function (data) {
        //send the data to the current client requested/sent.
        socket.emit("serverMsg", data);
        //send the data to all the clients who are acessing the same site(localhost)
        socket.broadcast.emit("serverMsg", data);
    });

    socket.on("sender", function (data) {
        socket.emit("sender", data);
        socket.broadcast.emit("sender", data);
    });
});
