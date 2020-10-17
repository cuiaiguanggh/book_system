import React, { useEffect } from "react";

export default function canvasDonut(props) {
    useEffect(() => {
        const ctx = document.getElementById("myCanvas").getContext("2d");
        //外圆环
        ctx.beginPath();
        ctx.arc(50, 50, 47, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#fff";
        ctx.fillStyle = "#EDEDED";
        ctx.fill();
        ctx.stroke();
        //内圆环
        ctx.beginPath();
        ctx.arc(50, 50, 35, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#fff";
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.stroke();
        // //圆环图的进度条
        ctx.beginPath();
        ctx.arc(50, 50, 41, -Math.PI / 2, -Math.PI / 2 + props.percent * (Math.PI * 2), false);
        ctx.lineWidth = props.percent!==0 && 12;
        ctx.lineCap = "round";
        ctx.strokeStyle = "rgb(255, 127, 105)";
        ctx.stroke();
    });

    return (
        <canvas
            id="myCanvas"
            width="100"
            height="100"
        />
    );
}

