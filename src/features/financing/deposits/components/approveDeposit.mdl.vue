<script setup>
import { ref, computed } from 'vue';
import Button from '@/components/Button.vue';
import { toasted } from "@/utils/utils";
import ModalParent from "@/components/new_form_builder/ModalParent.vue";
import NewFormParent from "@/components/NewFormParent.vue";
import { closeModal } from "@customizer/modal-x";
import { updateQuotationStatus } from "../api/depositsApi";
import { useQuotation } from '../store/deposit';

const quotationStore = useQuotation();
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

// Access the nested data correctly
const rowData = computed(() => props.data?.props?.data || {});

const draftData = computed(() => ({
  clientFirstName: rowData.value.clientFirstName || '',
  clientFatherName: rowData.value.clientFatherName || '',
  clientEmail: rowData.value.clientEmail || '',
  clientPhoneNumber: rowData.value.clientPhoneNumber || '',
  carName: rowData.value.carName || '',
  carModel: rowData.value.carModel || '',
  insurance: rowData.value.insurance || '',
  quotationAmount: rowData.value.quotationAmount || '',
  monthlyPayment: rowData.value.monthlyPayment || '',
  accountNumber: rowData.value.accountNumber || '',
  quotationUuid: rowData.value.quotationUuid || ''
}));

// Status details - now with fixed DEPOSITED status
const statusDetails = ref({
  quotationStatus: 'DEPOSITED',
  remark: ''
});

// Submit form
const submitForm = async () => {
  try {
    const response = await updateQuotationStatus(
      rowData.value.quotationUuid,
      'DEPOSITED',
      statusDetails.value.remark
    );

    if (response.success) {
      // Create updated quotation object
      const updatedQuotation = {
        ...rowData.value,
        quotationStatus: 'DEPOSITED',
        remark: statusDetails.value.remark,
        initialDepositStatus: 'DEPOSITED',
        initialDepositAprovalDAte: new Date().toISOString().split('T')[0]
      };
      
      // Update store
      quotationStore.update(rowData.value.quotationUuid, updatedQuotation);
      
      toasted(true, "Deposit approved successfully!");
      closeModal();
    } else {
      toasted(false, response.error || "Failed to approve deposit");
    }
  } catch (error) {
    console.error('Deposit approval error:', error);
    toasted(false, error.response?.data?.message || "Error approving deposit");
  }
};
</script>

<template>
  <ModalParent>
    <NewFormParent class="px-4 py-2" size="xs" title="Approve Deposit">
      <div class="space-y-4">
        <!-- Display client information -->
        <div class="space-y-4 gap-4">
         <p class="my-2 gap-20"> Are you sure You want to Approve <strong>{{ draftData.clientFirstName }} {{ draftData.clientFatherName }}</strong> with quatationAmount </p>
         <p> <strong>{{ draftData.quotationAmount }}</strong>?
        </p>  <!-- <p><strong>Client Name:</strong> {{ draftData.clientFirstName }} {{ draftData.clientFatherName }}</p>
          <p><strong>Email:</strong> {{ draftData.clientEmail }}</p>
          <p><strong>Phone:</strong> {{ draftData.clientPhoneNumber }}</p>
          <p><strong>Vehicle:</strong> {{ draftData.carName }} {{ draftData.carModel }}</p>
          <p><strong>Insurance:</strong> {{ draftData.insurance }}</p>
          <p><strong>Quotation Amount:</strong> ETB {{ draftData.quotationAmount }}</p>
          <p><strong>Monthly Payment:</strong> ETB {{ draftData.monthlyPayment }}</p> -->
        </div>

        <!-- Remark input -->
        <div class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Remark 
                  </label>
                  <textarea
                    v-model="statusDetails.remark"
                    rows="4"
                    class="w-full p-2 border rounded-md"
                    placeholder="Enter remark"
                  ></textarea>
                </div>

        <!-- Submit button -->
        <div class="flex justify-end gap-2">
          <Button @click="closeModal()" variant="secondary">Cancel</Button>
          <Button class=" rounded-[4px] px-[14px] py-[8px] bg-primary text-white" @click="submitForm" variant="primary">Approve Deposit</Button>
        </div>
      </div>
    </NewFormParent>
  </ModalParent>
</template>
