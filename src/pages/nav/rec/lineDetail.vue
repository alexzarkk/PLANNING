<template>
	<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bg-color="bg-ztsgreen" :is-back="true">
            <block slot="content">{{ rec?rec.name:'' }}</block>
        </cu-custom>
    	<block v-if="line.length">
    		<zz-map :cur="cur" :line="line" :point="point" :winH="240"></zz-map>
    		
    		<tui-collapse :index="1" :current="current" :disabled="!point.length" @click="change3">
    			<template v-slot:title>
    				<tui-list-cell :hover="true">
    					<text class="cuIcon-location text-blue"></text>
    					<text class="padding-left-sm">兴趣点
    						<text class="text-gray text-sm margin-lr-sm">{{point.length+'个'}}</text>
    					</text>
    				</tui-list-cell>
    			</template>
    			<template v-slot:content>
    				<view class="bg-gray">
    					<view class="cu-list menu-avatar padding-sm">
    						<block v-for="(t2, idx) in point" :key="idx">
    							<view class="cu-item solid-top" :style="'background:'+(t2._id==cur._id?'#cce6ff':'#FFF')">
    								<view class="cu-avatar lg" :style="'background-image:url('+icon[t2.t2]+')'" @click="active(t2)"></view>
    								<view class="content" @click="active(t2)">
    									<view class="text-grey">
    										<view class="text-dark text-bold">{{ t2.sn||t2.name }}</view>
    										<view class="padding-left-xs text-grey text-xs">{{ t2.pt.label }}</view>
    									</view>
    									<view class="text-gray text-sm flex">
    										<view class="text-cut">
    											<text class="cuIcon-info text-grey margin-right-xs"></text>
    											{{t2.desc||t2.time}}
    										</view>
    									</view>
    								</view>
    								<view class="action" @click="active(t2, idx)">
    									<text class="cuIcon-pic text-grey" v-if="t2.imgs.length">{{ t2.imgs.length }}</text>
    									<text class="cuIcon-record text-grey" v-if="t2.video"></text>
    									<view class="text-grey text-xs">详情</view>
    								</view>
    							</view>
    						</block>
    					</view>
    				</view>
    			</template>
    		</tui-collapse>
    		
    		<zz-kml-nav v-if="line.length" :coord="line[0].coord" class="solid" @addr="addrInfo"></zz-kml-nav>
    	</block>
    	<block v-else>
    		<tui-loading :fixed="true" :index="3" type="green"></tui-loading>
    	</block>
    	
    	<block v-if="rec">
    		<view class="container solid-top">
    		    <!-- 使用路线 -->
    		    <view v-if="rec" style="width: 380rpx" :style="{ top: customBar + 'px', left: '200rpx' }" class="padding-tb flex flex-direction justify-center align-center sticky-button-box">
    		        <button style="width: 280rpx" class="shadow cu-btn bg-green lg round" @click="useLine">
    		            <text class="zzIcon-distfill margin-right-sm" />
    		            使用路线
    		        </button>
    		    </view>
    			
    			<block v-if="rec.imgs&&rec.imgs.length">
    				<swiper class="screen-swiper round-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
    					<swiper-item v-for="(pic, index) in rec.imgs" :key="index" :data-index="index" @tap.stop="viewImg(rec.imgs, index)">
    						<image :src="pic" mode="aspectFill"></image>
    					</swiper-item>
    				</swiper>
    			</block>
    			
    		    <!-- 线路信息 -->
    		    <view class="line-info-box">
    		        <view class="flex align-center justify-between">
    		            <view class="sport-type-box">
    		                <view class="sport-icon" :class="'zzIcon-z'+rec.type"></view>
    		                <view>{{ dict.trail_type[rec.type||110].label }}</view>
    		            </view>
    		            <view class="padding-right text-bold">
    		                {{ zz.time2Date(rec.startTime, 'Y-M-D h:m') }}
    		            </view>
    		        </view>
    		        <view class="line-info-name">
    		            {{ rec.name }}
    		        </view>
    				
    		        <view class="flex align-center justify-between">
    		            <view class="avatar-box">
    		                <view class="cu-avatar radius margin-right lg" :style="'background-image:url(' + rec.userInfo.headImg + ')'"></view>
    		                <view>{{ rec.userInfo.nickName }}</view>
    		            </view>
    		            <!-- 编辑按钮 -->
    		            <view class="padding-right flex">
    		                <view v-if="isMy" class="line-operation margin-right radius square" @click="openEdit">
    		                    <view class="operation-icon cuIcon-edit"></view>
    		                    <view class="operation-title">
    		                        编辑
    		                    </view>
    		                </view>
    		                <!-- <view class="line-operation  radius square" @click="showShareModal">
    		                    <view class="operation-icon cuIcon-share"></view>
    		                    <view class="operation-title">
    		                        分享
    		                    </view>
    		                </view> -->
    		            </view>
    		        </view>
    		    </view>
    			
    		    <!-- 相关操作的盒子 -->
    		    <view v-if="!isMy" class="line-operation-box">
    		        <view v-for="(item, index) in opeartionList" :key="index" class="line-operation" @click="opeartionClick(item)">
    		            <view class="operation-icon" :class="'cuIcon-'+item.icon+(rec[item.k]? 'fill':'')"></view>
    					<text class="text-gray text-sm">{{rec[item.v]||0}}</text>
    		            <view class="operation-title">
    		                {{ item.title }}
    		            </view>
    		        </view>
    		    </view>
    		    <view class="line-detail-info-box solids-bottom">
    		        <view v-for="(item, index) in lineDetailList" :key="index" class="line-detail-item-wrapper">
    		            <view v-for="(inner, iIndex) in item" :key="iIndex" class="line-detail-border-box">
    		                <view class="line-detail-item">
    		                    <view class="detail-item-title">
    		                        {{ inner.title }}
    		                    </view>
    		                    <view class="detail-item-value">
    		                        {{ inner.value }}
    		                    </view>
    		                </view>
    		            </view>
    		        </view>
    		    </view>
    		    <!-- 线路描述 -->
    		    <view v-if="rec.desc" class="padding text-xl">
    		        {{ rec.desc }}
    		    </view>
    			
    			<view class="cu-bar bg-white solid-bottom">
    				<view class="action">
    					<text class="cuIcon-titles text-blue"></text>
    					景观元素
    				</view>
    			</view>
    				
    			<!-- 景观元素 -->
    			<template v-if="rec.ele.length">
    				<view class="padding-lr bg-white solid-bottom">
    					<view class="grid text-center col-1">
    						<view class="bg-white">
    							<view class="flex align-center">
    								<view class="flex-treble padding-xs radius">
    									<view class="flex flex-wrap align-center">
    										<view class="padding-xs" v-for="(x, idx) in rec.ele" :key="idx">
    											<view class="cu-tag bg-green round lg">{{ dict.trail_element[x].label }}</view>
    											<!-- <view class="cu-tag" :class="'bg-' + dict.trail_element[x].color">{{ dict.trail_element[x].label }}</view> -->
    										</view>
    									</view>
    								</view>
    							</view>
    						</view>
    					</view>
    				</view>
    			 </template>
    			 <template v-else>
    				 <tui-no-data :fixed="false">无数据~</tui-no-data>
    			 </template>
    				 
    			<!-- 体验评分 -->
    			<view class="cu-bar solid-bottom">
    				<view class="action">
    					<text class="cuIcon-titles text-blue"></text>
    					印象评分
    				</view>
    			</view>
    			<view class="solid-bottom padding-bottom">
    				<block v-for="(e, idx) in zz.toArr(dict.trail_ip)" :key="idx">
    					<view class="cu-list menu bg-white sm-border card-menu">
    						<view class="flex padding-lr align-center">
    							<view class="radius flex align-center" style="column-gap:20rpx" :class="'text-' + e.color">
    								<text class="cuIcon-info"></text>
    								<view style="min-width: 4.5em">{{ e.label }}</view>
    								<tui-rate :current="rec.ip[idx]" :disabled="true"></tui-rate>
    							</view>
    						</view>
    					</view>
    				</block>
    			</view>
    			
    		</view>
    		
    	</block>
    	<block v-else>
    		<tui-loading :fixed="true" :index="3" type="green"></tui-loading>
    	</block>
    	<zz-weather v-if="addr" :addr="addr"></zz-weather>
    	<zz-blog ref="blog" class="solid" :tid="rec._id"></zz-blog>
    	
    	
        <!-- 分享窗口 -->
        <!-- <view class="cu-modal" :class="modalName == 'shareModal' ? 'show' : ''" @tap="hideModal">
            <view class="cu-dialog" @tap.stop="">
                <view class="share-method-box">
                    <view class="share-title-box">
                        分享
                    </view>
                    <text class="cuIcon-close text-bold text-xxl" @click="hideModal"></text>
                    <view class="share-btn-box">
                        <button class="cu-btn bg-ztsgreen lg round">
                            <text class="cuIcon-qrcode margin-right-xs text-xxl"></text>
                            二维码
                        </button>
                        <button class="cu-btn bg-ztsgreen lg round">
                            <text class="cuIcon-share margin-right-xs text-xxl"></text>
                            其他
                        </button>
                    </view>
                </view>
            </view>
        </view> -->
    	
    	<tui-scroll-top :scroll-top="scrolled" />
        <!-- 页面底部应用信息 -->
        <zz-footer/>
    </view>
