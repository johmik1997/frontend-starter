<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import icons from "@/utils/icons";
import { ref, onMounted } from 'vue';
import Status_row from '../components/statusRow.vue';

import { useMemberForm } from '../store/membersFormStore';
import { removeUndefined } from '@/utils/utils';

import { useMembers } from '../store/members';
import { usePaginationcopy } from '@/composables/usePaginationcopy';
import { getMembers } from '../api/membersApi';
import { usePaginations } from '@/composables/usePaginations';
const membersStore = useMembers();
const searchKey = ref('');

const pagination = usePaginations({
  store: membersStore,
  cb: (data, config) =>
  getMembers(
      removeUndefined({
        ...data,
        search: searchKey.value,
      })
    ),
}); 
const entries = ref([
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "2 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0912345678", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "11 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0923456789", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Checked",
    Vehicle: "6 days", // Custom value for inactivity
    status: "Inactive", // Custom value foInactive history
    phoneNumber: "0934567890", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "3 days", // Custom value for inactivity
    status: "Inactive", // Custom value foActive history
    phoneNumber: "0913456789", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "7 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0945678901", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Checked",
    Vehicle: "8 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0915678901", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "4 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0924678901", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "12 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0935789012", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "15 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0912345679", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "10 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0923456790", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "18 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0934567901", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "22 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0915678912", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Checked",
    Vehicle: "9 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0945678902", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "5 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0912345670", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Checked",
    Vehicle: "14 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0923456781", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "16 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0934567902", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "20 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0915678903", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "25 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0945678903", // Example Ethiopian phone number
  },
  {
    clientName: "Abebe Beso Bela",
    RegisteredDate: "03-262025",
    lastActivity: "Not Checked",
    Vehicle: "30 days", // Custom value for inactivity
    status: "Active", // Custom value foActive history
    phoneNumber: "0912345675", // Example Ethiopian phone number
  },
]);

onMounted(async () => {
  await membersStore.fetchMembers();
});

