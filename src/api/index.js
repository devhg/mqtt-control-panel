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

  PacketList: '/api/packet/list',
  SystemQps: '/api/packet/qps',
  SystemPacketsPerSecond: '/api/packet/packets_per_second',

  // 客户端
  ClientList: '/api/client/list',
  ClientCreate: '/api/client/create',
  ClientUpdate: '/api/client/update',
  ClientDelete: '/api/client/delete',

  ClusterInfo: '/api/cluster/info',
  TopicList: '/api/topic/list',
  StudentAnalysis: '/student/analysis',
  StudentAnalysisCourse: '/student/analysis/course'
}
export default api
