//type:不传，返回 y-m-d
//type:1，返回 y-m-d h:m:s
export function formatDate(data, type) {
	let t = new Date(data)
	let y = t.getFullYear()
	let mon = (t.getMonth() + 1).toString().padStart(2, 0)
	let d = t.getDate().toString().padStart(2, 0)
	let h = t.getHours().toString().padStart(2, 0)
	let min = t.getMinutes().toString().padStart(2, 0)
	let s = t.getSeconds().toString().padStart(2, 0)
	if(type){
		return `${y}-${mon}-${d} ${h}:${min}:${s}`
	}
	return `${y}-${mon}-${d}`
}

export function imgPreview(current,urls){
	uni.previewImage({
		current:current,
		urls:urls
	})
}

export function getBeforeDay(days,type) {
	let beforeTime = days * 24 * 60 * 60 * 1000
	let nowTime = new Date().getTime()
	let t = new Date(nowTime-beforeTime)
	let y = t.getFullYear()
	let mon = (t.getMonth() + 1).toString().padStart(2, 0)
	let d = t.getDate().toString().padStart(2, 0)
	let h = t.getHours().toString().padStart(2, 0)
	let min = t.getMinutes().toString().padStart(2, 0)
	let s = t.getSeconds().toString().padStart(2, 0)
	if(type){
		return `${y}-${mon}-${d} ${h}:${min}:${s}`
	}
	return `${y}-${mon}-${d}`
}
