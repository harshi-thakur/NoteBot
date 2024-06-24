const axios = require('axios');
const MY_TOKEN = process.env.TELE_BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;

function getAxiosInstance(BASE_URL,headers={}) {
    return{
        get(method,params){
            return axios.get(`/${method}`,{
                baseURL:BASE_URL,
                params,
                headers,
            });
        },
        post(method,data){
            return axios({
                method:"post",
                baseURL:BASE_URL,
                url:`/${method}`,
                data,
                headers,
            });
        }
    };
}

const axiosInstance = getAxiosInstance(BASE_URL);
module.exports ={axiosInstance};