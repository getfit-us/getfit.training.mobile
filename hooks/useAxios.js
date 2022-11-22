import axios from 'axios';
import { useProfile } from '../Store/Store';
const BASE_URL = 'https://app.getfit.us:8000';

const useAxios = () => {
    const accessToken = useProfile((state) => state.profile?.accessToken);
    const axiosPrivate = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
            withCredentials: true,
            Authorization: "Bearer " + accessToken,
        },
        retryCount: 3,
    });
    return axiosPrivate;

}


export default useAxios;


// const refreshAuthLogic = (failedRequest) => {
//   axios
//     .post("/refresh", {
//       headers: {
//         "Content-Type": "application/json",
//         withCredentials: true,
//       },
//     })
//     .then((tokenRefreshResponse) => {
//       failedRequest.response.config.headers["Authorization"] =
//         "Bearer " + tokenRefreshResponse.data.accessToken;
//       return Promise.resolve();
//     });
// };

// createAuthRefreshInterceptor(axiosPrivate, refreshAuthLogic);
