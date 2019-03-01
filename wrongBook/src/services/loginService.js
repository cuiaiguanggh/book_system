import request from '../utils/request';
import {dataCenter} from '../config/dataCenter';



function loginTiku(payload){
    return request(dataCenter('/user/login'),{
        data:payload
    });
}


export {
    loginTiku
};