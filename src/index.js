var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

var db = new sqlite3.Database('./db/web-chat.db');
db.run('CREATE TABLE IF NOT EXISTS usuarios(nome TEXT constraint pk_nome_usuario primary key, senha TEXT, email TEXT)')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './signup')));
app.use(helmet());
app.use(limiter);

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'./signup/signup.html'));
  });

server.listen(3000, function(){
console.log("server is listening on port: 3000");
});

app.post('/create-user', function(req,res){
  db.serialize(() => {
    db.run('INSERT INTO usuarios (nome, senha, email) VALUES(?,?,?)', [req.body.uname, req.body.psw1, req.body.email])
  });
})
