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
function queryHomeworkScoreDetail(payload){
    return request(dataCenter('/web/report/queryHomeworkScoreDetail'),{
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
function queryQrStudentCount(payload){
    return request(dataCenter('/web/report/queryQrStudentCount'),{
        data:payload
    });
}

export {
    queryQrDetail,
    queryHomeworkList,
    queryHomeworkScoreDetail,
    queryQuestionDetail,
    getQuestionDoxc,
    queryQrStudentCount
};