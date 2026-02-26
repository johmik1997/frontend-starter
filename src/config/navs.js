import icons from "@/utils/icons";

export default [
  {
    path: "/dashboard",
    icon: icons.dashboard,
    name: "Dashboard",
    meta: { requiresAuth: true, permissions: [] },
    type: "Analytics",
    privilage: ['read_user'],
  },
   {
    path: '/payment',
    icon: icons.payment,
    name: 'Manage Materials',
    meta: { requiresAuth: true, permissions: [] },
    type: "Pages",
    isOpen: false,
    privilage: ['create_payement'],
    children: [
      {
        path: '/insurance',
        name: 'Digital Material',
        meta: { requiresAuth: true, permissions: [] },
        privilage: ['createpayment'],
      },
      {
        path: '/car_specifications',
        name: 'Physical Material',
        meta: { requiresAuth: true, permissions: [] },
      },
      {
        path:'/premium',
        name: 'E-Books',
        meta: { requiresAuth: true, permissions: [] },
      }
    ]
  },
  {
    path: '/clients',
    icon: icons.renew,
    name: 'Reservations',
    meta: { requiresAuth: true, permissions: [] },
    type: "Pages",
    privilage: ['read_user'],
  },
  {
    path: '/quatation',
    icon: icons.quotation,
    name: 'Borrow Physical Material',
    meta: { requiresAuth: true, permissions: [] },
    type: "Pages",
    privilage: ['create_car'],
  },
 
  {
    path: '/payment/deposit' ,
    icon: icons.transfer,
    name: 'Manage Fines',
    meta: { requiresAuth: true, permissions: [] },
    type: "Pages",
    privilage: ['create_insurance'],
  },
  {
    path:'/payment/dispersement',
    icon: icons.car,
    name: 'Return Materials',
    meta: { requiresAuth: true, permissions: [] },
    type: "Pages",
    privilage: ['create_specification'],
  },
  {
    path:  '/payment/premium',
    icon: icons.premium,
    name: 'Borrowed Materials',
    meta: { requiresAuth: true, permissions: [] },
    type: "Pages",
    privilage: ['create_premium'],
  },
   {
    path: '/createQuotation',
    icon: icons.quotation,
    name: 'Handle Digital Material',
    meta: { requiresAuth: true, permissions: [] },
    type: "Pages",
    privilage: ['create_car_collection'],
  },
  {
    path: '/Users',
    name: 'Users',
    icon: icons.users,
    meta: { requiresAuth: true, permissions: [] },
    type: "Settings",
    privilage: ['create_user'],
  },
  {
    path: '/privileges',
    name: 'Privileges',
    icon: icons.privilege,
    meta: { requiresAuth: true, permissions: [] },
    type: "Settings",
    privilage: ['create_privilege'],
  },
  {
    path: '/roles',
    name: 'Roles',
    icon: icons.role,
    meta: { requiresAuth: true, permissions: [] },
    type: "Settings",
    privilage: ['create_role'],
  }
];
