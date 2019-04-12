// const url = 'http://192.168.10.55:80/wrongManage';// local
const url = 'http://hw-mz-test.mizholdings.com/wrongManage';// test
// const url = 'http://hw-pre.mizholdings.com/wrongManage';// true
function autoUrl(pre, api) {
	return pre + api;
}

function dataCenter(api) {
	return autoUrl(url, api);
}

export  {
	dataCenter
} 