const basic_data = require("../../../comm/bd.js")

function dateTimeToTimeStamp(timeStamp){
	if(timeStamp.length == 10)timeStamp += ' 00:00:00'
	if(timeStamp.length == 16)timeStamp += ':00'
	
	var reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
	var res = timeStamp.match(reg);
	
	if (res == null){
		var reg2 = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
		var res2 = timeStamp.match(reg2);
		if(res2 == null){
			console.log('时间格式错误 E001');
			return false;
		}else{
			var year  = parseInt(res2[3]);
			var month = parseInt(res2[1]);
			var day   = parseInt(res2[2]);
			var h     = parseInt(res2[4]);
			var i     = parseInt(res2[5]);
			var s     = parseInt(res2[6]);
		}
	}else{
		var year  = parseInt(res[1]);
		var month = parseInt(res[2]);
		var day   = parseInt(res[3]);
		var h     = parseInt(res[4]);
		var i     = parseInt(res[5]);
		var s     = parseInt(res[6]);
	}
	if (year < 1000) { console.log('时间格式错误'); return false; }
	if (h < 0 || h > 24) { console.log('时间格式错误'); return false; }
	if (i < 0 || i > 60) { console.log('时间格式错误'); return false; }
	if (s < 0 || s > 60) { console.log('时间格式错误'); return false; }
	return Date.parse(new Date(year, month - 1, day, h, i, s)) / 1000;
}

function ChangeHourMinutestr(str, format) {
	if (str !== "0" && str !== "" && str !== null) {
		if(format) {
			return Math.floor(str / 60).toString() + "小时" + ((str%60)==0 ? "" : (str %60).toString() + "分");
			
		}
		return ((Math.floor(str / 60)).toString().length < 2 ? "0" + (Math.floor(str / 60)).toString() :
			(Math.floor(str / 60)).toString()) + ":" + ((str % 60).toString().length < 2 ? "0" + (str % 60).toString() : (str %60).toString());
		
	} else {
		return "";
	}
}

const tUNITS = {
		'yy': 31557600000,
		'mm': 2629800000,
		'dd': 86400000,
		'hh': 3600000,
		'mi': 60000,
		'ss': 1000
	}

function onTime(typename, startEnroll, endEnroll, eventDate){
	let timer = {prename:'', close: false, toEnroll: false, toStart: false, toEndEnroll: false, dd:0, hh:0, mm:0, ss:0}
	
	const now = new Date().getTime()
	let startEnrollTime = parseInt(now - (dateTimeToTimeStamp(startEnroll) * tUNITS.ss))
	let endEnrollTime = parseInt(now - (dateTimeToTimeStamp(endEnroll) * tUNITS.ss))
	let eventDateTime = parseInt(now - (dateTimeToTimeStamp(eventDate) * tUNITS.ss))
	
	if(startEnrollTime > 0){ //报名启动
		if (endEnrollTime > 0) { //报名结束
			timer.endEnroll = true
			if (eventDateTime < 0) {
				timer.toStart = true
				timer.prename = '距'+typename+'开始'
				const yer = Math.floor(-eventDateTime / tUNITS.yy)
				const day = Math.floor((-eventDateTime - yer * tUNITS.yy) / tUNITS.dd)
				const hor = Math.floor((-eventDateTime - (yer * tUNITS.yy + day * tUNITS.dd)) / tUNITS.hh)
				const min = Math.floor((-eventDateTime - (yer * tUNITS.yy + day * tUNITS.dd + hor * tUNITS.hh)) / tUNITS.mi)
				const sec = Math.floor((-eventDateTime - (yer * tUNITS.yy + day * tUNITS.dd + hor * tUNITS.hh + min * tUNITS.mi)) / tUNITS.ss)
				
				timer.dd = yer*365 + day
				timer.hh = hor
				timer.mm = min
				timer.ss = sec
			} else { //活动结束
				timer.close = true
				timer.endEnroll = false
				timer.prename = '距'+typename+'开始'
			}
		} else {
			timer.toEndEnroll = true
			timer.prename = '距报名结束'
			const yer = Math.floor(-endEnrollTime / tUNITS.yy)
			const day = Math.floor((-endEnrollTime - yer * tUNITS.yy) / tUNITS.dd)
			const hor = Math.floor((-endEnrollTime - (yer * tUNITS.yy + day * tUNITS.dd)) / tUNITS.hh)
			const min = Math.floor((-endEnrollTime - (yer * tUNITS.yy + day * tUNITS.dd + hor * tUNITS.hh)) / tUNITS.mi)
			const sec = Math.floor((-endEnrollTime - (yer * tUNITS.yy + day * tUNITS.dd + hor * tUNITS.hh + min * tUNITS.mi)) / tUNITS.ss)
			
			timer.dd = yer*365 + day
			timer.hh = hor
			timer.mm = min
			timer.ss = sec
		}
	} else {
		timer.toEnroll = true
		timer.prename = '距报名开始'
		const yer = Math.floor(-startEnrollTime / tUNITS.yy)
		const day = Math.floor((-startEnrollTime - yer * tUNITS.yy) / tUNITS.dd)
		const hor = Math.floor((-startEnrollTime - (yer * tUNITS.yy + day * tUNITS.dd)) / tUNITS.hh)
		const min = Math.floor((-startEnrollTime - (yer * tUNITS.yy + day * tUNITS.dd + hor * tUNITS.hh)) / tUNITS.mi)
		const sec = Math.floor((-startEnrollTime - (yer * tUNITS.yy + day * tUNITS.dd + hor * tUNITS.hh + min * tUNITS.mi)) / tUNITS.ss)
		
		timer.dd = yer*365 + day
		timer.hh = hor
		timer.mm = min
		timer.ss = sec
	}
	return timer
}

