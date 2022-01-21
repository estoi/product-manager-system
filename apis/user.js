import axios from "axios"

class User {
    doRegister = (params) => axios.post('/apis/user/register', params)
    doLogin = (params) => axios.post('/apis/user/login', params)
    doModify = (params) => axios.post('/apis/user/modify', params)
    getList = (params) => axios.get('/apis/user/list', params)
}

export default new User()