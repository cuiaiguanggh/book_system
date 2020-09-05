import * as XLSX from 'xlsx';
import {message} from 'antd';
export  function readExcelToJson(file,{complete}){
		if (file.name.indexOf('xls') < 0 && file.name.indexOf('xlsx') < 0 && file.name.indexOf('XLS') < 0 && file.name.indexOf('XLSX') < 0) {
			message.warning('文件类型不正确,请上传xls、xlsx类型');
			return false;
		}
		const fileReader = new FileReader();
		fileReader.onload = event => {
			try {
				const { result } = event.target;
				const workbook = XLSX.read(result, { type: 'binary' });
				let data = [];
				for (const sheet in workbook.Sheets) {
					if (workbook.Sheets.hasOwnProperty(sheet)) {
						// 利用 sheet_to_json 方法将 excel 转成 json 数据
						data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
						break; // 如果只取第一张表，就取消注释这行
					}
				}
                let _elist=[]
                for (let index = 0; index < data.length; index++) {
                    console.log('excel row data: ', Object.values(data[index]));
                    _elist.push(Object.values(data[index]))
                }
                complete(_elist)
        
			} catch (e) {
				message.warning('文件读取错误')
				return;
			}
		};
		fileReader.readAsBinaryString(file);
}