function descEventInfo(obj) {
	 // debugger
	for (let i = 0; i < obj.length; i++) {
		if (obj[i].duration != '') {
			obj[i].duration = ChangeHourMinutestr(obj[i].duration, true)
		}
		let total = 0
		//item Hours 
		for (let j = 0; j < obj[i].item.length; j++) {
			if (obj[i].item[j].closeTime != '') {
				obj[i].item[j].closeTime = ChangeHourMinutestr(obj[i].item[j].closeTime, true)
			}
			total += obj[i].item[j].limit
			if(obj[i].item[j].price.cut > 0) {
				obj[i].item[j].price.cut = (obj[i].item[j].price.v * obj[i].item[j].price.cut).toFixed(2)*1
			}
			if((obj[i].item[j].price.v == 0)){
				obj[i].item[j].price.v = '免费'
			}
			obj[i].item[j].current = -1
			obj[i].item[j].ecur = -1
		}
		obj[i].total = total
		
		//desc 文本分段
		if (obj[i].desc != '') {
			obj[i].desc = obj[i].desc.split('\n')
		}
		
		//pics 文本分段
		for (let j = 0; j < obj[i].pics.length; j++) {
			if (obj[i].pics[j].desc != '') {
				obj[i].pics[j].desc = obj[i].pics[j].desc.split('\n')
			}
			obj[i].pics[j].idx = parseInt((i+1)+'010'+j)
		}
		//gift 文本分段
		for (let j = 0; j < obj[i].gift.length; j++) {
			if (obj[i].gift[j].desc != '') {
				obj[i].gift[j].desc = obj[i].gift[j].desc.split('\n')
			}
			obj[i].gift[j].idx = parseInt((i+1)+'020'+j)
		}
		//rules 文本分段
		for (let j = 0; j < obj[i].rules.length; j++) {
			if (obj[i].rules[j].desc != '') {
				obj[i].rules[j].desc = obj[i].rules[j].desc.split('\n')
			}
			obj[i].rules[j].idx = parseInt((i+1)+'030'+j)
		}
		//tips 文本分段
		for (let j = 0; j < obj[i].tips.length; j++) {
			if (obj[i].tips[j].desc != '') {
				obj[i].tips[j].desc = obj[i].tips[j].desc.split('\n')
			}
			obj[i].tips[j].idx = parseInt((i+1)+'040'+j)
		}
		
		//region
		for (let j = 0; j < obj[i].region.length; j++) {
			for (let k = 0; k < basic_data.region.length; k++) {
				if (obj[i].region[j] == basic_data.region[k][0]) {
					obj[i].region.splice(j, 1, {
						code: basic_data.region[k][0],
						value: basic_data.region[k][1]
					})
					break
				}
			}
		}
		//element
		for (let j = 0; j < obj[i].element.length; j++) {
			for (let k = 0; k < basic_data.element.length; k++) {
				if (obj[i].element[j] == basic_data.element[k][0]) {
					obj[i].element.splice(j, 1, {
						code: basic_data.element[k][0],
						value: basic_data.element[k][1],
						color: basic_data.element[k][2]
					})
					break
				}
			}
		}

		//type
		let typename = ''
		for (let j = 0; j < obj[i].type.length; j++) {
			for (let k = 0; k < basic_data.eventType.length; k++) {
				if (obj[i].type[j] == basic_data.eventType[k][0]) {
					obj[i].type.splice(j, 1, {
						code: basic_data.eventType[k][0],
						value: basic_data.eventType[k][1],
						color: basic_data.eventType[k][2]
					})
					typename += j>0? '/':''
					typename += basic_data.eventType[k][1]
					break
				}
			}
		}
		obj[i].typename = typename
		obj[i].timer = onTime(typename, obj[i].startEnroll, obj[i].endEnroll, obj[i].eventDate + " " + obj[i].startTime)
	}
	return obj
}



module.exports = {
	'ONTIME': onTime,
	'DESCEVENTINFO': descEventInfo,
}
