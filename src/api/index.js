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

  SessionList: '/api/session/list',

  PacketList: '/api/packet/list',
  SystemQps: '/api/packet/qps',
  SystemPacketsPerSecond: '/api/packet/packets_per_second',

  StudentDelete: '/student/delete',
  StudentUpload: '/student/upload',
  StudentAnalysis: '/student/analysis',
  StudentAnalysisCourse: '/student/analysis/course',
}
export default api
