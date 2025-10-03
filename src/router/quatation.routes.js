import Quatation from "../features/quatation/pages/quatation.vue";
import Drafts from "../features/drfats/pages/drafts.vue";
import Details from "@/features/quatation/pages/details.vue";
import QuotationIndex from "../features/quatation/pages/QuotationIndex.vue";
import CreateNewQuatationClientSide from "@/features/quatation/pages/createNewQuatationClientSide.vue";
import DraftForClient from "@/features/drfats/draftForClient.vue";

export default [
  {
    path: '/quatation',
    name: 'quatation',
    component: QuotationIndex,
    meta: {
      requiresAuth: true,
      privileges: ['create_car','View_quotation'],
    },
    children: [
      {
        path: '',
        component: Quatation,
      },
      {
        path: 'details/:quotationUuid',
        name: 'QuotationDetails',
        component: Details,
        props: true,
        meta: {
          requiresAuth: true,
          privileges: ['create_quotations','View_quotations'],
        }
      },
    ]
  },
  {
	path: '/drafts',
	name: 'drafts',
	component: Drafts,
	meta: {
  requiresAuth: true,
  privileges: ['create_car'],
}
},
 {
	path: '/draftsForClient',
	name: 'draftsForClient',
	component: DraftForClient,
	meta: {
  requiresAuth: true,
   privileges: ['create_car_collection'],
}
},

{
	path: '/createQuotation',
	name: 'CreateQuotation',
	component: CreateNewQuatationClientSide,
	meta: {
  requiresAuth: true,
  privileges: ['create_car_collection'],
}
}
]
