import apiRequest from '../utils/request.js'
// 获取接单模式列表信息
export function getOrderModelInfo(data){
	return apiRequest('/zmsys-user/api/retrieveSetting/getReceiveTypeList','POST',data)
}

// 获取接单设置信息
export function getOrdeSetting(data){
	return apiRequest('/zmsys-user/api/retrieveSetting/getReceiveList','POST',data)
}

// 设置接单模式
export function setReceiptModel(data){
	return apiRequest('/zmsys-user/api/retrieveSetting/choiceReceiveType',"POST",data)
}

// 添加常驻区域
export function setReceiveArea(data){
	return apiRequest('/zmsys-user/api/retrieveSetting/updateReceiveArea',"POST",data)
}