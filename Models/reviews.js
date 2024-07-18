const mongoose = require('mongoose');

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
//   console.log("Connection success with database");
// }

// main().catch(err => console.log("Error in connection with database: ", err));

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;