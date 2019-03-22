import request from '../utils/request';
import {dataCenter} from '../config/dataCenter';

function functionList(){
    return request(dataCenter('/user/functionList'));
}
function pageRelevantSchool(payload){
    return request(dataCenter('/user/pageRelevantSchool'), {
        data:payload
    });
}
function schoolInfo(payload){
    return request(dataCenter('/user/schoolInfo'), {
        data:payload
    });
}
function updateSchool(data){
    return request(dataCenter('/user/updateSchool'), {
        data:data
    });
}
function deleteSchool(payload){
    return request(dataCenter('/user/deleteSchool'), {
        data:payload
    });
}
function addSchool(payload){
    return request(dataCenter('/user/addSchool'), {
        data:payload
    });
}
function teacherList(payload){
    return request(dataCenter('/user/memberList'), {
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
function kickClass(payload){
    return request(dataCenter('/user/kickClass'), {
        data:payload
    });
}
function getEnableYears(payload){
    return request(dataCenter('/sys/config/getEnableYears'), {
        data:payload
    });
}

export {
    functionList,
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