import { FemaleSharp, MaleSharp, TransgenderSharp } from '@mui/icons-material';
import { Typography } from '@mui/material';
import patientService from '../../services/patients';
import diagnoseService from '../../services/diagnoses';
import { Gender, Patient, Diagnosis } from '../../types';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EntryItem from './EntryItem';

const PatientPage = () => {
	const [patient, setPatient] = useState<Patient | null>(null);
	const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		// only fetch patient data when id is not undefined
		if (id) {
			const getPatient = async () => {
				try {
					const patientData = await patientService.get(id);
					setPatient(patientData);
				} catch (error) {
					console.error('error fetching patient', error);
				}
			};
			getPatient();
			const getDiagnoses = async () => {
				try {
					const diagnosesData = await diagnoseService.getAll();
					setDiagnoses(diagnosesData);
				} catch (error) {
					console.error('error fetching diagnoses', error);
				}
			};
			getDiagnoses();
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
			<div>
				<Typography fontWeight={700} fontSize={26} mt={4} mb={4}>
					{patient.name} {getGenderIcon()}
				</Typography>
			</div>
			<div>occupation: {patient.occupation} </div>
			<div>ssn: {patient.ssn ? patient.ssn : 'nothing to show here'} </div>
			<h2>entries</h2>
			<div>
				{patient.entries.map((entry) => (
					<EntryItem key={entry.id} entry={entry} diagnoses={diagnoses} />
				))}
			</div>
		</>
	) : (
		<div>Loading patient data...</div>
	);
};

export default PatientPage;
