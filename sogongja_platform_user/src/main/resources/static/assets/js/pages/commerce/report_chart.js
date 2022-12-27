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
reportChart1.render();

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
reportChart2.render();

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
        categories: ["원요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
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
reportChart3.render();

var options4 = {
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

var reportChart4 = new ApexCharts(document.querySelector("#reportChart4"), options4);
reportChart4.render();
