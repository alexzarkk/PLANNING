<template>
	<view class="container">
		<cu-custom bgColor="bg-zzblue" :isBack="true">
			<block slot="content">环浙步道</block>
		</cu-custom>
		<view class="tui-page-title">重设密码</view>
		
		<view class="tui-form">
			<view class="tui-view-input">
				<zz-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<text class="cuIcon-mobile"></text>
						<input type="number" maxlength="11" placeholder="请输入手机号" :disabled="id!=''" :value="phone" @input="inputMobile" />
						<view v-if="id==''" class="tui-icon-close" v-show="phone" @tap="clearInput(1)">
							<text class="cuIcon-close"></text>
						</view>
					</view>
				</zz-list-cell>
				
				<view v-show="id==''">
					<zz-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
						<view class="tui-cell-input">
							<text class="cuIcon-roundcheck"></text>
							<input placeholder="请输入验证码" type="number" maxlength="4" @input="inputCode" />
							<view class="tui-btn-send" :class="{ 'tui-gray': isSend}" :hover-class="isSend ? '' : 'tui-opcity'" :hover-stay-time="150" @click="getCode">{{ btnSendText }}</view>
						</view>
					</zz-list-cell>
				</view>
				<view v-show="id!=''">
					<zz-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
						<view class="tui-cell-input">
							<text class="cuIcon-safe"></text>
							<input v-model="password" placeholder="请输入新密码" password type="text" maxlength="12" @input="inputPwd" />
							<view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
								<text class="cuIcon-close"></text>
							</view>
						</view>
					</zz-list-cell>
				</view>
			</view>
			
			<view class="padding-top">
				<view class="padding flex flex-direction">
					<button v-show="id==''" class="cu-btn bg-blue lg" @click="submit" :disabled="disabled">下一步</button>
					<button v-show="id!=''" class="cu-btn bg-blue lg" @click="save" :disabled="veried">提 交</button>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
// import { sys } from '@/common/dict';
var _isMobile = v => { return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(v) }

