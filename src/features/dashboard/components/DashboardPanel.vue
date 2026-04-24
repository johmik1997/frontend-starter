<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <section class="bg-white rounded-2xl border border-gray-100 shadow-sm">
    <header class="px-5 py-4 border-b border-gray-100">
      <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
      <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
    </header>
    <div class="p-5">
      <slot />
    </div>
  </section>
</template>
