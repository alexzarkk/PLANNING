<template>
    <view>
        <cu-custom bgColor="bg-orange" :isBack="true" >
            <block slot="content">报备留踪</block>
        </cu-custom>

        <view class="cu-modal" :class="show ? 'show' : ''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-end">
                    <view class="content text-bold">服务协议</view>
                </view>

                <scroll-view scroll-y class="scrollView bg-gray" :style="{height:(winH-cuBar-48*3) +'rpx'}">
                    <view class=" text-lg text-left  pre-line padding-sm">
                        <text class="text-black text-bold ">本人认可并同意使用本服务时，需要提供本人的行程计划、有效联系方式和本人当前的位置信息（手机GPS）。</text>
                    </view>
                    <block v-for="(e,i) in privacy" :key="i">
                        <view class="text-lg text-left pre-line padding-lr-sm">
                            <text class="text-black text-bold">{{e.k}}</text>
                        </view>
                        <view class="solid-bottom text-df text-left pre-line padding-sm">
                            <text class="text-black">{{e.v}}</text>
                        </view>
                    </block>
                    <view class="solid-bottom text-left pre-line padding-sm">
                        <text class="text-dark">本服务由【{{bd.sys.name}}】提供，【{{bd.sys.admin}}】负责技术运营。</text>
                    </view>
                </scroll-view>

                <view class="cu-bar bg-white justify-between">
                    <view class="action">
                        <button class="cu-btn bg-grey shadow round" @tap="cancel">
                            <text class="cuIcon-close margin-right-xs"></text>
                            取消</button>
                    </view>
                    <view class="action">
                        <button class="cu-btn bg-blue shadow round" @tap="agree">
                            <text class="cuIcon-check margin-right-xs"></text>
                            知晓并同意
                        </button>
                    </view>
                </view>
            </view>
        </view>
        <block v-if="!show">
			<!-- <zz-kml-nav v-if="coord" :coord="[coord]" class="solid" @addr="addrInfo"></zz-kml-nav> -->
            <view class="padding bg-orange light solid-bottom">
                <view class="flex flex-direction align-center">
                    <view v-if="pm" class="text-lg">
                        <text class="text-center">
                            当前柱号：{{ pm.sn }}
                        </text>
                    </view>
                </view>
                <view class="flex flex-direction align-center margin-top-sm">
                    <view class="text-lg">
                        <text class="text-center">
                            当前位置：
                            <block v-if="loc">
								<text class="text-df text-blue">
									{{'(wgs84) '+coord[0]+','+coord[1]}}
									<text @click="copyLoc" class="padding-left-xs cuIcon-copy text-green"></text>
								</text>
                                <!-- {{'('+(loc.type||'wgs84')+')'+loc.longitude + (loc.longitude>0?'E':'W')+',' + loc.latitude + (loc.latitude>0?'N':'S')}} -->
                            </block>
                            <block v-else>
                                请开启位置授权！
                            </block>
                        </text>
                    </view>
                </view>
                <view class="flex flex-direction align-center margin-top-sm">
                    <view class="">
                        <text class="text-center">
                            地址(参考)：
							<text @click="openLocation" class="text-sm text-blue text-underline">{{qr.addr}}</text>
                            <!-- 地址(参考)：奉化区溪口镇栖霞坑村 -->
                        </text>
                    </view>
                </view>
                <block v-if="qr.wather">
                    <view class="flex flex-direction align-center margin-top text-sm">
                        <text class="text-center text-ftorange">
                            当前气象：
							<text class="text-sm text-blue text-underline">
								{{qr.wather.weather+' '+ qr.wather.temperature+'° 湿度'+qr.wather.humidity+'% ' + qr.wather.winddirection+'风 '+ qr.wather.windpower+'级'}}
							</text>
							
                        </text>
                        <text class="text-center text-gray margin-top-xs">
                            更新时间：{{qr.wather.reporttime}}
                        </text>
                    </view>
                </block>
            </view>
            <tui-list-cell :hover="false" padding="0">
                <view class="tui-line-cell">
                    <text class="text-red margin-right-xs">*</text>
                    <view class="tui-title solid-right">手机号</view>
                    <input placeholder-class="tui-phcolor" type="number" v-model="form.mobile" placeholder="必填" maxlength="11" />
                    <!-- <block v-if="form.mobile==''">
						<button style="width: 220upx;" class="cu-btn line-dark" type="default" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">获取手机号</button>
					</block> -->
                </view>
            </tui-list-cell>
            <tui-list-cell :hover="false" padding="0">
                <view class="tui-line-cell">
                    <text class="text-red margin-right-xs">*</text>
                    <view class="tui-title solid-right">同行人数</view>
                    <input placeholder-class="tui-phcolor" type="number" v-model="form.num" class="itext" placeholder="必填 若没有填0" maxlength="3" />
                </view>
            </tui-list-cell>
            <tui-list-cell :hover="false" padding="0">
                <view class="tui-line-cell">
                    <text class="text-red margin-right-xs">*</text>
                    <view class="tui-title solid-right">紧急联系人</view>
                    <input placeholder-class="tui-phcolor" v-model="form.urgentPerson" class="itext" placeholder="请勿填写随行人为紧急联系人" maxlength="6" />
                </view>
            </tui-list-cell>
            <tui-list-cell :hover="false" padding="0">
                <view class="tui-line-cell">
                    <text class="text-red margin-right-xs">*</text>
                    <view class="tui-title solid-right">紧急联系电话</view>
                    <input placeholder-class="tui-phcolor" type="number" v-model="form.urgentCall" class="itext" placeholder="必填" maxlength="11" />
                </view>
            </tui-list-cell>
            <tui-list-cell :hover="false" padding="0">
                <view class="tui-line-cell">
                    <view class="tui-title solid-right">行程途径地</view>
                    <input placeholder-class="tui-phcolor" v-model="form.onPlace" class="itext" placeholder="如 大雷山/栖霞坑..." maxlength="20" />
                </view>
            </tui-list-cell>
            <tui-list-cell :hover="false" padding="0">
                <view class="tui-line-cell">
                    <view class="tui-title solid-right">行程终点</view>
                    <input placeholder-class="tui-phcolor" v-model="form.endPlace" class="itext" placeholder="如 大雷山/栖霞坑..." maxlength="20" />
                </view>
            </tui-list-cell>
            <tui-list-cell :hover="false" padding="0">
                <view class="tui-line-cell">
                    <view class="tui-title solid-right">对讲机频率</view>
                    <input placeholder-class="tui-phcolor" type="digit" v-model="form.channel" class="itext" placeholder="如有 请填写" maxlength="11" />
                </view>
            </tui-list-cell>
            <tui-list-cell :hover="false" padding="0">
                <view class="tui-line-cell">
                    <text class="text-red margin-right-xs">*</text>
                    <view class="tui-title solid-right">出发时间</view>
                    <input placeholder-class="tui-phcolor" disabled v-model="form.startTime" class="itext" @tap="pickDate('startTime')" />
                </view>
            </tui-list-cell>
            <tui-list-cell :hover="false" padding="0">
                <view class="tui-line-cell">
                    <text class="text-red margin-right-xs">*</text>
                    <view class="tui-title solid-right">预计返回时间</view>
                    <input placeholder-class="tui-phcolor" disabled v-model="form.endTime" class="itext" placeholder="请选择..." @tap="pickDate('endTime')" />
                </view>
            </tui-list-cell>

            <view class="cu-tabbar-height"></view>

            <block>
                <view v-show="dateType==''" class="cu-bar bg-white tabbar border foot shop" @tap="submit">
                    <view class="bg-green submit">
                        <text class="cuIcon-check margin-right-xs"></text>
                        提交报备
                    </view>
                </view>
            </block>

        </block>
        <tui-datetime ref="dateTime" :setDateTime="form.startTime" :radius="true" @confirm="change"></tui-datetime>
		<!-- 确认框 -->
        <view class="cu-modal" :class="modalName == 'tips' ? 'show' : ''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">提示</view>
                    <view class="action" @tap="modalName = ''"><text class="cuIcon-close text-red"></text></view>
                </view>
                <view class="padding-xl bg-white">本功能仅为演示，暂未启用。</view>
                <view class="cu-bar bg-white solid-top">
                    <view class="action margin-0 flex-sub  solid-left text-green" @tap="modalName = ''">确定</view>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
