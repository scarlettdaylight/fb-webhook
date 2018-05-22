// Make a connection to database
const init = () => {

  const mysql = require('mysql');
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TABLE,
  });
  connection.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  return connection;
};

const getMessageWithKeyword = (sentence) => {

  return new Promise(function (resolve, reject) {

    //if sentence is empty, reject
    if (sentence === '') {
      reject('Empty sentence');
    }

    const words = sentence.split(' ');
    let whereClause = '';
    for (let i = 1; i < words.length; i++) {
      whereClause += 'OR keyword = ? ';
    }

    console.log(words);

    const conn = init();
    conn.query(
      `SELECT * FROM keywordPairs WHERE keyword = ? ${whereClause} ORDER BY priority DESC, id ASC LIMIT 1`,
      words,
      function (error, results, fields) {
        if (error) throw error;
        let result = null;
        if (results.length === 1) {
          result = results[0].message;
        }
        conn.end();
        resolve(result);
      });
  });

};

module.exports = {getMessageWithKeyword};
