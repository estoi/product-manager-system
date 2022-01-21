import axios from "axios"

/**
 * @description 商品管理模块接口类
 */
class Product {
    /**
     * @description 获取商品列表
     */
    getList = (params) => axios.get(`/apis/product/list?productName=${params.productName}`)
    /**
     * @description 新增商品
     */
    doAdd = (params) => axios.post('/apis/product/add', params)
    /**
     * @description 修改商品
     */
    doModify = (params) => axios.post('/apis/product/modify', params)
    /**
     * @description 删除商品
     */
    doDelete = (params) => axios.post('/apis/product/delete', params)
}

export default new Product()