var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var app = express();

// connect to the database:
require("./lib/connectDB");


const jwtAuth = require("./lib/jwtAuth");
const loginController = require("./routes/loginController");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").__express);

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


/**
 * API routes:
 */
app.use("/apiv1/ads", jwtAuth(), require("./routes/api/ads"));
app.use("/apiv1/tags", require("./routes/api/tags"));
app.use("/api-docs", require("./routes/api/api-docs"));
app.use("/apiv1/loginJWT", loginController.postJWT);

/**
 * Website routes:
 */
app.use("/", require("./routes/index"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  
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
