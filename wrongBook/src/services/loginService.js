import request from '../utils/request';
import {dataCenter} from '../config/dataCenter';



function loginTiku(payload){
    return request(dataCenter('/auth/login/kcsj'),{
        data:payload
    });
}
function loginForGZ(payload){
    return request(dataCenter('/auth/loginForGZ/kcsj'),{
        data:payload
    });
}
function getVC(payload){
    return request(dataCenter('/user/phone/random'),{
        data:payload,
        method:'get'
    });
}
function checkVC(payload){
    return request(dataCenter('/user/phone/check'),{
        data:payload
    });
}
function updateInfo(payload){
    return request(dataCenter('/user/phone/password'),{
        data:payload
    });
}
function webchatLoginForWeb(payload){
    return request(dataCenter('/auth/webchatLogin/kcsj'),{
        data:payload,
        headers : {userType:3,version:'d1.0.0'}
    });
}
function info(payload){
    //获取用户权限
    return request(dataCenter('/auth/permission/info'),{
        data:payload,
        method:'get'
    });
}
function schools(payload){
    return request(dataCenter('/school/users/mine/schools'),{
        data:payload,
        method:'get'
    });
}
function tokenLogin(payload){
    return request(dataCenter('/auth/tokenLogin'),{
        data:payload,
    });
}
export {
    tokenLogin,
    info,
    schools,
    loginTiku,
    getVC,
    checkVC,
    updateInfo,
    webchatLoginForWeb,
    loginForGZ
};