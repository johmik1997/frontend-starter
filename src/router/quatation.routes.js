import Branches from "@/features/branches/pages/branches.vue";
import Quatation from "../features/quatation/pages/quatation.vue";
import Drafts from "../features/drfats/pages/drafts.vue";
import Details from "@/features/quatation/pages/details.vue";
export default [

 {
		path: '/quatation',
		name: 'quatation',
		component: Quatation,
		meta: {
		  requiresAuth: true,
		  privileges: ['create_user','View_card'],
		}
	  },
	  {
		path: '/details/:quotationUuid',
		name: 'QuotationDetails',
		component: Details,
		props: true
	  },
	  {
		  path: '/drafts',
		  name: 'drafts',
		  component: Drafts,
		  meta: {
		requiresAuth: true,
		permissions: []
	  }
	  }
]