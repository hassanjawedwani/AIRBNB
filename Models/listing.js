const requireDefaultProps = require("eslint-plugin-react/lib/rules/require-default-props");
const mongoose = require("mongoose");
const Review = require("./reviews");

const listingSchema = new mongoose.Schema({
  title : {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    url: String,
    filename: String
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  geometry: {
    name: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  }
});

listingSchema.post("findOneAndDelete", async(list) => {
if(list) {
  await Review.deleteMany({_id  : {$in: list.reviews}})
}
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;