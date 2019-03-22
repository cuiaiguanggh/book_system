import request from '../utils/request';
import {dataCenter} from '../config/dataCenter';

function queryScoreDetail(payload){
    return request(dataCenter('/web/report/queryScoreDetail'),{
        data:payload
    });
}
function queryQuestionDetail(payload){
    return request(dataCenter('/web/report/queryQuestionDetail'),{
        data:payload
    });
}
function homeworkDetail(payload){
    return request(dataCenter('/web/report/homeworkDetail'),{
        data:payload
    });
}
function getUserSubjectList(payload){
    return request(dataCenter('/user/getUserSubjectList'),{
        data:payload
    });
}
function getQrMonthList(payload){
    return request(dataCenter('/web/report/getQrMonthList'),{
        data:payload
    });
}

export {
    queryScoreDetail,
    queryQuestionDetail,
    homeworkDetail,
    getUserSubjectList,
    getQrMonthList,
};