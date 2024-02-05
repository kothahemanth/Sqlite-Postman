const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const port = 3000;

// connect to SQLite database
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err){
        console.log(err.message);
    }
    else {
        console.log('Connected to the Sqlite database.');
    }
});

//Middleware to parse request body as JSON
app.use(express.json());

//Get all Users
app.get('/users', (req,res) => {
    db.all('SELECT * FROM users',[], (err,rows) => {
        if(err){
            return console.error(err.message);
        }
        res.json(rows);
    });
});

//Get a single user by id
app.get('/users/:id', (req,res) => {
    const id = req.params.id;
    db.all('SELECT * FROM users WHERE id = ?',[id], (err,row) => {
        if(err){
            return console.error(err.message);
        }
        res.json(row);
    });
});

//create a new user
app.post('/users', (req,res) => {
    const {name, email} = req.body;
    db.all('INSERT INTO users (name,email) VALUES (? ,?)',[name, email], function (err) {
        if(err){
            return console.error(err.message);
        }
        res.status(201).json({id: this.lastID});
    });
});

//update a user
app.put('/users/:id', (req,res) => {
    const id = req.params.id;
    const {name, email} = req.body;
    db.run('UPDATE users SET name = ?,email = ? WHERE id = ?',[name, email, id], function (err) {
        if(err){
            return console.error(err.message);
        }
        res.json({updatedID: id});
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', id, function (err) {
    if (err) {
        return console.error(err.message);
    }
        res.json({ deletedID: id});
    });
});

app.listen(port,() =>{
    console.log(`server running at http://localhost:${port}`);
});