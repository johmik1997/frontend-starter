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

  return {
    premiums,
    loading,
    add,
    update,
    remove,
    setPremiums,
    getAll
  };
});