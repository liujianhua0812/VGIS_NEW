<template>
    <div class="full-h">
        <div class="calendar-title">
            <el-button class="power-primary" size="small" @click="changeMonthBy(-1)">
                上个月
                <i class="el-icon-arrow-left"></i>
            </el-button>
            <div class="indicator" @click="selectMonth">
                {{currentMonth.format("yyyy年MM月")}}
                <i class="el-icon-arrow-down"></i>
                <el-date-picker class="month-selector" ref="monthSelector" type="month" v-model="currentMonth"></el-date-picker>
            </div>
            <el-button class="power-primary" size="small" @click="changeMonthBy(1)">
                下个月
                <i class="el-icon-arrow-right"></i>
            </el-button>
        </div>
        <div style="height: calc(100% - 84px); overflow-y: scroll;">
            <table class="calendar-table">
                <tr>
                    <th>时间</th>
                    <th v-for="item in currentMonthDays">
                        <div class="week">{{weekMap[item.getDay()]}}</div>
                        <div>{{item.getDate()}}</div>
                    </th>
                </tr>
                <tbody>
                <tr v-for="i in 24">
                    <td class="hour-cell">{{`${i - 1}`.padStart(2, "0")}}:00</td>
                    <td class="event-cell"
                        :style="{ background: visualMap[calendarHeatmap[getCellId(item, i - 1)]] ? visualMap[calendarHeatmap[getCellId(item, i - 1)]] : (calendarHeatmap[getCellId(item, i - 1)] ? visualMap.overflow : 'transparent') }"
                        v-for="item in currentMonthDays"
                        @click="showTaskList(item, i - 1)"
                    >
                        {{calendarHeatmap[getCellId(item, i - 1)] || ""}}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <ShowScheduledTaskDialog
                dialog-id="showScheduledTask"
                v-if="dialogVisibilities.showScheduledTask"
                :dialog-visibility="dialogVisibilities.showScheduledTask"
                :time="currentTime"
                :schedules="selectedTasks"
                @action-finished="actionFinished"
        ></ShowScheduledTaskDialog>
    </div>
</template>

<script>
import ShowScheduledTaskDialog from "@/components/DashboardWidget/Equipment/Schedule/ShowScheduledTaskDialog.vue";
import { getScheduleCalendar } from "@/assets/js/api/automation-schedules";

export default {
    name: "CalendarView",
    props: {
        device: Array
    },
    components: {
        ShowScheduledTaskDialog
    },
    computed: {
        calendarHeatmap () {
            return this.records.reduce((result, schedule) => {
                for(let time in schedule.timetable) {
                    if (!result[time]) {
                        result[time] = 0
                    }
                    result[time] += schedule.timetable[time]
                }
                return result
            }, {})
        },
        currentMonthDays () {
            let month = this.currentMonth.getMonth()
            let result = []
            let days = this.getDays(month)
            for(let i = 0; i < days; i++) {
                result.push(new Date(
                    this.currentMonth.getFullYear(),
                    this.currentMonth.getMonth(),
                    i + 1
                ))
            }
            return result
        }
    },
    watch: {
        device: {
            handler (newValue) {
                this.refreshCalendar()
            },
            deep: true
        }
    },
    data () {
        return {
            currentTime: {},
            currentMonth: new Date(),
            weekMap: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            records: [],
            visualMap: {
                1: "#22075E",
                2: "#391085",
                3: "#531DAB",
                4: "#722ED1",
                5: "#722ED1",
                6: "#B37FEB",
                7: "#FF85C0",
                overflow: "#FF85C0"
            },
            dialogVisibilities: {
                showScheduledTask: false
            },
            selectedTasks: [],
            cellIdFormat: "yyyy-MM-dd hh"
        }
    },
    methods: {
        actionFinished (success, dialogId) {
            this.dialogVisibilities[dialogId] = false
        },
        getCellId (date, hour) {
            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hour
            ).format(this.cellIdFormat)
        },
        getDays (month) {
            let days = [31, 28 + this.isLeapYear(this.currentMonth.getFullYear()), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            return days[month] || 0
        },
        isLeapYear (year) {
            if (year % 4) {
                return false
            }
            if (year % 100) {
                return !!(year % 400);
            }
            return true
        },
        selectMonth () {
            this.$refs.monthSelector.showPicker()
            this.refreshCalendar()
        },
        changeMonthBy(offset) {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + offset)
            this.currentMonth = new Date(this.currentMonth.getTime())
            this.refreshCalendar()
        },
        refreshCalendar () {
            let startAt = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth())
            let endAt = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1)
            endAt.setSeconds(endAt.getSeconds() - 1)
            getScheduleCalendar({ startAt, endAt, device: this.device }).then(result => {
                this.records = result.data
            })
        },
        showTaskList (date, hour) {
            if (this.calendarHeatmap[this.getCellId(date, hour)]) {
                this.currentTime = {
                    date, hour
                }
                this.selectedTasks = this.records.filter(item => item.timetable[this.getCellId(date, hour)]).map(item => item.info)
                this.dialogVisibilities.showScheduledTask = true
            }
        }
    },
    created() {
        this.refreshCalendar()
    }
}
</script>

<style scoped>
.calendar-title {
    padding: 12px;
    background: #003A8C;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .month-selector {
        position: absolute;
        z-index: -1;
    }

    .indicator {
        display: flex;
        align-items: center;
        color: #FFFFFF;
        text-align: center;
        font-family: "HarmonyOS Sans SC";
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        cursor: pointer;

        i {
            color: #BFBFBF;
            font-size: 14px;
            margin-left: 8px;
        }
    }
}
</style>