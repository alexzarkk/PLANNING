<template>
	<view>
		<view @click="echarts.onClick" :prop="option" :change:prop="echarts.updateEcharts" id="echarts" class="echarts"></view>
	</view>
</template>

<script>
	export default {
		name: 'zzDirection',
		data() {
			return {
				option: {}
			}
		},
		props: {
			cur: {
				// 站位
				type: Number,
				default: 0
			},
			targets: {
				// 指向
				type: Array,
				default: ()=>{
					return []
				}
			},
			curEdit: {
				type: Object,
				default: ()=>{
					return {}
				}
			}
			
		},
		watch: {
			targets: {
				deep:true,
				handler(nv,ov){
					// console.log(nv)
					this.setDrection()
				}
			},
			curEdit:{
				handler(v){
					// console.log('curEdit-------------->',v)
					if(v.edit[0]==-1){
						for (let s of this.option.series) {
							if(s.name!='readDirect'){
								try{
									s.pointer.itemStyle.color = '#f37b1d'
								}catch(e){
									//TODO handle the exception
								}
							} 
						}
					}
				}
			}
		},
		onLoad() {
			// this.changeOption()
		},
		mounted() {
			let thiz = this
			setTimeout(function() {thiz.setDrection()}, 100);
		},
		methods: {
			setDrection(){
				let series = [{
							name: 'readDirect',
							type: 'gauge',
							startAngle: 90,
							endAngle: -270,
							min: 0,
							max: 360,
							splitNumber: 12,
							//边框
							axisLine: {
								lineStyle: {
									width: 6,
									color: [
										[1, 'rgba(74, 74, 74, 0.7)']
									],
									shadowColor: 'rgba(166, 166, 166, 0.5)',
									shadowBlur: 15,
									// roundCap:true
								}
							},
							//度数指示
							splitLine: {
								lineStyle: {
									shadowColor: 'rgba(68, 68, 68, 0.3)',
									shadowBlur: 6,
									shadowOffsetX: 1,
									shadowOffsetY: 2
								}
							},
							//度数表
							axisLabel: {
								fontSize: 10,
								distance: 10,
								// lineHeight:10,
								// width:10,
								formatter: function (value) {
									if (value == 0) {
										return '';
									}
									return value;
								}
							},
							
							//logo
							anchor: {
								show: true,
								size: 15,
								showAbove: true,
								itemStyle: {
									color: '#5d5d5d',
									shadowColor: 'rgba(0, 0, 0, 0.3)',
									shadowBlur: 8,
									shadowOffsetX: 2,
									shadowOffsetY: 2
								}
							},
							//站位朝向
							pointer: {
								icon:'arrow',
								width: 16,
								length: '55%',
								offsetCenter: [0, '-40%'],
								itemStyle: {
									color: '#9f9f9f',
									shadowColor: 'rgba(225, 225, 225, 0.3)',
									shadowBlur: 2,
									shadowOffsetX: 2,
									shadowOffsetY: 2,
									opacity:0.8
								}
							},
							detail: {
								show: true,
								offsetCenter: [0, '-115%'],
								formatter: [
									'{a|'+this.cur+'°\n阅读站位}',
								].join('\n'),
							
								rich: {
									a: {
										color: 'gray',
										lineHeight: 16
									}
								}
							},
							title: {
								offsetCenter: [0, '30%']
							},
							data: [{
								value: 0
							}],
						}]
				
				
				let cur = this.curEdit
				for (var i = 0; i < this.targets.length; i++) {
					let t = this.targets[i]
					
					const hudu = 2*Math.PI/360*t.angle[0]
					let x = Math.sin(hudu) * 115
					let y= -Math.cos(hudu) * 115
					
					series.push(this.getPointer({
									name:'target'+i,
									len: t.angle[1]==-1?60:40,
									offc: [0, '-10%'],
									value: t.angle[0],
									color: (cur.idx==i&&cur.edit[0]==0)? '#39b54a':'#e26817',
									opacity: 0.7,
									detail: {
										offc: [x+'%', y+'%'],
										fmt: ['{a|'+ t.target.map((e)=>{return e.name}).join('\n') +'}'].join('\n')
									} 
								}))
					
					if(t.angle[1]>-1) {
						
						const hudu2 = 2*Math.PI/360*(t.angle[0]-t.angle[1])
						let m = Math.sin(hudu2) * 47
						let n = -Math.cos(hudu2) * 47
						
						series.push(this.getPointer({
										name:'target'+i+'2',
										len: 48,
										offc: [m+'%', n+'%'],
										value: t.angle[1],
										color: (cur.idx==i&&cur.edit[0]==1)? '#39b54a':'#e26817',
										opacity: 0.7,
										detail: {}
									}))
						
					}
				}
				const getEswn = (d,a,name) => {
					let _a = 360 - d + a
					if (_a > 360) _a -= 360
					if (_a == 360) _a = 0
					return {_a,name}
				}
				let eswn = [getEswn(this.cur,90,'东'), getEswn(this.cur,180,'南'), getEswn(this.cur,270,'西'), getEswn(this.cur,360,'北')]
				// console.log(eswn)
				for (let s of eswn) {
					const hudu = 2*Math.PI/360*s._a
					let x = Math.sin(hudu) * 62
					let y = -Math.cos(hudu) * 62
					
					series.push({
						name: 'eswn',
						type: 'gauge',
						startAngle: 90,
						endAngle: -270,
						min: 0,
						max: 360,
						splitNumber: 12,
						axisLabel: false,
						axisLine: { show: false },
						axisTick: { show: false },
						splitLine: { show: false },
						detail: { show:false },
						pointer: { show: false },
						data: [{
							value: s._a,
							name: s.name,
							title: {
								color: '#4b4b70',
								offsetCenter:  [x+'%', y+'%'],
							}
						 }]
					})
				}
				
				this.option = { series }
			},
			getPointer(d){
				return {
					name: d.name,
					type: 'gauge',
					startAngle: 90,
					endAngle: -270,
					min: 0,
					max: 360,
					animationEasingUpdate: 'bounceOut',
					axisLabel: false,
					axisLine: { show: false },
					axisTick: { show: false },
					splitLine: { show: false },
					pointer: {
						icon: d.len==40?'rect':'path://M239.223,199.878 L218.906,228.903 C218.435,229.576 218.182,230.376 218.182,231.197 L218.182,231.197 C218.182,233.406 219.973,235.196 222.183,235.196 L222.183,235.196 L233.303,235.196 L233.304,505.697 C233.304,510.667 237.333,514.697 242.304,514.697 L242.304,514.697 C247.275,514.697 251.304,510.667 251.304,505.697 L251.304,505.697 L251.303,235.196 L262.818,235.196 C263.638,235.196 264.438,234.944 265.111,234.473 L265.111,234.473 C266.922,233.206 267.361,230.712 266.094,228.903 L266.094,228.903 L245.777,199.878 C245.509,199.495 245.177,199.163 244.794,198.895 L244.794,198.895 C244.096,198.406 243.297,198.172 242.505,198.172 L242.505,198.172 C241.243,198.172 240.002,198.767 239.223,199.878 L239.223,199.878 Z',
						width: d.len==40?8:20,
						length: d.len+'%',
						offsetCenter: d.offc,
						itemStyle: {
							color: d.color,
							opacity: d.opacity
							// shadowColor: 'rgba(0, 0, 0, 0.3)',
							// shadowBlur: 8,
							// shadowOffsetX: 2,
							// shadowOffsetY: 2
						}
					},
					anchor: {
						show: false,
					},
					detail: {
						show: true,
						offsetCenter: d.detail.offc,
						formatter:  d.detail.fmt,
						rich: {
							a: {
								color: 'red',
								fontSize:16,
								lineHeight: 16
							}
						}
					},
					
					data: [{
							value: d.value
						}]
				}
			},
			
			onViewClick(options) {
				// console.log(options)
			}
		}
	}
</script>

<script module="echarts" lang="renderjs">
	let myChart
	export default {
		mounted() {
			
			if (typeof window.echarts === 'function') {
				this.initEcharts()
			} else {
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
				// script.src = 'https://zts.5618.co/repo/js/echarts.min.js'
				script.src = 'static/echarts.min.js'
				script.onload = this.initEcharts.bind(this)
				document.head.appendChild(script)
			}
		},
		methods: {
			initEcharts() {
				// console.log(this.option)
				myChart = echarts.init(document.getElementById('echarts'))
				// 观测更新的数据在 view 层可以直接访问到
				myChart.setOption(this.option)
			},
			updateEcharts(newValue, oldValue, ownerInstance, instance) {
				// 监听 service 层数据变更
				// console.log('updateEcharts newValue -------------', newValue)
				myChart.setOption(newValue)
			},
			onClick(event, ownerInstance) {
				// 调用 service 层的方法
				ownerInstance.callMethod('onViewClick', {
					test: 'test'
				})
			}
		}
	}
</script>

<style>
	.echarts {
		width: 750rpx;
		height: 750rpx;
	}
</style>