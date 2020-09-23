
import store from 'store';
import requestYk from '../utils/requestYk';
let burl = process.env.API_ENV === 't' ? "http://dayour.mizholdings.com:8080/mizhu/api/" : 'https://cloud.mizholdings.com/mizhu/api/'
let _token=store.get('wrongBookToken')
function fetchQuestions(payload) {
    return requestYk(`${burl}exam/quick?token=${_token}`, {
        data: payload,
        method: 'post'
    })
}
function queryQuestionsBy(payload) {
    return requestYk(`${burl}ques/getQuestion?token=${_token}`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function getZsd(payload) {
    return requestYk(`${burl}knowbas/aftList?token=${_token}`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function updateQuestion(payload) {
    console.log('payload1: ', payload);
    return requestYk(`${burl}ques/updateQuestion?token=${_token}`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
export {
    fetchQuestions,
    queryQuestionsBy,
    getZsd,updateQuestion
};
