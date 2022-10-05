<template>
    <view>
        <view class="cu-bar bg-ztsblue search fixed align-center" style="height:100rpx;">
         	<view v-if="areaPick" class="fixed align-center text-white padding-xs" @click="show = true">
         		<text class="text-sm text-grey">区域</text>
         		<text class="margin-left-xs">{{dict.deps[deptId[0]].name}}</text>
         		<text class="margin-left-xxs cuIcon-triangledownfill"></text>
         	</view>
         	<view class="search-form round">
         		<text class="cuIcon-search" />
         		<input type="text" :placeholder="tip" maxlength="20" v-model="keyWord" confirm-type="search" @blur="search" />
         	</view>
		</view>
		<view class="cu-tabbar-height"></view>
        <tui-picker :show="show" :pickerData="area" @hide="hide" @change="change"/>
    </view>
</template>

<script>
export default {
	props: {
		//显示区域
		areaPick: {
			type: Boolean,
			default: true
		},
		tip: {
			type: String,
			default: '搜索路线 …'
		}
	},
    data() {
        return {
            dict: uni.getStorageSync('sys_dict'),
            loading: false,
            show: false,
            area: [{text: "浙江省", value: "330000"}],
            deptId: ['330000'],
            keyWord: '',
        }
    },
    mounted() {
		let { deptId } = this.zz.getDept(),
			d = this.dict.deps,
			cur = d[deptId],
			pd = d[d.pid]
		
		for (let k in d) {
			if(d[k].pid == 330000){
				this.area.push({text: d[k].name, value: d[k].id+''})
			}
		}
		this.area.push({text:cur.name, value:deptId})
		this.deptId = [deptId]
		this.search()
    },
    methods: {
		hide(){ this.show = false },
		change(e){
			this.deptId = [e.value]
			if(e.value!='330000') {
				let d = this.dict.deps
				for (let k in d) {
					if(d[k].pid == e.value){
						this.deptId.push(k+'')
					}
				}
			}
			this.search()
		},
		search(){this.$emit('search', { deptId: this.deptId, keyWord: this.keyWord })}
	}
}
</script>