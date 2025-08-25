import { ref } from "vue";
import { defineStore } from "pinia";

export const usePrivilege = defineStore("allPrivilegeStore", () => {
  const privileges = ref([]);

  function set(data) {
    console.log(data);
    privileges.value = data;
  }

  function getAll() {
    return privileges.value;
  }

  function add(data) {
    return privileges.value.push(data);
  }

  function update(id, data) {
    const idx = privileges.value.findIndex((el) => el.privilegeUuid === id);
    if (idx === -1) return;

    privileges.value.splice(idx, 1, data);
  }

  function remove(id) {
    const idx = privileges.value.findIndex((el) => el.privilegeUuid === id);
    if (idx === -1) return;

    privileges.value.splice(idx, 1);
  }

  function updateStatus(id, status) {
    const idx = privileges.value.findIndex((el) => el.privilegeUuid === id);
    if (idx === -1) return;

    privileges.value[idx].privilegeStatus = status;
  }

  return {
    privileges,
    getAll,
    add,
    update,
    remove,
    updateStatus,
    set,
  };
});
