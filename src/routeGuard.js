import Vue from 'vue'
import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({
  showSpinner: false,
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`)
  if (to.path === '/user/login' && Vue.ls.get(ACCESS_TOKEN)) {
    next({
      path: '/dashboard/workplace',
    })
  } else if (to.path === '/user/register' || to.path === '/user/register-result') {
    next()
  } else if (to.path !== '/user/login' && !Vue.ls.get(ACCESS_TOKEN)) {
    next({
      path: '/user/login',
    })
  } else {
    next()
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})
