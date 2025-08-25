import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils";

const api = new ApiService();
const path = '/carSpecification';

export function saveCarSpecification(data) {
  return api.addAuthenticationHeader().post(`${path}/saveCArSpecification`, data);
}

export function getAllCarSpecifications(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/all${qr}`);
}

export function getCarSpecificationById(id) {
  return api.addAuthenticationHeader().get(`${path}/${id}`);
}

export function updateCarSpecification(id, data) {
  return api.addAuthenticationHeader().put(`${path}/update/${id}`, data);
}

export function deleteCarSpecification(id) {
  return api.addAuthenticationHeader().delete(`${path}/${id}`);
}