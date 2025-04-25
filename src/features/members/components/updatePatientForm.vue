<script setup>
import { ref, computed } from "vue";
import { Textarea } from "@/components/new_form_elements";

const props = defineProps({
  patient: {
    type: Object,
    required: true
  }
});

const message = ref("");

const messageLength = computed(() => message.value?.length || 0);
</script>

<template>
  <div class="flex flex-col gap-4 w-[600px] p-2">
    <Textarea
      v-model="message"
      validation="required"
      name="sms"
      label="Message"
      :attributes="{
        placeholder: 'Type your message here',
        rows: 4,
        maxlength: 160
      }"
    />
    <div class="text-sm text-gray-500 text-right">
      {{ messageLength }}/160 characters
    </div>
  </div>
</template>

<style scoped></style>
