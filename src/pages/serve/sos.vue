<template>

    <view>
        <view class="fixed">
            <cu-custom :isBack="true" bgColor=" bg-orange" :home="false">
                <block slot="content">环浙步道-救援求助</block>
            </cu-custom>
        </view>
		
		<zz-kml-nav v-if="coord" :coord="[coord]" class="solid" @addr="addrInfo"></zz-kml-nav>
        <view class="bg-black padding">
            <view class="flex flex-direction align-center">
                <view v-if="pm" class="text-lg">
                    <text class="text-center">
                        当前柱号：{{ pm.sn }}
                    </text>
                </view>
				<view class="text-df margin-top-xs">
				    <text class="text-center" v-if="pm">
				        {{loc.altitude?'海拔：'+(~~loc.altitude)+'m':''}} {{loc.accuracy?'位置精度：'+(~~loc.accuracy)+'m 位柱距：≈'+ qr.dist +'m':''}}
				    </text>
				</view>
            </view>
            <view class="flex flex-direction align-center margin-top">
                <view class="text-lg" v-if="coord">
                    <text class="text-center">
                        经纬度：
						<text class="text-df text-yellow">
							{{'(wgs84) '+coord[0]+','+coord[1]}}
							<text @click="copyLoc" class="padding-left-xs cuIcon-copy text-green"></text>
						</text>
                    </text>
                </view>
				
            </view>
            <block v-if="qr.wather">
                <view class="flex flex-direction align-center margin-top text-sm">
                    <text class="text-center text-ftorange">
                        当前气象：{{qr.wather.weather+' '+ qr.wather.temperature+'° 湿度'+qr.wather.humidity+'% ' + qr.wather.winddirection+'风 '+ qr.wather.windpower+'级'}}
                    </text>
                    <text class="text-center text-gray margin-top-xs">
                        更新时间：{{qr.wather.reporttime}}
                    </text>
                </view>
            </block>
        </view>

        <view class="flex align-center margin-top-xs">

            <!-- #ifdef MP-WEIXIN -->
            <button class="sos flex align-center justify-center" :disabled="send" :type="send?'default':'warn'" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">
                <view class="text-bold text-white">
                    救援求助
                </view>
            </button>
            <!-- #endif -->

            <!-- #ifndef MP-WEIXIN -->
            <button class="sos flex align-center justify-center" :disabled="send" :type="send?'default':'warn'" open-type="getPhoneNumber" @click="show9">
                <view class="text-bold text-white">
                    救援求助
                </view>
            </button>
            <!-- #endif -->

        </view>
        <view class="flex justify-center align-center margin-top-sm padding-top-sm">
            <text class="text-red">如遇紧急情况 按此键</text>
        </view>

        <view class="flex flex-direction justify-center align-center padding-sm">
            <text class="text-orange">按键后将发送</text>
            <text class="margin-top-xs text-orange">位置坐标和手机号给步道管理员</text>
            <text class="margin-top-xs text-orange">期间请保持手机畅通</text>
        </view>
        <view class="flex flex-direction justify-center align-center margin-top-xs" v-if="qr.dist>200">
            <text class="text-white">您的实际位置和步道柱位置超过200m</text>
            <text class="margin-top-xs text-white">请确认您是在柱子附近</text>
        </view>

        <view class="cu-bar bg-white tabbar border foot shop" @click="nCALL">
            <view class="bg-orange submit">拨打【110】报警电话</view>
        </view>

        <tui-modal :show="modal9" @cancel="hide9" :custom="true" fadeIn>
            <view class="tui-modal-custom">
                <view class="tui-prompt-title">手机</view>
                <input type="number" placeholder="请输入手机号" maxlength="11" class="tui-modal-input" :class="{'tui-hidden-input':!modal9}" v-model="mobile" @blur="checkMobile" />
                <text class="text-red text-sm">{{mobileTip}}</text>
                <view class="flex flex-direction align-center margin-top-sm text-grey" v-if="pm">
                    <view class="flex flex-direction align-center">
                        <view class="text-df">
                            <text class="text-center">
                                当前柱号：{{ pm.sn }}
                            </text>
                        </view>
                    </view>
                    <view class="text-df margin-top-xs">
                        <text class="text-center">
                            {{loc.altitude?'海拔：'+(~~loc.altitude)+'m':''}} {{loc.accuracy?'位置精度：'+(~~loc.accuracy)+'m 位柱距：≈'+ qr.dist +'m':''}}
                        </text>
                    </view>
                </view>
                <tui-divider></tui-divider>

                <text class="text-grey">救援功能尚未正式启用，现为演示测试</text>

                <view class="flex justify-center padding-bottom">
                    <tui-checkbox @change="allowProtocol"></tui-checkbox>
                    <text class="margin-left-xs text-sm">阅读并同意</text>
                    <navigator url="/pages/my/protocol/protocol" class="text-blue">《救援求助条款》</navigator>
                </view>
                <view class="flex">
                    <tui-button :plain="true" height="72rpx" :size="28" @click="hide9">取消</tui-button>
                    <text class="padding-lr-sm"></text>
                    <tui-button :type="'danger'" height="72rpx" :plain="disabled" :size="28" :disabled="disabled" @click="sendSos">立即发送</tui-button>
                </view>
            </view>
        </tui-modal>

    </view>
