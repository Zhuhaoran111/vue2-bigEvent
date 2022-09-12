//引入自定义的require函数
import require from "@/utils/requaire";
//获取文章的分类
export const getArticleApi = () => {
    return require({
        url: '/my/cate/list',
    })
}

//保存增加文章的分类
export const saveArticleCateApi = ({ cate_name, cate_alias }) => {
    return require({
        url: '/my/cate/add',
        method: 'POST',
        data: {
            cate_name,
            cate_alias
        }
    })
}

//更新文章的分类接口
export const updateArticelApi = ({ id, cate_name, cate_alias }) => {
    return require({
        url: '/my/cate/info',
        method: 'PUT',
        data: {
            id,
            cate_name,
            cate_alias
        }
    })
}

//删除文章分类的接口,query参数，用params携带
export const deleteArticleApi = (id) => {
    return require({
        url: '/my/cate/del',
        method: 'delete',
        params: {
            id
        }
    })
}

//发布文章的接口,POST请求
export const uploadArticleApi = (fd) => {
    return require({
        url: '/my/article/add',
        method: 'POST',
        data: fd
        //{}如果是一个普通对象，axiosh会把他转成JSON字符串在请求体里结合交给后台
        //这个请求体文档要求请求体里面是一个FormData类型(表单数据对象)携带文件给后台
    })
}

/**
 * 获取文章列表
 * @param {*} param0 { pagenum: 当前页码数, pagesize: 当前页条数, cate_id: 文章分类id, state: 文章状态 }
 * @returns Promise对象
 */
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
    return require({
        url: '/my/article/list',
        params: {
            pagenum,
            pagesize,
            cate_id,
            state
        }
    })
}

/**
 * 获取-文章详情
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const getArticleDetailApi = (id) => {
    return require({
        url: '/my/article/info',
        params: {
            id
        }
    })
}

/**
 * 删除文章的详情
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const delArticleDetailApi = (id) => {
    return require({
        url: '/my/article/info',
        method: 'DELETE',
        params: {
            id
        }
    })
}