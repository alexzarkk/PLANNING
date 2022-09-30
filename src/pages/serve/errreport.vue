<template>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">反馈建议</block>
		</cu-custom>
			<view class="cu-bar bg-grey light solid-bottom flex justify-between">
				<view class="action">
					<text class="cuIcon-info"></text> {{info}}
				</view>
			</view>
			<view class="cu-bar bg-grey light solid-bottom flex justify-between">
				<view class="action">
					<text class="cuIcon-info"></text> 坐标位置：{{qr.loc}}
				</view>
				<view class="action">
					<view class="text-orange text-sm" @tap="goLocation">
						<button class="cu-btn round bg-orange shadow sm">
							<text class="cuIcon-forward margin-right-xs"></text>
							地图
						</button>
					</view>
				</view>
			</view>
			
			<view class="padding-lr margin-top-sm">
				<view class="title"><text class="text-red margin-right-xs">*</text>问题描述</view>
				<view class="tui-cells">
					<textarea class="tui-textarea" placeholder="请输入反馈信息，如 路面塌方/标牌损坏/掉漆/倒伏... 安全隐患..."
					maxlength="300" placeholder-class="phcolor" v-model="desc"/>
					<view class="textarea-counter">{{descNum}}/300</view>
				</view>
			</view>
			
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">联系手机</view>
					<input placeholder-class="tui-phcolor" type="number" v-model="mobile" class="tui-input-sj" name="mobile" placeholder="方便我们和您联系" maxlength="11"/>
					<block v-if="mobile==''">
					<button style="width: 240upx;" class="cu-btn line-dark" type="default" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">获取手机号</button>
					</block>
				</view>
			</tui-list-cell>
			
			<view class="cu-bar bg-white" >
				<view class="action">
					现场照片
				</view>
				<view class="action">
					{{imgList.length}}/12
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					 <image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<12">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			
			<view class="padding-lr">
				<view class="tui-ptop">
					 <tui-button shadow height="88rpx" shape="circle" @click="submit">提 交</tui-button>
				</view>
			</view>
			
			<zz-loc :popup.sync="popup" :locAuth.sync="locAuth"></zz-loc>
			
	</view>
