import request from '../utils/request';
import {dataCenter} from '../config/dataCenter';



function loginTiku(identity, certification){
    let a = 2;
    if(a === 1){
        return request(dataCenter('/web/system/login'), {
            data: {
                username: identity,
                password: certification,
            }
        });
    }else{
        return request(dataCenter('/user/login'), {
            data: {
                username: identity,
                password: certification,
            }
        });
    }
}


export {
    loginTiku
};