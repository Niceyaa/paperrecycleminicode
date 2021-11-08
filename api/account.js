import apiRequest from '../utils/request.js'
// 回收站明细
export function recycleAccountDetail(data){
	return apiRequest('/zmsys-agent/sys/recycler/getAccountInfo','POST',data)
}
// 查询订单统计
export function orderStatistic(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/getRetrieveUserOrderDetail','POST',data,'application/x-www-form-urlencoded')
}
// 查询订单统计
export function getBillDetail(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/getRetrieveUserAccountRecordList','POST',data)
}
// 查询收支统计
export function getIncomeAndExpensesStatistic(data){
	return apiRequest('/zmsys-user/api/retrieveUserAccount/billStatistics','POST',data)
}