<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="连接数" :total="metrics.curConnNum | NumberFormat">
          <a-tooltip title="当前连接的数量" slot="action">
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
            最大连接数
            <span>{{ metrics.maxConnNum | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="日访问量" :total="metrics.reqNum | NumberFormat">
          <a-tooltip :title="'上次访问时间 ' + metrics.lastReceiveTime" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :data="requestCountData" />
          </div>
          <template slot="footer">
            日均访问量
            <span>{{ metrics.reqAvg | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="报文数量" :total="metrics.packetNum | NumberFormat">
          <a-tooltip :title="'上次发送时间 ' + metrics.lastSentTime" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar :data="packetCountData" />
          </div>
          <template slot="footer">
            平均报文数
            <span>{{ metrics.packetAvg }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="资源利用率" :total="metrics.cpu + '%'">
          <a-tooltip title="CPU资源利用率" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="50" :percentage="parseFloat(metrics.cpu)" height="8px" />
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

    <a-card :loading="loading" :bordered="false">
      <div class="salesCard">
        <a-card>
          <a-descriptions title="系统信息" bordered>
            <a-descriptions-item label="实例id">
              {{ info.id }}
            </a-descriptions-item>
            <a-descriptions-item label="Addr地址">
              {{ info.hostAndPort }}
            </a-descriptions-item>
            <a-descriptions-item label="用户名">
              admin
            </a-descriptions-item>
            <a-descriptions-item label="邮箱">
              admin@mqtt.com
            </a-descriptions-item>
            <a-descriptions-item label="SSL机密">
              <a-tag color="cyan">{{ info.sslEnabled == true ? 'ON' : 'OFF' }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Websocket协议">
              <a-tag color="cyan">{{ info.wsEnabled == true ? 'ON' : 'OFF' }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="密码验证">
              <a-tag color="cyan">{{ info.mqttPasswordMust == true ? 'ON' : 'OFF' }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Kafka是否开启">
              <a-tag color="cyan">{{ info.kafkaBrokerEnabled == true ? 'ON' : 'OFF' }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Kafka Topic">
              <a-tag color="cyan">{{ info.kafkaProducerTopic }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="soBacklog">
              <a-tag color="cyan">{{ info.soBacklog }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="soKeepAlive">
              <a-tag color="cyan">{{ info.soKeepAlive == true ? 'ON' : 'OFF' }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Status">
              <a-badge status="processing" text="运行中" />
            </a-descriptions-item>
            <a-descriptions-item label="系统信息">
              <div v-for="(value, key) in info.runtime" :key="key">
                <a-tag>{{ key }}</a-tag>
                :
                <a-tag style="margin: 5px;" color="cyan">{{ value }}</a-tag>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { ChartCard, MiniArea, MiniBar, MiniProgress, Bar, Trend, NumberInfo, MiniSmoothArea } from '@/components'
// import { mixinDevice } from '@/utils/mixin'

import { getClusterInfo, getClusterMetrics } from '@/api/manage'

// const DataSet = require('@antv/data-set')

// const sourceData = [
//   { item: '家用电器', count: 32.2 },
//   { item: '食用酒水', count: 21 },
//   { item: '个护健康', count: 17 },
//   { item: '服饰箱包', count: 13 },
//   { item: '母婴产品', count: 9 },
//   { item: '其他', count: 7.8 }
// ]

// const pieScale = [
//   {
//     dataKey: 'percent',
//     min: 0,
//     formatter: '.0%'
//   }
// ]

// const dv = new DataSet.View().source(sourceData)
// dv.transform({
//   type: 'percent',
//   field: 'count',
//   dimension: 'item',
//   as: 'percent'
// })
// const pieData = dv.rows

export default {
  name: 'Analysis',
  //   mixins: [mixinDevice],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data() {
    return {
      requestNum: 23412,
      packetNum: 230412,
      connectionSum: 1678,
      //   loadPercent: '78%',
      loading: true,

      // 访问量数据
      requestCountData: [],
      // 报文数据
      packetCountData: [],

      metrics: {
        cpu: 0
      },

      info: {}
      //   pieScale,
      //   pieData,
      //   pieStyle: {
      //     stroke: '#fff',
      //     lineWidth: 1
      //   }
    }
  },
  async created() {
    this.fetchData()
    var that = this
    setInterval(async function() {
      await getClusterMetrics().then(res => {
        that.metrics = res.result
        that.requestCountData = that.metrics.reqNumOfDays
        that.packetCountData = that.metrics.packetNumOfDays
        console.log(that.metrics)
      })
    }, 2000)
    // this.initRequestData()
    // this.initPacketCountData()
  },
  methods: {
    async fetchData() {
      await getClusterInfo().then(res => {
        this.info = res.result
      })

      this.loading = !this.loading
    },
    initRequestData() {
      var test = []
      const beginDay = new Date().getTime()
      for (let i = 0; i < 10; i++) {
        test.push({
          x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
          y: Math.round(Math.random() * 10000)
        })
      }
      this.requestCountData = test
    },
    initPacketCountData() {
      var data = []
      const beginDay = new Date().getTime()
      for (let i = 0; i < 10; i++) {
        data.push({
          x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
          y: Math.round(Math.random() * 10000)
        })
      }
      this.packetCountData = data
    }
  }
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
