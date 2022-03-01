<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="客户端ID">
              <a-input placeholder="如：mqtt_smd21sa" v-model="queryParam.clientId" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
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
        </a-row>
      </a-form>
    </div>

    <!-- 修改modal -->
    <div class="table-operator">
      <a-modal
        title="修改记录"
        :visible="updateModalShow"
        @ok="updateSubmit(edit)"
        @cancel="() => (updateModalShow = !updateModalShow)"
      >
        <a-form layout="horizontal">
          <a-form-item label="记录编号" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
            <a-input disabled v-model="edit.id" name="id" />
          </a-form-item>
          <a-form-item label="IP地址" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
            <a-input v-model="edit.ip" name="ip" />
          </a-form-item>
          <a-form-item label="状态" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
            <a-radio-group name="radioGroup" v-model="edit.status" :default-value="edit.status">
              <a-radio :value="1">开启</a-radio>
              <a-radio :value="0">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="操作人" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
            <a-input v-model="edit.op_user" name="op_user" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>

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
        <a-tag :color="packetTypeRender(record.packetType)">{{ record.packetType }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="orange" @click="handleEdit(record)">下线</a-tag>
        </template>
      </span>
    </a-table>
    <step-by-step-modal ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import ExportJsonExcel from 'js-export-excel'

import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'
import { GetPacketList } from '@/api/packet'

const columns = [
  { title: '创建时间', width: '200px', dataIndex: 'createTime' },
  { title: 'clientId', dataIndex: 'clientId' },
  { title: '报文号', width: '80px', dataIndex: 'packetId' },
  { title: '报文类型', dataIndex: 'packetType', scopedSlots: { customRender: 'status' } },
  { title: 'Topic', dataIndex: 'topic' },
  { title: 'Qos', dataIndex: 'qos' },
  { title: '报文信息', dataIndex: 'packetInfo' },
]

export default {
  name: 'BlackIPList',
  components: {
    CreateForm,
    StepByStepModal,
  },
  computed: {
    columns() {
      return columns
    },
  },
  data() {
    return {
      courseName: '全部的',
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { offset: 1, span: 16 },
      },
      // 高级搜索 展开/关闭
      updateModalShow: false,
      addModalShow: false,

      edit: {},
      addForm: {},

      // 查询参数
      queryParam: {},
      pagination: {
        total: 0,
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
    this.fetchData({})
  },
  methods: {
    handleEdit(record) {
      this.updateModalShow = !this.updateModalShow
      this.edit = record
    },
    async fetchData(param) {
      this.loading = true
      await GetPacketList(param)
        .then((res) => {
          this.pagination.total = res.result.total
          this.loadData = res.result.data
        })
        .catch((e) => {
          console.log(e)
          this.$message.error(`未知错误`)
        })
      this.loading = false
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date()),
      }
    },
    handleChange(pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter)
      this.queryParam.page = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.fetchData(this.queryParam)
    },
    packetTypeRender(pt) {
      if (pt == 'PUBLISH' || pt == 'PUBREL' || pt == 'PUBACK' || pt == 'PUBREC' || pt == 'PUBCOMP') return 'orange'
      if (pt == 'PINGREQ' || pt == 'PINGRESP') return 'green'
      if (pt == 'CONNECT' || pt == 'CONNACK') return 'cyan'
      if (pt == 'DISCONNECT' || pt == 'CONNACK') return 'red'
      if (pt == 'SUBSCRIBE' || pt == 'UNSUBSCRIBE' || pt == 'SUBACK') return 'blue'
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
              状态: data[i].score > 60 ? '及格' : '不及格',
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
          sheetHeader: ['编号', '课程编号', '课程名字', '专业', '班级', '学号', '姓名', '得分', '录入时间', '状态'],
        },
      ]

      var toExcel = new ExportJsonExcel(option)
      toExcel.saveExcel()
    },
  },
}
</script>
