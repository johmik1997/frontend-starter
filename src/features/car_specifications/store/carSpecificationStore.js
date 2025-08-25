import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCarSpecification = defineStore('carSpecification', () => {
  const carSpecifications = ref([]);
  const loading = ref(false);
  const error = ref(null);

  function add(carSpec) {
    carSpecifications.value.unshift(carSpec);
  }

  function update(id, updatedCarSpec) {
    const index = carSpecifications.value.findIndex(spec => spec.id === id);
    if (index !== -1) {
      carSpecifications.value[index] = { ...carSpecifications.value[index], ...updatedCarSpec };
    }
  }

  function remove(id) {
    const index = carSpecifications.value.findIndex(spec => spec.id === id);
    if (index !== -1) {
      carSpecifications.value.splice(index, 1);
    }
  }

  function set(data) {
    carSpecifications.value = data;
  }

  function getAll() {
    return carSpecifications.value;
  }

  function getById(id) {
    return carSpecifications.value.find(spec => spec.id === id);
  }

  function clear() {
    carSpecifications.value = [];
    error.value = null;
  }

  return {
    carSpecifications,
    loading,
    error,
    add,
    update,
    remove,
    set,
    getAll,
    getById,
    clear
  };
});