/*
 * @Author: InsHomePgup
 * @Date: 2022-06-14 09:16:57
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-14 15:32:59
 * @FilePath: \sport-planing\src\store\modules\timeCount.js
 * @Description:
 *
 *
 */
export default {
    state: {
        recordStatus: 0, //  0 准备 ，未开始挑战  1  挑战记录中  2. 挑战成功,可领取证书
        timer: null,
        timeCount: {
            // 格式化后计时器时间
            day: '00',
            hour: '00',
            minute: '00',
            second: '00'
        },
        seconds: 0 // 记录的时长
    },
    mutations: {
        // 格式化计时器时间
        setTime(state) {
            try {
                let seconds = state.seconds;
                let [day, hour, minute, second] = [0, 0, 0, 0];
                day = Math.floor(seconds / (60 * 60 * 24));
                hour = Math.floor(seconds / (60 * 60)) - day * 24;
                let showHour = null;
                if (false) {
                    // showDays
                    showHour = hour;
                } else {
                    showHour = Math.floor(seconds / (60 * 60));
                }
                minute = Math.floor(seconds / 60) - hour * 60 - day * 24 * 60;
                second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
                showHour = showHour < 10 ? '0' + showHour : showHour;
                minute = minute < 10 ? '0' + minute : minute;
                second = second < 10 ? '0' + second : second;
                day = day < 10 ? '0' + day : day;
                state.timeCount.day = day;
                state.timeCount.hour = showHour;
                state.timeCount.minute = minute;
                state.timeCount.second = second;
            } catch (err) {
                console.error('timeFormat error========', err);
            }
        },
        removeTimer(state) {
            clearInterval(state.timer);
            state.timer = null;
        },
        changeRecordStatus(state, { recordStatus }) {
            state.recordStatus = recordStatus;
        }
    },
    actions: {
        // 开始记录时间
        recordTime({ state, commit }) {
            state.recordStatus = 1;
            state.timer = setInterval(() => {
                state.seconds++;
                // console.log("时间记录====", state.seconds)
                commit('setTime');
            }, 1000);

            // console.log("开始时间记录", state.recordTimer)
        },
        endRecord({ state, commit }) {
            state.recordStatus = 2;
            commit('removeTimer');
        }
    }
};
