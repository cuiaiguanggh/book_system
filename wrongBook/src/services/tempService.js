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
export {
    queryScoreDetail,
    queryQuestionDetail,
    homeworkDetail,
};