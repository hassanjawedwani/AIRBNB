const Listing = require("../Models/listing");
const Review = require("../Models/reviews");

module.exports.renderReviews = (req, res) => {
  const {id} = req.params;
  res.render("review", {id})
}

module.exports.postReview = async(req, res) => {
  try {
    const {id} = req.params;
    const list = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("success", "Review Added");
    res.redirect(`/listings/${id}`)
  } catch(err)  {
    console.error(err);
  }
};

module.exports.destroyReview = async(req, res) => {
  const {id, idrev} = req.params;
  const post = await Listing.findByIdAndUpdate(id, {$pull: {reviews: idrev}});
  const deletedRev = await Review.findByIdAndDelete(idrev);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`)
}