var express = require("express");
var app = express();
var mongoose = require("mongoose");
var cors = require("cors");
const userRoute = require("./routes/userRoute"); 
const dotenv = require("dotenv");
dotenv.config();
const ws = require("ws")
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

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening ^_^`);
});

const wss = new ws.WebSocketServer({server});
wss.on('connection', (connection, req)=>{
  

  // read username and id form the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
    // console.log(tokenCookieString);
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      // console.log(token);
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          console.log(userData);
          const {userId, username} = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

})