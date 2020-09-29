/*
 * @Author: your name
 * @Date: 2020-09-10 09:35:26
 * @LastEditTime: 2020-09-29 13:32:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wrongBook\src\services\yukeService.js
 */


import requestYk from '../utils/requestYk';
let burl = process.env.API_ENV === 't' ? "http://dayour.mizholdings.com:8080/mizhu/api/" : 'https://cloud.mizholdings.com/mizhu/api/'

let burl2 = process.env.API_ENV === 't' ? "http://dayour.mizholdings.com:8080/mizhu/api/" : 'https://api.huijudi.cn/mizhu/api/'

function fetchQuestions(payload) {
    return requestYk(`${burl}exam/quick?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/json'
        }
        
    })
}
function queryQuestionsBy(payload) {
    return requestYk(`${burl2}ques/getQuestion?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function getZsd(payload) {
    return requestYk(`${burl2}knowbas/aftList?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function updateQuestion(payload) {
    return requestYk(`${burl2}ques/updateQuestion?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function recoverQuestion(payload) {
    return requestYk(`${burl2}ques/recoverQuestion?token=`, {
        data: payload,
        method: 'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
function createWork(payload) {
    return requestYk(`${burl}exam/create?token=`, {
        data: payload,
        method: 'post'
    });
}
function workList(payload) {
    return requestYk(`${burl}exam/list?token=`, {
        data: payload,
        method: 'post'
    });
}
function areaDiscern(payload) {
    return requestYk(`${burl}exam/areaDiscern?token=`, {
        data: payload,
        method: 'post'
    });
}

//7.创建分片和识别
// body.examId	int,关联作业ID	
// body.partName	string,分片名称	
// body.partUrl	string,分片图片URL	
// body.remark	string,备注
function createPartAndDiscover(payload) {
    return requestYk(`${burl}exam/createPart?token=`, {
        data: payload,
        method: 'post'
    });
}

//
function workPartList(payload) {
    return requestYk(`${burl}exam/partList?token=`, {
        data: payload,
        method: 'post'
    });
}
function workPartInfo(payload) {
    return requestYk(`${burl}exam/partInfo?token=`, {
        data: payload,
        method: 'post'
    });
}
function examInfo(payload) {
    return requestYk(`${burl}exam/info?token=`, {
        data: payload,
        method: 'post'
    });
}
function delPart(payload) {
    return requestYk(`${burl}exam/delPart?token=`, {
        data: payload,
        method: 'post'
    });
}
function publishWork(payload) {
    return requestYk(`${burl}exam/publish?token=`, {
        data: payload,
        method: 'post'
    });
}
function updateWork(payload) {
    return requestYk(`${burl}exam/update?token=`, {
        data: payload,
        method: 'post'
    });
}
function updateGroup(payload) {
    return requestYk(`${burl}exam/updateGroup?token=`, {
        data: payload,
        method: 'post'
    });
}
function commitQuestions(payload) {
    return requestYk(`${burl}exam/createWrongQues?token=`, {
        data: payload,
        method: 'post'
    });
}
function getStudentQuestions(payload) {
    return requestYk(`${burl}exam/wrongQues?token=`, {
        data: payload,
        method: 'post'
    });
}
function wrongUsers(payload) {
    return requestYk(`${burl}exam/wrongUsers?token=`, {
        data: payload,
        method: 'post'
    });
}
function quesDelete(payload) {
    return requestYk(`${burl}exam/quesDelete?token=`, {
        data: payload,
        method: 'post'
    });
}

function refreshPart(payload) {
    return requestYk(`${burl}exam/refreshPart?token=`, {
        data: payload,
        method: 'post'
    });
}
function updatePartRemark(payload){
    return requestYk(`${burl}exam/updatePartRemark?token=`, {
        data: payload,
        method: 'post'
    });
}
function deleteWork(payload){
    return requestYk(`${burl}exam/del?token=`, {
        data: payload,
        method: 'post'
    });
}
export {
    fetchQuestions,
    createWork,
    workList,
    areaDiscern,
    createPartAndDiscover,
    workPartList,
    workPartInfo,
    examInfo,
    delPart,
    publishWork,
    updateWork,
    updateGroup,commitQuestions,getStudentQuestions,wrongUsers,quesDelete,refreshPart,updatePartRemark,deleteWork,
    queryQuestionsBy,
    getZsd,recoverQuestion,updateQuestion
};
