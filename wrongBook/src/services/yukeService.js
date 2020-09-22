/*
 * @Author: your name
 * @Date: 2020-09-10 09:35:26
 * @LastEditTime: 2020-09-22 10:28:00
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
    return requestYk(`${burl}exam/areaDiscern?token=${token}`, {
        data: payload,
        method: 'post'
    });
}

//7.创建分片和识别
// body.examId	int,关联作业ID	
// body.partName	string,分片名称	
// body.partUrl	string,分片图片URL	
// body.remark	string,备注
function createPartAndDiscover(payload) {
    return requestYk(`${burl}exam/createPart?token=${token}`, {
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
    areaDiscern,
    createPartAndDiscover
};
