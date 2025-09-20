import MainLayout from '@/layouts/MainLayout.vue'
import quatationRoutes from './quatation.routes'
import insuranceRoutes from './insurance.routes'
import paymentRoutes from './payment.routes'
import subcitiesRoutes from './profile.routes'
import ketenaRoutes from './ketena.routes'
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import membersRoutes from "./members.routes";
import rolesRoutes from "./roles.routes";
import usersRoutes from "./users.routes";
import privilagesRoutes from "./privilages.routes";
import Login from "@/pages/login/Login.vue";
import profileRoutes from "./profile.routes";
import Dashboard from '@/features/dashboard/pages/Dashboard.vue'
import { useAuth } from '@/stores/auth'
import carSpecificationsRoutes from './carSpecifications.routes'
import premiumRoutes from './premium.routes'
import SignUp from '@/pages/signUp.vue'


const routes = [
  {
    path: "",
    name: "Root",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/dashboard"
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
        meta: { requiresAuth: true },
      },
      ...membersRoutes,
      ...rolesRoutes,
      ...privilagesRoutes,
      ...usersRoutes,
      ...profileRoutes,
      ...quatationRoutes,
      ...paymentRoutes,
      ...subcitiesRoutes,
      ...ketenaRoutes,
      ...insuranceRoutes,
      ...carSpecificationsRoutes,
      ...premiumRoutes,
    ],
  },
  { path: "/login", name: "Login", component: Login },
  { path: "/signUp", name: "SignUp", component: SignUp },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const auth = useAuth();

  // Try to restore auth from localStorage if not in store
  if (!auth.auth?.accessToken) {
    let detail = localStorage.getItem('userDetail');
    if (detail) {
      detail = JSON.parse(detail);
      auth.setAuth({
        user: detail,
        accessToken: detail?.token,
      });
    }
  }

  // If going to login and already authenticated, redirect back
  if (to.path == '/login' && auth.auth?.accessToken) {
    return { path: from.path };
  }

  // If no authentication and trying to access protected route
  if (!auth.auth?.accessToken && to.meta?.requiresAuth) {
    return {
      path: `/login`,
      query: { redirect: to.path },
    };
  }

  // If route doesn't require auth, allow access
  if (!to.meta?.requiresAuth) {
    return true;
  }

  // Check privileges for authenticated users
  if (
    auth.auth?.user?.privileges?.includes('All Privileges') ||
    auth.auth?.user?.roleName === 'Super Admin'
  ) {
    return true;
  }

  // Role-based access
  if (
    (auth.auth?.user?.roleName && to.meta?.role && 
     auth.auth?.user?.roleName == to.meta?.role) ||
    (!to.meta?.role && !to.meta?.privileges)
  ) {
    return true;
  }

  // Privilege-based access
  const privileges = auth.auth.user?.privileges;
  const found = (to.meta?.privileges || []).find((privilege) => {
    return privileges?.includes(`ROLE_${privilege}`);
  });

  if (found) return true;

  return { path: '/forbidden' };
});

export default router;



