import apiRequest from '../utils/request.js'

// 新任务订单
export function newTaskOrder(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/listRetrieveOrderPage','POST',data)
}

// 待收货订单
export function waitReceiveOrder(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/listPreRetrieveOrderPage','POST',data)
}

// 已完成订单
export function finishedOrder(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/listFinishRetrieveOrderPage','POST',data)
}

// 订单详情
export function orderDetail(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/getOrderDetailForRU','GET',data)
}

// 抢单
export function raceOrder(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/seizeOrder','GET',data)
}

// 填写清单信息
export function fillingInventory(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/fillInRetrieveInventory','POST',data)
}

// 修改清单信息
export function updateInventory(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/updateRetrieveInventory','POST',data)
}

// 删除清单信息
export function deleteInventory(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/deleteRetrieveInventory','GET',data)
}

// 获取单个清单信息详情
export function getInventoryDetail(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/getRetrieveInventory','GET',data)
}

// 判断用户是否已经核对订单
export function consumerIsConfirmOrder(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/confirmConsumerBeforePay','GET',data)
}

// 获取订单支付概览信息
export function getPayInfo(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/getPaymentOrderInfo','GET',data)
}

// 确认支付
export function pay(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/payForRetrieve','POST',data)
}

// 取消订单
export function cancelOrder(data){
	return apiRequest('/zmsys-retrieve-order/api/retrieveOrderForRU/cancelOrder','GET',data)
}

// 实名认证测试接口
export function test(data){
	return apiRequest('/pages/oauth/authindex','GET',data)
}

// 获取物品分类接口
export function getGoodsClassify(data){
	return apiRequest('/zmsys-retrieve/api/confRetrieveProcess/ApiQueryConfRetrieveClassifyList','POST',data,'application/x-www-form-urlencoded')
}