<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>更换头像</span>
        </div>
        <div>
            <!-- 图片，用来展示用户选择的头像 -->
            <!-- 没图片是默认方式，有图片是就是选择的图片 -->
            <img v-if="!avatar" class="the_img" src="../../assets/images/avatar.jpg" alt="" />
            <img v-else class="the_img" :src="avatar" alt="" />

            <!-- 按钮区域 -->
            <div class="btn-box">
                <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
                <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
                <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="uploadFn">上传头像
                </el-button>
            </div>
        </div>
    </el-card>
</template>

<script>
import { updateAvatarAPI } from '@/api/user.js'
export default {
    name: 'UserAvatar',
    data() {
        return {
            avatar: ''  //保存图片链接/base64的字符串
        }
    },
    methods: {
        //选择图片的点击事件
        chooseImg() {
            //为了让input[type=file]标签，让他用js代码来触发他的点击事件(导致默认行为给一个文件的窗口)
            //input[type=file]是原生标签，样式不好修改
            this.$refs.iptRef.click()   //触发点击事件
        },
        //选择图片确定出发的事件
        onFileChange(e) {
            const files = e.target.files  //拿到用户的文件数组
            if (files.length == 0) {
                //窗口打开但是未选择图片
            } else {
                //证明选择了文件，
                console.log(e.target.files)
                //选择的图片文件要么是图片的链接地址或者相对路径，也可以是图片的base64字符串data:image/png,图片转base64

                //解决方案1：文件转内存的临时地址(文件转链接，只能前端用，后端用不了)
                //URL.createObjectURL(文件)
                //返回值就是内存的地址
                // this.avatar = URL.createObjectURL(files[0])

                //解决方案2：图片转base64字符串(此字符串可以发给后台)
                //语法： // 
                // 1. 创建 FileReader 对象
                const fr = new FileReader()
                // 2. 调用 readAsDataURL 函数，读取文件内容
                fr.readAsDataURL(files[0])
                // 3. 监听 fr 的 onload 事件
                fr.onload = e => {
                    // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
                    this.avatar = e.target.result

                }
            }
        },
        //上传图像的api
        async uploadFn() {
            const { data: res } = await updateAvatarAPI(this.avatar)
            if (res.code !== 0) return this.$message.error(res.message)
            //更新头像成功
            this.$message.success(res.message)
            //立刻让vuex里面的action(获取用户信息的action)再次请求一次后台更新vuex里面的值
            this.$store.dispatch('getUserinfoActions')


        }
    }
}
</script>

<style lang="less" scoped>
.btn-box {
    margin-top: 10px;
}

.preview {
    object-fit: cover;
}

.the_img {
    width: 350px;
    height: 350px;
}
</style>