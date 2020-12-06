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
            <a-form-item label="用户名">
              <a-input v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="8 || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="{ float: 'left', overflow: 'hidden' } || {} "
            >
              <a-button type="primary" @click="handleSumbit(queryParam)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleDelete([])">
            <a-icon type="delete" />删除
          </a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2">
            <a-icon type="lock" />锁定
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :loading="loading"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      :dataSource="loadData"
    >
      <span slot="type" slot-scope="type">
        <a-tag
          :color="type === 0 ? 'volcano' : (type === 1 ? 'green' : 'geekblue')"
        >{{type === 0 ? '进入' : (type === 1 ? '离开' : '已过期')}}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleDelete([record.id])">删除</a>
        </template>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { getRecord, delRecord, inoutSearch } from '@/api/manage'

export default {
  name: 'TableList',
  components: {},
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        { title: '编号', dataIndex: 'id' },
        { title: '用户Id', dataIndex: 'userId' },
        { title: '用户姓名', dataIndex: 'name' },
        { title: '房间号', dataIndex: 'roomId' },
        {
          title: '时间',
          dataIndex: 'updateTime',
          sorter: true,
          customRender: val => {
            return moment(val).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          title: '进出记录',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
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
      loadData: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
    this.vueTable()
  },
  methods: {
    handleSumbit(queryParam) {
      inoutSearch({ userId: queryParam.userId, name: queryParam.name })
        .then(res => {
          this.loadData = res.data
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
    },
    vueTable() {
      getRecord()
        .then(res => {
          console.log(res)
          this.loadData = res.data
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
    },
    handleDelete(record) {
      console.log(record)
      var data = []
      if (record.length > 0) {
        data = record
      } else {
        data = this.selectedRowKeys
      }
      var that = this
      this.$confirm({
        title: `确定要删除 ${data} 号房间吗？`,
        content: '此操作无法撤销！',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          delRecord(data)
            .then(res => {
              console.log(res.code)
              if (res.code == 200) {
                that.$message.success('删除成功')
              } else {
                that.$message.error('删除失败')
              }
            })
            .catch(e => {})
            .finally(() => {
              that.selectedRowKeys = []
              that.selectedRows = []
              that.vueTable()
            })
        },
        onCancel() {
          that.$message.info('已取消')
        }
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys)
      // console.log(selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    showDeleteConfirm(roomId) {
      var that = this
      this.$confirm({
        title: `确定要删除 ${roomId} 号房间吗？`,
        content: '此操作无法撤销！',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          that.handleDelete(roomId)
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
