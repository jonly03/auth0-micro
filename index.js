require("dotenv").config();
const express = require("express");
const { auth } = require("express-openid-connect");
const { auth0_config } = require("./config");
const cors = require("cors");

const server = express();
server.use(auth(auth0_config));
server.use(cors());
server.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

server.get("/myLogin", (req, res) => {
  res.redirect(
    301,
    "https://dev-v8yhc0o7.us.auth0.com/authorize?response_type=token&client_id=tM4rxIGpbjNLFjuWxNcojBsOCy1hIQzP&redirect_uri=https://alan-auth.herokuapp.com/loggedIn"
  );
});

server.get("/", (req, res) => {
  console.log(req.oidc.user);
  if (req.oidc.isAuthenticated()) {
    return res.json({ user: req.oidc.user });
  }

  res.redirect("/myLogin");
});

server.get("/callback", (req, res) => {
  res.send("<p>test</p>");
});

server.get("/loggedIn", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.json({
      isAuthenticated: true,
      user: req.oidc.user,
    });
  }

  return res.json({ isAuthenticated: false });
});

// server.get("/", (req, res) => {
//   if (req.oidc.isAuthenticated()) {
//     console.log(req);
//     return res.sendFile(__dirname + "/logged-in.html");
//   }

//   return res.sendFile(__dirname + "/logged-out.html");
// });
