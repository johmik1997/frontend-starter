<template>
  <div class="mx-auto p-3 sm:p-6 bg-white">
    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row items-start sm:items-center mb-4 pb-5 ml-2 sm:ml-5 border-b justify-between gap-2">
      <div class="flex items-center gap-2">
        <i class="pl-2" v-html="icons.pro" />
        <h1 class="text-sm sm:text-md font-semibold">
          {{ customerId.customers?.clientFirstName }}
          {{ customerId.customers?.clientFatherName }}
          {{ customerId.customers?.clientGrandFatherName }}
        </h1>
      </div>
      <p class="text-sm">Suzuki Dezire 2024 - Code 3</p>
    </header>

    <div class="bg-[rgb(246,246,255)] p-2 sm:p-4 flex flex-col w-full h-full gap-4">
      <!-- Top Grid Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Client Info Section -->
        <section class="mb-4 p-3 bg-white pt-5">
          <h2 class="text-sm font-bold mb-1 border-b">Client Info</h2>
          <div class="flex flex-col gap-2 pt-2">
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">First Name</div>
              <div class="text-xs sm:text-sm">{{ customerId.customers?.clientFirstName }}</div>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Last Name</div>
              <div class="text-xs sm:text-sm">{{ customerId.customers?.clientFatherName }}</div>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Email</div>
              <div class="text-xs sm:text-sm break-all">{{ customerId.customers?.clientEmail }}</div>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Phone Number</div>
              <div class="text-xs sm:text-sm">{{ customerId.customers?.clientPhoneNumber }}</div>
            </div>
          </div>
        </section>

        <!-- Vehicle Details Section -->
        <section class="mb-4 p-3 bg-white pt-5">
          <h2 class="text-sm font-bold mb-2 border-b">Vehicle Details</h2>
          <div class="flex flex-col gap-2 pt-2">
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Vehicle Make</div>
              <div class="text-xs sm:text-sm">{{ customerId.customers?.carName }}</div>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Vehicle Model</div>
              <div class="text-xs sm:text-sm">{{ customerId.customers?.carModel }}</div>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Vehicle Year</div>
              <div class="text-xs sm:text-sm">{{ customerId.customers?.makeYear }}</div>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Plate Code</div>
              <div class="text-xs sm:text-sm">{{ customerId.customers?.plateCode }}</div>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Insurance</div>
              <div class="text-xs sm:text-sm">{{ customerId.customers?.insurance }}</div>
            </div>
          </div>
        </section>

        <!-- Insurance Details Section -->
        <section class="mb-4 p-3 bg-white pt-5">
          <h2 class="text-sm font-bold mb-2 border-b">Payment Details</h2>
          <div class="flex flex-col gap-2 pt-2">
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Total Premium</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">ETB {{ customerId.customers?.quotationAmount }}
                /Year</div>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Monthly Repayment </div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">ETB {{ customerId.customers?.monthlyPayment }}
                /Month</div>
            </div>

          </div>
        </section>
      </div>

      <!-- Bottom Sections -->
      <div class="grid grid-cols-1 gap-4">
        <!-- Quotation Details Section -->
        <div class="bg-white shadow-md rounded-lg p-6">
          <!-- Header -->
          <div class="flex justify-between items-center mb-4 border-b py-2">
            <h2 class="text-lg font-semibold">Deposit Status</h2>
            <span
              class="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg border border-purple-300">
              Paid
            </span>
          </div>

          <!-- Deposit Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-gray-700 text-sm border-b pb-6">
            <div class="flex flex-col gap-2 pl-2">
              <span class="font-semibold">Amount</span>
              <span class="text-lg font-bold">ETB {{ depositDetails?.amount?.toLocaleString() }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <span class="font-semibold">Method</span>
              <span class="flex items-center gap-2 font-medium text-blue-600">
                <img src="@/assets/telebirr-icon.svg" alt="Payment" class="w-5 h-5" />
                {{ depositDetails?.paymentMethod || 'TeleBirr' }}
              </span>
            </div>

            <div class="flex flex-col gap-2">
              <span class="font-semibold">Deposited On</span>
              <span class="font-bold">
                {{ new Date(depositDetails?.depositDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }) }}
              </span>
            </div>

            <div class="flex flex-col gap-2 pl-2">
              <span class="font-semibold">Receipt Number</span>
              <div class="flex items-center justify-between gap-4">
                <span class="font-bold">{{ depositDetails?.receiptNumber }}</span>
              </div>
            </div>

            <div class="flex flex-col justify-center">
              <a href="#" @click.prevent="viewImage('Deposit Receipt', receiptImage)"
                class="text-blue-600 font-medium hover:underline flex items-center gap-1">
                <img src="@/assets/receipt-icon.svg" alt="Receipt" class="w-5 h-5" />
                View Deposit Receipt
              </a>
            </div>
          </div>

          <!-- Notes Input -->
          <div class="mt-4">
            <textarea placeholder="Write if there is any note or remarkable for authorization..."
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring  h-44"></textarea>
          </div>

          <!-- Disbursement Button -->
          <div class="mt-4">
            <button @click="$router.push(`/dispersementDetails/${customerId.customers?.quotationUuid}`)"
              class="w-full bg-[#3C3C9E] text-white py-3 rounded-lg font-semibold hover:bg-[#3C3C9E]">
              Make Payment for Insurance
            </button>
          </div>
        </div>
        <!-- Libre Section -->

      </div>
    </div>
  </div>
