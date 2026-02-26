import ApiService from "@/service/ApiService";

const api = new ApiService(import.meta.env?.v_AUTH_API);
const path = "users/create";

export function signup(data, config = {}) {
  return api.post(`${path}/signUp`, data, config);
}

export function login(data, config = {}) {
  return api.post(`${path}/signIn`, data, config);
}
