// Mapper for environment variables
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const timezone = process.env.TZ;
export const jwtSecret = process.env.JWT_SECRET;
export const frontEndHost = process.env.FRONT_END_HOST;

export const db = {
	name: process.env.DB_NAME || '',
	host: process.env.DB_HOST || '',
	port: process.env.DB_PORT || '',
	user: process.env.DB_USER || '',
	password: process.env.DB_USER_PWD || '',
	minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
	maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
};

export const corsUrl = process.env.CORS_URL;

export const tokenInfo = {
	accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
	refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
	issuer: process.env.TOKEN_ISSUER || '',
	audience: process.env.TOKEN_AUDIENCE || '',
};

export const logDirectory = process.env.LOG_DIR;

export const redis = {
	host: process.env.REDIS_HOST || '',
	port: parseInt(process.env.REDIS_PORT || '0'),
	password: process.env.REDIS_PASSWORD || '',
};

export const caching = {
	contentCacheDuration: parseInt(
		process.env.CONTENT_CACHE_DURATION_MILLIS || '600000',
	),
};

export const aws = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	s3AssetsBucket: process.env.S3_ASSETS_BUCKET,
	s3AssetsBucketTemp: process.env.S3_ASSETS_BUCKET_TEMP,
	senderEmail: process.env.SES_SENDER_EMAIL,
	cloudFrontUrl: process.env.CLOUDFRONT_URL,
};

export const googleClient = {
	clientId: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

export const stripeAccount = {
	secretKey: process.env.STRIPE_SECRET_KEY,
	priceIdPremium: process.env.PRICE_ID_PREMIUM,
	webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};
