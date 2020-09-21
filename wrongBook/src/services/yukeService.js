/*
 * @Author: your name
 * @Date: 2020-09-10 09:35:26
 * @LastEditTime: 2020-09-21 19:48:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wrongBook\src\services\yukeService.js
 */
import requestYk from '../utils/requestYk';
let burl = process.env.API_ENV === 't' ? "http://dayour.mizholdings.com:8080/mizhu/api/" : 'https://cloud.mizholdings.com/mizhu/api/'
let token='eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI0MzYxNDcxNDc2Nzk1MzkyIiwibG9naW5UaW1lIjoxNjAwNjUzMzM0NDE2LCJwcm9qZWN0Ijoia2NzaiJ9.Xpt_KjKG7JRBjVYR1M1iPHhbBii09tAUfWXCwMhrgEQ'
function fetchQuestions(payload) {
    return requestYk(`${burl}exam/quick?token=${token}`, {
        data: payload,
        method: 'post'
    })
}
//work model
function getWorkList(payload) {
    return requestYk(`${burl}exam/quick?token=${token}`, {
        data: payload,
        method: 'post'
    })
}
function createWork(payload) {
    return requestYk(`${burl}exam/create?token=${token}`, {
        data: payload,
        method: 'post'
    });
}
function workList(payload) {
    return requestYk(`${burl}exam/list?token=${token}`, {
        data: payload,
        method: 'post'
    });
}
function areaDiscern(payload) {
    return areaDiscern(`${burl}exam/areaDiscern?token=${token}`, {
        data: payload,
        method: 'post'
    });
}

//
export {
    fetchQuestions,
    getWorkList,
    createWork,
    workList,
    areaDiscern
};
