export default [
  {
    path: '/quatation',
    name: 'quatation',
    component: () => import('@/features/quatation/pages/QuotationIndex.vue'),
    meta: { requiresAuth: true, privileges: ['create_car','View_quotation'] },
    children: [
      { path: '', component: () => import('@/features/quatation/pages/quatation.vue') },
      {
        path: 'details/:quotationUuid',
        name: 'QuotationDetails',
        component: () => import('@/features/quatation/pages/details.vue'),
        props: true,
        meta: { requiresAuth: true, privileges: ['create_quotations','View_quotations'] },
      },
    ]
  },
  { path: '/drafts', name: 'drafts', component: () => import('@/features/drfats/pages/drafts.vue'), meta: { requiresAuth: true, privileges: ['create_car'] } },
  { path: '/draftsForClient', name: 'draftsForClient', component: () => import('@/features/drfats/draftForClient.vue'), meta: { requiresAuth: true, privileges: ['create_car_collection'] } },
  { path: '/createQuotation', name: 'CreateQuotation', component: () => import('@/features/quatation/pages/createNewQuatationClientSide.vue'), meta: { requiresAuth: true, privileges: ['create_car_collection'] } },
]
