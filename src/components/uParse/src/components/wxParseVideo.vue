<template>
	<!--增加video标签支持，并循环添加-->
	<view :class="node.classStr" :style="node.styleStr">
		<video :advanced="advanced" :class="node.classStr" :style="node.styleStr" class="video-video" :src="node.attr.src" ></video>
	</view>
</template>

<script>
export default {
	name: 'wxParseVideo',
	props: {
		node: {}
	},
	data() {
		return {
			advanced: [
				{
					key: 'mediacodec',
					value: 1,
					type: 'player'
				},
			]
		};
	},
	created() {
		// console.log("进阶配置====",this.advanced)
		// this.advanced = [
		// 	{
		// 		key: 'mediacodec',
		// 		value: 1,
		// 		type: 'player'
		// 	},
		// 	// {
		// 	// 	key: 'videotoolbox',
		// 	// 	value: 1,
		// 	// 	type: 'player'
		// 	// }
		// ];
	}
};
</script>