</template>

<script setup>
import { usePaginations } from '@/composables/usePaginationTemp';
import { removeUndefined, toasted } from '@/utils/utils';
import { openModal } from "@customizer/modal-x";
import { getDepositDetails, getCustomersbyId } from '../api/depositsApi';
import { useRoute } from 'vue-router';
import { useCustomers } from '../store/depositidStore';
import Button from '@/components/Button.vue';
import icons from '@/utils/icons';
import { ref, onMounted, watch } from 'vue';
import ApiService from "@/service/ApiService";
import { useApiRequest } from '@/composables/useApiRequest';
const req = useApiRequest();
const customerId = useCustomers();
const route = useRoute();
const userUuid = route.params?.depositUuid;

// State management
const depositDetails = ref(null);
const receiptImage = ref(null);

const viewImage = (title, imageUrl) => {
  if (!imageUrl) {
    toasted(false, "", "Receipt image not available");
    return;
  }
  openModal('ImageViewer', {
    title,
    imageUrl
  });
};

const fetchDepositDetails = async () => {
  try {
    const quotationUuid = customerId.customers?.quotationUuid;
    if (!quotationUuid) {
      console.error('No quotation UUID available');
      return;
    }

    await req.send(
      () => getDepositDetails(quotationUuid),
      (res) => {
        if (res?.data) {
          depositDetails.value = {
            amount: res.data.amount,
            paymentMethod: res.data.paymentMethod,
            receiptNumber: res.data.receiptNumber,
            depositDate: res.data.depositDate,
            deposited: res.data.deposited
          };

          // Handle the attachment (base64 image)
          if (res.data.attachment) {
            receiptImage.value = `data:image/jpeg;base64,${res.data.attachment}`;
          }
        }
      }
    );
  } catch (error) {
    console.error('Error fetching deposit details:', error);
  }
};

