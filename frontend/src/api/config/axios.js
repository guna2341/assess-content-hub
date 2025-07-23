import axios from "axios";
import END_POINTS from "./endpoints";

const apiClient = axios.create({
    baseURL: END_POINTS.BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default apiClient;