</script>
<template>
	<DefaultPage placeholder="Search For a Member" class=" justify-start">
		<template #more>
			<div class="flex items-center justify-end  rounded-lg border-2 border-[#3C3C9E]">  
        <button  
      class="flex items-center py-2 px-4 gap-2 bg-primary hover:bg-[#3C3C9E] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"  
      role="tab"  
      aria-selected="true"  
      id="tab-all"  
      aria-controls="panel-all"  
    >  
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.41126 0.651193C2.42143 0.651193 2.43163 0.651194 2.44186 0.651194L11.5887 0.651193C12.023 0.651172 12.3943 0.651155 12.691 0.688584C13.0057 0.72828 13.3099 0.81743 13.5597 1.05182C13.8139 1.29034 13.9149 1.58793 13.9593 1.89755C14.0001 2.18197 14 2.53564 14 2.93911L14 3.44476C14 3.76285 14 4.03785 13.9763 4.26717C13.9507 4.51393 13.8948 4.74544 13.7607 4.9677C13.6276 5.1883 13.4483 5.34842 13.2417 5.49196C13.047 5.62718 12.7983 5.76718 12.5058 5.93183L10.5898 7.01041C10.1536 7.25593 10.0018 7.34433 9.90038 7.43235C9.66754 7.6345 9.5342 7.85879 9.47154 8.13981C9.44476 8.25994 9.44186 8.41124 9.44186 8.87078L9.44186 10.6498C9.44189 11.2366 9.44192 11.7349 9.38153 12.1179C9.31732 12.5252 9.16824 12.9158 8.77752 13.1602C8.39571 13.399 7.97512 13.3771 7.56638 13.28C7.17272 13.1865 6.68761 12.9968 6.10553 12.7693L6.04896 12.7472C5.7763 12.6406 5.53756 12.5473 5.34855 12.4497C5.14542 12.3448 4.95678 12.2143 4.81245 12.0112C4.6665 11.8058 4.60798 11.5855 4.58189 11.3604C4.5581 11.1551 4.55812 10.9087 4.55814 10.6339L4.55814 8.87077C4.55814 8.41124 4.55524 8.25994 4.52846 8.13981C4.4658 7.85879 4.33246 7.6345 4.09961 7.43235C3.99823 7.34433 3.84636 7.25593 3.41023 7.01041L1.49423 5.93183C1.20171 5.76718 0.952998 5.62718 0.758333 5.49196C0.551693 5.34842 0.372406 5.1883 0.239284 4.9677C0.105153 4.74544 0.049297 4.51393 0.0237334 4.26717C-2.32267e-05 4.03785 -1.12348e-05 3.76285 2.62122e-06 3.44475L3.31984e-06 2.97237C3.31984e-06 2.96124 2.46597e-06 2.95015 1.65091e-06 2.9391C-2.87391e-05 2.53563 -5.54046e-05 2.18197 0.0407019 1.89755C0.0850707 1.58793 0.186076 1.29034 0.440303 1.05182C0.690122 0.81743 0.994293 0.72828 1.30899 0.688584C1.60572 0.651155 1.97697 0.651172 2.41126 0.651193ZM1.43123 1.65765C1.21396 1.68505 1.14487 1.73011 1.10861 1.76413C1.07676 1.79402 1.03472 1.84663 1.00757 2.0361C0.977922 2.24299 0.976747 2.52568 0.976747 2.97237V3.42155C0.976747 3.76941 0.977349 3.99346 0.995277 4.16652C1.01197 4.32769 1.04064 4.40519 1.07555 4.46304C1.11147 4.52256 1.17112 4.58942 1.31557 4.68976C1.46776 4.79548 1.67567 4.9131 1.99251 5.09146L3.88937 6.15926C3.90713 6.16926 3.92462 6.1791 3.94186 6.1888C4.30567 6.39347 4.55344 6.53287 4.73994 6.69478C5.12501 7.02909 5.37207 7.43514 5.48179 7.92725C5.53512 8.16643 5.53503 8.43461 5.5349 8.81318C5.53489 8.8321 5.53488 8.85129 5.53488 8.87077V10.609C5.53488 10.9165 5.53564 11.1056 5.55214 11.248C5.56706 11.3767 5.59057 11.42 5.60866 11.4454C5.62838 11.4732 5.66744 11.5151 5.79667 11.5818C5.93499 11.6532 6.12554 11.7284 6.42647 11.846C7.05224 12.0906 7.47315 12.2539 7.79208 12.3297C8.10373 12.4037 8.20643 12.3653 8.25956 12.3321C8.30379 12.3044 8.37218 12.2482 8.41671 11.9658C8.46366 11.6679 8.46511 11.2479 8.46511 10.609V8.87078C8.46511 8.8513 8.46511 8.8321 8.4651 8.81318C8.46497 8.43461 8.46488 8.16643 8.51821 7.92725C8.62793 7.43514 8.87499 7.02909 9.26006 6.69478C9.44656 6.53287 9.69432 6.39348 10.0581 6.18881C10.0754 6.17911 10.0929 6.16926 10.1106 6.15926L12.0075 5.09146C12.3243 4.9131 12.5322 4.79548 12.6844 4.68976C12.8289 4.58942 12.8885 4.52256 12.9244 4.46304C12.9594 4.40519 12.988 4.32769 13.0047 4.16652C13.0227 3.99346 13.0233 3.76941 13.0233 3.42155V2.97237C13.0233 2.52568 13.0221 2.24299 12.9924 2.0361C12.9653 1.84663 12.9232 1.79402 12.8914 1.76413C12.8551 1.73011 12.786 1.68505 12.5688 1.65765C12.3405 1.62885 12.0316 1.62794 11.5581 1.62794H2.44186C1.96845 1.62794 1.65952 1.62885 1.43123 1.65765Z" fill="white"/>
</svg>

      <span class="text-white font-semibold">All</span>  
    </button>  
    <button  
      class="py-2 px-4 text-primary hover:text-[#121238] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"  
      role="tab"  
      aria-selected="false"  
      id="tab-quotation"  
      aria-controls="panel-quotation"  
    >  
      Quotation Drafts  
    </button>  
    <button  
      class="py-2 px-4  text-primary hover:text-[#121238] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 rounded-r-lg"  
      role="tab"  
      aria-selected="false"  
      id="tab-account"  
      aria-controls="panel-account"  
    >  
      Account Created  
    </button>  
  </div>  
  <!-- Add corresponding panels (content) for each tab -->  

  <div role="tabpanel" id="panel-quotation" aria-labelledby="tab-quotation" hidden>  
    <!-- Content for "Quotation Drafts" tab -->  
    <p>Content for Quotation Drafts</p>  
  </div>  
  <div role="tabpanel" id="panel-account" aria-labelledby="tab-account" hidden>  
    <!-- Content for "Account Created" tab -->  
    <p>Content for Account Created</p>  
  </div>
			
		</template>
   <Table
	   :headers="{
		    head: ['#', 'Client Name', 'Registered date', 'Vehicle Detail', 'Phone Number', 'Policy Status', 'actions'],
			row: ['id', 'clientName', 'RegisteredDate', 'Vehicle', 'phoneNumber', 'status']
		}"
	:rowCom="Status_row"
		:rows="membersStore.members"
      :Fallback="TableRowSkeleton"
	 >
	
	  </Table>
	 
	</DefaultPage>
</template>


