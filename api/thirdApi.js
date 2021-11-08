import apiRequest from '../utils/request.js'

// 充值
export function rechargePay(data){
	return apiRequest('/zmsys-user/api/retrieveUserAccount/recharge','POST',data)
}

// 充值记录
export function rechargeRecord(data){
	return apiRequest('/zmsys-user/api/retrieveUserAccount/listRechargeRecordByDate','POST',data,'application/x-www-form-urlencoded')
}

// 提现
export function withdrawApi(data){
	return apiRequest('/zmsys-user/api/retrieveUserAccount/withdrawal','POST',data)
}

// 提现服务费
export function withdrawServiceFee(data){
	return apiRequest('/zmsys-user/api/retrieveUserAccount/calculateWithdrawalServiceFee','POST',data,'application/x-www-form-urlencoded')
}

// 提现记录
export function withdrawRecord(data){
	return apiRequest('/zmsys-user/api/retrieveUserAccount/listWithdrawalRecordByDate','POST',data,'application/x-www-form-urlencoded')
}