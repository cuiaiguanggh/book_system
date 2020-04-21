import React, { useState, useEffect } from 'react';
import {
	Layout, Menu, Table, Input, message, Modal, Popconfirm, Select, Form, Popover, Button, Spin, Switch, Tooltip, Icon, Upload
} from 'antd';
// import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
import style from './classAdmin.less';
import store from 'store';
import observer from '../../../utils/observer'
import { dataCenter } from '../../../config/dataCenter';

// import * as XLSX from 'xlsx';
const confirm = Modal.confirm;
const { Content } = Layout;
const Search = Input.Search;
const FormItem = Form.Item;
const EditableContext = React.createContext();
const Option = Select.Option;
const EditableRow = ({ form, index, ...props }) => (
	<EditableContext.Provider value={form}>
		<tr {...props} />
	</EditableContext.Provider>
);
function Trim() {
	String.prototype.trim = function () {
		return this.replace(/(^\s*) | (\s*$)/g, '');
	}
}
//添加学生弹窗
const AddStu = connect()(
	function (props) {
		const [userName, setUserName] = useState('');
		const [account, setAccount] = useState('');
		const [password, setPassword] = useState('888888');
		const [visible, setVisible] = useState(false);
		return (
			<>
				<span className={style.addGrade} onClick={() => { setVisible(true); }}>添加学生</span>
				<Modal title="添加学生"
					visible={visible}
					onOk={() => {
						if (userName.trim() == '' || account.trim() == '' || password.trim() == '') {
							message.warning('请填写正确信息')
							return;
						}
						if (userName === '') {
							message.warning('请填写学生姓名')
							return;
						} else if (account === '') {
							message.warning('请填写学生帐号')
							return;
						} else if (password === '') {
							message.warning('请填写学生密码')
							return;
						}
						props.dispatch({
							type: 'homePage/create',
							payload: {
								userName,
								account,
								password,
								classId: props.classId
							}
						}).then((res) => {
							if (res) {
								//刷新
								props.refresh()
								setVisible(false);
								setUserName('');
								setAccount('');
								setPassword('888888');
							}
						})
					}}
					onCancel={() => {
						setVisible(false);
						setUserName('');
						setAccount('');
						setPassword('888888');
					}}
					okText='确定'
					cancelText='取消'>
					<div style={{ marginBottom: '10px' }}>
						<span style={{ width: "80px", display: 'inline-block' }}>姓名</span>
						<Input value={userName} onChange={(e) => { setUserName(e.target.value.replace(/^ +| +$/g, '')) }} style={{ width: '200px' }} />
					</div>
					<div style={{ marginBottom: '10px' }}>
						<span style={{ width: "80px", display: 'inline-block' }}>帐号</span>
						<Input value={account} onChange={(e) => { setAccount(e.target.value.replace(/[^\w\.\/]/ig, '')) }} style={{ width: '200px' }} />
					</div>
					<div style={{ marginBottom: '10px' }}>
						<span style={{ width: "80px", display: 'inline-block' }}>密码</span>
						<Input value={password} onChange={(e) => { setPassword(e.target.value.replace(/[^\w\.\/]/ig, '')) }} style={{ width: '200px' }} />
					</div>
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
			current: 'teacher',
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

		this.tea = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			editable: true,
			render: (text, record) => (
				<div>
					{text}
					{record.isGradeLeader !== 0 && <span className={style.banzhuren}>{record.isGradeLeader}年级组长</span>}
					{record.isHeadteacher == 1 && <span className={style.banzhuren}>班主任</span>}
					{record.admin == 2 && <span className={style.banzhuren}>校长</span>}
				</div>
			)
		},
		{
			title: <div className={style.space}>手机号</div>,
			dataIndex: 'phone',
			key: 'phone',
			align: 'center',
			editable: true,
			render: (text, record) => (
				<div className={style.space}
					onClick={() => {
					}}>
					{text}
				</div>
			)
		},
		{
			title: <div className={style.space}>学科</div>,
			dataIndex: 'subJec',
			key: 'subJec',
			align: 'center',
			editable: true,
			render: (text, record) => (
				<div className={style.space}>
					{text}
				</div>
			)
		},
		{
			title: <div className={style.space}>错题量</div>,
			dataIndex: 'wrongNum',
			key: 'wrongNum',
			align: 'center',
			editable: true,
			render: (text, record) => (
				<div className={style.space}>
					{text}
				</div>
			)
		},
		{
			title: <div className={style.space}>视频量</div>,
			dataIndex: 'videoNum',
			key: 'videoNum',
			align: 'center',
			editable: true,
			render: (text, record) => (
				<div
					className={style.space}>
					{text}
				</div>
			)
		},
		{
			title: <div className={style.space}>操作</div>,
			editable: true,
			align: 'center',
			render: (text, record) => {
				const rodeType = store.get('wrongBookNews').rodeType;
				let suzu = [];

				if (this.props.state.beginGrade === 0) {
					for (let i = 1; i <= 12.; i++) {
						suzu.push(i)
					}
				} else {
					for (let i = this.props.state.beginGrade; i <= this.props.state.beginGrade.endGrade; i++) {
						suzu.push(i)
					}
				}

				if (rodeType <= 20) {
					const content = (
						<div style={{ width: 82, height: `${suzu.length * 35 + 46}px`, position: 'relative' }}>
							<p className={style.hoverGray} style={{ top: -12 }} onClick={(schooId) => {
								if (!this.props.state.infoClass) {
									message.warning('未选中班级')
									return;
								}
								let schoolId;
								if (store.get('wrongBookNews').rodeType < 20) {
									let hash = this.props.location.hash;
									schoolId = hash.substr(hash.indexOf("sId=") + 4).split('&id=')[0];
								} else {
									schoolId = store.get('wrongBookNews').schoolId
								}
								this.props.dispatch({
									type: 'homePage/assign',
									payload: {
										classId: this.props.state.infoClass,
										schoolId,
										year: this.props.state.years,
										userId: record.userId,
										roleName: 'headteacher'
									}
								});
							}}>班主任</p>

							{suzu.map((item, i) => (
								<p className={style.hoverGray} key={i} style={{ top: `${23 + 35 * i}px` }} onClick={() => {
									let schoolId;
									if (store.get('wrongBookNews').rodeType < 20) {
										let hash = this.props.location.hash;
										schoolId = hash.substr(hash.indexOf("sId=") + 4).split('&id=')[0];
									} else {
										schoolId = store.get('wrongBookNews').schoolId
									}
									this.props.dispatch({
										type: 'homePage/assign',
										payload: {
											schoolId,
											year: this.props.state.years,
											userId: record.userId,
											roleName: 'gradeLeader',
											grade: item
										}
									});
								}}>{item}年级组长</p>
							))}
							<p className={style.hoverGray} style={{ bottom: -12 }} onClick={() => {
								let schoolId;
								if (store.get('wrongBookNews').rodeType < 20) {
									let hash = this.props.location.hash;
									schoolId = hash.substr(hash.indexOf("sId=") + 4).split('&id=')[0];
								} else {
									schoolId = store.get('wrongBookNews').schoolId
								}
								this.props.dispatch({
									type: 'homePage/assign',
									payload: {
										schoolId,
										year: this.props.state.years,
										userId: record.userId,
										roleName: 'headmaster'
									}
								});
							}}>校长</p>
						</div>
					);
					return (
						<div>
							{record.isGradeLeader === 0 && record.admin === 0 && record.isHeadteacher === 0 ? <Popover content={content} placement="left" trigger="hover" className={'abc'} style={{ padding: 0 }}>
								<span style={{ background: '#1890ff' }} className={style.annniu}>任命</span>
							</Popover> : <span style={{ background: 'rgba(182,186,194,1)' }} onClick={() => {
								let schoolId;
								if (store.get('wrongBookNews').rodeType < 20) {
									let hash = this.props.location.hash;
									schoolId = hash.substr(hash.indexOf("sId=") + 4).split('&id=')[0];
								} else {
									schoolId = store.get('wrongBookNews').schoolId
								}
								let data = {
									schoolId,
									year: this.props.state.years,
									userId: record.userId,
								}
								if (record.isHeadteacher === 1 && !this.props.state.infoClass) {
									message.warning('未选中班级')
									return;
								}
								if (record.isHeadteacher === 1) {
									data.roleName = 'headteacher';
									data.classId = this.props.state.infoClass;
								} else if (record.admin === 2) {
									data.roleName = 'headmaster'

								} else if (record.isGradeLeader !== 0) {
									data.roleName = 'gradeLeader'
									data.grade = record.isGradeLeader
								}

								this.props.dispatch({
									type: 'homePage/remove',
									payload: data
								});
							}} className={style.annniu}>取消</span>
							}

							<span style={{ background: 'rgb(245, 108, 108)' }} className={style.annniu} onClick={() => {
								let This = this;
								confirm({
									title: `确定删除${record.name}么?`,
									okText: '是',
									cancelText: '否',
									onOk() {
										let data = {
											userId: record.userId
										}
										This.props.dispatch({
											type: 'homePage/kickClass',
											payload: data
										});
									},
									onCancel() {
										console.log('Cancel');
									},
								});
							}}>删除</span>
						</div>
					)
				}
			}
		}];

		this.stu = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			editable: true,
			render: (text, record, index) => {
				return record.userId === this.state.pitchOn ? <input defaultValue={text} onBlur={(e) => {
					record.nowname = e.currentTarget.value;
				}} /> : <div className={style.space}>
						{text}
					</div>
			}
		},
		{
			title: '账号',
			dataIndex: 'account',
			key: 'account',
			align: 'center',
			editable: true,
			render: (text, record, index) => (
				<div className={style.space}>
					{text}
				</div>
			)

		},
		{
			title: <div className={style.space}>错题量</div>,
			dataIndex: 'wrongNum',
			key: 'wrongNum',
			align: 'center',
			editable: false,
			render: (text, record) => (
				<div className={style.space}>
					{text}
				</div>
			)
		},
		{
			title: <div className={style.space}>联系电话</div>,
			dataIndex: 'parentPhones',
			key: 'parentPhones',
			align: 'center',
			editable: false,
			render: (text, record) => (
				<div
					className={style.space}
					onClick={() => {
					}}>
					{text}
				</div>
			)
		},
		{
			title: <div className={style.space}>视频数量</div>,
			dataIndex: 'videoNum',
			key: 'videoNum',
			align: 'center',
			editable: false,
			render: (text, record) => (
				<div
					className={style.space}
					onClick={() => {
					}}>
					{text}
				</div>
			)
		},
		{
			title: <div className={style.space}>操作</div>,
			editable: true,
			align: 'center',
			render: (text, record, index) => {
				const rodeType = store.get('wrongBookNews').rodeType
				if (rodeType <= 20) {
					return (
						<div>
							{/* <span style={{ background: '#13CE66' }} className={style.annniu} onClick={() => {
								// this.setState({ pitchOn: record.userId });
							}}>已关注</span> */}
							{/* <span className={style.annniu} style={{ border: '1px solid rgba(220,223,230,1)', color: '#606266' }} onClick={() => {
								this.props.dispatch({
									type: 'homePage/care',
									payload: {
										userId: record.userId,
										classId: this.props.state.infoClass,
									}
								})
							}}>关注</span> */}
							{record.userId === this.state.pitchOn ? <span style={{ background: '#85CE61' }} className={style.annniu} onClick={() => {
								this.setState({ pitchOn: '' });
								if (record.nowname) {
									this.props.dispatch({
										type: 'homePage/updateChild',
										payload: {
											childId: record.userId,
											name: record.nowname,
										}
									}).then(() => {
										this.props.dispatch({
											type: 'homePage/teacherList',
											payload: {
												type: 3
											}
										})
									})
								}
							}}>确认</span> :
								<span style={{ background: 'rgb(24, 144, 255)' }} className={style.annniu} onClick={() => {
									this.setState({ pitchOn: record.userId });
								}}>编辑</span>
							}

							<span style={{ background: 'rgb(245, 108, 108)' }} className={style.annniu} onClick={() => {
								let This = this;
								confirm({
									title: `确定删除${record.name}么?`,
									okText: '是',
									cancelText: '否',
									onOk() {
										let data = {
											classId: This.props.state.infoClass,
											childId: record.userId,
										}
										This.props.dispatch({
											type: 'homePage/exit',
											payload: data
										}).then((res) => {
											This.refreshStu()
										})
									},
									onCancel() {
										console.log('Cancel');
									},
								});
							}}>删除</span>
						</div >
					)
				}
			}
		}];

		if (store.get('wrongBookNews').rodeType <= 20) {
			this.stu.splice(5, 0, {
				title: <div className={style.space}>优选错题推送</div>,
				dataIndex: 'isPush',
				key: 'isPush',
				align: 'center',
				editable: false,
				render: (text, record) => {
					return this.props.state.infoClass ?
						<div className={style.space}>
							<Switch defaultChecked={Boolean(text)} disabled={!Boolean(this.props.state.infoClass)}
								onChange={(checked) => {
									this.props.dispatch({
										type: 'homePage/ifpush',
										payload: {
											userId: record.userId,
											classId: this.props.state.infoClass,
											isPush: Number(checked)
										}
									}).then(() => {
										record.isPush = !Boolean(text)
									})
								}} />
						</div>
						: <Tooltip title="请选择班级">
							<div className={style.space}>
								<Switch defaultChecked={Boolean(text)} disabled={!Boolean(this.props.state.infoClass)}
									onChange={(checked) => {
										this.props.dispatch({
											type: 'homePage/ifpush',
											payload: {
												userId: record.userId,
												classId: this.props.state.infoClass,
												isPush: Number(checked)
											}
										});
									}} />
							</div>
						</Tooltip>
				}
			})
		}

	}

	isEditing = record => record.key === this.state.editingKey;

	cancel = () => {
		this.setState({ editingKey: '' });
	};


	edit(key) {
		this.setState({ editingKey: key });
	}

	render() {
		let state = this.props.state;
		let rodeType = store.get('wrongBookNews').rodeType;
		let pageHomeworkDetiles = state.tealist;
		let dataSource = [];

		if (pageHomeworkDetiles.data) {
			for (let i = 0; i < pageHomeworkDetiles.data.length; i++) {
				let p = {};
				let det = pageHomeworkDetiles.data[i];
				if (state.showMen !== '') {
					if (det.userName && det.userName.indexOf(state.showMen) >= 0) {
						p["key"] = det.userId;
						p["userId"] = det.userId;
						p["head"] = det.avatarUrl ? det.avatarUrl : 'http://images.mizholdings.com/face/default/02.gif'
						p["name"] = det.userName;
						p['subJec'] = det.subject;
						p['phone'] = det.phone;
						p['wrongNum'] = det.questionNum;
						p['admin'] = det.admin;
						p['parentPhones'] = det.parentPhones;
						p['videoNum'] = det.videoNum;
						p['account'] = det.account;
						p['isPush'] = det.isPush;
						p['isHeadteacher'] = det.isHeadteacher;
						p['isGradeLeader'] = det.isGradeLeader;
						dataSource.push(p);
					}
				} else {
					p["key"] = det.userId;
					p["userId"] = det.userId;
					p["head"] = det.avatarUrl ? det.avatarUrl : 'http://images.mizholdings.com/face/default/02.gif'
					p["name"] = det.userName;
					p['wrongNum'] = det.questionNum;
					p['subJec'] = det.subject;
					p['phone'] = det.phone;
					p['admin'] = det.admin;
					p['parentPhones'] = det.parentPhones;
					p['videoNum'] = det.videoNum;
					p['account'] = det.account;
					p['isPush'] = det.isPush;
					p['isHeadteacher'] = det.isHeadteacher;
					p['isGradeLeader'] = det.isGradeLeader;
					dataSource.push(p);
				}
			}
		} else {
			dataSource = []
		}

		let columns = this.state.current === 'teacher' ? this.tea : this.stu;

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
			<Layout>
				<Content style={{ overflow: 'initial' }}>
					<div className={style.gradeboder} >
						<Menu className={style.menu}
							onClick={(e) => {
								this.setState({ current: e.key })
								this.props.dispatch({
									type: 'homePage/showMen',
									payload: ''
								});
								this.props.dispatch({
									type: 'homePage/tealist',
									payload: []
								});
								if (e.key === 'teacher') {
									this.props.dispatch({
										type: 'homePage/memType',
										payload: 1
									});
									this.props.dispatch({
										type: 'homePage/teacherList',
										payload: {
											type: 1
										}
									});

								} else {
									this.props.dispatch({
										type: 'homePage/memType',
										payload: 3
									});
									this.props.dispatch({
										type: 'homePage/teacherList',
										payload: {
											type: 3
										}
									});
								}

							}}
							selectedKeys={[this.state.current]}
							mode="horizontal"
						>
							<Menu.Item key="teacher" style={{ width: '120px', textAlign: 'center' }}>
								教师
							</Menu.Item>
							<Menu.Item key="student" style={{ width: '120px', textAlign: 'center' }} >
								学生
							</Menu.Item>
						</Menu>
						<div>
							<div style={{ overflow: 'hidden', textAlign: 'left ', padding: '10px' }}>
								<Search
									// value={this.props.state.showMen}
									placeholder="姓名"
									style={{ width: '300px', marginRight: '10px' }}
									enterButton="搜索"
									onSearch={value => {
										console.log(value)
										if (value.trim() != '') {
											this.props.dispatch({
												type: 'homePage/showMen',
												payload: value
											});
										} else {
											message.warning('请输入教师或学生名称')
										}
									}}
									onChange={e => {
										if (e.target.value.trim() == '') {
											this.props.dispatch({
												type: 'homePage/showMen',
												payload: ''
											});
										}
									}}
								/>
								{rodeType <= 20 && this.state.current === 'teacher' ?
									<span className={style.addGrade} onClick={() => {
										this.setState({ visible: true })
									}}>添加老师</span> : ''
								}
								{rodeType <= 20 && this.props.state.infoClass && this.state.current === 'student' ?
									<AddStu classId={this.props.state.infoClass} refresh={this.refreshStu} /> : ''
								}
								{rodeType <= 20 && this.props.state.infoClass ?
									<Popover placement="bottom" trigger="focus" content={this.state.content}>
										<Button className={style.yqma} onClick={() => {
											this.props.dispatch({
												type: 'homePage/wxCode',
												payload: {
													classId: this.props.state.infoClass
												}
											}).then((res) => {
												if (res.hasOwnProperty('data')) {
													this.setState({
														content: <div style={{ textAlign: "center", borderRadius: '6%', overflow: 'hidden', width: 300, height: 280 }}>
															<img style={{ width: 300 }} src={res.data.url} />
														</div>,
													})
												}
											})
										}}>班级邀请码</Button >
									</Popover> : ''
								}
								{rodeType <= 20 && this.props.state.infoClass && this.state.current === 'student' ?
									<>
										<Button style={{ margin: '0 10px' }} onClick={() => {
											window.open("http://homework.mizholdings.com/kacha/kcct/9ea76ce2e83e6b40/学生导入模版.xlsx", '_blank');
										}}>下载模版</Button >
										<Upload {...configuration}> <Button>批量导入学生</Button></Upload>
									</>
									: ''
								}

							</div>
							<div className={style.table}>
								<Table
									className={style.scoreDetTable}
									dataSource={dataSource}
									columns={columns}
									pagination={true}
									bordered={true}
									// components={components}
									style={{ userSelect: 'text' }}
									rowClassName="editable-row"
								/>
							</div>
						</div>

					</div>
				</Content>

				<Modal
					title="添加教师"
					visible={this.state.visible}
					onOk={() => {
						Trim();
						let hash = this.props.location.hash;
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
						<span style={{ width: "80px", display: 'inline-block' }}>姓名</span>
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
						<span style={{ width: "80px", display: 'inline-block' }}>电话</span>
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
						<span style={{ width: "80px", display: 'inline-block' }}>学科</span>
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
							// defaultValue={classInfo.data.classAdmin}
							filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
							{children}
						</Select>
					</div>
				</Modal>

			</Layout >
		);
	}
	componentDidMount() {
		this.props.dispatch({
			type: 'homePage/getGrade',
			payload: { schoolId: store.get('wrongBookNews').schoolId }
		})
	}
	componentWillMount() {
		this.props.dispatch({
			type: 'homePage/tealist',
			payload: []
		});
		// 清空models里搜索框内容
		this.props.dispatch({
			type: 'homePage/showMen',
			payload: ''
		});
	}

}

export default connect((state) => ({
	state: {
		...state.homePage,
		years: state.temp.years
	}
}))(HomeworkCenter);
