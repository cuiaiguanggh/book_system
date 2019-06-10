import request from '../utils/request';
import {dataCenter} from '../config/dataCenter';



function loginTiku(payload){
    return request(dataCenter('/user/login'),{
        data:payload
    });
}
function getVC(payload){
    return request(dataCenter('/base/service/getVC'),{
        data:payload
    });
}
function checkVC(payload){
    return request(dataCenter('/base/service/checkVC'),{
        data:payload
    });
}
function updateInfo(payload){
    return request(dataCenter('/user/updateInfo'),{
        data:payload
    });
}
function webchatLoginForWeb(payload){
    return request(dataCenter('/user/webchatLoginForWeb'),{
        data:payload
    });
}

export {
    loginTiku,
    getVC,
    checkVC,
    updateInfo,
    webchatLoginForWeb,
};