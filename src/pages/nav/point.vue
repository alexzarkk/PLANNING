<template>
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsgreen" :isBack="true" :manualBack="true" @back="close">
            <block slot="content">兴趣点</block>
        </cu-custom>
    
		<view v-if="!t3" :class="t3?'animation-slide-left':'animation-slide-right'">
			<block v-for="(item,i) in poiList" :key="i">
				<view class="margin-lr-sm">
					<view class="cu-bar margin-top bg-white solid-bottom">
						<view class="action">
							<text class="cuIcon-title text-blue"></text>{{item.label}}
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
    
        <view class="container">
            <view v-show="t3" :class="t3?'animation-slide-right':'animation-slide-left'">
                <!-- 照片，类型，名称，详情-->
                <view v-if="poi.imgs.length">
                    <zz-upload-image :imgs="poi.imgs" @add="addImage" @del="delImage"></zz-upload-image>
                </view>
                <view v-else class="flex align-center justify-center" style="width:750rpx;">
                    <zz-upload-video :video="poi.video" @add="addVideo" @del="delVideo"></zz-upload-video>
                </view>
    
                <view class="name form-section">
                    <view class="form-section-title">
                        <text class="text-red padding-right-xs">*</text>
                        类型
                    </view>
					
					<view class="flex align-center justify-center">
						<view class="flex-sub bg-green light radius">
							<view class="flex flex-direction justify-center align-center ">
								<text class="padding-tb-sm" :class="'zzIcon-z' + pt.value" style="font-size: 100rpx;"></text>
								<text class="text-dark padding-tb-xs">{{pt.label}}</text>
							</view>
						</view>
						<view class="flex-twice padding-lr">
							<button class="cu-btn round block line-green lg" @click="changeType">
								<text class="cuIcon-location"></text>更改兴趣点类型</button>
						</view>
					</view>
					
                </view>
                <view class="name form-section">
                    <view class="form-section-title">
                        <text class="text-red padding-right-xs">*</text>
                        名称
                    </view>
                    <view><input v-model="poi.name" placeholder="输入名称..." /></view>
                </view>
                <view class="name form-section">
                    <view class="form-section-title">
                        <text class="text-red padding-right-xs">*</text>
                        详情
                    </view>
                    <view>
						<textarea auto-height placeholder="输入详情" v-model="poi.desc" />
					</view>
                </view>
            </view>
            <!--底部操作栏-->
            <block v-if="t3">
                <view class="cu-tabbar-height"></view>
                <view class="cu-bar bg-white tabbar border shop foot">
                    <button v-if="add" class="action text-red" @tap="close">
                        <view class="cuIcon-close"></view>
                        删除
                    </button>
                    <view class="bg-ztsgreen submit cuIcon-check" @tap="save">保存</view>
                </view>
            </block>
        </view>
    </view>
</template>

<script>
import sync from '@/comm/sync'
	
