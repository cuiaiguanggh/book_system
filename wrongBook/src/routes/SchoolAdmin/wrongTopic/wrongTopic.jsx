import React from 'react';
import { Layout, DatePicker, Select, Button, Table } from "antd";
import moment from 'moment';
import { connect } from 'dva';
const { Option } = Select;
const { Header, Content, Footer } = Layout;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
class WrongTopic extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      classId: '',
      subjectId: '',
      subjectNmae: '',
      classNmae: '',
    }
    //需求：开始日期和结束日期，默认为两个自然周
    let geshi = {
      sameDay: 'YYYY/MM/DD',
      nextDay: 'YYYY/MM/DD',
      nextWeek: 'YYYY/MM/DD',
      lastDay: 'YYYY/MM/DD',
      lastWeek: 'YYYY/MM/DD',
      sameElse: 'YYYY/MM/DD'
    };
    let nowweek = moment().format('d');
    if (nowweek === 0) {
      //如果今天为星期天
      this.state.endDate = moment().format('YYYY/MM/DD');
      this.state.startDate = moment().subtract(13, 'days').calendar(null, geshi);
    } else {
      this.state.endDate = moment().subtract(`${nowweek}`, 'days').calendar(null, geshi);
      this.state.startDate = moment().subtract(`${13 + Number(nowweek)}`, 'days').calendar(null, geshi);
    }

  }

  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '错题量',
        dataIndex: 'questionNum',
      },
      {
        title: '联系电话',
        dataIndex: 'parentPhones',
      },
      {
        title: '视频数量',
        dataIndex: 'courseVideoNum',
      },
    ];

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      }
    };
    return (
      <Layout>
        <Header style={{ background: '#fff', padding: '0 25px ' }}>
          <Select
            showSearch
            style={{ width: 110, marginRight: 10 }}
            placeholder="班级"
            onChange={(value, option) => {

              this.setState({
                classId: value,
                classNmae: option.props.children
              })
              this.props.dispatch({
                type: 'homePage/exportSubject',
                payload: {
                  classId: value,
                }
              })
            }}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.props.state.dcclassList.map((item) => {
              return <Option key={item.classId} value={item.classId}>{item.className}</Option>
            })}
          </Select>

          <Select
            showSearch
            style={{ width: 110, marginRight: 10 }}
            placeholder="学科"
            onChange={(value, option) => {
              this.setState({
                subjectId: value,
                subjectNmae: option.props.children
              })
              if (this.state.classId === '' || this.state.startDate === '') return false;

              this.props.dispatch({
                type: 'homePage/membersForSA',
                payload: {
                  classId: this.state.classId,
                  subjectId: value,
                  startTime: this.state.startDate,
                  endTime: this.state.endDate,
                }
              })
            }}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            {this.props.state.subjectList.map((item) => {
              return <Option key={item.v} value={item.v}>{item.k}</Option>
            })}
          </Select>
          <RangePicker
            style={{ width: 256 }}
            defaultValue={[moment(`${this.state.startDate}`, dateFormat), moment(`${this.state.endDate}`, dateFormat)]}
            format={dateFormat}
            onChange={(value, dateString) => {
              this.setState({
                startDate: dateString[0],
                endDate: dateString[1],
              })

              if (this.state.classId === '' || this.state.subjectId === '' || dateString[0] === '') return false;

              this.props.dispatch({
                type: 'homePage/membersForSA',
                payload: {
                  classId: this.state.classId,
                  subjectId: this.state.subjectId,
                  startTime: dateString[0],
                  endTime: dateString[1],
                }
              })
            }}
          />
          <Button type="primary" style={{ marginLeft: 20 }}
            onClick={() => {
              this.setState({ loading: true });

              // 请求下载后进行回调重置
              this.props.dispatch({
                type: 'homePage/makeUserDateWB',
                payload: {
                  userIds: this.state.selectedRowKeys,
                  subjectId: this.state.subjectId,
                  beginDate: this.state.startDate,
                  endDate: this.state.endDate,
                }
              }).then((res) => {

                let downame;
                if (this.state.selectedRowKeys.length > 1) {

                  downame = `${this.props.state.nowschool}-${this.state.classNmae}-${this.state.subjectNmae}(${this.state.startDate} ~ ${this.state.endDate}).zip`

                } else {
                  downame = `${this.state.classNmae}-${this.state.selectedRows[0].name}-${this.state.subjectNmae}(${this.state.startDate} ~ ${this.state.endDate}).pdf`
                }

                window.location.href = `${res.downloadLink}${downame}`
                this.setState({
                  selectedRowKeys: [],
                  selectedRows: [],
                  loading: false,
                });
              })


            }} disabled={!(this.state.selectedRowKeys.length > 0)} loading={this.state.loading}>
            导出已选择项
          </Button>
        </Header>

        <Content style={{ background: '#fff', padding: '0 25px ' }} className={'outermost'}>
          <Table rowSelection={rowSelection} columns={columns} dataSource={this.props.state.dcStudentList} rowKey={record => record.userId} />
        </Content>

      </Layout>
    )
  }
  componentWillUnmount() {

    this.props.dispatch({
      type: 'homePage/dcStudentList',
      payload: []
    })
    this.props.dispatch({
      type: 'homePage/subjectList',
      payload: []
    })
    this.props.dispatch({
      type: 'homePage/dcclassList',
      payload: []
    })

  }
}
export default connect((state) => ({
  state: {
    ...state.homePage,
  }
}))(WrongTopic);
