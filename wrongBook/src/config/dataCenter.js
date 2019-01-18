//const url = 'http://127.0.0.1/data-center';// local
// const url = 'http://hw-mz-test.mizholdings.com/data-center';// test
// const url = 'http://hw-pre.mizholdings.com/data-center';// pre
// const url = 'http://tiku.mizholdings.com/me2tiku';// true
// const url = 'http://hw.mizholdings.com/data-center';// true
 
const url = 'http://192.168.10.55:8080/wrongManage';// local
// const url = 'http://hw-mz-test.mizholdings.com/wrongManage';// test
// const url = 'http://tiku.mizholdings.com/wrongManage';// true
function autoUrl(pre, api) {
	return pre + api;
}

function dataCenter(api) {
	return autoUrl(url, api);
}

export  {
	dataCenter
}
