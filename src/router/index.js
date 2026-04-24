import { createRouter, createWebHistory } from "vue-router";
import MainLayout from '@/layouts/MainLayout.vue';
import { useAuth } from '@/stores/auth';

// Lazy-loaded page components
const Dashboard = () => import('@/features/dashboard/pages/Dashboard.vue');
const HomePage = () => import('@/pages/HomePage.vue');
const Login = () => import('@/pages/login/Login.vue');
const SignUp = () => import('@/pages/signUp.vue');

import rolesRoutes from './roles.routes';
import privilagesRoutes from './privilages.routes';
import usersRoutes from './users.routes';
import profileRoutes from './profile.routes';
import libraryRoutes from './library.routes';
import materialRoutes from './material.routes';
import reservationRoutes from './reservation.routes';
import borrow from "./borrow.routes";
import returnsRoutes from './returns.routes';
import paymentRoutes from './payment.routes';
import ForgotPassword from "@/pages/login/forgotPassword.vue";
import ResetPassword from "@/pages/login/ResetPassword.vue";
import VerifyOtp from "@/pages/login/verifyOtp.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "",
    name: "Root",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "/dashboard", name: "dashboard", component: Dashboard, meta: { requiresAuth: true } },
      ...rolesRoutes,
      ...privilagesRoutes,
      ...usersRoutes,
      ...profileRoutes,
      ...libraryRoutes,
      ...materialRoutes,
      ...reservationRoutes,
      ...borrow,
      ...returnsRoutes,
      ...paymentRoutes,
    ],
  },
  { path: "/login", name: "Login", component: Login },
  { path: "/forgot-password", name: "ForgotPassword", component: ForgotPassword },
  { path: "/reset-password", name: "ResetPassword", component: ResetPassword },
  {path: "/verify-otp", name: "VerifyOtp", component: VerifyOtp },
  { path: "/signUp", name: "SignUp", component: SignUp },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const auth = useAuth();
  const normalizeRole = (rawRole) => {
    const value = typeof rawRole === 'object' && rawRole !== null
      ? rawRole.roleName || rawRole.name || rawRole.role || rawRole.value
      : rawRole;

    return String(value || '')
      .toUpperCase()
      .replace(/^ROLE_/, '')
      .replace(/_/g, ' ')
      .trim();
  };

  // Try to restore auth from localStorage if not in store
  if (!auth.auth?.accessToken) {
    let detail = localStorage.getItem('userDetail');
    if (detail) {
      try {
        detail = JSON.parse(detail);
        const storedUser = detail?.user || detail;
        const storedAccessToken = detail?.access || detail?.accessToken || detail?.token;
        const storedRefreshToken = detail?.refresh || detail?.refreshToken;

        if (storedUser && storedAccessToken) {
          auth.setAuth({
            user: storedUser,
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
          });
        }
      } catch (e) {
        console.error('Invalid userDetail in localStorage:', e);
      }
    }
  }

  // If going to login and already authenticated, redirect back
  if (to.path == '/login' && auth.auth?.accessToken) {
    return { path: '/dashboard' };
  }

  // If no authentication and trying to access protected route
  if (!auth.auth?.accessToken && to.meta?.requiresAuth) {
    return {
      path: `/login`,
      query: { redirect: to.path },
    };
  }
  if (!to.meta?.requiresAuth) {
    return true;
  }
  const user = auth.auth?.user || {};
  const userRole = normalizeRole(user?.roleName || user?.role || user?.userRole);

  // Role-only access control (no privilege dependency)
  if (userRole === 'SUPER ADMIN') {
    return true;
  }

  const routeRoles = [
    ...(Array.isArray(to.meta?.roles) ? to.meta.roles : []),
    ...(to.meta?.role ? [to.meta.role] : []),
  ]
    .map((role) => normalizeRole(role))
    .filter(Boolean);

  // If route doesn't declare roles, allow any authenticated user
  if (!routeRoles.length) {
    return true;
  }

  if (routeRoles.includes(userRole)) {
    return true;
  }

  return { path: '/dashboard' };
});

export default router;
