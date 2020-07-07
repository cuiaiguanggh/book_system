let Mock = require('mockjs');

export default {

    '/report/db/actReport': Mock.mock({
        data: {
            'userNumByWebData|12': [{
                num: '@integer(10,500)',
                time: "@date(yyyy-MM)"
            }],
            'userNumByAppData|12': [{
                num: '@integer(10,500)',
                time: "@date(yyyy-MM)"
            }],
            loginTimes: {
                threeLessForW: '@float(0, 99, 1, 1)',
                threeToEightForW: '@float(0, 99, 1, 1)',
                eightMoreForW: '@float(0, 99, 1, 1)',
                threeLessForA: '@float(0, 99, 1, 1)',
                threeToEightForA: '@float(0, 99, 1, 1)',
                eightMoreForA: '@float(0, 99, 1, 1)',
            },
            'schoolActives|10': [{ school: `@city`, number: '@integer(10,1000)' }],
            projectVisits: {
                totalVisitsForWeb: '@integer(100,5000)',
                totalVisitsForApp: '@integer(100,5000)',
                averageWeb: '@integer(100,5000)',
                averageApp: '@integer(100,5000)',
                visitsListForWeb: [],
                visitsListForApp: [],
            },
            'photoConversionRate|7': [{
                id: '@integer(0,1000)',
                name: '',
                num: '@integer(0,100)',
                rate: '@string("number", 1, 3)',
                ratio: '@string("number", 1, 3)',
            }],
            loginConversionRate: {
                appUserNum: '@integer(0,1000)',
                noAccountUserNum: '@integer(0,1000)',
            }
        },
        result: 0,
    }),

};