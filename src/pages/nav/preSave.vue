<template>
    <view>
        <cu-custom bgColor="bg-ztsgreen">
            <block slot="content">{{ '选择运动类型' }}</block>
        </cu-custom>
		<view>
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
		
    </view>
</template>

<script>

export default {
    data() {
        return {
			tmt: 0,
			rec: {},
			pageLock: true,
			
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
        };
    },
	onLoad({ v }) {
		// #ifdef APP-PLUS
		this.$scope.$getAppWebview().setStyle({'popGesture':'none'})
		// #endif
		
		let { tmt, rec } = this.zz.getParam(v)
		
		this.tmt = tmt
		this.rec = rec
		
		this.initSelect()
	},
	onBackPress() { return this.pageLock },
    methods: {
		initSelect(){
			let dict = uni.getStorageSync('sys_dict'),
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
		},
		select(p,i,j) {
			this.idx = i+'_'+j
			this.rec.t3 = p.value
		    uni.setStorageSync('selected_sport_type', p.value)
			this.zz.href('/pages/nav/save',{tmt: this.tmt, rec: this.rec})
		}
    }
};
</script>
