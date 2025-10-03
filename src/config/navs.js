import icons from "@/utils/icons";

export default [
  {
    path: "/dashboard",
    icon: icons.dashboard,
    name: "Dashboard",
    meta: {
      requiresAuth: true,
      permissions: [],
    },
    type: "Analytics",
    privilage: ['read_user'],
  },
  // {
  //   path: "/a",
  //   icon: icons.report,
  //   name: "Report and analytics",
  //   meta: {
  //     requiresAuth: true,
  //     permissions: [],
  //   },
  //   type: "Analytics",
  // },
  {
    path: '/drafts',
    icon: icons.leeds,
    name: 'Leads (Drafts)',
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Pages",
    privilage: ['create_car'],
  },
    {
    path: '/draftsForClient',
    icon: icons.leeds,
    name: 'Leads (Drafts)',
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Pages",
    privilage: [ 'create_car_collection'],
  },
  {
    path: '/clients',
    icon: icons.renew,
    name: 'Clients',
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Pages",
    privilage: ['read_user'],
  },
  {
    path: '/quatation',
    icon: icons.quotation,
    name: 'Quotations',
    meta: {
      requiresAuth: true,
      permissions: [],
    },
    type: "Pages",
    privilage: ['create_car'],
  },
    {
    path: '/createQuotation',
    icon: icons.quotation,
    name: 'Create Quotations',
    meta: {
      requiresAuth: true,
      permissions: [],
    },
    type: "Pages",
    privilage: ['create_car_collection'],
  },
  
  {
    path: '/payment',
    icon: icons.payment,
    name: 'Financing',
    meta: {
      requiresAuth: true,
      permissions: [],
    },
    type: "Pages",
    isOpen: false, // Add this to control dropdown state
    privilage: ['create_payement'],
    children: [
      {
        path: '/payment/deposit',
        name: 'Deposit',
        meta: {
          requiresAuth: true,
          permissions: []
        },
        privilage: ['createpayment'],
      },
      {
        path: '/payment/dispersement',
        name: 'Pay For Insurances',
        meta: {
          requiresAuth: true,
          permissions: []
        }
      },
      {
        path: '/payment/premium',
        name: 'Premium Payment',
        meta: {
          requiresAuth: true,
          permissions: []
        }
      }
    ]
  },
  // {
  //   path: '/policies',
  //   icon: icons.policies,
  //   name: 'policies',
  //   meta: {
  //     requiresAuth: true,
  //     permissions: []
  //   },
  //   type: "Pages",
  //   privilage: ['create_policies'],
  // },
  {
    path: '/insurance',
    icon: icons.transfer,
    name: 'Insurances',
    meta: {
      requiresAuth: true,
      permissions: [],
    },
    type: "Pages",
    privilage: ['create_insurance'],
  },
    {
    path: '/car_specifications',
    icon: icons.car,
    name: 'Car Specifications',
    meta: {
      requiresAuth: true,
      permissions: [],
    },
    type: "Pages",
    privilage: ['create_specification'],
  },
    {
    path: '/premium',
    icon: icons.premium,
    name: 'Premium',
    meta: {
      requiresAuth: true,
      permissions: [],
    },
    type: "Pages",
    privilage: ['create_premium'],
  },
  {
    path: '/Users',
    name: 'Users',
    icon: icons.users,
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Settings",
    privilage: ['create_user'],
  },
  {
    path: '/privileges',
    name: 'Privileges',
    icon: icons.privilege,
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Settings",
    privilage: ['create_privilege'],
  },
  {
    path: '/roles',
    name: 'Roles',
    icon: icons.role,
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Settings",
    privilage: ['create_role'],
  }
];





