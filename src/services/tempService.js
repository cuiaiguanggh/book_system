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
export {
    changeQue,
    combinedPaper,
    homeworkDetail,
    getUserSubjectList,
    getQrMonthList,
    systemTime,
    getKnowledgeList
};