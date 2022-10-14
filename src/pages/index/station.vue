<template>
    <page-meta root-font-size="10px"></page-meta>
    <view>
        <!-- <cu-custom bgColor="bg-ftblue" :home="false">
			<block slot="backText"></block>
			<block slot="content">驿站</block>
		</cu-custom> -->
        <!-- <view class="fixed"> -->
        <zz-kml-map v-if="kml" :scale="9" :winH="mapHt" :tag="''" :kml="kml" @kmlMap="kmlMap"></zz-kml-map>
        <!-- </view> -->

        <view id="t1" class="sticky-box bg-cyan margin-top fixed" :style="[{ top: customBar + 'px' }]">
            <scroll-view scroll-x class="bg-blue light nav text-center">
                <view class="cu-item" :class="index == tabCur ? 'text-blue cur text-bold' : ''" v-for="(item, index) in tabs" :key="index" @click="tabSelect({ detail: { current: index } })">
                    {{ item }}
                </view>
            </scroll-view>
        </view>

        <swiper :current="tabCur" :style="'height:calc(100vh)'" :duration="300" @change="tabSelect">
            <swiper-item v-for="(tab, idx) in tabs" :key="idx">
                <scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height: calc(100vh - 465rpx)" :scroll-top="top" @scroll="thisRoll">
                    <block v-if="idx == 0 && tabCur == 0">
                        <view id="tab0">
                            <tui-divider :gradual="true" :height="60" :gradualColor="gradualColor">农特产商城</tui-divider>
                            <banner-list :list="banner"></banner-list>
                            <tui-nomore v-if="!loading"></tui-nomore>
                        </view>
                    </block>

                    <block v-if="idx == 1 && tabCur == 1">
                        <tui-divider :gradual="true" :height="60" :gradualColor="gradualColor">风土人情</tui-divider>
                        <block v-if="data[tabCur].list" v-for="(item, idx) in data[tabCur].list" :key="idx">
                            <view class="cu-card article no-card shadow-blur">
                                <view class="cu-item shadow">
                                    <view class="title">
                                        <view class="text-cut">{{ item.title }}</view>
                                    </view>
                                    <view class="content">
                                        <image :src="item.cover.url" mode="aspectFill" @tap="detail(item._id)"></image>
                                        <view class="desc">
                                            <view class="text-content cell-title" @tap="detail(item._id)">
                                                {{ item.desc }}
                                            </view>
                                            <view class="text-gray text-sm flex justify-between align-center">
                                                <text class="">{{ item.cdate }}</text>

                                                <view class="flex justify-end align-center">
                                                    <view>
                                                        <text class="cuIcon-attention margin-right-xs"></text>
                                                        <text class="text-sm text-gray">{{ item.view }}</text>
                                                    </view>
                                                    <view @tap="userEvent(30, 10, item)">
                                                        <text class="cuIcon-appreciatefill margin-lr-xs" :class="item.isLike ? 'text-red' : ''"></text>
                                                        <text class="text-sm text-gray">{{ item.like }}</text>
                                                    </view>
                                                    <view @tap="userEvent(40, 10, item)">
                                                        <text class="cuIcon-favorfill margin-lr-xs" :class="item.isFavor ? 'text-red' : ''"></text>
                                                        <text class="text-sm text-gray">{{ item.favor }}</text>
                                                    </view>

                                                    <view>
                                                        <button open-type="share" class="cu-btn xs bg-white" :data-id="item._id" :data-title="item.title">
                                                            <text class="cuIcon-share"></text>
                                                            <text class="text-sm text-green"></text>
                                                        </button>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </block>
                        <tui-nomore v-if="!loading"></tui-nomore>
                    </block>

                    <block v-if="idx == 2 && tabCur == 2">
                        <tui-divider :gradual="true" :height="60" :gradualColor="gradualColor">网红民宿</tui-divider>
                        <card-bgimg :list="data[tabCur].list"></card-bgimg>
                        <tui-nomore v-if="!loading"></tui-nomore>
                    </block>

                    <block v-if="idx == 3 && tabCur == 3">
                        <tui-divider :gradual="true" :height="60" :gradualColor="gradualColor">美食/农家乐</tui-divider>
                        <block v-if="data[tabCur].list" v-for="(item, idx) in data[tabCur].list" :key="idx">
                            <view class="cu-card article no-card shadow-blur">
                                <view class="cu-item shadow">
                                    <view class="title">
                                        <view class="text-cut">{{ item.title }}</view>
                                    </view>
                                    <view class="content">
                                        <image :src="item.cover.url" mode="aspectFill" @tap="detail(item._id)"></image>
                                        <view class="desc">
                                            <view class="text-content cell-title" @tap="detail(item._id)">
                                                {{ item.desc }}
                                            </view>
                                            <view class="text-gray text-sm flex justify-between align-center">
                                                <text class="">{{ item.cdate }}</text>

                                                <view class="flex justify-end align-center">
                                                    <view>
                                                        <text class="cuIcon-attention margin-right-xs"></text>
                                                        <text class="text-sm text-gray">{{ item.view }}</text>
                                                    </view>
                                                    <view @tap="userEvent(30, 10, item)">
                                                        <text class="cuIcon-appreciatefill margin-lr-xs" :class="item.isLike ? 'text-red' : ''"></text>
                                                        <text class="text-sm text-gray">{{ item.like }}</text>
                                                    </view>
                                                    <view @tap="userEvent(40, 10, item)">
                                                        <text class="cuIcon-favorfill margin-lr-xs" :class="item.isFavor ? 'text-red' : ''"></text>
                                                        <text class="text-sm text-gray">{{ item.favor }}</text>
                                                    </view>

                                                    <view>
                                                        <button open-type="share" class="cu-btn xs bg-white" :data-id="item._id" :data-title="item.title">
                                                            <text class="cuIcon-share"></text>
                                                            <text class="text-sm text-green"></text>
                                                        </button>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </block>
                        <tui-nomore v-if="!loading"></tui-nomore>
                    </block>

                    <block v-if="idx == 4 && tabCur == 4">
                        <tui-divider :gradual="true" :height="60" :gradualColor="gradualColor">网红打卡点</tui-divider>
                        <block v-if="data[tabCur].list" v-for="(item, idx) in data[tabCur].list" :key="idx">
                            <view class="product-list">
                                <block v-for="(item, index) in data[tabCur].list" :key="index">
                                    <view class="pro-item shadow-blur padding-top-xs">
                                        <image :src="item.cover.url" class="pro-img" mode="aspectFill" @tap="detail(item)"></image>
                                        <view class="content margin-top-sm">
                                            <view class="text-df" @tap="detail(item)">{{ item.name }}</view>
                                            <view class="flex justify-between padding-tb-xs">
                                                <block v-if="item.location && item.location.coord.length > 0">
                                                    <view class="cuIcon-location sm text-grey" @tap="goLocation(item.location)">
                                                        <text class="text-xs text-grey text-cut">{{ item.location.name || item.name }}</text>
                                                    </view>
                                                </block>
                                                <view class="text-gray flex align-center">
                                                    <view @tap="userEvent(30, 20, item)">
                                                        <text class="cuIcon-appreciatefill margin-lr-xs" :class="item.isLike ? 'text-red' : ''"></text>
                                                        <text class="text-sm text-gray">{{ item.like }}</text>
                                                    </view>
                                                    <view @tap="userEvent(40, 20, item)">
                                                        <text class="cuIcon-favorfill margin-lr-xs" :class="item.isFavor ? 'text-red' : ''"></text>
                                                        <text class="text-sm text-gray">{{ item.favor }}</text>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </block>
                            </view>
                        </block>
                        <tui-nomore v-if="!loading"></tui-nomore>
                    </block>

                    <tui-loadmore v-if="loading" :fixed="true" :index="3" type="green"></tui-loadmore>
                    <!-- <view>测试定位：{{resMsg}}</view> -->
                </scroll-view>
            </swiper-item>
        </swiper>

        <view class="cu-tabbar-height"></view>
        <tui-scroll-top :scrollTop="scrollTop" @gotop="goTop"></tui-scroll-top>

        <zz-loc ref="loc"></zz-loc>
    </view>
