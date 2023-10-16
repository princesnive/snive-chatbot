const { Client } = require("pg");

const connectionString =
  "postgres://mwyacmeg:dr8Ylrw6dTiP3H1hyGCVYwCzEByIgevu@rain.db.elephantsql.com/mwyacmeg";

const client = new Client({
  connectionString: connectionString,
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
    client.query("SELECT * FROM reset_tokens", (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        console.log(JSON.stringify(row));
      }
      client.end();
    });
  })
  .catch((err) =>
    console.error("Error connecting to PostgreSQL database", err)
  );

module.exports = client;
