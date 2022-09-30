function createBackBtn(state) {
	uni.getSystemInfo({
		success: info => {
			//初始化存一些设备相关的参数
			try {
				uni.setStorageSync('screenHeight', info.screenHeight);
				uni.setStorageSync('screenWidth', info.screenWidth);
			} catch (e) {
				// error
			}
		}
	});

	// #ifdef APP-PLUS || APP
	state.view = new plus.nativeObj.View(
		'bottom-btn', {
			left: uni.getStorageSync('screenWidth') - 130 + 'px',
			bottom: '100px',
			height: '50px',
			width: '160px',
			backgroundColor: 'rgba(239,239,239,0)'
		},
		[{
				tag: 'rect',
				id: 'rect',
				rectStyles: {
					color: 'rgba(224,224,224,0.6)',
					radius: '27px'
				},
				position: {
					top: '0px',
					left: '0px',
					width: '160px',
					height: '50px'
				}
			},
			{
				tag: 'font',
				id: 'font',
				text: '返回记录',
				textStyles: {
					align: 'left',
					color: '#8fc42f',
					size: '24px'
				},
				position: {
					top: '0px',
					left: '20px',
					width: '160px',
					height: '50px'
				}
			}
		]
	);
	// #endif
}

export default {
	state: {
		firstShow:false,
		view:null,
		backBtn: null,
		timeCount: {
			// 格式化后计时器时间
			day: '00',
			hour: '00',
			minute: '00',
			second: '00'
		},
		seconds: 0, // 记录的时长
		isInRecord: false, // 当前是否在轨迹记录
		recordTimer: null, // 时间记录interval
		locationTimer: null, // 记录位置信息的interval
		markers: [], // lineTrack的marker数据
		polyline: [] // lineTrack的 线路数据polyline

	},
	mutations: {
		createBackBtn(state) {
			createBackBtn(state)
		},
		showBackBtn(state){
			const view  =  plus.nativeObj.View.getViewById("bottom-btn");
			view.show();
			// 监听点击事件
			if(!state.firstShow){
				view.addEventListener('click', event => {
					uni.navigateTo({
						url:'/pages/planning/lineTrack'
					})
					view.hide();
				});
				state.firstShow = true
			}else{}
			
		},
		hideBackBtn(state){
			const view  =  plus.nativeObj.View.getViewById("bottom-btn");
			view.hide();
		},
		// 设置line的数据
		setPolyline(state, {
			polyline
		}) {
			// console.log("vuex ---------------- setPolyline", polyline[0].points[0])
			let newPolyline = []
			newPolyline = newPolyline.concat(polyline)
			state.polyline = newPolyline
			// console.log("store set polyline====",state.polyline) 
		},
		// 设置marker的数据
		setMarkers(state, {
			markers
		}) {
			// console.log("vuex------------------setMarkers",markers)
			state.markers = markers
			// console.log("当前store中的marker的数据", state.markers)
		},
		// 添加line
		addPolyline(state, line) {
			state.polyline.push(line)
		},
		changePolylineById(state, {
			line,
			lineId
		}) {
			if (line) { // 通过line去改变

			} else { // 通过lineId去改变

			}


		},
		removePolyline(state, line) {

		},
		// 修改坐标点信息 通过markerId
		changeMakrerById() {

		},
		// 清除时间定时器
		cleanTimeCount(state) {
			clearInterval(state.recordTimer)
			state.recordTimer = null
		},

		// 格式化计时器时间
		setFormatTime(state) {
			try {
				let seconds = state.seconds
				let [day, hour, minute, second] = [0, 0, 0, 0];
				day = Math.floor(seconds / (60 * 60 * 24));
				hour = Math.floor(seconds / (60 * 60)) - day * 24;
				let showHour = null;
				if (false) { // showDays
					showHour = hour;
				} else {
					showHour = Math.floor(seconds / (60 * 60));
				}
				minute = Math.floor(seconds / 60) - hour * 60 - day * 24 * 60;
				second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
				showHour = showHour < 10 ? '0' + showHour : showHour;
				minute = minute < 10 ? '0' + minute : minute;
				second = second < 10 ? '0' + second : second;
				day = day < 10 ? '0' + day : day;
				state.timeCount.day = day;
				state.timeCount.hour = showHour;
				state.timeCount.minute = minute;
				state.timeCount.second = second;
			} catch (err) {
				console.error("timeFormat error========", err)
			}
		}
	},
	actions: {
		// 开始记录时间
		startTimeCount({
			state,
			commit
		}) {
			state.recordTimer = setInterval(() => {
				state.seconds++;
				// console.log("时间记录====", state.seconds)
				commit('setFormatTime')
			}, 1000)

			// console.log("开始时间记录", state.recordTimer)

		},
		pauseTimeCount({
			state,
			commit
		}) {

			clearInterval(state.recordTimer)
			state.recordTimer = null

			// console.log("vuex=============pauseTimeCount")
			commit('cleanTimeCount') // 清除时间,恢复暂停则继续
		},
		// 开始轨迹记录
		startGetLocation({
			state,
			commit
		}) {
			state.isInRecord = true
			// console.log("store改变记录状态===================", state.isInRecord)

			// state.locationTimer = setInterval(() => {
			// 	uni.getLocation({
			// 		type: 'gcj02',
			// 		success: (res) => {
			// 			console.log("获取到的地理位置信息", res)
			// 		}
			// 	})
			// },3000)
		},
		// 清除记录轨迹的定时器
		cleanGetLocation({
			state,
			commit
		}) {
			if (state.locationTimer) {
				clearInterval(state.locationTimer)
				state.locationTimer = null
			}
			state.isInRecord = false
			state.seconds = 0; // 重置时间
			commit('setFormatTime')
		}
	}
}
