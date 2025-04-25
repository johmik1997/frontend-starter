import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils";

const api = new ApiService(import.meta.env?.v_API_URL);

const path = "/patient";

export function checkEligiblity(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/checkEligibility${qr}`);
}
export function getPatients(config) {
	return api.addAuthenticationHeader().get(`${path}/allPatients`, config)
}
export function sendSMS(userUuid, message) {
  return api.addAuthenticationHeader()
    .post(`/users/sendSms/${userUuid}?message=${encodeURIComponent(message)}`);
}
export function addPatient(data) {
  return api.addAuthenticationHeader().post(`${path}/signUp`, data);
}

export function searchPatientById(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/SearchAllPatient${qr}`);
}


export function createPatient(data) {
  return api.addAuthenticationHeader().post(`${path}/createPatient`, data);
}
export function editPatient(id, data) {
  return api.addAuthenticationHeader().put(`${path}/updatePatient/${id}`, data);
}
export function searchServicesByServiceName(serviceName) {
  return api.addAuthenticationHeader().get(`/services/${serviceName}`);
}
export function registerPatient(id) {
  return api.addAuthenticationHeader().put(`${path}/addPatient/${id}`);
}
