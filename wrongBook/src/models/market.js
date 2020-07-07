import {
    actReport,
    vipReport,
    timeStamp,
    classList,
    printList,
    // changeQueForPrint,
} from '../services/marketService';

import { message } from 'antd';

export default {

    namespace: 'market',

    state: {

    },
    reducers: {

    },
    effects: {
        *actReport({ payload }, { put, select }) {
            let res = yield actReport(payload);
            if (res.data && res.data.result === 0) {
                return res.data.data
            } else {
                message.error(res.data.msg)
            }
        },
        *vipReport({ payload }, { put, select }) {
            let res = yield vipReport(payload);
            if (res.data && res.data.result === 0) {
                return res.data.data
            } else {
                message.error(res.data.msg)
            }
        },
        *timeStamp({ payload }, { put, select }) {
            let res = yield timeStamp(payload);
            if (res.data && res.data.result === 0) {
                return res.data.data
            } else {
                message.error(res.data.msg)
            }
        },
        *classList({ payload }, { put, select }) {
            let res = yield classList(payload);
            if (res.data && res.data.result === 0) {
                return res.data.data
            } else {
                message.error(res.data.msg)
            }
        },
        *printList({ payload }, { put, select }) {
            let res = yield printList(payload);
            if (res.data && res.data.result === 0) {
                return res.data.data
            } else {
                message.error(res.data.msg)
            }
        },

        // *changeQueForPrint({ payload }, { put, select }) {
        //     let res = yield changeQueForPrint(payload);
        //     if (res.data && res.data.result === 0) {
        //         return res.data.data
        //     } else {
        //         message.error(res.data.msg)
        //     }
        // },


    },

}