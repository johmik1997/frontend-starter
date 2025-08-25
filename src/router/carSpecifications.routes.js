import carSpecificationDetails from "@/features/car_specifications/pages/carSpecificationDetails.vue";
import carSpecification from "../features/car_specifications/pages/carSpecification.vue";
import carSpecificationIndex from "../features/car_specifications/pages/carSpecificationIndex.vue";

export default [
  {
    path: '/car_specifications',
    name: 'car_specifications',
    component: carSpecificationIndex,
    meta: {
      requiresAuth: true,
      privileges: ['create_user','View_card'],
    },
    children: [
      {
        path: '',
        component: carSpecification,
      },
      {
        path: 'detail/:car_specificationsUuid',
        name: 'car_specificationsDetails',
        component: carSpecificationDetails,
        props: true,
        meta: {
          requiresAuth: true,
          privileges: ['create_user','View_card'],
        }
      }
    ]
  }
]
