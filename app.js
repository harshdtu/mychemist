
var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var app = require("http").createServer(handler),
    io = require("socket.io").listen(app),
    fs = require("fs");
//var users={};
app.listen(port);

function handler(req, res) {
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

//io.sockets.in('abcd@gmail.com').emit('new_msg', {msg: 'hello'});