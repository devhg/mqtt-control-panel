const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',

  BlackIPList: '/api/blackip/list',
  BlackIPCreate: '/api/blackip/create',

  StudentDelete: '/student/delete',
  StudentUpload: '/student/upload',
  StudentAnalysis: '/student/analysis',
  StudentAnalysisCourse: '/student/analysis/course',
}
export default api
