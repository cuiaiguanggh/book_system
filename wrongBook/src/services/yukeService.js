/*
 * @Author: your name
 * @Date: 2020-09-03 14:38:58
 * @LastEditTime: 2020-09-23 13:55:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wrongBook\src\services\yukeService.js
 */
import requestYk from '../utils/requestYk';
let burl = process.env.API_ENV === 't' ? "http://dayour.mizholdings.com:8080/mizhu/api/" : 'https://cloud.mizholdings.com/mizhu/api/'

function fetchQuestions(payload) {
    return requestYk(`${burl}exam/quick?token=ad106f62a09a4e3abaf2f2e728a61c46`, {
        data: payload,
        method: 'post'
    })
}
function queryQuestionsBy(payload) {
    return requestYk(`${burl}exam/quick?token=ad106f62a09a4e3abaf2f2e728a61c46`, {
        data: payload,
        method: 'post'
    })
}
function getZsd(payload) {
    return requestYk(`${burl}exam/quick?token=ad106f62a09a4e3abaf2f2e728a61c46`, {
        data: payload,
        method: 'post'
    })
}
export {
    fetchQuestions,
    queryQuestionsBy,
    getZsd
};
