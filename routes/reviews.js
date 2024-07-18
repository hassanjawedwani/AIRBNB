const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAuthor } = require("../middlewares");
const controllersReviews = require("../constrollers/reviews");

router
  .route("/")
  .get(controllersReviews.renderReviews) // Render review route
  .post(isLoggedIn, controllersReviews.postReview); // Post review route

// Destroy Route
router.delete(
  "/:idrev",
  isLoggedIn,
  isAuthor,
  controllersReviews.destroyReview
);

module.exports = router;
