<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="7" :sm="24">
            <a-form-item label="业务线">
              <a-input placeholder="如：group.6.sdutcs.cn" v-model="queryParam.groupName" />
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <a-form-item label="操作人">
              <a-input placeholder="如：zhangyuan03" v-model="queryParam.opUser" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="fetchData(queryParam)">
                查询
                <a-icon type="zoom-in" />
              </a-button>
              <a-button style="margin-left: 8px" @click="() => (queryParam = {})">
                重置
                <a-icon type="redo" />
              </a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons" :style="{}">
              <a-button type="primary">
                <router-link :to="'/client/register'">
                  新增
                  <a-icon type="plus" />
                </router-link>
              </a-button>
              <a-popconfirm title="暂不支持导出，后续支持" ok-text="Yes" cancel-text="No">
                <a-button style="margin-left: 8px">
                  导出
                  <a-icon type="switcher" />
                </a-button>
              </a-popconfirm>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table -->
    <a-table
      bordered
      id="table"
      :loading="loading"
      :columns="columns"
      :pagination="pagination"
      rowKey="id"
      :dataSource="loadData"
      @change="handleChange"
    >
      <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-table
          id="subs"
          :columns="subColumns"
          :pagination="false"
          :dataSource="record.subscribeStores"
          rowKey="clientId"
        ></a-table>
      </p>
      <span slot="topic" slot-scope="text">
        <template>
          <a-tag color="cyan">{{ text }}</a-tag>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <router-link :to="{ path: '/subscribe/wsMqtt', query: { topic: record.topic } }">
            <a-tag>发送</a-tag>
          </router-link>

          <a-popconfirm
            title="你想下线这个Topic吗？"
            ok-text="暂不支持"
            cancel-text="暂不支持"
            @confirm="handleDelete(record)"
          >
            <a-tag color="orange">下线</a-tag>
          </a-popconfirm>
        </template>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'

import CreateForm from '@/views/list/modules/CreateForm'
import { getTopicList } from '@/api/manage'

const columns = [
  { title: '记录编号', dataIndex: 'id', sorter: (a, b) => a.id - b.id },
  { title: '类型', dataIndex: 'type' },
  { title: 'Topic', dataIndex: 'topic', scopedSlots: { customRender: 'topic' } },
  { title: '订阅数量', dataIndex: 'count' },
  {
    title: '创建时间',
    dataIndex: 'updateTime',
    sorter: (a, b) => a.updateTime - b.updateTime,
    customRender: val => {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

const subColumns = [
  { title: '客户端id', dataIndex: 'clientId' },
  { title: '订阅过滤器', dataIndex: 'topicFilter' },
  { title: 'Qos', dataIndex: 'mqttQoS' }
]

export default {
  name: 'TopicList',
  components: {
    CreateForm
  },
  computed: {
    columns() {
      return columns
    },
    subColumns() {
      return subColumns
    }
  },
  data() {
    return {
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { offset: 1, span: 16 }
      },

      // 查询参数
      queryParam: {
        page: 1,
        pageSize: 10
      },
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
    this.fetchData(this.queryParam)
  },
  methods: {
    async handleDelete(data) {
      console.log(data)
      await DeleteClient({ id: data.id })
        .then(res => {
          this.$message.info(res.result)
        })
        .catch(e => {
          this.$message.error(`记录更新失败`)
        })
      this.fetchData({})
    },
    async fetchData(param) {
      this.loading = true
      await getTopicList(param)
        .then(res => {
          this.loadData = res.result
          console.log(this.loadData)
        })
        .catch(e => {
          this.$message.error(`未知错误`)
        })
      this.loading = false
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    handleChange(pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter)
      this.queryParam.page = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.fetchData(this.queryParam)
    }
  }
}
</script>
