<template>
  <div>
    <div class="card-list" ref="content">
      <highcharts :options="chartOptions" :callback="myCallback"></highcharts>
    </div>
    <a-card :bordered="true" style="margin-top: 20px">
      <!-- table -->
      <a-table
        id="table"
        :loading="loading"
        :columns="columns"
        :pagination="pagination"
        :dataSource="loadData"
        @change="handleChange"
      >
        <span slot="status" slot-scope="status, record">
          <a-tag :color="'green'">{{ record.packetType }}</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-tag @click="handleEdit(record)">修改</a-tag>
            <a-popconfirm title="你想删除这条记录吗？" ok-text="Yes" cancel-text="No" @confirm="handleDelete(record)">
              <a-tag color="orange">删除</a-tag>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import Highcharts from 'highcharts-vue'
import { Chart } from 'highcharts-vue'
import { GetPacketList, GetPacketNumsPerSecond } from '@/api/packet'

const columns = [
  { title: '创建时间', dataIndex: 'createTime', width: '200px' },
  { title: 'clientId', dataIndex: 'clientId' },
  { title: '报文号', dataIndex: 'packetId' },
  { title: '报文类型', dataIndex: 'packetType', scopedSlots: { customRender: 'status' } },
  { title: 'Topic', dataIndex: 'topic' },
  { title: 'Qos', dataIndex: 'qos' },
  { title: '报文信息', dataIndex: 'packetInfo' },
]

export default {
  name: 'Packet',
  components: {
    highcharts: Chart,
  },
  computed: {
    columns() {
      let { sortedInfo, filteredInfo } = this
      sortedInfo = sortedInfo || {}
      filteredInfo = filteredInfo || {}
      return columns
    },
  },
  data() {
    return {
      loading: true,
      loadData: [],
      // 查询参数
      queryParam: {},
      pagination: {
        total: 0,
        pageSize: 10,
        defaultPageSize: 10,
        defaultCurrent: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '40'],
      },
      chartOptions: {
        chart: {
          type: 'spline',
          animation: Highcharts.svg,
          marginRight: 10,
          events: {
            load: function () {
              var series = this.series[0]
              setInterval(async function () {
                var data = []
                var now = new Date().getTime()
                await GetPacketNumsPerSecond({ t: now }).then((res) => {
                  data = res.result
                })
                console.log(data)
                series.addPoint([now, data.y], true, true)
              }, 2000)
            },
          },
        },
        time: {
          useUTC: false,
        },
        title: {
          text: '报文监控',
        },
        accessibility: {
          announceNewData: {
            enabled: true,
            minAnnounceInterval: 15000,
            announcementFormatter: function (allSeries, newSeries, newPoint) {
              if (newPoint) {
                return 'New point added. Value: ' + newPoint.y
              }
              return false
            },
          },
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
        },
        yAxis: {
          title: {
            text: '报文情况',
          },
          plotLines: [
            {
              value: 0,
              width: 1,
              color: '#808080',
            },
          ],
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/><b>{point.y:.2f}</b>',
        },
        legend: {
          enabled: false,
        },
        exporting: {
          enabled: false,
        },
        series: [
          {
            name: '报文数目',
            data: (function () {
              var data = []
              var time = new Date().getTime()
              for (var i = -19; i <= 0; i += 1) {
                data.push({
                  x: time + i * 1000,
                  y: 0,
                })
              }
              return data
            })(),
          },
        ],
      },
    }
  },
  created() {
    this.fetchData({})
  },
  methods: {
    async fetchData(queryParam) {
      await GetPacketList(queryParam).then((res) => {
        this.loadData = res.result.data
        this.pagination.total = res.result.total
      })
      this.loading = false
    },
    myCallback() {
      console.log('this is callback function')
    },
    handleChange(pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter)
      this.queryParam.page = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.fetchData(this.queryParam)
    },
  },
}
</script>

<style lang="less" scoped></style>
