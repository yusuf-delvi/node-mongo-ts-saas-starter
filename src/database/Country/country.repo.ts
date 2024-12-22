import { CountryModel } from './country.model';
import Country from './country.types';

async function findAll(): Promise<Country[] | []> {
	return CountryModel.find({})
		.select('_id name phoneCode iso3 iso2 flag flagU')
		.lean()
		.exec();
}

async function findById(id: number): Promise<Country | null> {
	return CountryModel.findOne({ _id: id }).lean().exec();
}

export default {
	findAll,
	findById,
};
