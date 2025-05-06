import ApiService from "@/service/ApiService";

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
export function getDepositDetails(quotationUuid) {
  return api.addAuthenticationHeader()
	.get(`/BankAccountController/getDepositDetail/${quotationUuid}`);
}
export function getCustomers(config) {
	return api.addAuthenticationHeader().get(`${path}/getAllQuotation`, config)
}

export function getAllInsurances(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/getAllInsurances${qr}`);
}
export function getDispersementDetails(quotationUuid) {
	return api.addAuthenticationHeader()
	  .get(`/BankAccountController/getDepositDetail/${quotationUuid}`);
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

export function authorizeDispersement(quotationUuid) {
  return api.addAuthenticationHeader()
    .put(`/payment/disperse/${quotationUuid}`);
}

export function getMonthlyPayments(uuid) {
  return api.addAuthenticationHeader()
    .get(`/monthlyPayments/getMonthlyPayments/${uuid}`);
}

export function makePayment(quotationUuid,  paymentType = 'ONLINE') {
  return api.addAuthenticationHeader()
    .put(`/payment/pay/${quotationUuid}?paymentType=${paymentType}`);
}

export function getPaymentReceipt(paymentId) {
  return api.addAuthenticationHeader().get(`/payment/receipt/${paymentId}`);
}

export function sendPaymentReminder(paymentId) {
  return api.addAuthenticationHeader().post(`/payment/remind/${paymentId}`);
}



