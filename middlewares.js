const Listing = require("./Models/listing");
const Review = require("./Models/reviews");

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("success", "User must be logged in to continue");
    return res.redirect("/login");

  }
  next();
}

module.exports.newRedirectedUrl = (req, res, next) => {
  if(req.session.redirectUrl) {
    res.locals.newURL = req.session.redirectUrl;  
  }
  next();
}

module.exports.isOwner = async(req, res, next) => {
  const {id} = req.params;
  const list = await Listing.findById(id);
  if (!list.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("success","You aren't owner of this post");
    return res.redirect(`/listings/${id}`); 
  }
  next();
}


module.exports.isAuthor = async(req, res, next) => {
  const {id, idrev} = req.params;
  const review = await Review.findById(idrev);
  if(!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "you are not author of this post");
    return res.redirect(`/listings/${id}`);
  }
  next();
}