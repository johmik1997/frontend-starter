import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils";

const api = new ApiService(import.meta.env?.v_API_URL);

const path = "/payment";

export function confirmPayment(data) {
  return api.addAuthenticationHeader().post(`${path}/createPayment`, data);
}

export function getAllPayment(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/searchPayment${qr}`);
}

export function createPayment(monthlyPaymentUuid) {
  return api.addAuthenticationHeader().put(`${path}/pay/${monthlyPaymentUuid}?paymentType=ONLINE`);
}
export function createDirectPayment(id) {
  return api.addAuthenticationHeader().put(`${path}/pay/${id}?paymentType=DIRECT_pAY`);
}