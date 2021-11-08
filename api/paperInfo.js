import apiRequest from '../utils/request.js'

// 纸张分类
export function paperClassify(data){
	return apiRequest('/zmsys-retrieve/api/confRetrieveProcess/ApiQueryConfPaperClassify','POST',data)
}