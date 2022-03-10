var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var crypto = require("crypto");
var password_validator = require("password-validator");
const cookie_parser = require("cookie-parser");
const sessions = require('express-session');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

var db = new sqlite3.Database('./db/web-chat.db');
db.run('CREATE TABLE IF NOT EXISTS usuarios(nome TEXT constraint pk_nome_usuario primary key, senha TEXT, email TEXT)')
db.run('CREATE TABLE IF NOT EXISTS contatos(usuario1 TEXT, usuario2 TEXT, constraint fk_usuario1 foreign key(usuario1) references usuarios(nome), constraint fk_usuario2 foreign key(usuario2) references usuarios(nome))')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });

  var schema = new password_validator();

  schema
  .is().min(8)                                    
  .is().max(100)                                  
  .has().uppercase()                              
  .has().lowercase()                              
  .has().digits(2)                                 
  .has().not().spaces()

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './signup')));
app.use(express.static(path.join(__dirname, './login')));
app.use(express.static(path.join(__dirname, './main')));
app.use(helmet());
app.use(limiter);
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.use(cookie_parser());

var session;

app.get('/signup', function(req,res){
    res.sendFile(path.join(__dirname,'./signup/signup.html'));
  });

  app.get('/', function(req,res){
    if (session == null) {
      res.sendFile(path.join(__dirname,'./login/login.html'));
    } else {
      res.sendFile(path.join(__dirname,'./main/main.html'))
    }
  });

server.listen(3000, function(){
console.log("server is listening on port: 3000");
});

var invalidUsernameOrPassword = { status : 'invalidUsernameOrPassword'};
function verifyUsernameOrPassword(username, passwordHash) {
  return new Promise((resolve, reject) => {
    db.get('SELECT nome, senha FROM usuarios u WHERE u.nome = ? AND u.senha = ?', [username, passwordHash], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  })
}

var usernameExists = { status : 'usernameExists'};
function verifyUsernameExists(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(1) FROM usuarios u WHERE u.nome = ?', username, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row['COUNT(1)']);
    });
  })
}

function selectAllContacts(username) {
  return new Promise((resolve, reject) => {
    db.all('SELECT usuario2 FROM contatos c WHERE c.usuario1 = ?', username, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  })
}

var invalidUsername = { status : 'invalidUsername' };
function verifyUsername(username) {
  return String(username).match(/^[a-z0-9]+$/);
}

var invalidPassword = { status : 'invalidPassword'};
function verifyPassword(password1, password2) {
  if (password1 !== password2) {
    return false;
  }
  if (password1 === '' || password2 === '') {
      return false;
  }
  if (password2 === '') {
      return false;
  }
  return schema.validate(password1);
}

var emailExists = { status : 'emailExists'};
function verifyEmailExists(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(1) FROM usuarios u WHERE u.email = ?', email, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row['COUNT(1)']);
    });
  })
}


var invalidEmail = { status : 'invalidEmail'};
function verifyEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

var usernameNotExists = {status : 'usernameNotExists'};
app.post('/add-user', function(req,res){
  verifyUsernameExists(req.body.uname)
  .then(row => {
    if (row == 0) {
      res.json(usernameNotExists);
      return;
    } else {
      db.run('INSERT INTO contatos (usuario1, usuario2) VALUES(?,?)', [session.userid, req.body.uname]);
      db.run('INSERT INTO contatos (usuario1, usuario2) VALUES(?,?)', [req.body.uname, session.userid]);
      res.json(valid);
      return;
    }
  })
  .catch(err => console.log(err));
})

app.post('/all-contacts', function(req,res){
  selectAllContacts(session.userid)
  .then(rows => {
    res.json(rows);
    return;
  })
  .catch(err => console.log(err));
})

app.post('/remove-user', function(req,res){
  db.run('DELETE FROM contatos WHERE usuario1 = ? AND usuario2 = ?', [session.userid, req.body.uname]);
  db.run('DELETE FROM contatos WHERE usuario1 = ? AND usuario2 = ?', [req.body.uname, session.userid]);
  res.json(valid);
  return;
})

var valid = { status : 'valid' };
app.post('/create-user', function(req,res){
  verifyUsernameExists(req.body.uname)
  .then(row => {
    if (row == 1) {
      res.json(usernameExists);
      return;
    }
  })
  .catch(err => console.log(err));
  if (!verifyUsername(req.body.uname)) {
    res.json(invalidUsername);
    return;
  }
  if (!verifyPassword(req.body.psw1, req.body.psw2)) {
    res.json(invalidPassword);
    return;
  }
  verifyEmailExists(req.body.email)
  .then(row => {
    if (row == 1) {
      res.json(emailExists);
      return;
    }
  })
  if (!verifyEmail(req.body.email)) {
    res.json(invalidEmail);
    return;
  }
  db.run('INSERT INTO usuarios (nome, senha, email) VALUES(?,?,?)', [req.body.uname, crypto.createHash('sha256').update(req.body.psw1).digest('hex'), req.body.email]);
  res.json(valid);
  return;
})

app.post('/login', function(req,res) {
  verifyUsernameOrPassword(req.body.uname, crypto.createHash('sha256').update(req.body.psw).digest('hex'))
  .then(row => {
    if (row == null) {
      res.json(invalidUsernameOrPassword);
      return;
    } else {
      session = req.session;
      session.userid = req.body.uname;
      res.redirect("/main");
    }
  })
  .catch(err => console.log(err));
  return;
})

app.post('/login-m', function(req,res) {
  verifyUsernameOrPassword(req.body.uname_m, crypto.createHash('sha256').update(req.body.psw_m).digest('hex'))
  .then(row => {
    if (row == null) {
      res.json(invalidUsernameOrPassword);
      return;
    } else {
      session = req.session;
      session.userid = req.body.uname_m;
      res.redirect("/main");
    }
  })
  .catch(err => console.log(err));
  return;
})

app.post('/create-user-m', function(req,res){
  verifyUsernameExists(req.body.uname_m)
  .then(row => {
    if (row == 1) {
      res.json(usernameExists);
      return;
    }
  })
  .catch(err => console.log(err));
  if (!verifyUsername(req.body.uname_m)) {
    res.json(invalidUsername);
    return;
  }
  if (!verifyPassword(req.body.psw1_m, req.body.psw2_m)) {
    res.json(invalidPassword);
    return;
  }
  verifyEmailExists(req.body.email_m)
  .then(row => {
    if (row == 1) {
      res.json(emailExists);
      return;
    }
  })
  if (!verifyEmail(req.body.email_m)) {
    res.json(invalidEmail);
    return;
  }
  db.run('INSERT INTO usuarios (nome, senha, email) VALUES(?,?,?)', [req.body.uname_m, crypto.createHash('sha256').update(req.body.psw1_m).digest('hex'), req.body.email_m]);
  res.json(valid);
  return;
})
