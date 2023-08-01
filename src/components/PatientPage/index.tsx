import { FemaleSharp, MaleSharp, TransgenderSharp } from '@mui/icons-material';
import { Typography } from '@mui/material';
import patientService from '../../services/patients';
import diagnoseService from '../../services/diagnoses';
import { Gender, Patient, Diagnosis } from '../../types';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EntryDetails from './EntryDetails';
import { Button } from '@mui/material';
import AddEntryForm from './AddEntryForm';

const PatientPage = () => {
	const [patient, setPatient] = useState<Patient | null>(null);
	const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
	const [showEntryForm, setShowEntryForm] = useState(false);
	const [entryAdded, setEntryAdded] = useState(false);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		// only fetch patient data when id is not undefined
		if (id) {
			const getPatient = async () => {
				try {
					const patientData = await patientService.get(id);
					setPatient(patientData);
				} catch (error) {
					console.error(error);
				}
			};

			getPatient();
			const getDiagnoses = async () => {
				try {
					const diagnosesData = await diagnoseService.getAll();
					setDiagnoses(diagnosesData);
				} catch (error) {
					console.error(error);
				}
			};
			getDiagnoses();

			// Set entryAdded back to false after fetching patient data
			setEntryAdded(false);
		}
	}, [id, entryAdded]);

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
			{showEntryForm && (
				<AddEntryForm
					patient={patient}
					setShowEntryForm={setShowEntryForm}
					setEntryAdded={setEntryAdded}
				/>
			)}
			<h2 style={{ marginTop: 50 }}>entries</h2>
			<div>
				{patient.entries.map((entry) => (
					<EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
				))}
			</div>
			{!showEntryForm && (
				<Button
					variant="contained"
					color="primary"
					onClick={() => setShowEntryForm(true)}
				>
					Add new entry
				</Button>
			)}
		</>
	) : (
		<div>Loading patient data...</div>
	);
};

export default PatientPage;
