<template>
  <view>
    <cu-custom bgColor="bg-ztsblue" :isBack="true">
      <block slot="backText"></block>
      <block slot="content">个人设置</block>
    </cu-custom>
    <view class="page-home">
      <view>
        <view class="uni-list-match">
          <view class="title"><span>*</span>姓名</view>
          <input
            class="uni-input"
            v-model="data.name"
            placeholder="请输入姓名"
          />
        </view>
        <view class="uni-list-match uni-list-matchtwo">
          <view class="title"><span>*</span>性别</view>
          <view class="nn">
            <view
              class="nan"
              :class="data.sex == '1' ? 'nv' : ''"
              @click="changexb('1')"
              >男</view
            >
            <view
              class="nan"
              :class="data.sex == '2' ? 'nv' : ''"
              @click="changexb('2')"
              >女</view
            >
          </view>
        </view>
        <view
          class="uni-list-match"
          style="justify-content: space-between; height: 120rpx"
        >
          <view class="title"><span>*</span>头像</view>
          <view class="img" @tap="upclo">
            <image v-if="data.ava" :src="data.ava"></image>
            <view v-else style="color: #999999; font-size: 2rem">+</view>
          </view>
        </view>
        <picker mode="date" :value="data.birthday" @change="bindbirthdayChange">
          <view class="uni-list-match uni-list-matchtwo">
            <view class="title"><span>*</span>生日</view>
            <view
              >{{ data.birthday || "" }}<span class="cuIcon-xiangyoudan"></span
            ></view>
          </view>
        </picker>

        <view class="uni-list-match">
          <view class="title"><span>*</span>手机号</view>
          <view class="value">
            <view class="phone">{{ data.tel || "" }}</view>
            <button
              open-type="getPhoneNumber"
              @getphonenumber="getPhoneNumber"
              class="certification"
            >
              {{ !data.tel ? "更新" : "授权" }}
            </button>
          </view>
        </view>
        <view class="uni-list-match">
          <view class="title"><span>*</span>邮箱</view>
          <input
            class="uni-input"
            v-model="data.email"
            placeholder="请输入邮箱"
          />
        </view>
      </view>
      <tui-footer
        :copyright="bd.sys.footer.content"
        :fixed="false"
        :navigate="bd.sys.footer.navigate"
        tui-footer-class="tui-custom"
      ></tui-footer>
      <tui-scroll-top :scrollTop="scrolled"></tui-scroll-top>
      <view class="butt" @click="singup">保存</view>
    </view>
  </view>
</template>

<script>
import pickRegions from "@/components/uni/pick-regions/pick-regions.vue";
export default {
  components: { pickRegions },
  data() {
    return {
      bd: this.bd,
      scrolled: 0,
      data: {
        name: "", //姓名
        sex: 1, //性别
        birthday: "", //生日
        tel: "", //手机号
        email: "", //邮箱
        ava: "",
      },
      datatip: {
        name: "请输入姓名", //姓名
        sex: "请选择性别", //性别
        birthday: "请选择生日", //生日
        tel: "请输入手机号", //手机号
        email: "请输入邮箱", //邮箱
        ava: "请输入头像", //邮箱
      },
      name: "",
      code: "",
    };
  },
  async onLoad() {
    const user = this.zz.getAcc();
    this.data = user;
    this.getCode();
  },
  methods: {
    async upclo() {
      const imgres = await this.zz.uploadImg();
      this.data.ava = imgres.data;
    },
    bindbirthdayChange(e) {
      this.data.birthday = e.target.value;
    },
    changexb(e) {
      this.data.sex = e;
    },
    async getCode() {
      const code = await this.zz.getCode();
      this.code = code;
    },
    async getPhoneNumber(e) {
      if (e.detail.errMsg != "getPhoneNumber:ok")
        return uni.showToast({ title: "授权失败！", icon: "none" });

      const res = await this.zz.req({
        url: "savePhone",
        data: {
          data: e.detail.encryptedData,
          iv: e.detail.iv,
          code: this.code,
        },
      });

      await this.getCode();
      if (res.code == 1000) {
        uni.showToast({ title: "获取成功！" });
        this.data.tel = res.data || "";
      } else uni.showToast({ title: res.message, icon: "none" });
    },
    async singup() {
      const isEmpty = Object.entries(this.datatip).find(
        (x) => !this.data[x[0]]
      );
      if (isEmpty) {
        uni.showToast({
          title: isEmpty[1],
          duration: 2000,
          icon: "none",
        });
        return;
      }
      const res = await this.zz.req({
        url: "saveUser",
        data: { ...this.data },
        method: "post",
        loadding: true,
      });
      console.log(res);
      if (res.code == 1000) {
        this.zz.setAcc(res.data);
        uni.redirectTo({ url: "/pages/my/my" });
        uni.showToast({ title: "保存成功！" });
      } else if (res.code == 1001) {
        uni.showModal({
          content: res.message,
          showCancel: false,
        });
      }
      // const res = await this.zz.req('match/match/matchItemList',{...this.data});
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #f0f0f0;
}
.page-home {
  padding: 28rpx;
  background-color: #f0f0f0;
  padding-bottom: 140rpx;
}
.titlet {
  margin: 20rpx 20rpx;
}
.uni-list-match {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  height: 80rpx;
  line-height: 80rpx;
  padding-left: 28rpx;
  padding-right: 28rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  .title {
    font-bodysize: 28rpx;
    white-space: nowrap;
    padding: 0;
    width: 100rpx;
    border: 2rpx;
    span {
      color: red;
    }
  }
  .img {
    height: 100rpx;
    width: 100rpx;
    text-align: center;
    line-height: 100rpx;
    border: 1px dashed #99aaaa;
    flex-shrink: 0;
    image {
      height: 100rpx;
      width: 100rpx;
    }
  }
  .uni-input {
    display: inline-block;
    margin-right: 25rpx;
    background-color: initial;
    flex: 1;
    text-align: right;
    color: black;
  }
}
.uni-list-matchtwo {
  justify-content: space-between;
  .nn {
    display: flex;
    align-items: center;
    .nan {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      border: 1px solid #e2e2e2;
      font-bodysize: 28rpx;
    }
    .nv {
      border: 1px solid #0081ff;
      // background-color: red;
    }
  }
}
.butt {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  color: #ffffff;
  width: 90%;
  margin: 20rpx auto;
  background-color: #0081ff;
  border-radius: 14rpx;
}
.value {
  display: flex;
  flex: 1;
  align-items: center;
  .phone {
    flex: 1;
    text-align: right;
  }
  .certification {
    background-color: #0081ff;
    font-size: 1.4rem;
    width: 120rpx;
    margin-left: 20rpx;
    color: #fff;
    height: 60rpx;
    line-height: 60rpx;
  }
}
</style>
