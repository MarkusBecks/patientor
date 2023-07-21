import { FemaleSharp, MaleSharp, TransgenderSharp } from '@mui/icons-material';
import { Typography } from '@mui/material';
import patients from '../../services/patients';
import { Gender, Patient } from '../../types';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const PatientPage = () => {
	const [patient, setPatient] = useState<Patient | null>(null);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		// only fetch patient data when id is not undefined
		if (id) {
			const getPatient = async () => {
				const patientData = await patients.get(id);
				setPatient(patientData);
			};
			getPatient();
		}
	}, [id]);

	const getGenderIcon = () => {
		if (patient) {
			switch (patient.gender) {
				case Gender.Male:
					return <MaleSharp />;
				case Gender.Female:
					return <FemaleSharp />;
				case Gender.Other:
					return <TransgenderSharp />;
				default:
					return null;
			}
		}
	};

	return patient ? (
		<>
			<h2>Patient details</h2>
			<div>
				<Typography fontWeight={700}>
					{patient.name} {getGenderIcon()}
				</Typography>
			</div>
			<div>occupation: {patient.occupation} </div>
			<div>ssn: {patient.ssn ? patient.ssn : 'nothing to show here'} </div>
		</>
	) : (
		<div>Loading patient data...</div>
	);
};

export default PatientPage;
