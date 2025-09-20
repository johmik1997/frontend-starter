

import Profile from "@/features/profile/pages/profile.vue";
export default [

	{
		path: '/profile',
		name: 'profile',
		component: Profile,
		meta: {
      requiresAuth: true,
      permissions: []
    }
	}
]