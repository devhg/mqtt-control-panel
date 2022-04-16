<template>
  <page-view :title="title">
    <a-card :loading="loading">
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
        <a-descriptions-item label="Status" :span="3">
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
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { getClusterInfo } from '@/api/manage'

export default {
  components: {
    PageView
  },
  data() {
    return {
      info: [],
      loading: true
    }
  },
  created() {
    getClusterInfo().then(res => {
      this.info = res.result
      this.loading = !this.loading
    })
  },
  methods: {},
  computed: {
    title() {
      return this.$route.meta.title
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
