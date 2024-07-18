const User = require("../Models/user");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup");
}

module.exports.renderLogin =  (req, res) => {
  res.render("users/login");
}

module.exports.logout =  (req, res, next) => {
  req.logout(err => {
    if(err) {
      next(err);
    }
    req.flash("success", "You are logged out successfully");
    res.redirect("/listings");  
  })
 
}

module.exports.signup = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    const newUser = new User({
      username,
      email
    });
    const addedUser = await User.register(newUser, password);
    req.login(addedUser, (err => {
      if(err) {
        console.log(err);
      }
      req.flash("success", "User registered successfully");
    console.log(addedUser);
    res.redirect("/listings");
    }));
    
  } catch(err) {
    req.flash("success", err.message);
    res.redirect("/signup");
  }
}

module.exports.login = async(req, res) => {
  req.flash("success", "Welcome back to wanderlust");
  const redirectAt = res.locals.newURL || "/listings"
  if(redirectAt) {
    res.redirect(redirectAt);
  }
  
}