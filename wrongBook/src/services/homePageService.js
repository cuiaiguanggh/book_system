import request from '../utils/request';
import { dataCenter } from '../config/dataCenter';

// function functionList(){
//     return request(dataCenter('/user/functionList'));
// }
function pageRelevantSchool(payload) {
    return request(dataCenter('/school/info/schoollist'), {
        data: payload,
        method: 'get'
    });
}
function schoolInfo(payload) {
    return request(dataCenter('/school/info/detail'), {
        data: payload,
        method: 'get'
    });
}
function updateSchool(data) {
    return request(dataCenter('/school/manage/update'), {
        data: data
    });
}
function deleteSchool(payload) {
    return request(dataCenter('/school/manage/delete'), {
        data: payload
    });
}
function addSchool(payload) {
    return request(dataCenter('/school/manage/create'), {
        data: payload
    });
}
function teacherList(payload) {
    return request(dataCenter('/school/class/members'), {
        data: payload,
        method: 'get'
    });
}
function administrativeDivision(payload) {
    return request(dataCenter('/report/sys/administrativeDivision'), {
        data: payload
    });
}
function kickClass(payload) {
    return request(dataCenter('/school/class/manage/user/exit'), {
        data: payload
    });
}
function createSchoolUser(payload) {
    return request(dataCenter('/school/users/creat'), {
        data: payload
    });
}
function subjectNodeList(payload) {
    return request(dataCenter('/school/subject/school'), {
        data: payload,
        method: 'get'
    });
}
function getEnableYears(payload) {
    return request(dataCenter('/school/info/years'), {
        data: payload,
        method: 'get'
    });
}
function getSubjectList(payload) {
    return request(dataCenter('/school/subject/class'), {
        data: payload,
        method: 'get'
    });
}
function pageClass(payload) {
    return request(dataCenter('/school/class/list'), {
        data: payload,
        method: 'get'
    });
}
function membersForSA(payload) {
    return request(dataCenter('/school/class/membersForSA'), {
        data: payload,
        method: 'get'
    });
}
function makeUserDateWB(payload) {
    return request(dataCenter('/export/pdf/exportStudentPdf'), {
        data: payload,
        method: 'get'
    });
}
function updateChild(payload) {
    return request(dataCenter('/parenthood/updateChild'), {
        data: payload,
    });
}
function wxCode(payload) {
    return request(dataCenter('/wpa/weixin/wxCode'), {
        data: payload,
    });
}
function pushMarker(payload) {
    return request(dataCenter('/school/class/manage/user/pushMarker'), {
        data: payload,
    });
}
function assign(payload) {
    return request(dataCenter('/auth/role/assign'), {
        data: payload,
    });
}
function remove(payload) {
    return request(dataCenter('/auth/role/remove'), {
        data: payload,
    });
}
function exit(payload) {
    return request(dataCenter('/school/class/student/exit'), {
        data: payload,
    });
}
function create(payload) {
    return request(dataCenter('/school/class/student/create'), {
        data: payload,
    });
}
function importData(payload) {
    return request(dataCenter('/school/class/manage/create/importData'), {
        data: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
function care(payload) {
    return request(dataCenter('/school/users/care'), {
        data: payload,
    });
}

export {
    care,
    importData,
    create,
    exit,
    remove,
    assign,
    pushMarker,
    wxCode,
    updateChild,
    makeUserDateWB,
    membersForSA,
    getSubjectList,
    pageClass,
    // functionList,
    pageRelevantSchool,
    schoolInfo,
    updateSchool,
    deleteSchool,
    addSchool,
    teacherList,
    kickClass,
    createSchoolUser,
    subjectNodeList,
    administrativeDivision,
    getEnableYears,
};
