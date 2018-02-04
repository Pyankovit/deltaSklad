const Chart = require('chart.js');

window.addEventListener('load', function () {
    let plotLineChart = document.querySelector('#line-chart');
    const data = {
        labels: ['january', 'february', 'february'],
        datasets: [
            {
                label: 'Simple Bar Chart',
                data: [20, 40, 50]
            }
        ]
    }
    const lineChart = new Chart(plotLineChart, {
        type: 'line',
        data: data
    })
}, false);