</template>

<script>
import bannerList from '@/components/zzxb/banner-list.vue';
import cardBgimg from '@/components/zzxb/card-bgimg.vue';

export default {
    components: { bannerList, cardBgimg },
    data() {
        return {
            resMsg: '',
            kml: null,
            mapHt: 320,
            loading: false,
            stickBarHeight: 46,
            WinHeight: this.WinHeight,
            customBar: this.customBar,
            scrollTop: 0,
            top: 0,

            banner: [],

            tabCur: 0,
            gradualColor: ['red', '#4a67d6'],
            tabs: ['特产', '文化', '民宿', '美食', '兴趣点'],
            data: [
                { url: 'article', t: [20] },
                { url: 'article', t: [24] },
                { url: 'poi', t: [440] },
                { url: 'article', t: [22] },
                { url: 'poi', t: [402, 460, 470, 480, 499] }
            ]
        };
    },
    async onLoad() {
        // #ifdef H5-ZLB

        // ZWJSBridge.onReady(() => {
        // 	console.log('初始化完成后，执行bridge方法');
        // });
        // ZWJSBridge.getLocation()
        // 	.then(result => {
        // 		console.log('获取到的经纬度信息', result);
        // 		let { cityName, townCode, latitude, detailAddress, region, longitude, city } = result;
        // 	})
        // 	.catch(error => {
        // 		console.error('获取经纬度失败', error);
        // 	});

        // ZWJSBridge.openLink({
        //     url: 'https://www.baidu.com'
        // }).then(res => {
        //     console.log('跳转成功',res)
        // 	this.resMsg = res
        // }).catch(error => {
        //    console.log('跳转失败',error)
        //    this.resMsg = error.errorMessage
        // })

        // ZWJSBridge.getUiStyle().then(res=>{
        // 	console.log("获取到的模式",res);
        // }).catch(error=>{
        // 	console.log("getUiStyle=======error",error)
        // })

        // #endif

        await this.zz.req({ $url: 'public/zz/mock', tar: 'special' }, true).then((res) => {
            this.banner = res.data;
            // console.log(this.banner);
        });

        this.kml = uni.getStorageSync('areaGon');
        if (!this.kml) {
            this.kml = await this.zz.req({ $url: 'public/zz/geoGon', code: this.bd.sys.code, trans: 'gcj02' }, true);
            uni.setStorageSync('areaGon', this.kml);
        }
        this.init();
    },
    mounted() {
        uni.createSelectorQuery()
            .select('.sticky-box')
            .boundingClientRect((data) => {
                this.stickBarHeight = data.height;
            })
            .exec();
    },
    methods: {
        async init() {
            let cur = this.tabCur,
                tab = this.data[cur];
            if (!tab.list) {
                this.loading = true;
                let list = await this.zz.req({ $url: 'public/' + tab.url + '/list', deptId: this.bd.sys.code, type: tab.t });
                // console.log('tab.list ----->', list);
                if (cur == 2 || cur == 4) await this.$refs.loc.onLoc(list);
                this.data[cur].list = list;
                this.data = this.zz.clone(this.data);
                this.loading = false;
            }
        },
        kmlMap: function (id) {
            this.zz.href('/pages/planning/map?name=' + encodeURI(this.trail.name));
        },
        tabSelect(e) {
            let idx = e.detail.current;
            if (idx != this.tabCur) {
                this.tabCur = idx;
                this.init();
            }
        },
        userEvent() {
            this.zz.userEvent(t, tt, o);
        },

        //反顶
        thisRoll(e) {
            this.scrollTop = e.detail.scrollTop;
        },
        goTop: function (e) {
            this.top = 0;
            // this.scrollTop = this.old.scrollTop
            this.$nextTick(() => {
                // this.scrollTop = 0
                this.top = 0;
            });
        }
    },
    onPageScroll: function (e) {
        this.scrolled = e.scrollTop;
    }
};
</script>

<style lang="scss" scoped>
.product-list {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 30rpx 30rpx 0 30rpx;
    background: #fff;
}

.pro-item {
    background: #fff;
    box-sizing: border-box;
    width: 49%;
    position: relative;
    margin-bottom: 2%;
}

/* .pro-item::after {
		content: '';
		position: absolute;
		height: 200%;
		width: 200%;
		border: 1rpx solid #eaeef1;
		transform-origin: 0 0;
		-webkit-transform-origin: 0 0;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		left: 0;
		top: 0;
	} */

.pro-img {
    width: 100%;
    height: 200rpx;
    display: block;
}

.pro-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 20rpx;
    /* height: 230rpx; */
}

.pro-tit {
    /* font-size:  */
    color: #2e2e2e;
    font-size: 1.3rem;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.pro-price {
    padding-top: 18rpx;
}

.sale-price {
    font-size: 1.7rem;
    font-weight: 500;
    color: #ea1500;
}

.factory-price {
    font-size: 1.2rem;
    color: #a0a0a0;
    text-decoration: line-through;
    padding-left: 12rpx;
}

.pro-pay {
    padding-top: 10rpx;
    font-size: 1.2rem;
    color: #656565;
}
</style>
