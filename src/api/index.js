const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',

  // 黑名单
  BlackIPList: '/api/blackip/list',
  BlackIPCreate: '/api/blackip/create',
  BlackIPUpdate: '/api/blackip/update',
  BlackIPDelete: '/api/blackip/delete',

  // 会话
  SessionList: '/api/session/list',
  SessionLogout: '/api/session/logout',

  PacketList: '/api/packet/list',
  SystemQps: '/api/packet/qps',
  SystemPacketsPerSecond: '/api/packet/packets_per_second',

  // 客户端
  ClientList: '/api/client/list',
  ClientKey: '/api/client/loginPwd',
  ClientCreate: '/api/client/create',
  ClientUpdate: '/api/client/update',
  ClientDelete: '/api/client/delete',

  TopicList: '/api/topic/list',

  ClusterInfo: '/api/cluster/info',
  ClusterMetrics: '/api/cluster/metrics'
}
export default api
