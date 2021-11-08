import apiRequest from '../utils/request.js'

// 登录
export function login(data){
	return apiRequest('/zmsys-user/api/appletUser/appletLogin','POST',data)
}

// 退出登录
export function loginOut(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/loginOut','POST',data)
}

// 设置支付密码
export function setPayPwd(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/updateUsePayPwd','POST',data)
}

// 忘记密码
export function forgetPayPwd(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/editUsePayPwd','POST',data)
}

// 重置支付密码
export function resetPayPwd(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/resetPayPwd','POST',data)
}

// 设置用户信息
export function userInfo(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/saveData','POST',data)
}

// 获取用户信息
export function getUserInfo(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/queryRetrieveUserData','POST',data)
}

// 设置工作状态
export function setUserStatus(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/workState','POST',data,'application/x-www-form-urlencoded')
}

// 获取回收用户的账户信息
export function getUserAccountData(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/getRetrieveUserAccountInfo','GET',data)
}

// 获取用户银行卡信息
export function getBankInfo(data){
	return apiRequest('/zmsys-user/api/bankCard/queryUserBankCardInfList','POST',data)
}

// 绑定银行卡
export function addUserBank(data){
	return apiRequest('/zmsys-user/api/bankCard/addBankCardInfo','POST',data)
}

// 根据银行卡号获取银行名称
export function getBankName(data){
	return apiRequest('/zmsys-user/api/bankCard/queryBankName','POST',data,'application/x-www-form-urlencoded')
}

// 设置默认银行卡
export function setDefaultBankCard(data){
	return apiRequest('/zmsys-user/api/bankCard/isDefaultBank','POST',data,'application/x-www-form-urlencoded')
}

// 删除银行卡
export function deleteBankCard(data){
	return apiRequest('/zmsys-user/api/bankCard/delBankCardInfo','POST',data,'application/x-www-form-urlencoded')
}

// 获取授权信息---弃用
export function getAuthPrm(data){
	return apiRequest('/zmsys-third-part/api/applet/getAuthInfo','POST',data)
}

// 实名认证信息上传
export function uploadAuthInfo(data){
	return apiRequest('/zmsys-user/api/realNameAuth/uploadRealNameInfo','POST',data)
}

// 获取用户实名认证信息
export function getAuthInfo(data){
	return apiRequest('/zmsys-user/api/realNameAuth/queryRealNameInfo','POST',data)
}

// 获取个人信息--个人信息
export function getPersonalInfo(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/queryRetrieveUserForShow','POST',data)
}

// 修改手机号
export function changeUserTel(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/changePhone','POST',data)
}

// 上传头像
export function uploadHeaderImg(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/uploadHeadPhoto','POST',data)
}

// 上传工作照
export function uploadWorkImg(data){
	return apiRequest('/zmsys-user/api/retrieveUserBase/uploadWorkPhoto','POST',data)
}
