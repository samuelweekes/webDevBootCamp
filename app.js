var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    User          = require("./models/user"),
    flash         = require("connect-flash"),
    seedDB        = require("./seeds"),
    Comment       = require("./models/comment"),
    methodOverride = require("method-override");

//Required Routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");


//("mongodb://localhost/yelp_camp");
//"mongodb://Samuel:Fcf9zgpt@ds115198.mlab.com:15198/bearlyblogging"
mongoose.connect(process.env.DATABASEURL);


app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB(); //Seed the db

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Nelly is the cutest dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Server start
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started...");
});