</template>

<script>
var _isMobile = v => { return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(v) }
import { getLocation, trans, dist } from "@/comm/geotools.js"

export default {
    data() {
        return {
            modal9: false,
            isAllow: false,
            mobileTip: '',

            liveData: {},
            addr: {},
            qr: { dist: 0 },
			
			pm: null,
			coord: null,
			
            desc: "",
            mobile: null,
            loc: null,
            send: false,
        }
    },
    computed: {
        disabled: function () {
            let bool = true;
            if (this.mobile && _isMobile(this.mobile) && this.isAllow) {
                bool = false;
            }
            return bool;
        }
    },
    async onLoad(qr) {
		Object.assign(this.qr, qr)
		
		let { coord, p } = await getLocation()
		this.loc = p
		
		if(qr.coord) {
			let c = qr.coord.split(',')
			this.coord = [c[0]*1,c[1]*1]
		}
        if (qr.sn) {
            this.pm = await this.zz.req({ $url: '/public/zz/scan', sn: qr.sn })
			this.coord = this.pm.coord
        } 
		if(!this.coord) {
			this.coord = coord
		}
		this.qr.dist = dist(this.coord, coord)
    },
    onUnload() { clearInterval(this.timer) },

    methods: {
		addrInfo(e){ 
			this.qr.addr = e.formatted_address
			this.zz.weatherInfo(e.addressComponent.adcode,'').then(e => {
				if (e.info == 'OK') {
					this.qr.wather = e.lives[0]
				}
			})
		},
		copyLoc() {
		    uni.setClipboardData({
		        data: JSON.stringify(this.coord),
				showToast:true,
		        success: ()=>{
					this.zz.toast('复制成功~')
		        }
		    })
		},
		
        show9() { this.modal9 = true },
        hide9() { this.modal9 = false },
        checkMobile() { this.mobileTip = (!this.mobile || (this.mobile && _isMobile(this.mobile))) ? '' : '手机号输入有误' },
        allowProtocol(e) { this.isAllow = e.checked },
        nCALL(n) {
            uni.makePhoneCall({
                phoneNumber: '110',
                success: (res) => { },
                fail: (err) => { }
            })
        },
        sendSos() {
            this.hide9()
            this.zz.modal('功能尚未正式启用！')
        },
        async submit() {
            uni.showLoading({ mask: true })
			
			
            if (this.mobile) {
                let formData = {
                    obj: this.qr,
                    loc: this.loc,
                    liveData: this.liveData,
                    mobile: this.mobile
                }
                // return console.log(formData)
                await this.zz.req({ $url: 'bd', data: { table: 'message', action: 'sos', args: { obj: formData } } }).then((res) => {
                    if (res.data == 911) {
                        this.send = true
                        this.zz.modal('求助信息已发送！')
                        // uni.offLocationChange((e)=>{console.log('offLocationChange', e)})
                    }
                })
                clearInterval(this.timer)
            } else {
                this.zz.toast("网络故障或定位失败，请重试~")
            }
            uni.hideLoading()
        },
		
    }
}
</script>

<style>
page {
    background-color: #333333;
}
.sos {
    background-color: rgba(255, 55, 55, 0.98);
    border-radius: 50%;
    border: none;
    width: 160px;
    height: 160px;
    padding: 6px 0;
    font-size: 32px;
}

.tui-modal-custom {
    text-align: center;
}

.tui-tips-img {
    width: 80rpx;
    height: 80rpx;
    margin-top: 20rpx;
}

.tui-modal-custom-text {
    font-size: 30rpx;
    color: #333;
    padding: 30rpx 0 50rpx;
}

.tui-prompt-title {
    padding-bottom: 20rpx;
    font-size: 34rpx;
}
.tui-modal-input {
    width: 80%;
    height: 100%;
    border-bottom: 1rpx solid #e6e6e6;
    margin: 30rpx auto 50rpx;
    padding-bottom: 20rpx;
    font-size: 32rpx;
}
.tui-hidden-input {
    /* #ifdef MP-WEIXIN */
    width: 0;
    /* #endif */
}
</style>
