const express = require('express');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
  host: '127.0.0.1', //local host だと進まない
  user: 'root',
  password: 'cook8921',
  database: 'list_app'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: false})); //定型分

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index',(req,res)=>{
  connection.query(
    'select * from users',
    (error,results)=>{
      // console.log(results);
      res.render('index.ejs',{items:results});
    }
  )
});

app.get('/new',(req,res)=>{
  res.render('new.ejs')
})

app.post('/create',(req,res)=>{
  connection.query(
    'INSERT INTO users (name) VALUES(?)',
    [req.body.itemName],
    (erreor,results)=>{
      res.redirect('/index')
    }
  )
});

app.post('/delete/:id',(req,res)=>{
  connection.query(
    'DELETE FROM users WHERE id = ?',
    [req.params.id],
    (error,results)=>{
      res.redirect('/index');
    }
    )
})

app.get('/edit/:id', (req, res) => {
  connection.query(
    'select * from users where id = ?',
    [req.params.id],
    (error,results)=>{
      res.render('edit.ejs',{item:results[0]})
      ;
    }
    )
});

app.post('/update/:id', (req, res) => {
  console.log(req)
  connection.query(
    'update users set name = ? where id = ?',
    [req.body.itemName,req.params.id],
    (error,results)=>{
      res.redirect('/index');
    }
    )
});

app.listen(3000);