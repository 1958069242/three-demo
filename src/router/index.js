import Vue from 'vue'
import Router from 'vue-router'
import index from '../views/canvas/index.vue'
import three from '../views/webGL/index.vue'
import car from '../views/car/index.vue'
import room from '../views/rooms/index.vue'
import vr from '../views/720vr/index.vue'
import hall from '../views/hall/index.vue'
import particle from '../views/particle/index.vue'
import build from '../views/build/index.vue'
Vue.use(Router)
// 2.配置路由信息
const router = new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: "index"
        },
        {
            path: '/index',
            component: index,
        },
        {
            path: '/three',
            component: three,
        },
        {
            path: '/car',
            component: car,
        },
        {
            path: '/room',
            component: room,
        },

        {
            path: '/720vr',
            component: vr,
        },

        {
            path: '/hall',
            component: hall,
        },

        {
            path: '/particle',
            component: particle,
        },

        {
            path: '/build',
            component: build,
        },
    ]
})
export default router

