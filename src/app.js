const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");


// auth middleware
const auth = require("./middlewares/auth");

app.set("view engine", "ejs");

app.get("/ejs/page", (req, res) => {
  res.render("index", { title: "Express" });
});

const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const swaggerDocument = yaml.load("./swagger.yaml");
app.use('/api-docs',swaggerUi.serve)
app.get('/api-docs',swaggerUi.setup(swaggerDocument))

const appRoutes = require("./routes/index");

app.use("/", appRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
