// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: {
          title: 'dashboard',
          keepAlive: true,
          icon: bxAnaalyse,
          permission: ['dashboard']
        },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: {
              title: '分析页',
              keepAlive: false,
              permission: ['dashboard']
            }
          },
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
      // 服务监控
      {
        path: '/monitor',
        name: 'list',
        component: PageView,
        redirect: '/monitor/packet',
        meta: {
          title: '服务监控',
          icon: 'fund',
          permission: ['table']
        },
        children: [
          //   {
          //     path: '/monitor/packet',
          //     name: 'PacketMonitor',
          //     hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
          //     component: () => import('@/views/monitor/packet/Index.vue'),
          //     meta: {
          //       title: '报文监控',
          //       keepAlive: true,
          //       permission: ['table']
          //     }
          //   },
          {
            path: '/monitor/flow',
            name: 'FlowMonitor',
            // hidden: true,
            component: () => import('@/views/monitor/flow/Index.vue'),
            meta: {
              keepAlive: false,
              title: '流量监控'
            }
          }
          //   {
          //     path: '/monitor/route',
          //     name: 'RouteMonitor',
          //     // hidden: true,
          //     component: () => import('@/views/monitor/route/Index.vue'),
          //     meta: {
          //       keepAlive: false,
          //       title: '链路监控'
          //     }
          //   }
        ]
      },
      // 连接管理
      {
        path: '/connection',
        name: 'Connection',
        component: PageView,
        redirect: '/connection/session',
        meta: {
          title: '连接管理',
          icon: 'api',
          permission: ['table']
        },
        children: [
          {
            path: '/connection/blacklist',
            name: 'BlackList',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/connection/ip-black-list/Index.vue'),
            meta: {
              title: 'IP黑名单',
              keepAlive: true,
              permission: ['table']
            }
          },
          {
            path: '/connection/session',
            name: 'Session',
            component: () => import('@/views/connection/session/Index.vue'),
            meta: {
              keepAlive: false,
              title: '会话管理'
            }
          }
        ]
      },
      // 客户端管理
      {
        path: '/client',
        name: 'Client',
        component: PageView,
        redirect: '/client/userList',
        meta: {
          title: '客户端管理',
          icon: 'usergroup-add',
          permission: ['table']
        },
        children: [
          {
            path: '/client/list',
            name: 'UserListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/client/List.vue'),
            meta: {
              title: '客户端列表',
              keepAlive: true,
              permission: ['table']
            }
          },
          {
            path: '/client/register',
            name: 'UserAdvanced',
            component: () => import('@/views/client/Register.vue'),
            meta: {
              keepAlive: false,
              title: '客户端注册'
            }
          }
        ]
      },
      // 订阅管理
      {
        path: '/subscribe',
        name: 'Subscribe',
        component: PageView,
        redirect: '/subscribe/topicList',
        meta: {
          title: '订阅管理',
          icon: 'cluster',
          permission: ['table']
        },
        children: [
          {
            path: '/subscribe/topicList',
            name: 'TopicListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/subscribe/TopicList.vue'),
            meta: {
              title: 'Topic列表',
              keepAlive: true,
              permission: ['table']
            }
          },
          {
            path: '/subscribe/wsMqtt',
            name: 'websocketMqtt',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/subscribe/WsMqtt.vue'),
            meta: {
              title: '连接测试',
              keepAlive: true,
              permission: ['table']
            }
          }
        ]
      },
      // 关于系统
      {
        path: '/about',
        name: 'about',
        component: RouteView,
        meta: {
          title: '关于系统',
          icon: 'profile',
          permission: ['profile']
        },
        component: () => import('@/views/profile/basic/Index.vue')
      },
      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        hidden: true,
        name: 'account',
        meta: { title: '账户', icon: 'user', keepAlive: true, permission: ['user'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: '个人中心', keepAlive: true, permission: ['user'] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '账户设置', hideHeader: true, permission: ['user'] },
            // redirect: '/account/settings/basic',
            hideChildrenInMenu: true
          }
        ]
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
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
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
    name: '404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/result/exception/404')
  }
]
