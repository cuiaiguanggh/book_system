import request from '../utils/request';
import { dataCenter } from '../config/dataCenter';


function subjectList(payload) {
    return request(dataCenter('/report/homework/subjectList'), {
        data: payload,
        method: 'get'
    });
}

function homeworkList(payload) {
    return request(dataCenter('/report/homework/homeworkList'), {
        data: payload,
        method: 'get'
    });
}
function studentList(payload) {
    return request(dataCenter('/report/homework/studentList'), {
        data: payload,
        method: 'get'
    });
}
function markCommit(payload) {
    return request(dataCenter('/report/homework/markCommit'), {
        data: payload,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
function pages(payload) {
    return request(dataCenter('/report/homework/pages'), {
        data: payload,
        method: 'get'
    });
}
function pageCommit(payload) {
    return request(dataCenter('/report/homework/pageCommit'), {
        data: payload,
        method: 'post',
    });
}
function remind(payload) {
    return request(dataCenter('/report/homework/remind'), {
        data: payload,
        method: 'post',
    });
}
export {
    remind,
    pageCommit,
    pages,
    subjectList,
    homeworkList,
    studentList,
    markCommit
};