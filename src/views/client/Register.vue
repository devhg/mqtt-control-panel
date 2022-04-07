<template>
  <a-card :bordered="false">
    <a-row :gutter="48">
      <a-col :md="4" :sm="24"></a-col>
      <a-col :md="12" :sm="24">
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item v-bind="formItemLayout" label="E-mail">
            <a-input
              v-decorator="[
                'email',
                {
                  rules: [
                    { type: 'email', message: '错误的邮箱格式' },
                    { required: true, message: '请输入邮箱' }
                  ]
                }
              ]"
            />
          </a-form-item>

          <a-form-item v-bind="formItemLayout">
            <span slot="label">
              客户端（用户名）名称&nbsp;
              <a-tooltip title="需要保证唯一">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-input
              v-decorator="[
                'clientName',
                { rules: [{ required: true, message: '请输入客户端（用户名）名称', whitespace: true }] }
              ]"
            />
          </a-form-item>

          <a-form-item v-bind="formItemLayout">
            <span slot="label">
              业务线名称&nbsp;
              <a-tooltip title="根据业务线划分的唯一组id">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-input
              v-decorator="[
                'groupName',
                {
                  rules: [{ required: true, message: '请输入业务线名称', whitespace: true }]
                }
              ]"
            />
          </a-form-item>

          <a-form-item v-bind="formItemLayout" label="手机号">
            <a-input
              v-decorator="[
                'phone',
                {
                  rules: [{ required: true, message: '请输入正确的手机号' }]
                }
              ]"
              style="width: 100%"
            >
              <a-select slot="addonBefore" v-decorator="['prefix', { initialValue: '86' }]" style="width: 70px">
                <a-select-option value="86">
                  +86
                </a-select-option>
                <a-select-option value="87">
                  +87
                </a-select-option>
              </a-select>
            </a-input>
          </a-form-item>

          <a-form-item v-bind="formItemLayout" extra="用户名无效联系DBA">
            <span slot="label">
              操作人&nbsp;
              <a-tooltip title="操作人id（邮箱前缀）">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-input
              v-decorator="[
                'opUser',
                {
                  rules: [{ required: true, message: '请输入操作人id', whitespace: true }]
                }
              ]"
            />
          </a-form-item>

          <a-form-item v-bind="tailFormItemLayout">
            <a-checkbox
              v-decorator="[
                'agreement',
                { valuePropName: 'checked', rules: [{ required: true, message: '请阅读并勾选协议' }] }
              ]"
            >
              我已阅读并同意
              <a href="#">协议</a>
            </a-checkbox>
          </a-form-item>

          <a-form-item v-bind="tailFormItemLayout">
            <a-button type="primary" html-type="submit">
              注册
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :md="8" :sm="24"></a-col>
    </a-row>
  </a-card>
</template>

<script>
import { AddClient } from '@/api/client'

export default {
  data() {
    return {
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 8
          }
        }
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' })
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          AddClient(values)
            .then(res => {
              console.log(res)
              if (res.code === 0) {
                this.$message.success(res.result)
              } else {
                this.$message.error(res.result)
              }
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        }
      })
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    handleWebsiteChange(value) {
      let autoCompleteResult
      if (!value) {
        autoCompleteResult = []
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
      }
      this.autoCompleteResult = autoCompleteResult
    }
  }
}
</script>
