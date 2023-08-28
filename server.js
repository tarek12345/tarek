const express = require("express");
const cors = require("cors");

const app = express();
const dotenv = require('dotenv');
var mongoose = require('mongoose');
const UsersRoutes = require("./Routes/UsersRoutes");
dotenv.config();


// db connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected to the database!");
})
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });



var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
};
app.use(cors(corsOptions));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route








app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


require("./Routes/UsersRoutes")(app);
require("./Routes/AuthRoutes")(app);
require("./Routes/UsersCongeRoutes")(app);




// set port, listen for requests
const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});