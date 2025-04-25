import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils";

const api = new ApiService();
const path = '/quotation';

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
export function getInsuredByWoreda(id, config) {
	return api.addAuthenticationHeader().get(`${path}/${id}`, config)
}
export function getCustomersbyId(id, config) {
	return api.addAuthenticationHeader().get(`${path}/getQuotation/${id}`, config)
}

export function getDepositDetails(quotationUuid) {
  return api.addAuthenticationHeader()
    .get(`/BankAccountController/getDepositDetail/${quotationUuid}`);
}

export function submitDeposit(userUuid, data, file) {
  const formData = new FormData();
  formData.append('attachment', file);

  return api.addAuthenticationHeader()
    .put(
      `/BankAccountController/saveInitialDeposit/${userUuid}?quotationUuid=${data.quotationUuid}&amount=${data.amount}&paymentMethod=${data.paymentType}&receiptNumber=${data.receiptNumber}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': '*/*'
        }
      }
    );
}
export function searchClientByPhone(phoneNumber) {
  const encodedPhoneNumber = phoneNumber?.replace(/\+/g, '%2B');
  const query = {
    search: encodedPhoneNumber,
    page: 1,
    limit: 25
  };
  return api.addAuthenticationHeader().get(`${path}/getAllQuotation${getQueryFormObject(query)}`);
}

export function getLibreImages(carUuid) {
  return api.addAuthenticationHeader().get(`/cars/getLibre?fileName=${carUuid}`);
}

export function setQuotation(quotationUuid, amount, type) {
  return api.addAuthenticationHeader().post(`${path}/setQuotation/${quotationUuid}?${type}=${amount}`);
}

export function updateQuotationStatus(quotationUuid, status, remark) {
  return api.addAuthenticationHeader()
    .put(`/quotation/updateInitialDepositStatus/${quotationUuid}?initialDepositStatus=${status}&remark=${remark}`);
}

















