import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/helloworld"
    },
    {
      path: "/helloworld",
      name: "helloworld",
      component: () => import("@/views/helloWorld/index.vue")
    }
  ]
});

export default router;
