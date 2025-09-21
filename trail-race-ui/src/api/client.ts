import axios from "axios";

export const queryApi = axios.create({
  baseURL: "http://localhost:4000",
});

export const commandApi = axios.create({
  baseURL: "http://localhost:3000",
});

const apis = [queryApi, commandApi];

export const setAuthToken = (token: string | null) => {
  for (const api of apis) {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }
};

const token = localStorage.getItem("token");
if (token) setAuthToken(token);
