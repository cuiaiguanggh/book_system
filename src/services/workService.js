/*
 * @Author: your name
 * @Date: 2020-09-21 09:17:18
 * @LastEditTime: 2020-09-21 15:58:54
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \wrongBook\src\services\workService.js
 */
import request from '../utils/request';
import { dataCenter } from '../config/dataCenter';

function getFileToken(payload) {
    //路径验证
    return request(dataCenter('/file/qiniu/token'), {
        data: payload,
        method: 'get'
    });
}
function testPage(payload) {
    return request(dataCenter('/wrongbook/page'), {
        data: {
            url: payload||"https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient",
            childId: 4645964827397120,
            workType: 1
        }
    });
}

export {
    getFileToken,
    testPage
};
