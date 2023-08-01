import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { CloseSharp } from '@mui/icons-material';

const Notifications = () => (
	<Toaster
		toastOptions={{
			duration: 5000,
			style: {
				border: '1px solid black',
				padding: '15px 25px',
			},
		}}
	>
		{(t) => (
			<ToastBar toast={t}>
				{({ icon, message }) => (
					<>
						{icon}
						{message}
						{t.type !== 'loading' && (
							<button
								onClick={() => toast.dismiss(t.id)}
								style={{
									border: 'none',
									background: 'white',
									cursor: 'pointer',
								}}
							>
								<CloseSharp />
							</button>
						)}
					</>
				)}
			</ToastBar>
		)}
	</Toaster>
);

export default Notifications;
