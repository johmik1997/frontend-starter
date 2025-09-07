import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePremium = defineStore('premium', () => {
  const premiums = ref([]);
  const loading = ref(false);

  function add(premium) {
    premiums.value.unshift(premium);
  }
     function getAll() {
        return premiums.value
    }

  function update(id, updatedPremium) {
    const index = premiums.value.findIndex(p => 
      p.id === id || p.uuid === id || p.premiumRateUuid === id
    );
    if (index !== -1) {
      premiums.value[index] = { ...premiums.value[index], ...updatedPremium };
    }
  }

  function remove(id) {
    const index = premiums.value.findIndex(p => 
      p.id === id || p.uuid === id || p.premiumRateUuid === id
    );
    if (index !== -1) {
      premiums.value.splice(index, 1);
    }
  }

  function setPremiums(newPremiums) {
    premiums.value = newPremiums;
  }
function set(data) {
    console.log('Setting store data:', data)
    
    // Handle both cases:
    // 1. When receiving full response object with content property
    // 2. When receiving just the content array directly
    if (data && data.content && Array.isArray(data.content)) {
        premiums.value = data.content;
    } else if (Array.isArray(data)) {
        premiums.value = data;
    } else if (data && typeof data === 'object') {
        premiums.value = [data];
    } else {
        premiums.value = [];
    }
}

  return {
    premiums,
    loading,
    add,
    update,
    remove,
    setPremiums,
    getAll,
    set
  };
});