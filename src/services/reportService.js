import request from '../utils/request';
import { dataCenter } from '../config/dataCenter';

function searchLink(payload) {
    return request(dataCenter('/report/db/searchLink'), {
        data: payload,
        method: 'get'
    });
}
function queryQrDetail(payload) {
    return request(dataCenter('/report/db/qrDetail'), {
        data: payload,
        method: 'get'
    });
}
function queryHomeworkList(payload) {
    return request(dataCenter('/report/homework/list'), {
        data: payload,
        method: 'get'
    });
}
function queryHomeworkScoreDetail(payload) {
    return request(dataCenter('/report/homework/score/detail/ps'), {
        data: payload,
        method: 'get'
    });
}
function queryQrStudentCount(payload) {
    return request(dataCenter('/report/db/qrStudentCount'), {
        data: payload,
        method: 'get'
    });
}
function deleteTeachVideo(payload) {
    return request(dataCenter('/report/questions/deleteTeachVideo'), {
        data: payload
    });
}
function queryTeachVideo(payload) {
    return request(dataCenter('/report/questions/teachVideo'), {
        data: payload,
        method: 'get'
    });
}
function getReportTimeList(payload) {
    return request(dataCenter('/report/db/timeStamp'), {
        data: payload
    });
}
function querySchoolDataReport(payload) {
    return request(dataCenter('/report/db/schoolDataReport'), {
        data: payload,
        method: 'get'
    });
}
function queryClassDataReport(payload) {
    return request(dataCenter('/report/db/classDataReport'), {
        data: payload,
        method: 'get'
    });
}
function queryGradeListBySchoolId(payload) {
    return request(dataCenter('/school/grade/list'), {
        data: payload,
        method: 'get'
    });
}
function queryClassListByGradeId(payload) {
    return request(dataCenter('/school/grade/class'), {
        data: payload,
        method: 'get'
    });
}
function querySubListByClassId(payload) {
    return request(dataCenter('/school/subject/class'), {
        data: payload,
        method: 'get'
    });
}
function uploadVideo(payload) {
    return request(dataCenter('/report/questions/uploadVideo'), {
        data: payload
    });
}
function getCorrection(payload) {
    return request(dataCenter('/report/questions/correction/ps'), {
        data: payload,
        method: 'get'
    });
}
function reset(payload) {
    return request(dataCenter('/report/questions/correction/reset'), {
        data: payload,
    });
}
function WrongQuestionMarker(payload) {
    return request(dataCenter('/report/questions/wrongMarker'), {
        data: payload
    });
}
function CorrectionMarker(payload) {
    return request(dataCenter('/report/questions/correction'), {
        data: payload
    })
}
function makeSelectWB(payload) {
    return request(dataCenter('/export/pdf/makeSelectWB'), {
        data: payload,
        method: 'get'
    });
}
function remindHomework(payload) {
    return request(dataCenter('/wpa/weixin/remind'), {
        data: payload
    });
}
function teacherCollect(payload) {
    return request(dataCenter('/school/class/teacherCollect'), {
        data: payload
    });
}
function yuantu(payload) {
    return request(dataCenter('/report/homework/page'), {
        data: payload,
        method: 'get'
    });
}
function rate(payload) {
    return request(dataCenter('/report/homework/score/detail/rate'), {
        data: payload,
        method: 'get'
    });
}
function recommend(payload) {
    return request(dataCenter('/report/db/recommend'), {
        data: payload,
        method: 'get'
    });
}

function videoPrepare(payload) {
    return request(dataCenter('/report/questions/videoPrepare'), {
        data: payload,
    });
}
function makeTestPagePdf(payload) {
    return request(dataCenter('/export/pdf/makeTestPagePdf'), {
        data: payload,
        method: 'get'
    });
}
function makeIntelligentTestPdf(payload) {
    return request(dataCenter('/export/pdf/makeIntelligentTestPdf'), {
        data: payload,
        method: 'get'
    });
}
function knowledgeQue(payload) {
    return request(dataCenter('/report/questions/knowledgeQue'), {
        data: payload,
        method: 'get'
    });
}
function queryCourseDetail(payload) {
    return request(dataCenter('/export/pdf/queryCourseDetail'), {
        data: payload,
        method: 'get'
    });
}
function makeMidExamPdfs(payload) {
    return request(dataCenter('/export/pdf/makeMidExamPdfs'), {
        data: payload,
        method: 'get'
    });
}
function tree(payload) {
    return request(dataCenter('/question/qb/tree'), {
        data: payload,
        method: 'get'
    });
}
function queDetail(payload) {
    return request(dataCenter('/question/qb/queDetail'), {
        data: payload,
        method: 'get'
    });
}
function sign(payload) {
    return request(dataCenter('/question/qb/sign'), {
        data: payload,
    });
}
function remove(payload) {
    return request(dataCenter('/question/qb/remove'), {
        data: payload,
    });
}
function homeworkCommit(payload) {
    return request(dataCenter('/export/excel/homeworkCommit'), {
        data: payload,
    });
}
function exportClassDate(payload) {
    return request(dataCenter('/export/excel/exportClassDate'), {
        data: payload,
    });
}

function maidian(payload) {
    return request(dataCenter('/school/users/act'), {
        data: payload,
    });
}
function updateQuestionInfo(payload) {
    return request(dataCenter('/question/qb/printPicTrigger'), {
        data: payload
    });
}
function qrKnowledgeInfo(payload) {
    return request(dataCenter('/question/qb/qrKnowledgeInfo'), {
        data: payload,
        method:'get'
    });
}
function questionAddKnowledge(payload) {
    return request(dataCenter('/question/qb/questionAddKnowledge'), {
        data: payload,
        method:'post',
        headers:{
            'Content-Type':'application/json'
        }
    });
}
function qrQuestionInfo(payload) {
    return request(dataCenter('/question/qb/qrQuestionInfo'), {
        data: payload,
        method:'get',
        
    });
}
function modifyQuestionAttr(payload) {
    return request(dataCenter('/question/qb/modifyQuestionAttr'), {
        data: payload,
    });
}
export {
    maidian,
    homeworkCommit,
    exportClassDate,
    remove,
    sign,
    queDetail,
    tree,
    reset,
    makeMidExamPdfs,
    queryCourseDetail,
    knowledgeQue,
    makeIntelligentTestPdf,
    makeTestPagePdf,
    videoPrepare,
    recommend,
    rate,
    yuantu,
    teacherCollect,
    remindHomework,
    makeSelectWB,
    CorrectionMarker,
    WrongQuestionMarker,
    getCorrection,
    queryQrDetail,
    queryHomeworkList,
    queryHomeworkScoreDetail,
    queryQrStudentCount,
    deleteTeachVideo,
    queryTeachVideo,
    getReportTimeList,
    querySchoolDataReport,
    queryGradeListBySchoolId,
    queryClassListByGradeId,
    querySubListByClassId,
    uploadVideo,
    queryClassDataReport,
    searchLink,updateQuestionInfo,qrKnowledgeInfo,questionAddKnowledge,qrQuestionInfo,modifyQuestionAttr
};
