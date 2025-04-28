import Drafts from "../features/drfats/pages/drafts.vue";
import InsuranceDetails from "@/features/insurances/pages/detail.vue";
import Insurance from "../features/insurances/pages/insurance.vue";
export default [

 {
		path: '/insurance',
		name: 'insurance',
		component: Insurance,
		meta: {
		  requiresAuth: true,
		  privileges: ['create_user','View_card'],
		}
	  },
	  {
		path: '/detail/:insuranceUuid',
		name: 'insuranceDetails',
		component: InsuranceDetails,
		props: true
	  },
	 
]