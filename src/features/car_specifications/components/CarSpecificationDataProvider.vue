<script setup>
import { usePaginationcopy } from '@/composables/usePaginationcopy';
import { getAllCarSpecifications } from '../api/carSpecificationApi';
import { useCarSpecification } from '../store/carSpecificationStore';

const carSpecStore = useCarSpecification();

const pagination = usePaginationcopy({
  cb: (params) => getAllCarSpecifications(params),
  store: carSpecStore,
  auto: true,
  perPage: 25,
  cache: false
});
</script>

<template>
  <slot
    :carSpecifications="pagination.data"
    :pending="pagination.pending.value"
    :error="pagination.error.value"
    :search="pagination.search"
    :page="pagination.page"
    :totalPages="pagination.totalPages"
    :next="pagination.next"
    :previous="pagination.previous"
    :perPage="pagination.perPage"
  />
</template>