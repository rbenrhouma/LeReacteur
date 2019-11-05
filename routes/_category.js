const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const Department = require("../models/Department");
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const departmentID = req.body.department;
    // Vérifiser si existe
    const department = await Department.findById(departmentID);

    if (title && department) {
      const category = new Category({
        title: title,
        description: description,
        department: departmentID
      });
      await category.save();
      res.json(category);
    } else {
      if (!department) res.status(400).json({ error: "Wrong department associated" });
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
    const departmentID = req.body.departmentID;
    const department = await Department.findById(departmentID);

    if (id && title && description && department) {
      const category = await Category.findById(id);

      category.title = title;
      (category.description = description), (category.department = departmentID);

      await category.save();
      res.json(category);
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
      const category = await Category.findById(id);
      const product = await Product.findOne({ category: category._id });
      if (product) {
        //res.send("Category can't be removed because there is products related ");
        if (!removeAllProducts(category._id)) {
          res.send("Error deleting products");
          return;
        }
      }
      await category.remove();
      res.send("Category is delited");
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const removeAllProducts = async categoryId => {
  try {
    const products = await Product.find({ category: categoryId });
    await products.remove();
    return true;
  } catch {
    return false;
  }
};

module.exports = router;