</template>
<script>
	import { trans } from "@/comm/geotools.js"
	const form = require("@/comm/validation.js")
	export default {
		computed:{
			descNum:function(){
				return this.desc.length
			}
		},
		data() {
			return {
				bd: this.bd,
				locAuth:0,
				popup:'',
				qr:{},
				info:'',
				loc:null,
				
				mobileReq:{action:'getWXMobile'},
				imgList: [],
				pics:[],
				desc: '',
				mobile: ''
	
			};
		},
		watch:{
			locAuth(v){
				if (v==1) {
					this.locInfo('by auth')
				}
			}
		},
		async onLoad(qr) {
			this.qr = Object.assign(qr,this.qr)
			
			let t = '主线'
			if(qr.tar=='f') t = '辅线'
			if(qr.tar=='y') t = '大堰【一路上】步道' 
			this.info = '当前柱号：'+ t + qr.sn
			
			this.user = this.zz.getAcc();
			this.mobile = this.user.tel || ''
			console.log(this.user)
			this.locInfo('by onLoad')
			this.getMobile()
		},
		onUnload() { clearInterval(this.timer) },
		methods: {
			async locInfo(m){
				console.log('locInfo ...',m)
				if(this.onLoc) return
				this.onLoc = true
				try{
					const [_,e] = await uni.getLocation({ altitude:true, isHighAccuracy:true})
					this.located(e)
				}catch(e){
					console.log('getLocation.err:',e)
				}
				this.onLoc = false
				if(!this.timer) {
					this.timer = setInterval(() => {
						this.locInfo('by timer')
					}, 10000);
				}
			},
			async located(e){
				console.log('located',e)
				if(e&&(!this.loc||getDist(this.loc.longitude,this.loc.latitude, e.longitude,e.latitude)>20)) {
					this.loc = e
					let addr = await this.zz.reGeo(trans([e.longitude, e.latitude])),
						ll = this.qr.loc.split(',')
					
					this.qr.addr = addr.formatted_address
					this.qr.dist = getDist(Number(ll[0]),Number(ll[1]),e.longitude, e.latitude)
				}
			},
			goLocation(){
				let ll = trans(this.qr.loc)
				uni.openLocation({
					longitude: ll[0],
					latitude: ll[1],
					name: this.info
				})
			},
			submit(){
				if(!this.loc) {
					this.popup = 'show'
					return this.zz.toast('请授权您的位置信息！')
				}
				let rules = [{
					name: "desc",
					rule: ["required", "minLength:5", "maxLength:300"],
					msg: ["请输入问题描述", "问题描述必须5个或以上字符", "问题描述不能超过300个字符"]
				}, {
					name: "mobile",
					rule: ["isMobile"],
					msg: ["请输入正确的手机号"]
				}];
				let formData = {
					...this.qr,
					userLoc: [this.loc.longitude, this.loc.latitude, this.loc.altitude],
					mobile:	this.mobile,
					desc: this.desc,
					user: this.user.name
				}
				let checkRes = form.validation(formData, rules)
				if (!checkRes) {
					if(!this.imgList.length) return this.zz.toast('请上传现场照片')
					this.zz.request('feedback',{action:'feedbackfromBD',obj:formData},false,true).then(res=>{
						if(res.status==0) {
							this.id = res.id
							clearInterval(this.timer)
							this.upload()
						}
					})
				} else {
					this.zz.toast(checkRes)
				}
			},
			_ask(){
				uni.hideLoading()
				this.zz.modal('您的反馈已提交成功，感谢您的关心和支持', ()=>{
					uni.redirectTo({
						url:'/pages/planning/serve' + this.zz.o2u(this.qr)
					})
				})
				
				return
				this.zz.modal('您的反馈已提交成功，是否接收回复信息？',(e)=>{
					if(e){
						let tp = this.bd.sys.msgTemplate
						uni.requestSubscribeMessage({
							tmplIds: [tp.reply],
							complete:(res)=>{
								this.zz.href('/pages/index')
							}
						})
					}else{
						this.zz.href('/pages/index')
					}
				},true)
			},
			
			ChooseImage() {
				uni.chooseImage({
					count: 12, //默认9
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				})
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			upload: async function() {
				let file = this.imgList
				uni.showLoading({ title: '照片上传中...', mask: false });
				for (var i = 0; i < file.length; i++) {
					const result = await uniCloud.uploadFile({
											filePath: file[i],
											cloudPath: 'feedback_'+this.id+'-'+(i+1)+'.jpg',
											onUploadProgress: function(progressEvent) {
												  // console.log(progressEvent);
												  var percentCompleted = Math.round(
													(progressEvent.loaded * 100) / progressEvent.total
												  );
											}
										})
					this.pics.push(result.fileID)
				}
				uni.hideLoading();
console.log("clouadpath ------------------>", this.pics)
				this.update()
			},
			update(){
				this.zz.request('feedback',{action:'setPics',id:this.id,pics:this.pics},false,true).then(res=>{
					if(res.status==0) {
						this._ask()
					}
				})
			},
			
			async decryptPhoneNumber(e) {
				if(e.detail.errMsg=="getPhoneNumber:fail user deny"){       //用户决绝授权  
					
					//拒绝授权后弹出一些提示  
				}else{      //允许授权  
					let code = await this.getCode()
					this.mobileReq = {action:'getWXMobile', encryptedData: e.detail.encryptedData, iv:e.detail.iv, code}
					this.mobile = await this.getMobile()
				}  
			},
			getCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success(e) {
							if (e.code) {
								resolve(e.code)
							} else {
								reject(new Error('微信登录失败'))
							}
						},
						fail(e) {
							reject(new Error('微信登录失败'))
						}
					})
				})
			},
			getMobile(){
				return new Promise((resolve, reject) => {
					uniCloud.callFunction({
						name: 'login',
						data: this.mobileReq,
						success(e) {
							console.log(e)
							resolve(e.result.data)
						},
						fail(res) {
							uni.hideLoading()
							console.log(res)
							reject(new Error('手机号解码失败'))
						}
					})
				})
			},
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
	.title {
	  font-size: 30rpx;
	  color: #666;
	  padding-bottom: 26rpx;
	}
	
	.tui-cells {
	  border: 1rpx solid #e6e6e6;
	  border-radius: 4rpx;
	  height: 280rpx;
	  box-sizing: border-box;
	  padding: 20rpx 20rpx 0 20rpx;
	}
	
	.tui-textarea {
	  height: 210rpx;
	  width: 100%;
	  color: #666;
	  font-size: 28rpx;
	}
	
	
	.textarea-counter {
	  font-size: 24rpx;
	  color: #999;
	  text-align: right;
	  height: 40rpx;
	  line-height: 40rpx;
	  padding-top: 4rpx;
	}
	
	.top64 {
	  margin-top: 64rpx;
	}
	
	
	.tui-ptop{
		padding-top: 80rpx;
	}
	
	
	
	
	
	
	
	
	.tui-line-cell {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}
	.tui-title {
		width: 180rpx;
		font-size: 28rpx;
	}
	.tui-input-sj {
		width: 440rpx;
	}
	.tui-phcolor {
		color: #c8c8c8;
		font-size: 28rpx;
	}
	
</style>
