require("dotenv").config();
const express = require("express");
const { auth } = require("express-openid-connect");
const { auth0_config } = require("./config");
const cors = require("cors");
const { default: axios } = require("axios");

const server = express();
server.use(auth(auth0_config));
server.use(cors());
server.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

server.get("/userinfo", async (req, res) => {
  const { accessToken } = req.query;
  if (!accessToken) {
    return res
      .status(400)
      .json({ error: "accessToken query parameter missing" });
  }

  const { data: user } = await axios.get(
    `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  res.json(user);
});

server.get("/signoff", async (req, res) => {
  try {
    const { data } = await axios.get(
      `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=https://www.nellysugu.com/auth_front/`
    );

    console.log(data);
    res.json({ success: "logged out" });
  } catch (err) {
    console.log(err);
  }
});
