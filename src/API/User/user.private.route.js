const express = require("express");
const router = express.Router();
const control = require("./user.private.controller");
// roleCheck(user)
const catchAsync = require("../../middleware/catchAsync");

router.get("/getcurrent", catchAsync(control.getCurrent));
router.patch("/updatecurrent", catchAsync(control.updateCurrent));
router.delete("/deletecurrent", catchAsync(control.deleteCurrent));
router.get('/getAllUser', catchAsync(control.getAllUser))
module.exports = router;