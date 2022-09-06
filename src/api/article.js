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