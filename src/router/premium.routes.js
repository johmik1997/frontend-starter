export default [
  {
    path: '/premium',
    name: 'premiums',
    component: () => import('@/features/premium/pages/premiumIndex.vue'),
    meta: { requiresAuth: true, privileges: ['create_user','View_card','create_premium'] },
    children: [
      { path: '', component: () => import('@/features/premium/pages/premium.vue') },
      {
        path: 'detail/:premiumUuid',
        name: 'premiumDetails',
        component: () => import('@/features/premium/pages/detail.vue'),
        props: true,
        meta: { requiresAuth: true, privileges: ['create_user','View_card','create_premium'] },
      }
    ]
  }
]
