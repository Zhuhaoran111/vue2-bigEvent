<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>基本资料</span>
        </div>
        <!-- 表单 -->
        <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
            <el-form-item label="登录名称" prop="username">
                <el-input v-model="userForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="userForm.nickname" minlength="1" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email">
                <el-input v-model="userForm.email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFn">提交修改</el-button>
                <el-button @click="resetFn">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { updateUserinfo } from '@/api/user.js'
export default {
    name: 'UserInfo',
    data() {
        return {
            userForm: {
                username: this.$store.state.userinfo.username, // 默认值用登录后获取到的用户名
                nickname: '',
                email: ''
            },
            // 表单的验证规则对象
            userFormRules: {
                nickname: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' },
                    { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitFn() {
            this.$refs.userFormRef.validate(async valid => {
                if (valid) {
                    //通过校验
                    //需要带id过去,获取vuex里面的数据this.$store.state.userInfo.id
                    this.userForm.id = this.$store.state.userinfo.id
                    const { data: res } = await updateUserinfo(this.userForm)
                    if (res.code !== 0) return this.$message.error('更新用户信息失败！')
                    // 更新用户信息成功，刷新 Vuex 中的数据
                    this.$message.success('更新成功！')
                    // 重新让vuex获取下最新的用户数据,用dispathch调用vuex里面的方法
                    this.$store.dispatch('getUserinfoActions')

                } else {
                    //为通过校验
                    return false
                }
            })
        },
        //重置按钮
        resetFn() {
            //清空自己刚写的输入框(方法1：是单个清除表单框)
            // this.userForm.nickname = '',
            // this.userForm.email = ''

            //el-form利用表单清空(并且还能重置报错的提示)
            this.$refs.userFormRef.resetFields()

        }
    }
}
</script>

<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>