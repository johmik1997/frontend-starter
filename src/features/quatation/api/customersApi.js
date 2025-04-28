import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils";

const api = new ApiService()
const path = '/quotation'

export function importInsured(data, config) {
	return api.addAuthenticationHeader().post(`${path}/import`, data, {
		...config,
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
}

export function getCustomers(config) {
	return api.addAuthenticationHeader().get(`${path}/getAllQuotation`, config)
}

export function getAllInsurances(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/getAllInsurances${qr}`);
}
export function getAllcar(query = {}) {
  const queryString = new URLSearchParams(query).toString();
  const url = `/carSpecification/getCarSpecification${queryString ? `?${queryString}` : ''}`;
  return api.addAuthenticationHeader().get(url);
}
export function getInsuredByWoreda(id, config) {
	return api.addAuthenticationHeader().get(`${path}/${id}`, config)
}
export function getCustomersbyId(id, config) {
	return api.addAuthenticationHeader().get(`${path}/getQuotation/${id}`, config)
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



