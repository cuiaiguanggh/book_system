import React from 'react';
import { Layout,message,Upload, Icon, Button,Table
} from 'antd';
import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
import style from './addClass.less';
import store from 'store';
import Dropzone from 'react-dropzone'
import * as XLSX from 'xlsx';

const { Content } = Layout;

//作业中心界面内容
class HomeworkCenter extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = { 
			 editingKey: '',
			 current:'student',
			 fileArr: []

			};
	}
	onImportExcel = file =>{
		const { files } = file.target;
		const fileReader = new FileReader();
			fileReader.onload = event => {
				try {
				const { result } = event.target;
				// 以二进制流方式读取得到整份excel表格对象
				const workbook = XLSX.read(result, { type: 'binary' });
				let data = []; // 存储获取到的数据
				// 遍历每张工作表进行读取（这里默认只读取第一张表）
				for (const sheet in workbook.Sheets) {
					if (workbook.Sheets.hasOwnProperty(sheet)) {
					// 利用 sheet_to_json 方法将 excel 转成 json 数据
					data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
					break; // 如果只取第一张表，就取消注释这行
					}
				}
				this.setState({fileArr:data})
				} catch (e) {
				// 这里可以抛出文件类型错误不正确的相关提示
				message.warning('文件类型不正确')
				return;
				}
			};
			// 以二进制方式打开文件
			fileReader.readAsBinaryString(files[0]);
	}

	onDrop = (acceptedFiles, rejectedFiles) => {
			const fileReader = new FileReader();
			fileReader.onload = event => {
				try {
				const { result } = event.target;
				const workbook = XLSX.read(result, { type: 'binary' });
				let data = []; 
				for (const sheet in workbook.Sheets) {
					if (workbook.Sheets.hasOwnProperty(sheet)) {
					data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
					}
				}
				this.setState({fileArr:data})
				} catch (e) {
				message.warning('文件类型不正确')
				return;
				}
			};
			fileReader.readAsBinaryString(acceptedFiles[0]);	
	}
	render() {
		let state = this.props.state;
		let columns = [
			{
				title: '班级名称',
				dataIndex: 'name',
				key: 'name',
				width: '20%',
			},
			{
				title:'教师姓名',
				dataIndex:'teacher',
				key:'teacher',
				width: '20%',
			},
			{
				title:'班主任',
				dataIndex:'teacherName',
				key:'teacherName',
				width: '20%',
			},
			{
				title:'学科',
				dataIndex:'sub',
				key:'sub',
				width: '20%',
			},
			{
				title:'手机',
				dataIndex:'phone',
				key:'phone',
				width: '20%',
			},
		];
		let fileArr = this.state.fileArr
		
		const dataSource = [];
		if(fileArr.length>0){
			for(let i = 0;i < fileArr.length; i ++){
				let det = fileArr[i]
				let p = {};
				p["key"] = i;
				p["name"] = det.班级名称;
				p["teacher"] = det.姓名;
				p["teacherName"] = det.班主任;
				p["sub"] = det.学科;
				p["phone"] = det.手机号;
				dataSource[i]=p;
			}
		}
		

		return(
			<Layout>
				<Content style={{ overflow: 'initial' }}>
					<div className={style.gradeboder}>
						<Dropzone onDrop={this.onDrop}>
							{({getRootProps, getInputProps, isDragActive}) => {
								return (
									<label htmlFor="file">
										<div className={style.addGrade} 
										{...getRootProps()}
										>
											<span className={style.addSpan}>将Excel文件拖至此处或点击此处上传</span>
										</div>
									</label> 
								)
							}}
						</Dropzone>
						<input
								type='file' 
								id='file' 
								accept='.xlsx, .xls'  
								style={{display:'none'}}
								onChange={this.onImportExcel} 
							/>
						
						<Table
							style={{marginTop:'20px'}}
							bordered
							dataSource={dataSource}
							columns={columns}
							rowClassName="editable-row"
						/>
					</div>
				</Content>
			</Layout>
		)
	}
	componentDidMount(){
		
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
	}
}))(HomeworkCenter);