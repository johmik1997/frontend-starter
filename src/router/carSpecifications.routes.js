export default [
  {
    path: '/car_specifications',
    name: 'car_specifications',
    component: () => import('@/features/car_specifications/pages/carSpecificationIndex.vue'),
    meta: { requiresAuth: true, privileges: ['create_specification','View_specification'] },
    children: [
      {
        path: '',
        component: () => import('@/features/car_specifications/pages/carSpecification.vue'),
      },
      {
        path: 'detail/:car_specificationsUuid',
        name: 'car_specificationsDetails',
        component: () => import('@/features/car_specifications/pages/carSpecificationDetails.vue'),
        props: true,
        meta: { requiresAuth: true, privileges: ['create_specification','View_specification'] },
      }
    ]
  }
]
