<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix header-box">
                <span>文章分类</span>
                <el-button type="primary" size="mini" @click="addCateShow">添加分类</el-button>
            </div>
            <!-- 分类数据的表格 -->
            <!--  type="index"第一个单元格用索引值 -->
            <el-table style="width: 100%" :data="cateList" border stripe>
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="分类名称" prop="cate_name"></el-table-column>
                <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
                <el-table-column label="操作">
                    <el-button type="primary" size="mini">修改</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加分类的对话框 -->
        <!-- visible：控制对话框的显示与隐藏，true是现实，false是隐藏  .sync就是双向数据绑定 
        本质：  ：vasible='Vue变量'  和this.$emit('update:visible',值)
        before-close(关闭前的回调，可以在内部用，是否确认关闭)
        dialog内部关闭，esc按键,点击旁边的蒙层即空白处和点击叉号都是内部的调用
        -->
        <el-dialog title="添加文章分类" :visible.sync="addVisible" width="35%" @closed="onAddClosedFn">
            <!-- 添加的表单 -->
            <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
                <el-form-item label="分类名称" prop="cate_name">
                    <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="cate_alias">
                    <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancelFn">取 消</el-button>
                <el-button size="mini" type="primary" @click="confrimFn">添 加</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getArticleApi } from '@/api/article.js'
import { saveArticleCateApi } from '@/api/article.js'
export default {
    name: 'ArtCate',
    data() {
        return {
            cateList: [],
            addVisible: false, // 添加分类-对话框是否显示,默认不显示
            addForm: { // 添加form表单的数据对象
                cate_name: '',
                cate_alias: ''
            },
            addRules: { // 添加表单的验证规则对象
                cate_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
                ],
                cate_alias: [
                    { required: true, message: '请输入分类别名', trigger: 'blur' },
                    { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getArticleFn()
    },
    methods: {
        //获取文章分类列表
        async getArticleFn() {
            const res = await getArticleApi()
            this.cateList = res.data.data
        },
        //取消按点击事件
        cancelFn() {
            this.addVisible = false
        },
        //添加分类展示的弹窗
        addCateShow() {
            this.addVisible = true
        },
        //确定添加的按钮
        confirmFn() {
            this.addVisible = false
        },
        //关闭对话框的时候的回调
        onAddClosedFn() {
            //置空表单
            this.$refs.addRef.resetFields()
        },
        //保存的按钮
        confrimFn() {
            //保存时走个校验
            this.$refs.addRef.validate(async valid => {
                if (valid) {
                    const { data: res } = await saveArticleCateApi(this.addForm)
                    if (res.code !== 0) return this.$message.error(res.message)
                    this.$message.success(res.message)
                    this.getArticleFn()
                    this.addVisible = false
                } else {
                    return false
                }
            })
        }

    }
}
</script>

<style lang="less" scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>