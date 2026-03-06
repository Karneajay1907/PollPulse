import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
export const getPolls = () => API.get("/polls");

export const getPoll = (id) => API.get(`/polls/${id}`);

export const createPoll = (data) => API.post("/polls", data);

export const votePoll = (id, optionIndex) =>
  API.post(`/polls/${id}/vote`, { optionIndex });
export default API;