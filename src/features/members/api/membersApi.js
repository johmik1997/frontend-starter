import ApiService from "@/service/ApiService";

const api = new ApiService()
const path = '/users'

export function importInsured(data, config) {
	return api.addAuthenticationHeader().post(`${path}/import`, data, {
		...config,
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
}

export function getInsuredByWoreda(id, config) {
	return api.addAuthenticationHeader().get(`${path}/${id}`, config)
}
export function getMembers(config) {
  console.log('Getting members with config:', config);
  // If config is an object with search, page, etc. properties
  if (typeof config === 'object' && config !== null) {
    const { search, page, size, ...rest } = config;
    const queryParams = new URLSearchParams();
    
    // Add search parameter if it exists
    if (search) {
      queryParams.append('search', search);
    }
    
    // Add pagination parameters
    if (page !== undefined) {
      queryParams.append('page', page);
    }
    
    if (size !== undefined) {
      queryParams.append('size', size);
    }
    
    // Add any other parameters
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    }
    
    const queryString = queryParams.toString();
    const url = `${path}/clients${queryString ? '?' + queryString : ''}`;
    
    console.log('API request URL:', url);
    return api.addAuthenticationHeader().get(url, { signal: config.signal });
  }
  
  // If config is just the AbortSignal or other non-object
  return api.addAuthenticationHeader().get(`${path}/clients`, config);
}
