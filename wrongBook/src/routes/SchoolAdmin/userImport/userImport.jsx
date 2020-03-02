import React from 'react';
import {
	Layout, message, Upload, Checkbox, Button, Table, Radio, Icon
} from 'antd';
import { connect } from 'dva';
import style from './userImport.less';
import store from 'store';
import Dropzone from 'react-dropzone'
import { dataCenter } from '../../../config/dataCenter'
const { Content, Footer } = Layout;

class UserImport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			teaOrSte: 'tea',
			schoolName: '',
			managerName: '',
			managerPhone: '',
			teacherTable: [],
			studentTable: [],
			schoolType: 0,
			cun: {},
			isImport: 0,
			isOtherSchool: 0,
			checked: false,
			dianji: false

		};

		this.teacherColumns = [
			{
				title: '班级名称',
				dataIndex: 'className',
				width: '17%',
				render: (text, record) => (text)
			}, {
				title: () => (<>年级 <Icon type="exclamation-circle" theme="filled" /></>),
				dataIndex: 'gradeName',
				width: '17%',
				render: (text, record) => (text)
			}, {
				title: (<>教师姓名 <Icon type="exclamation-circle" theme="filled" /></>),
				dataIndex: 'teacherName',
				width: '17%',
				render: (text, record) => (text)
			}, {
				title: (<>任教学科 <Icon type="exclamation-circle" theme="filled" /></>),
				dataIndex: 'subjectName',
				width: '17%',
				render: (text, record) => (text)
			}, {
				title: (<>教师手机号 <Icon type="exclamation-circle" theme="filled" /></>),
				dataIndex: 'phone',
				width: '17%',
				render: (text, record) => (text)
			}, {
				title: '状态',
				dataIndex: 'state',
				align: 'center',
				render: (text, record) => (
					text === '正常' ? <span className={style.normal}>{text}</span> : <span className={style.failure}>{text}</span>
				)

			},
		];
		this.studentColumns = [
			{
				title: '班级名称',
				dataIndex: 'className',
				width: '22%',
				render: (text, record) => (text)
			}, {
				title: (<>年级 <Icon type="exclamation-circle" theme="filled" /></>),
				dataIndex: 'gradeName',
				width: '22%',
				render: (text, record) => (text)
			}, {
				title: (<>学生姓名 <Icon type="exclamation-circle" theme="filled" /></>),
				dataIndex: 'name',
				width: '22%',
				render: (text, record) => (text)
			}, {
				title: (<>帐号 <Icon type="exclamation-circle" theme="filled" /></>),
				dataIndex: 'account',
				width: '22%',
				render: (text, record) => (text)
			}, {
				title: '状态',
				dataIndex: 'state',
				width: '12%',
				align: 'center',
				render: (text, record) => (
					text === '正常' ? <span className={style.normal}>{text}</span> : <span className={style.failure}>{text}</span>
				)
			},
		];
	}

	uploading(file) {
		let token = store.get('wrongBookToken');
		let form = new FormData();
		form.append('excelFile', file[0]);
		form.append('schoolType', this.state.schoolType);
		fetch(dataCenter('/school/class/import/excel'), {
			method: "POST",
			body: form,
			headers: {
				"Authorization": token
			}
		}).then(response => response.json())
			.then(res => {
				if (res.result === 0) {
					let teacherTable = [], studentTable = [];

					for (let obj of res.data.classData) {
						for (let i = 0; i < obj.state.length; i++) {
							teacherTable.push({
								className: obj.className,
								gradeName: obj.gradeName,
								phone: obj.phone[i],
								state: obj.state[i],
								subjectName: obj.subjectName[i],
								teacherName: obj.teacherName[i],
							})
						}
					}
					for (let obj of res.data.studentData) {
						for (let i = 0; i < obj.state.length; i++) {
							studentTable.push({
								className: obj.className,
								gradeName: obj.gradeName,
								account: obj.account[i],
								name: obj.name[i],
								state: obj.state[i],
							})
						}
					}

					this.setState({
						cun: res.data,
						studentTable,
						teacherTable,
						schoolName: res.data.schoolData.schoolName,
						managerName: res.data.schoolData.managerName.join(','),
						managerPhone: res.data.schoolData.managerPhone.join(','),
						isImport: res.data.isImport,
						isOtherSchool: res.data.isOtherSchool,
						checked: false,
					})
				} else {
					message.error(res.message)
				}
			}).catch(function (error) {
				message.error(error.message)
			})
	}

	onImportExcel = files => {
		if (files[0].name.indexOf('xls') < 0 && files[0].name.indexOf('xlsx') < 0 && files[0].name.indexOf('XLS') < 0 && files[0].name.indexOf('XLSX') < 0) {
			message.warning('文件类型不正确,请上传xls、xlsx类型');
			return false;
		}
		this.uploading(files)
	}

	onDrop = (acceptedFiles, rejectedFiles) => {
		if (acceptedFiles[0].path.indexOf('xls') < 0 && acceptedFiles[0].path.indexOf('xlsx') < 0 && acceptedFiles[0].name.indexOf('XLS') < 0 && acceptedFiles[0].name.indexOf('XLSX') < 0) {
			message.warning('文件类型不正确,请上传xls、xlsx类型');
			return false;
		}
		this.uploading(acceptedFiles)
	}

	render() {
		return (
			<Layout style={{ background: '#fff' }}>
				<Content style={{ overflow: 'scroll' }}>
					<div className={style.gradeboder}>
						<div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
							<span style={{ fontWeight: 'bold', color: 'rgba(96,98,102,1)', }}>类型：</span>
							<Radio.Group onChange={(e) => {
								this.setState({
									schoolType: e.target.value,
									isOtherSchool: 0,
									studentTable: [],
									teacherTable: [],
									schoolName: '',
									managerName: '',
									managerPhone: '',
									isImport: 0,
									cun: {},
									checked: false,
								})

							}} value={this.state.schoolType}>
								<Radio className={style.radiobox} value={0}>学校</Radio>
								<Radio className={style.radiobox} value={1} style={{ width: 111, marginLeft: 20 }}>培训机构</Radio>
							</Radio.Group>

							<Button style={{ height: 36, marginLeft: 35 }}
								type="primary" onClick={() => {
									window.open("http://homework.mizholdings.com/kacha/kcct/cb7357ca9cca7c4f/一键创建模版.xlsx", '_blank');
								}}>下载模板</Button>

						</div>
						<Dropzone onDrop={this.onDrop}>
							{({ getRootProps, getInputProps, isDragActive }) => {
								return (
									<div className={style.addGrade}
										{...getRootProps()} >
										<span className={style.addSpan}>将Excel文件拖至此处或
										<Upload showUploadList={false}
												beforeUpload={(file, fileList) => { this.onImportExcel(fileList); return false }}>
												<span className={style.addButon} >上传</span>
											</Upload>
										</span>
									</div>
								)
							}}
						</Dropzone>


					</div>
					<div className={style.tableBox}>
						<p className={style.header}>
							<span style={{ fontWeight: 'bold' }}>
								学校：<span style={{ fontWeight: 400 }}> {this.state.schoolName} </span>
							</span>

							<span style={{ margin: '0 100px', fontWeight: 'bold' }}>
								校管：<span style={{ fontWeight: 400 }}>{this.state.managerName}</span>
							</span>

							<span style={{ fontWeight: 'bold' }}>
								帐号：<span style={{ fontWeight: 400 }}>{this.state.managerPhone}</span>
							</span>
						</p>
						<p className={style.twoHeader} onClick={(e) => {
							if (e.target.id) {
								this.setState({
									teaOrSte: e.target.id
								})
							}

						}}>
							<span id='tea' className={this.state.teaOrSte === 'tea' ? style.baise : ''} style={{ borderRight: '1px solid #dfe4ed' }}>教师</span>
							<span id='ste' className={this.state.teaOrSte === 'ste' ? style.baise : ''} style={this.state.teaOrSte === 'ste' ? { borderRight: '1px solid #dfe4ed' } : {}}>学生</span>
						</p>
						<Table
							style={{ padding: 15 }}
							bordered
							dataSource={this.state.teaOrSte === 'tea' ? this.state.teacherTable : this.state.studentTable}
							columns={this.state.teaOrSte === 'tea' ? this.teacherColumns : this.studentColumns}
							rowKey={(record, index) => index}
							onHeaderRow={column => {
								return {
									className: 'tableTr',
								};
							}}

							pagination={{ pageSize: 10 }}
							scroll={{ y: 290 }} />
					</div>

				</Content>

				<Footer style={this.state.schoolType === 0 && this.state.isOtherSchool === 1 ?
					{
						paddingTop: 35,
						background: '#fff',
						textAlign: 'center',
						borderTop: '1px solid #E7E7E7',
					} : {
						background: '#fff',
						textAlign: 'center',
						borderTop: '1px solid #E7E7E7',
					}

				}>
					<Button className={style.drbutton} onClick={() => {
						this.setState({
							cun: {},
							studentTable: [],
							teacherTable: [],
							schoolName: '',
							managerName: '',
							managerPhone: '',
							isImport: 0,
							checked: false,
							isOtherSchool: 0
						})
					}}>取消导入</Button>

					<Button type="primary" className={style.drbutton} disabled={this.state.schoolType === 0 && this.state.isOtherSchool === 1 && !this.state.checked} onClick={() => {
						if (this.state.isImport === 1) {
							//限制连续点击
							if (this.state.dianji) {
								setTimeout(() => {
									this.setState({
										dianji: false
									})
								}, 5000);
								return;
							}

							this.setState({
								dianji: true
							})

							//导入数据
							this.state.cun.schoolType = this.state.schoolType;
							this.props.dispatch({
								type: 'homePage/importData',
								payload: this.state.cun
							})
						} else {
							message.error('导入数据有误，请修改后再次上传')
						}
					}}>确认导入</Button>
					{this.state.schoolType === 0 && this.state.isOtherSchool === 1 &&
						<Checkbox style={{
							position: 'absolute',
							bottom: 75,
							transform: 'translateX(-80%)'
						}} onChange={(e) => {
							this.setState({
								checked: e.target.checked
							})
						}}><Icon type="exclamation-circle" theme="filled" style={{ color: '#faad14', margin: '0 2px' }} />确定将数据中其他学校的学生账号转移到本校</Checkbox>
					}

				</Footer>
			</Layout >
		)
	}
	componentDidMount() {

	}
}

export default connect((state) => ({
	state: {
		...state.classHome,
	}
}))(UserImport);
