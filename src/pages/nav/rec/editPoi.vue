<template>
	<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsgreen" :isBack="true">
            <block slot="content">更新兴趣点</block>
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
                    <button v-if="poi.pid" class="action text-red" @tap="close">
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
			
			ov:'',
			
			t3: 0,
			idx: '',
			poiList: [
				{ label: '最近使用' },
				{ label: '自然和人文' },
				{ label: '设施和服务' },
				{ label: '其他' }
			],
			
			xFile: {},
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
		
		let s = this.poi.t3
		this.t3 = s
		this.pt = d.trail_element[s]||d.trail_serverPoi[s]||d.trail_otherPoi[s]
		
    },
	// #ifdef APP-PLUS
    onBackPress() { return this.pageLock },
	// #endif
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
		syncFile(u){ this.xFile[u] = 1 },
        addImage(e) {
			this.poi.imgs = this.poi.imgs.concat(e)
        },
		delImage(i) {
			if(this.poi.imgs.length==1 && this.poi.video==null) return this.zz.modal('至少保留一张照片！')
			this.syncFile(this.poi.imgs[i])
			this.poi.imgs.splice(i,1)
		},
		addVideo(e) {
			this.poi.video = e
		},
		delVideo(e) {
			this.syncFile(this.poi.video.tempFilePath)
			this.poi.video = null
		},
		changeType() {
			this.idx = '0_0'
			this.initSelect()
			this.t3 = 0
		},
		
        // 取消保存兴趣点
        async close() {
			let c = false
			const [_, e] = await uni.showModal({
				title: "确定要删除此兴趣点？"
			})
			c = e.confirm
			if(c) {
				uni.showLoading({ mask:true })
				for (let k in this.xFile) await this.zz.removeFile(k)
				await this.zz.req({$fn: 'sync', $url:'/user/rec/delete', pmId: this.poi._id})
				uni.hideLoading()
				
				this.replace(true)
				
				this.pageLock = false
				uni.navigateBack({delta:1})
			}
        },
		replace(del){
			try{
				let pages = getCurrentPages(),
					p2 = pages[pages.length - 2],
					p3 = pages[pages.length - 3]
				
				if(del) {
					p2.$vm.point.splice(p2.$vm.point.findIndex(e=>e._id == this.poi._id),1)
					p3.$vm.point.splice(p3.$vm.point.findIndex(e=>e._id == this.poi._id),1)
				}else{
					p2.$vm.point.splice(p2.$vm.point.findIndex(e=>e._id == this.poi._id),1, this.poi)
					p3.$vm.point.splice(p3.$vm.point.findIndex(e=>e._id == this.poi._id),1, this.poi)
				}
			}catch(e){
				//TODO handle the exception
			}
			
		},
        // 保存兴趣点
       async save() {
			let poi = this.poi
			if(!poi.imgs.length && !poi.video) return this.zz.modal('至少有一张照片或一段视频！')
			if(!poi.name) poi.name = this.pt.label
			
			if(this.ov != JSON.stringify(poi)) {
				uni.showLoading({ mask:true })
				for (let k in this.xFile) await this.zz.removeFile(k)
				for (var i = 0; i < poi.imgs.length; i++) {
					if(!poi.imgs[i].startsWith('http')) {
						poi.imgs[i] = await this.zz.upload(poi.imgs[i])
					}
				}
				
				let p = this.zz.clone(poi)
				delete p.pt
				await this.zz.req({$fn: 'sync', $url:'/user/rec/update', ...p})
				uni.hideLoading()
				this.replace()
			}
			this.pageLock = false
			uni.navigateBack({delta:1})
        }
    }
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
