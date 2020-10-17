import React, { useState, useEffect } from 'react';
import { Button, message, Icon, Checkbox, Empty } from 'antd';
import style from './downloadGroup.less';


export default function DownloadGroup(props) {

    const [practise, setPractise] = useState(0);

    return (
        <div className={style.bigBox} style={{ right: props.right, top: props.top }}>

            <div className={style.left}>
                {props.data.length === 0 ?
                    <Empty image={'http://homework.mizholdings.com/kacha/kcsj/ca076e4647ddbea3/.png'}
                        imageStyle={{ height: 51, marginTop: 70 }}
                        description={<span style={{ color: '#83878D', fontSize: 12 }}>  您还没有添加试题! </span>} /> :
                    <>
                        <span style={{ margin: '25px 0 0 25px', display: 'block' }}><Checkbox checked={practise === 0} onChange={() => { setPractise(0) }}>原错题</Checkbox></span>
                        <span style={{ margin: '25px 0 0 25px', display: 'block' }}>  <Checkbox checked={practise === 1} onChange={() => { setPractise(1) }}>原错题+优选练习</Checkbox></span>
                        <div className={style.qkong} onClick={() => { props.qkongClick() }}> 清空错题  </div>
                        <Button className={style.yulang} loading={props.loading} onClick={() => { props.previewClick(practise) }}>预览</Button>
                    </>
                }
            </div>

            <div className={style.right}>
                <img src={require('../../images/xc-cl-n.png')} style={{ marginBottom: 10 }} />   组<br />卷<br />
                <span className={style.yuan}>{props.data.length}</span>
            </div>
            
        </div>
    );
}


DownloadGroup.defaultProps = {
    data: [],
    right: 10,
    top: '25%',
};