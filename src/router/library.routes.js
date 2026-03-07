export default [
  { 
    path: '/library', 
    name: 'Library', 
    component: () => import('@/features/library/pages/Library.vue'), 
    meta: { requiresAuth: true, roles: ['MEMBER', 'ADMIN', 'SUPER ADMIN'] } 
  },
  { 
    path: '/edit_library/:libraryUuid', 
    name: 'edit library', 
    component: () => import('@/features/library/pages/EditLibrary.vue'), 
    meta: { requiresAuth: true, roles: ['MEMBER', 'ADMIN', 'SUPER ADMIN'] } 
  },
  { 
    path: '/libraryForm', 
    name: 'Library Form', 
    component: () => import('@/features/library/pages/AddLibrary.mdl.vue'), 
    meta: { requiresAuth: true, roles: ['MEMBER', 'ADMIN', 'SUPER ADMIN'] } 
  },
]
