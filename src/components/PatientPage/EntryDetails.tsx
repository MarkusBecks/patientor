import { Entry, Diagnosis, HealthCheckRating } from '../../types';
import {
	LocalHospitalRounded,
	WorkRounded,
	Favorite,
	MedicalInformationRounded,
} from '@mui/icons-material';

interface EntryItemProps {
	entry: Entry;
	diagnoses: Diagnosis[];
}

const entryStyles = {
	marginBottom: 10,
	padding: '0px 10px',
	border: '1px solid black',
	borderRadius: 5,
};

// helper for rendering the correct colored icon
const getHealthCheckRatingColor = (rating: HealthCheckRating): string => {
	switch (rating) {
		case HealthCheckRating.Healthy:
			return 'green';
		case HealthCheckRating.LowRisk:
			return 'yellow';
		case HealthCheckRating.HighRisk:
			return 'blue';
		case HealthCheckRating.CriticalRisk:
			return 'red';
		default:
			return 'black';
	}
};

// helper for exhaustive type checking
export const assertNever = (value: never): never => {
	throw new Error(`Unhandled value: ${value}`);
};

const EntryDetails = ({ entry, diagnoses }: EntryItemProps) => {
	const diagnosisList = entry.diagnosisCodes?.map((code) => {
		const diagnosis = diagnoses.find((d) => d.code === code);
		return (
			<li key={code}>
				{code} - {diagnosis ? diagnosis.name : 'Unknown diagnosis'}
			</li>
		);
	});

	// render icons based on entry type
	const getEntryIcons = () => {
		switch (entry.type) {
			case 'HealthCheck':
				return (
					<>
						<MedicalInformationRounded />
						<Favorite
							style={{
								color: getHealthCheckRatingColor(entry.healthCheckRating),
							}}
						/>
					</>
				);
			case 'Hospital':
				return <LocalHospitalRounded />;
			case 'OccupationalHealthcare':
				return (
					<>
						<WorkRounded /> {entry.employerName}
					</>
				);
			default:
				return assertNever(entry);
		}
	};

	return (
		<div key={entry.id} style={entryStyles}>
			<p>
				{entry.date} {getEntryIcons()}
			</p>
			<p>{entry.description}</p>
			<p>diagnose by {entry.specialist}</p>
			<div>
				<ul>{diagnosisList}</ul>
			</div>
		</div>
	);
};

export default EntryDetails;
