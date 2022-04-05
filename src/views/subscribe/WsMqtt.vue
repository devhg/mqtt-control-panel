<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="11">
        <a-alert message="不支持类似 test/# 的模糊匹配" banner />
        <br />
        <a-input addon-before="Topic" v-model="topic" />
        <div style="margin: 24px 0" />
        <a-button type="primary" icon="poweroff" @click="subscribe(topic)">
          订阅信息
        </a-button>
        <a-button style="margin-left: 10px" type="primary" icon="poweroff" @click="unsubscribe(topic)">
          取消订阅
        </a-button>

        <div style="margin: 24px 0">
          <a-textarea v-model="msg" placeholder="请输入要发送的消息" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </div>

        <a-button type="primary" icon="upload" @click="send(topic, msg)">
          发送消息
        </a-button>
      </a-col>
      <a-col :sm="24" :md="12" :xl="1"></a-col>
      <a-col :sm="24" :md="12" :xl="12">
        <div>
          连接状态：
          <a-tag>
            {{ status }}
          </a-tag>
        </div>
        <div style="margin: 24px 0;">
          收到的信息:
          <a-textarea v-model="getMsg" :auto-size="{ minRows: 5, maxRows: 6 }" />
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import mqtt from 'mqtt'

// https://juejin.cn/post/6844904084525285390
const options = {
  connectTimeout: 40 * 1000, // 超时时间 默认 30 * 1000毫秒，收到 CONNACK 之前等待的时间，即连接超时时间
  reconnectPeriod: 60 * 1000,
  qos: 0,
  keepalive: 20, // 心跳时间，默认 60秒，设置 0 为禁用
  clean: true, // 设置为 false 在离线时接收 QoS 1 和 2 消息
  clientId: 'abc123wefsa234ddffefe', // 客户端Id 注册成功后返回的clientId
  username: 'devhg', // 连接用户名 注册成功后返回的username
  password: '1dfeefwfsfdfec3f54119fabc123' // 连接密码 注册成功后返回的password
}

// ip：注册成功后返回的ip、端口：8083(非加密连接 ws:)、8084(加密连接 wss:)，此项目使用8083端口
const client = mqtt.connect('ws://127.0.0.1:9995/ws', options)

client.on('reconnect', error => {
  console.log('正在重连:', error)
})

client.on('error', error => {
  console.log('连接失败:', error)
})

export default {
  name: 'Mqtt',
  data() {
    return {
      loading: true,
      msg: '',
      getMsg: '',
      status: '未连接',
      topic: 'testtopic/admin'
    }
  },
  created() {
    this.topic = this.$route.query.topic || this.topic
    // 连接成功后进行订阅、发布信息
    client.on('connect', e => {
      console.log(e || '连接成功')
      this.status = '已连接'
    })

    // 接收消息
    client.on('message', (topic, message) => {
      console.log('收到消息', message.toString())
      //   const response = JSON.parse(message.toString())
      this.getMsg = message.toString()
      this.$message.info('收到消息')
    })
  },
  methods: {
    subscribe(topic) {
      if (client.connected) {
        client.subscribe(topic, error => {
          console.log(error || '订阅成功')
          this.$message.info(`订阅${topic}成功`)
        })
      }
    },
    unsubscribe(topic) {
      if (client.connected) {
        client.unsubscribe(topic, error => {
          console.log(error || '取消订阅')
          this.$message.info(`取消订阅${topic}成功`)
        })
      }
    },
    send(topic, msg) {
      if (msg.length > 0) {
        client.publish(topic, msg, error => {
          console.log(error || topic + '消息发布成功')
        })
      } else {
        this.$message.error('发送的消息不能为空')
      }
    }
  }
}
</script>
