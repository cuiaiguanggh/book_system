/*
 * @Author: your name
 * @Date: 2020-09-07 09:39:59
 * @LastEditTime: 2020-09-15 18:53:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wrongBook\src\services\tempService.js
 */
import request from '../utils/request';
import { dataCenter } from '../config/dataCenter';

function homeworkDetail(payload) {
    return request(dataCenter('/report/homework/detail'), {
        data: payload,
        method: 'get'
    });
}
function getUserSubjectList(payload) {
    return request(dataCenter('/school/subject/class'), {
        data: payload,
        method: 'get'
    });
}
function getQrMonthList(payload) {
    return request(dataCenter('/report/db/qrMonthList'), {
        data: payload,
        method: 'get'
    });
}
function systemTime(payload) {
    return request(dataCenter('/report/sys/systemTime'), {
        data: payload
    });
}
function getKnowledgeList(payload) {
    return request(dataCenter('/report/db/knowledgeList'), {
        data: payload,
        method: 'get'
    });
}
function combinedPaper(payload) {
    return request(dataCenter('/report/questions/combinedPaper'), {
        data: payload,
        method: 'get'
    });
}
function changeQue(payload) {
    return request(dataCenter('/report/questions/changeQue'), {
        data: payload,
        method: 'get'
    });
}
function testPage(payload) {
    return request(dataCenter('/wrongbook/page'), {
        data: {
            url: "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient",
            childId: 4645964827397120,
            workType: 1
        }
    });
}
export {
    changeQue,
    combinedPaper,
    homeworkDetail,
    getUserSubjectList,
    getQrMonthList,
    systemTime,
    getKnowledgeList,
    testPage
};