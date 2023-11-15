var express = require("express");
var app = express();
var mongoose = require("mongoose");
var cors = require("cors");
const userRoute = require("./routes/userRoute"); 
const dotenv = require("dotenv");
dotenv.config();
// upload photo
const path = require("path");

app.use(express.static(path.join(__dirname,`./public`)))
//middle
app.use(express.json());

// handle cors  // any domain
app.use(cors());

//  handle path
app.use("/users", userRoute);

//error haddling Middleware
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

// connect to database
mongoose
  .connect(
    process.env.MONGODB_URL
  )
  .then(function () {
    console.log("TalkWave db is connect");
  })
  .catch(function (err) {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server listening on port (${process.env.PORT})`);
});