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
            <input
              type="file"
              @change="importFile"
              id="imFile"
              style="display: none"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <span class="table-page-search-submitButtons" :style="{}">
              <a-button type="primary" @click="handleImport()">
                导入
                <a-icon type="plus" />
              </a-button>
              <a-button style="margin-left: 8px" @click="handleExport()">
                导出
                <a-icon type="switcher" />
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- modal -->
    <div class="table-operator">
      <a-modal title="修改记录" :visible="modalShow" @ok="updateSubmit(edit)" @cancel="insertCancel()">
        <a-form layout="horizontal">
          <a-form-item label="记录编号" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
            <a-input disabled v-model="edit.id" name="id" />
          </a-form-item>
          <a-form-item label="IP地址" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
            <a-input v-model="edit.ip" name="ip" />
          </a-form-item>
          <a-form-item label="状态" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
            <!-- <a-input v-model="edit.status" name="status" /> -->
            <!-- <a-radio :value="edit.status">开启</a-radio> -->
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
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="deleteAll()">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table -->
    <a-table
      id="table"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
          <a-popconfirm title="你想删除这条记录吗？" ok-text="Yes" cancel-text="No" @confirm="handleDelete">
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
// import { STable, Ellipsis } from '@/components'
import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'
import { getBlackIPList, StudentUpdate, StudentDelete, StudentUpload } from '@/api/manage'
import ExportJsonExcel from 'js-export-excel'

const columns = [
  {
    title: '记录编号',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id,
    // sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
  },
  { title: 'IP地址', dataIndex: 'ip' },
  { title: '操作人', dataIndex: 'op_user' },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: (a, b) => a.createTime - b.createTime,
    // sortOrder: sortedInfo.columnKey === 'signTime' && sortedInfo.order,
    customRender: (val) => {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  { title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
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
      let { sortedInfo, filteredInfo } = this
      sortedInfo = sortedInfo || {}
      filteredInfo = filteredInfo || {}
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
      modalShow: false,

      filteredInfo: null,
      sortedInfo: null,

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
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    },
  },
  created() {
    this.fetchData({})
  },
  methods: {
    handleEdit(record) {
      this.modalShow = !this.modalShow
      this.edit = record
    },
    handleDelete(e) {
      this.$message.success('Click on Yes')
    },
    updateSubmit(data) {
      console.log(data)
      const uname = data.ip
      //   StudentUpdate({
      //     id: data.id,
      //   })
      //     .then((res) => {
      //       console.log(res)
      //       this.$message.info(`${uname} 信息更新成功`)
      //     })
      //     .catch((e) => {
      //       this.$message.error(`${uname} 信息更新失败`)
      //     })
      this.insertCancel()
    },
    insertCancel() {
      this.fetchData({})
      this.modalShow = !this.modalShow
    },
    fetchData(param) {
      this.loading = true
      this.courseName = param.course == undefined ? this.courseName : param.course
      console.log(this.courseName)
      getBlackIPList({ class: param.class, course: param.course, uid: param.uid, uname: param.uname })
        .then((res) => {
          this.loadData = res.result
          console.log(this.loadData)
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
        })
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date()),
      }
    },
    deleteAll() {
      console.log(this.selectedRowKeys)
      StudentDelete({
        ids: this.selectedRowKeys,
      })
        .then((res) => {
          console.log(res)
          this.$message.info(`批量删除成功`)
        })
        .catch((e) => {
          this.$message.error(`批量删除失败`)
        })
      this.selectedRowKeys = []
      this.fetchData({})
    },
    handleChange(pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter)
      this.filteredInfo = filters
      this.sortedInfo = sorter
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
    handleImport() {
      document.getElementById('imFile').click()
    },
    importFile: function (e) {
      var obj = e.target
      if (e.target.files.length == 0) {
        this.$message.error(`没有获取到导入内容`)
        return
      }
      var f = obj.files[0]
      var reader = new FileReader()
      reader.readAsBinaryString(f)
      reader.onload = (e) => {
        var data = e.target.result //获取上传的文件数据
        this.wb = XLSX.read(data, {
          type: 'binary',
        })
        var importData = XLSX.utils.sheet_to_json(this.wb.Sheets[this.wb.SheetNames[0]])
        //至此已完成对上传excel的内容解析 然后可以直接把这个对象数组传给后端
        StudentUpload(importData)
          .then((res) => {
            console.log(res)
            this.$message.info(`批量导入成功`)
            this.fetchData({})
          })
          .catch((e) => {
            this.$message.error(`批量导入失败`)
          })
      }
    },
    uploadExcel_repuest(content) {
      // var reader = new FileReader()
      // reader.readAsBinaryString(content.file)
      // reader.onload = (e) => {
      //   var data = e.target.result //获取上传的文件内容
      //   this.wb = XLSX.read(data, {
      //     type: 'binary',
      //   })
      //   this.importData = XLSX.utils.sheet_to_json(this.wb.Sheets[this.wb.SheetNames[0]])
      //   console.log('解析到的excel数据为:', this.importData)
      // }
    },
  },
}
</script>
