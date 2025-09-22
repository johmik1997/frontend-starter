import InsuranceDetails from "@/features/insurances/pages/detail.vue";
import Insurance from "../features/insurances/pages/insurance.vue";
import InsuranceIndex from "../features/insurances/pages/InsuranceIndex.vue";

export default [
  {
    path: '/insurance',
    name: 'insurance',
    component: InsuranceIndex,
    meta: {
      requiresAuth: true,
      privileges: ['create_user','View_card','create_insurance'],
    },
    children: [
      {
        path: '',
        component: Insurance,
      },
      {
        path: 'detail/:insuranceUuid',
        name: 'insuranceDetails',
        component: InsuranceDetails,
        props: true,
        meta: {
          requiresAuth: true,
          privileges: ['create_user','View_card','create_insurance'],
        }
      }
    ]
  }
]
