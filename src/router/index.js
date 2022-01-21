import { createRouter, createWebHashHistory } from "vue-router";

const Login = () => import('@/views/login/index.vue');
const Register = () => import('@/views/register/index.vue');
const User = () => import('@/views/user/index.vue');
const Product = () => import('@/views/product/index.vue');


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login',
            meta: {
                hasLayout: true
            }
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            meta: {
                hasLayout: false
            }
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                hasLayout: false
            }
        },
        {
            path: '/user',
            name: 'user',
            component: User,
            meta: {
                hasLayout: true
            }
        },
        {
            path: '/product',
            name: 'product',
            component: Product,
            meta: {
                hasLayout: true
            }
        }
    ]
})

export default router