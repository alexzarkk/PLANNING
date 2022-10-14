<template name="basics">
<page-meta root-font-size="10px"></page-meta>
    <view>
		<!-- <view class="fixed">
		    <cu-custom :isBack="true" bgColor=" bg-orange">
		        <block slot="content">步道服务</block>
		    </cu-custom>
		</view> -->
        <view class="UCenter-bg">
            <!--用户信息-->
            
        </view>

        <view class="bg-white" style="margin: 20rpx;border-radius: 8rpx;">
            <view class=" flex text-center text-grey" style="padding: 30rpx 0;">
                <view class="flex flex-sub flex-direction" @tap="href('/pages/serve/outdoorTips')">
                    <view class="text-xxl text-purple">
                        <view class="zzIcon-knowledge text-big" style="color: #0477B3;"></view>
                    </view>
                    <view class=" color"> 户外知识 </view>
                </view>
                <view class="flex flex-sub flex-direction " @tap="href('/pages/serve/outdoorSafe')">
                    <view class="text-xxl text-orange">
                        <view class="cuIcon-safe text-big" style="color:#00aaff;  "></view>
                    </view>
                    <view class=" color"> 户外安全 </view>
                </view>
                <view class="flex flex-sub flex-direction " @tap="href('/pages/serve/outdoorSkill')">
                    <view class="text-xxl text-orange">
                        <view class="cuIcon-medal text-big" style="color:#ff5500;"></view>
                    </view>
                    <view class=" color"> 户外技巧 </view>
                </view>
                <view class="flex flex-sub flex-direction" @tap="href('/pages/serve/outdoorEnv')">
                    <view class="text-xxl text-orange">
                        <view class="cuIcon-circle text-big" style="color:#00bd00;"></view>
                    </view>
                    <view class=" color"> 环保指引 </view>
                </view>
            </view>
        </view>

        <view class="bg-white " style="margin: 20rpx; padding: 20rpx; border-radius:8rpx ;">
            <view class="text-df text-gray padding-tb-xs">常用功能</view>

            <view class="cu-list grid col-4 solid-top solid-left solid-right">
                <view class="cu-item" v-for="(e,index) in serve" :key="index" @tap="href(e.url?'/pages/serve/'+e.url:false)">
                    <view :class="e.prefix + e.icon+' text-' + e.color"></view>
                    <text>{{e.name}}</text>
                </view>

            </view>

        </view>

        <view class="padding">
            <tui-button shadow height="88rpx" shape="circle" @tap="href('/pages/serve/errreport',true)">故障上报、服务建议</tui-button>
            <!-- <view class="padding-xs text-center">
                <text class="text-gray text-sm">故障上报、服务建议</text>
            </view> -->
        </view>
		<view></view>
		<view class="tui-btn-back" @click="back">返回</view>
		
        
		<tui-footer :copyright="bd.sys.footer.content" :fixed="true" :navigate="bd.sys.footer.navigate" tui-footer-class="tui-custom"></tui-footer>

    </view>
</template>

<script>
export default {

    data() {
        return {
            user: null,
            bd: this.bd,
            CustomBar: this.CustomBar,
			coord: '',
			sn: '',
			
            serve: [
                {
                    name: '救援求助',
                    icon: 'SOS',
                    url: 'sos',
                    color: 'red',
                    prefix: 'zzIcon-'

                },
                {
                    name: '报备留踪',
                    icon: 'dist',
                    url: 'declare',
                    color: 'orange',
                    very: 1,
                    prefix: 'zzIcon-'
                },
                {
                    name: '天气预报',
                    icon: 'sun',
                    color: 'yellow',
                    url: 'weather',
                    prefix: 'zzIcon-'
                },
                {
                    name: '周边信息',
                    icon: 'around',
                    color: 'blue',
                    // url: 'around',
                    // #ifdef H5-ZLB
                    // url: 'amapAround',
                    // #endif
                    prefix: 'zzIcon-'
                },
                {
                    name: '赛事活动',
                    icon: 'upstage',
                    color: 'ztsblue',
                    // url: 'event',
                    prefix: 'cuIcon-'
                },
                {
                    name: '领队服务',
                    icon: 'tutor',
                    color: 'green',
                    url: 0,
                    prefix: 'zzIcon-'
                },
                {
                    name: '教育培训',
                    icon: 'reward',
                    color: 'pink',
                    url: 0,
                    prefix: 'zzIcon-'
                },
                {
                    name: '更多',
                    icon: 'more',
                    color: 'grey',
                    url: 0,
                    prefix: 'cuIcon-'
                }
            ]
        }
    },

    onLoad({coord, sn} = qr) {
		this.coord = coord
		this.sn = sn
    },
    onShow() {
        this.user = this.zz.getAcc()
    },
    methods: {
        href(url) {
            if (!url) return this.zz.toast('服务尚未启用')
            this.zz.href(url+'?sn=' + (this.sn?this.sn:'') + '&coord=' + (this.coord?this.coord:''))
        },
        back() {
            if (getCurrentPages().length == 1) {
                uni.switchTab({ url: '/pages/index/index' })
            }
            uni.navigateBack()
        }
    }
}
</script>
<style>
page {
    background-color: #f0f0f0;
}

