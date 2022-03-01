<template>
  <div class="card-list" ref="content">
    <highcharts :options="chartOptions" :callback="myCallback"></highcharts>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue'

export default {
  name: 'Packet',
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'spline',
          animation: Highcharts.svg,
          marginRight: 10,
          events: {
            load: function () {
              var series = this.series[0]
              setInterval(function () {
                const x = new Date().getTime() // current time
                const y = Math.random() * 1000
                console.log(x, y)
                series.addPoint([x, y], true, true)
              }, 1500)
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
                  y: Math.random() * 1000,
                })
              }
              return data
            })(),
          },
        ],
      },
    }
  },
  methods: {
    myCallback() {
      console.log('this is callback function')
    },
  },
}
</script>

<style lang="less" scoped></style>
