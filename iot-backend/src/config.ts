import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: 'mysql',
    user: 'iot',
    password: 'iot123',
    database: 'iotdb',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database.');
    }
});

export const JWT_SECRET = 'your_jwt_secret'; // Keep this in an environment variable for production
