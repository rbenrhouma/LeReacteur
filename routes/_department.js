const express = require("express");
const router = express.Router();

// Recuperer le model Department
const Department = require("../models/Department");
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const departments = await Department.find(); // On recupere tous les Department
    res.json(departments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const title = req.body.title;
    if (title) {
      const department = new Department({
        title: title
      }); // On crée un Department avec comme title : req.body.title
      await department.save();
      res.json(department);
    } else {
      res.status(400).json({ error: "Wrong parameters" });
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
      // on check si
      const department = await Department.findById(id); // Ici on recupere un département qui a comme id : req.body.id
      department.title = title; // Ici on met a jour le department qu'on a trouvé grace a l'id
      await department.save();
      res.json(department);
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
      const department = await Department.findById(id); // Ici on recupere un département qui a comme id : req.body.id
      const category = await Category.findOne({ department: department._id });
      if (category) {
        if (!removeAllCategory(department._id)) {
          res.send("Error deleting category");
          return;
        }
        //res.send("Department can't be removed because there is categorys related ");
      }
      await department.remove();
      res.send("Department is delited");
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const removeAllCategory = async departmentId => {
  try {
    const categorys = await Category.find({ department: departmentId });
    await categorys.remove();
    return true;
  } catch {
    return false;
  }
};

module.exports = router;
