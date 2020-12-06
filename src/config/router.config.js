// eslint-disable-next-line
import {
  UserLayout,
  BasicLayout,
  RouteView,
  BlankLayout,
  PageView
} from '@/layouts'
import {
  bxAnaalyse
} from '@/core/icons'

export const asyncRouterMap = [{
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: {
          title: '数据分析',
          keepAlive: true,
          icon: bxAnaalyse,
          permission: ['dashboard']
        },
        children: [{
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: {
              title: '分析页',
              keepAlive: false,
              permission: ['dashboard']
            }
          },
          // 外部链接
          // {
          //   path: '/oth',
          //   redirect: '/404',
          //   name: 'Monitor',
          //   meta: {
          //     title: '监控页（外部）',
          //     target: '_blank'
          //   }
          // },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: {
              title: '工作台',
              keepAlive: true,
              permission: ['dashboard']
            }
          }
        ]
      },
      // 学生管理 list
      {
        path: '/student',
        name: 'list',
        component: PageView,
        redirect: '/student/userList',
        meta: {
          title: '成绩管理',
          icon: 'table',
          permission: ['table']
        },
        children: [{
            path: '/student/userList/:pageNo([1-9]\\d*)?',
            name: 'UserListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/student/UserList'),
            meta: {
              title: '学生列表',
              keepAlive: true,
              permission: ['table']
            }
          },
          // {
          //   path: '/student/record',
          //   name: 'InWrapper',
          //   hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
          //   component: () => import('@/views/student/Record'),
          //   meta: {
          //     title: '进出记录',
          //     keepAlive: true,
          //     permission: ['table']
          //   },
          // },
          {
            path: '/student/UserDetail',
            name: 'UserAdvanced',
            hidden: true,
            component: () => import('@/views/student/advanced/UserAdvanced'),
            meta: {
              keepAlive: false,
              title: '用户详情'
            }
          }
        ]
      },
      // 关于酒店
      {
        path: '/about',
        name: 'about',
        component: RouteView,
        meta: {
          title: '关于系统',
          icon: 'profile',
          permission: ['profile']
        },
        component: () => import('@/views/profile/basic/Index.vue'),
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [{
        path: 'login',
        name: 'login',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/404',
    component: () => import( /* webpackChunkName: "fail" */ '@/views/result/exception/404')
  }

]