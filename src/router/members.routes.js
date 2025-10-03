export default [
  {
    path: '/clients',
    name: 'members',
    component: () => import('@/features/members/pages/Members.vue'),
    meta: { requiresAuth: true, permissions: [] },
  },
  {
    path: '/add_member',
    name: 'Add Member',
    component: () => import('@/features/members/pages/MemberFormProgress.vue'),
    meta: { requiresAuth: true, permissions: [] },
  },
  {
    path: '/imported_members/:woredaUuid',
    name: 'Imported Members',
    component: () => import('@/features/members/pages/Importedmembers.vue'),
    meta: { requiresAuth: true, permissions: [] },
  },
  {
    path: '/despersementDetails/:despersementUuid',
    name: 'Despersement Details',
    component: () => import('@/features/financing/dispersement/pages/dispersementDetails.vue'),
    meta: { requiresAuth: true, permissions: [] },
  },
];
