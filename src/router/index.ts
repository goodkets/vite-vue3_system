import { createWebHistory, createRouter } from "vue-router";
import { userStoreInfo } from '@/store/user/index';

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home/index.vue"),
    redirect: '/projectMassage',
    children: [
      {
        path: "/userMassage",
        name: "userMassage",
        component: () => import("@/views/userMassage/index.vue"),
      },
      {
        path: "/projectMassage",
        name: "projectMassage",
        component: () => import("@/views/projectMassage/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const userStore = userStoreInfo();
  const token = userStore.token;
  if(to.path === '/login' && token) {
    next('/')
  } else if(to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
});

export default router;