// Watch for changes in customer data
watch(
  () => customerId.customers,
  (newValue) => {
    if (newValue?.quotationUuid) {
      fetchDepositDetails();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (userUuid) {
    send(); // Use the send method instead of fetch
  }
});

// Customer data
const customer = ref({
  image: 'customer-image-url.jpg',
  joinedDate: '23-05-2024',
  fullName: 'Birhane Araya',
  phoneNumber: '+251 945 065 432',
  address: 'Bole, Woreda 2, Addis Ababa',
  email: 'birhanearaya23@gmail.com'
});

// Mobile data
const mobile = ref({
  deviceBrand: 'iPhone 15',
  handsetCost: 'ETB 120,000.00',
  manufacturedYear: '2023',
  serialNumber: 'AD487598E',
  imei: '495860469593',
  imei2: '1239804710923'
});

// Policy data
const policy = ref({
  policyNumber: 'L389247',
  status: 'Active',
  expiryDate: 'Araya',
  premiumPayments: 23
});

const client = ref({
  firstName: 'Birhane',
  lastName: 'Araya',
  email: 'birhanearya23@gmail.com',
  phone: '+251 946065432',
  image: 'path_to_image.jpg'
});

const calculateMonthlyPremium = (quotationAmount) => {
  return quotationAmount / 12;
};

const calculateDeposit = (quotationAmount) => {
  return quotationAmount * 0.22;
};

const quotation = ref({
  amount: customerId.customers?.quotationAmount || 0,
  deposit: calculateDeposit(customerId.customers?.quotationAmount || 0),
  premium: calculateMonthlyPremium(customerId.customers?.quotationAmount || 0),
});

const props = defineProps({
  pending: {
    type: Boolean,
    default: false,
  },
  onSubmit: {
    type: Function,
  },
});

const { send, pending, error } = usePaginations({
  store: customerId,
  cb: async () => {
    try {
      if (!userUuid) return null;
      const response = await getCustomersbyId(userUuid);
      return response;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      return null;
    }
  },
});

watch(
  () => customerId.customers,
  (newValue) => {
    if (newValue) {
      const quotationAmount = newValue.quotationAmount || 0;
      quotation.value.amount = quotationAmount;
      quotation.value.deposit = calculateDeposit(quotationAmount);
      quotation.value.premium = calculateMonthlyPremium(quotationAmount);
    }
  }
);

// Editing states
const isEditing1 = ref(false);
const isEditing2 = ref(false);
const isEditing3 = ref(false);
const editedAmount1 = ref(quotation.value.amount);
const editedAmount2 = ref(quotation.value.deposit);
const editedAmount3 = ref(quotation.value.premium);
const isSubmitting = ref(false);

const toggleEdit1 = () => {
  editedAmount1.value = quotation.value.amount;
  isEditing1.value = true;
  isEditing2.value = false;
  isEditing3.value = false;
};

const toggleEdit2 = () => {
  editedAmount2.value = quotation.value.deposit;
  isEditing2.value = true;
  isEditing1.value = false;
  isEditing3.value = false;
};

const toggleEdit3 = () => {
  editedAmount3.value = quotation.value.premium;
  isEditing3.value = true;
  isEditing2.value = false;
  isEditing1.value = false;
};

const saveEdit = async () => {
  if (isEditing1.value) {
    const newAmount = parseFloat(editedAmount1.value);
    quotation.value.amount = newAmount;
    quotation.value.deposit = calculateDeposit(newAmount);
    quotation.value.premium = calculateMonthlyPremium(newAmount);

    isEditing1.value = false;
    editedAmount1.value = '';
  }
};

const sendFinalQuotation = async () => {
  try {
    isSubmitting.value = true;
    const quotationUuid = customerId.customers?.quotationUuid;

    if (!quotationUuid) {
      toasted(false, '', 'Quotation ID not found');
      return;
    }

    const response = await setQuotation(quotationUuid, quotation.value.amount, 'quotation');

    if (response.success) {
      await setQuotation(quotationUuid, quotation.value.deposit, 'deposit');
      await setQuotation(quotationUuid, quotation.value.premium, 'premium');
      toasted(true, 'Final quotation sent successfully', '');
    } else {
      toasted(false, '', response.error || 'Failed to send quotation');
    }
  } catch (error) {
    console.error('Error sending final quotation:', error);
    toasted(false, '', 'An error occurred while sending the quotation');
  } finally {
    isSubmitting.value = false;
  }
};

console.log(customerId.customers?.clientFirstName);
</script>

<style scoped></style>
