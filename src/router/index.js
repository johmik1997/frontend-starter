import MainLayout from '@/layouts/MainLayout.vue'
import quatationRoutes from './quatation.routes'
import paymentRoutes from './payment.routes'
import subcitiesRoutes from './subcities.routes'
import ketenaRoutes from './ketena.routes'
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import membersRoutes from "./members.routes";
import rolesRoutes from "./roles.routes";
import usersRoutes from "./users.routes";
import privilagesRoutes from "./privilages.routes";
import branchesRoutes from "./branches.routes";
import Login from "@/pages/login/Login.vue";
import subcityRoutes from "./subcity.routes";
import Dashboard from '@/features/dashboard/pages/Dashboard.vue'
import { useAuth } from '@/stores/auth'
import DepositDetails from '@/features/financing/deposits/pages/DepositDetails.vue'
import DispersementDetails from '@/features/financing/dispersement/pages/dispersementDetails.vue'

const routes = [
  {
    path: "",
    name: "Root",
    component: MainLayout,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      ...membersRoutes,
      ...rolesRoutes,
      ...privilagesRoutes, // Removed duplicate
      ...usersRoutes,
      ...branchesRoutes,
      ...subcityRoutes,
      ...quatationRoutes,
      ...paymentRoutes,
      ...subcitiesRoutes,
      ...ketenaRoutes
    ],
  },
  { path: "/login", name: "Login", component: Login },
 
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const auth = useAuth();

  if (!auth.auth?.accessToken) {
    let detiail = localStorage.getItem('userDetail');
    if (detiail) {
      detiail = JSON.parse(detiail);
      auth.setAuth({
        user: detiail,
        accessToken: detiail?.token,
      });
    }
  }

  if (to.path == '/login' && auth.auth?.accessToken) {
    return {
      path: from.path,
    };
  }

  if (
    !to.meta?.requiresAuth ||
    auth.auth?.user?.privileges?.includes('All Privileges') ||
    auth.auth?.user?.roleName === 'Super Admin'
  ) {
    let detiail = localStorage.getItem('userDetail');
    if (detiail) {
      detiail = JSON.parse(detiail);
      auth.setAuth({
        user: detiail,
        accessToken: detiail?.token,
      });
    }
    return true;
  }

  if (!auth.auth?.accessToken) {
    return {
      path: `/login`,
      query: {
        redirect: to.path,
      },
    };
  }

  if (
    (auth.auth?.user?.roleName &&
      to.meta?.role &&
      auth.auth?.user?.roleName == to.meta?.role) ||
    (!to.meta?.role && !to.meta?.privileges && to.meta?.requiresAuth)
  ) {
    return true;
  }

  let privileges = auth.auth.user?.privileges;

  const found = (to.meta?.privileges || []).find((privilage) => {
    return privileges?.includes(`ROLE_${privilage}`);
  });

  if (found) return true;

  return {
    path: '/forbidden',
  };
});
export default router;








