import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/WelcomePage.vue'),
    },
    {
      path: '/list',
      children: [
        {
          path: 'films',
          name: 'list-films',
          component: () => import('../pages/FilmsPage.vue'),
          meta: { parent: 'list', title: 'Films' },
        },
        {
          path: 'people',
          name: 'list-people',
          component: () => import('../pages/FooPage.vue'),
          meta: { parent: 'list', title: 'People' },
        },
        {
          path: 'planets',
          name: 'list-planets',
          component: () => import('../pages/FooPage.vue'),
          meta: { parent: 'list', title: 'Planets' },
        },
      ],
    },
  ],
})

export default router
