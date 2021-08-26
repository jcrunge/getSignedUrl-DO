const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");
const getSignedURL = require("./DO/DO");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "128MB",
};


app.get("/file/signed/url", async (req, res) => {
  const {mimetype} = req.query;
  const signedResponse = await getSignedURL(mimetype);
  return res.status(signedResponse.status).json(signedResponse);
});

exports.api = functions.runWith(runtimeOpts).https.onRequest(app);

