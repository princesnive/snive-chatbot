const app = require("./src/app");
require("dotenv").config();
const dbConn = require("./src/configs/MongoConn");


// Call your database connection function, assuming it's set up correctly in MongoConn
dbConn();
// postgress connection
require("./src/configs/Postgress");



app.listen(5000, () => {
  console.log("Server is running on port 3000");
});
