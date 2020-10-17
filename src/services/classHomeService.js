import request from '../utils/request';
import { dataCenter } from '../config/dataCenter';

function pageClass(payload) {
    return request(dataCenter('/school/class/list'), {
        data: payload,
        method: 'get'
    });
}
function classInfo(payload) {
    return request(dataCenter('/school/class/info'), {
        data: payload,
        method: 'get'
    });
}
function teacherList(payload) {
    return request(dataCenter('/school/class/members'), {
        data: payload,
        method: 'get'
    });
}
function updateClass(payload) {
    return request(dataCenter('/school/class/manage/update'), {
        data: payload
    });
}
function deleteClass(payload) {
    return request(dataCenter('/school/class/manage/delete'), {
        data: payload
    });
}
function addClass(payload) {
    return request(dataCenter('/school/class/manage/creat'), {
        data: payload
    });
}
function pageUser(payload) {
    return request(dataCenter('/school/users/pageUser'), {
        data: payload,
        method: 'get'
    });
}
function updateInfo(payload) {
    return request(dataCenter('/user/userInfo'), {
        data: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
function queryHomeworkList(payload) {
    return request(dataCenter('/report/homework/list'), {
        data: payload,
        method: 'get'
    });
}
function getClassList(payload) {
    return request(dataCenter('/school/users/class'), {
        data: payload,
        method: 'get'
    });
}
function getYears(payload) {
    return request(dataCenter('/school/info/years'), {
        data: payload,
        method: 'get'
    });
}

function subjectNodeList(payload) {
    return request(dataCenter('/school/subject/school'), {
        data: payload,
        method: 'get'
    });
}
function administrativeDivision(payload) {
    return request(dataCenter('/report/sys/administrativeDivision'), {
        data: payload
    });
}

function getUserInfo(payload) {
    return request(dataCenter('/user/userInfo'), {
        data: payload,
        method: 'get'
    });
}
function promotionClass(payload) {
    return request(dataCenter('/school/class/manage/promotion'), {
        data: payload
    });
}
function teachingClasses(payload) {
    return request(dataCenter('/school/class/user/teachingClasses'), {
        data: payload,
        method: 'get'
    });
}
export {
    teachingClasses,
    pageClass,
    classInfo,
    teacherList,
    updateClass,
    deleteClass,
    addClass,
    pageUser,
    updateInfo,
    queryHomeworkList,
    getClassList,
    getYears,
    subjectNodeList,
    administrativeDivision,
    getUserInfo,
    promotionClass,
};
