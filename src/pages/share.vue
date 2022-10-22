<template>
<page-meta root-font-size="10px"></page-meta>
	<view>
		<block v-if="loading">
			<tui-loading :fixed="true" :index="3" type="green"></tui-loading>
		</block>
		<block v-else>
			<tui-no-data :fixed="true" :imgUrl="bd.imgs.nodata"  btnText="重新加载" @tap="reload">点击重试~</tui-no-data>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading:true,
				task : null,
				login: false,
				deptId:'',
				path : ''
			}
		},
		
		//	https://zts.5618.co/h5/#/pages/share?deptId=330212&path=/pages/planning/article&id=5eb7b88343f165004c6d2d52
		//	https://zts.5618.co/h5/#/pages/share?deptId=330212&path=/pages/comm/kml&_id=62b9409268cebc00011fdb23
		//  https://zts.5618.co/h5/#/pages/share?deptId=330212
		
		//  http://localhost:8080/h5/#/pages/share?deptId=330212
		//	http://localhost:8080/h5/#/pages/share?deptId=330212&path=/pages/planning/poi&id=629497c49b54e30001d3e4eb
		//	http://localhost:8080/h5/#/pages/share?deptId=330212&path=/pages/planning/detail&id=60312b1fedb62e0001beeeac
		   
		onLoad ({path='/pages/index/index', deptId='', id ='', _id='', sn='', coord='', login=false}=q) {
			path += '?deptId='+deptId
			path += '&id='+id
			if(_id) path += '&_id='+_id
			if(sn) path += '&sn='+sn
			if(coord) path += '&coord='+coord
			
			this.path = path
			this.login = login
			this.deptId = deptId
			this.init()
		},
		methods: {
			async init(t=0){
				if(!uni.getStorageSync('sys_dict')){
					t++
					if(t<100){
						return this.task = setTimeout(()=> { this.init(t) }, 100)
					}else{
						this.loading = false
						this.zz.toast('网络故障，请稍候重试')
					}
				}
				clearTimeout(this.task)
				
				if(this.deptId) {
					uni.setStorageSync('cur_deptId', this.deptId)
					await this.zz.setDept()
				}
				if(this.login&&!this.zz.getToken()){
					this.zz.href('/pages/comm/account/login',{path:this.path},0,'zoom-out','redirectTo')
				}
				this.zz.href(this.path,0,this.login,'zoom-out','redirectTo')
			},
			reload(){
				this.loading = true
				this.init()
			}
		}
	}
</script>

<style>
</style>
