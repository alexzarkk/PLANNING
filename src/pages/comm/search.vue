<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-20 09:04:03
 * @FilePath: \sport-planing\src\pages\index\homeSearch.vue
 * @Description: 首页搜索界面
 * 
 * 
-->
<template>
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">搜索</block>
        </cu-custom>
        <view class="content">
            <view class="search-box">
                <!-- mSearch组件 如果使用原样式，删除组件元素-->
                <search-input
                    class="mSearch-input-box"
                    :mode="2"
                    button="inside"
                    :placeholder="defaultKeyword"
                    @search="doSearch(false)"
                    @input="inputChange"
                    @confirm="doSearch(false)"
                    v-model="keyword"
                ></search-input>
                <!-- 原样式 如果使用原样式，恢复下方注销代码 -->
                <!-- 						
        		<view class="input-box">
        			<input type="text" :adjust-position="true" :placeholder="defaultKeyword" @input="inputChange" v-model="keyword" @confirm="doSearch(false)"
        			 placeholder-class="placeholder-class" confirm-type="search">
        		</view>
        		<view class="search-btn" @tap="doSearch(false)">搜索</view> 
        		 -->
                <!-- 原样式 end -->
            </view>
            <view class="search-keyword">
                <scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
                    <block v-for="(row, index) in keywordList" :key="index">
                        <view class="keyword-entry" hover-class="keyword-entry-tap">
                            <view class="keyword-text" @tap.stop="doSearch(keywordList[index].keyword)"><rich-text :nodes="row.htmlStr"></rich-text></view>
                            <view class="keyword-img" @tap.stop="setKeyword(keywordList[index].keyword)"><image src="/static/HM-search/back.png"></image></view>
                        </view>
                    </block>
                </scroll-view>
                <scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
                    <view class="keyword-block" v-if="oldKeywordList.length > 0">
                        <view class="keyword-list-header">
                            <view>历史搜索</view>
                            <view class="text-df">
                                <text @tap="oldDelete" class="cuIcon-delete"></text>
                                <!-- <image @tap="oldDelete" src="/static/HM-search/delete.png"></image> -->
                            </view>
                        </view>
                        <view class="keyword">
                            <view v-for="(keyword, index) in oldKeywordList" @tap="doSearch(keyword)" :key="index">{{ keyword }}</view>
                        </view>
                    </view>
                    <view class="keyword-block">
                        <view class="keyword-list-header">
                            <view>热门搜索</view>
                            <view class="text-df">
                                <text @tap="hotToggle" class="cuIcon-attention"></text>
                                <!-- <image @tap="hotToggle" :src="'/static/HM-search/attention' + forbid + '.png'"></image> -->
                            </view>
                        </view>
                        <view class="keyword" v-if="forbid == ''">
                            <view v-for="(keyword, index) in hotKeywordList" @tap="doSearch(keyword)" :key="index">{{ keyword }}</view>
                        </view>
                        <view class="hide-hot-tis" v-else><view>当前搜热门搜索已隐藏</view></view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
import searchInput from '@/components/search-input/search-input.vue';

