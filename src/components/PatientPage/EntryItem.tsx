import { Entry, Diagnosis } from '../../types';

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

const EntryItem = ({ entry, diagnoses }: EntryItemProps) => {
	const diagnosisList = entry.diagnosisCodes?.map((code) => {
		const diagnosis = diagnoses.find((d) => d.code === code);
		return (
			<li key={code}>
				{code} - {diagnosis ? diagnosis.name : 'Unknown diagnosis'}
			</li>
		);
	});

	return (
		<div key={entry.id} style={entryStyles}>
			<p>
				{entry.date} | {entry.description}
			</p>
			<div>
				<ul>{diagnosisList}</ul>
			</div>
		</div>
	);
};

export default EntryItem;
