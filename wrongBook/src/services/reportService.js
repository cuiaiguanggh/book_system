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
export {
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
    searchLink,
};
