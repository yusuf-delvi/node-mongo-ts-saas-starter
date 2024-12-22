import { CityModel } from './city.model';
import City from './city.types';

async function findByCountry(countryId: number): Promise<City[] | []> {
	return CityModel.find({ country: countryId })
		.select('_id name')
		.lean()
		.exec();
}

async function findById(id: number): Promise<City | null> {
	return CityModel.findOne({ _id: id }).lean().exec();
}

export default {
	findById,
	findByCountry,
};
