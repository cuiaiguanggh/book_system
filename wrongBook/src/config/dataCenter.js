// const url = 'http://192.168.10.55:80/wrongManage';// local

// const host = '192.168.10.239:80'
// 测试服务器
 const url = "http://hw-mz-test.mizholdings.com/wrongManage";
 const host1 = "wss://hw-mz-test.mizholdings.com";

// 预备服务器
// const url = 'https://login.kacha.xin/wrongManage-bate';
// const host1 = "ws://login.kacha.xin";


// 正式服务器
//  const url = 'https://login.kacha.xin/wrongManage';
// const host1 = "ws://login.kacha.xin";

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

function getServerType(url){
	let type
	if(url.indexOf('hw-mz-test.mizholdings.com')>-1){
		type=1
	}else if(url.indexOf('login.kacha.xin/wrongManage-bate')>-1){
		type=2
	}else{
		type=3
	}
	return type
}
let serverType= getServerType(url)
export  { 
	dataCenter,
	dataCen,
	serverType
}  