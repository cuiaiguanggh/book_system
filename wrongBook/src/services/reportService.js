import request from '../utils/request';
import {dataCenter } from '../config/dataCenter';

function searchLink(payload){
  return request(dataCenter('/web/report/getSearchLink'),{
    data:payload
  });
}
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
function deleteTeachVideo(payload){
    return request(dataCenter('/web/report/deleteTeachVideo'),{
        data:payload
    });
}
function queryTeachVideo(payload){
    return request(dataCenter('/web/report/queryTeachVideo'),{
        data:payload
    });
}
function getQuestionPdf(payload){
    return request(dataCenter('/web/report/getQuestionPdfV2'),{
        data:payload
    });
}
function getQuestionPdf2(payload){
    return request(dataCenter('/web/report/getQuestionPdfV2'),{
        data:payload
    });
}
function getAllPdfV2ForQrc(payload){
    return request(dataCenter('/web/report/getAllPdfV2ForQrc'),{
        data:payload
    });
}
function getAllPdfV2ForQrs(payload){
    return request(dataCenter('/web/report/getAllPdfV2ForQrs'),{
        data:payload
    });
}
function getReportTimeList(payload){
    return request(dataCenter('/web/report/timeStamp'),{
        data:payload
    });
}
function querySchoolDataReport(payload){
    return request(dataCenter('/web/report/querySchoolDataReport'),{
        data:payload
    });
}
function queryClassDataReport(payload){
    return request(dataCenter('/web/report/queryClassDataReport'),{
        data:payload
    });
}
function queryGradeListBySchoolId(payload){
    return request(dataCenter('/web/report/getGradeList'),{
        data:payload
    });
}
function queryClassListByGradeId(payload){
    return request(dataCenter('/web/report/getClassList'),{
        data:payload
    });
}
function querySubListByClassId(payload){
    return request(dataCenter('/web/report/getSubjectList'),{
        data:payload
    });
}
function uploadVideo(payload){
    return request(dataCenter('/web/report/uploadVideo'),{
        data:payload
    });
}
function getCorrection(payload){
    return request(dataCenter('/web/report/getCorrection'),{
        data:payload
    });
}
function WrongQuestionMarker(payload){
    return request(dataCenter('/web/report/wrongQuestionMarker'),{
        data:payload
    });
}
function CorrectionMarker(payload){
    return request(dataCenter('/web/report/correctionMarker'),{
        // headers:{'Content-Type':'application/json'},
        // method: 'post',
        data:payload
    }) 
}
function homeworkRefresh(payload){
  return request(dataCenter('/web/report/homeworkRefresh'),{
    data:payload
  });
}
function makeSelectWB(payload){
  return request(('https://develop.kacha.xin/export/pdf/makeSelectWB'),{
    data:payload
  });
}
function remindHomework(payload){
  return request(dataCenter('/web/report/remindHomework'),{
    data:payload
  });
}
export {
  remindHomework,
    makeSelectWB,
    homeworkRefresh,
    CorrectionMarker,
    WrongQuestionMarker,
    getCorrection,
    queryQrDetail,
    queryHomeworkList,
    queryHomeworkScoreDetail,
    queryQuestionDetail,
    getQuestionDoxc,
    queryQrStudentCount,
    deleteTeachVideo,
    queryTeachVideo,
    getQuestionPdf,
    getAllPdfV2ForQrc,
    getAllPdfV2ForQrs,
    getQuestionPdf2,
    getReportTimeList,
    querySchoolDataReport,
    queryGradeListBySchoolId,
    queryClassListByGradeId,
    querySubListByClassId,
    uploadVideo,
    queryClassDataReport,
    searchLink,
};
