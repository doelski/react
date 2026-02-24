const express = require('express');
const app = express();
const mySql = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mySql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'employeesystem'
});


app.post('/create', (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const country = req.body.country;
    const position = req.body.position;
    const wage = req.body.wage;

    db.query('INSERT INTO employees (name, age, country, position, wage, archived) VALUES (?, ?, ?, ?, ?, 0)',
        [name, age, country, position, wage],
         (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send('Values Inserted');
            }
         }
    );
});

app.get('/employees', (req, res) => {
    db.query('SELECT * FROM employees WHERE archived = 0 OR archived IS NULL', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/employees/archived', (req, res) => {
    db.query('SELECT * FROM employees WHERE archived = 1', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.put('/update', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const age = req.body.age;
    const country = req.body.country;
    const position = req.body.position;
    const wage = req.body.wage;

    db.query('UPDATE employees SET name = ?, age = ?, country = ?, position = ?, wage = ? WHERE id = ?',
        [name, age, country, position, wage, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send('Employee Updated');
            }
        }
    );
});

app.put('/archive/:id', (req, res) => {
    const id = req.params.id;

    db.query('UPDATE employees SET archived = 1 WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send('Employee Archived');
        }
    });
});

app.put('/unarchive/:id', (req, res) => {
    const id = req.params.id;

    db.query('UPDATE employees SET archived = 0 WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send('Employee Unarchived');
        }
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM employees WHERE id = ?', id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send('Employee Deleted');
        }
    });
});


app.listen(3001, () => {
  console.log('Hoyyy, your server is running on port 3001');
});