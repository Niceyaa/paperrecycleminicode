import apiRequest from '../utils/request.js'

// 获取凭证
export function getTicket(data){
	return apiRequest('/zmsys-file/oss/policyWithType','GET',data)
}

// 多文件上传
export function fileUploadMuti(data){
	return apiRequest('/zmsys-file/api/fileManage/uploadBatchFile','POST',data)
}
// 单文件上传
export function fileUploadSingle(data){
	return apiRequest('/zmsys-file/api/fileManage/upload','POST',data)
}

// 删除文件
export function deleteFile(data){
	return apiRequest('/zmsys-file/api/fileManage/deleteByAbsolutePath','GET',data)
}

