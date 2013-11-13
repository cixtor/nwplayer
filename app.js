
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('public/history.db');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function(req, res){
    db.serialize(function(){
        db.run('CREATE TABLE IF NOT EXISTS lorem (info TEXT)');
        var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
        for( var i=0; i<10; i++ ){
                stmt.run("Ipsum " + i);
        }
        stmt.finalize();
        db.each('SELECT rowid AS id, info FROM lorem', function(err, row){
                console.log(row.id + ': ' + row.info);
        });
        res.render('index', { title: 'Express' });
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    // db.close();
});
