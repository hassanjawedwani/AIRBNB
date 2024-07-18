// const Listing = require('../Models/listing');
// const data = require('./data');


// // const mongooseURL = "mongodb://127.0.0.1:27017/wanderlust";

// // main().then(() => {
// //   console.log("Server is Connected to Database");
// // }).catch(err => console.log(err));

// // async function main() {
// //   await mongoose.connect(mongooseURL);
// // }

// async function initDB() {
//   await Listing.deleteMany({});
//   data.data = data.data.map(obj => ({...obj, owner: '66932678223353dcff6bcc05'}));
//   Listing.insertMany(data.data).then(()=>console.log("Data added successfully"));
// }

// initDB();