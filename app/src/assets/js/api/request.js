import axios from 'axios'
import config from "@/config";
import { Message } from 'element-ui'
const baseUrl = config.backend.host;

const service = axios.create({
    baseURL: baseUrl,
    timeout: 50000,
    withCredentials: true,
})
// request interceptor
service.interceptors.request.use(
    // config => {
    //     config.headers['token'] = getToken()
    //     return config
    // },
    // error => {
    //     // do something with request error
    //     console.log(error) // for debug
    //     return Promise.reject(error)
    // }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {

        if (response.request.responseType === 'blob') {
          return response;
        }

        const res = response.data
        console.log("如下是res信息")
        console.log(res)
        return res;
        if (res.code !== "200" && res.status !== '0') {
            // alert('返回结果有错误')
            // Message({
            //   message: res.message || 'Error',
            //   type: 'error',
            //   duration: 5 * 1000
            // })
            // Promise.reject(error)
            // return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
          message: error.response.data.message,
          type: 'error',
          duration: 3 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
