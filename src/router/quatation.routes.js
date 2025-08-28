import Quatation from "../features/quatation/pages/quatation.vue";
import Drafts from "../features/drfats/pages/drafts.vue";
import Details from "@/features/quatation/pages/details.vue";
import QuotationIndex from "../features/quatation/pages/QuotationIndex.vue";
import CreateNewQuatationClientSide from "@/features/quatation/pages/createNewQuatationClientSide.vue";

export default [
  {
    path: '/quatation',
    name: 'quatation',
    component: QuotationIndex,
    meta: {
      requiresAuth: true,
      privileges: ['create_user','View_card'],
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
          privileges: ['create_user','View_card'],
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
  permissions: []
}
},
{
	path: '/createQuotation',
	name: 'CreateQuotation',
	component: CreateNewQuatationClientSide,
	meta: {
  requiresAuth: true,
  permissions: []
}
}
]
