var charts = [{
        id: "myChart",
        option: [{
            type: 'line',
            data: {
                labels: ['2019/1분기', '2019/2분기', '2019/3분기', '2019/4분기'],
                datasets: [{
                    label: '년도별',
                    data: [900, 650, 900, 100],
                    backgroundColor: '#1540bf',
                    borderColor: '#1540bf',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                        }
                    },
                    y: {
                        title: {
                            display: false,
                        }
                    }
                },
            }
        }]
    }, {
        id: "myChart2",
        option: [{
            type: 'line',
            data: {
                labels: ['2019/1분기', '2019/2분기', '2019/3분기', '2019/4분기'],
                datasets: [{
                    label: '매출액',
                    data: [900, 650, 900, 100],
                    backgroundColor: '#1540bf',
                    borderColor: '#1540bf',
                    borderWidth: 1
                }, {
                    label: '임대시세',
                    data: [500, 850, 300, 200],
                    backgroundColor: '#0273ff',
                    borderColor: '#0273ff',
                    borderWidth: 1
                }, {
                    label: '매출액 대비 임대시세 상승률',
                    data: [34, 25, 40, 20],
                    backgroundColor: '#15bfae',
                    borderColor: '#15bfae',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '색상'
                        }
                    },
                    y: {
                        title: {
                            display: false,
                            text: '상승률'
                        }
                    }
                },
            }
        }]
    }, {
        id: "myChart3",
        option: [{
            type: 'line',
            data: {
                labels: ['2019/1분기', '2019/2분기', '2019/3분기', '2019/4분기'],
                datasets: [{
                    label: '매출액',
                    data: [900, 650, 900, 100],
                    backgroundColor: '#1540bf',
                    borderColor: '#1540bf',
                    borderWidth: 1
                }, {
                    label: '임대시세',
                    data: [500, 850, 300, 200],
                    backgroundColor: '#0273ff',
                    borderColor: '#0273ff',
                    borderWidth: 1
                }, {
                    label: '매출액 대비 임대시세 상승률',
                    data: [34, 25, 40, 20],
                    backgroundColor: '#15bfae',
                    borderColor: '#15bfae',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '색상'
                        }
                    },
                    y: {
                        title: {
                            display: false,
                            text: '상승률'
                        }
                    }
                },
            }
        }]
    }, {
        id: "myChart4",
        option: [{
            type: 'line',
            data: {
                labels: ['2019/1분기', '2019/2분기', '2019/3분기', '2019/4분기'],
                datasets: [{
                    label: '매출액',
                    data: [900, 650, 900, 100],
                    backgroundColor: '#1540bf',
                    borderColor: '#1540bf',
                    borderWidth: 1
                }, {
                    label: '임대시세',
                    data: [500, 850, 300, 200],
                    backgroundColor: '#0273ff',
                    borderColor: '#0273ff',
                    borderWidth: 1
                }, {
                    label: '매출액 대비 임대시세 상승률',
                    data: [34, 25, 40, 20],
                    backgroundColor: '#15bfae',
                    borderColor: '#15bfae',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '색상'
                        }
                    },
                    y: {
                        title: {
                            display: false,
                            text: '상승률'
                        }
                    }
                },
            }
        }]
    }, {
        id: "myChart5",
        option: [{
            type: 'bar',
            data: {
                labels: ['명동길', '상암대로1길', '상암대로2길', '상암대로3길'],
                datasets: [{
                    label: '개업률',
                    data: [2.4, 2.3, 2.7, 1.5],
                    backgroundColor: ['#1540bf', '#638aff', '#afc4ff', '#e8eeff'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '개업률'
                        }
                    }
                },
            }
        }]
    }, {
        id: "myChart6",
        option: [{
            type: 'bar',
            data: {
                labels: ['명동길', '상암대로1길', '상암대로2길', '상암대로3길'],
                datasets: [{
                    label: '개업률',
                    data: [2.4, 2.3, 2.7, 1.5],
                    backgroundColor: ['#1540bf', '#638aff', '#afc4ff', '#e8eeff'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '개업률'
                        }
                    }
                },
            }
        }]
    }, {
        id: "myChart7",
        option: [{
            type: 'doughnut',
            data: {
                labels: ['10대', '20대', '30대', '40대'],
                datasets: [{
                    label: '연령대',
                    data: [10, 35, 50, 60],
                    backgroundColor: ['#1540bf', '#638aff', '#afc4ff', '#e8eeff'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: ''
                    }
                }
            }
        }]
    }, {
        id: "myChart8",
        option: [{
            type: 'doughnut',
            data: {
                labels: ['남성', '여성'],
                datasets: [{
                    label: '개업률',
                    data: [62, 38],
                    backgroundColor: ['#1540bf', '#0273ff'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: ''
                    }
                }
            }
        }]
    }, {
        id: "myChart9",
        option: [{
            type: 'doughnut',
            data: {
                labels: ['10대', '20대', '30대', '40대'],
                datasets: [{
                    label: '연령대',
                    data: [10, 35, 50, 60],
                    backgroundColor: ['#1540bf', '#638aff', '#afc4ff', '#e8eeff'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: ''
                    }
                }
            }
        }]
    }, {
        id: "myChart10",
        option: [{
            type: 'doughnut',
            data: {
                labels: ['남성', '여성'],
                datasets: [{
                    label: '개업률',
                    data: [62, 38],
                    backgroundColor: ['#1540bf', '#0273ff'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: ''
                    }
                }
            }
        }]
    }, {
        id: "myChart11",
        option: [{
            type: 'bar',
            data: {
                labels: ['월', '화', '수', '목', '금', '토', '일'],
                datasets: [{
                    label: '유동인구',
                    data: [62, 38, 35, 100, 200, 300, 50],
                    backgroundColor: ['#70c14a', '#33cc94', '#31c3d9', '#4983c4', '#a25aa1', '#dd4c79', '#ee5545'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                        }
                    }
                }
            }
        }]
    }, {
        id: "myChart12",
        option: [{
            type: 'bar',
            data: {
                labels: ['11시', '12시', '13시', '14시', '15시', '16시', '17시'],
                datasets: [{
                    label: '시간대별',
                    data: [62, 38, 35, 100, 200, 300, 50],
                    backgroundColor: ['#70c14a', '#33cc94', '#31c3d9', '#4983c4', '#a25aa1', '#dd4c79', '#ee5545'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '시간대별'
                        }
                    }
                }
            }
        }]
    }, {
        id: "tab2_chart1",
        option: [{
            type: 'bar',
            data: {
                labels: ['명동거리', '명동길', '을지로3가역_1', '삼월대로4길'],
                datasets: [{
                    label: '개업률',
                    data: [20.2, 20.1, 40.2, 5.1],
                    backgroundColor: '#e8eeff',
                }, {
                    label: '폐업률',
                    data: [10.5, 10, 30, 20],
                    backgroundColor: '#1540bf',
                }]
            },
            options: {
                indexAxis: 'y',
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: ''
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            },
        }]
    }, {
        id: "tab2_chart2",
        option: [{
            type: 'bar',
            data: {
                labels: ['명동길', '상암대로1길', '상암대로2길', '상암대로3길'],
                datasets: [{
                    label: '개업률',
                    data: [2.4, 2.3, 2.7, 1.5],
                    backgroundColor: ['#1540bf', '#638aff', '#afc4ff', '#e8eeff'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '개업률'
                        }
                    }
                },
            }
        }]
    }, {
        id: "tab2_chart3",
        option: [{
            type: 'line',
            data: {
                labels: ['2019/1분기', '2019/2분기', '2019/3분기', '2019/4분기'],
                datasets: [{
                    label: '매출액',
                    data: [900, 650, 900, 100],
                    backgroundColor: '#1540bf',
                    borderColor: '#1540bf',
                    borderWidth: 1
                }, {
                    label: '임대시세',
                    data: [500, 850, 300, 200],
                    backgroundColor: '#0273ff',
                    borderColor: '#0273ff',
                    borderWidth: 1
                }, {
                    label: '매출액 대비 임대시세 상승률',
                    data: [34, 25, 40, 20],
                    backgroundColor: '#15bfae',
                    borderColor: '#15bfae',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '색상'
                        }
                    },
                    y: {
                        title: {
                            display: false,
                            text: '상승률'
                        }
                    }
                },
            }
        }]
    }, {
        id: "tab2_chart4",
        option: [{
            type: 'bar',
            data: {
                labels: ['명동길', '상암대로1길', '상암대로2길', '상암대로3길'],
                datasets: [{
                    label: '개업률',
                    data: [2.4, 2.3, 2.7, 1.5],
                    backgroundColor: ['#1540bf', '#638aff', '#afc4ff', '#e8eeff'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '개업률'
                        }
                    }
                },
            }
        }]
    }, {
        id: "myChart13",
        option: [{
            type: 'line',
            data: {
                labels: ['2019/1분기', '2019/2분기', '2019/3분기', '2019/4분기'],
                datasets: [{
                    label: '년도별',
                    data: [900, 650, 900, 100],
                    backgroundColor: '#1540bf',
                    borderColor: '#1540bf',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                        }
                    },
                    y: {
                        title: {
                            display: false,
                        }
                    }
                },
            }
        }]
    }, {
        id: "myChart14",
        option: [{
            type: 'pie',
            data: {
                labels: ['은행', '약국', '대학교', '종합병원', '백화점', '편의점', '극장', '숙박시설', '공항', '버스정류장'],
                datasets: [{
                    data: [30, 20, 10, 50, 20, 10],
                    backgroundColor: ['#70c14a', '#33cc94', '#31c3d9', '#4983c4', '#a25aa1', '#dd4c79', '#ee5545'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: ''
                    }
                }
            }
        }]
    },

]