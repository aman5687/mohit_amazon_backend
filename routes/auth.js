const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/products', authController.products);
router.post('/contacts',authController.contacts);





module.exports = router;