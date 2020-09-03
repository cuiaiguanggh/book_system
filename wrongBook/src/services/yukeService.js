/*
 * @Author: your name
 * @Date: 2020-09-03 14:38:58
 * @LastEditTime: 2020-09-03 15:04:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wrongBook\src\services\yukeService.js
 */
import requestYk from '../utils/requestYk';
const burl = process.env.API_ENV === 't' ? "http://dayour.mizholdings.com:8080/mizhu/api/" : 'http://192.168.10.197:8088/mizhu/api/';

function fetchQuestions(payload) {
    return requestYk(`${burl}exam/quick?token=ad106f62a09a4e3abaf2f2e728a61c46`, {
        data: payload,
        method: 'post'
    })
}
export {
    fetchQuestions,
};
