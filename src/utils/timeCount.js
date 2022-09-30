// 倒计时
export function start() {
	// 避免可能出现的倒计时重叠情况
	this.clearTimer();
	if (this.timestamp <= 0) return;
	this.seconds = Number(this.timestamp);
	this.formatTime(this.seconds);
	this.timer = setInterval(() => {
		this.seconds--;
		// 发出change事件
		this.$emit('change', this.seconds);
		if (this.seconds < 0) {
			return this.end();
		}
		this.formatTime(this.seconds);
	}, 1000);
},
// 格式化时间
export function formatTime(seconds) {
	// 小于等于0的话，结束倒计时
	seconds <= 0 && this.end();
	let [day, hour, minute, second] = [0, 0, 0, 0];
	day = Math.floor(seconds / (60 * 60 * 24));
	// 判断是否显示“天”参数，如果不显示，将天部分的值，加入到小时中
	// hour为给后面计算秒和分等用的(基于显示天的前提下计算)
	hour = Math.floor(seconds / (60 * 60)) - day * 24;
	// showHour为需要显示的小时
	let showHour = null;
	if (this.showDays) {
		showHour = hour;
	} else {
		// 如果不显示天数，将“天”部分的时间折算到小时中去
		showHour = Math.floor(seconds / (60 * 60));
	}
	minute = Math.floor(seconds / 60) - hour * 60 - day * 24 * 60;
	second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
	// 如果小于10，在前面补上一个"0"
	showHour = showHour < 10 ? '0' + showHour : showHour;
	minute = minute < 10 ? '0' + minute : minute;
	second = second < 10 ? '0' + second : second;
	day = day < 10 ? '0' + day : day;
	
	console.log("天 时 分 秒")
	
	
	this.d = day;
	this.h = showHour;
	this.i = minute;
	this.s = second;
},
// 停止倒计时
export function end() {
	this.clearTimer();
	this.$emit('end', {});
},
// 清除定时器
export function clearTimer() {
	if (this.timer) {
		// 清除定时器
		clearInterval(this.timer);
		this.timer = null;
	}
}
