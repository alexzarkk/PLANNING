<template>
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsgreen">
            <block slot="content">{{t3?'保存记录':'选择运动类型'}}</block>
        </cu-custom>
		<view v-if="!t3" :class="t3?'animation-slide-left':'animation-slide-right'">
			<block v-for="(item,i) in sportList" :key="i">
				<view class="margin-lr-sm">
					<view class="cu-bar margin-top bg-white solid-bottom">
						<view class="action">
							<text class="cuIcon-title text-blue"></text>{{item.title}}
						</view>
					</view>
					<view class="cu-list grid col-3">
						<view class="cu-item" v-for="(p, j) in item.list" :key="j" @click="select(p,i,j)" :class="idx==(i+'_'+j)? 'bg-green light' : ''">
							<text class="padding-tb" :class="'zzIcon-z' + p.value" style="font-size: 100rpx;"></text>
							<text class="text-dark">{{p.label}}</text>
						</view>
					</view>
				</view>
			</block>
		</view>
		
        <view v-show="t3" :class="t3?'animation-slide-right':'animation-slide-left'">
			<zz-map :cur="cur" :line="[kml.line]" :point="kml.point" :winH="240"></zz-map>
			
			<view class="name form-section">
				<view class="cu-list solid-bottom">
					<view class="cu-item bg-white solid-top line-wrapper light">
						<view class="content padding-tb-xs">
							<view>
								<text class="cuIcon-link margin-lr-sm"></text>
								耗时：{{ zz.formatDuring(kml.endTime-kml.startTime-kml.stopTime) }}
							</view>
							<view class="text-gray padding-tb-sm text-df">
								<text class="cuIcon-infofill margin-lr-sm"></text>
								长度
								<text class="text-orange margin-right-xs">{{ kml.info.len }}m</text>
								海拔
								<text class="cuIcon-top text-orange">{{ kml.info.top }}</text>
								<text class="cuIcon-down text-orange margin-right-xs">{{ kml.info.bottom }}</text>
								累计 ↑
								<text class="text-orange">{{ kml.info.up }}</text>
								↓
								<text class="text-orange">{{ kml.info.down }}</text>
							</view>
						</view>
						<view class="mybadge cu-tag bg-green"><text class="text-black">轨迹</text></view>
					</view>
				</view>
			    <tui-collapse :index="1" :current="current" :disabled="!kml.point.length" @click="change3">
			        <template v-slot:title>
			            <tui-list-cell :hover="true">
			            	<text class="cuIcon-location text-blue"></text>
			            	<text class="padding-left-sm">兴趣点
			    				<text class="text-gray text-sm margin-lr-sm">{{kml.point.length+'个'}}</text>
			    			</text>
			            </tui-list-cell>
			        </template>
			        <template v-slot:content>
			    		<view class="bg-gray">
			    			<view class="cu-list menu-avatar padding-sm">
			    				<block v-for="(t2, idx) in kml.point" :key="idx">
			    					<view class="cu-item solid-top" :style="'background:'+(t2._id==cur._id?'#cce6ff':'#FFF')">
			    						<view class="cu-avatar lg" :style="'background-image:url('+icon[t2.t2]+')'" @click="active(t2)"></view>
			    						<view class="content" @click="active(t2)">
			    							<view class="text-grey">
			    								<view class="text-dark text-bold">{{t2.sn||t2.name}}</view>
			    								<view class="padding-left-xs text-grey text-xs">{{dict.prop[t2.t2].text}}</view>
			    							</view>
			    							<view class="text-gray text-sm flex">
			    								<view class="text-cut">
			    									<text class="cuIcon-info text-grey margin-right-xs"></text>
			    									{{dict.trail_element[t2.t3].label||dict.trail_serverPoi[t2.t3].label||dict.trail_otherPoi[t2.t3].label}}
			    								</view>
			    							</view>
			    						</view>
			    						<view class="action" @click="active(t2, idx)">
			    							<text class="cuIcon-pic text-grey">{{ t2.imgs.length }}</text>
			    							<view class="text-grey text-xs">编辑</view>
			    						</view>
			    					</view>
			    				</block>
			    			</view>
			    		</view>
			        </template>
			    </tui-collapse>
			</view>
					
					
            <!-- 名称，详情，活动，难度，照片,隐私设置，保存为草稿 -->
            <view class="name form-section">
                <view class="form-section-title">
                    <text class="text-red padding-right-xs">*</text>
                    名称
                </view>
                <view><input v-model="kml.name" placeholder="输入名称" /></view>
            </view>
            <view class="name form-section">
                <view class="form-section-title">
                    <text class="text-red padding-right-xs">*</text>
                    详情
                </view>
				<view><textarea auto-height placeholder="输入详情" v-model="kml.desc" /></view>
            </view>

            <view class="name form-section">
                <view class="form-section-title">
                    <text class="text-red padding-right-xs">*</text>
                    活动
                </view>
				<view class="flex align-center justify-center">
					<view class="flex-sub bg-green light radius">
						<view class="flex flex-direction justify-center align-center ">
							<text class="padding-tb-sm" :class="'zzIcon-z' + pt.value" style="font-size: 100rpx;"></text>
							<text class="text-dark padding-tb-xs">{{pt.label}}</text>
						</view>
					</view>
					<view class="flex-twice padding-lr">
						<button class="cu-btn round block line-green lg" @click="changeSportType">
							<text class="cuIcon-activity"></text>更改活动类型</button>
					</view>
				</view>
            </view>


			<!--           
			view class="name form-section">
                <view class="form-section-title flex justify-between">
                    <view>
                        <text class="text-red padding-right-xs">*</text>
                        难度
                    </view>
                    <text class="current-level">{{ currentLevelText }}</text>
                </view>
                <view class="flex align-center margin-tb">
					<tui-slider section showValue :max="5" @change="sliderChange"></tui-slider>
                </view>
                <view class="flex justify-between align-center">
                    <view class="text-gray text-sm">简单</view>
                    <view class="text-gray text-sm">仅适合专业人士</view>
                </view>
            </view> -->

            <view class="name form-section">
                <view class="form-section-title flex justify-between">
                    <view>
                        <text class="text-red padding-right-xs">*</text>
                        景观元素
                    </view>
                </view>
                <view>
                    <checkbox-group @change="elCheckboxChange">
                        <view class="cu-list grid col-3 solid">
                            <view class="cu-item" v-for="(item, index) in ele" :key="index">
                                <view class="flex align-center padding-left-xs">
                                    <checkbox class="green sm" :class="item.checked ? 'checked' : ''" :checked="item.checked ? true : false" :value="item.value + ''"></checkbox>
                                    <view class="text-dark margin-left-xs text-df">{{ item.label }}</view>
                                </view>
                            </view>
                        </view>
                    </checkbox-group>
                </view>
            </view>

            <view class="name form-section">
                <view class="form-section-title flex justify-between">
                    <view>
                        <text class="text-red padding-right-xs">*</text>
                        印象评分
                    </view>
                </view>
                <view class="cu-list menu">
                    <view class="cu-item" v-for="(item, index) in ip" :key="index">
                        <view class="content">
                            <view class="flex justify-between">
                                <view :class="'text-' + item.color">
                                    <text class="cuIcon-info margin-right-xs"></text>
                                    <text>{{ item.label }}</text>
                                </view>
                                <tui-rate :size="22" :current="item.score" @change="rateChange" :params="index"></tui-rate>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="name form-section flex align-center justify-between">
                <view class="form-section-title">
                    <view>
                        隐私
                    </view>
                </view>
                <view class="flex align-center" @click="pubShow">
                    <view style="min-width:3em;" class="text-bold text-right text-gray text-under text-ztsgreen">{{kml.pub? '公开':'隐藏'}}</view>
                </view>
            </view>
			<zz-upload-image :count="20" :imgs="kml.imgs||[]" @add="addImage" @del="delImage"></zz-upload-image>
           
        </view>
		
		<view class="cu-modal" :class="show ? 'show' : ''">
		    <view class="cu-dialog">
		        <view class="cu-bar bg-white justify-end">
		            <view class="content">隐私设置</view>
		            <view class="action" @tap="show = false"><text class="cuIcon-close text-red"></text></view>
		        </view>
		        <view class="bg-white padding solid-top">
		            <view class="text-bold padding-tb-sm text-left text-xl">谁能看到这条路线？</view>
		            <radio-group class="block" @change="pubChange">
		                <view>
		                    <view class="flex justify-between padding-tb-sm">
		                        <text class="text-bold">
		                            所有人(公开)
		                        </text>
		                        <radio class='radio green' :checked="pub==1" value="1"></radio>
		                    </view>
		                    <view class="text-left text-df">环浙步道用户将看到此路线,该路线可以保存在您的列表中,可以分享,并且计入用户排名。</view>
		                </view>
		                <view>
		                    <view class="flex justify-between padding-tb-sm">
		                        <text class="text-bold">
		                            只有您（隐藏）
		                        </text>
		                        <radio class='radio grey' :checked="pub==0" value="0"></radio>
		                    </view>
		                    <view class="text-left text-df">只有您可以看到此路线，无法保存到公开的列表中，也不能分享，并且不会计入用户排名，但是会计入个人统计中。</view>
		                </view>
		            </radio-group>
		            <view class="margin-top text-gray text-df"><text class="text-black">提示：</text>如果您还未准备好路线的详细描述或照片，可以先标记为隐藏路线，当一切准备好之后，可以随时把此路线更改为公开路线。</view>
		        </view>
		        <view class="cu-bar bg-white solid-top">
		            <view class="action margin-0 flex-sub solid-left" @tap="show = false">取消</view>
		            <view class="action margin-0 flex-sub text-green solid-left" @tap="pubConfirm">确定</view>
		        </view>
		    </view>
		</view>
		
		<!--底部操作栏-->
		<view v-show="t3">
		    <view class="cu-tabbar-height"></view>
		    <view class="cu-bar bg-white tabbar border shop foot">
		        <button class="action text-red" @tap="close">
		            <view class="cuIcon-close"></view>
		            取消
		        </button>
		        <view class="bg-ztsgreen submit cuIcon-check" @tap="save">保存</view>
		    </view>
		</view>
    </view>
