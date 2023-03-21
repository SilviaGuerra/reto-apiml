var express = require("express");
var router = express.Router();
const MLController = require("../controllers/MLController").MLController;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/api/items", MLController.search);
router.get("/api/items/:id", MLController.details);

module.exports = router;
