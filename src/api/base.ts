import axios from "axios";

const base = axios.create({
    baseURL: import.meta.env.VITE_RESTFUL_BACKEND,
    withCredentials: true,
    timeout: 5000,
})

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default base;