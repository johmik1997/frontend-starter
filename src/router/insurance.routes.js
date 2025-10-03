export default [
  {
    path: '/insurance',
    name: 'insurance',
    component: () => import('@/features/insurances/pages/InsuranceIndex.vue'),
    meta: { requiresAuth: true, privileges: ['create_user','View_card','create_insurance'] },
    children: [
      {
        path: '',
        component: () => import('@/features/insurances/pages/insurance.vue'),
      },
      {
        path: 'detail/:insuranceUuid',
        name: 'insuranceDetails',
        component: () => import('@/features/insurances/pages/detail.vue'),
        props: true,
        meta: { requiresAuth: true, privileges: ['create_user','View_card','create_insurance'] },
      }
    ]
  }
]
