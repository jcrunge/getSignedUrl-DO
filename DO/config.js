const aws = require("aws-sdk");
/**
 * DigitalOcean endpoint spaces
 */
const functions = require("firebase-functions");
const DO = {
  AWS_REGION: functions.config().do.region || "nyc3",
  AWS_ACCESS_KEY_ID: functions.config().do.keyid,
  AWS_SECRET_ACCESS_KEY: functions.config().do.secretaccesskey,
  AWS_BUCKET: functions.config().do.bucket,
};

// eslint-disable-next-line max-len
const spacesEndpoint = new aws.Endpoint(`${DO.AWS_REGION}.digitaloceanspaces.com`);

/**
 * S3 from aws-sdk to set up the digitalOcean endpoint
 */



const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  region: DO.AWS_REGION,
  accessKeyId: DO.AWS_ACCESS_KEY_ID,
  secretAccessKey: DO.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

module.exports = {s3, DO};
