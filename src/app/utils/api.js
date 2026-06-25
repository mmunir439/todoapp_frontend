import axios from "./axios";

function unwrap(response) {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return body.data;
  }
  return body;
}

export function getErrorMessage(error) {
  if (!error.response && error.message === "Network Error") {
    return "Cannot reach the server. Check NEXT_PUBLIC_BACKEND_URL includes /api/v1 and that the backend FRONTEND_URL matches this site.";
  }
  const errors = error.response?.data?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    return errors.map((e) => e.message || e).join(", ");
  }
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong"
  );
}

export const authApi = {
  register(payload) {
    return axios.post("/auth/register", payload).then(unwrap);
  },
  login(payload) {
    return axios.post("/auth/login", payload).then(unwrap);
  },
  getMe() {
    return axios.get("/auth/me").then(unwrap);
  },
  updateMe(payload) {
    return axios.put("/auth/me", payload).then(unwrap);
  },
  deleteMe() {
    return axios.delete("/auth/me").then(unwrap);
  },
};

export const productsApi = {
  getMeta() {
    return axios.get("/products/meta").then(unwrap);
  },
  list(params = {}) {
    return axios.get("/products", { params }).then(unwrap);
  },
  getOne(id) {
    return axios.get(`/products/${id}`).then(unwrap);
  },
  create(payload) {
    return axios.post("/products", payload).then(unwrap);
  },
  update(id, payload) {
    return axios.patch(`/products/${id}`, payload).then(unwrap);
  },
  remove(id) {
    return axios.delete(`/products/${id}`).then(unwrap);
  },
};

export const customersApi = {
  list(params = {}) {
    return axios.get("/customers", { params }).then(unwrap);
  },
  getOne(id) {
    return axios.get(`/customers/${id}`).then(unwrap);
  },
  create(payload) {
    return axios.post("/customers", payload).then(unwrap);
  },
  update(id, payload) {
    return axios.patch(`/customers/${id}`, payload).then(unwrap);
  },
  remove(id) {
    return axios.delete(`/customers/${id}`).then(unwrap);
  },
  getTransactions(id) {
    return axios.get(`/customers/${id}/transactions`).then(unwrap);
  },
};

export const salesApi = {
  list(params = {}) {
    return axios.get("/sales", { params }).then(unwrap);
  },
  cashSale(payload) {
    return axios.post("/sales/cash", payload).then(unwrap);
  },
  creditSale(payload) {
    return axios.post("/sales/credit", payload).then(unwrap);
  },
  payment(payload) {
    return axios.post("/sales/payment", payload).then(unwrap);
  },
};

export const reportsApi = {
  dashboard() {
    return axios.get("/reports/dashboard").then(unwrap);
  },
  daily() {
    return axios.get("/reports/daily").then(unwrap);
  },
};
