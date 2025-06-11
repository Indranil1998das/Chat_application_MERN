const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config({ path: "config/.env" });
const ErrorThrow = require("../utils/ErrorThrow");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.ACCESSKEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});
exports.getObjectURLfromS3 = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: "chatapplication-2025-photos",
      Key: key,
    });
    const url = await getSignedUrl(Client, command);
    return url;
  } catch (error) {
    return new ErrorThrow(`Error generating signed URL:, ${error}`, 404);
  }
};

exports.putObjectToS3 = async (ContentType, key, buffer) => {
  try {
    const command = new PutObjectCommand({
      Bucket: "chatapplication-2025-photos",
      Key: key,
      Body: buffer,
      ContentType: ContentType,
    });
    await Client.send(command);
  } catch (error) {
    return new ErrorThrow(`Error generating signed URL:, ${error}`, 404);
  }
};

exports.putObjectURLfromS3 = async (filename, ContentType) => {
  try {
    const command = new PutObjectCommand({
      Bucket: "chatapplication-2025-photos",
      Key: `${process.env.UPLOADS_DIR_FILES}${filename}`,
      ContentType: ContentType,
    });
    const url = await getSignedUrl(Client, command);
    return {
      url: url,
      key: `${process.env.UPLOADS_DIR_FILES}${filename}`,
    };
  } catch (error) {
    return new ErrorThrow(`Error generating signed URL:, ${error}`, 404);
  }
};

exports.deleteObjectFromS3 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: "chatapplication-2025-photos",
      Key: key,
    });
    const response = await Client.send(command);
    return response;
  } catch (error) {
    return new ErrorThrow(`Error deleting object from S3: ${error}`, 404);
  }
};
