import axios from 'axios';
import toast from 'react-hot-toast';
import { apiBaseUrl } from './constants';

/* use axios interceptor to handle all axios errors
 in one place with toast
*/
const axiosInstance = axios.create({
	baseURL: apiBaseUrl,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			const errorMessage = error.response.data.error || 'Something went wrong';
			toast.error(errorMessage);
		} else {
			toast.error('Network error. Please try again later.');
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