export default {
	computed: {
		disabled: function() {
			let bool = true;
			if (_isMobile(this.phone) && this.vali.phone && this.code.length==4) {
				bool = false;
			}
			return bool;
		},
		veried: function() {
			let bool = true;
			if (this.id!='' && this.password.length>=6) {
				bool = false;
			}
			return bool;
		}
	},
	data() {
		return {
			// sys: sys,
			phone: '',
			password: '',
			code: '',
			isSend: true,
			btnSendText: '获取验证码',//倒计时格式：(60秒)
			vali: {},
			id:'',
		};
	},
	onLoad() {
		
	},
	methods: {
		getCode(){
			if(this.isSend||this.id!='') return
			const cutDown = (s)=> {
				s--
				if(s>0) {
					this.isSend = true
					this.btnSendText = '获取验证码（'+s+'）'
					setTimeout(()=>{cutDown(s)}, 1000)
				} else {
					this.btnSendText = '获取验证码'
					this.isSend = false
				}
			}
			cutDown(61)
			this.zz.req({
				url: '/admin/comm/captcha',
				veri: false,
				data: { phone: this.phone }
			}).then((res)=>{
				console.log(res.data)
			})
		},
		submit() {
			this.zz.req({
				url: '/admin/comm/repsd',
				veri: false,
				loading: true,
				data: {
					phone: this.phone,
					verifyCode: this.code
				}
			}).then((res)=>{
				if (res.code == 1000) {
					this.id = res.data
				}
			})
		},
		veri(){
			if(_isMobile(this.phone)) {
				this.zz.req({
					table: 'zz',
					url: 'veriReg',
					veri: false,
					data: {
						phone: this.phone
					}
				}).then((res)=>{
					console.log(res)
					this.vali = res.data
					this.isSend = !this.vali.phone
					if(!this.vali.phone) return this.zz.toast('此手机号尚未注册')
				})
			}
		},
		
		inputCode(e) {
			this.code = e.detail.value;
		},
		inputMobile: function(e) {
			this.phone = e.detail.value;
			this.veri()
		},
		inputPwd: function(e) {
			this.password = e.detail.value;
		},
		clearInput(type) {
			if (type == 1) {
				this.phone = '';
			} else if(type==2) {
				this.password = '';
			}
		},
		save(){
			this.zz.req({
				url: '/admin/comm/resetPsd',
				veri: false,
				loading: true,
				data: { id: this.id, password: this.password }
			}).then((res)=>{
				if (res.code == 1000) {
					uni.setStorageSync('user', res.data.user);
					uni.setStorageSync('token', res.data.token);
					uni.reLaunch({
						url: '/pages/index'
					});
				}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	background-color: #ffffff;
	height: 100vh;
	.tui-page-title {
		width: 100%;
		font-size: 48rpx;
		font-weight: bold;
		color: $uni-text-color;
		line-height: 42rpx;
		padding: 110rpx 40rpx 40rpx 40rpx;
		box-sizing: border-box;
	}
	.tui-form {
		padding-top: 32rpx;
		.tui-view-input {
			width: 100%;
			box-sizing: border-box;
			padding: 0 60rpx;
			.tui-cell-input {
				width: 100%;
				display: flex;
				align-items: center;
				padding-top: 20rpx;
				padding-bottom: $uni-spacing-col-base;
				input {
					flex: 1;
					padding-left: $uni-spacing-row-base;
				}
				.tui-icon-close {
					margin-left: auto;
				}
				.tui-btn-send {
					width: 200rpx;
					white-space:nowrap;
					text-align: right;
					flex-shrink: 0;
					font-size: $uni-font-size-base;
					color: $uni-color-primary;
				}
				.tui-gray {
					color: $uni-text-color-placeholder;
				}
			}
		}
		.tui-cell-text {
			width: 100%;
			padding: 40rpx $uni-spacing-row-lg;
			box-sizing: border-box;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
			display: flex;
			align-items: center;
			.tui-color-primary {
				color: $uni-color-primary;
				padding-left: 4rpx;
			}
		}
		.tui-btn-box {
			width: 100%;
			padding: 0 $uni-spacing-row-lg;
			box-sizing: border-box;
			margin-top: 80rpx;
		}
	}
}

	.tui-mask-screen {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 99996;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.tui-mask-show {
		opacity: 1;
		visibility: visible;
	}

	.tui-picker-box {
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99999;
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
		transform-origin: center;
		transition: all 0.3s ease-in-out;
		min-height: 20rpx;
		background: #fff;
	}

	.tui-pickerbox-show {
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}

	.picker-header {
		width: 100%;
		height: 90rpx;
		padding: 0 46rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		font-size: 32rpx;
		background: #fff;
	}

	.tui-list-item::after {
		left: 0;
	}

	.btn-cancle {
		padding: 20rpx;
		color: #888;
	}

	.btn-sure {
		padding: 20rpx;
		color: #5677fc;
	}

	.picker-view {
		width: 100%;
		height: 260px;
	}

	.item {
		line-height: 50px;
		text-align: center;
	}

	/* picker end*/

	.search-box {
		width: 672rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
		margin: 80rpx auto 40rpx auto;
		position: relative;
		/* #ifdef MP-ALIPAY */
		background: #fff;
		/* #endif */
	}

	.search-box::after {
		content: '';
		position: absolute;
		height: 200%;
		width: 200%;
		border: 1rpx solid #dbe1ef;
		transform-origin: 0 0;
		-webkit-transform-origin: 0 0;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		left: 0;
		top: 0;
		border-radius: 20rpx;
		pointer-events: none;
	}


	.s-img {
		width: 34rpx;
		height: 34rpx;
		margin-right: 17rpx;
		flex-shrink: 0;
	}

	.input {
		font-size: 32rpx;
		color: #353535;
		width: 565rpx;
		padding-right: 5rpx;
		box-sizing: border-box;
		height: 100%;
	}

	.text {
		padding: 0 10rpx;
		font-size: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pdr20 {
		padding-right: 20rpx;
	}

	.flr {
		margin-left: auto;
	}

	.btn-select {
		padding: 20rpx 40rpx;
	}
</style>
