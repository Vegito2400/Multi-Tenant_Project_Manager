import axios from "axios";
const api = axios.create({
    baseURL:"http://localhost:8000",
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    const orgId = localStorage.getItem("orgId");
    if(token){
        config.headers.Authorization= `Bearer ${token}`;
    }
    if(orgId){
        config.headers["x-org-id"] = orgId;
    }
    return config;
});

export default api;