</template>

<script>
import icon from '@/comm/libs/icon'
import { dist } from '@/comm/geotools'
export default {
    data() {
        return {
			icon,
			
			scrolled: 0,
			loading: true,
			headOpacity: 0,
			
            customBar: this.CustomBar,
            weather: null,  // 天气信息
            isMy: false, // true:我自己的显示  false:别人的线路
            dict: uni.getStorageSync('sys_dict'),
            rec: null,  // 轨迹的信息
            modalName: '',
            opeartionList: [  // 可操作列表
                {
                    title: '点赞',
                    icon: 'appreciate',
					k:'isLike',
					v:'like',
                    t: 30
                },
                {
                    title: '评论',
                    icon: 'comment',
                    t: 1000
                },
                {
                    title: '收藏',
                    icon: 'favor',
					k:'isFavor',
					v:'favor',
                    t: 40
                }
            ],
            lineDetailList: [],
			
			addr: null,
			line: [],
			point: [],
			current: -1,
			ele: {},
			cur: {}
        };
    },
    async onLoad(option) {
		let user = this.zz.getAcc(),
			d = this.dict
		this.ele = Object.assign(d.trail_element,d.trail_serverPoi,d.trail_otherPoi)
		
        if (option.id) {
            await this.zz.req({ $url: '/user/rec/info', _id: option.id, ui:1}).then(res => {
                this.rec = res
            })
        }
        if (option.v) {
            this.rec = this.zz.getParam(option.v)
        }
        this.rec = this.rec
		if(user) {
			this.isMy = this.rec.userId == user._id
			if(!this.isMy){
				this.zz.req({$url: '/user/ue/i_s', tid: this.rec._id}).then(e => {
					Object.assign(this.rec, e)
				})
			}else{
				this.rec.userInfo = user
			}
		}
		this.loadData()
		uni.$on('newComment'+this.rec._id, () => { this.$refs.blog.init() })
    },
    methods: {
        loadData() {
			let r = this.rec,
				info = r.info
				
            this.lineDetailList[0] = [
                { title: '里程', value: `${(info.len / 1000).toFixed(2)}km` },
                { title: '均速', value: `${(info.len / ((r.endTime - r.startTime) / (60 * 60 * 1000)) / 1000).toFixed(2)}km/h` }
            ]

            this.lineDetailList[1] = [
                { title: '累计海拔', value: `⇡${info.up}⇣${info.down}m` },
                { title: '最高最低', value: `⩑${info.top}⩒${info.bottom}m` }
            ]

            this.lineDetailList[2] = [
                { title: '累计耗时', value: this.zz.formatDuring(r.endTime - r.startTime) },
                { title: '暂停时长', value: this.zz.formatDuring(r.stopTime||0) }
            ]
			
            this.zz.req({$url: '/public/rec/pms',sort: 1, pid: r._id}).then(e => {
                let {line, point} = e
				for (let s of point) {
					s.pt = this.ele[s.t3]
				}
				this.line = line
				this.point = point
				this.current = point.length<6?1:-1
            })
        },
		addrInfo(e){ this.addr = e },
		viewImg(p,i) { if(p&&p.length) this.zz.viewIMG(p,i) },
		change3(e) {this.current = this.current == e.index ? -1 : e.index },
		active(e,idx) {
			this.cur = e
			if(idx!=undefined) {
				this.zz.href('/pages/comm/point',{kml:{...this.rec, t1:this.line,t2:this.point}, idx})
			}
		},
		
        useLine() {
            // #ifdef H5
            this.zz.href('/pages/nav/navH5', {kml:{...this.rec, children:[...this.line]}}, true)
            // #endif

            // #ifdef APP-PLUS
			this.zz.href('/pages/nav/navApp',{kml:{...this.rec, children:[...this.line]}}, 1)
            // #endif
        },
        
        opeartionClick(item) {
            if (item.t === 1000) {  // 评论

            } else {
                // 30.点赞	  40.收藏
                // 42 记录的轨迹
                this.zz.userEvent(item.t, 42, this.rec)
            }
			this.rec = this.zz.clone(this.rec)
			// console.log('操作============', this.rec);
        },
        // 跳转到线路编辑
        openEdit() {
			this.zz.href('/pages/nav/rec/edit',{kml:this.rec, line:this.line, point:this.point},1)
        },
		
        // 显示分享的弹窗
        showShareModal() {
            this.modalName = 'shareModal';
        },
        hideModal() {
            this.modalName = '';
        }
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

// body {
//     background-color: #ffffff;
// }
</style>

<style lang="scss" scoped>
.form-section {
	background: #ffffff;
	border-radius: 16rpx;
	margin: 20rpx 20rpx;
	padding: 24rpx 28rpx;
	box-sizing: border-box;

	&-title {
		margin-bottom: 12rpx;
		font-size: 1.2rem;
		color: #999999;
	}
}
	
.container {
	// background-color: #f4f4f4;
    padding: 0 40rpx;
    .line-info-box {
        margin-top: 50rpx;
        border-bottom: 1px solid #e2e2e2;
        padding-bottom: 50rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 350rpx;
        .sport-type-box {
            display: flex;
            align-items: center;

            .sport-icon {
                font-size: 60rpx;
                margin-right: 20rpx;
            }
        }

        .line-info-name {
            font-size: 2.4rem;
            font-weight: 900;
        }

        .avatar-box {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }

    .line-operation-box {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 140rpx;
        border-bottom: 1px solid #e2e2e2;
    }

    .line-operation {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .operation-icon {
            margin-bottom: 10rpx;
            color: $zts-green;
            font-size: 2rem;
        }
        .operation-title {
            color: $zts-green;
        }
    }
    .square {
        width: 120rpx;
        height: 120rpx;
        border-radius: 15rpx;
        border: 1px solid $zts-green;
    }

    .line-detail-info-box {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: center;
        .line-detail-item-wrapper {
            height: 160rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            &:not(:last-child) {
                border-bottom: 1px solid #e2e2e2;
            }

            .line-detail-border-box {
                &:first-child {
                    border-right: 1px solid #e2e2e2;
                }
            }
            .line-detail-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 335rpx;
                height: 120rpx;

                // border-left: 1px solid black;
                .detail-item-title {
                    font-size: 1.2rem;
                    color: #858585;
                    margin-bottom: 6rpx;
                }

                .detail-item-value {
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #282828;
                }
            }
        }
    }
}

.share-method-box {
    height: 400rpx;
    .share-title-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        height: 150rpx;
        padding-top: 50rpx;
        padding-bottom: 50rpx;
    }

    .cuIcon-close {
        position: absolute;
        right: 20rpx;
        top: 20rpx;
        font-size: 50rpx;
    }

    .share-btn-box {
        height: 200rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .cu-btn {
            width: 80%;
        }
    }
}

.sticky-button-box {
    position: sticky;
    z-index: 999;
}
</style>
