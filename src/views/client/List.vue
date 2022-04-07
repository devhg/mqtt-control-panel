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
      <span slot="action" slot-scope="text, record">
        <template>
          <a-popconfirm title="暂不支持修改，建议删除后新增" ok-text="Yes" cancel-text="No">
            <a-tag>修改</a-tag>
          </a-popconfirm>
          <a-tag color="red" @click="setClipboardText(record.clientName)">登录key</a-tag>
          <a-popconfirm title="你想删除这条记录吗？" ok-text="Yes" cancel-text="No" @confirm="handleDelete(record)">
            <a-tag color="orange">删除</a-tag>
          </a-popconfirm>
        </template>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import ExportJsonExcel from 'js-export-excel'

import CreateForm from '@/views/list/modules/CreateForm'
import { GetClientList, DeleteClient, GetClientKeyByClientName } from '@/api/client'

const columns = [
  { title: '记录编号', dataIndex: 'id', sorter: (a, b) => a.id - b.id },
  { title: '客户端ID', dataIndex: 'clientId' },
  { title: '客户端名称', dataIndex: 'clientName' },
  { title: '业务线名称', dataIndex: 'groupName' },
  { title: '联系邮箱', dataIndex: 'email' },
  { title: '联系电话', dataIndex: 'phone' },
  { title: '操作人', dataIndex: 'opUser' },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: (a, b) => a.createTime - b.createTime,
    customRender: val => {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'ClientList',
  components: {
    CreateForm
  },
  computed: {
    columns() {
      return columns
    }
  },
  data() {
    return {
      courseName: '全部的',
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
        total: 0,
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
      await GetClientList(param)
        .then(res => {
          this.loadData = res.result.data
          this.pagination.total = res.result.total
        })
        .catch(e => {
          this.$message.error(`未知错误`)
        })
      this.loading = false
    },
    setClipboardText(clientName) {
      GetClientKeyByClientName({ clientName: clientName })
        .then(res => {
          this.$copyText(res.result).then(e => {
            this.$message.info('登录秘钥key Copied!')
          })
        })
        .catch(e => {
          this.$message.error(`未知错误`)
        })
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
    },
    handleExport() {
      const data = this.loadData //表格数据
      var option = {}
      var dataTable = []
      if (data) {
        for (var i in data) {
          if (data) {
            var obj = {
              编号: data[i].id,
              课程编号: data[i].courseId,
              课程名字: data[i].courseName,
              专业: data[i].major,
              班级: data[i].class,
              学号: data[i].uid,
              姓名: data[i].uname,
              得分: data[i].score,
              录入时间: data[i].signTime,
              状态: data[i].score > 60 ? '及格' : '不及格'
            }
            dataTable.push(obj)
          }
        }
      }
      option.fileName = this.courseName + '成绩信息'
      option.datas = [
        {
          sheetData: dataTable,
          sheetName: 'sheet',
          sheetFilter: ['编号', '课程编号', '课程名字', '专业', '班级', '学号', '姓名', '得分', '录入时间', '状态'],
          sheetHeader: ['编号', '课程编号', '课程名字', '专业', '班级', '学号', '姓名', '得分', '录入时间', '状态']
        }
      ]

      var toExcel = new ExportJsonExcel(option)
      toExcel.saveExcel()
    }
  }
}
</script>
