import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService();
const path = "/users";

export function CreateUser(data) {
  return api.addAuthenticationHeader().post(`${path}/signUp`, data);
}
export const verifyUser = (phoneNumber, code) => {
  return api.post(`${path}/EnterVerificationCode?phoneNumber=${phoneNumber}&code=${code}`);
};
export function getAllUser(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/all${qr}`);
}
export function getUserById(id) {
  return api.addAuthenticationHeader().get(`${path}/${id}`);
}
export function updateUserById(id, data) {
  return api.addAuthenticationHeader().put(`${path}/update/${id}`, data);
}
export function removeUserById(id) {
  return api.addAuthenticationHeader().delete(`${path}/${id}`);
}
export function fetchUserFilesView() {
  return api.addAuthenticationHeader().get(`${path}`);
}

export function fetchUserFiles() {
  return api.addAuthenticationHeader().get(`${path}`);
}
