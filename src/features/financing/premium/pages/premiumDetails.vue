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
              <div class="text-xs sm:text-sm font-bold text-[#494F51]">{{ customerId.customers?.insurance }}</div>
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
      <!-- Payment Section -->
      <div v-if="activeTab === 'Payments'" class="bg-white p-6">
        <!-- Show this when there are no unpaid payments -->
        <div v-if="!nextUnpaidPayment" class="text-center py-8">
          <p class="text-gray-600">All payments have been completed.</p>
        </div>

        <!-- Show payment details only when nextUnpaidPayment exists and is PENDING -->
        <div v-if="nextUnpaidPayment && nextUnpaidPayment.monthlyPaymentStatus === 'PENDING' && customerId.customers?.quotationStatus === 'DISPERSED'">
          <!-- Current Payment Header -->
          <div class="flex justify-between items-center mb-6">
            <div class="text-lg font-medium">{{ nextUnpaidPayment.number }}th Payment</div>
            <div class="text-gray-600">
              {{ nextUnpaidPayment.dueDate }} (In {{ nextUnpaidPayment.daysRemaining }} Days)
            </div>
          </div>

          <!-- Payment Details Grid -->
          <div  v-if="customerId.customers?.quotationStatus === 'DISPERSED'" class="grid grid-cols-4 gap-8 mb-6">
            <div>
              <div class="text-gray-600 text-sm mb-1">Monthly Payment</div>
              <div class="text-lg font-medium">ETB {{ nextUnpaidPayment.monthlyPayment?.toLocaleString() }}</div>
            </div>

            <div>
              <div class="text-gray-600 text-sm mb-1">Late Payment Fee</div>
              <div class="text-lg font-medium">ETB {{ nextUnpaidPayment.lateFee?.toLocaleString() }}</div>
            </div>

            <div>
              <div class="text-gray-600 text-sm mb-1">Missed Payment Penalty</div>
              <div class="text-lg font-medium">ETB {{ nextUnpaidPayment.penalty?.toLocaleString() }}</div>
            </div>

            <div>
              <div class="text-gray-600 text-sm mb-1">Total Payment</div>
              <div class="text-lg font-medium">ETB {{ nextUnpaidPayment.total?.toLocaleString() }}</div>
            </div>
          </div>

          <!-- Make Payment Button -->
          <button 
          v-if="customerId.customers?.quotationStatus === 'DISPERSED'"
            @click="handlePayment"
            :disabled="pendingPayments[nextUnpaidPayment.monthlyPaymentUuid]"
            class="w-full bg-[#3C3C9E] text-white py-3 rounded text-base font-medium hover:bg-[#4343c6] transition-colors mb-8"
          >
            {{ pendingPayments[nextUnpaidPayment.monthlyPaymentUuid] ? 'Processing...' : 'Make Payment' }}
          </button>
        </div>

        <!-- Payment History Section -->
        <div class="mt-8">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-gray-700 font-medium">Payment History</h3>
            <div class="flex gap-4 items-center">
              <div class="relative">
                <input 
                  type="text" 
                  placeholder="Search Payment ID..." 
                  class="pl-10 pr-4 py-2 border rounded text-sm"
                >
                <i class="absolute left-3 top-1/2 transform -translate-y-1/2" v-html="icons.search"></i>
              </div>
              <button class="text-[#4318FF] border border-[#4318FF] px-4 py-2 rounded text-sm">
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
                  :class="{'bg-red-50': payment.monthlyPaymentStatus === 'MISSED', 'bg-purple-50': payment.type === 'Deposit'}">
                <td class="py-3">{{ payment.index }}</td>
                <td>{{ payment.paymentId }}</td>
                <td>
                  <span class="text-[#4318FF]">{{ payment.schedule }}</span>
                </td>
                <td>{{ payment.paidOn }}</td>
                <td>ETB {{ payment.amount.toLocaleString() }}</td>
                <td>
                  <span :class="{
                    'bg-purple-100 text-purple-700 px-3 py-1 rounded': payment.monthlyPaymentStatus === 'PAID',
                    'bg-red-100 text-red-700 px-3 py-1 rounded': payment.monthlyPaymentStatus === 'MISSED'
                  }">
                    {{ payment.monthlyPaymentStatus }}
                  </span>
                </td>
                <td>
                  <button 
                    v-if="payment.monthlyPaymentStatus === 'PAID'"
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
      <div v-if="activeTab === 'Schedules'" class="bg-white p-6 rounded">
        <div v-if="loading" class="flex justify-center items-center h-40">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else>
          <!-- Calendar Section -->
          <div class="mb-8">
            <h3 class="text-gray-700 mb-4">Calendar</h3>
            <div class="grid gap-2">
              <div v-for="monthData in calendarData" 
                   :key="monthData.month" 
                   class="flex items-center">
                <div class="w-12 text-sm text-gray-600 font-medium">{{ monthData.month }}</div>
                <div class="flex gap-1">
                  <div 
                    v-for="(dayObj, index) in monthData.days" 
                    :key="index"
                    class="w-8 h-8 flex items-center justify-center text-sm"
                    :class="getPaymentColorClasses(dayObj, {
                      paymentDate: monthData.paymentDate
                    })"
                  >
                    {{ dayObj.day }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Past payments Section -->
          <div class="mb-8">
            <h3 class="text-gray-700 mb-4">Past payments</h3>
            <div class="space-y-2">
              <div v-for="payment in pastPayments" :key="payment.monthlyPaymentUuid"
                   class="flex items-center justify-between p-3 rounded bg-purple-50"
              >
                <div class="flex items-center gap-4">
                  <div class="w-6 h-6 rounded-full bg-[#3C3C9E] flex items-center justify-center">
                    <i class="text-white">✓</i>
                  </div>
                  <span class="text-sm">
                    {{ payment.month }}{{ getOrdinalSuffix(payment.month) }}
                  </span>
                </div>
                <div class="text-sm">ETB {{ formatCurrency(payment.payment) }}</div>
                <div class="text-sm">{{ payment.paymentDate }}</div>
                <button class="text-[#3C3C9E] border border-[#3C3C9E] px-4 py-1 rounded-md text-sm">
                  Receipt
                </button>
              </div>
              <div v-for="payment in missedPayments" :key="payment.monthlyPaymentUuid"
                   class="flex items-center justify-between p-3 rounded bg-[#FFD9D9]"
              >
                <div class="flex items-center gap-4">
                  <div class="w-6 h-6 rounded-full bg-[#e8c5c5] flex items-center justify-center">
                    
                  </div>
                  <span class="text-sm">
                    {{ payment.month }}{{ getOrdinalSuffix(payment.month) }}
                  </span>
                </div>
                <div class="text-sm">ETB {{ formatCurrency(payment.payment) }}</div>
                <div class="text-sm text-red-500">{{ payment.paymentDate }}</div>
                <button class="text-[#3C3C9E] border border-[#3C3C9E] px-4 py-1 rounded-md text-sm">
                  View
                </button>
              </div>
            </div>
          </div>

          <!-- Next payments Section -->
          <div>
            <h3 class="text-gray-700 mb-4">Next payments</h3>
            <div class="space-y-2">
              <div v-for="payment in nextPayments" :key="payment.monthlyPaymentUuid"
                   class="grid grid-cols-3 p-3 bg-gray-50 rounded items-center"
              >
                <span class="text-sm">{{ payment.month }}{{ getOrdinalSuffix(payment.month) }}</span>
                <div class="text-sm">ETB {{ formatCurrency(payment.payment) }}</div>
                <div class="text-sm">{{ payment.paymentDate }}</div>
               
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
import { usePaginations } from '@/composables/usepaginations';
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
//     monthlyPaymentStatus: 'Paid'
//   },
//   {
//     index: 1,
//     paymentId: 'AH-LI-4982448',
//     schedule: '3 of 9',
//     paidOn: '8-2-2025 | 09:30 PM',
//     amount: 2200,
//     monthlyPaymentStatus: 'Paid'
//   },
//   {
//     index: 2,
//     paymentId: 'AH-LI-4982594',
//     schedule: '2 of 9',
//     paidOn: '8-3-2025 | 09:30 PM',
//     amount: 2200,
//     monthlyPaymentStatus: 'Paid'
//   },
//   {
//     index: 3,
//     paymentId: 'AH-LI-4982434',
//     schedule: '1 of 9',
//     paidOn: '8-4-2025 | 09:30 PM',
//     amount: 2200,
//     monthlyPaymentStatus: 'Missed'
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

const handlePayment = () => {
  if (!nextUnpaidPayment.value) return;
  
  const monthlyPaymentUuid = nextUnpaidPayment.value.monthlyPaymentUuid;
  pendingPayments[monthlyPaymentUuid] = true;

  req.send(
    () => makePayment(monthlyPaymentUuid),
    async res => {
      pendingPayments[monthlyPaymentUuid] = false;
      if (res.data) {
        // Store the payment URL
        const paymentUrl = res.data;
        
        // Refresh the monthly payments data
        await fetchMonthlyPayments();
        
        // Redirect to payment URL
        window.location.href = paymentUrl;
      } else {
        toasted(false, 'Payment URL not found');
      }
    },
    error => {
      pendingPayments[monthlyPaymentUuid] = false;
      toasted(false, 'Failed to initiate payment', error.message);
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
    
    // Sort monthly payments by month number
    monthlyPayments.value.sort((a, b) => a.month - b.month);
  } catch (error) {
    console.error('Failed to fetch monthly payments:', error);
    toasted(false, 'Failed to fetch payment details');
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
    ?.filter(payment => payment.monthlyPaymentStatus === 'PAID')
    .map(payment => ({
      monthlyPaymentUuid: payment.monthlyPaymentUuid,
      month: payment.month,
      payment: payment.payment,
      paymentDate: new Date(payment.paymentDate).toLocaleDateString(),
      paidDate: payment.paidDAte ? new Date(payment.paidDAte).toLocaleDateString() : null,
      monthlyPaymentStatus: payment.monthlyPaymentStatus
    }));
});
const missedPayments = computed(() => {
  return monthlyPayments.value
    ?.filter(payment => payment.monthlyPaymentStatus === 'MISSED')
    .map(payment => ({
      monthlyPaymentUuid: payment.monthlyPaymentUuid,
      month: payment.month,
      payment: payment.payment,
      paymentDate: new Date(payment.paymentDate).toLocaleDateString(),
      paidDate: payment.paidDAte ? new Date(payment.paidDAte).toLocaleDateString() : null,
      monthlyPaymentStatus: payment.monthlyPaymentStatus
    }));
});


const nextPayments = computed(() => {
  return monthlyPayments.value
    ?.filter(payment => payment.monthlyPaymentStatus === 'PENDING')
    .map(payment => ({
      monthlyPaymentUuid: payment.monthlyPaymentUuid,
      month: payment.month,
      payment: payment.payment,
      paymentDate: new Date(payment.paymentDate).toLocaleDateString(),
      monthlyPaymentStatus: payment.monthlyPaymentStatus
    }));
});

// Add this to format currency
const formatCurrency = (amount) => {
  return amount?.toLocaleString(undefined, { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });
};

// Helper function for ordinal suffixes
const getOrdinalSuffix = (number) => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = number % 100;
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
};

onMounted(() => {
  fetchMonthlyPayments();
});

// Computed property to get the next unpaid payment
const nextUnpaidPayment = computed(() => {
  const unpaidPayment = monthlyPayments.value
    ?.filter(payment => payment.monthlyPaymentStatus === 'PENDING')
    .sort((a, b) => a.month - b.month)[0];
    
  if (!unpaidPayment) return null;

  return {
    number: unpaidPayment.month,
    month: unpaidPayment.month,
    dueDate: new Date(unpaidPayment.paymentDate).toLocaleDateString(),
    daysRemaining: Math.ceil((new Date(unpaidPayment.paymentDate) - new Date()) / (1000 * 60 * 60 * 24)),
    monthlyPayment: unpaidPayment.payment,
    lateFee: 0, // You might want to calculate this based on your business logic
    penalty: 0, // You might want to calculate this based on your business logic
    total: unpaidPayment.payment,
    monthlyPaymentUuid: unpaidPayment.monthlyPaymentUuid,
    monthlyPaymentStatus: unpaidPayment.monthlyPaymentStatus
  };
});

// Update currentPayment to use the computed value
watch(nextUnpaidPayment, (newValue) => {
  if (newValue) {
    currentPayment.value = newValue;
  }
});

// Update the payment history computed property
const paymentHistory = computed(() => {
  const paidPayments = monthlyPayments.value
    ?.filter(payment => payment.monthlyPaymentStatus === 'PAID')
    .map((payment, index) => ({
      index: index + 1,
      paymentId: payment.monthlyPaymentUuid,
      schedule: `${payment.month} of ${monthlyPayments.value.length}`,
      paidOn: payment.paidDAte ? new Date(payment.paidDAte).toLocaleString() : new Date(payment.paymentDate).toLocaleString(),
      amount: payment.payment,
      monthlyPaymentStatus: payment.monthlyPaymentStatus
    })) || [];

  // Add deposit if it exists
  if (customerId.value?.customers?.deposit) {
    paidPayments.unshift({
      index: '-',
      paymentId: customerId.value.customers.depositId,
      type: 'Deposit',
      schedule: 'Deposit',
      paidOn: new Date(customerId.value.customers.depositDate).toLocaleString(),
      amount: customerId.value.customers.deposit,
      monthlyPaymentStatus: 'PAID'
    });
  }

  return paidPayments;
});

// Add mounted hook to fetch initial data
onMounted(async () => {
  await fetchMonthlyPayments();
});

// Add these helper functions in your script setup
const getMonthAbbr = (date) => {
  return new Date(date).toLocaleString('en-US', { month: 'short' }).toUpperCase();
};

const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getPaymentColorClasses = (dayObj, payment) => {
  if (!payment?.paymentDate) return 'text-gray-400';
  
  const paymentDate = new Date(payment.paymentDate);
  const paymentDay = paymentDate.getDate();
  const paymentMonth = getMonthAbbr(paymentDate);
  
  // Only apply special colors if we're in the payment month
  if (dayObj.month !== paymentMonth) {
    return 'text-gray-400';
  }
  
  const day = dayObj.day;
  
  // Grace period: 3 days before payment date
  const gracePeriodStart = paymentDay - 3;
  // Late period: 2 days after payment date
  const latePeriodEnd = paymentDay + 2;
  
  if (day === paymentDay) {
    return 'bg-[#3C3C9E] text-white rounded-full'; // Payment day (blue)
  } else if (day >= gracePeriodStart && day < paymentDay) {
    return 'bg-purple-100 rounded'; // Grace period (purple)
  } else if (day > paymentDay && day <= latePeriodEnd) {
    return 'bg-orange-100 rounded'; // Late period (orange)
  }
  
  return 'text-gray-400'; // Other days
};

// Modify your computed property to include payment dates
const calendarData = computed(() => {
  if (!monthlyPayments.value) return [];
  
  return monthlyPayments.value.map(payment => {
    const paymentDate = new Date(payment.paymentDate);
    const paymentDay = paymentDate.getDate();
    const daysInMonth = getDaysInMonth(paymentDate);
    const nextMonthDate = new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 1);
    
    // Calculate start and end days to show around 20 days total
    let startDay = paymentDay - 10;
    let endDay = paymentDay + 9;
    
    // Generate array of days with month wrapping
    const days = [];
    for (let i = startDay; i <= endDay; i++) {
      if (i <= 0) {
        // Previous month days
        const prevMonthDays = getDaysInMonth(new Date(paymentDate.getFullYear(), paymentDate.getMonth() - 1, 1));
        days.push({
          day: prevMonthDays + i,
          month: getMonthAbbr(new Date(paymentDate.getFullYear(), paymentDate.getMonth() - 1, 1))
        });
      } else if (i > daysInMonth) {
        // Next month days
        days.push({
          day: i - daysInMonth,
          month: getMonthAbbr(nextMonthDate)
        });
      } else {
        // Current month days
        days.push({
          day: i,
          month: getMonthAbbr(paymentDate)
        });
      }
    }

    return {
      month: getMonthAbbr(paymentDate),
      paymentDate: paymentDate,
      days: days,
      daysInMonth
    };
  });
});
</script>
