const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/product-catalog", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// On recupere le router du fichier ./routes/index.js
const routes = require("./routes/");

// On l'utilise
app.use(routes);

// si aucune page n'est disponible.
app.all("*", (req, res) => {
  res.status(404).send("Page introuvable dans Drugstore");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("DataBase name :" + process.env.MONGODB_URI);
  console.log("Server démarré sur le port : " + process.env.PORT || 3000);
});
