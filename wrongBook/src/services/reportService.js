import request from '../utils/request';
import {dataCenter} from '../config/dataCenter';

function queryQrDetail(payload){
    return request(dataCenter('/web/report/queryQrDetail'),{
        data:payload
    });
}
function queryHomeworkList(payload){
    return request(dataCenter('/web/report/queryHomeworkList'),{
        data:payload
    });
}
function queryUserScoreDetail(payload){
    return request(dataCenter('/web/report/queryUserScoreDetail'),{
        data:payload
    });
}
function queryQuestionDetail(payload){
    return request(dataCenter('/web/report/queryQuestionDetail'),{
        data:payload
    });
}
function getQuestionDoxc(payload){
    return request(dataCenter('/web/report/getQuestionDoxc'),{
        data:payload
    });
}

export {
    queryQrDetail,
    queryHomeworkList,
    queryUserScoreDetail,
    queryQuestionDetail,
    getQuestionDoxc
};