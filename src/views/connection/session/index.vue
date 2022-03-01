<template>
  <a-card :bordered="false">
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
      rowKey="clientId"
      :dataSource="loadData"
    >
      <span slot="status" slot-scope="status, record">
        <a-tag :color="record.status == 'active' ? 'green' : 'volcano'">{{ record.status }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag>遗嘱</a-tag>
          <a-popconfirm
            title="你想强制下线这个客户端吗？"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleDelete(record)"
          >
            <a-tag color="orange">下线</a-tag>
          </a-popconfirm>
        </template>
      </span>
    </a-table>
    <step-by-step-modal ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'

import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'
import { GetSessionList } from '@/api/session'

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
    scopedSlots: { customRender: 'action' },
  },
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

      // 查询参数
      queryParam: {},
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
    this.fetchData({})
  },
  methods: {
    handleEdit(record) {
      this.updateModalShow = !this.updateModalShow
      this.edit = record
    },
    async handleDelete(data) {
      await DeleteBlackIP(data)
        .then((res) => {
          this.$message.info(res.result)
        })
        .catch((e) => {
          this.$message.error(`记录更新失败`)
        })
      this.fetchData({})
    },
    async fetchData(param) {
      this.loading = true
      console.log(param)
      await GetSessionList(param)
        .then((res) => {
          this.loadData = res.result
          console.log(this.loadData)
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
  },
}
</script>
