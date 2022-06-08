const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',

  // 黑名单
  BlackIPList: '/blackip/list',
  BlackIPCreate: '/blackip/create',
  BlackIPUpdate: '/blackip/update',
  BlackIPDelete: '/blackip/delete',

  // 会话
  SessionList: '/session/list',
  SessionLogout: '/session/logout',

  PacketList: '/packet/list',
  SystemPacketsPerSecond: '/packet/packets_per_second',

  // 客户端
  ClientList: '/client/list',
  ClientKey: '/client/loginPwd',
  ClientCreate: '/client/create',
  ClientUpdate: '/client/update',
  ClientDelete: '/client/delete',

  TopicList: '/topic/list',

  ClusterInfo: '/cluster/info',
  ClusterMetrics: '/cluster/metrics',
  SystemQps: '/server/qps'
}
export default api