</template>

<script>
import sync from '@/comm/sync'
import icon from '@/comm/libs/icon'
import { uniqId, trans } from '@/comm/geotools'

export default {
    data() {
        return {
			icon,
			tmt: 0,
			dict:{},
			kml: {info:{}},
			rec: {},
			cur: {},
			current: -1,
			
			ele:[],
			ip: [0,0,0,0,0],
			pageLock: true,
			
			pt: {},
			t3: 0,
			idx: '',
			sportList: [
			    {
			        title: '最近使用',
			        list: []
			    },
			    {
			        title: '运动类型',
			        list: []
			    }
			],
			
			
            show: false,
			pub: 0
        };
    },
	onLoad({ v }) {
		this.$scope.$getAppWebview().setStyle({'popGesture':'none'})
		let { tmt } = this.zz.getParam(v),
			dict = uni.getStorageSync('sys_dict')
			
		this.tmt = tmt
		this.dict = dict
		
		this.ele = this.zz.toArr(dict.trail_element)
		this.ip = this.zz.toArr(dict.trail_ip)
		this.sportList[1].list = this.zz.toArr(dict.trail_type)
		
		this.loadData()
		this.initSelect()
	},
	async onShow() {
		let poi = uni.getStorageSync('nav_poi')
		if (poi) {
			uni.removeStorageSync('nav_poi')
			let idx = this.rec.point.findIndex(e=>e._id==poi._id)
			this.rec.point.splice(idx,1,poi)
			uni.setStorageSync('nav_rec'+this.tmt, this.rec)
			await sync.go()
			this.loadData()
		}
	},
	onBackPress() { return this.pageLock },
    methods: {
		loadData(){
			let rec = uni.getStorageSync('nav_rec' + this.tmt),
				f = uni.getStorageSync('sync_files')||{},
				popular = uni.getStorageSync('popular_sport_type') || [110,118,120,122,210,218],
				
				kml = {
					name: rec.name,
					desc: '',
					pub: 1,
					imgs:[],
					ele:[],
					ip: [0,0,0,0,0],
					tmt: this.tmt,
					type: popular[0],
					kmlId: rec.kmlId,
					startTime: rec.startTime,
					endTime: rec.endTime,
					stopTime: rec.stopTime,
					info: rec.info,
					line:{
							_id: uniqId(),
							t1:1,
							t2:10,
							name: rec.name,
							coord: trans(rec.coord, 'gcj02towgs84')
						},
					point:[]
				}
			for (var i = 0; i < rec.point.length; i++) {
				let p = rec.point[i]
				for (var j = 0; j < p.imgs.length; j++) {
					if(f[p.imgs[j]]) p.imgs[j] = f[p.imgs[j]]
				}
				if(p.video) {
					let u = p.video.tempFilePath
					if(f[u]) {
						p.video.url = f[u]
						delete p.video.tempFilePath
					}
				}
				kml.point.push({...p, coord: trans(p.coord, 'gcj02towgs84')})
			}
			this.kml = kml
			this.rec = rec
		},
		initSelect(){
			let dict = this.dict,
				selected = uni.getStorageSync('selected_sport_type') || 110,
				popular = uni.getStorageSync('popular_sport_type') || [110,118,120,122,216,310]
			
			this.sportList[0].list = []
			if(!popular.includes(selected)) {
				popular.unshift(selected)
				popular.splice(6,1)
				uni.setStorageSync('popular_sport_type', popular)
			}
			for (let s of popular) {
				this.sportList[0].list.push(dict.trail_type[s])
			}
			this.pt = dict.trail_type[popular[0]]
		},
		select(p,i,j) {
			this.idx = i+'_'+j
			this.pt = p
			this.kml.type = p.value
		    uni.setStorageSync('selected_sport_type', p.value)
		    setTimeout(() => {
				this.t3 = p.value
		    }, 300)
		},
		changeSportType() {
			this.idx = '0_0'
			this.initSelect()
			this.t3 = 0
		},
		
		change3(e) {
			this.current = this.current == e.index ? -1 : e.index
		},
		active(e,idx) {
			this.cur = e
			if(idx!=undefined) {
				this.zz.href('/pages/nav/point', this.rec.point.find(x=>x._id==e._id), 1, 'slide-in-right')
			}
		},
        rateChange(e) {
            this.$set(this.ip[Number(e.params)], 'score', e.index)
        },
        elCheckboxChange(e) {
			for (var i = 0; i < this.ele.length; i++) {
				this.$set(this.ele[i], 'checked', e.target.value.includes(this.ele[i].value+''))
			}
        },
		
		pubShow() {
		    this.pub = this.kml.pub
			this.show = true
		},
		pubChange(e) {
		    this.pub = Number(e.detail.value)
		},
		pubConfirm(e){
			this.kml.pub = this.pub
			this.show = false
		},
		
		syncFile(u){
			let f = uni.getStorageSync('sync_files')||{}
			if(f[u]) {
				sync.add(f[u],'removeFile')
				delete f[u]
				uni.setStorageSync('sync_files', f)
			}
		},
		addImage(e) {
			this.kml.imgs = this.kml.imgs.concat(e)
		},
		delImage(i) {
			this.syncFile(this.kml.imgs[i])
			this.zz.removeFile(this.kml.imgs[i])
			this.kml.imgs.splice(i,1)
		},
		
        async close() {
			const [_, e] = await uni.showModal({ title: "确定要放弃保存？" })
        	if(e.confirm) {
        		this.pageLock = false
        		this.zz.href('/pages/index/event')
        	}
        },
        // 保存兴趣点
        save() {
			let kml = this.zz.clone(this.kml),
				rec = uni.getStorageSync('nav_rec'+this.tmt),
				tempfiles = uni.getStorageSync('tempfiles') || [],
				saved = uni.getStorageSync('nav_local_rec') || [],
				cd = rec.coord,
				coord = []
			
			delete kml.line
			delete kml.point
			
			kml.ip = this.ip.map(e=>e.score||0)
			for (let s of this.ele) {
				if(s.checked) kml.ele.push(s.value)
			}
			
			saved.push(kml)
			uni.setStorageSync('nav_local_rec', saved)
			
			if(cd.length%10!=0) {
				for (let i = cd.length-1; i >= 0; i--) {
					coord.push(cd[i])
					if(i%10==0) break
				}
				coord.reverse()
			}
			
			if(coord.length||kml.imgs.length) {
				sync.add({$url: '/user/rec/sync', coord, imgs: kml.imgs}, 'req', false)
			}
			for (let o of kml.imgs) {
				tempfiles.push(o)
				sync.add(o, 'upload', false)
			}
			delete kml.imgs
			
			sync.add({$url: '/user/rec/add', kml}, 'req', false)
			for (let p of rec.point) {
				for (let s of p.imgs) tempfiles.push(s)
				if(p.video) tempfiles.push(p.video.tempFilePath)
			}
			
			uni.setStorageSync('tempfiles', tempfiles)
			uni.removeStorageSync('nav_rec'+this.tmt)
			
        	this.pageLock = false
        	// this.zz.href('/pages/nav/rec/line',{kml:this.kml}, 1, null, 'redirectTo')
        	this.zz.href('/pages/index/event')
        }
        
    }
};
</script>

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

</style>
