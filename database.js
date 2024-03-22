const sqlite3 = require('sqlite3').verbose();
const DATABASE_NAME = "phone_numbers.db";

const db = new sqlite3.Database(DATABASE_NAME, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run('CREATE TABLE IF NOT EXISTS phone_numbers (\
            number TEXT PRIMARY KEY,\
            conversation_id TEXT\
        )', (err) => {
            if (err) {
                console.error('Error creating table ' + err.message);
            }
        });
    }
});

module.exports = db;
