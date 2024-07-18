if(process.env.NODE_ENV !="production") {
  require('dotenv').config()
}
console.log(process.env.CLOUD_NAME);

// Imports
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override")
const engine = require('ejs-mate');
const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");
const usersRouter = require("./routes/users");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const User = require("./Models/user");


const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Database Connection Successful")
}
main().catch(err => console.log(err));


// App Instance
const app = express();

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log(error);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};



// Configration and Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "./public")))
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// middleware
app.use((req, res, next) => {
  res.locals.message = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

// Routes
// app.get("/", (req, res) => {
//   res.send("Root Directory");
// })
 
// Listing and Review Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", usersRouter);





// Error handling Middleware
app.use((err, req, res, next) => {
  // res.send("Some error is occured");
  next();
})


// Server Setup
const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});