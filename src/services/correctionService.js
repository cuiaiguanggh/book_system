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
function check(payload) {
    return request(dataCenter('/report/homework/check'), {
        data: payload,
        method: 'post',
    });
}
function workCommit(payload) {
    return request(dataCenter('/report/homework/workCommit'), {
        data: payload,
        method: 'post',
    });
}
function updateCommit(payload) {
    return request(dataCenter('/report/homework/updateCommit'), {
        data: payload,
        method: 'post',
    });
}
function deleteCommit(payload) {
    return request(dataCenter('/report/homework/deleteCommit'), {
        data: payload,
        method: 'post',
    });
}
function teacherCommit(payload) {
    return request(dataCenter('/report/homework/teacherCommit'), {
        data: payload,
        method: 'post',
    });
}
function homeworkCommit(payload) {
    return request(dataCenter('/export/excel/homeworkCommit'), {
        data: payload,
    });
}
function share(payload) {
    return request(dataCenter('/report/homework/share'), {
        data: payload,
    });
}
function setTrue(payload) {
    return request(dataCenter('/report/homework/setTrue'), {
        data: payload,
        method: 'post',
    });
}


export {
    setTrue,
    share,
    homeworkCommit,
    teacherCommit,
    deleteCommit,
    workCommit,
    updateCommit,
    check,
    remind,
    pageCommit,
    pages,
    subjectList,
    homeworkList,
    studentList,
    markCommit
};