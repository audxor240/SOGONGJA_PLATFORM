var options1 = {
    series: [
        {
            name: "전체",
            data: [2108, 2259, 2133, 2236,]
        },
        {
            name: "한식/백반/한정식",
            data: [2202, 2111, 2204, 2118, ]
        }
    ],
    chart: {
        height: 200,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    colors: ['#f63c3c', '#1540bf'],
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
        },
    },
    markers: {
        discrete: [{
            seriesIndex: 0,
            dataPointIndex: 7,
            fillColor: '#e3e3e3',
            strokeColor: '#fff',
            size: 5,
            shape: "circle" // "circle" | "square" | "rect"
        }, {
            seriesIndex: 2,
            dataPointIndex: 11,
            fillColor: '#f7f4f3',
            strokeColor: '#eee',
            size: 4,
            shape: "circle" // "circle" | "square" | "rect"
        }]
    },
    xaxis: {
        categories: ['2019', '2020', '2021', '2022'],
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
    }
};

var reportChart1 = new ApexCharts(document.querySelector("#reportChart1"), options1);
var reportChart1_1 = new ApexCharts(document.querySelector("#reportChart1_1"), options1);

var options2 = {
    series: [{
        name: '집객시설',
        data: [50,21,30,51,28,51,32,27  ]
    }],
    chart: {
        height: 200,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    fill: {
        colors: ['#1540bf']
    },
    plotOptions: {
        bar: {
            dataLabels: {
                display: 'none'
            },
        }
    },
    xaxis: {
        categories: ["관공서", "금융", "의료", "교육", "유통", "영화관", "숙박", "교통"],
        position: 'bottom',
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        crosshairs: {
            fill: {
                type: 'gradient',
                gradient: {
                    colorFrom: '#1540bf',
                    colorTo: '#1540bf',
                    stops: [0, 100],
                    opacityFrom: 0.4,
                    opacityTo: 0.5,
                }
            }
        },
        tooltip: {
            enabled: true,
        }
    },
    yaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false,
        },
        labels: {
            show: false,
        }

    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        floating: true,
        offsetY: 15
    }
};

var reportChart2 = new ApexCharts(document.querySelector("#reportChart2"), options2);
var reportChart2_1 = new ApexCharts(document.querySelector("#reportChart2_1"), options2);

var options3 = {
    series: [{
        name: '요일별 매출비중',
        data: [10,21,30,12,28,11,32 ]
    }],
    chart: {
        height: 200,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    fill: {
        colors: ['#1540bf']
    },
    plotOptions: {
        bar: {
            dataLabels: {
                display: 'none'
            },
        }
    },
    xaxis: {
        categories: ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
        position: 'bottom',
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        crosshairs: {
            fill: {
                type: 'gradient',
                gradient: {
                    colorFrom: '#1540bf',
                    colorTo: '#1540bf',
                    stops: [0, 100],
                    opacityFrom: 0.4,
                    opacityTo: 0.5,
                }
            }
        },
        tooltip: {
            enabled: true,
        }
    },
    yaxis: {
        axisBorder: {
            show: true
        },
        axisTicks: {
            show: true,
        },
        labels: {
            show: true,
        }

    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        floating: true,
        offsetY: 15
    }
};

var reportChart3 = new ApexCharts(document.querySelector("#reportChart3"), options3);
var reportChart3_1 = new ApexCharts(document.querySelector("#reportChart3_1"), options3);

var options4 = {
    series: [
        {
            name: "금액비중",
            data: [5, 10, 21, 8, 25, 28,31]
        },
        {
            name: "전체비중",
            data: [25, 20, 15, 18, 10, 10,18]
        }
    ],
    chart: {
        height: 200,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    colors: ['#f63c3c', '#1540bf'],
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
        },
    },
    markers: {
        discrete: [{
            seriesIndex: 0,
            dataPointIndex: 7,
            fillColor: '#e3e3e3',
            strokeColor: '#fff',
            size: 5,
            shape: "circle" // "circle" | "square" | "rect"
        }, {
            seriesIndex: 2,
            dataPointIndex: 11,
            fillColor: '#f7f4f3',
            strokeColor: '#eee',
            size: 4,
            shape: "circle" // "circle" | "square" | "rect"
        }]
    },
    xaxis: {
        categories: ['06~09시', '09~12시', '12~15시', '15~18시', '18~21시', '21~24시', '24~06시'],
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
    }
};

var reportChart4 = new ApexCharts(document.querySelector("#reportChart4"), options4);
var reportChart4_1 = new ApexCharts(document.querySelector("#reportChart4_1"), options4);

var reportChart5 = {
    series: [{
        name: '남성',
        data: [  4.2, 4.5,
            3.9, 3.5, 3
        ]
    },
        {
            name: '여성',
            data: [
                 -4, -4.1, -3.4, -3.1, -2.8
            ]
        }
    ],
    chart: {
        type: 'bar',
        height: 200,
        stacked: true,
        toolbar: {
            show: false
        }
    },
    colors: ['#1540bf', '#f63c3c'],
    plotOptions: {
        bar: {
            horizontal: true,
            barHeight: '80%',
        },
    },
    dataLabels: {
        enabled: false
    },
    // stroke: {
    //     width: 1,
    //     colors: ["#fff"]
    // },

    grid: {
        xaxis: {
            lines: {
                show: false
            }
        }
    },
    yaxis: {
        // min: -5,
        // max: 5,
        title: {
            // text: 'Age',
        },
    },
    tooltip: {
        shared: false,
        x: {
            formatter: function (val) {
                return val
            }
        },
        y: {
            formatter: function (val) {
                return Math.abs(val) + "%"
            }
        }
    },
    xaxis: {
        categories: ['20대','30대','40대','50대','60대 이상'
        ],
        labels: {
            formatter: function (val) {
                return Math.abs(Math.round(val)) + "%"
            }
        }
    },
};

var reportChart5_1 = new ApexCharts(document.querySelector("#reportChart5_1"), reportChart5);

// rendering
    reportChart1.render();
    reportChart1_1.render();
    reportChart2.render();
    reportChart2_1.render();
    reportChart3.render();
    reportChart3_1.render();
    reportChart4.render();
    reportChart4_1.render();
    reportChart5_1.render();

