const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const passport = require("passport");
const session = require("express-session");
const passportSetup = require("./passport");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// auth middleware
const auth = require("./middlewares/auth");

app.set("view engine", "ejs");

app.get("/pay", (req, res) => {
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
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerDocument));

const appRoutes = require("./routes/index");

const google_auth = require("./routes/auth");
const Conversation = require("./models/user");

app.use("/", appRoutes);
app.use("/auth", google_auth);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

// test routes
app.get("/testd", async (req, res) => {
  try {
    const data = {
      company_id: "1",
      user_id: "1",
      chat_bot_token: "1-4484d03212274fa3bf19ef099a36c101",
      conversation_id: "1-4484d03212274fa3bf19ef099a36c101",
      category: "private",
      conversation: [
        {
          message: "What is my name?",
          sender: "user",
          timestamp: "2023-10-09T12:16:53.695580",
        },
        {
          message: "Your name is John Doe",
          sender: "bot",
          timestamp: "2023-10-09T12:16:53.695580",
        },
        // Ensure the third conversation object has required fields
        {
          message: "Sample message",
          sender: "user",
          timestamp: "2023-10-09T12:16:53.695580",
        },
        // ... other conversation messages
      ],
      total_messages: 10,
      chat_platform: "Whatsapp",
      status: "closed",
      end_timestamp: "2023-10-10T21:28:44.743392",
    };

    const conversation = new Conversation(data);
    await conversation.save();

    res.status(201).send("Data inserted successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});



module.exports = app;
