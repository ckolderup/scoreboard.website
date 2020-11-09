import s3 from 'aws-sdk/clients/s3';
import uuid from 'uuid';

const s3Client = new s3({
  region: 'us-west-2',
  signatureVersion: 'v4',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export async function getPresignedUploadUrl(bucket, directory) {
  const key = `${directory}/${uuid.v4()}`;
  const url = await s3Client
    .getSignedUrl('putObject', {
      Bucket: bucket,
      Key: key,
      ContentType: 'image/*',
      Expires: 300,
    })
    .promise();
  return url;
}
