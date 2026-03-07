import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService();
const TYPE_PATHS = {
  physical: "/material/physical-materials",
  digital: "/material/digital-materials",
};

function resolvePath(type = "physical") {
  const key = String(type || "physical").toLowerCase();
  return TYPE_PATHS[key] || TYPE_PATHS.physical;
}

export function CreateMaterial(data, type = "physical") {
  const path = resolvePath(type);
  return api.addAuthenticationHeader().post(`${path}/`, data);
}

export function createPhysicalMaterial(data) {
  return CreateMaterial(data, "physical");
}

export function createDigitalMaterial(data) {
  return CreateMaterial(data, "digital");
}

export function getAllMaterials(query = {}, type = "physical") {
  const path = resolvePath(type);
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/${qr}`);
}

export function getMaterialById(id, type = "physical") {
  const path = resolvePath(type);
  return api.addAuthenticationHeader().get(`${path}/${id}/`);
}

export function updateMaterialById(id, data, type = "physical") {
  const path = resolvePath(type);
  return api.addAuthenticationHeader().put(`${path}/${id}/`, data);
}

export function removeMaterialById(id, type = "physical") {
  const path = resolvePath(type);
  return api.addAuthenticationHeader().delete(`${path}/${id}/`);
}
