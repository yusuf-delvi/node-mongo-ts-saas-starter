import * as AWS from 'aws-sdk';
import { aws as awsConfig } from '.';

AWS.config.update({
	accessKeyId: awsConfig.accessKeyId,
	secretAccessKey: awsConfig.secretAccessKey,
	region: awsConfig.region,
});

export default AWS;
export const s3 = new AWS.S3();
export const ses = new AWS.SES();
