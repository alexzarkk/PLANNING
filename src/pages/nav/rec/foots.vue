<template>
    <view>
        <cu-custom bg-color="bg-ztsgreen" :is-back="true">
            <block slot="content">我的足迹</block>
        </cu-custom>
		<template v-if="area">
			<zz-map :cur="cur" :line="area.children" :winH="mapHeight"></zz-map>
		</template>
		
		<image @click="controltap(1)" :src="'../../../static/'+(mapHeight!=winH?'un':'')+'fold.png'" class="back-img" :style="'top:'+(stH+60)+'px;'"></image>
		
		<!-- <block v-if="mapHeight!=winH">
			<view :style="{ height: (winH - mapHeight - (navHeight)) + 'px' }">
				<scroll-view id="tab-bar" class="tab-bar" :scroll-x="true" :show-scrollbar="false">
					<view style="flex-direction: column;">
						<view style="flex-direction: row;">
							<view class="uni-tab-item" v-for="(tab,i) in tabs" :key="i" :data-id="i" @tap="tabChg">
								<tui-badge
									v-if="tab.ls.length"
									absolute
									translateX="40%" right="18rpx" top="-1rpx"
									:type="tabIdx==i?'warning':'gray'"
									:scaleRatio="tabIdx==i?0.8:0.6" >{{tab.ls.length}}</tui-badge>
								<text class="uni-tab-item-title" :class="tabIdx==i? 'uni-tab-item-title-active':''">{{tab.name}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="tab-bar-line"></view>
			</view>
		</block> -->
		
		<view class="sticky-box bg-cyan margin-top" :style="[{ top: customBar + 'px' }]">
		    <scroll-view class="nav text-center" scroll-x scroll-with-animation>
		        <view v-for="(item, idx) in tabList" :id="item.id" :key="idx" class="cu-item" :class="tabIdx==idx ? 'cur text-bold text-red' : ''" @tap="tabChg">
		            {{ item.name }}
		        </view>
		    </scroll-view>
		</view>
		
		<zz-page-status :length="list.length" :total="page.total"></zz-page-status>
    </view>
</template>

<script>
import icon from '@/comm/libs/icon'
import { dist } from '@/comm/geotools'
export default {
    data() {
        return {
			icon,
			area: null,
			
			stH:0,
			winH: 0,
			//swiper
			
			tabIdx: 0,
			scrollLeft: 0,
			tabHeight: 45,
			navHeight: 74,
			mapHeight: 0,
			
			page: {
			    page: 1,
			    size: 10,
			    total: -1,
			    my: 1,
			},
			list: [],
			
			scrolled: 0,
			loading: true,
			
            customBar: this.CustomBar,
            bd: this.bd, // APP相关信息
            dict: uni.getStorageSync('sys_dict'),
            tabList: [  // 可操作列表
                {
                    name: '历史足迹',
                    icon: 'appreciate',
                    t: 30
                },
                {
                    name: '年度足迹',
                    icon: 'comment',
                    t: 1000
                },
                {
                    name: '频次排名',
                    icon: 'favor',
					k:'isFavor',
					v:'favor',
                    t: 40
                }
            ],
			current: -1,
			cur: {}
        };
    },
    onLoad() {
		let sysInfo = uni.getStorageSync('sysInfo')
		this.winH = sysInfo.windowHeight
		this.stH = sysInfo.statusBarHeight
		this.mapHeight = this.winH/3
        let {deptId} = this.zz.getDept()
		this.zz.req({$url:'/public/zz/geoGon', code:deptId}).then(e=>{
			this.area = e
		})
		this.loadData()
    },
    methods: {
        loadData() {
			this.loading = true
            this.zz.req({$url: '/user/scan/foots', ...this.page}).then(e => {
				this.loading = false
				console.log(e);
				e.pagination.page++
				Object.assign(this.page,e.pagination)
				this.tabs[0].ls = this.tabs[0].ls.concat(e.list)
            })
        },
		tabChg(e) {
			let idx = e.detail.current||e.currentTarget.dataset.id||0
			if(this.tabIdx != idx) {
				this.tabIdx = idx
				this.scrollLeft = (idx - 1) * 60
			}
		},
		controltap(){
			let h = this.winH
			this.mapHeight = this.mapHeight == h ? h/3:h
		},
		viewImg(p,i) { if(p&&p.length) this.zz.viewIMG(p,i) },
		change3(e) {this.current = this.current == e.index ? -1 : e.index },
		active(e,idx) {
			this.cur = e
			if(idx!=undefined) {
				this.zz.href('/pages/comm/point',{kml:{...this.rec, t1:this.line,t2:this.point}, idx})
			}
		},
		
    },
	onPageScroll(e) {
		if(!this.isTabTap) {
			this.scrolled = e.scrollTop
			if (e.scrollTop <= 160) {
				this.headOpacity = e.scrollTop / 160
			} else if (e.scrollTop > 160) {
				this.headOpacity = 1
			}
		}
	}
};
</script>

<style lang="scss">
	
page {
    background-color: #ffffff;
}
</style>

<style lang="scss" scoped>


.back-img {
	position: fixed;
	left: 10px;
	width: 42px;
	height: 42px;
}

.record {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	padding: 8rpx;
	background: linear-gradient(to bottom, #000000 90%, rgba(255, 255, 255, 0.2) 50%);
}

.record-title {
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

</style>
