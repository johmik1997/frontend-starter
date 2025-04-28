<script setup>
import InputError from "./InputError.vue";

const props = defineProps(["label", "error", "validation"]);
</script>

<template>
  <div class="flex flex-col items-start gap-1 ">
    <div class="flex flex-col gap-1 w-full">
      <span
        :data-required="`${validation}`.includes('required') ? 'true' : 'false'"
        :title="label"
        class="text-sm capitalize px-1 truncate"
        v-if="label"
        >{{ label }}</span>
      <div
        class=" overflow-hidden border bg-[#C4C4C433;] text-base min-h-11 flex"
        :class="$attrs.class"
      >
        <slot></slot>
      </div>
    </div>
    <InputError :error="error" />
  </div>
</template>

<style>
.custom-input,
.custom-input,
.custom-input,
.skiped-input {
  border: none;
  outline: none;
  width: 100%;
  background-color: #f6f5f545;
  padding: 0 0.75rem;
  @apply text-sm;
}

textarea.custom-input,
textarea.skiped-input {
  padding: 0.75rem;
  resize: none;
  height: 12rem;
}

.custom-input:focus,
.skiped-input:focus {
  box-shadow: none;
}

.custom-input::placeholder,
.skiped-input::placeholder {
  color: theme("colors.dark");
  opacity: 0.6;
}
</style>
