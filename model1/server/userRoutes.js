const express = require("express");
const {
  saveOrUpdateUser,
  savePermissions,
  resetPerformance,
} = require("./userController.js");

const router = express.Router();

router.post("/save-user", saveOrUpdateUser);
router.post("/save-permissions", savePermissions);
router.post("/reset", resetPerformance);

module.exports = router;
