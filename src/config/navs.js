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
  },
  {
    path: "/a",
    icon: icons.report,
    name: "Report and analytics",
    meta: {
      requiresAuth: true,
      permissions: [],
    },
    type: "Analytics",
  },
  {
    path: '/drafts',
    icon: icons.leeds,
    name: 'Leads (Drafts)',
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Pages"
  },
  {
    path: '/clients',
    icon: icons.renew,
    name: 'Clients',
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Pages"
  },
  {
    path: '/quatation',
    icon: icons.transfer,
    name: 'Quotations',
    meta: {
      requiresAuth: true,
      permissions: [],
    },
    type: "Pages",
    privilage: ['create_user'],
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
    privilage: ['create_user'],
    children: [
      {
        path: '/payment/deposit',
        name: 'Deposit',
        meta: {
          requiresAuth: true,
          permissions: []
        },
        privilage: ['create_admin'],
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
  {
    path: '/policies',
    icon: icons.policies,
    name: 'policies',
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Pages",
    privilage: ['create_users'],
  },
  {
    path: '/Users',
    name: 'Users',
    icon: icons.users,
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Settings"
  },  
  {
    path: '/privileges',
    name: 'Privileges',
    icon: icons.privilege,
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Settings"
  },
  {
    path: '/roles',
    name: 'Roles',
    icon: icons.role,
    meta: {
      requiresAuth: true,
      permissions: []
    },
    type: "Settings"
  }
];




