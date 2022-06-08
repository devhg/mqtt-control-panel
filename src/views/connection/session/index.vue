<template>
  <a-card :bordered="false">
    <!-- table -->
    <a-table
      bordered
      id="table"
      :loading="loading"
      :columns="columns"
      :pagination="pagination"
      rowKey="clientId"
      :dataSource="loadData"
    >
      <span slot="status" slot-scope="status, record">
        <a-tag :color="record.status == 'active' ? 'green' : 'volcano'">{{ record.status }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-popconfirm title="暂不支持查看遗嘱" ok-text="Yes" cancel-text="No">
            <a-tag>遗嘱</a-tag>
          </a-popconfirm>
          <a-popconfirm
            title="你想强制下线这个客户端吗？"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleDelete(record.clientId)"
          >
            <a-tag color="orange">下线</a-tag>
          </a-popconfirm>
        </template>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import { GetSessionList, SessionLogout } from '@/api/session'

const columns = [
  { title: '客户端ID', dataIndex: 'clientId' },
  { title: 'BrokerID', dataIndex: 'brokerId' },
  { title: 'channelID', dataIndex: 'channelId', customRender: (text, record) => `${text}` },
  { title: 'keep-alive', dataIndex: 'expire' },
  { title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
  { title: 'cleanSession', dataIndex: 'cleanSession', customRender: (text, record) => `${text}` },
  { title: 'willMessage', dataIndex: 'willMessage', customRender: (text, record) => `${text}` },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SessionList',
  computed: {
    columns() {
      return columns
    }
  },
  data() {
    return {
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { offset: 1, span: 16 }
      },

      // 查询参数
      pagination: {
        pageSize: 10,
        defaultPageSize: 10,
        defaultCurrent: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '40']
      },
      loading: true,
      // 加载数据方法 必须为 Promise 对象
      loadData: []
    }
  },
  created() {
    this.fetchData({})
  },
  methods: {
    async handleDelete(clientId) {
      await SessionLogout({ clientId: clientId })
        .then(res => {
          this.$message.info(res.result)
        })
        .catch(e => {
          this.$message.error(`未知错误`)
        })
      this.fetchData({})
    },
    async fetchData(param) {
      this.loading = true
      await GetSessionList()
        .then(res => {
          this.loadData = res.result
        })
        .catch(e => {
          this.$message.error(`未知错误`)
        })
      this.loading = false
    },
    handleOk() {
      this.$refs.table.refresh()
    }
  }
}
</script>
