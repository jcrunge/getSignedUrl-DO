const {s3, DO} = require("./config");
const Bluebird = require("bluebird");
const {v4} = require("uuid");

// only for video image and audio
const mimeTypeAllowed = [
  "video", "image", "audio",
];

const s3Params = {
  Bucket: DO.AWS_BUCKET,
  Expires: 60 * 60,
  // Key: "temp/temp.jpeg",
  // ContentType: "image/jpeg",
  ACL: "public-read",
};

// eslint-disable-next-line require-jsdoc
module.exports = async function getSignedURL(mimetype) {
  try {
    const mediaType = mimetype.split("/")[0];
    if (mimeTypeAllowed.indexOf(mediaType) !== -1) {
      const typeFile = mimetype.split("/")[1];
      const fileName = `${v4()}.${typeFile}`;
      s3Params.Key =`temp/${fileName}`;
      s3Params.ContentType = mimetype;
      return new Bluebird((resolve, reject) => {
        s3.getSignedUrl("putObject", s3Params, (err, url) => {
          if (err) return reject(new Error(err));
          return resolve({
            status: 200,
            url: url,
            nameFile: fileName,
            err: {},
          });
        });
      })
          .catch((e)=>{
            return {
              status: 500,
              err: e.message,
            };
          });
    }
    return {
      status: 400,
      url: "",
      err: {},
    };
  } catch (e) {
    return {
      status: 500,
      err: e,
    };
  }
};
