const express = require("express");
const router = express.Router();

const Review = require("../models/Review");
const Product = require("../models/Product");

// router.get("/", async (req, res) => {
//   try {
//     const reviews = await Review.find();
//     res.json(reviews);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

router.post("/create", async (req, res) => {
  try {
    const productID = req.body.product;
    const rating = req.body.rating;
    const comment = req.body.comment;
    const username = req.body.username;
    const product = await Product.findById(productID);

    if (product) {
      const review = new Review({
        rating: rating,
        comment: comment,
        username: username
      });

      if (product.reviews === undefined) {
        product.reviews = [];
      }

      await review.save();
      product.reviews.push(review);
      product.averageRating = 5; //calcAverage(product.reviews);

      await product.save();
      res.json(product);
    } else {
      res.status(400).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  try {
    const id = req.query.id;
    const title = req.body.title;
    if (id && title) {
      const review = await Review.findById(id);
      review.title = title;
      await review.save();
      res.json(review);
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
      const review = await Review.findById(id);
      await review.remove();
      res.send("Review is delited");
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const calcAverage = async array => {
  const reviews = await Review.find();
  console.log(reviews);
  var s = 0;
  for (let i = 0; i < reviews.find().count; i++) {}

  console.log(array);
  if (array.length > 0) return s / array.length;
  else return 0;
};

module.exports = router;
