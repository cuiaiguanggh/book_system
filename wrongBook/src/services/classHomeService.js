import request from '../utils/request';
import {dataCenter} from '../config/dataCenter';

function pageClass(payload){
    return request(dataCenter('/user/pageClass'),{
        data:payload
    });
}
function classInfo(payload){
    return request(dataCenter('/user/classInfo'),{
        data:payload
    });
}
function teacherList(payload){
    return request(dataCenter('/user/memberList'),{
        data:payload
    });
}
function updateClass(payload){
    return request(dataCenter('/user/updateClass'),{
        data:payload
    });
}
function deleteClass(payload){
    return request(dataCenter('/user/deleteClass'),{
        data:payload
    });
}
function addClass(payload){
    return request(dataCenter('/user/addClass'),{
        data:payload
    });
}
function pageUser(payload){
    return request(dataCenter('/user/pageUser'),{
        data:payload
    });
}
function updateInfo(payload){
    return request(dataCenter('/user/updateInfo'),{
        data:payload
    });
}
function queryHomeworkList(payload){
    return request(dataCenter('/web/report/queryHomeworkList'),{
        data:payload
    });
}
function getClassList(payload){
    return request(dataCenter('/user/getClassList'),{
      data:payload
    });
}
function getYears(payload){
    return request(dataCenter('/sys/config/getEnableYears'),{
        data:payload
    });
}
function createSchoolUser(payload){
    return request(dataCenter('/user/createSchoolUser'),{
        data:payload
    });
}
function subjectNodeList(payload){
    return request(dataCenter('/sys/config/subjectNodeList'),{
        data:payload
    });
}
function administrativeDivision(payload){
    return request(dataCenter('/sys/config/administrativeDivision'), {
        data:payload
    });
}
function kickClass(payload){
    return request(dataCenter('/user/kickClass'), {
        data:payload
    });
}
function getSubjectList(payload){
    return request(dataCenter('/user/getSubjectList'), {
        data:payload
    });
}
function getUserInfo(payload){
    return request(dataCenter('/user/getUserInfo'), {
        data:payload
    });
}
export {
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
    createSchoolUser,
    subjectNodeList,
    administrativeDivision,
    kickClass,
    getSubjectList,
    getUserInfo,
};
