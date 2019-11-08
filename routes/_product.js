const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  console.log("yes products list");
  try {
    var query = {};
    if (req.query.priceMin || req.query.priceMax || req.query.category) query["$and"] = [];

    var product;
    //console.log(req.query);
    if (req.query.priceMin) query["$and"].push({ price: { $gte: req.query.priceMin } });
    if (req.query.priceMax) query["$and"].push({ price: { $lte: req.query.priceMax } });
    if (req.query.category) query["$and"].push({ category: req.query.category });

    // console.log(query);
    if (query !== {}) {
      product = await Product.find(query);
    } else {
      product = await Product.find();
    }
    if (req.query.sort === "price-asc") {
      const search = product;
      search.sort({ price: 1 });
      const product = await search;
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const categoryId = req.body.category;
    const category = await Category.findById(categoryId);
    if (title && category) {
      const product = new Product({
        title: title,
        description: description,
        price: price,
        category: categoryId
      });
      await product.save();
      res.json(product);
    } else {
      if (!category) res.status(400).json({ error: "Wrong category associated" });
      else res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  try {
    const id = req.query.id;
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;

    if (id && title && description && price) {
      const product = await Product.findById(id);

      product.title = title;
      product.description = description;
      product.price = price;

      await product.save();
      res.json(product);
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const id = req.query.id;
    if (id) {
      const product = await Product.findById(id);
      await product.remove();
      res.send("Product is delited");
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
