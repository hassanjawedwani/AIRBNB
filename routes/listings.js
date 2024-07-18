const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middlewares");
const controllersListings = require("../constrollers/listings");
const multer = require('multer');
const { storage } = require("../cloudConfig");
const upload = multer({ storage: storage });


router
  .route("/")
  .get(controllersListings.index) // Render Listings
  .post(isLoggedIn, upload.single('image'), controllersListings.postList); // Post List Route

// Create list route
router.get("/new", isLoggedIn, controllersListings.renderCreateList);

router
  .route("/:id")
  .get(controllersListings.renderShowList) // Render List
  .put(isLoggedIn, isOwner, upload.single('image'), controllersListings.updateList) // Update list route
  .delete(isLoggedIn, isOwner, controllersListings.destroyList); // Destroy list route

// Edit list route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  controllersListings.renderEditList
);

module.exports = router;