export default {
	data() {
	    return {
			dict: {},
			poi: {imgs: []},
			pt: {},
			
			add: false,
			ov:'',
			
			t3: 0,
			idx: '',
			poiList: [
				{ label: '最近使用' },
				{ label: '自然和人文' },
				{ label: '设施和服务' },
				{ label: '其他' }
			],
			
			pageLock: true
	    };
	},
    
    onLoad({v}) {
		// #ifdef APP-PLUS
		this.$scope.$getAppWebview().setStyle({'popGesture':'none'})
		// #endif
		
		this.poi = this.zz.getParam(v)
		
		this.ov = JSON.stringify(this.poi)
		
		let d = uni.getStorageSync('sys_dict')
		
		this.dict = d
		this.poiList[1].list = this.zz.toArr(d.trail_element)
		this.poiList[2].list = this.zz.toArr(d.trail_serverPoi)
		this.poiList[3].list = this.zz.toArr(d.trail_otherPoi)
		
		if(!this.poi.t3) {
			this.add = true
			this.initSelect()
		} else {
			let s = this.poi.t3
			this.pt = d.trail_element[s]||d.trail_serverPoi[s]||d.trail_otherPoi[s]
		}
		this.t3 = this.poi.t3
    },
    methods: {
		initSelect(){
			let dict = this.dict,
				selected = uni.getStorageSync('selected_poi_type') || 902,
				popular = uni.getStorageSync('popular_poi_type') || [902,4022,2050,2012,2036,4006]
			
			this.poiList[0].list = []
			if(!popular.includes(selected)) {
				popular.unshift(selected)
				popular.splice(6,1)
				uni.setStorageSync('popular_poi_type', popular)
			}
			for (let s of popular) {
				this.poiList[0].list.push(dict.trail_element[s]||dict.trail_serverPoi[s]||dict.trail_otherPoi[s])
			}
		},
		select(p,i,j) {
			this.idx = i+'_'+j
			this.pt = p
			this.poi.t3 = p.value
		    uni.setStorageSync('selected_poi_type', p.value)
		    setTimeout(() => {
				this.t3 = p.value
		    }, 200)
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
			this.poi.imgs = this.poi.imgs.concat(e)
        },
		delImage(i) {
			if(this.poi.imgs.length==1 && this.poi.video==null) return this.zz.modal('至少保留一张照片！')
			this.syncFile(this.poi.imgs[i])
			this.zz.removeFile(this.poi.imgs[i])
			this.poi.imgs.splice(i,1)
		},
		addVideo(e) {
			this.poi.video = e
		},
		delVideo(e) {
			this.syncFile(this.poi.video.tempFilePath)
			this.zz.removeFile(this.poi.video.tempFilePath)
			this.poi.video = null
		},
		changeType() {
			this.idx = '0_0'
			this.initSelect()
			this.t3 = 0
		},
		
        // 取消保存兴趣点
        async close() {
			let c = true
			if(this.ov != JSON.stringify(this.poi)) {
				const [_, e] = await uni.showModal({
					title: "确定要放弃保存？"
				})
				c = e.confirm
			}
			if(c) {
				this.pageLock = false
				uni.navigateBack({delta:1})
			}
        },
        // 保存兴趣点
        save() {
			let poi = this.poi
			if(!poi.imgs.length && !poi.video) return this.zz.modal('至少有一张照片或一段视频！')
			
			if(this.ov != JSON.stringify(poi)) {
				if(!poi.name) poi.name = this.pt.label
				uni.setStorageSync('nav_poi', poi)
				
				let f = uni.getStorageSync('sync_files')||{},
					tk = sync.get(),
					upload = []
			
				for (var i = 0; i < poi.imgs.length; i++) {
					let u = poi.imgs[i]
					
					if(!u.startsWith('http')) {
						let idx = tk.q.findIndex(e=>e.o==u)
						if(idx!=-1){
							tk.q.splice(idx,1)
							upload.push(u)
						} else {
							if(f[u]){
								poi.imgs[i] = f[u]
							}else{
								upload.push(u)
							}
						}
					}
				}
				if(poi.video) {
					let u = poi.video.tempFilePath
					if(!u.startsWith('http')) {
						let idx = tk.q.findIndex(e=>e.o==u)
						if(idx!=-1){
							tk.q.splice(idx,1)
							upload.push(u)
						} else {
							if(f[u]){
								poi.video.url = f[u]
							}else{
								upload.push(u)
							}
						}
					}
				}
				sync.set(tk)
				
				if(this.add) {
					let idx = -1
					for (var i = 0; i < tk.q.length; i++) {
						if(tk.q[i].k == 'req' && tk.q[i].o.point) {
							tk.q[i].o.point.push(poi)
							idx = i
							break
						}
					}
					if(idx==-1) {
						sync.add({$url:'/user/rec/sync', point:[poi]}, 'req', false)
					}else{
						sync.set(tk)
					}
				}else{
					let idx = -1
					for (var i = 0; i < tk.q.length; i++) {
						if(tk.q[i].k == 'req') {
							if(tk.q[i].o.point) {
								idx = tk.q[i].o.point.findIndex(e=>e._id==poi._id)
								if(idx!=-1){
									tk.q[i].o.point.splice(idx,1,poi)
									break
								}
							}
							if(tk.q[i].o.rp) {
								idx = tk.q[i].o.rp.findIndex(e=>e._id==poi._id)
								if(idx!=-1){
									tk.q[i].o.rp.splice(idx,1,poi)
									break
								}
							}
						}
					}
					if(idx==-1) {
						sync.add({$url:'/user/rec/sync',rp:[poi]}, 'req', false)
					}else{
						sync.set(tk)
					}
				}
				for (let o of upload) {
					sync.add(o, 'upload', false)
				}
			}
			this.pageLock = false
			uni.navigateBack({delta:1})
        }
    },
	// #ifdef APP-PLUS
	onBackPress() { return this.pageLock }
	// #endif
};
</script>

<style lang="scss" scoped>
.container {
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
}
</style>
