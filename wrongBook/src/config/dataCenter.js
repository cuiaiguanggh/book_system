// const url = 'http://192.168.10.55:80/wrongManage';// local
const host = "hw-mz-test.mizholdings.com";
const host1 = "wss://hw-mz-test.mizholdings.com";

// const host = 'hw-pre.mizholdings.com';
// const host1 = "ws://hw-pre-test.mizholdings.com";

const url = 'http://'+host+'/wrongManage';// test
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

export  {
	dataCenter,
	dataCen
}  