
import React, { useState, useEffect } from 'react';
import style from './workCorrection.less';
import { message, Button, Icon } from 'antd';

export default function Complete(props) {

    return (<div className={style.allfinish} style={{ width: `${props.nowImgWidth + 15}px` }}>
        <Icon type="check-circle" theme="filled" style={{ fontSize: '72px', color: '#22d16f' }} />
        <p className={style.textfinish}>作业批改完成</p>
        <div className={style.boxfinish}>
            <div className={style.inbox}>
                <div>
                    <span className={style.finumber}>{props.approvedStu}</span>
                    <span className={style.finhanzi}>人</span>
                </div>

                <span className={style.zishu}>已批人数</span>
            </div>
            <div style={{ width: 2, height: 80, background: 'rgba(231, 235, 240, 1)' }}></div>
            <div className={style.inbox}>
                <div>
                    <span className={style.finumber}> {props.average} </span>
                    <span className={style.finhanzi}>题</span>
                </div>
                <span className={style.zishu}>平均错题数</span>
            </div>
        </div>
        <Button type="primary" style={{ width: 116, height: 37 }}
            onClick={() => { props.clickButton() }}>查看批改详情</Button>
    </div>)

}