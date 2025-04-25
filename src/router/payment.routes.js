import Payment from "@/features/payment/pages/payment.vue";
import Deposit from "@/features/financing/deposits/pages/deposits.vue";
import Dispersement from "@/features/financing/dispersement/pages/dispersement.vue";
import DepositDetails from "@/features/financing/deposits/pages/depositDetails.vue";
import Premium from "@/features/financing/premium/pages/premium.vue";

export default [
	{
		path: '/payment',
		name: 'Payment',
		component: Payment,
		meta: {
			requiresAuth: true,
			permissions: []
		},
	},
		
			{
				path: '/payment/deposit',
				name: 'Deposit',
				component: Deposit,
				meta: {
					requiresAuth: true,
					permissions: []
				}
			},
			{
				path: '/depositDetails/:depositUuid',
				name: 'Details',
				component: DepositDetails,
				meta: {
			  requiresAuth: true,
			  permissions: []
			}
			},
			{
				path: '/payment/dispersement',
				name: 'Dispersement',
				component: Dispersement,
				meta: {
					requiresAuth: true,
					permissions: []
				}
			},
			{
				path: '/payment/premium',
				name: 'premium',
				component: Premium,
				meta: {
					requiresAuth: true,
					permissions: []
				}
			},
			

		]
	

