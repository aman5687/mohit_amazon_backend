const db = require("../db");
const User = require("../userModel");
const Products = require("../productModel");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const Contact = require("../contact");
const multer = require("multer");

exports.register = async (req, res) => {
  const { name, email, number, password, confpassword } = req.body;
  const sameEmail = await User.findOne({ email: email });
  const sameNumber = await User.findOne({ number: number });
  const hashedPassword = await bcryptjs.hash(password, 8);
  const token = uuidv4();
  try {
    if (sameEmail) {
      return res.status(200).send(" Email is Already Register");
    } else if (sameNumber) {
      return res.status(200).send("Mobile Number is Already Register");
    }
  } catch (error) {
    return res.status(200).send(" Please Fill the Details");
  }
  try {
    if (!email) {
      return res.status(200).send("Please fill the Details");
    } else if (!validator.isEmail(email)) {
      return res.status(200).send(" email noot Success");
    } else if (!name || !email || !number || !password || !confpassword) {
      return res.status(200).send(" Please Enter the Password");
    } else if (password !== confpassword) {
      return res.status(200).send(" Conform password is Not Same as Password");
    } else if (password.length < 8) {
      return res.status(200).send(" Please enter the password in 8 words");
    } else if (number.toString().length !== 10) {
      return res.status(200).send("Number Shuould be 10 Number ");
    }
  } catch (error) {
    return res.status(200).send(" Error");
  }
  try {
    const newUser = new User({
      name,
      email,
      number,
      token,
      password: hashedPassword,
    });

    newUser.save().then(() => {
      return res.status(200).send("Success");
    });
  } catch (error) {
    return res.status(401).send("not success");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      req.flash("error", "Please fill the details");
      return res.redirect("/login");
    } else if (!validator.isEmail(email)) {
      req.flash("error", "Please enter a valid email");
      return res.redirect("/login");
    }

    const sameEMail = await User.findOne({ email: email });
    if (!sameEMail) {
      return res.status(401).json({ message: "email not registered" });
    }
    const adminEmail = sameEMail.email;
    if (adminEmail === "admin@gmail.com" || adminEmail === "admin1@gmail.com") {
      const isPasswordValid = await bcryptjs.compare(
        password,
        sameEMail.password
      );
      if (isPasswordValid) {
        adminToken = sameEMail.token;
        console.log(adminToken);
        return res
          .status(200)
          .send({ adminToken: adminToken, email: adminEmail });
      } else {
        return res.status(401).send("not success");
      }
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      sameEMail.password
    );
    if (isPasswordValid) {
        userToken = sameEMail.token;
      return res.status(200).send({ userToken: userToken });
    } else {
      return res.status(401).json({ message: "not" });
    }
  } catch (error) {
    req.flash("error", "An error occured, please try later");
  }
};

exports.products = async (req, res) => {
  const { name, price, quantity } = req.body;
  const picturefilename = req.file.filename;
  try {
    const newListing = new Products({
      name,
      price,
      quantity,
      picture: picturefilename,
    });
    newListing.save().then(() => {
      req.flash("primary", "Listing has been successfully added");
      res.redirect("/admin");
    });
  } catch (error) {
    req.flash("error", "Some error occured");
    // res.redirect("/admin");
  }
};
exports.contacts = async (req, res) => {
  const { name, email, number, message } = req.body;
  const token = uuidv4();
  try {
    if (!validator.isEmail(email)) {
      res.status(401).send("Please enter a valid email");
    } else if (!name || !email || !number || !message) {
      res.status(401).send("Please fill all the details");
    } else if (number.toString().length !== 10) {
      res.status(401).send("Number should be atleast 10 characters long");
    } else {
      const newListing = new Contact({
        name,
        email,
        number,
        message,
        token,
      });
      newListing.save().then(() => {
        res.status(200).send("Query has been successfully registered");
      });
    }
  } catch (error) {
    res.status(401).send("An error occured, please try again later");
  }
};
