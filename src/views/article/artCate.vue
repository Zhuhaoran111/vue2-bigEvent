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
                    <!-- scope对象：{row:行对象} -->
                    <template v-slot="scope">
                        <el-button type="primary" size="mini" @click="updateFn(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteFn(scope.row.id)">删除</el-button>
                    </template>
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
                <el-button size="mini" type="primary" @click="confrimFn">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getArticleApi, saveArticleCateApi, updateArticelApi, deleteArticleApi } from '@/api/article.js'
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
            },
            isEdit: false, //true为编辑状态，false为新增，默认一上来是性增
            editId: '' //保证正在要编辑的数据id值
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
            this.isEdit = false  //变回新增的状态标记
            this.editId = ''
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
                    //通过校验的代码
                    //这个之前点击的是编辑
                    if (this.isEdit) {
                        //要修改
                        this.addForm.id = this.editId  //在后面追加一个id
                        const { data: res } = await updateArticelApi(this.addForm)
                        if (res.code !== 0) return this.$message.error(res.message)
                        this.$message.success(res.message)
                    } else {
                        //要新增
                        const { data: res } = await saveArticleCateApi(this.addForm)
                        if (res.code !== 0) return this.$message.error(res.message)
                        this.$message.success(res.message)
                    }
                    this.getArticleFn()
                    this.addVisible = false

                } else {
                    return false
                }
            })
        },
        //编辑按钮的，先做数据的回显
        updateFn(data) {
            this.isEdit = true
            this.editId = data.id
            this.addVisible = true

            //让el-dialog第一次挂载el-form时，先用addFrom空字符串初始值绑定到resetFiels重置
            //让DOM先创建并在内部绑定好初始值，
            //真实DOM绑定好了，在做数据回显 this.$nextTick
            this.$nextTick(() => {
                this.addForm.cate_alias = data.cate_alias
                this.addForm.cate_name = data.cate_name
            })
        },
        //删除分类
        async deleteFn(id) {
            let that = this
            const { data: res } = await deleteArticleApi(id)
            this.$confirm('是否删除此文件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(res)
                if (res.code == 0) {
                    //刷新页面
                    this.getArticleFn()
                    return this.$message({
                        type: 'success',
                        message: res.message
                    })

                } else {
                    return this.$message({
                        type: 'error',
                        message: res.message
                    })
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
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

<!-- //经验：点击新增或者编辑修改，如何区分保存状态
//1.定义一个变量isEdit(true编辑，false为新增)，还要定义一个编辑数据唯一的id值，editId
//2.在点击修改的时候，isEdit为true,editId保存要修改的数据id
//3.在点击新增的时候,isEdit改为false，edit置空
//4.在点击保存按钮时，就可以用isEdit做区分 


第一次打开网页，先点击新增按钮——>dialog出现->el-form组件第一次挂载(关联的addForm对象的属性的值为空字符串，
el-form组件内绑定了初始值，所以后续调用resetFields的时候，它可以用到空字符串初始值来重置，没问题

第一次打开编辑，点击编辑按钮->虽然dialog变量为true,但是同步代码吧addForm对象里面赋值了(默认值)->DOM更新异步
->dialog出现，el-form组件第一次挂载（使用addForm内置做回显然后第一次el-form内绑定了初始值(有值)
->以后做重置，他就用绑定的带的值做重置

第一次点击新增，已经绑定了初始值，每次新建弹框，默认以第一次值作为重置的值

解决：
    //让el-dialog第一次挂载el-form时，先用addFrom空字符串初始值绑定到resetFiels重置
     //让DOM先创建并在内部绑定好初始值，
    //真实DOM绑定好了，在做数据回显 this.$nextTick

)
49集比较好
-->