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