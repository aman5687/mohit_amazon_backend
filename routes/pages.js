const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const ImageModel = require("../image.model");

// Configure multer for image upload
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });


// cloudinary config
cloudinary.config({
  cloud_name: 'djrh8oflc',
  api_key: '544113442678141',
  api_secret: 'G6AKEYGFz2eiEcVHXg-4myu5cXg'
});



// POST route to handle image uploads
router.post('/amazonApp', upload.single('image'), async (req, res) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const category = req.body.category;

  const cloudinaryUploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'amazonApp' }, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error"
      });
    }
  });

  const imageUrl = cloudinaryUploadResult.secure_url;

  const user = new ImageModel({
    title,
    price,
    description,
    category,
    image: imageUrl, 
  });
  await user.save();

  res.status(200).json({
    success: true,
    message: "Uploaded!",
    // data: result
    // user: user
  });
});



// get route to handle image from cloudinary and db
router.get('/amazonApp', async (req, res) => {
  ImageModel.find()
    .exec()
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error retrieving images and data" });
    })
});



module.exports = router;
