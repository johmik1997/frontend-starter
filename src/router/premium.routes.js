import premiumDetails from "@/features/premium/pages/detail.vue";
import premium from "../features/premium/pages/premium.vue";
import PremiumIndex from "@/features/premium/pages/premiumIndex.vue";


export default [
  {
    path: '/premium',
    name: 'premiums',
    component: PremiumIndex,
    meta: {
      requiresAuth: true,
      privileges: ['create_user','View_card'],
    },
    children: [
      {
        path: '',
        component: premium,
      },
      {
        path: 'detail/:premiumUuid',
        name: 'premiumDetails',
        component: premiumDetails,
        props: true,
        meta: {
          requiresAuth: true,
          privileges: ['create_user','View_card'],
        }
      }
    ]
  }
]
