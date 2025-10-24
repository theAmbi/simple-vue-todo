// import { createRouter, createWebHistory } from "vue-router";
// import Auth from "../components/Auth.vue";
// import Dashboard from "../components/Dashboard.vue";

// const routes = [
//     { path: "/auth", component: Auth },
//     { path: "/dashboard", component: Dashboard },
//     { path: "/", redirect: "/auth" },
// ];

// const router = createRouter({
//     history: createWebHistory(),
//     routes,
// });

// export default router;


import { createRouter, createWebHistory } from "vue-router";
import Auth from "../components/Auth.vue";
import Dashboard from "../components/Dashboard.vue";

const routes = [
    { path: "/auth", component: Auth },
    { path: "/dashboard", component: Dashboard },
    { path: "/", redirect: "/auth" },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
