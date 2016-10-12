var router = require('express').Router();
var pg = require('pg');

//this is how it can connect to the database
var config = {
  database: 'rho'
};

//initialize the database connection pool
var pool = new pg.Pool (config);

router.get('/:id', function (req, res) {

  pool.connect(function (err, client, done){
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      //releases the conenction so someone else can use it
      done();
      return;
      //or you could leave out return and use else
    }
    client.query('SELECT * FROM books WHERE id = $1;', [req.params.id], function(err, result){
      done();
      if (err){
        console.log('Error querying to the DB', err);
        res.sendStatus(500);
        return;
      }
      console.log('result object rows from DB', result.rows);
      res.send(result.rows);
    });
  });
});

router.get('/', function (req, res) {

  pool.connect(function (err, client, done){
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      //releases the conenction so someone else can use it
      done();
      return;
      //or you could leave out return and use else
    }
    client.query('SELECT * FROM books', function(err, result){
      done();
      if (err){
        console.log('Error querying to the DB', err);
        res.sendStatus(500);
        return;
      }
      console.log('result object rows from DB', result.rows);
      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  pool.connect(function(err, client, done){
    if (err) {
      res.sendStatus(500);
      done();
      return;
    }
    client.query('INSERT INTO books (author, title, published, edition, publisher) VALUES ($1, $2, $3, $4, $5) returning *;', [req.body.author, req.body.title, req.body.published, req.body.edition, req.body.publisher], function (err, result){
      done();
      if (err) {
        console.log('error 2')
        res.sendStatus(500);
        return;
      }
      res.send(result.rows);
    });
  });
});

module.exports = router;
