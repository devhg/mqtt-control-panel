<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户编号">
              <a-input v-model="queryParam.userId" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="用户姓名">
              <a-input v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="{ float: 'left', overflow: 'hidden' } || {}">
              <a-button type="primary" @click="handleSubmit()">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table :loading="loading" :columns="columns" :pagination="pagination" rowKey="onTime" :dataSource="loadData">
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">详情</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">标记</a>
        </template>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { getFitness, searchFitness } from '@/api/manage'

export default {
  name: 'TableList',
  components: {},
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '用户Id',
          dataIndex: 'userId',
        },
        {
          title: '用户姓名',
          dataIndex: 'name',
        },
        {
          title: '开始时间',
          dataIndex: 'onTime',
          sorter: true,
          customRender: (val) => {
            return moment(val).format('YYYY-MM-DD HH:mm:ss')
          },
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          sorter: true,
          customRender: (val) => {
            return moment(val).format('YYYY-MM-DD HH:mm:ss')
          },
        },
        {
          title: '健身类型',
          dataIndex: 'fitnessType',
          // scopedSlots: { customRender: 'type' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      pagination: {
        pageSize: 10,
        defaultPageSize: 10,
        defaultCurrent: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '40'],
      },
      loading: true,
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
    }
  },
  created() {
    this.vueTable()
  },
  methods: {
    handleSubmit() {
      // this.queryParam=queryParam
      searchFitness({ userId: this.queryParam.userId, name: this.queryParam.name })
        .then((res) => {
          this.loadData = res.data
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
        })
    },
    vueTable() {
      getFitness()
        .then((res) => {
          this.loadData = res.data
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
        })
    },
    handleEdit(record) {
      this.$message.info(`未开发`)
    },
    handleSub(record) {
      if (record.status !== 0) {
        this.$message.info(`${record.name} 订阅成功`)
      } else {
        this.$message.error(`${record.name} 订阅失败，规则已关闭`)
      }
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date()),
      }
    },
  },
}
</script>
