const jwt = require("jsonwebtoken");
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var cors = require("cors");
const userRoute = require("./routes/userRoute");
const dotenv = require("dotenv");
dotenv.config();
const Message = require("./models/messageModel");
const jwtSecret = process.env.JWT_SECRET;
const ws = require("ws");
const fs = require("fs");
const http = require("http");
const cookieParser = require("cookie-parser")
app.use(cookieParser());

// upload photo
const path = require("path");

app.use(express.static(path.join(__dirname, `./public`)));
//middle
app.use(express.json());

// handle cors  // any domain
const _cor = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(_cor));

//  handle path
app.use("/users", userRoute);

/// messages 
app.use('/uploads', express.static(__dirname + '/uploads'));


async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                resolve(userData);
            });
        } else {
            reject("NO tOKEN MAN!");
        }
    });
}

app.get("/messages/:userId", async (req, res) => {
    const { userId } = req.params;
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;
    const messages = await Message.find({
        sender: { $in: [userId, ourUserId] },
        receiver: { $in: [userId, ourUserId] },
    }).sort({
        createdAt: 1,
    });
    res.json(messages);
});

app.get('/people', async (req, res) => {
  const users = await User.find({}, { '_id': 1, username: 1 });
  res.json(users);
});

// app.get("/profile", (req, res) => {
//   const token = req.cookies?.token;
//   console.log(token);
//   if (token) {
//       jwt.verify(token, jwtSecret, {}, (err, data) => {
//           if (err) throw err;
//           res.json(data);
//       });
//   } else {
//       res.status(400).json("NO TOKEN YA 3M");
//   }
// });

// connect to database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(function () {
    console.log("TalkWave db is connect");
  })
  .catch(function (err) {
    console.log(err);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening ^_^`);
});

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeaple() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((client) => ({
            userId: client.userId,
            username: client.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;
  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeaple();
    }, 1000);
  }, 5000);
  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  // console.log("connected ya seedy 5lsna");
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, data) => {
          if (err) throw err;
          const { userId, username } = data;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    // console.log(messageData);
    const { receiver, text, file } = messageData;
    if (file) {
      console.log("size", file.data.length);
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + "/uploads/" + filename;
      const bufferData = new Buffer(file.data.split(",")[1], "base64");
      fs.writeFile(path, bufferData, () => {
        console.log("file saved:" + path);
      });
    }
    if (receiver && (text || file)) {
      // console.log(receiver + ": " + text);
      const messageDoc = await Message.create({
        sender: connection.userId,
        receiver,
        text,
        file: file ? filename : null,
      });
      [...wss.clients]
        .filter((c) => c.userId === receiver)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              receiver,
              file: file ? filename : null,
              _id: messageDoc._id,
            })
          )
        );
    } else {
      console.log("Failed to get message -_-");
    }
  });
  notifyAboutOnlinePeaple();
});

//error haddling Middleware
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const User = require("./models/userModel");
app.use(notFound);
app.use(errorHandler);