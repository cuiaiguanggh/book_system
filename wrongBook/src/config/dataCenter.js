// const url = 'http://192.168.10.55:80/wrongManage';// local

// const host = '192.168.10.239:80'
// 测试服务器
// const url = "https://develop.kacha.xin";
// const host1 = "wss://develop.kacha.xin";
// const serverType=0;


// 预备服务器
//  const url = 'https://pre.kacha.xin';
// const host1 = "wss://pre.kacha.xin";
// const serverType=1;


// 正式服务器
 const url = 'https://api.kacha.xin';
const host1 = "wss://api.kacha.xin";
const serverType=1;


// const url = host+'/wrongManage';// test
// const url = 'http://hw-pre.mizholdings.com/wrongManage';// true
function autoUrl(pre, api) {
	return pre + api;
}

function dataCenter(api) {
	return autoUrl(url, api);
}
function dataCen(api) {
	return host1 + api
}
// function dataCenIp(api) {
// 	return url1 + api
// }

export  {
	dataCenter,
	dataCen,
	serverType,
	// dataCenIp,
}  
