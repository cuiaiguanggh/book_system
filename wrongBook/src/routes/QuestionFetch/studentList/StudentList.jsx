import React, { useState, useEffect } from 'react';
import {
	Layout, Table, Input, message, Modal, Select, Radio, Popover, Button, Spin, Checkbox, DatePicker, Icon, Upload
} from 'antd';
import { connect } from 'dva';
import style from './studentList.less';
import store from 'store';
import observer from '../../../utils/observer'
import { dataCenter } from '../../../config/dataCenter';
import moment from 'moment';
moment.locale('zh-cn');

const confirm = Modal.confirm;
const { Content } = Layout;
const Search = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;

function Trim() {
	String.prototype.trim = function () {
		return this.replace(/(^\s*) | (\s*$)/g, '');
	}
}
//学生弹窗
const StuPopup = connect()(
	function (props) {
		const [name, setName] = useState(props.stuName ? props.stuName : '');
		const [account, setAccount] = useState(props.stuAccounts ? props.stuAccounts : '');
		const [password, setPassword] = useState('888888');
		const [visible, setVisible] = useState(false);
		const [serviceType, setServiceType] = useState(props.serviceType ? props.serviceType : 0);
		const [date, setDate] = useState(props.serviceBegin && props.serviceType === 2 ? [moment(props.serviceBegin), moment(props.serviceEnd)] : [moment(), moment().add(7, 'd')]);
		const [serviceSubject, setServiceSubject] = useState(props.serviceSubject ? props.serviceSubject.split(',') : []);

		useEffect(() => {
			setServiceType(props.serviceType ? props.serviceType : 0)
		}, [props.serviceType]);

		return (
			<>
				{/* {props.title === '添加学生' ?
					<span className={style.addGrade} onClick={() => { setVisible(true); }}>
						<img src={require('../../images/sp-xt-n.png')} style={{ width: 12, margin: '0px 8px 4px 0' }} />添加学生</span>
					:
					<span style={{ color: '#2296F3', fontSize: 12, cursor: 'pointer' }} onClick={() => { setVisible(true); }}>编辑</span>} */}


				<Modal title={props.title}
					visible={visible}
					destroyOnClose={true}
					onOk={() => {
						if (account.trim() == '' || account.trim() == '' || password.trim() == '') {
							message.warning('请填写正确信息')
							return;
						}

						let data = {
							classId: props.classId,
							account,
							name,
							serviceType
						}

						if (props.title === '编辑') {
							data.userId = props.userId;
						}

						if (serviceType === 1) {
							if (date.length === 0) {
								message.warning('请选择服务期限')
								return;
							}
							data.serviceBegin = moment(date[0]).format('YYYY-MM-DD');
							data.serviceEnd = moment(date[1]).format('YYYY-MM-DD');
						} else if (serviceType === 2) {
							if (date.length === 0) {
								message.warning('请选择服务期限')
								return;
							}
							data.serviceBegin = moment(date[0]).format('YYYY-MM-DD');
							data.serviceEnd = moment(date[1]).format('YYYY-MM-DD');
							data.serviceSubject = serviceSubject;
						}

						if (props.title === '添加学生') {

							props.dispatch({
								type: 'homePage/addStudent',
								payload: data
							}).then((res) => {
								//刷新
								props.refresh()
								setName('');
								setAccount('');
								setPassword('888888');
								setDate([]);
								setServiceSubject([]);
								setServiceType(0)

							})
						} else if (props.title === '编辑') {
							props.dispatch({
								type: 'homePage/changeStudent',
								payload: data
							}).then((res) => {
								//刷新
								props.refresh()
							})
						}
						setVisible(false);

					}}
					onCancel={() => {
						setVisible(false);

						if (props.title === '添加学生') {
							setName('');
							setAccount('');
							setPassword('888888');
							setDate([]);
							setServiceSubject([]);
							setServiceType(0)
						}

					}}
					okText='确定'
					cancelText='取消'>

					<div style={{ marginBottom: 20 }}>
						<span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: '#F5232D' }}> *</span>用户身份：</span>
						<Radio.Group onChange={(e) => {
							setServiceType(e.target.value)
							if (e.target.value === Number(2) && props.serviceBegin) {
								setDate([moment(props.serviceBegin), moment(props.serviceEnd)])
							} else if (e.target.value === Number(1)) {
								setDate([moment(), moment().add(7, 'd')])
							}
						}} value={serviceType}>
							<Radio value={0}>普通用户</Radio>
							<Radio value={1}>试用用户</Radio>
							<Radio value={2}>付费用户</Radio>
						</Radio.Group>
					</div>

					<div style={{ marginBottom: 20 }}>
						<span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: '#F5232D' }}> *</span>用户姓名：</span>
						<Input value={name} onChange={(e) => { setName(e.target.value.replace(/^ +| +$/g, '')) }} style={{ width: '200px' }} />
					</div>

					<div style={{ marginBottom: 20 }}>
						<span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: '#F5232D' }}> *</span>帐号：</span>
						<Input value={account} onChange={(e) => { setAccount(e.target.value.replace(/[^\w\.\/]/ig, '')) }} style={{ width: '200px' }} />
					</div>
					{props.title === '添加学生' &&
						< div style={{ marginBottom: 20 }}>
							<span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: '#F5232D' }}> *</span>密码：</span>
							<Input value={password} onChange={(e) => { setPassword(e.target.value.replace(/[^\w\.\/]/ig, '')) }} style={{ width: '200px' }} />
						</div>}
					{serviceType !== 0 && <div style={{ marginBottom: 20 }}>
						<span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: '#F5232D' }}> *</span>服务期限：</span>
						<RangePicker placeholder={['开始期限', '结束期限']} format="YYYY-MM-DD" value={date}
							onChange={(date, dateString) => {
								setDate(date);
								if (serviceType === Number(1)) {
									setDate([date[0], moment(date[0]).add(7, 'd')])
								}
							}} />
					</div>}

					{serviceType === 2 && <div style={{ marginBottom: 20 }}>
						<span style={{ width: "80px", display: 'inline-block' }}>寄送学科：</span>
						<Checkbox.Group value={serviceSubject} options={['数学', '物理', '化学', '生物', '科学']}
							onChange={(value) => { setServiceSubject(value) }} />
					</div>}

					{props.title === '编辑' &&
						<div style={{
							color: '#2C98F0', position: 'absolute',
							bottom: 15,
							cursor: 'pointer'
						}}
							onClick={() => {
								props.dispatch({
									type: 'homePage/resetPassword',
									payload: { userId: props.userId }
								})
							}}>重置密码</div>}
				</Modal>
			</>
		)
	})
