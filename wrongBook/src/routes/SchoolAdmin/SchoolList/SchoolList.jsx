import React from 'react';
import { Layout, Table, Input, Select, Modal, Radio, Button, Pagination, Popover, message, InputNumber, DatePicker, Icon } from 'antd';
import { routerRedux, } from "dva/router";
import { connect } from 'dva';
import store from 'store';
import QRCode from 'qrcode.react';
import moment from 'moment';
import style from './SchoolList.less';
import 'moment/locale/zh-cn';
// import store from 'store';
const { Content } = Layout;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const { TextArea } = Input;

const { RangePicker } = DatePicker;

//作业中心界面内容
class HomeworkCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      current: 'student',
      visible1: false,
      visible: false,
      visible2: false,
      visible3: false,
      phaseId: 1,
      schoolId: '',
      provincesId: '',
      cityId: '',
      areasId: '',
      provinces: '',
      city: '',
      areas: '',
      qrcode: '',
      SearchValue: undefined,
      /*   因外部省市区与弹窗数据竟然被写在一起了，会导致操作弹窗省市区影响到外部
           储存外部的市区id*/
      cuncityId: '',
      cunprovincesId: '',
      dateString: [],
      morexg: [{ name: '', phone: '' ,position:''}],
      adminName: '',
      adminPhone: '',
      authList:[
        {rodeType:20,name:'校管'},
        {rodeType:30,name:'班主任'},
        {rodeType:40,name:'任课老师'},
        {rodeType:0,name:'校长'},//身份未知
        {rodeType:50,name:'年级组长'},
        {rodeType:'adminSale',name:'销售管理'},
      ]
    };
  }
  authChange=(item,e,i)=>{
    let morexg = this.state.morexg;
    morexg[i]={...item,position:e}
    this.setState({
      morexg
    })
  }
  handleOk = (e) => {
    let morexg = this.state.morexg;
    let managerNames = [], managerPhones = [],positions=[];
    for (let i = 0; morexg.length > i; i++) {
      managerNames.push(morexg[i].name);
      managerPhones.push(morexg[i].phone);
      positions.push(morexg[i].position);
    }
    console.log('managerNames: ', managerNames);
    console.log('positions: ', positions);
    console.log('managerPhones: ', managerPhones);
    let _prdata={
      managerNames,
      managerPhones,
      positions,
      schoolId: this.state.schoolId,
      effStart: this.state.dateString[0],
      effEnd: this.state.dateString[1],
    }
    console.log('_prdata: ', _prdata);
    return
    this.props.dispatch({
      type: 'homePage/changeSchool',
      payload: _prdata
    });
    this.setState({
      visible1: false,
      visible: false,
      provincesId: '',
      cityId: '',
      areasId: '',
      morexg: [{ name: '', phone: '' }],
      dateString: [],
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible1: false,
      visible: false,
      cityId: this.state.cuncityId,
      provincesId: this.state.cunprovincesId,
      areasId: '',
      morexg: [{ name: '', phone: '' }],
      dateString: [],
      adminName: '',
      adminPhone: '',
    });
    //清空弹窗数据
    this.props.dispatch({
      type: 'homePage/addSchoolRecover',
    });
  }

  provinces() {
    let data = this.props.state.city;
    if (data.data) {
      let provinces = data.data.provinces;
      return (
        provinces.map((item, i) => (
          <Option key={i} value={item.code}>{item.name}</Option>
        ))
      )
    }

  }

  city() {
    let data = this.props.state.city;
    if (data.data) {
      let cities = data.data.cities;
      if (this.state.provincesId != '') {
        return (
          cities.map((item, i) => {
            if (item.provinceCode == this.state.provincesId) {
              return (
                <Option key={i} value={item.code}>{item.name}</Option>
              )
            }
          }
          )
        )
      }

    }

  }

  areas() {
    let data = this.props.state.city;
    if (data.data) {
      let areas = data.data.areas;
      if (this.state.cityId != "") {
        return (
          areas.map((item, i) => {
            if (item.cityCode == this.state.cityId) {
              return (
                <Option key={i} value={item.code}>{item.name}</Option>
              )
            }
          })
        )
      }
    }

  }

  //跳转页面所需要用到的方法
  toGrade(record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/classUser',
        hash: `sId=${record.schoolId}`
      })
    )
    let wrongBookNews = store.get('wrongBookNews');
    wrongBookNews.schoolId = record.schoolId;
    store.set('wrongBookNews', wrongBookNews);

    this.props.dispatch({
      type: 'classHome/schoolId',
      payload: record.schoolId
    });

  }

  render() {
    let dispatch = this.props.dispatch;
    let state = this.props.state;
    const columns = [{
      title: '学校名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text, record) => (
        <div className='space'
          onClick={() => {
            this.toGrade(record)
          }}>
          {text}
        </div>
      )
    }, {
      title: '位置',
      dataIndex: 'position',
      key: 'position',
      width: '15%',
      render: (text, record) => (
        <div
          className='space'
          onClick={() => {
            this.toGrade(record)
          }}>
          {text}
        </div>
      )
    }, {
      title: '学段',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      render: (text, record) => (
        <div
          className='space'
          onClick={() => {
            this.toGrade(record)
          }}>
          {text}
        </div>
      )
    }, {
      title: '服务期限',
      width: '10%',
      render: (text, record) => (
        <div
          style={{ whiteSpace: 'nowrap' }}
          className='space'
          onClick={() => {
            this.toGrade(record)
          }}>
          {record.effStart && record.effEnd ? `${record.effStart}-${record.effEnd}` : ''}
        </div >
      )
    },
    {
      title: '校管理员',
      dataIndex: 'principal',
      key: 'principal',
      width: '10%',
      render: (text, record) => {
        if (record.managerNames) {
          return record.managerNames.map((item, index) => (
            <div className='space' key={index} onClick={() => { this.toGrade(record) }}>
              {item}
            </div>
          ))
        } else {
          return <div className='space' onClick={() => { this.toGrade(record) }}>
            {text}
          </div>
        }
      }

    },
    {
      title: '校管理帐号',
      dataIndex: 'account',
      key: 'account',
      width: '10%',
      render: (text, record) => {
        if (record.managerPhones) {
          return record.managerPhones.map((item, index) => (
            <div className='space' key={index} onClick={() => { this.toGrade(record) }}>
              {item}
            </div>
          ))
        } else {
          return <div className='space' onClick={() => { this.toGrade(record) }}>
            {text}
          </div>
        }

      }
    }, {
      title: '操作',
      width: '15%',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {

        return (
          <div className="operateLink" style={{ width: 265, margin: 'auto' }}>
            <span
              style={{ color: '#1890ff', cursor: 'pointer', margin: '0 10px' }}
              onClick={() => {
                let data = {
                  schoolId: record.key
                };
                this.props.dispatch({
                  type: 'homePage/schoolInfo',
                  payload: data
                }).then((morexg) => {
                  if (morexg && morexg.managerNames) {
                    let cun = [];
                    for (let i = 0; morexg.managerNames.length > i; i++) {
                      cun.push({
                        name: morexg.managerNames[i],
                        phone: morexg.managerPhones[i],
                      })
                    }

                    this.setState({
                      morexg: cun,

                    })
                  }
                  if (morexg && morexg.effStart) {
                    this.setState({
                      dateString: [morexg.effStart, morexg.effEnd]
                    })
                  }

                }).then(() => {
                  this.setState({ visible: true, schoolId: record.key });
                })
                this.props.dispatch({
                  type: 'homePage/schoolNews',
                  payload: ''
                })
              }
              }>编辑</span>
            <span
              style={{ cursor: 'pointer', margin: '0 10px', color: '#1890ff' }}
              onClick={() => {
                let This = this;
                confirm({
                  title: '确定删除此学校么?',
                  okText: '是',
                  cancelText: '否',
                  onOk() {
                    let data = {
                      schoolId: record.key
                    }
                    This.props.dispatch({
                      type: 'homePage/deleteSchool',
                      payload: data
                    });
                  },
                  onCancel() {
                    console.log('Cancel');
                  },
                });
              }}
            >删除</span>
            <span
              style={{ cursor: 'pointer', margin: '0 10px', color: '#1890ff' }}
              onClick={() => {
                let cun = store.get('wrongBookNews');
                cun.schoolId = record.key;
                cun.schoolName = record.name;

                store.set('wrongBookNews', cun);
                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/schoolChart',
                  })
                )
              }}
            >校级报表</span>
            <span
              style={{ cursor: 'pointer', margin: '0 10px', color: '#1890ff' }}
              onClick={() => {
                this.props.dispatch({
                  type: 'homePage/exportClass',
                  payload: {
                    schoolId: record.schoolId,
                    pageNum: 1,
                    pageSize: 999,
                  }
                });
                this.props.dispatch({
                  type: 'homePage/nowschool',
                  payload: record.name
                });

                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/wrongTopic',
                  })
                )
              }}
            >导出错题本</span>
          </div>
        )
      }
    }];
    let schoolList = state.schoolList;
    const dataSource = [];
    let total = 0;
    if (schoolList.data) {
      total = schoolList.data.total;
      for (let i = 0; i < schoolList.data.list.length; i++) {
        let p = {};
        let det = schoolList.data.list[i];
        p["key"] = det.schoolId;
        p["name"] = det.schoolName;
        p["position"] = det.address;
        p["type"] = det.phaseName;
        p["principal"] = det.masterName;
        p["introduce"] = det.des;
        p["account"] = det.account;
        p["schoolId"] = det.schoolId;
        if (det.hasOwnProperty('managerNames')) {
          p["managerNames"] = det.managerNames;
        }
        if (det.hasOwnProperty('managerPhones')) {
          p["managerPhones"] = det.managerPhones;
        }
        if (det.hasOwnProperty('effStart')) {
          p["effStart"] = det.effStart;
        }
        if (det.hasOwnProperty('effEnd')) {
          p["effEnd"] = det.effEnd;
        }
        dataSource[i] = p;
      }
    }
    let schoolInfo = this.props.state.schoolInfo;
    const hash = this.props.location.hash;
    let cur = hash.substr(hash.indexOf("page=") + 5) * 1;
    return (
      <Layout>
        <Content style={{ overflow: 'initial' }} >
          <div className={style.layout} style={{ padding: 24, background: '#fff' }}>
            <div style={{ overflow: 'hidden', marginBottom: "5px", textAlign: 'right' }}>
              <div style={{ float: 'left' }}>
                <Select
                  showSearch
                  style={{ width: 120, marginRight: 10 }}
                  placeholder="省"
                  optionFilterProp="children"
                  value={this.state.provinces ? this.state.provinces : undefined}
                  onChange={(value, e) => {
                    this.setState({ cunprovincesId: value, provincesId: value, provinces: e.props.children, areas: '', city: '' });
                    let data = {
                      province: e.props.children,
                      page: 1,
                      pageSize: 10,
                    };
                    if (this.state.SearchValue && this.state.SearchValue !== '') {
                      data.schoolName = this.state.SearchValue
                    }
                    dispatch({
                      type: 'homePage/pageRelevantSchool',
                      payload: data
                    });
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.provinces()}
                </Select>
                <Select
                  showSearch
                  style={{ width: 120, marginRight: 10 }}
                  placeholder="市"
                  value={this.state.city ? this.state.city : undefined}
                  optionFilterProp="children"
                  onChange={(value, e) => {
                    this.setState({ cityId: value, city: e.props.children, cuncityId: value });
                    let data = {
                      province: this.state.provinces,
                      city: e.props.children,
                      page: 1,
                      pageSize: 10
                    }
                    if (this.state.SearchValue && this.state.SearchValue !== '') {
                      data.schoolName = this.state.SearchValue
                    }
                    dispatch({
                      type: 'homePage/pageRelevantSchool',
                      payload: data
                    });
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.city()}
                </Select>
                <Select
                  showSearch
                  style={{ width: 120, marginRight: 10 }}
                  placeholder="区"
                  optionFilterProp="children"
                  value={this.state.areas ? this.state.areas : undefined}
                  onChange={(value, e) => {
                    this.setState({ areasId: value, areas: e.props.children })
                    let data = {
                      province: this.state.provinces,
                      city: this.state.city,
                      area: e.props.children,
                      page: 1,
                      pageSize: 10
                    }
                    if (this.state.SearchValue && this.state.SearchValue !== '') {
                      data.schoolName = this.state.SearchValue
                    }
                    dispatch({
                      type: 'homePage/pageRelevantSchool',
                      payload: data
                    });
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.areas()}
                </Select>
                <Select
                  showSearch
                  style={{ width: 120 }}
                  placeholder="学段"
                  optionFilterProp="children"
                  // value={this.state}
                  onChange={(value, e) => {
                    let data = {
                      page: 1,
                      pageSize: 10,
                    }
                    if (value !== 0) {
                      data.phaseId = value
                    }
                    if (this.state.SearchValue && this.state.SearchValue !== '') {
                      data.schoolName = this.state.SearchValue
                    }
                    if (this.state.provinces !== '') {
                      data.province = this.state.provinces
                      if (this.state.city !== '') {
                        data.city = this.state.city
                        if (this.state.areas !== '') {
                          data.area = this.state.areas
                        }
                      }
                    }
                    dispatch({
                      type: 'homePage/pageRelevantSchool',
                      payload: data
                    });
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option key={0} value={0}>全部</Option>
                  <Option key={1} value={1}>小学</Option>
                  <Option key={2} value={2}>初中</Option>
                  <Option key={3} value={3}>高中</Option>
                </Select>
              </div>
              <Search
                placeholder="学校名称"
                style={{ width: '300px' }}
                enterButton="搜索"
                value={this.state.SearchValue}
                onChange={(e) => {
                  this.props.dispatch({
                    type: 'homePage/cunSchoolNmae',
                    payload: e.target.value
                  })
                  this.setState({ SearchValue: e.target.value })
                }}
                onSearch={value => {
                  let data = {
                    pageNum: 1,
                    pageSize: 10,
                    schoolName: value
                  }
                  if (this.state.provinces !== '') {
                    data.province = this.state.provinces
                    if (this.state.city !== '') {
                      data.city = this.state.city
                      if (this.state.areas !== '') {
                        data.area = this.state.areas
                      }
                    }
                  }
                  dispatch({
                    type: 'homePage/pageRelevantSchool',
                    payload: data
                  });
                  routerRedux.push({
                    pathname: '/school',
                    hash: 'page=1'
                  })
                }}
              />
              <Button
                style={{ verticalAlign: 'bottom', marginLeft: '10px' }}
                onClick={() => {
                  this.setState({
                    visible1: true
                  })
                  this.props.dispatch({
                    type: 'homePage/changephaseId',
                    payload: 1
                  })
                }}
                type="primary">添加
              </Button>
            </div>
            <Table className={style.scoreDetTable}
              dataSource={dataSource}
              columns={columns}
              pagination={{ pageSize: 10, defaultPageSize: 10 }}
              bordered={true}
              loading={!this.props.state.getSchoolListFinish}
              rowKey={(record, index) => index} />

            {/* {
              total > 1 ?
                <Pagination defaultCurrent={cur} style={{ textAlign: 'right', marginTop: 10 }}
                  onChange={(pageNumber) => {
                    this.props.dispatch(
                      routerRedux.push({
                        pathname: '/school',
                        hash: `page=${pageNumber}`
                      })
                    )
                    let data = {
                      pageNum: pageNumber,
                      pageSize: 10
                    }
                    if (this.state.SearchValue && this.state.SearchValue !== '') {
                      data.schoolName = this.state.SearchValue;
                    }
                    if (this.state.provinces !== '') {
                      data.province = this.state.provinces
                      if (this.state.city !== '') {
                        data.city = this.state.city
                        if (this.state.areas !== '') {
                          data.area = this.state.areas
                        }
                      }
                    }

                    dispatch({
                      type: 'homePage/pageRelevantSchool',
                      payload: data
                    });
                  }}
                  pageSize={10} defaultPageSize={10} total={total} /> :
                ''
            } */}
          </div>
          <Modal
            title="编辑学校"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText='确定'
            cancelText='取消'
            destroyOnClose={true}
            bodyStyle={{ minHeight: '540px' }}
            width={960}>

            {schoolInfo.data ?
              <div style={{ paddingLeft: 70 }}>
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "80px", display: 'inline-block' }}>地区</span>
                  <Select
                    showSearch
                    style={{ width: 110, marginRight: 10 }}
                    placeholder="省"
                    optionFilterProp="children"
                    defaultValue={schoolInfo.data.province}
                    onChange={(value, e) => {
                      this.setState({ provincesId: value });
                      this.props.dispatch({
                        type: 'homePage/citys',
                        payload: ''
                      });
                      this.props.dispatch({
                        type: 'homePage/areas',
                        payload: ''
                      })
                      this.props.dispatch({
                        type: 'homePage/provinces',
                        payload: e.props.children
                      });

                    }}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.provinces()}
                  </Select>
                  <Select
                    showSearch
                    style={{ width: 110, marginRight: 10 }}
                    placeholder="市"
                    defaultValue={schoolInfo.data.city}
                    optionFilterProp="children"
                    onChange={(value, e) => {
                      this.setState({ cityId: value });
                      this.props.dispatch({
                        type: 'homePage/areas',
                        payload: ''
                      })
                      this.props.dispatch({
                        type: 'homePage/citys',
                        payload: e.props.children
                      });
                    }}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.city()}
                  </Select>
                  <Select
                    showSearch
                    style={{ width: 110, marginRight: 10 }}
                    defaultValue={schoolInfo.data.area}
                    placeholder="区"
                    optionFilterProp="children"
                    onChange={(value, e) => {
                      this.setState({ areasId: value })
                      this.props.dispatch({
                        type: 'homePage/areas',
                        payload: e.props.children
                      });
                    }}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.areas()}
                  </Select>
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "80px", display: 'inline-block' }}>学校</span>
                  <Input
                    placeholder="请输入学校名称"
                    defaultValue={schoolInfo.data.schoolName}
                    onChange={(e) => {
                      this.props.dispatch({
                        type: 'homePage/changeSchoolName',
                        payload: e.target.value
                      });
                    }}
                    style={{ width: '300px' }} />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "80px", display: 'inline-block' }}>类型</span>
                  <RadioGroup onChange={(e) => {
                    this.props.dispatch({
                      type: 'homePage/changeSchoolType',
                      payload: e.target.value
                    })
                  }}
                    value={this.props.state.changeSchoolType}
                  >
                    <Radio value={0}>学校</Radio>
                    <Radio value={1}>培训机构</Radio>
                  </RadioGroup>
                </div>
                {this.props.state.changeSchoolType === 1 ?
                  <div style={{ marginBottom: '30px' }}>
                    <span style={{ width: "160px", display: 'inline-block' }}>机构累计使用人数上限</span>
                    <InputNumber
                      placeholder="请输入"
                      onChange={(upperLimit) => {
                        this.props.dispatch({
                          type: 'homePage/changeUpperLimit',
                          payload: upperLimit
                        });
                      }}
                      value={this.props.state.changeUpperLimit}
                    />
                  </div> : ''}
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "80px", display: 'inline-block' }}>学段</span>
                  <RadioGroup onChange={(e) => {
                    this.props.dispatch({
                      type: 'homePage/changephaseId',
                      payload: e.target.value
                    });
                  }}
                    value={this.props.state.phaseId}>
                    <Radio value={1}>小学</Radio>
                    <Radio value={2}>初中</Radio>
                    <Radio value={3}>高中</Radio>
                    <Radio value={4}>全学段</Radio>
                  </RadioGroup>
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "80px", display: 'inline-block' }}>服务期限 </span>
                  <RangePicker placeholder={['开始时间', '结束时间']}
                    value={this.state.dateString.length > 0 ? [moment(this.state.dateString[0], 'YYYY/MM/DD'), moment(this.state.dateString[1], 'YYYY/MM/DD')] : null}
                    onChange={(date, dateString) => {
                      this.setState({
                        dateString
                      })
                    }}
                    allowClear={false}
                    format={'YYYY/MM/DD'} />
                </div>
                {/* {this.state.morexg.map((duix, index) => {

                  return <div style={{ marginBottom: '30px' }} key={index}>
                    <span style={{ width: "80px", display: 'inline-block' }}>校管理员</span>
                    <Input placeholder="请输入校管理员名字"
                      value={this.state.morexg[index].name}
                      onChange={(e) => {
                        let morexg = this.state.morexg;
                        morexg[index].name = e.currentTarget.value;
                        this.setState({
                          morexg
                        })
                      }} style={{ width: '200px' }} />
                    <span style={{ marginLeft: 20, width: "80px", display: 'inline-block' }}>手机号</span>
                    <Input placeholder="请输入校管理员手机号"
                      value={this.state.morexg[index].phone}
                      onChange={(e) => {
                        let morexg = this.state.morexg;
                        morexg[index].phone = e.currentTarget.value;
                        this.setState({
                          morexg
                        })
                      }} style={{ width: '200px' }} />
                    {index === 0 ?
                      <span style={{
                        fontSize: 14,
                        fontFamily: 'PingFang SC',
                        fontWeight: 500,
                        color: 'rgba(189,193,203,1)',
                        cursor: 'pointer',
                        marginLeft: 10
                      }} onClick={() => {
                        let morexg = this.state.morexg;
                        let nownume = morexg.length;
                        //校管最多可加三个
                        if (nownume < 8) {
                          nownume++;
                          morexg.push({ name: '', phone: '' })
                          this.setState({
                            morexg
                          })
                        }
                      }}>➕ 添加</span>
                      : ""
                    }
                  </div>

                })} */}
                {this.state.morexg.map((duix, index) => {
                  return <div style={{ marginBottom: '30px' }} key={index}>
                    <Select defaultValue="请选择用户身份" style={{ width: 140 }} onChange={(e)=>{this.authChange(duix,e,index)}}>
                      {
                         this.state.authList.map((auth, j) => {
                          return <Option value={auth.rodeType} key={j}>{auth.name}</Option>
                        })
                      }
                    </Select>
                    <Input placeholder="请输入用户名字"
                      value={this.state.morexg[index].name}
                      onChange={(e) => {
                        let morexg = this.state.morexg;
                        morexg[index].name = e.currentTarget.value;
                        this.setState({
                          morexg
                        })
                      }} style={{ width: '200px',marginLeft: 20 }} />


                    <span style={{ marginLeft: 20, display: 'inline-block' }}>手机号</span>
                    <Input placeholder="请输入用户手机号"
                      value={this.state.morexg[index].phone}
                      onChange={(e) => {
                        let morexg = this.state.morexg;
                        morexg[index].phone = e.currentTarget.value;
                        this.setState({
                          morexg
                        })
                      }} style={{ width: '200px',marginLeft:20 }} />
                    {index === 0 ?
                      <span style={{
                        fontSize: 14,
                        fontFamily: 'PingFang SC',
                        fontWeight: 500,
                        color: 'rgba(189,193,203,1)',
                        cursor: 'pointer',
                        marginLeft: 10
                      }} onClick={() => {
                        let morexg = this.state.morexg;
                        let nownume = morexg.length;
                        //校管最多可加三个
                        if (nownume < 8) {
                          nownume++;
                          morexg.push({ name: '', phone: '' })
                          this.setState({
                            morexg
                          })
                        }
                      }}>➕ 添加</span>
                      : ""
                    }
                  </div>

                  })}
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "80px", display: 'inline-block' }}>位置</span>
                  <Input defaultValue={schoolInfo.data.address}
                    onChange={(e) => {
                      this.props.dispatch({
                        type: 'homePage/changeaddress',
                        payload: e.target.value
                      });
                    }} style={{ width: '200px' }} />
                </div>
              </div>
              :
              <div>
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "80px", display: 'inline-block' }}>学校</span>
                  <Input style={{ width: '200px' }} />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "80px", display: 'inline-block' }}>类型</span>
                  <RadioGroup onChange={this.onChange} value='1'>
                    <Radio value={1}>小学</Radio>
                    <Radio value={2}>初中</Radio>
                    <Radio value={3}>高中</Radio>
                    <Radio value={4}>全学段</Radio>
                  </RadioGroup>
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "80px", display: 'inline-block' }}>校管理员</span>
                  <Input style={{ width: '200px' }} />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "80px", display: 'inline-block' }}>位置</span>
                  <Input style={{ width: '200px' }} />
                </div>
                {/*<div>*/}
                {/*	<span style={{width:"80px",display:'inline-block',verticalAlign: 'top'}}>介绍</span>*/}
                {/*	<TextArea  style={{width:'200px'}}/>*/}
                {/*</div>*/}
              </div>
            }

          </Modal>
          <Modal
            title="添加学校"
            visible={this.state.visible1}
            destroyOnClose={true}
            onOk={() => {

              let { provinces, citys, areas, schoolName, schoolType, changeUpperLimit, masterName, masterPhone } = this.props.state;
              if (provinces === '' || citys === '' || areas === '') {
                message.error('请选择省市区');
                return;
              } else if (schoolName === '') {
                message.error('请填写学校名称');
                return;
              } else if (schoolType === 1 && changeUpperLimit === '') {
                message.error('请填写机构使用人数上限');
                return;
              } else if (masterName === '') {
                message.error('请填写校管理员名字');
                return;
              } else if (masterPhone === '') {
                message.error('请填写手机号');
                return;
              } else if (this.state.dateString.length === 0) {
                message.error('请选择服务期限');
                return;
              }

              if (!(/^1[3456789]\d{9}$/.test(masterPhone))) {
                message.error("手机号码有误，请重填");
                return false;
              }
              this.props.dispatch({
                type: 'homePage/addSchool',
                payload: {
                  effStart: this.state.dateString[0],
                  effEnd: this.state.dateString[1],
                  adminPhone: this.state.adminPhone,
                  adminName: this.state.adminName,

                }
              });
              this.setState({
                visible1: false,
                areasId: '',
                cityId: this.state.cuncityId,
                provincesId: this.state.cunprovincesId,
                dateString: [],
                adminName: '',
                adminPhone: '',
              });
              //清空弹窗数据
              this.props.dispatch({
                type: 'homePage/addSchoolRecover',
              });
            }}
            onCancel={this.handleCancel}
            okText='确定'
            cancelText='取消'
            bodyStyle={{ height: '670px' }}
            width={960}
          >
            <div style={{ paddingLeft: 70 }}>
              <div style={{ marginBottom: '30px' }}>
                <span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: 'red' }}>*</span>地区</span>
                <Select
                  showSearch
                  style={{ width: 110, marginRight: 10 }}
                  placeholder="省"
                  optionFilterProp="children"
                  onChange={(value, e) => {
                    this.setState({ provincesId: value })
                    this.props.dispatch({
                      type: 'homePage/provinces',
                      payload: e.props.children
                    });
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.provinces()}
                </Select>
                <Select
                  showSearch
                  style={{ width: 110, marginRight: 10 }}
                  placeholder="市"
                  optionFilterProp="children"
                  onChange={(value, e) => {
                    this.setState({ cityId: value });

                    this.props.dispatch({
                      type: 'homePage/citys',
                      payload: e.props.children
                    });
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.city()}
                </Select>
                <Select
                  showSearch
                  style={{ width: 110, marginRight: 10 }}
                  placeholder="区"
                  optionFilterProp="children"
                  onChange={(value, e) => {
                    this.setState({ areasId: value })
                    this.props.dispatch({
                      type: 'homePage/areas',
                      payload: e.props.children
                    });
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.areas()}
                </Select>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: 'red' }}>*</span>学校</span>
                <Input
                  onChange={(e) => {
                    this.props.dispatch({
                      type: 'homePage/changeSchoolName',
                      payload: e.target.value
                    });
                  }}
                  placeholder="请输入学校名称"
                  style={{ width: '300px' }} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: 'red' }}>*</span>类型</span>
                <RadioGroup onChange={(e) => {
                  this.props.dispatch({
                    type: 'homePage/schoolType',
                    payload: e.target.value
                  })
                }}
                  value={this.props.state.schoolType}
                >
                  <Radio value={0}>学校</Radio>
                  <Radio value={1}>培训机构</Radio>
                </RadioGroup>
              </div>
              {this.props.state.schoolType === 1 ?
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ width: "160px", display: 'inline-block' }}><span style={{ color: 'red' }}>*</span>机构累计使用人数上限</span>
                  <InputNumber
                    placeholder="请输入"
                    onChange={(upperLimit) => {
                      this.props.dispatch({
                        type: 'homePage/changeUpperLimit',
                        payload: upperLimit
                      });
                    }} />
                </div> : ''}

              <div style={{ marginBottom: '30px' }}>
                <span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: 'red' }}>*</span>学段</span>
                <RadioGroup onChange={(e) => {
                  this.props.dispatch({
                    type: 'homePage/changephaseId',
                    payload: e.target.value
                  });
                }}
                  value={this.props.state.phaseId}>
                  <Radio value={1}>小学</Radio>
                  <Radio value={2}>初中</Radio>
                  <Radio value={3}>高中</Radio>
                  <Radio value={4}>全学段</Radio>
                </RadioGroup>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: 'red' }}>*</span>服务期限</span>
                <RangePicker placeholder={['开始时间', '结束时间']}
                  onChange={(date, dateString) => { this.setState({ dateString }) }}
                  allowClear={false}
                  format={'YYYY/MM/DD'} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: 'red' }}>*</span>校管理员</span>
                <Input placeholder="请输入校管理员名字"
                  onChange={(e) => {
                    this.props.dispatch({
                      type: 'homePage/changeMasterName',
                      payload: e.target.value
                    });
                  }} style={{ width: '200px' }} />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <span style={{ width: "80px", display: 'inline-block' }}><span style={{ color: 'red' }}>*</span>手机号</span>
                <Input placeholder="请输入校管理员手机号"
                  onChange={(e) => {
                    this.props.dispatch({
                      type: 'homePage/changeMasterPhone',
                      payload: e.target.value
                    });
                  }} style={{ width: '200px' }} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <span style={{ width: "80px", display: 'inline-block' }}>管理名字</span>
                <Input placeholder="请输入管理名字" style={{ width: '200px' }}
                  onChange={(e) => { this.setState({ adminName: e.target.value }) }} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <span style={{ width: "80px", display: 'inline-block' }}>管理手机号</span>
                <Input placeholder="请输入管理手机号" style={{ width: '200px' }}
                  onChange={(e) => { this.setState({ adminPhone: e.target.value }) }} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <span style={{ width: "80px", display: 'inline-block' }}>位置</span>
                <Input placeholder="请输入位置" style={{ width: '200px' }}
                  onChange={(e) => {
                    this.props.dispatch({
                      type: 'homePage/changeaddress',
                      payload: e.target.value
                    });
                  }} />
              </div>


            </div>
          </Modal>
          <Modal
            title="学校详情"
            visible={this.state.visible2}
            onOk={() => {
              this.setState({ visible2: false })
            }}
            onCancel={() => {
              this.setState({ visible2: false })
            }}
            okText='确定'
            cancelText='取消'
          >
            <div>{this.state.text}</div>
          </Modal>
          <Modal
            title="学校详情"
            visible={this.state.visible3}
            onOk={() => {
              this.setState({ visible3: false })
            }}
            onCancel={() => {
              this.setState({ visible3: false })
            }}
            width='300px'
            okText='确定'
            cancelText='取消'
          >
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <QRCode className='qrcode' value={this.state.qrcode} />
            </div>
          </Modal>
        </Content>
      </Layout >
    );
  }

  componentDidMount() {

    const { dispatch } = this.props;
    const hash = this.props.location.hash;

    let page = hash.substr(hash.indexOf("page=") + 5) * 1;
    if (page === 0) {
      page = 1
    }
    let data = {
      pageNum: page,
      pageSize: 10
    }
    dispatch({
      type: 'homePage/administrativeDivision',
    });
    //取回之前搜索的学校名称
    if (this.props.state.cunSchoolNmae) {
      this.setState({
        SearchValue: this.props.state.cunSchoolNmae
      })
    } else {
      dispatch({
        type: 'homePage/pageRelevantSchool',
        payload: data
      });
    }
  }
}

export default connect((state) => ({
  state: {
    ...state.homePage,
  }
}))(HomeworkCenter);
