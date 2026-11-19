import axios from "axios";
export const CreateAxios = axios.create({
    baseURL: "https://e2cf-110-172-131-205.ngrok-free.app/api/",
    headers: {
        "ngrok-skip-browser-warning": true,
    }
})
export const createAxiosWithToken = (token) => axios.create({
    baseURL: "https://e2cf-110-172-131-205.ngrok-free.app/api/",
    headers: {
        "ngrok-skip-browser-warning": true,
        Authorization: 'Bearer ' + token,
    }
})