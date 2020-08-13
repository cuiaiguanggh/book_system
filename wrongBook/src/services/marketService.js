import request from '../utils/request';
import { dataCenter } from '../config/dataCenter';

function actReport(payload) {
    return request(dataCenter('/report/db/actReport'), {
        data: payload,
        method: 'get'
    });
}

function vipReport(payload) {
    return request(dataCenter('/report/db/vipReport'), {
        data: payload,
        method: 'get'
    });
}

function timeStamp(payload) {
    return request(dataCenter('/report/db/timeStamp'), {
        data: payload,
    });
}
function classList(payload) {
    return request(dataCenter('/school/class/list'), {
        data: payload,
        method: 'get'
    });
}
function printList(payload) {
    return request(dataCenter('/report/questions/printList'), {
        data: payload,
        method: 'get'
    });
}
function actReportDetail(payload) {
    return request(dataCenter('/report/db/actReportDetail'), {
        data: payload,
        method: 'get'
    });
}
// function changeQueForPrint(payload) {
//     return request(dataCenter('/report/questions/changeQueForPrint'), {
//         data: payload,
//         method: 'get'
//     });
// }
export {
    // changeQueForPrint,
    actReportDetail,
    actReport,
    vipReport,
    timeStamp,
    classList,
    printList,
};