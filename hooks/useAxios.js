import axios from 'axios';
import { useProfile } from '../Store/Store';
const BASE_URL = 'https://app.getfit.us:8000';

const useAxios = () => {
    const accessToken = useProfile((state) => state.profile?.accessToken);
    const axiosPrivate = axios.create({
        baseURL: BASE_URL,
        retryCount: 0,
        headers: {
            "Content-Type": "application/json",
            withCredentials: true,
            Authorization: "Bearer " + accessToken,
        },
       
    });
    return axiosPrivate;

}


export default useAxios;



