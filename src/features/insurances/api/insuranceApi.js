import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService()
const path = '/insurance'

export function registerInsurance(data) {
  const formData = new FormData();
  formData.append('image', data.image);
  formData.append('insuranceName', data.insuranceName);
  formData.append('accountNumber', data.accountNumber);
  
  return api.addAuthenticationHeader().post(
    `${path}/registerInsurance?insuranceName=${encodeURIComponent(data.insuranceName)}&accountNumber=${encodeURIComponent(data.accountNumber)}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
}

export function getInsurances(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/all`)
}

export function getAllInsurances(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/getAllInsurances${qr}`);
}
export function getCustomersbyId(id, config) {
	return api.addAuthenticationHeader().get(`${path}/GetInsurance/${id}`, config)
}
export function getRate(id, config) {
	return api.addAuthenticationHeader().get(`/allPremium/${id}`, config)
}

export function getInsurancebyId(id, config) {
	return api.addAuthenticationHeader().get(`${path}/GetInsurance/${id}`, config)
}
export function CreateClient(data) {
  return api.addAuthenticationHeader().post(`/cars/registerClientsCar`, data);
}
export function getAllPayment(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/searchPayment${qr}`);
}

export function getLibreImages(carUuid) {
  return api.addAuthenticationHeader().get(`/cars/getLibre?fileName=${carUuid}`);
}
export function setQuotation(quotationUuid, amount, type) {
  return api.addAuthenticationHeader().post(`${path}/setQuotation/${quotationUuid}?${type}=${amount}`);
}




export function updateCarDetails(carUuid, data) {
  return api.addAuthenticationHeader()
    .put(`/cars/updateCar/${carUuid}`, data);
}





