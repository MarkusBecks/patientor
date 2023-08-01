import { Diagnosis } from '../types';
import { apiBaseUrl } from '../constants';
import axiosInstance from '../axiosInstance';

const getAll = async () => {
	const { data } = await axiosInstance.get<Diagnosis[]>(
		`${apiBaseUrl}/diagnoses`
	);

	return data;
};

const getAllDiagnoses = async () => {
	try {
		const { data } = await axiosInstance.get<Diagnosis[]>(
			`${apiBaseUrl}/diagnoses`
		);
		const diagnosesWithCodeAndName = data.map((diagnosis) => ({
			code: diagnosis.code,
			name: diagnosis.name,
		}));
		return diagnosesWithCodeAndName;
	} catch (error) {
		console.error('Error fetching diagnoses:', error);
		return [];
	}
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	getAll,
	getAllDiagnoses,
};
