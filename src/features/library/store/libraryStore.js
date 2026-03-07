import { ref } from "vue";
import { defineStore } from "pinia";

export const useLibrary = defineStore("alllibraryStore", () => {
  const libraries = ref([]);

  function set(data) {
    console.log(data);

    libraries.value = data;
  }

  function getAll() {
    return libraries.value;
  }
  function add(data) {
    return libraries.value.push(data);
  }

  function update(id, data) {
    const idx = libraries.value.findIndex((el) => el.libraryUuid == id);
    if (idx == -1) return;

    libraries.value.splice(idx, 1, data);
  }
  function remove(id) {
    const idx = libraries.value.findIndex((el) => el.libraryUuid == id);
    if (idx == -1) return;
    libraries.value.splice(idx, 1);
  }

  function updateStatus(id, status) {
    const idx = libraries.value.findIndex((el) => el.libraryUuid == id);
    if (idx == -1) return;

    libraries.value[idx].libraryStatus = status;
  }



  return {
    libraries,
    getAll,
    update,
    remove,
    updateStatus,
    set,
    add,
  };
});
