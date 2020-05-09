var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var app = express();

//upload files to folder img
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, './public/img/ads');
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// connect to the database:
const mongooseConnection = require("./lib/connectDB");


// auth JWT API
const jwtAuth = require("./lib/jwtAuth");
const sessionAuth = require("./lib/sessionAuth");
const loginController = require("./routes/loginController");
const privateController = require("./routes/privateController");


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").__express);

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.locals.title = 'KeepAds API';

// internationalization i18n
const i18n = require("./lib/i18nConfig")();
app.use(i18n.init);

/**
 * API routes:
 */
app.use("/apiv1/ads", upload.single('photo'), jwtAuth(), require("./routes/api/ads"));
app.use("/apiv1/tags", jwtAuth(), require("./routes/api/tags"));
app.use("/api-docs", require("./routes/api/api-docs"));
app.use("/apiv1/loginJWT", loginController.postJWT);


// Control session website
app.use(session({

  name: "keepads-session",
  secret: process.env.SESSION_KEY,
  saveUninitialized: true,
  resave: false,
  cookie: {
    secure: false, //in my case, i don't have https in local enviroment, in production the value is true
    maxAge: 1000 * 60 * 60 * 24 * 2
  },
  store: new MongoStore({ mongooseConnection })
}));

//get session to all views
app.use((req, res, next) => {

  res.locals.session = req.session;
  next();
})

/**
 * Website routes:
 */
app.use("/", require("./routes/index"));
app.use("/change-locale", require("./routes/change-locale"));
app.get("/login",   loginController.index);
app.post("/login",  loginController.post);
app.get("/logout",  loginController.logout);
app.get("/profile", sessionAuth(["admin"]), privateController.index);
//app.get("/users", sessionAuth(["admin"]), privateController.index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  
  if(err.array){
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPIUrl(req) ? { message: "Not valid", errors: err.mapped() } : `Param ${errInfo.param}, error: ${errInfo.msg}`;
  }

  //status code
  res.status(err.status || 500);

  //Error API url
  if(isAPIUrl(req)){
    res.json({
      error: err.message
    });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.render("error");
});

/** 
 * control if the API url starts with /apiv1/
 * */
const isAPIUrl = req => req.originalUrl.startsWith("/apiv1/");

module.exports = app;
