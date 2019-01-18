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
export {
    functionList,
    pageRelevantSchool,
    schoolInfo,
    updateSchool,
    deleteSchool,
    addSchool
};