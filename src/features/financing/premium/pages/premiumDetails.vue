<template>
  <div class="mx-auto p-3 sm:p-6 bg-white">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row items-start sm:items-center mb-4 pb-5 ml-2 sm:ml-5 border-b justify-between gap-2">
      <div class="flex items-center gap-2">
        <i class="pl-2" v-html="icons.pro" />
        <h1 class="text-sm sm:text-md font-semibold">
          {{ customerId.customers?.clientFirstName }} 
          {{ customerId.customers?.clientFatherName }} 
          {{ customerId.customers?.clientGrandFatherName }}
        </h1>
      </div>
      <p class="text-sm">{{ customerId.customers?.carName }} {{ customerId.customers?.carModel }} - {{ customerId.customers?.carType }}</p>
    </header>

    <!-- Tabs -->
    <div class="border-b flex space-x-6 px-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="py-2 px-4 text-sm font-medium"
        :class="activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-gray-500'"
      >
        {{ tab }}
      </button>
    </div>

    <div class="bg-[rgb(246,246,255)] p-2 sm:p-4 flex flex-col w-full h-full gap-4">
      <!-- Client & Vehicle Detail Tab -->
      <div v-if="activeTab === 'Client & Vehicle Detail'" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Client Info Section -->
        <section class="mb-4 p-3 bg-white pt-5">
          <h2 class="text-sm font-bold mb-1 border-b">Client Info</h2>
          <div class="flex flex-col gap-2 pt-2">
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">First Name</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">{{ customerId.customers?.clientFirstName }}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Father Name</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">{{ customerId.customers?.clientFatherName }}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Grandfather Name</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">{{ customerId.customers?.clientGrandFatherName }}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Phone Number</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">{{ customerId.customers?.phoneNumber }}</div>
            </div>
          </div>
        </section>

        <!-- Vehicle Details Section -->
        <section class="mb-4 p-3 bg-white pt-5">
          <h2 class="text-sm font-bold mb-1 border-b">Vehicle Details</h2>
          <div class="flex flex-col gap-2 pt-2">
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Car Name</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">{{ customerId.customers?.carName }}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Car Model</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">{{ customerId.customers?.carModel }}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Car Type</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">{{ customerId.customers?.carType }}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Insurance</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">{{ customerId.customers?.insuranceName }}</div>
            </div>
          </div>
        </section>

        <!-- Payment Details Section -->
        <section class="mb-4 p-3 bg-white pt-5">
          <h2 class="text-sm font-bold mb-1 border-b">Payment Details</h2>
          <div class="flex flex-col gap-2 pt-2">
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Total Premium</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">ETB {{ quotation.amount?.toLocaleString() }}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs sm:text-sm font-normal text-[#2B3674]">Monthly Repayment</div>
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">ETB {{ quotation.premium?.toLocaleString() }}</div>
            </div>
          </div>
        </section>
      </div>

      <!-- Payments Tab -->
      <div v-if="activeTab === 'Payments'" class="bg-white p-4 rounded">
        <!-- Current Payment Section -->
        <div v-if="nextUnpaidPayment" class="bg-white p-6 rounded-lg shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium">{{ nextUnpaidPayment.number }}th Payment</h3>
            <div class="text-gray-600">
              {{ nextUnpaidPayment.dueDate }} 
              <span class="text-gray-500">(in {{ nextUnpaidPayment.daysRemaining }} Days)</span>
            </div>
          </div>

          <!-- Payment Details Grid -->
          <div class="grid grid-cols-4 gap-8 mb-6">
            <!-- Monthly Payment -->
            <div>
              <div class="text-gray-600 text-sm mb-2">Monthly Payment</div>
              <div class="text-xl font-medium">ETB {{ nextUnpaidPayment.monthlyPayment?.toLocaleString() }}</div>
            </div>

            <!-- Late Payment Fee -->
            <div>
              <div class="text-gray-600 text-sm mb-2">Late Payment Fee</div>
              <div class="text-xl font-medium">ETB {{ nextUnpaidPayment.lateFee?.toLocaleString() }}</div>
            </div>

            <!-- Missed Payment Penalty -->
            <div>
              <div class="text-gray-600 text-sm mb-2">Missed Payment Penalty</div>
              <div class="text-xl font-medium">ETB {{ nextUnpaidPayment.penalty?.toLocaleString() }}</div>
            </div>

            <!-- Total Payment -->
            <div>
              <div class="text-gray-600 text-sm mb-2">Total Payment</div>
              <div class="text-xl font-medium">ETB {{ nextUnpaidPayment.total?.toLocaleString() }}</div>
            </div>
          </div>

          <!-- Payment Button -->
          <button 
            @click="handlePayment(nextUnpaidPayment.month)"
            :disabled="quotationUuid && pendingPayments[quotationUuid]"
            class="w-full bg-[#3C3C9E] text-white py-2 rounded-lg text-base font-medium hover:bg-[#4343c6] transition-colors"
          >
            {{ (quotationUuid && pendingPayments[quotationUuid]) ? 'Processing...' : 'Make Payment' }}
          </button>
        </div>

        <!-- Payment History Section -->
        <div class="bg-white rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-gray-700">Payment History</h3>
            <div class="flex gap-4 items-center">
              <div class="relative">
                <input 
                  type="text" 
                  placeholder="Search Payment ID..." 
                  class="pl-10 pr-4 py-2 border rounded-lg text-sm"
                >
                <i class="absolute left-3 top-1/2 transform -translate-y-1/2" v-html="icons.search"></i>
              </div>
              <button class="text-[#4318FF] border border-[#4318FF] px-4 py-2 rounded-lg text-sm">
                Print History
              </button>
            </div>
          </div>

          <!-- Payment History Table -->
          <table class="w-full">
            <thead>
              <tr class="text-left text-gray-600 text-sm">
                <th class="py-3">#</th>
                <th>Payment ID</th>
                <th>Schedules</th>
                <th>Paid on</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in paymentHistory" :key="payment.id" 
                  :class="{'bg-red-50': payment.status === 'Missed', 'bg-purple-50': payment.type === 'Deposit'}">
                <td class="py-3">{{ payment.index }}</td>
                <td>{{ payment.paymentId }}</td>
                <td>
                  <span :class="{'text-[#4318FF]': true}">{{ payment.schedule }}</span>
                </td>
                <td>{{ payment.paidOn }}</td>
                <td>ETB {{ payment.amount.toLocaleString() }}</td>
                <td>
                  <span :class="{
                    'bg-purple-100 text-purple-700 px-2 py-1 rounded': payment.status === 'Paid',
                    'bg-red-100 text-red-700 px-2 py-1 rounded': payment.status === 'Missed'
                  }">
                    {{ payment.status }}
                  </span>
                </td>
                <td>
                  <button 
                    v-if="payment.status === 'Paid'"
                    @click="downloadReceipt(payment.paymentId)" 
                    class="text-[#4318FF] border border-[#4318FF] px-4 py-1 rounded"
                  >
                    Receipt
                  </button>
                  <button 
                    v-else
                    @click="sendReminder(payment.paymentId)" 
                    class="bg-[#4318FF] text-white px-4 py-1 rounded"
                  >
                    Notify
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Schedules Tab -->
      <div v-if="activeTab === 'Schedules'" class="bg-white p-4 rounded">
        <div v-if="loading" class="flex justify-center items-center h-40">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else>
          <!-- Calendar Section -->
          <div class="mb-8">
            <h3 class="text-gray-700 mb-4">Calendar</h3>
            <div class="grid gap-2">
              <div v-for="month in months" :key="month.name" class="flex items-center">
                <div class="w-12 text-sm text-gray-600 font-medium">{{ month.name }}</div>
                <div class="flex gap-2">
                  <div 
                    v-for="day in 19" 
                    :key="day"
                    class="w-8 h-8 flex items-center justify-center text-sm rounded"
                    :class="{
                      'bg-[#4318FF] text-white': month.paymentDay === day,
                      'bg-purple-100': month.graceDays.includes(day),
                      'bg-orange-100': month.lateDays.includes(day),
                      'text-gray-400': !month.graceDays.includes(day) && !month.lateDays.includes(day) && month.paymentDay !== day
                    }"
                  >
                    {{ day }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Payments Section -->
          <div class="mb-8">
            <h3 class="text-gray-700 mb-4">Next payments</h3>
            <div class="space-y-2">
              <div v-for="payment in nextPayments" :key="payment.monthlyPaymentUuid"
                class="grid grid-cols-5 gap-4 p-3 bg-gray-50 rounded items-center"
              >
                <span class="text-sm">{{ payment.installment }}</span>
                <div class="text-sm">ETB {{ payment.amount.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-sm">Interest: ETB {{ payment.interest.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-sm">Balance: ETB {{ payment.remainingBalance.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-sm">{{ payment.date }}</div>
              </div>
            </div>
          </div>

          <!-- Past Payments Section -->
          <div>
            <h3 class="text-gray-700 mb-4">Past payments</h3>
            <div class="space-y-2">
              <div v-for="payment in pastPayments" :key="payment.monthlyPaymentUuid"
                class="flex items-center justify-between p-3 bg-purple-50 rounded"
              >
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <i class="text-purple-600">✓</i>
                  </div>
                  <span class="text-sm">{{ payment.installment }}</span>
                </div>
                <div class="text-sm">ETB {{ payment.amount.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-sm">{{ payment.date }}</div>
                <button class="text-[#4318FF] border border-[#4318FF] px-4 py-1 rounded text-sm">
                  Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomers } from '../../dispersement/store/dispersementStore';
import { getCustomersbyId } from '../../dispersement/api/dispersementApi';
import { usePaginations } from '@/composables/usePaginations';
import icons from '@/utils/icons';
import { getMonthlyPayments, makePayment, getPaymentReceipt, sendPaymentReminder } from '../api/premiumApi';
import { toasted } from '@/utils/utils';
import { useApiRequest } from '@/composables/useApiRequest';

const route = useRoute();
const customerId = useCustomers();
const userUuid = route.params?.premiumUuid;

const tabs = ["Client & Vehicle Detail", "Payments", "Schedules"];
const activeTab = ref("Client & Vehicle Detail");

// Quotation calculations
const calculateMonthlyPremium = (quotationAmount) => {
  return quotationAmount / 12;
};

const quotation = ref({
  amount: customerId.customers?.quotationAmount || 0,
  premium: calculateMonthlyPremium(customerId.customers?.quotationAmount || 0),
});

// Fetch customer data
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

// Watch for customer data changes
watch(
  () => customerId.customers,
  (newValue) => {
    if (newValue) {
      const quotationAmount = newValue.quotationAmount || 0;
      quotation.value.amount = quotationAmount;
      quotation.value.premium = calculateMonthlyPremium(quotationAmount);
    }
  }
);

onMounted(() => {
  send();
});

// Add these new refs and data
// const paymentHistory = ref([
//   {
//     index: '-',
//     paymentId: 'AH-LI-4982434',
//     type: 'Deposit',
//     schedule: 'Deposit',
//     paidOn: '8-1-2025 | 09:30 PM',
//     amount: 12200,
//     status: 'Paid'
//   },
//   {
//     index: 1,
//     paymentId: 'AH-LI-4982448',
//     schedule: '3 of 9',
//     paidOn: '8-2-2025 | 09:30 PM',
//     amount: 2200,
//     status: 'Paid'
//   },
//   {
//     index: 2,
//     paymentId: 'AH-LI-4982594',
//     schedule: '2 of 9',
//     paidOn: '8-3-2025 | 09:30 PM',
//     amount: 2200,
//     status: 'Paid'
//   },
//   {
//     index: 3,
//     paymentId: 'AH-LI-4982434',
//     schedule: '1 of 9',
//     paidOn: '8-4-2025 | 09:30 PM',
//     amount: 2200,
//     status: 'Missed'
//   }
// ]);

const currentPayment = ref({
  number: 4,
  dueDate: '8-3-2025',
  daysRemaining: 5,
  monthlyPayment: 2200,
  lateFee: 200,
  penalty: 200,
  total: 2400
});

// Add these refs

const currentAction = ref(null);

// Add function to handle payment
const pendingPayments = reactive({});
const req = useApiRequest();
const quotationUuid = ref(route.params?.premiumUuid);

// Initialize the pending state for this quotation
onMounted(() => {
  if (quotationUuid.value) {
    pendingPayments[quotationUuid.value] = false;
  }
});

const handlePayment = (month) => {
  if (!quotationUuid.value) return;
  
  pendingPayments[quotationUuid.value] = true;

  req.send(
    () => makePayment(quotationUuid.value, month),
    res => {
      pendingPayments[quotationUuid.value] = false;
      console.log(res); // Log the response for debugging

      if (res.success) {
        const paymentUrl = res.data; // Assuming the URL is directly in res.data
        if (paymentUrl) {
          console.log('Redirecting to:', paymentUrl);
          window.location.href = paymentUrl;
        } else {
          console.error('Payment URL not found in response');
          toasted(false, 'Payment URL not found');
        }
      } else {
        toasted(false, 'Please click the upcoming link to pay', res.error);
      }
    }
  );
};

// Add function to handle receipt download
const downloadReceipt = async (paymentId) => {
  try {
    const response = await getPaymentReceipt(paymentId);
    // Handle PDF download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${paymentId}.pdf`;
    link.click();
  } catch (error) {
    toasted(false, 'Failed to download receipt', error.message);
  }
};

// Add function to handle notification
const sendReminder = async (paymentId) => {
  try {
    const response = await sendPaymentReminder(paymentId);
    if (response.success) {
      toasted(true, 'Payment reminder sent successfully');
    }
  } catch (error) {
    toasted(false, 'Failed to send reminder', error.message);
  }
};

const monthlyPayments = ref([]);
const loading = ref(false);

const fetchMonthlyPayments = async () => {
  loading.value = true;
  try {
    const response = await getMonthlyPayments(route.params.premiumUuid);
    monthlyPayments.value = response.data;
  } catch (error) {
    console.error('Failed to fetch monthly payments:', error);
  } finally {
    loading.value = false;
  }
};

// Format date to get month name
const getMonthFromDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', { month: 'short' }).toUpperCase();
};

// Get day from date
const getDayFromDate = (dateString) => {
  return new Date(dateString).getDate();
};

// Computed property for calendar data
const months = computed(() => {
  if (!monthlyPayments.value.length) return [];
  
  return monthlyPayments.value.map(payment => {
    const paymentDay = getDayFromDate(payment.paymentDate);
    return {
      name: getMonthFromDate(payment.paymentDate),
      paymentDay: paymentDay,
      graceDays: [paymentDay - 3, paymentDay - 2, paymentDay - 1],
      lateDays: [paymentDay + 1, paymentDay + 2],
      payment: payment
    };
  });
});

// Computed properties for payments sections
const pastPayments = computed(() => {
  return monthlyPayments.value
    .filter(payment => payment.payed)
    .map(payment => ({
      installment: `${payment.month}${getOrdinalSuffix(payment.month)}`,
      amount: payment.payment,
      date: new Date(payment.paidDAte).toLocaleDateString(),
      monthlyPaymentUuid: payment.monthlyPaymentUuid
    }));
});

const nextPayments = computed(() => {
  return monthlyPayments.value
    .filter(payment => !payment.payed)
    .map(payment => ({
      installment: `${payment.month}${getOrdinalSuffix(payment.month)}`,
      amount: payment.payment,
      date: new Date(payment.paymentDate).toLocaleDateString(),
      interest: payment.interest,
      principal: payment.principal,
      remainingBalance: payment.remainingBalance,
      monthlyPaymentUuid: payment.monthlyPaymentUuid
    }));
});

// Helper function for ordinal suffixes
const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j == 1 && k != 11) return "st";
  if (j == 2 && k != 12) return "nd";
  if (j == 3 && k != 13) return "rd";
  return "th";
};

onMounted(() => {
  fetchMonthlyPayments();
});

// Computed property to get the next unpaid payment
const nextUnpaidPayment = computed(() => {
  const unpaidPayment = monthlyPayments.value.find(payment => !payment.payed);
  if (!unpaidPayment) return null;

  return {
    number: unpaidPayment.month,
    month: unpaidPayment.month,
    dueDate: new Date(unpaidPayment.paymentDate).toLocaleDateString(),
    daysRemaining: Math.ceil((new Date(unpaidPayment.paymentDate) - new Date()) / (1000 * 60 * 60 * 24)),
    monthlyPayment: unpaidPayment.payment,
    lateFee: unpaidPayment.lateFee || 0,
    penalty: unpaidPayment.penalty || 0,
    total: unpaidPayment.payment + (unpaidPayment.lateFee || 0) + (unpaidPayment.penalty || 0)
  };
});

// Update currentPayment to use the computed value
watch(nextUnpaidPayment, (newValue) => {
  if (newValue) {
    currentPayment.value = newValue;
  }
});

// Update the payment history computed property to only show paid payments
const paymentHistory = computed(() => {
  return monthlyPayments.value
    .filter(payment => payment.payed)
    .map((payment, index) => ({
      index: index + 1,
      paymentId: payment.monthlyPaymentUuid,
      schedule: `${payment.month} of ${monthlyPayments.value.length}`,
      paidOn: new Date(payment.paidDate).toLocaleString(),
      amount: payment.payment,
      status: 'Paid'
    }));
});

// Add deposit to payment history if it exists
watch(() => customerId.customers?.deposit, (newValue) => {
  if (newValue) {
    paymentHistory.value.unshift({
      index: '-',
      paymentId: customerId.customers.depositId,
      type: 'Deposit',
      schedule: 'Deposit',
      paidOn: new Date(customerId.customers.depositDate).toLocaleString(),
      amount: newValue,
      status: 'Paid'
    });
  }
});
</script>

<style scoped>
button {
  transition: all 0.3s;
}
</style>
