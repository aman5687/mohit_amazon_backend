const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ImageModel = require("../image.model");
const { v4: uuidv4 } = require("uuid");
const Contact = require("../contact");
const fs = require("fs");
const Gallery = require("../gallery");
const Order = require("../orderModel");

const token = uuidv4();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../e-bag/src/uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "_" + Date.now() + ext);
  },
});

const upload = multer({ storage }).single("image");

// Configure multer for gallery upload
const storageGallery = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../e-bag/src/gallery/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "_" + Date.now() + ext);
  },
});

const uploadGallery = multer({ storage: storageGallery });

// POST route to handle image uploads
router.post("/upload", async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Image upload failed" });
      }

      const user = new ImageModel({
        name: req.body.name,
        price: req.body.price,
        token: uuidv4(),
        quantity: req.body.quantity,
        image: req.file.filename,
      });

      await user.save();

      res.status(200).send({ message: "Image uploaded successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Image upload failed" });
  }
});

// Other routes
router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/getUsers", (req, res) => {
  Contact.find()
    .exec()
    .then((users) => {
      res.status(200).send({ message: "Done", users: users });
      console.log(users);
    })
    .catch((err) => {
      res.status(401).send({ message: "Error" });
    });
});

router.get("/getStocks", (req, res) => {
  ImageModel.find()
    .exec()
    .then((stocks) => {
      const dataWithimages = [];
      stocks.forEach((stock) => {
        const ImagePath = path.join(__dirname, "uploads", stock.image);
        const image = {
          name: stock.image,
          data: ImagePath,
        };
        dataWithimages.push(image);
      });
      res.status(200).send({ stocks: stocks, images: dataWithimages });
    })
    .catch((err) => {
      res.status(401).send({ message: "Error" });
    });
});
router.get("/login", (req, res) => {
  const errorMessage = req.flash("error")[0] || null;
  res.render("login", { error: errorMessage });
});

router.get("/admin", (req, res) => {
  const loggedinUserToken = req.session.userToken;
  if (loggedinUserToken) {
    res.render("admin");
  } else {
    res.redirect("/login");
  }
});

router.get("/register", (req, res) => {
  const errorMessage = req.flash("error")[0] || null;
  const primaryMessage = req.flash("primary")[0] || null;
  res.render("register", { error: errorMessage, primary: primaryMessage });
});

router.get("/users", (req, res) => {
  const loggedinUserToken = req.session.userToken;
  if (loggedinUserToken) {
    res.render("users");
  } else {
    res.redirect("/login");
  }
});

// delete api to delete contact user
router.get("/delete/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const deletedUser = await Contact.findOneAndDelete({ token });

    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error" });
  }
});

router.post("/update/:token", upload, async (req, res) => {
  let token = req.params.token;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlink("../e-bag/src/uploads/" + req.body.old_image, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Old image deleted successfully");
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    new_image = req.body.old_imge;
  }

  const updatedUser = await ImageModel.findOneAndUpdate(
    { token: token },
    {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      image: new_image,
    },
    { new: true }
  );
  if (!updatedUser) {
    res.status(401).send({ message: "Error" });
  }
  res.status(200).send({ message: "Success" });
});

// delete api to delete stock
router.get("/deleteStock/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const deletedUser = await ImageModel.findOneAndDelete({ token });

    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    if (deletedUser.image) {
      try {
        fs.unlinkSync("../e-bag/src/uploads/" + deletedUser.image);
      } catch (error) {
        console.error(error);
      }
    }
    res.status(200).send({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error" });
  }
});

router.get("/edit/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await ImageModel.findOne({ token: token });

    if (!user) {
      return res.redirect("/");
      // console.log("no user")
    }

    res.status(200).send({ user: user });
    // res.render("edit_user", { title: "Edit", user });
  } catch (err) {
    console.error(err);
    // res.redirect("/");
  }
});

router.post(
  "/gallery",
  uploadGallery.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const imageFile = req.files["image"] ? req.files["image"][0] : null;
      const videoFile = req.files["video"] ? req.files["video"][0] : null;

      if (!imageFile && !videoFile) {
        return res
          .status(400)
          .send({ message: "Either Image or video file is required." });
      }

      if (imageFile && videoFile) {
        const gallery = new Gallery({
          video: videoFile.filename,
          token: uuidv4(),
          image: imageFile.filename,
        });
        await gallery.save();
        res
          .status(200)
          .send({ message: "Image and video uploaded successfully" });
      } else if (imageFile) {
        const gallery = new Gallery({
          image: imageFile.filename,
          token: uuidv4(),
        });
        await gallery.save();
        res.status(200).send({ message: "Image uploaded successfully" });
      } else if (videoFile) {
        const gallery = new Gallery({
          video: videoFile.filename,
          token: uuidv4(),
        });
        await gallery.save();
        res.status(200).send({ message: "Video uploaded successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Image and video upload failed" });
    }
  }
);


router.get("/getGallery", (req, res) => {
  Gallery.find()
    .exec()
    .then((galleryData) => {
      res.status(200).send({ galleryData });
      console.log(galleryData.image);
    })

    .catch((err) => {
      res.status(401).send({ message: "Error" });
    })
})


router.get("/gallery/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const galleryData = await Gallery.findOneAndDelete({ token });

    if (!galleryData) {
      res.status(400).send({ message: "No data" });
    }
    if (galleryData.image) {
      try {
        fs.unlinkSync("../e-bag/src/uploads/" + galleryData.image);
      } catch (error) {
        console.error(error);
      }
    }
    res.status(200).send({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error" });
  }
});


router.post("/order", async (req, res) => {
  try {
    const customerName = req.body.customerName;
    const number = req.body.mobile;
    const token = uuidv4();
    const email = req.body.email;
    const quantity = req.body.quantity;
    const totalPrice = req.body.totalPrice;
    const currentAddress = req.body.currentAddress;
    const permanentAddress = req.body.permanentAddress;

    const errors = [];

    if (!customerName) {
      errors.push("Please enter your name");
    }
    if (!number) {
      errors.push("Please enter your name");
    } if (!email) {
      errors.push("Please enter your name");
    } if (!quantity) {
      errors.push("Please enter your name");
    }

    if (errors.length > 0) {
      res.status(401).json({ errors });
    } else {
      const order = new Order({
        customerName,
        number,
        token,
        email,
        quantity,
        totalPrice,
        currentAddress,
        permanentAddress,
      })
      const savedOrder = await order.save();

      if (savedOrder) {
        res.status(200).send({ message: "You have placed an order" });
      } else {
        res.status(401).send({ message: "Your order could not be placed" });
      }
    }
  } catch (error) {
    res.status(401).json({error});  
  }
})

module.exports = router;
