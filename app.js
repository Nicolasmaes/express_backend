const express = require("express");
const mongoose = require("mongoose");

const Thing = require("./models/thing");
const Product = require("./models/product");

mongoose
  .connect(
    "mongodb+srv://user:root@cluster0.vuyfrfu.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(express.json());
// Cette ligne est un middleware qui intercepte toutes les requêtes qui ont un content-type jSON et met à disposition ce contenu dans req.body. Il existe aussi une version plus ancienne : bodyParser.

// app.use((req, res, next) => {
//   console.log("requête reçue.");
//   next();
// });

// app.use((req, res, next) => {
//   res.status(201);
//   next();
// });

// app.use((req, res, next) => {
//   res.json({ message: "Votre requête a bien été reçue" });
//   next();
// });

// app.use((req, res, next) => {
//   console.log("Réponse envoyée avec succès");
// });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
//   Ce middleware ci-dessus permet d'éviter les erreurs CORS.

// MiddleWare Things

app.get("/api/stuff", (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

app.post("/api/stuff", (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    // title: req.body.title,
    // il y a un raccourci ci-dessous.
    ...req.body
  });
  thing
    .save()
    .then(() => res.status(201).json({ messega: "Objet enregistré" }))
    .catch(error => res.status(400).json({ error }));
});

app.get("/api/stuff/:id", (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.put("/api/stuff/:id", (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json("Objet modifié"))
    .catch(error => res.status(404).json({ error }));
});

app.delete("/api/stuff/:id", (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json("Objet supprimé"))
    .catch(error => res.status(404).json({ error }));
});

// MiddleWare Products

app.get("/api/products", (req, res, next) => {
  Product.find()
    .then(products => res.status(200).json({ products: products }))
    .catch(error => res.status(400).json({ error }));
});

app.get("/api/products/:id", (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then(product => res.status(200).json({ product: product }))
    .catch(error => res.status(404).json({ error }));
});

app.post("/api/products", (req, res, next) => {
  const product = new Product({
    // title: req.body.title,
    // il y a un raccourci ci-dessous.
    ...req.body
  });
  product
    .save()
    .then(product => res.status(201).json({ product }))
    .catch(error => res.status(400).json({ error }));
});

app.put("/api/products/:id", (req, res, next) => {
  Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Modified!" }))
    .catch(error => res.status(404).json({ error }));
});

app.delete("/api/products/:id", (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Deleted!" }))
    .catch(error => res.status(404).json({ error }));
});

module.exports = app;

// next() permet de renvoyer au prochain middleware.
