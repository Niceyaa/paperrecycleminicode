import apiRequest from '../utils/request.js'
// 获取验证码
export function sendCode(data){
	return apiRequest('/zmsys-user/api/authcode/sendAuthCode','POST',data)
}
// 获取公共页面
export function getCommonUrl(data){
	return apiRequest('/pub-resource/api/pubInfo/articleWebUrl','POST',data,'application/x-www-form-urlencoded')
}
// 判断是否有未读消息
export function getNotReadMessage(data){
	return apiRequest('/zmsys-user/api/message/queryUserUnMessage','POST',data)
}
// 获取各类型消息
export function getMessageByType(data){
	return apiRequest('/zmsys-user/api/message/queryUserUnMessageByType','POST',data)
}
// 获取消息列表通过typeId
export function getMessageListByType(data){
	return apiRequest('/zmsys-user/api/message/queryMessageList','POST',data)
}
// 获取消息详情
export function getMessageDetail(data){
	return apiRequest('/zmsys-user/api/message/queryMessageInfo','POST',data,'application/x-www-form-urlencoded')
}
// 消息--一键已读
export function makeMessageReadable(data){
	return apiRequest('/zmsys-user/api/message/updateMessageReadByIds','POST',data)
}
// 附近站点
export function nearRecycleBinList(data){
	return apiRequest('/zmsys-agent/api/recycler/retrieveQueryRecyclerList','POST',data)
}