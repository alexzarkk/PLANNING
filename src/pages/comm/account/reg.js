const 
_isMobile = (v) => {
	return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(v);
},
isSafe = (psd)=> {
	if(psd.length<8){
		return '密码长度在8~12位！'
	}
	// 密码包含数字和字母
	const reg1=/^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,16})$/
	// 密码包含符号
	const reg2=/[`~!@#$%^&*()\-_+={}[\]|\\:;"'<>?,./]/
	// 密码包含字母大小写
	const reg3_1=/[a-z]/
	const reg3_2=/[A-Z]/
	const rule1=reg1.test(psd)?1:0
	const rule2=reg2.test(psd)?1:0
	const rule3=reg3_1.test(psd) && reg3_2.test(psd) ? 1:0
	const isValid = rule1 + rule2 + rule3
	
	if(isValid >= 2){
		return null
	}else{
		return '密码必须包含数字、字母和至少一个大写字母！'
	}
}	

const reg = {
	_isMobile,
	isSafe
}

module.exports = reg
