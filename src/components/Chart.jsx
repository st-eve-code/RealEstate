import React, {useEffect,useRef}  from 'react'
import { Chart } from 'chart.js/auto';

function Charts({Graph}) {
    const chartRef = useRef(null);
  useEffect(
    ()=>{
      const canvas = chartRef.current;
      //get chart (bar,line,pie,doughnut)
      const chart = new Chart(canvas, {type:Graph,
        data:{
          labels: ['jan','feb','Mar','Apr','May','June','July','August','September','October','November','December'],
            datasets:[
              {
                label: 'sales',
                data: [12,19,3,5,8,10,64,5,10,30,4,12],
                backgroundColor: 'rgba(54,162,235,0.5)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 2
              }
            ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      return () => chart.destroy();
    },[]);
  return (
    <canvas ref={chartRef} className='mx-auto w-full h-full'></canvas>
  )
}

export default Charts