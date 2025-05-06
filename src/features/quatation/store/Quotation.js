import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getCustomers } from '../api/customersApi'

export const useQuotation = defineStore('quotation', () => {
  const quotations = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Add a method to fetch quotations from the API
  async function fetchQuotations() {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await getCustomers();
      
      if (response.success && response.data) {
        // Check if the response has a content array (pagination format)
        if (response.data.content && Array.isArray(response.data.content)) {
          quotations.value = response.data.content.map(formatQuotationData);
        } else if (Array.isArray(response.data)) {
          quotations.value = response.data.map(formatQuotationData);
        } else {
          quotations.value = [];
        }
      } else {
        error.value = response.error || 'Failed to fetch quotations';
      }
    } catch (err) {
      error.value = err.message || 'An unexpected error occurred';
    } finally {
      isLoading.value = false;
    }
  }
  
  // Helper function to format quotation data consistently
  function formatQuotationData(item) {
    return {
      ...item, // Keep all original properties
      quotationUuid: item.quotationUuid,
      // Don't override the original fields, just add formatted versions if needed
      customerName: `${item.title || ''} ${item.clientFirstName || ''} ${item.clientFatherName || ''}`.trim(),
      VehicleDetail: `${item.carName || ''} ${item.carModel || ''} ${item.carType ? '- ' + item.carType : ''}`.trim(),
      // Keep other fields as is
    };
  }
  
  function add(quotation) {
    console.log('Adding quotation to store:', quotation);
    
    // Check if we received the new API response format with carResponseList
    if (quotation && quotation.carResponseList && quotation.carResponseList.length > 0) {
      console.log('Processing new API response format with carResponseList');
      
      // Extract the first car from the response
      const car = quotation.carResponseList[0];
      
      // Create a new quotation object with all necessary fields
      const newQuotation = {
        ...quotation, // Keep all original properties from quotation
        ...car, // Add all properties from car
        quotationUuid: car.quotationUuid,
        // Don't override the original fields
        // Just ensure these computed fields are available for the table
        customerName: `${quotation.title || ''} ${quotation.clientFirstName || ''} ${quotation.clientFatherName || ''}`.trim(),
        VehicleDetail: `${car.carName || ''} ${car.carModel || ''} ${car.carType ? '- ' + car.carType : ''}`.trim(),
      };
      
      console.log('Created new quotation object:', newQuotation);
      
      // Add the new quotation to the store
      quotations.value.unshift(newQuotation);
    } else if (quotation && quotation.content && Array.isArray(quotation.content)) {
      // Handle paginated response format
      console.log('Processing paginated response format');
      quotations.value = quotation.content.map(item => ({
        ...item, // Keep all original properties
        // Ensure these computed fields are available for the table
        customerName: `${item.title || ''} ${item.clientFirstName || ''} ${item.clientFatherName || ''}`.trim(),
        VehicleDetail: `${item.carName || ''} ${item.carModel || ''} ${item.carType ? '- ' + item.carType : ''}`.trim(),
      }));
    } else {
      console.log('Using direct quotation object');
      // Handle the old format or direct quotation object
      quotations.value.unshift({
        ...quotation,
        // Ensure these computed fields are available for the table
        customerName: quotation.customerName || `${quotation.title || ''} ${quotation.clientFirstName || ''} ${quotation.clientFatherName || ''}`.trim(),
        VehicleDetail: quotation.VehicleDetail || `${quotation.carName || ''} ${quotation.carModel || ''} ${quotation.carType ? '- ' + quotation.carType : ''}`.trim(),
      });
    }
    
    console.log('Updated quotations array:', quotations.value);
  }
  
  function remove(id) {
    quotations.value = quotations.value.filter(q => q.id !== id)
  }
  
  // Add getAll function for compatibility with usePaginationcopy
  function getAll() {
    return quotations.value;
  }
  
  // Add set function for compatibility with usePaginationcopy
  function set(data) {
    console.log('Setting quotations data:', data);
    
    // Check if the data has a content array (pagination format)
    if (data && data.content && Array.isArray(data.content)) {
      quotations.value = data.content.map(item => ({
        ...item, // Keep all original properties
        // Ensure these computed fields are available for the table
        customerName: `${item.title || ''} ${item.clientFirstName || ''} ${item.clientFatherName || ''}`.trim(),
        VehicleDetail: `${item.carName || ''} ${item.carModel || ''} ${item.carType ? '- ' + item.carType : ''}`.trim(),
      }));
    } else if (Array.isArray(data)) {
      quotations.value = data.map(item => ({
        ...item, // Keep all original properties
        // Ensure these computed fields are available for the table
        customerName: item.customerName || `${item.title || ''} ${item.clientFirstName || ''} ${item.clientFatherName || ''}`.trim(),
        VehicleDetail: item.VehicleDetail || `${item.carName || ''} ${item.carModel || ''} ${item.carType ? '- ' + item.carType : ''}`.trim(),
      }));
    } else {
      quotations.value = [];
    }
  }
  
  return {
    quotations,
    isLoading,
    error,
    add,
    remove,
    fetchQuotations,
    getAll,
    set
  }
})






