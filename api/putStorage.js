import apiRequest from '../utils/request.js'
// 订单入库---获取订单列表
export function getOrderListNeedStorage(data){
	return apiRequest('/zmsys-retrieve/api/temporaryStock/findList','POST',data,'application/x-www-form-urlencoded')
}
// 订单入库
export function orderPutInStorage(data){
	return apiRequest('/zmsys-retrieve/api/temporaryStock/confirmStock','POST',data)
}
// 入库记录查询
export function orderPutInStorageRecord(data){
	return apiRequest('/zmsys-retrieve/api/retrieveRecordForRU/listRetrieveStockRecordPage','POST',data)
}
// 入库订单详情
export function orderPutInStorageDetail(data){
	return apiRequest('/zmsys-retrieve/api/retrieveRecordForRU/queryRetrieveOrderByRecordId','POST',data,'application/x-www-form-urlencoded')
}
// 入库详情
export function storageDetail(data){
	return apiRequest('/zmsys-retrieve/api/retrieveRecordForRU/retrieveStockDetails','POST',data,'application/x-www-form-urlencoded')
}