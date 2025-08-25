<script setup>
import { provide } from 'vue';

provide('pageTitle', 'Car Specifications');
provide('breadcrumbs', [
  { name: 'Dashboard', href: '/' },
  { name: 'Car Specifications', href: '/car_specifications' }
]);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>