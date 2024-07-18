const Listing = require("../Models/listing");
const wrapAsync = require("../utilities/wrapAsync");


module.exports.index = async(req, res) => {  
  const listings = await Listing.find({});
  res.render("listings", {listings});
}

module.exports.renderEditList =  async (req, res) => {
  const {id} = req.params;
  const list = await Listing.findById(id);
  if(!list) {
    req.flash("success", "list has been removed");
    res.redirect("/listings");
  }
  const previewImage = list.image.url.replace("/upload", "/upload/w_300");
  console.log(previewImage)
  res.render("edit", {list, previewImage});
}

module.exports.renderCreateList = (req, res) => {
  res.render("new");
}

module.exports.renderShowList = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner")
    .populate("geometry");
  if (!list) {
    req.flash("success", "list has been removed");
    res.redirect("/listings");
  }
  res.render("list", { list });
});

module.exports.postList =  async (req, res) => {
  try {

    // Function to fetch coordinates from Nominatim
    async function getCoordinates(location) {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Location not found');
      }
    
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }
    
    // Function to convert coordinates to GeoJSON
    function toGeoJSON(lat, lon) {
      return {
        type: "Point",
        coordinates: [lon, lat]
      };
    }

    // Main Logic
    const url = req.file.url;
    const filename = req.file.public_id;
    const { title, description,image, price, location, country } = req.body;
    const { lat, lon } = await getCoordinates(location);
    const geoJSON = toGeoJSON(lat, lon);
    const geometry = {
      name: location,
      location: geoJSON
    };
    
    const list = await new Listing({
      title,
      description,
      image: {url, filename},
      price,
      location,
      country,
      owner: req.user._id,
      geometry
    });

    list
      .save()
      .then(() => {
        req.flash("success", "new listing created successfully");
        res.redirect("/listings");
      })
      .catch((err) => console.log(err));
    
  } catch (err) {
    console.log("Route: error occured");
    next(err);
  }
}

module.exports.updateList = async (req, res) => {
  const { id } = req.params;
  let { title, description, price, location, country } = req.body;
  const list = {
    title,
    description,
    price,
    location,
    country,
  };
  if(typeof req.file !== undefined) {
    const url = req.file.url;
    const filename = req.file.public_id;
    list.image = {url, filename};
    console.log(req.file);
  }
  Listing.findByIdAndUpdate(id, list)
    .then(() => res.redirect(`/listings/${id}`))
    .catch((err) => console.log(err));
}

module.exports.destroyList = (req, res) => {
  const { id } = req.params;
  console.log(id);
  Listing.findByIdAndDelete(id)
  .then(() => {
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
  .catch((err) => console.log(err));
}