//作业中心界面内容
class HomeworkCenter extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			editingKey: '',
			visible: false,
			visibleS: false,
			teacher: '',
			phone: '',
			sub: 0,
			searchType: 0,
			teacherName: '',
			content: <div style={{
				textAlign: "center", width: 300, height: 280, display: 'flex',
				justifyContent: 'center',
				flexDirection: 'column'
			}}> <Spin /> </div>,
			pitchOn: '',
			selectedRowKeys: [],
			isCare: 1,
			selectUser: '',
			selectStudent:{}
		};
		observer.addSubscribe('fuyuan', () => {
			this.setState({
				content: <div style={{
					textAlign: "center", width: 300, height: 280,
					display: 'flex',
					justifyContent: 'center',
					flexDirection: 'column'
				}}> <Spin /> </div>,
			})
		})
		//刷新左侧列表和学生列表
		this.refreshStu = () => {
			this.props.dispatch({
				type: 'homePage/teacherList',
				payload: {
					type: 3
				}
			});
			this.props.dispatch({
				type: 'classHome/pageClass',
				payload: {
					schoolId: store.get('wrongBookNews').schoolId,
					pageSize: 9999,
					pageNum: 1,
					year: this.props.state.years
				}
			})
		}

	

		this.studentColum = [
			{
				title: '序号',
				align: 'center',
				width:60,
				render: (text, record, index) => `${index + 1}` // 显示每一行的序号
			},
			{
			title: '姓名',
			dataIndex: 'userName',
			align: 'center',
			editable: true,
			render: (text, record) => {
				return record.userId === this.state.pitchOn ?
					<input defaultValue={text} onBlur={(e) => { record.nowname = e.currentTarget.value }} /> :
					<div> {text} {record.isCare === 1 && <Icon type="heart" theme="filled" style={{ color: '#FFC108' }} />}</div>
			}
		}, {
			title: '账号',
			dataIndex: 'account',
			align: 'center',
			editable: true,
			render: (text, record) => (text)
		}, {
			title: <div >联系电话</div>,
			dataIndex: 'parentPhones',
			align: 'center',
			editable: false,
			className:'thphone',
			render: (text, record) => (text)
		}, {
			title: <div >请勾选一个学生按照时间查询错题</div>,
			align: 'center',
			editable: false,
			render: (text, record,index) => {
				return record.qustionlist?record.qustionlist.map((item, i) => {
					return (
						<Checkbox
							key={i}
							checked={(record.userId&&this.props.state.saleId===record.userId)||(record.questionHook&&record.questionHook[`${index}-${i}`])}
							disabled={record.userId&&this.props.state.saleId===record.userId}
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								this.onChangeCheck(index,i,item,record,e)
							}}
						>
						{i}
					</Checkbox>
					)
				}) :''
			}
		 },
		];

	}
	onChangeCheck(index,i,item,ele,e){
		let qh=ele.questionHook||{}
		if(qh[`${index}-${i}`]){
			delete qh[`${index}-${i}`]
		}else{
			qh[`${index}-${i}`]=true
		}
		let _pageHomeworkDetiles = this.props.state.tealist;
		_pageHomeworkDetiles.data[index].questionHook=qh
		this.props.dispatch({
			type: 'homePage/initStudentList1',
			payload: {
				init:false,
				data:_pageHomeworkDetiles
			}
		})
	}





	render() {
		let state = this.props.state;
		let rodeType = store.get('wrongBookNews').rodeType;
		let pageHomeworkDetiles = state.tealist;
		let dataSource = [];
		let rowRadioSelection={
			type:'radio',
			columnTitle:"选择",
			onSelect: (selectedRowKeys, selectedRows) => {
				console.log(selectedRowKeys, selectedRows)
				// this.setState({
				// 	selectStudent:selectedRowKeys
				// })
				this.props.selectStudentHander(selectedRowKeys,selectedRows)
				this.props.dispatch({
					type: 'homePage/setSaleId',
					payload: selectedRowKeys.userId
				})
			}
		}
		if (pageHomeworkDetiles.data) {
			if (state.showMen !== '' && this.state.selectUser !== '' && this.props.current === 'student') {
				for (let i = 0; i < pageHomeworkDetiles.data.length; i++) {
					console.log(pageHomeworkDetiles.data[i].userName.indexOf(state.showMen))

					if (pageHomeworkDetiles.data[i].userName && pageHomeworkDetiles.data[i].userName.indexOf(state.showMen) > -1 && pageHomeworkDetiles.data[i].serviceType === Number(this.state.selectUser)) {
						dataSource.push(pageHomeworkDetiles.data[i]);
					}
				}
			} else if (this.state.selectUser !== '' && this.props.current === 'student') {
				for (let i = 0; i < pageHomeworkDetiles.data.length; i++) {
					if (pageHomeworkDetiles.data[i].serviceType === Number(this.state.selectUser)) {
						dataSource.push(pageHomeworkDetiles.data[i]);
					}
				}
			} else {
				dataSource = pageHomeworkDetiles.data;
			}
		}
		
		let columns = this.studentColum;

		let sublist = this.props.state.sublist;
		const children = [];
		if (sublist.data) {
			for (let i = 0; i < sublist.data.length; i++) {
				let data = sublist.data[i]
				children.push(<Option key={data.k}>{data.v}</Option>);
			}
		}
		let that = this;
		let configuration = {
			name: 'excelFile',
			showUploadList: false,
			action: dataCenter('/school/class/manage/creat/stuExcel'),
			data: {
				classId: that.props.state.infoClass
			},
			headers: {
				Authorization: store.get('wrongBookToken')
			},
			onChange(info) {
				if (info.file.status === "done" && info.file.response.result === 0) {
					//刷新
					that.refreshStu()
					message.success(info.file.response.msg);
				} else if (info.file.status === "error") {
					message.error(info.file.response.message);
				}
			},
		};
		return (
			<>
				<Layout style={{
							overflow: 'auto'
					}}>
					<Content style={{ overflow: 'initial',background:"#fff" }}>
						<div className={style.gradeboder} >
							<div style={{position:'relative'}}>
								<Spin spinning={false}>
									<div className={style.table}>
										<Table
											rowSelection={rowRadioSelection}
											rowKey={record => record.userId}
											className={style.scoreDetTable}
											dataSource={dataSource}
											columns={columns}
											pagination={true}
											style={{ userSelect: 'text' }}
											rowClassName="editable-row" />

									</div>
								</Spin>
							</div>
						</div>
					</Content>

					<Modal
						title="添加教师"
						visible={this.state.visible}
						onOk={() => {
							Trim();
							if (this.props.state.teacherName.trim() == '' ||
								this.props.state.phone.trim() == '' ||
								this.props.state.subjectId.trim() == '') {
								message.warning('请填写正确信息')
							} else {
								let data = {
									name: this.props.state.teacherName,
									phone: this.props.state.phone,
									classId: this.props.state.infoClass,
									subjectId: this.props.state.subjectId
								}

								if (!data.classId) {
									message.warning('班级未选中');
									return;
								}
								this.props.dispatch({
									type: 'homePage/createSchoolUser',
									payload: data
								}).then((res) => {
									if (res) {
										this.props.dispatch({
											type: 'homePage/teacherName',
											payload: ''
										});
										this.props.dispatch({
											type: 'homePage/phone',
											payload: ''
										});

										this.props.dispatch({
											type: 'homePage/subjectId',
											payload: ''
										});

										this.setState({
											visible: false,
										});
									}
								})
							}
						}}
						onCancel={() => {
							this.setState({
								visible: false,
							});
							this.props.dispatch({
								type: 'homePage/teacherName',
								payload: ''
							});
							this.props.dispatch({
								type: 'homePage/phone',
								payload: ''
							});

							this.props.dispatch({
								type: 'homePage/subjectId',
								payload: ''
							});
						}}
						okText='确定'
						cancelText='取消'>
						<div style={{ marginBottom: '10px' }}>
							<span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: '#F5232D' }}> *</span>姓名</span>
							<Input
								value={this.props.state.teacherName}
								onChange={(e) => {
									this.props.dispatch({
										type: 'homePage/teacherName',
										payload: e.target.value.replace(/^ +| +$/g, '')
									});
								}}
								onBlur={() => {
									const teachers = [];
									let teacherList = this.props.state.schoolTeacherList;
									if (teacherList.data) {
										for (let i = 0; i < teacherList.data.length; i++) {
											if (teacherList.data[i].userName == this.props.state.teacherName) {
												this.props.dispatch({
													type: 'homePage/phone',
													payload: teacherList.data[i].phone
												});
											}
										}
									}
								}}
								style={{ width: '200px' }} />

						</div>
						<div style={{ marginBottom: '10px' }}>
							<span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: '#F5232D' }}> *</span>电话</span>
							<Input
								value={this.props.state.phone}
								onChange={(e) => {
									this.props.dispatch({
										type: 'homePage/phone',
										payload: e.target.value
									});
								}} style={{ width: '200px' }} />
						</div>
						<div style={{ marginBottom: '10px' }}>
							<span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: '#F5232D' }}> *</span>学科</span>
							<Select
								showSearch
								style={{ width: 200 }}
								optionFilterProp="children"
								value={this.props.state.subjectId}
								onChange={(value) => {
									this.props.dispatch({
										type: 'homePage/subjectId',
										payload: value
									});
								}}
								filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
								{children}
							</Select>
						</div>
					</Modal>

				</Layout >
			</>
		);
	}
	componentDidMount() {


		this.props.dispatch({
			type: 'homePage/getGrade',
			payload: { schoolId: store.get('wrongBookNews').schoolId }
		})

		this.props.dispatch({
			type: 'homePage/subjectNodeList',
			payload: {}
		})
	}
	UNSAFE_componentWillMount() {
		this.props.dispatch({
			type: 'homePage/tealist',
			payload: []
		});
		// 清空models里搜索框内容
		this.props.dispatch({
			type: 'homePage/showMen',
			payload: ''
		});
		console.log(this.state.selectUser)

	}

}

export default connect((state) => ({
	state: {
		...state.homePage,
		years: state.temp.years
	}
}))(HomeworkCenter);
