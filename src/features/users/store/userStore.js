import { ref } from "vue";
import { defineStore } from "pinia";

export const useUsers = defineStore("allUserStore", () => {
  const users = ref([]);

  function set(data) {
    console.log(data);

    users.value = data;
  }

  function getAll() {
    return users.value;
  }
  function add(data) {
    return users.value.push(add);
  }

  function update(id, data) {
    const idx = users.value.findIndex((el) => el.userUuid == id);
    if (idx == -1) return;

    users.value.splice(idx, 1, data);
  }
  function remove(id) {
    const idx = users.value.findIndex((el) => el.userUuid == id);
    if (idx == -1) return;
    users.value.splice(idx, 1);
  }

  function updateStatus(id, status) {
    const idx = users.value.findIndex((el) => el.userUuid == id);
    if (idx == -1) return;

    users.value[idx].userStatus = status;
  }
  // In your userStore.js
updateVerification(userUuid, isVerified) {
  const user = this.users.find(u => u.userUuid === userUuid);
  if (user) {
    user.isVerified = isVerified;
  }
}
// In your userStore.js
updateVerification(userUuid, isVerified) {
  const user = this.users.find(u => u.userUuid === userUuid);
  if (user) {
    user.isVerified = isVerified;
  }
}

  return {
    users,
    getAll,
    update,
    remove,
    updateStatus,
    set,
    add,
    updateVerification,
  };
});
