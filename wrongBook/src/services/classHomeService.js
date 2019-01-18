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
    return request(dataCenter('/user/teacherList'),{
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

export {
    pageClass,
    classInfo,
    teacherList,
    updateClass,
    deleteClass,
    addClass,
};