.UCenter-bg {
	/*  奉化溪口 */
    /* background-image: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/9d702f50-9906-11ea-8bd0-2998ac5bbf7e.jpg'); */
	/*  百山祖 */
    background-image: url('https://zts.5618.co/repo/bg/myBG.jpeg');
    background-size: cover;
    height: 360rpx;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    color: #fff;
    font-weight: 300;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

.color {
    color: #333333;
    font-size: 1.4rem;
    margin-top: 16rpx;
}

.new_class {
    height: 100%;
    display: flex;
    align-items: center;
    width: 100%;
}

.new_zyz_hy {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.3);
    justify-content: space-between;
    font-size: 1rem;
    padding: 4rpx 10rpx;
    border-radius: 20rpx;
    margin-right: 20rpx;
}

.UCenter-bg button {
    opacity: 0.8;
}

.UCenter-bg image {
    width: 200rpx;
    height: 200rpx;
}

.UCenter-bg .gif-wave {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 99;
    mix-blend-mode: screen;
    height: 100rpx;
}

.page {
    height: 100vh;
}
.text-big {
    font-size: 60rpx;
}

.nav-list {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 20rpx 0px;
    justify-content: space-between;
}

.nav-li {
    padding: 30rpx;
    border-radius: 12rpx;
    width: 45%;
    margin: 0 2.5% 40rpx;
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 1;
}

.nav-li::after {
    content: '';
    position: absolute;
    z-index: -1;
    background-color: inherit;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: -10%;
    border-radius: 10rpx;
    opacity: 0.2;
    transform: scale(0.9, 0.9);
}

.nav-li.cur {
    color: #fff;
    background: rgb(94, 185, 94);
    box-shadow: 4rpx 4rpx 6rpx rgba(94, 185, 94, 0.4);
}

.nav-title {
    font-size: 1.6rem;
    font-weight: 300;
}

.nav-title::first-letter {
    font-size: 2rem;
    margin-right: 4rpx;
}

.nav-name {
    font-size: 1.4rem;
    text-transform: Capitalize;
    margin-top: 20rpx;
    position: relative;
}

.nav-name::before {
    content: '';
    position: absolute;
    display: block;
    width: 40rpx;
    height: 6rpx;
    background: #fff;
    bottom: 0;
    right: 0;
    opacity: 0.5;
}

.nav-name::after {
    content: '';
    position: absolute;
    display: block;
    width: 100rpx;
    height: 1px;
    background: #fff;
    bottom: 0;
    right: 40rpx;
    opacity: 0.3;
}

.nav-name::first-letter {
    font-weight: bold;
    font-size: 1.8rem;
    margin-right: 1px;
}

.nav-li text {
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    font-size: 52rpx;
    width: 60rpx;
    height: 60rpx;
    text-align: center;
    line-height: 60rpx;
}

.text-light {
    font-weight: 300;
}

@keyframes show {
    0% {
        transform: translateY(-50px);
    }

    60% {
        transform: translateY(40rpx);
    }

    100% {
        transform: translateY(0px);
    }
}

@-webkit-keyframes show {
    0% {
        transform: translateY(-50px);
    }

    60% {
        transform: translateY(40rpx);
    }

    100% {
        transform: translateY(0px);
    }
}

.tui-btn-back {
    width: 88rpx;
    height: 88rpx;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    position: fixed;
    /* top: 20rpx; */
	bottom: 180rpx;
    right: 40rpx;
    z-index: 99999;
}

.cu-list.grid > .cu-item [class*='zzIcon'] {
    position: relative;
    display: block;
    margin-top: 10px;
    width: 100%;
    font-size: 26px;
}
</style>
