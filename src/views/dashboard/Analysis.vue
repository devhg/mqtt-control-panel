<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总成绩单数" :total="sum | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px">
              <span slot="term">周同比</span>
              0%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              0%
            </trend>
          </div>
          <template slot="footer">
            日均成绩单
            <span>40</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="课程数目量" :total="cNum | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">
            日访问量
            <span>{{ '1234' | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="优秀人数" :total="goodNum | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">
            转化率
            <span>60%</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="及格率" :total="pass">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <!-- <a>今日</a>
              <a>本周</a>
              <a>本月</a>
              <a>本年</a> -->
              <a-input-search
                style="width: 300px; margin-top: 10px"
                placeholder="输入课程名如：python"
                enter-button
                @search="onSearch"
              />
            </div>
            <a-range-picker :style="{ width: '256px' }" />
          </div>

          <a-tab-pane loading="true" tab="成绩分析" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData" title="成绩分布" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="班级及格率排行" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- <a-tab-pane tab="java程序设计" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData2" title="成绩分布" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="班级及格率排行" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane> -->
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea,
} from '@/components'
import { mixinDevice } from '@/utils/mixin'

// const barData = []
// const barData2 = []
// for (let i = 0; i < 12; i += 1) {
//   barData.push({
//     x: `${i + 1}月`,
//     y: Math.floor(Math.random() * 1000) + 200,
//   })
//   barData2.push({
//     x: `${i + 1}月`,
//     y: Math.floor(Math.random() * 1000) + 200,
//   })
// }

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '计科180' + (i + 1) + '班',
    total: 1234.56 - i * 100,
  })
}

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10),
  })
}
const DataSet = require('@antv/data-set')

const sourceData = [
  { item: '家用电器', count: 32.2 },
  { item: '食用酒水', count: 21 },
  { item: '个护健康', count: 17 },
  { item: '服饰箱包', count: 13 },
  { item: '母婴产品', count: 9 },
  { item: '其他', count: 7.8 },
]

const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%',
  },
]

const dv = new DataSet.View().source(sourceData)
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent',
})
const pieData = dv.rows

import { StudentAnalysis, StudentAnalysisCourse } from '@/api/manage'

export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
  },
  data() {
    return {
      goodNum: 2,
      cNum: 2,
      sum: 1,
      pass: '0%',
      loading: true,
      rankList,

      barData: [],
      barData2: [],

      //
      pieScale,
      pieData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1,
      },
    }
  },
  created() {
    // this.loading = !this.loading
    StudentAnalysis()
      .then((res) => {
        console.log(res)
        this.cNum = res.cNum
        this.goodNum = res.goodNum
        this.sum = res.sum
        this.pass = Math.round((res.gt60 / res.sum) * 100) + '%'
      })
      .catch((e) => {
        this.$message.error('网络异常')
      })
    this.loading = !this.loading
    // setTimeout(() => {
    //   this.loading = !this.loading
    // }, 1000)
    this.getCourse('python程序设计')
    // this.getCourse('java程序设计')
  },
  methods: {
    onSearch(value) {
      console.log(value)
      this.getCourse(value)
    },
    getCourse(course) {
      var that = this
      StudentAnalysisCourse({ course: course })
        .then((res) => {
          var l = ['不合格<60', '中等60-70', '良好70-90', '优秀>90']
          this.barData = []
          for (var i in l) {
            this.barData.push({
              x: l[i],
              y: res[l[i]],
            })
          }
        })
        .catch((e) => {
          this.$message.error('网络异常')
        })
    },
  },
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
