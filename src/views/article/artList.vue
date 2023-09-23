<template>
    <div>
        <!-- 内容区域 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>文章列表</span>
            </div>
            <!-- 搜索区域 -->
            <div class="search-box">
                <el-form :inline="true" :model="q">
                    <el-form-item label="文章分类">
                        <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
                            <!-- 这里v-model绑定的是你选中的值，这里绑定的是id,所以下面vlaue绑定的值就是id -->
                            <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布状态" style="margin-left: 15px;">
                        <el-select v-model="q.state" placeholder="请选择状态" size="small">
                            <el-option label="已发布" value="已发布"></el-option>
                            <el-option label="草稿" value="草稿"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="chooseFn">查询</el-button>
                        <el-button type="info" size="small" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 发表文章的按钮 -->
                <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
            </div>

            <!-- 文章表格区域 -->
            <el-table :data="articleList" style="width: 100%;" border stripe>
                <el-table-column label="文章标题" prop="title"></el-table-column>
                <el-table-column label="分类" prop="cate_name"></el-table-column>
                <el-table-column label="发表时间" prop="pub_date">
                    <template v-slot="scope">
                        <span>{{ $formatDate(scope.row.pub_date) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="state"></el-table-column>
                <el-table-column label="操作">
                    <!-- 
                        直接写v-slot="{row}"与v-slot=scope的区别
                        row:行数据对象
                     -->
                    <template v-slot="scope">
                        <el-button type="text" @click="articleDetail(scope.row.id)">详情</el-button>
                        <el-button type="text" @click="articleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 
            @size-change="handleSizeChangeFn"：每页显示的条数改变触发事件受这个影响 :page-sizes="[2, 3, 5, 10]"  
            @current-change="handleCurrentChangeFn ：点击第几页触发的函数,123456点击页时
            :current-page.sync="q.pagenum" :当前按=双向绑定显示的是第几页
            :page-size.sync="q.pagesize"  这个现实每页显示多少条数据
            :page-sizes="[2, 3, 5, 10]"   这个是下拉的每页显示的数据
            -->

            <el-pagination @size-change="handleSizeChangeFn" @current-change="handleCurrentChangeFn"
                :current-page.sync="q.pagenum" :page-sizes="[2, 3, 5, 10]" :page-size.sync="q.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 发表文章的 Dialog 对话框    fullscreen这是全屏的-->
        <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose"
            @close="dialogCloseFn">
            <!-- 发布文章的对话框 -->
            <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类" prop="cate_id">
                    <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
                        <!-- 这里v-model绑定的是你选中的值，这里绑定的是id,所以下面vlaue绑定的值就是id -->
                        <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <!-- 这里的prop几后面跟的就是校验的字段名必须保持一致 -->
                    <quill-editor v-model="pubForm.content" @blur="contentChange"></quill-editor>
                </el-form-item>
                <el-form-item label="文章封面" prop="cover_img">
                    <!-- 用来显示封面的图片 -->
                    <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
                    <br />
                    <!-- 文件选择框，默认被隐藏 -->
                    <input type="file" style="display: none;" accept="image/*" ref="iptFileRef" @change="changeCoverFn" />
                    <!-- 选择封面的按钮 -->
                    <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
                    <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 查看文章详情的对话框 -->
        <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
            <h1 class="title">{{ artDetail.title }}</h1>
            <div class="info" style="display:flex;justify-content:space-around">
                <span>作者:{{ artDetail.nickname || artDetail.username }}</span>
                <span>发布时间{{ $formatDate(artDetail.pub_date) }}</span>
                <span>所属分类:{{ artDetail.cate_name }}</span>
                <span>状态:{{ artDetail.state }}</span>
            </div>

            <!-- 分割线 -->
            <el-divider></el-divider>

            <!-- 文章的封面 -->
            <img v-if="artDetail.cover_img" :src="'http://big-event-vue-api-t.itheima.net' + artDetail.cover_img" alt="" />

            <!-- 文章的详情 ,content是带标签的，想要去掉标签就要加v-html去掉标签-->
            <div v-html="artDetail.content" class="detail-box"></div>
        </el-dialog>
    </div>
</template>

<script>
import { getArticleApi, uploadArticleApi, getArticleListAPI, getArticleDetailApi, delArticleDetailApi } from '@/api/article.js'
import imgObj from '../../assets/images/cover.jpg'
export default {
    name: 'ArtList',
    data() {
        return {
            pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
            detailVisible: false,//控制打开详情页的显示与隐藏
            // 查询参数对象
            q: {
                pagenum: 1,  //默认拿第一页的数据
                pagesize: 10,//默认当前页需要几条数据,后台就返回几条数据
                cate_id: '',
                state: ''
            },
            // ...其他
            pubForm: { // 表单的数据对象
                title: '',
                cate_id: '',
                content: '',   //文章的内容
                cover_img: '',//封面图片的文件
                state: '' // 文章的发布状态，可选值有两个：草稿、已发布
            },
            pubFormRules: { // 表单的验证规则对象
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' },
                    { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
                ],
                cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],   //下拉框没有失焦,下拉框用change事件

                content: [
                    //这里对应是富文本编辑器，它不是element组件带的标签
                    //el-input等输入框是在blur事件时进行校验
                    //下拉菜单，单选框，复选框是在change事件时进行的触发
                    //quill-editor2个事件都没有，所以不会自动走校验
                    //自己绑定失焦事件，也可以绑定change事件
                    //在事件处理函数中用el-form组件对象内，调用某个校验规则在重新执行
                    { required: true, message: '请输入文章内容', trigger: 'change' }
                ],
                cover_img: [{ required: true, message: '请选择封面', trigger: 'blur' }]
            },
            //保存文章分类列表
            cateList: [],
            //保存文章列表的数据集
            articleList: [],
            total: 0,//文章的总数
            artDetail: {}//保存文章详情的
        }
    },
    created() {
        this.getCateListFn()   //文章分类数据
        this.getAllArticleList()  //文章列表数据
    },
    methods: {
        //点击发布文章弹出对话框
        showPubDialogFn() {
            this.pubDialogVisible = true
        },
        //关闭之前的回调,自带的关闭都会出发这个回调
        async handleClose(done) {
            // 询问用户是否确认关闭对话框
            const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            // 取消了关闭-阻止住, 什么都不干，对话框不能关闭，提前return不让下面done执行
            if (confirmResult === 'cancel') return
            // 确认关闭
            done()
        },
        //获取所有的分类
        async getCateListFn() {
            const { data: res } = await getArticleApi()
            if (res.code === 0) {
                this.cateList = res.data
                console.log(this.cateList)
            }
        },
        //获取所有的文章列表
        async getAllArticleList() {
            const { data: res } = await getArticleListAPI(this.q)
            this.articleList = res.data
            this.total = res.total
        },
        //选择封面的点击事件
        chooseImgFn() {
            //选择文件，文件选择的窗口出现
            this.$refs.iptFileRef.click() //用js来模拟一次点击事件的动作(让文件选择窗口出现)
        },
        //用户选择的封面文件
        changeCoverFn(e) {
            //e.target，拿到出发事件的那个标签(input标签本身)
            //额e.target。files拿到选择文件的数组
            // 获取用户选择的文件列表
            // 获取用户选择的文件列表
            const files = e.target.files
            if (files.length === 0) {
                // 用户没有选择封面
                this.pubForm.cover_img = null
                //取消上传封面这里直接默认的图片,前面是选择的赋值的对象，后面是赋值的内容,即默认值
                this.$refs.imgRef.setAttribute('src', imgObj)
            } else {
                // 用户选择了封面
                this.pubForm.cover_img = files[0]
                //把图片文件，要显示到Img标签里
                const url = URL.createObjectURL(files[0])
                this.$refs.imgRef.setAttribute('src', url)
            }

            //让表单单独校验的规则，先是点击发布全部走个校验，当图片是否存在再来一个触发事件来走下校验
            this.$refs.pubFormRef.validateField('cover_img')  //检查对象属性里面的值cover_img是否存在
        },
        //点击发布或草稿的点击事件,调用接口
        pubArticleFn(str) {
            //str的值是已发布或者草稿（后端要求的参数值)
            this.pubForm.state = str

            //兜底校验
            this.$refs.pubFormRef.validate(async valid => {
                if (valid) {
                    //都通过校验,这里走接口
                    let fd = new FormData()
                    //准备一个表单数据对象的容器,FormData类是h5新增为了专门为了装文件内容和其他参数的一个容器
                    //fd.append('参数名',值)
                    fd.append('title', this.pubForm.title)
                    fd.append('cate_id', this.pubForm.cate_id)
                    fd.append('content', this.pubForm.content)
                    fd.append('cover_img', this.pubForm.cover_img)
                    fd.append('state', this.pubForm.state)

                    // 发起请求
                    const { data: res } = await uploadArticleApi(fd)
                    if (res.code !== 0) return this.$message.error('发布文章失败！')
                    this.$message.success('发布文章成功！')
                    // 关闭对话框
                    this.pubDialogVisible = false
                    // TODO：刷新文章列表数据
                    this.getAllArticleList()

                } else {
                    return false
                    //组织默认行为
                }
            })
            console.log(this.pubForm)
        },
        //富文本编辑器内容改变触发
        contentChange() {
            //富文本改变重新走校验,对表单的某一项进行校验validateField
            this.$refs.pubFormRef.validateField('content')
        },
        //发布文章的对话框关闭的回调清空表单
        dialogCloseFn() {
            // //重置表单
            this.$refs.pubFormRef.resetFields()
            //图片不受v-model影响，要手动去校验
            // 因为这个变量对应的标签不是表单绑定的, 所以需要单独控制
            this.$refs.imgRef.setAttribute('src', imgObj)
        },
        //分页-每页数据条数变化时触发,sizes每页数据的条数
        handleSizeChangeFn(sizes) {
            //核心思想，根据选择的页码/条数，影响q对象里面属性的值，在重新发起一次获取数据的请求
            this.q.pagesize = sizes
            //重新发起请求
            this.getAllArticleList()

        },
        //分页--切换页时触发的回调,nowPage当前的页数
        handleCurrentChangeFn(nowPage) {
            this.q.pagenum = nowPage
            this.getAllArticleList()
        },
        //查询按钮点击事件
        chooseFn() {
            //目的，当有了筛选条件，让当前的页面回归1，每页的条数回归10
            this.q.pagenum = 1
            this.q.pagesize = 10
            this.getAllArticleList()
        },
        //重置按钮
        reset() {
            this.q.pagenum = 1
            this.q.pagesize = 10
            this.q.cate_id = ''
            this.q.state = ''
            this.getAllArticleList()
        },
        //点击详情触发事件
        async articleDetail(artId) {
            const { data: res } = await getArticleDetailApi(artId)
            this.detailVisible = true
            this.artDetail = res.data

        },
        // 删除文章按钮的点击事件
        async articleDelete(deleteId) {
            // 1. 询问用户是否要删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 2. 取消了删除
            if (confirmResult === 'cancel') return

            // 执行删除的操作
            const { data: res } = await delArticleDetailApi(deleteId)
            //刷新文章列表数据

            if (res.code !== 0) return this.$message.error('删除失败!')
            this.$message.success('删除成功!')

            //在最后一页删除最后一条时,虽然页面能回到上一页，但是数据没有出现
            //原因:发现network里面的参数q.pagenum的值不会自己回到上一页，因为
            //你的代码里面没有修改过这个q.pagenum的值，只是调用了getAllArticleList
            //这个方法,带着之前的参数请求去了所以没数据
            //解决方案:两条数据不行，只能有一条数据才能做--


            //数组里只保存q里面的参数，别的页需要传参给后台获取覆盖
            //1的原因：虽然你调用了删除接口但是那是后端删除，前端数组里没有代码区修改他
            if (this.articleList.length === 1) {
                if (this.q.pagenum > 1) {  //页面等于1时就不能--了，保证最小值为1
                    this.q.pagenum--
                }

            }
            this.getAllArticleList()  //文章列表数据

        }
    }
}
</script>

<style lang="less" scoped>
.search-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.btn-pub {
    margin-top: 5px;
}

/* // 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了,先选属性候选类名 */
::v-deep .ql-editor {
    min-height: 300px;
}

/* // 设置图片封面的宽高 */
.cover-img {
    width: 400px;
    height: 280px;
    object-fit: cover;
}

.el-pagination {
    margin-top: 15px;
    margin-left: 600px
}

.title {
    font-size: 24px;
    text-align: center;
    font-weight: normal;
    color: #000;
    margin: 0 0 10px 0;
}

​.info {
    font-size: 12px;

    span {
        margin-right: 30px;
    }

}

/* ​ // 修改 dialog 内部元素的样式，需要添加样式穿透::v-deep .detail-box {  img {    width: 500px;  }} */
</style>


<!-- 关于async 和await
1.await之能在被async修饰的函数内
2.async修饰：就是在当前安徽念书名左边加async修饰，如果没有函数名，在形参的左边加async 
3.async修饰的函数就是异步函数，如果此函数被调用，总是返回一个全新的promise对象
4.而且本次函数调用因为是异步函数，所以外面的同步代码继续执行，而await暂停代码之能暂停
async内的，等待await后面异步结果
await只能拿到成功的结果并放行往下走，如果内部失败会像浏览器控制台抛出异常错误，并不会await往下走执行的代码

1.捕获错误：try catch
2.promise链式调用
 -->

<!-- 知识点2:关于最小高度min-height和height的区别  min-height:300px
min-height:标签本身的高度靠内容撑开，但是没有内容灭有300高度，标签会设置为最小高度为300px
如果内容大于300px,标签高度也会随之撑开

height:无论容器里面的内容有多少。超出300高度的内容会溢出到外面而不是撑开此容器

 -->


 <!-- 样式穿透 
 1.scoped的作用：让style里卖面的选择器，只能选中当前选中的标签(为了保证独立性，不影响背的组件)
 2.scoped的原理：(多加了了一个data-v属性选择器)
 详细的原理：webpack打包的时候，会给组件上添加相同的data-v-hash值，然后给所有的选择器后面加上一个
 <标签 data-v-hash class="my_calss"></标签>
 选择器会变成.my_calss[data-v-hash]这种形式
 //注意的事项，scoped只会给当前组件中的所有原生的标签添加data-v-hash的值，还会给组件标签内添加data-v-hash值的属性，组件内
 的标签不会添加

 上面这样写，选不中富文本组件内的标签
 总结：scoped不会给组件内的标签添加data-v属性，所以要用v::deep穿透选择组件捏的标签设置样式


js里卖弄引入图片，就用import引入，让webpack把他当作模块数据，是转换成打包后的图片路径还是base64字符串
外链图片可以随便使用http开头
 -->