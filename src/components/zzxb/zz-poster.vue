<template>
	<view>
		<canvas :canvas-id="CanvasID" :style="{ width: canvasW + 'px', height: canvasH + 'px' }"></canvas>
	</view>
</template>

<script>
	var _this;
export default {
	name: 'zz-poster',
	data() {
		return {
			QrSrc:'',
			user:{},
			shareId:''
		}
	},
	props: {
		sysSeller:{
			Type:Boolean,
			default:true
		},
		doDraw:{		//监听父组件的指令
			Type:Boolean,
			default:false
		},
		CanvasID:{		//CanvasID 等同于 canvas-id
			Type:String,
			default:'PosterCanvas'
		},
		targetId:{
			Type:String,//分享对象ID
			default:''
		},
		sharePath:{
			Type:String,//分享对象路径页面
			default:''
		},
		sharePolicy:{
			Type:Object,//分享对象路径页面
			default :()=>{
				return {}
			}
		},
		imgSrc:{		//展示图
			Type:String,
			default:''
		},
		pageTitle:{			//页眉
			Type:String,
			default: ''
		},
		Title:{			//文本内容
			Type:String,
			default:''
		},
		TitleColor:{	//标题颜色
			Type:String,
			default:'#333333'
		},
		LineType:{		//标题显示行数		（注超出2行显示会导致画布布局絮乱）
			Type:[String,Boolean],
			default:true
		},
		PriceTxt:{		//价格值
			Type:String,
			default:'99.99'
		},
		PriceColor:{	//价格颜色
			Type:String,
			default:'#e31d1a'
		},
		OriginalTxt:{	//原价值
			Type:String,
			default:'199.99'
		},
		OriginalTxtCut:{
			Type: Boolean,
			default:true
		},
		OriginalColor:{	//默认颜色（如原价与扫描二维码颜色）
			Type:String,
			default:'#b8b8b8'
		},
		Width:{			//画布宽度  (高度根据图片比例计算 单位upx)
			Type:String,
			default:750
		},
		CanvasBg:{		//canvas画布背景色
			Type:String,		
			default:'#ffffff'
		},
		Referrer:{		//推荐人信息
			Type:String,
			default:''
		},
		ViewDetails:{	//描述提示文字
			Type:String,
			default:'长按或扫描识别二维码'
		},
		shareNum:{
			Type:Number,
			default:1
		}
		
	},
	data() {
		return {
			canvasW:0,
			canvasH: 0,
			canvasImgSrc:'',
			ctx:null
		};
	},
	mounted() {
		_this = this;
		this.user = this.zz.getAcc()
	},
	watch:{
		doDraw() {
			if(this.doDraw){
				// console.log('doDraw')
				this.OnCanvas()
			}
		}
	},
	methods: {
		async OnCanvas() {
			uni.showLoading({
				title: '正在生成海报...',
				mask: true
			})
			 //广告图
			let _imgInfo = await _this.getImageInfo({imgSrc: _this.imgSrc}).then(function(r){return r},function(e){return false})
			if(!_imgInfo){return _this.$emit('success',-1)}
			
			//用户头像
			let _Avatar = await _this.getImageInfo({imgSrc: this.user.wxinfo.avatarUrl}).then(function(r){return r},function(e){return false})
			if(!_Avatar){return _this.$emit('success',-1)}
			
			//获取太阳码
			this.QrSrc = await _this.codeImg();
			let _QrCode = await _this.getImageInfo({imgSrc: _this.QrSrc}).then(function(r){return r},function(e){return false})
			if(!_QrCode){return _this.$emit('success',-1)}
			
			_this.ctx = uni.createCanvasContext(_this.CanvasID,this);
			
			const 	C_W = uni.upx2px(_this.Width), //canvas宽度
					C_P = uni.upx2px(30), //canvas Paddng 间距
					C_Q = uni.upx2px(150), //二维码或太阳码宽高
					C_A = uni.upx2px(80); // 用户头像
					
			let _strlineW = 0; //文本宽度
			
			
			let r = [_imgInfo.width, _imgInfo.height];
			let q = [_QrCode.width, _QrCode.height];
			let a = [_Avatar.width, _Avatar.height];
			let imgW = C_W - C_P * 2;
			
			if (r[0] != imgW) {
				r[1] = Math.floor((imgW / r[0]) * r[1]);
				r[0] = imgW;
			}
			if (q[0] != C_Q) {
				q[1] = Math.floor((C_Q / q[0]) * q[1]);
				q[0] = C_Q;
			}
			if (a[0] != C_A) {
				a[1] = Math.floor((C_A / a[0]) * a[1]);
				a[0] = C_A;
			}
			_this.canvasW = C_W;
			_this.canvasH = r[1] + q[1] + 130;
			_this.ctx.setFillStyle(_this.CanvasBg); //canvas背景颜色
			_this.ctx.fillRect(0, 0, C_W, _this.canvasH); //canvas画布大小
			
			let _pth = 0, _h=18
			if(_this.pageTitle!=''){
				//添加页眉
				_this.ctx.setFillStyle(_this.TitleColor);
				_this.ctx.setFontSize(uni.upx2px(25));
				_this.ctx.fillText(_this.pageTitle, C_P, C_P+6, r[0], r[1]);
				//添加页眉 end
				_pth = 16
				_h = 30
			}
			
			//添加图片展示
			_this.ctx.drawImage(_imgInfo.path, C_P, C_P+_pth, r[0], r[1]);
			//添加图片展示 end
			
			//设置文本
			_this.ctx.setFontSize(uni.upx2px(32)); //设置标题字体大小
			_this.ctx.setFillStyle(_this.TitleColor); //设置标题文本颜色
			let _strLastIndex = 0; //每次开始截取的字符串的索引
			let _strHeight = r[1] + C_P * 2 + _h; //绘制字体距离canvas顶部的初始高度
			let _num=1;
			
			for (let i = 0; i < _this.Title.length; i++) {
				_strlineW += _this.ctx.measureText(_this.Title[i]).width;
				if (_strlineW > r[0]) {
					if(_num == 2&&_this.LineType){
						//文字换行数量大于二进行省略号处理
						_this.ctx.fillText(_this.Title.substring(_strLastIndex, i-8)+'...', C_P, _strHeight);
						_strlineW = 0;
						_strLastIndex = i;
						_num++;
						break;
					}else{
						_this.ctx.fillText(_this.Title.substring(_strLastIndex, i), C_P, _strHeight);
						_strlineW = 0;
						_strHeight += 20;
						_strLastIndex = i;
						_num++;
					}
				}else if (i == _this.Title.length - 1) {
					_this.ctx.fillText(_this.Title.substring(_strLastIndex, i + 1), C_P, _strHeight);
					_strlineW = 0;
				}
			}
			//设置文本 end

			//设置价格
			_strlineW = C_P;
			_strHeight += uni.upx2px(50);
			if(_num==1){
				_strHeight += 18;	//单行标题时占位符
			}
			
			if(_this.PriceTxt !=''){	//判断是否有销售价格
				_this.ctx.setFillStyle(_this.PriceColor);
				_this.ctx.setFontSize(uni.upx2px(38));
				_this.ctx.fillText(_this.PriceTxt, _strlineW, _strHeight); //商品价格
				_strlineW += _this.ctx.measureText(_this.PriceTxt).width + uni.upx2px(10);
			}
			if(_this.PriceTxt !='' && _this.OriginalTxt !=''){	//判断是否有销售价格且原价
				_this.ctx.setFillStyle(_this.OriginalColor);
				_this.ctx.setFontSize(uni.upx2px(24));
				_this.ctx.fillText(_this.OriginalTxt, _strlineW, _strHeight); //商品原价
			}
			if(_this.OriginalTxtCut){
				_this.ctx.strokeStyle = _this.OriginalColor;
				_this.ctx.moveTo(_strlineW, _strHeight - uni.upx2px(10)); //起点
				_this.ctx.lineTo(_strlineW + _this.ctx.measureText(_this.OriginalTxt).width, _strHeight - uni.upx2px(10)); //终点
				_this.ctx.stroke();
			}
			//设置价格 end
			

			//添加二维码
			_strHeight += uni.upx2px(18);
			_this.ctx.drawImage(_QrCode.path, r[0] - q[0] + C_P, _strHeight, q[0], q[1]);
			//添加二维码 end
			
			
			//添加推荐人与描述
			_strHeight += uni.upx2px(4);
			_this.ctx.setFillStyle(_this.TitleColor);
			_this.ctx.setFontSize(uni.upx2px(30));
			_this.ctx.fillText(this.user.wxinfo.nickName + " " +_this.Referrer, C_A+C_P+C_P - uni.upx2px(10), _strHeight + q[1] / 2);
			//添加推荐人与描述 end
			
			
			//添加用户头像
			_strHeight += uni.upx2px(26);
			_this.ctx.drawImage(_Avatar.path, C_P, _strHeight, a[0], a[1]);
			//添加用户头像 end
			
			
			_this.ctx.setFillStyle(_this.OriginalColor);
			_this.ctx.setFontSize(uni.upx2px(24));
			_this.ctx.fillText("第【"+this.shareNum+"】位分享者", C_P, _strHeight + q[1] / 2 + 20);
			
			
			//长按或扫描识别二维码
			_strHeight += uni.upx2px(18);
			_this.ctx.setFillStyle(_this.OriginalColor);
			_this.ctx.setFontSize(uni.upx2px(24));
			_this.ctx.fillText(_this.ViewDetails, C_W-128, _strHeight + q[1] / 2 + 28);
			//长按或扫描识别二维码 end
			
			//延迟后渲染至canvas上
			setTimeout(function() {
				_this.ctx.draw(true,(ret)=>{
					_this.getNewImage();
				});
			}, 600);
		},
		async getImageInfo({ imgSrc }) {
			return new Promise((resolve, errs) => {
				uni.getImageInfo({
					src: imgSrc,
					success: function(image) {
						resolve(image);
					},
					fail: (err)=> {
						errs(err)
					}
				});
			});
		},
		getNewImage(){
			uni.canvasToTempFilePath({
				canvasId: _this.CanvasID,
				quality: 1,
				complete: (res) => {
					// console.log(res.tempFilePath);
					_this.$emit('success',res.tempFilePath, _this.shareId)
					setTimeout(function() {
						_this.ctx.clearRect()
					}, 300);
				}
			},this);
		},
		
		// 获取海报的小程序码
		codeImg:async function(){
			await this.zz.request('share',{action:'add',path:this.sharePath,tid:this.targetId,...this.sharePolicy}).then((res)=>{
				_this.shareId = res.id
			})
			
			const token = this.zz.getToken()
			return new Promise((resolve,reject)=>{
				uniCloud.callFunction({
					name: 'mpAPI',
					data: {
						action: 'wxacode',
						token: token,
						app:	'zz',
						page: 'pages/share',
						width: 128,
						shareId: _this.shareId
					}
				}).then((res) => {
					let qrImg = uni.arrayBufferToBase64(res.result.buffer.data)
					const buffer = uni.base64ToArrayBuffer(qrImg)
					//保存本地图片文件路径，也是绘图路径
					let filePath = wx.env.USER_DATA_PATH + '/pictemp_image.jpeg'
					uni.getFileSystemManager().writeFile({
						filePath: filePath,
						data: buffer,
						encoding: 'binary',
						success: res2 => {
	// console.log(filePath)
							resolve(filePath)
						}
					})
				})
			})
		}
		
	}
};
</script>

<style></style>
