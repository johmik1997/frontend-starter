import icons from "@/utils/icons";
import { mdiBook } from "@mdi/js";

export default [
  {
    path: "/dashboard",
    icon: icons.dashboard,
    name: "Dashboard",
    meta: { requiresAuth: true, permissions: [] },
    type: "Analytics",
    roles: ["MEMBER", "ADMIN", "SUPER ADMIN"],
  },
  {
    path: "/material",
    name: "Material",
    icon: icons.books,
    meta: { requiresAuth: true, permissions: [] },
    type: "Management",
    roles: ["MEMBER", "ADMIN", "SUPER ADMIN","TECHNICAL STAFF"],
  },
  {

    path: "/library",
    name: "Library",
    icon: icons.users,
    meta: { requiresAuth: true, permissions: [] },
    type: "Settings",
    roles: ["MEMBER", "ADMIN", "SUPER ADMIN","TECHNICAL STAFF"],
  },
  {
    path: '/users',
    name: 'Users',
    icon: icons.users,
    meta: { requiresAuth: true, permissions: [] },
    type: "Settings",
    roles: ["ADMIN", "SUPER ADMIN","MEMBER"],
  },

];
