import React, { useState, useEffect } from 'react';
import {
	TextField,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Autocomplete,
} from '@mui/material';
import {
	Diagnosis,
	Entry,
	EntryWithoutId,
	HealthCheckRating,
	Patient,
} from '../../types';
import diagnoseService from '../../services/diagnoses';
import patientService from '../../services/patients';
import { toast } from 'react-hot-toast';
import { assertNever } from './EntryDetails';

interface EntryFormProps {
	patient: Patient;
	setShowEntryForm: (value: boolean) => void;
	setEntryAdded: (value: boolean) => void;
}

const AddEntryForm = ({
	patient,
	setShowEntryForm,
	setEntryAdded,
}: EntryFormProps) => {
	const [entryType, setEntryType] = useState<Entry['type']>('HealthCheck');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [specialist, setSpecialist] = useState('');
	const [diagnosisCodes, setDiagnosisCodes] = useState<Diagnosis[]>([]);
	const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);

	// State variables for specific entry types
	const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
		HealthCheckRating.Healthy
	);
	const [dischargeDate, setDischargeDate] = useState('');
	const [dischargeCriteria, setDischargeCriteria] = useState('');
	const [employerName, setEmployerName] = useState('');
	const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
	const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');

	useEffect(() => {
		// get the diagnoses data when the component mounts
		const fetchDiagnosesData = async () => {
			const data = await diagnoseService.getAllDiagnoses();
			setDiagnosisCodes(data);
		};
		fetchDiagnosesData();
	}, []);

	const diagnosisOptions = diagnosisCodes.map((diagnosis) => ({
		value: diagnosis.code,
		label: `${diagnosis.code} - ${diagnosis.name}`,
	}));

	// Map selectedDiagnosisCodes to objects with value and label properties
	const selectedDiagnosisOptions = selectedDiagnoses.map((code) => {
		const diagnosis = diagnosisCodes.find(
			(diagnosis) => diagnosis.code === code
		);
		return {
			value: code,
			label: diagnosis ? `${diagnosis.code} - ${diagnosis.name}` : code,
		};
	});

	const handleDiagnosisCodeChange = (
		_event: React.ChangeEvent<{}>,
		newValue: { value: string; label: string }[] | null
	) => {
		setSelectedDiagnoses(
			newValue ? newValue.map((option) => option.value) : []
		);
	};

	// common property values
	const baseEntry = {
		description: description,
		date: date,
		specialist: specialist,
		diagnosisCodes: diagnosisCodes
			? selectedDiagnosisOptions.map((option) => option.value)
			: undefined,
	};

	// entry object based on form values
	const mapFormToEntry = (): EntryWithoutId | undefined => {
		switch (entryType) {
			case 'HealthCheck':
				return {
					...baseEntry,
					type: 'HealthCheck',
					healthCheckRating: healthCheckRating,
				};
			case 'Hospital':
				return {
					...baseEntry,
					type: 'Hospital',
					discharge: {
						date: dischargeDate,
						criteria: dischargeCriteria,
					},
				};
			case 'OccupationalHealthcare':
				return {
					...baseEntry,
					type: 'OccupationalHealthcare',
					employerName,
					sickLeave:
						// check if either start or end date is provided
						sickLeaveStartDate || sickLeaveEndDate
							? {
									startDate: sickLeaveStartDate ? sickLeaveStartDate : null,
									endDate: sickLeaveEndDate ? sickLeaveEndDate : null,
							  }
							: null,
				};
			default:
				return assertNever(entryType);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const newEntry = mapFormToEntry();

		if (newEntry) {
			// The entry is valid
			try {
				const response = await patientService.createEntry(patient.id, newEntry);
				console.log('New entry:', response);

				// Close the form after successful entry addition
				setShowEntryForm(false);
				// Trigger re-render on PatientPage component
				setEntryAdded(true);
				toast.success('New entry added!');
			} catch (error) {
				console.error('Error adding entry:', error);
			}
		} else {
			console.error('Invalid entry:', newEntry);
		}
	};

	const renderConditionalFormFields = () => {
		switch (entryType) {
			case 'HealthCheck':
				return (
					<>
						<InputLabel htmlFor="healthCheckRating" style={{ marginTop: 10 }}>
							Health Check Rating
						</InputLabel>
						<TextField
							name="healthCheckRating"
							id="healthCheckRating"
							type="number"
							fullWidth
							value={healthCheckRating}
							onChange={(e) => setHealthCheckRating(+e.target.value)}
						/>
					</>
				);
			case 'Hospital':
				return (
					<>
						<InputLabel style={{ marginTop: 10 }}>
							Discharge date and criteria
						</InputLabel>
						<InputLabel htmlFor="dischargeDate" style={{ marginTop: 10 }}>
							Date
						</InputLabel>
						<TextField
							name="dischargeDate"
							id="dischargeDate"
							type="date"
							fullWidth
							value={dischargeDate}
							onChange={(e) => setDischargeDate(e.target.value)}
						/>
						<InputLabel htmlFor="dischargeCriteria" style={{ marginTop: 10 }}>
							Criteria
						</InputLabel>
						<TextField
							name="dischargeCriteria"
							id="dischargeCriteria"
							fullWidth
							value={dischargeCriteria}
							onChange={(e) => setDischargeCriteria(e.target.value)}
						/>
					</>
				);
			case 'OccupationalHealthcare':
				return (
					<>
						<InputLabel htmlFor="employerName" style={{ marginTop: 10 }}>
							Employer
						</InputLabel>
						<TextField
							name="employerName"
							id="employerName"
							fullWidth
							value={employerName}
							onChange={(e) => setEmployerName(e.target.value)}
						/>
						<InputLabel htmlFor="sickLeave" style={{ marginTop: 10 }}>
							Sick Leave
						</InputLabel>
						<InputLabel htmlFor="sickLeaveStartDate" style={{ marginTop: 10 }}>
							Start date
						</InputLabel>
						<TextField
							name="sickLeaveStartDate"
							id="sickLeaveStartDate"
							type="date"
							fullWidth
							value={sickLeaveStartDate}
							onChange={(e) => setSickLeaveStartDate(e.target.value)}
						/>
						<InputLabel htmlFor="sickLeaveEndDate" style={{ marginTop: 10 }}>
							End date
						</InputLabel>
						<TextField
							name="sickLeaveEndDate"
							id="sickLeaveEndDate"
							type="date"
							fullWidth
							value={sickLeaveEndDate}
							onChange={(e) => setSickLeaveEndDate(e.target.value)}
						/>
					</>
				);
			default:
				return null;
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<InputLabel htmlFor="entryType" style={{ marginTop: 20 }}>
					Entry Type
				</InputLabel>
				<Select
					label="Entry Type"
					name="entryType"
					id="entryType"
					fullWidth
					value={entryType}
					onChange={(e) => setEntryType(e.target.value as Entry['type'])}
				>
					<MenuItem value="HealthCheck">Health Check</MenuItem>
					<MenuItem value="Hospital">Hospital</MenuItem>
					<MenuItem value="OccupationalHealthcare">
						Occupational Healthcare
					</MenuItem>
				</Select>
				<TextField
					style={{ marginTop: 10 }}
					label="Description"
					type="text"
					name="description"
					fullWidth
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<InputLabel htmlFor="date" style={{ marginTop: 10 }}>
					Date
				</InputLabel>
				<TextField
					style={{ marginTop: 10 }}
					type="date"
					name="date"
					id="date"
					fullWidth
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/>
				<TextField
					style={{ marginTop: 20 }}
					label="Specialist"
					type="text"
					name="specialist"
					id="specialist"
					fullWidth
					value={specialist}
					onChange={(e) => setSpecialist(e.target.value)}
				/>
				{renderConditionalFormFields()}
				<InputLabel
					htmlFor="diagnosisCodes"
					style={{ marginTop: 10, marginBottom: 10 }}
				>
					Diagnosis codes
				</InputLabel>
				<Autocomplete
					style={{ marginBottom: 10 }}
					multiple
					id="diagnosisCodes"
					options={diagnosisOptions}
					isOptionEqualToValue={(option, value) => option.value === value.value}
					getOptionLabel={(option) => option.label} // Display code and name in the dropdown
					value={selectedDiagnosisOptions}
					onChange={handleDiagnosisCodeChange}
					renderInput={(params) => (
						<TextField
							{...params}
							name="diagnosisCodes"
							fullWidth
							value={selectedDiagnoses.join(', ')}
						/>
					)}
				/>
				<Button
					variant="contained"
					color="secondary"
					type="button"
					style={{ float: 'left' }}
					onClick={() => setShowEntryForm(false)}
				>
					Cancel
				</Button>
				<Button
					style={{
						float: 'right',
					}}
					type="submit"
					color="primary"
					variant="contained"
				>
					Add
				</Button>
			</form>
		</div>
	);
};

export default AddEntryForm;
