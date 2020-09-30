/*
 * @Author: your name
 * @Date: 2020-09-10 09:35:26
 * @LastEditTime: 2020-09-30 17:49:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wrongBook\src\services\yukeService.js
 */

import store from 'store';
import requestYk from '../utils/requestYk';
let burl = process.env.API_ENV === 't' ? "http://dayour.mizholdings.com:8080/mizhu/api/" : 'https://cloud.mizholdings.com/mizhu/api/'

let burl2 = process.env.API_ENV === 't' ? "http://dayour.mizholdings.com:8080/mizhu/api/" : 'https://api.huijudi.cn/mizhu/api/'
let burl3 = process.env.API_ENV === 't' ? "http://shfc.kacha.xin/" : 'http://shfc.kacha.xin/'
function fetchQuestions(payload) {
    return requestYk(`${burl}exam/quick?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/json'
        }
        
    })
}
function queryQuestionsBy(payload) {
    return requestYk(`${burl2}ques/getQuestion?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function getZsd(payload) {
    return requestYk(`${burl2}knowbas/aftList?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function updateQuestion(payload) {
    return requestYk(`${burl2}ques/updateQuestion?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function recoverQuestion(payload) {
    return requestYk(`${burl2}ques/recoverQuestion?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function updatePageDate(payload) {
    return requestYk(`${burl2}ques/updatePageDate?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function updateQuestionsNum(payload) {
    return requestYk(`${burl3}adjust/questions?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}

export {
    fetchQuestions,
    queryQuestionsBy,
    getZsd,recoverQuestion,updateQuestion,updatePageDate,updateQuestionsNum
};
