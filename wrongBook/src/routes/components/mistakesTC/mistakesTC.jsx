import React from 'react';
import {
  Modal, Layout, Icon,
} from 'antd';
import style from './mistakesTc.less';

const {
  Content,
} = Layout;
const { confirm } = Modal;
export default class MistakesTC extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      //匹配错误，进行的切换
      topicxy: true
    }
  }


  render() {

    let errorDetails = this.props.errorDetails;
    let trueNum = [];
    let wrongNum = [];
    let wrongQues = [];
    let stutimu = [];
    let tcxuhao = this.props.tcxuhao;

    if (errorDetails.uqId) {
      // 作业报告
      if (errorDetails.userAnswerList) {
        for (let i = 0; i < errorDetails.userAnswerList.length; i++) {
          if (errorDetails.userAnswerList[i].teacherCollect === 2) {
            trueNum.push(errorDetails.userAnswerList[i].userName)
          } else if (errorDetails.userAnswerList[i].teacherCollect === 1) {
            wrongNum.push(errorDetails.userAnswerList[i].userName)
            wrongQues.push(errorDetails.userAnswerList[i].answer)
          }
          if (errorDetails.userAnswerList[i].teacherCollect === 1) {
            stutimu.push(errorDetails.userAnswerList[i])
          }
        }
        if (this.props.tcxuhao < 10) {
          tcxuhao = `0${tcxuhao}`
        }
      }
    } else {
      {/*班级错题*/ }
      if (errorDetails.userAnswerList) {
        for (let i = 0; i < errorDetails.userAnswerList.length; i++) {
          if (errorDetails.userAnswerList[i].result === 1) {
            trueNum.push(errorDetails.userAnswerList[i].userName)
          } else if (errorDetails.userAnswerList[i].result === 0) {
            wrongNum.push(errorDetails.userAnswerList[i].userName)
            wrongQues.push(errorDetails.userAnswerList[i].answer)
          }
          if (errorDetails.userAnswerList[i].result === 0) {
            stutimu.push(errorDetails.userAnswerList[i])
          }
        }
        if (this.props.tcxuhao < 10) {
          tcxuhao = `0${tcxuhao}`
        }
      }
    }
    return (
      <Modal
        footer={null}
        visible={this.props.xqtc}
        className='mistakesTc'
        width='80%'
        onOk={this.props.guanbi}
        onCancel={this.props.guanbi}
        destroyOnClose={true}
      >
        <div style={{ display: 'flex', height: 800 }}>
          <div className={style.aheadLeft}>
            <Content className={style.aheadLeftCon}>
              {errorDetails ?
                (errorDetails.title && errorDetails.type === 0 && this.state.topicxy ?
                  <div key={errorDetails.questionId} className={style.aheadbox} style={{ paddingRight: 10 }}>
                    <div className={style.bluetriangle}></div>
                    <div className={style.bulesz}>{tcxuhao}</div>

                    <div className={style.matchingError} onClick={() => {
                      let that = this;
                      confirm({
                        title: '题目匹配错误',
                        content: '取消匹配结果，以图片形式显示',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                          that.setState({ topicxy: false });
                          let id;
                          if (errorDetails.uqId) {
                            // 作业报告
                            id = errorDetails.uqId.split('uqid-')[1]
                          } else {
                            // 班级错题
                            id = [errorDetails.picId.split('uqid-')[1], errorDetails.questionId]
                          }
                          errorDetails.type = 1;
                          that.props.pipeicw(id);
                        },
                      });
                    }}>
                      <Icon theme='filled' type="exclamation-circle"
                        style={{ color: '#C0C8CF', fontSize: 16, marginRight: 8 }} /> 题目匹配报错
                    </div>
                    <div>
                      <div className={style.txlefttitle} style={{ margin: 0 }}>【题目{tcxuhao}】</div>
                      <div className={style.leftneir}>
                        <div dangerouslySetInnerHTML={{ __html: errorDetails.title }} />
                        <div className={style.txlefttitle}>【考点】</div>
                        <div dangerouslySetInnerHTML={{ __html: errorDetails.knowledgeName }} />
                        <div className={style.txlefttitle}> 【答案与解析】</div>
                        <div dangerouslySetInnerHTML={{ __html: errorDetails.parse }} />
                      </div>
                    </div>
                  </div>
                  :
                  <div className={style.aheadbox}>
                    <div className={style.bluetriangle}></div>
                    <div className={style.bulesz}>{tcxuhao}</div>
                    {/*班级错题*/}
                    {errorDetails.questionUrl ?
                      <img style={{ width: '100%' }} src={errorDetails.questionUrl.split(',')[0]} />
                      : ''
                    }
                    {/*作业报告*/}
                    {errorDetails.question ?
                      <img style={{ width: '100%' }} src={errorDetails.question.split(',')[0]} />
                      : ''
                    }
                  </div>)
                : ''
              }
            </Content>
          </div>
          <div className={style.aheadRight}>
            <div style={{
              border: '1px solid  rgba(231,231,231,1)',
              marginBottom: '25px',
              padding: '18px 30px 10px 30px',
              minHeight: 125
            }}>

              <div className={style.fonsfwc} style={{
                marginBottom: 30,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span>答题统计</span>
                  <div className={style.redmarkedness}>
                    <div className={style.hongdian}></div>
                    答错（{wrongNum.length}人）
                  </div>
                </div>
                <span className={style.redpercentum}>
                  {errorDetails.userAnswerList && errorDetails.userAnswerList.length > 0 ?
                    (wrongNum.length / (errorDetails.userAnswerList.length) * 100).toFixed(0)
                    : 0
                  }
                  {/*{errorDetails.userAnswerList && (wrongNum.length / (errorDetails.userAnswerList.length) * 100).toFixed(0)}*/}
                  %
      
                </span>
              </div>

              <div style={{
                maxHeight: 50,
                overflow: 'auto'
              }}>
                {
                  wrongNum.map((item, i) => (
                    <span key={i} className={'wrongNum'}>{item}</span>
                  ))
                }
              </div>
            </div>
            <Content className={style.aheadRightCon}>
              {stutimu.length > 0 ?
                stutimu.map((item, i) => (
                  <div key={i} className={style.rightbox}>
                    <div className={style.ylbiaoq}>{item.userName}</div>
                    <img key={i} style={{ width: '100%' }} src={item.answer.split(',')[0]} />
                  </div>
                )) : ''
              }
            </Content>
          </div>

        </div>
      </Modal>
    )
  }
}
