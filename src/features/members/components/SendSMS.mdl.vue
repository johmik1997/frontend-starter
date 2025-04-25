<script setup>
import { ref, computed } from "vue";
import { useApiRequest } from "@/composables/useApiRequest";
import { sendSMS } from "../api/patientApi";
import { toasted } from "@/utils/utils";
import Button from "@/components/Button.vue";
import ModalParent from "@/components/new_form_builder/ModalParent.vue";
import { closeModal } from "@customizer/modal-x";
import { Textarea } from "@/components/new_form_elements";
import BaseIcon from "@/components/base/BaseIcon.vue";
import { mdiClose } from "@mdi/js";

const props = defineProps({
  data: Object
});

const message = ref("");
const pending = ref(false);

function sendMessage() {
  if (!message.value) {
    toasted(false, '', 'Please enter a message');
    return;
  }

  const userUuid = props.data?.userUuid;
  
  if (!userUuid) {
    toasted(false, '', 'User ID not found');
    return;
  }

  pending.value = true;
  
  useApiRequest().send(
    () => sendSMS(userUuid, message.value),
    (res) => {
      pending.value = false;
      if (res.success) {
        toasted(true, 'SMS sent successfully', '');
        closeModal();
      } else {
        toasted(false, '', res.error || 'Failed to send SMS');
      }
    }
  );
}


const messageLength = computed(() => message.value?.length || 0);
</script>

<template>
  <ModalParent>
    <div class="bg-white rounded-lg">
      <!-- Header with close button -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-semibold">Send SMS</h3>
        <button
          @click="closeModal()"
          class="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
        >
          <BaseIcon :path="mdiClose" class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-4 w-[600px] p-4">
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
      
      <!-- Footer -->
      <div class="flex items-center w-full flex-1 justify-center p-4 border-t">
        <Button 
          @click="sendMessage" 
          type="primary" 
          size="lg"
          :loading="pending"
          class="gap-2 flex items-center flex-1 justify-center"
        >
          Send SMS
        </Button>
      </div>
    </div>
  </ModalParent>
</template>
