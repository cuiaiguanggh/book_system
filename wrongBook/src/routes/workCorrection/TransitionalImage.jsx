import React, { useState, useEffect } from 'react';


export default function TransitionalImage(props) {
    const [load, setLoad] = useState(0);
    const [newsrc, setNewsrc] = useState(props.src);

    useEffect(() => {
        if (newsrc !== props.src) {
            setNewsrc(props.src)
            setLoad(0)
            props.changeLoad(0)
        }
    });
    return (
        <>
            <div style={load === 0 ? {
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '15%',
            } : { display: 'none' }}>
                <img src={'https://homework.mizholdings.com/kacha/xcx/page/4785173221607424.4758128007628800.1581070647900.jpg'} style={{ width: 100 }} />
            </div>
            <img src={`${newsrc}/rotate/${props.angle}`} style={load === 0 ?
                { visibility: 'hidden' } : {
                    width: '100%',
                    // transform: `rotate(${props.angle}deg)`
                }}
                id='outImg'
                onMouseDown={(e) => { e.preventDefault() }}
                onLoad={() => { setLoad(1); props.changeLoad(1) }} />
        </>
    )
}