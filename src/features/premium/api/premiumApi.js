import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils";

const api = new ApiService();
const path = '';

export function savePremium(data) {
  const params = new URLSearchParams();
  params.append('car_type', data.car_type);
  params.append('rate', data.rate);
  
  // Add specific type parameters based on car_type
  if (data.car_type === 'PRIVATE' && data.privateType) {
    params.append('privateType', data.privateType);
  } else if (data.car_type === 'COMMERCIAL') {
    if (data.commercialType) params.append('commercialType', data.commercialType);
    if (data.goodsCarryingType) params.append('goodsCarryingType', data.goodsCarryingType);
    if (data.ownGoodsType) params.append('ownGoodsType', data.ownGoodsType);
    if (data.generalGoodsCaringType) params.append('generalGoodsCaringType', data.generalGoodsCaringType);
    if (data.passengerCarryingType) params.append('passengerCarryingType', data.passengerCarryingType);
    if (data.publicServiceType) params.append('publicServiceType', data.publicServiceType);
  }
  
  return api.addAuthenticationHeader().post(`${path}/savePremium/?${params.toString()}`);
}

export function getAllPremiums(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/allPremium${qr}`);
}

export function editPremiumRate(premiumRateUuid, data) {
  const params = new URLSearchParams();
  params.append('car_type', data.car_type);
  params.append('rate', data.rate);
  
  if (data.car_type === 'PRIVATE' && data.privateType) {
    params.append('privateType', data.privateType);
  } else if (data.car_type === 'COMMERCIAL') {
    if (data.commercialType) params.append('commercialType', data.commercialType);
    if (data.goodsCarryingType) params.append('goodsCarryingType', data.goodsCarryingType);
    if (data.ownGoodsType) params.append('ownGoodsType', data.ownGoodsType);
    if (data.generalGoodsCaringType) params.append('generalGoodsCaringType', data.generalGoodsCaringType);
    if (data.passengerCarryingType) params.append('passengerCarryingType', data.passengerCarryingType);
    if (data.publicServiceType) params.append('publicServiceType', data.publicServiceType);
  }
  
  return api.addAuthenticationHeader().put(`${path}/editRate/${premiumRateUuid}?${params.toString()}`);
}