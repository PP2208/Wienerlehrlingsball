import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const subscribeNewsletter = (email, source = "coming_soon") =>
  api.post("/newsletter", { email, source }).then((r) => r.data);

export const submitContact = (payload) =>
  api.post("/contact", payload).then((r) => r.data);