import { getLocation, trans, dist } from "@/comm/geotools.js"
// const amap = require('@/comm/libs/amap-wx.js')
// const form = require("@/common/tui-validation.js")

export default {
    data() {
        return {
			modalName:'',
            bd: this.bd,
            winH: this.WinHeight,
            cuBar: this.CustomBar,
            show: true,

            qr: { addr: '？', dist: 0 },
			pm: null,
            desc: '',
            loc: null,
            dateType: '',

            form: {
                mobile: '',
                num: '',
                urgentPerson: '',
                urgentCall: '',
                onPlace: '',
                endPlace: '',
                channel: '',

                startTime: this.zz.time2Date(),
                endTime: ''
            },

            privacy: [
                {
                    k: '报备目的',
                    v: '户外运动由于受户外复杂环境和气候的影响，存在一定的风险性。报备您的行程在您出现紧急情况时可以让救援人员更快速的向您提供帮助。'
                },
                {
                    k: '服务流程',
                    v: '当您完成报备后，本软件会自动记录并激活您的报备服务，并向您发送报备成功的短信（包含确认网址）。 当您完成本次行程/活动后，您需要打开短信中的确认网址进行安全返回确认，完成操作后本次报备服务也即结束。（若超出预计返回时间12小时以上，将会触发预警程序）'
                },
                {
                    k: '数据存储',
                    v: '您的报备信息会加密后暂存于我们的服务器，当您完成行程后，数据将会在一周后自动删除。'
                },
                {
                    k: '免责声明',
                    v: '因网络故障或计算机病毒或黑客侵入等情况，可能造成您的报备泄露、丢失、或被篡改，导致您的报备服务无法正常运行或造成其他损失，本软件不承担相应责任。'
                }
            ]
        }
    },
	async onLoad(qr) {
		Object.assign(this.qr, qr)
		this.user = this.zz.getAcc();
		this.form.mobile = this.user.phone || ''
		
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
		
		this.addrInfo()
	},
    onUnload() { clearInterval(this.timer) },
    methods: {
        agree() {
            this.show = false
			this.modalName = 'tips'
            // this.locInfo('by agree')
        },
		async addrInfo(){
			let coord = trans(this.coord),
				e = await this.zz.reGeo(coord)
			this.qr.addr = e.formatted_address
			this.zz.weatherInfo(e.addressComponent.adcode,'').then(e => {
				if (e.info == 'OK') {
					this.qr.wather = e.lives[0]
				}
			})
		},
		openLocation() {
			let coord = trans(this.coord)
			uni.openLocation({
				longitude: coord[0],
				latitude: coord[1],
				name: this.qr.addr,
				// address: e.addr
			})
		},
		
		
		
        
        
        
        
        
        
        pickDate(e) {
            this.dateType = e
            this.$refs.dateTime.show();
        },
        change(e) {
            this.form[this.dateType] = e.result
            this.dateType = ''
        },
		
        async submit() {
            return this.zz.toast('服务尚未启用')

            if (!this.loc || !this.loc.longitude) {
                return this.popup = 'show'
            }
            let rules = [
                {
                    name: "mobile",
                    rule: ["required", "isMobile"],
                    msg: ["请填写手机号", "请填写正确的手机号"]
                },
                {
                    name: "num",
                    rule: ["required", "isNum"],
                    msg: ["请填写同行人数", "同行人数必须为数字"]
                },
                {
                    name: "urgentPerson",
                    rule: ["required"],
                    msg: ["请填写紧急联系人"]
                },
                {
                    name: "urgentCall",
                    rule: ["required", "isMobile"],
                    msg: ["请填写紧急联系人手机", "紧急联系人手机号有误"]
                },
                {
                    name: "endTime",
                    rule: ["required"],
                    msg: ["请填写返回时间"]
                }
            ]
            let formData = {
                ...this.form,
                userLoc: [this.loc.longitude, this.loc.latitude, this.loc.altitude],
                user: this.user.name,
                liveData: this.liveData,
                qr: this.qr
            }
            let checkRes = form.validation(formData, rules)
            if (!checkRes) {
                if (this.zz.date2Time(formData.endTime) < this.zz.date2Time(formData.startTime)) return this.zz.toast('返回时间不能早于出发时间！')
                this.zz.request('serve', { action: 'eventDeclare', obj: formData }, false, true).then(res => {
                    if (res.status == 0) {
                        clearInterval(this.timer)
                        this.zz.modal('报备成功！请留意短信并在您行程结束后进行安全返回确认（若超出预计返回时间12小时以上，将会触发预警程序）', () => {
                            uni.redirectTo({ url: '/pages/planning/serve' + this.zz.o2u(this.qr) })
                        })
                    }
                })
            } else {
                this.zz.toast(checkRes)
            }
        },

        cancel() {
            uni.navigateBack()
        }
    }
}
</script>

<style>
.scrollView {
    width: 100%;
    z-index: 999;
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
    font-size: 26rpx;
}
.itext {
    border-left: 1rpx solid #f3f3f3;
    width: 440rpx;
}
.tui-phcolor {
    color: #c8c8c8;
    font-size: 26rpx;
}
</style>
