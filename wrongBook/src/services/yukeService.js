import requestYk from '../utils/requestYk';
let burl = process.env.API_ENV === 't' ? "http://dayour.mizholdings.com:8080/mizhu/api/" : 'https://cloud.mizholdings.com/mizhu/api/'
let token='ad106f62a09a4e3abaf2f2e728a61c46'
function fetchQuestions(payload) {
    return requestYk(`${burl}exam/quick?token=${token}`, {
        data: payload,
        method: 'post'
    })
}
//work model
function getWorkList(payload) {
    return requestYk(`${burl}exam/quick?token=${token}`, {
        data: payload,
        method: 'post'
    })
}
//
export {
    fetchQuestions,
    getWorkList
};
