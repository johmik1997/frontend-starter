<script setup>
import { watch } from 'vue';
import { usePrivilege } from '../store/privilegeStore';
import { getAllPrivilege } from '../Api/PrivilegeApi';
import { usePaginations } from '@/composables/usePaginationTemp';
import { removeUndefined } from '@/utils/utils.js';

const props = defineProps({
  search: String,
  perPage: {
    type: Number,
    default: 25,
  },
});

const privilegeStore = usePrivilege();

const pagination = usePaginations({
  auto: false,
  perPage: props.perPage,
  store: privilegeStore,
  cb: (data) => getAllPrivilege({ ...data, ...removeUndefined({ search: props.search }) }),
});

// Initial fetch
if (!privilegeStore.privilege.length) {
  pagination.send();
}

// Re-fetch when search changes
watch(
  () => props.search,
  () => {
    pagination.send();
  }
);
</script>
<template>
  <slot 
    :privileges="privilegeStore.privilege" 
    :pending="pagination.pending.value" 
    :error="pagination.error.value" 
  />
</template>
