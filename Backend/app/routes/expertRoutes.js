const express = require("express");

const { getExpertSolutions } = require("../controllers/expertController");

const router = express.Router();

router.get("/expert/solutions", getExpertSolutions);

module.exports = router;
