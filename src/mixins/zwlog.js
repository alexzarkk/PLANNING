
import zwLogUtils from '@/comm/zwLogUtils'
export default {
    onShow() {
        // console.warn("onShow ---------------------------mixin-----------------", this.$route)
        this.addZwLog(this)
    },
    data() {
        return {};
    },
    methods: {
        addZwLog(_this) {
            // 加载时间
            let obj1 = {
                _this: _this,
                loadTime: new Date()  // 页面加载完成
            }
            zwLogUtils.addZwLogPage(obj1)

            // 相应时间
            _this.$nextTick(() => {
                let obj2 = {
                    _this: _this,
                    responseTime: new Date()  // Dom 加载完毕，页面响应时间
                }
                zwLogUtils.addZwLogPage(obj2)
            })
        }
    }
}