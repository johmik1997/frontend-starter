export default [
  { path: '/payment', name: 'Payment', component: () => import('@/features/payment/pages/payment.vue'), meta: { requiresAuth: true, permissions: [] } },
  { path: '/payment/deposit', name: 'Deposit', component: () => import('@/features/financing/deposits/pages/deposits.vue'), meta: { requiresAuth: true, permissions: [] } },
  { path: '/depositDetails/:depositUuid', name: 'DepositDetails', component: () => import('@/features/financing/deposits/pages/depositDetails.vue'), meta: { requiresAuth: true, permissions: [] } },
  { path: '/payment/dispersement', name: 'Dispersement', component: () => import('@/features/financing/dispersement/pages/dispersement.vue'), meta: { requiresAuth: true, permissions: [] } },
  { path: '/payment/premium', name: 'Premium', component: () => import('@/features/financing/premium/pages/premium.vue'), meta: { requiresAuth: true, permissions: [] } },
]
