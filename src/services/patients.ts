import { EntryWithoutId, Patient, PatientFormValues } from '../types';
import axiosInstance from '../axiosInstance';

const getAll = async () => {
	const { data } = await axiosInstance.get<Patient[]>(`/patients`);

	return data;
};

const get = async (id: string) => {
	const { data } = await axiosInstance.get<Patient>(`/patients/${id}`);
	return data;
};

const create = async (object: PatientFormValues) => {
	console.log('PatientFormValues:', object);
	const { data } = await axiosInstance.post<Patient>(`/patients`, object);
	return data;
};

const createEntry = async (id: string, entry: EntryWithoutId) => {
	console.log('createEntry entry: ', entry);
	const { data } = await axiosInstance.post<Patient>(
		`/patients/${id}/entries`,
		entry
	);
	return data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	getAll,
	get,
	create,
	createEntry,
};
