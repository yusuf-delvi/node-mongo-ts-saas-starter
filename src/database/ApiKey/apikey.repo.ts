import { ApiKeyModel } from './apikey.model';
import ApiKey from './apikey.types';

async function findByKey(key: string): Promise<ApiKey | null> {
	return ApiKeyModel.findOne({ key: key, status: true }).lean().exec();
}

export default {
	findByKey,
};
