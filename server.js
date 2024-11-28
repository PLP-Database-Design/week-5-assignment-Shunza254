// Declare and import packages
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const { error } = require('console');

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();



// Connecting to database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check connection
db.connect((error) => {
    if(error) {
        console.log('Error connecting to database: ', error.stack);
        return;
    }
    console.log('Connection successful: ID:', db.threadId);

    // Start the server after database connection confirms
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log('Server running successfully');
    });
});



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Question 1
app.get('/patients', (request, response) => {
    // Retrieve data from patients table
    db.query('SELECT * FROM patients', (error, results) => {
        if(error) {
            console.log('Database error: ', error.stack);
            return response.status(500).send('Unable to fetch patients records');
        }
        else {
            response.render('patients', {results: results});
        }
    });
});

// Question 2
app.get('/doctors', (request,response) => {
    // Retrieve data from doctors table
    db.query('SELECT * FROM providers', (error, results) => {
        if(error) {
            console.log('Error retrieving doctors db: ', error.stack);
            return response.status(500).send('Unable to fetch Doctors records');
        }
        response.render('doctors', { results });
    })
})

app.get('/appointments', (request, response) => {
    // Retrieve data from appointments table
    db.query('SELECT * FROM appointments', (error, results) => {
        if(error) {
            console.log('Error retrieving appointments. ID: ', error.stack);
            return response.status(500).send('Unable to fetch appointments')
        }
        response.render('appointments', {results})
    })
})

// Question 3
app.get('/patients', (request, response) => {
    db.query('SELECT first_name FROM patients', (error, results) => {
        if(error) {
            console.log('Error retrieving first names: ID: ', error.stack);
            return response.status(500).send('Unable to fetch first names')
        }
        response.render('patients', { results });
    })
})

// Question 4
app.get('/provider_specialty', (request, response) => {
    db.query('SELECT * FROM providers ORDER BY provider_specialty', (error, results) => {
        if(error) {
            console.log('Error retrieving speciality: ID: ', error.stack);
            return response.status(500).send('Unable to group by speciality')
        }
        response.render('provider_specialty', { results});
    })
})

