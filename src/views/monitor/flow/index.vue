<template>
  <div>
    <div class="card-list" ref="content">
      <highcharts :options="chartOptions" :callback="myCallback"></highcharts>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts-vue'
import { Chart } from 'highcharts-vue'
import { GetQpsInfo } from '@/api/packet'

export default {
  name: 'Packet',
  components: {
    highcharts: Chart
  },
  data() {
    return {
      data: [],
      chartOptions: {
        chart: {
          type: 'spline',
          animation: Highcharts.svg,
          marginRight: 10,
          events: {
            load: function() {
              var series = this.series[0]
              setInterval(async function() {
                var data = []
                var now = new Date().getTime()
                await GetQpsInfo({ t: now - 10000 }).then(res => {
                  data = res.result
                })
                console.log(data)
                series.addPoint([now, data.y], true, true)
              }, 1000)
            }
          }
        },
        time: {
          useUTC: false
        },
        title: {
          text: '流量监控'
        },
        accessibility: {
          announceNewData: {
            enabled: true,
            minAnnounceInterval: 15000,
            announcementFormatter: function(allSeries, newSeries, newPoint) {
              if (newPoint) {
                return 'New point added. Value: ' + newPoint.y
              }
              return false
            }
          }
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            text: 'Qps'
          },
          plotLines: [
            {
              value: 0,
              width: 1,
              color: '#898980'
            }
          ]
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/><b>{point.y:.2f}</b>'
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [
          {
            name: '报文数目',
            data: (function() {
              var data = []
              var time = new Date().getTime()
              for (var i = -19; i <= 0; i += 1) {
                data.push({
                  x: time + i * 1000,
                  y: 0
                })
              }
              return data
            })()
          }
        ]
      }
    }
  },
  created() {
    // this.fetchData({})
    // this.chartOptions.chart.events.load = this.event
  },
  methods: {
    async fetchData(seconds) {
      //   await GetQpsInfo({ seconds: 19 }).then((res) => {
      //     this.data = res.result
      //   })
      //   this.chartOptions.series[0].data = this.data
    },
    myCallback() {
      console.log('this is callback function')
    }
  }
}
</script>

<style lang="less" scoped></style>
