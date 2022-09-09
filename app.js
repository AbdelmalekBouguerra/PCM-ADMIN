const express = require("express");
const dotenv = require("dotenv");
const hbs = require("hbs");
const session = require("cookie-session");
const path = require("path");
const cors = require("cors");
const db = require("./config/sequelize");

// env config
dotenv.config();
const config = process.env;
// server config
const app = express();
const port = config.PORT;

app.listen(port, () => {
  console.log(`Server started : http://localhost:${port}`);
});

app.use(cors());
// Parse URL encoded bodies sent by forms
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies as sent by API clients
app.use(express.json());

// Session config
app.use(
  session({
    secret: config.SESSION_SECRET,
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
  })
);

var auth = false;

auth = require("./routes/index");
// define public directory
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
var serveIndex = require("serve-index");

if (auth) {
  app.use(
    "/dpcFiles",
    serveIndex(path.join(__dirname, "./res/DpcDocs"), { icons: true })
  );
}

// Define view engine
app.set("view engine", "hbs");

// template hbs
hbs.registerPartials(path.join(__dirname, "views", "templates"));

// Routers
const indexRouter = require("./routes/index");

/* Connexion à la base de données MySQL. */
db.authenticate()
  .then(() => console.log("Database connection established ..."))
  .catch((err) => console.log("Error connecting to Database : " + err));

app.use("/", indexRouter);
