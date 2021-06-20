const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

//mailgun
var API_KEY = process.env.MAILGUN_API_KEY;
var DOMAIN = process.env.MAILGUN_DOMAIN;
var mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

app.get("/", (req, res) => {
  res.json({ message: "test" });
});

app.post("/form", async (req, res) => {
  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: "emmanuellebaron1@gmail.com",
    subject: "Formulaire",
    text: `${req.fields.message}`,
  };
  if (req.fields.firstname && req.fields.lastname && req.fields.email && req.fields.message) {
    mailgun.messages().send(data, (error, body) => {
      if (!error) {
        res.status(200).json({ message: "formulaire reçu" });
      } else {
        res.status(400).json({ message: error.message });
      }
    });
  } else {
    res.status(400).json({ message: "Missing parameters" });
  }
});

app.all("*", (req, res) => {
  res.status(400).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
