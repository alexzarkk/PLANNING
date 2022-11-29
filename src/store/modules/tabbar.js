export default {
    state: {
        navList: [{
            iconPath: "@/static/bar/discover_.png",
            selectedIconPath: "@/static/bar/discover.png",
            text: '首页',
            customIcon: false,
            pagePath: '/pages/index/index',
        },
        {
            iconPath: "@/static/bar/nav_.png",
            selectedIconPath: "@/static/bar/nav.png",
            text: '行程',
            customIcon: false,
            pagePath: '/pages/index/planning',
        },
        {
            iconPath: "",
            selectedIconPath: "",
            text: '活动',
            customIcon: false,
            pagePath: '/pages/index/event',
        },
        {
            iconPath: "",
            selectedIconPath: "",
            text: '我的',
            customIcon: false,
            pagePath: '/pages/index/me',
        },
        ],
    }
}