export default {
	data() {
	    return {
	        defaultKeyword: '',
	        keyword: '',
	        oldKeywordList: [],
	        hotKeywordList: [],
	        keywordList: [],
	        forbid: '',
	        isShowKeywordList: false
	    };
	},
    components: {
        searchInput
    },
    onLoad() {
        this.loadData();
    },
    methods: {
        async loadData() {
            this.loadDefaultKeyword();
            this.loadOldKeyword();
            this.loadHotKeyword();
        },
        blur() {
            uni.hideKeyboard();
        },
        //加载默认搜索关键字
        loadDefaultKeyword() {
            //定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
            this.defaultKeyword = '搜索地名/路线...';
        },
        //加载历史搜索,自动读取本地Storage
        loadOldKeyword() {
            uni.getStorage({
                key: 'OldKeys',
                success: (res) => {
                    let OldKeys = JSON.parse(res.data);
                    this.oldKeywordList = OldKeys;
                }
            });
        },
        //加载热门搜索
        loadHotKeyword() {
            //定义热门搜索关键字，可以自己实现ajax请求数据再赋值
            this.hotKeywordList = ['路线', '服务'];
        },
        //监听输入
        inputChange(event) {
            //兼容引入组件时传入参数情况
            let keyword = event.detail ? event.detail.value : event;
            if (!keyword) {
                this.keywordList = [];
                this.isShowKeywordList = false;
                return;
            }
            // this.isShowKeywordList = true;
            //以下示例截取淘宝的关键字，请替换成你的接口
            // uni.request({
            //     url: 'https://suggest.taobao.com/sug?code=utf-8&q=' + keyword, //仅为示例
            //     success: (res) => {
            //         this.keywordList = [];
            //         this.keywordList = this.drawCorrelativeKeyword(res.data.result, keyword);
            //     }
            // });
        },
        //高亮关键字
        drawCorrelativeKeyword(keywords, keyword) {
            let len = keywords.length,
                keywordArr = [];
            for (let i = 0; i < len; i++) {
                let row = keywords[i];
                //定义高亮#9f9f9f
                let html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + '</span>');
                html = '<div>' + html + '</div>';
                let tmpObj = {
                    keyword: row[0],
                    htmlStr: html
                };
                keywordArr.push(tmpObj);
            }
            return keywordArr;
        },
        //顶置关键字
        setKeyword(index) {
            this.keyword = this.keywordList[index].keyword;
        },
        //清除历史搜索
        oldDelete() {
            uni.showModal({
                content: '确定清除历史搜索记录？',
                success: (res) => {
                    if (res.confirm) {
                        // console.log('用户点击确定');
                        this.oldKeywordList = [];
                        uni.removeStorage({
                            key: 'OldKeys'
                        });
                    } else if (res.cancel) {
                        // console.log('用户点击取消');
                    }
                }
            });
        },
        //热门搜索开关
        hotToggle() {
            this.forbid = this.forbid ? '' : '_forbid';
        },
        //执行搜索
        doSearch(keyword) {
            keyword = keyword === false ? this.keyword : keyword;
            this.keyword = keyword;
            if(this.keyword){
                this.saveKeyword(keyword); //保存为历史
            }
            this.zz.toast("暂无搜索结果")
            this.keyword = ''
        },
        //保存关键字到历史记录
        saveKeyword(keyword) {
            uni.getStorage({
                key: 'OldKeys',
                success: (res) => {
                    let OldKeys = JSON.parse(res.data);
                    let findIndex = OldKeys.indexOf(keyword);
                    if (findIndex == -1) {
                        OldKeys.unshift(keyword);
                    } else {
                        OldKeys.splice(findIndex, 1);
                        OldKeys.unshift(keyword);
                    }
                    //最多10个纪录
                    OldKeys.length > 10 && OldKeys.pop();
                    uni.setStorage({
                        key: 'OldKeys',
                        data: JSON.stringify(OldKeys)
                    });
                    this.oldKeywordList = OldKeys; //更新历史搜索
                },
                fail: (e) => {
                    let OldKeys = [keyword];
                    uni.setStorage({
                        key: 'OldKeys',
                        data: JSON.stringify(OldKeys)
                    });
                    this.oldKeywordList = OldKeys; //更新历史搜索
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>

view {
    display: block;
}
.search-box {
    width: 750rpx;
    background-color: rgb(242, 242, 242);
    padding: 15rpx 2.5%;
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0;
}
.search-box .mSearch-input-box {
    width: 100%;
}
.search-box .input-box {
    width: 85%;
    flex-shrink: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
.search-box .search-btn {
    width: 15%;
    margin: 0 0 0 2%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    font-size: 1.4rem;
    color: #fff;
    background: linear-gradient(to right, #ff9801, #ff570a);
    border-radius: 60rpx;
}
.search-box .input-box > input {
    width: 100%;
    height: 60rpx;
    font-size: 1.6rem;
    border: 0;
    border-radius: 60rpx;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0 3%;
    margin: 0;
    background-color: #ffffff;
}
.placeholder-class {
    color: #9e9e9e;
}
.search-keyword {
    width: 100%;
    background-color: rgb(242, 242, 242);
}
.keyword-list-box {
    height: calc(100vh - 110rpx);
    padding-top: 10rpx;
    border-radius: 20rpx 20rpx 0 0;
    background-color: #fff;
}
.keyword-entry-tap {
    background-color: #eee;
}
.keyword-entry {
    width: 94%;
    height: 80rpx;
    margin: 0 3%;
    font-size: 1.5rem;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1rpx #e7e7e7;
}
.keyword-entry image {
    width: 60rpx;
    height: 60rpx;
}
.keyword-entry .keyword-text,
.keyword-entry .keyword-img {
    height: 80rpx;
    display: flex;
    align-items: center;
}
.keyword-entry .keyword-text {
    width: 90%;
}
.keyword-entry .keyword-img {
    width: 10%;
    justify-content: center;
}
.keyword-box {
    height: calc(100vh - 110rpx);
    border-radius: 20rpx 20rpx 0 0;
    background-color: #fff;
}
.keyword-box .keyword-block {
    padding: 10rpx 0;
}
.keyword-box .keyword-block .keyword-list-header {
    width: 94%;
    padding: 10rpx 3%;
    font-size: 27rpx;
    color: #333;
    display: flex;
    justify-content: space-between;
}
.keyword-box .keyword-block .keyword-list-header image {
    width: 40rpx;
    height: 40rpx;
}
.keyword-box .keyword-block .keyword {
    width: 94%;
    padding: 3px 3%;
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
}
.keyword-box .keyword-block .hide-hot-tis {
    display: flex;
    justify-content: center;
    font-size: 1.4rem;
    color: #6b6b6b;
}
.keyword-box .keyword-block .keyword > view {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 60rpx;
    padding: 0 20rpx;
    margin: 10rpx 20rpx 10rpx 0;
    height: 60rpx;
    font-size: 1.4rem;
    background-color: rgb(242, 242, 242);
    color: #6b6b6b;
}
</style>
