<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="7" :sm="24">
            <a-form-item label="IP">
              <a-input placeholder="如：127.0.0.1" v-model="queryParam.ip" />
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <a-form-item label="操作人">
              <a-input placeholder="如：root" v-model="queryParam.opUser" />
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
              <a-button type="primary" @click="() => (addModalShow = !addModalShow)">
                新增
                <a-icon type="plus" />
              </a-button>
              <!-- <a-popconfirm title="暂不支持导出，后续支持" ok-text="Yes" cancel-text="No">
                <a-button style="margin-left: 8px">
                  导出
                  <a-icon type="switcher" />
                </a-button>
              </a-popconfirm> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 修改modal -->
    <div class="table-operator">
      <a-modal
        title="新增记录"
        :visible="addModalShow"
        @ok="addSubmit(addForm)"
        @cancel="() => (addModalShow = !addModalShow)"
      >
        <a-form layout="horizontal">
          <a-form-item label="IP地址" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
            <a-input v-model="addForm.ip" name="ip" />
          </a-form-item>
          <a-form-item label="状态" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
            <a-radio-group name="radioGroup" v-model="addForm.status" :default-value="addForm.status">
              <a-radio :value="1">开启</a-radio>
              <a-radio :value="0">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="操作人" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
            <a-input v-model="addForm.op_user" name="op_user" />
          </a-form-item>
        </a-form>
      </a-modal>
      <!--  -->
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
      rowKey="id"
      :dataSource="loadData"
      @change="handleChange"
    >
      <span slot="status" slot-scope="status, record">
        <a-tag :color="record.status == 1 ? 'green' : 'volcano'">{{ record.status == 1 ? '开启' : '关闭' }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag @click="handleEdit(record)">修改</a-tag>
          <a-popconfirm title="你想删除这条记录吗？" ok-text="Yes" cancel-text="No" @confirm="handleDelete(record)">
            <a-tag color="orange">删除</a-tag>
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
import { GetBlackIPList, AddBlackIP, UpdateBlackIP, DeleteBlackIP } from '@/api/blackip'

const columns = [
  {
    title: '记录编号',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id
  },
  { title: 'IP地址', dataIndex: 'ip' },
  { title: '操作人', dataIndex: 'op_user' },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: (a, b) => a.createTime - b.createTime,
    customRender: val => {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  { title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'BlackIPList',
  components: {
    CreateForm,
    StepByStepModal
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
      // 高级搜索 展开/关闭
      updateModalShow: false,
      addModalShow: false,

      edit: {},
      addForm: {},

      // 查询参数
      queryParam: {},
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
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
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
        .then(res => {
          this.$message.info(res.result)
        })
        .catch(e => {
          this.$message.error(`记录更新失败`)
        })
      this.fetchData({})
    },
    async updateSubmit(data) {
      await UpdateBlackIP(data)
        .then(res => {
          this.$message.info(res.result)
        })
        .catch(e => {
          this.$message.error(`记录更新失败`)
        })
      this.updateModalShow = !this.updateModalShow
      this.fetchData({})
    },
    async addSubmit(data) {
      await AddBlackIP(data)
        .then(res => {
          this.$message.info(res.result)
        })
        .catch(e => {
          this.$message.error(`记录添加失败`)
        })
      this.addModalShow = !this.addModalShow
      this.fetchData({})
    },
    async fetchData(param) {
      this.loading = true
      console.log(param)
      await GetBlackIPList(param)
        .then(res => {
          this.loadData = res.result
          console.log(this.loadData)
        })
        .catch(e => {
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
        date: moment(new Date())
      }
    },
    handleChange(pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter)
    }
  }
}
</script>
