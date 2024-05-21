import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../../../../actions/OrderAction";
import { ShoppingCartOutlined, DollarCircleOutlined, FileTextOutlined, UserOutlined } from "@ant-design/icons";
import "./DashBoard.css";
import axios from "axios"
import { LoadingOutlined } from "@ant-design/icons"

export default function ChartDashBoard() {
  const [totalNewOrder, setTotalNewOrder] = useState(0);
  const [totalSalePrice, setTotalSalePrice] = useState(0);
  const [totalNewProduct, setTotalNewProduct] = useState(0);
  const [totalNewUser, setTotalNewUser] = useState(2);
  const [typeList, setTypeList] = useState([]);
  const [typeSalesData, setTypeSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch()
  const allOrder = useSelector(state => state.allOrder.order)
  
  // const product = useSelector(state => state.allProduct.product)
  console.log(allOrder);

  const numberOfOrdersOnMonth = (month) => {
    if(allOrder){
      return allOrder.filter((order) => {
        const allOrder = new Date(order.createdAt).getMonth();
        if (allOrder + 1 === month) {
          return order;
        }
      }).length;
    }
    return
  };

  const priceOfOrderOnMonth = (month) => {
    if(allOrder){
      const ordersInMonth = allOrder.filter(order => {
        const orderMonth = new Date(order.createdAt).getMonth() + 1;
        return orderMonth === month;
      });
      const totalSalePrice = ordersInMonth.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderTotal, item) => {
          return orderTotal + parseInt(item.salePrice);
        }, 0);
        return total + orderTotal; 
      }, 0);
      return totalSalePrice;
    }
    return 0;
  }

  const getTotalTypeList = async () => {
    if(allOrder){
    setLoading(true);
    const typeListResponse = await axios.get('http://localhost:5000/typeList');
    setTypeList(typeListResponse?.data);

    const typeSalesMap = {};
    typeListResponse.data.forEach(item => {
      typeSalesMap[item.name] = 0;
    });

    for (const order of allOrder) {
      for (const item of order?.orderItems) {
        const productDetailResponse = await axios.get(`http://localhost:5000/products/detail/${item._id}`);
        const productDetail = productDetailResponse?.data;
        const productName = productDetail?.type; 
        if (typeSalesMap[productName] !== undefined) {
          typeSalesMap[productName]++;
        }
      }
    }

    const typeSalesData = Object.keys(typeSalesMap).map(type => ({
      type,
      sales: typeSalesMap[type]
    }));

    setTypeSalesData(typeSalesData);
    setLoading(false);
    }
  }

  const getProductData = async () => {
    if (allOrder) {
      setLoad(true);
      const productMap = {};
      allOrder.forEach(order => {
        order.orderItems.forEach(item => {
          if (!productMap[item._id]) {
            productMap[item._id] = {
              name: item.name,
              quantity: parseInt(item.qty),
              totalSalePrice: parseInt(item.salePrice),
            };
            console.log(productMap);
          } else {
            productMap[item._id].quantity += parseInt(item.qty);
            productMap[item._id].totalSalePrice += parseInt(item.salePrice);
          }
        });
      });
      const productList = Object.values(productMap);
      setProductData(productList);
      setLoad(false);
    }
  };
  
  useEffect(() => {
    // const getTotalUser = async () => {
    //   const response = await  axios.get('http://localhost:5000/user')
    //   const products = response?.data?.length;
    //   setTotalNewUser(products);
    // }
    const getTotalProduct = async () => {
      const res = await axios.get(`http://localhost:5000/products/`);
      const count = res?.data?.length;
      setTotalNewProduct(count);
    }
    const getTotalOrder = async () => {
      let TotalSalePrice = 0;
      allOrder?.forEach(order => { 
        order?.orderItems?.forEach(item => {
          console.log(item?.salePrice);
          TotalSalePrice += parseInt(item?.salePrice);
          console.log(TotalSalePrice);
        });
      });
      setTotalSalePrice(TotalSalePrice);
    };          
    dispatch(getAllOrder())
    setTotalNewOrder(allOrder?.length);
    getTotalOrder();
    getTotalProduct();
    //getTotalUser();
    getTotalTypeList();
    getProductData();
  }, [dispatch])

  // const chartOptions = {
  //   series: [{
  //       name: 'Monthly bill',
  //       data: [
  //         numberOfOrdersOnMonth(1),
  //         numberOfOrdersOnMonth(2),
  //         numberOfOrdersOnMonth(3),
  //         numberOfOrdersOnMonth(4),
  //         numberOfOrdersOnMonth(5),
  //         numberOfOrdersOnMonth(6),
  //         numberOfOrdersOnMonth(7),
  //         numberOfOrdersOnMonth(8),
  //         numberOfOrdersOnMonth(9),
  //         numberOfOrdersOnMonth(10),
  //         numberOfOrdersOnMonth(11),
  //         numberOfOrdersOnMonth(12),
  //       ]
  //   }],
  //   options: {
  //       color: ['#6ab04c', '#2980b9'],
  //       chart: {
  //           background: 'transparent'
  //       },
  //       dataLabels: {
  //           enabled: false
  //       },
  //       stroke: {
  //           curve: 'straight'
  //       },
  //       xaxis: {
  //           categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  //       },
  //       legend: {
  //           position: 'top'
  //       },
  //       grid: {
  //           show: true
  //       }
  //   }
  // }

  // const chartOptions = {
  //   series: [{
  //       name: 'Monthly bill',
  //       data: [
  //         { x: 'Jan', y: numberOfOrdersOnMonth(1) },
  //         { x: 'Feb', y: numberOfOrdersOnMonth(2) },
  //         { x: 'Mar', y: numberOfOrdersOnMonth(3) },
  //         { x: 'Apr', y: numberOfOrdersOnMonth(4) },
  //         { x: 'May', y: numberOfOrdersOnMonth(5) },
  //         { x: 'Jun', y: numberOfOrdersOnMonth(6) },
  //         { x: 'Jul', y: numberOfOrdersOnMonth(7) },
  //         { x: 'Aug', y: numberOfOrdersOnMonth(8) },
  //         { x: 'Sep', y: numberOfOrdersOnMonth(9) },
  //         { x: 'Oct', y: numberOfOrdersOnMonth(10) },
  //         { x: 'Nov', y: numberOfOrdersOnMonth(11) },
  //         { x: 'Dec', y: numberOfOrdersOnMonth(12) },
  //       ]
  //   }],
  //   options: {
  //       chart: {
  //           background: 'transparent',
  //           type: 'bar',
  //           stacked: false,
  //       },
  //       plotOptions: {
  //           bar: {
  //               columnWidth: '70%',
  //           }
  //       },
  //       colors: ['#6ab04c'],
  //       dataLabels: {
  //           enabled: true,
  //           formatter: function (val) {
  //               return val;
  //           },
  //           offsetY: -20,
  //           style: {
  //               fontSize: '12px',
  //               colors: ["#304758"]
  //           }
  //       },
  //       stroke: {
  //           width: 1,
  //           colors: ['#fff']
  //       },
  //       xaxis: {
  //           categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //           labels: {
  //               style: {
  //                   fontSize: '12px'
  //               }
  //           }
  //       },
  //       yaxis: [
  //           {
  //               axisTicks: {
  //                   show: true,
  //               },
  //               axisBorder: {
  //                   show: true,
  //                   color: '#6ab04c'
  //               },
  //               labels: {
  //                   style: {
  //                       colors: '#6ab04c',
  //                   }
  //               },
  //               title: {
  //                   text: "Number of Orders",
  //                   style: {
  //                       color: '#6ab04c',
  //                   }
  //               },
  //           },
  //           {
  //               opposite: true,
  //               axisTicks: {
  //                   show: true,
  //               },
  //               axisBorder: {
  //                   show: true,
  //                   color: '#2980b9'
  //               },
  //               labels: {
  //                   style: {
  //                       colors: '#2980b9',
  //                   }
  //               },
  //               title: {
  //                   text: "Total Revenue",
  //                   style: {
  //                       color: '#2980b9',
  //                   }
  //               },
  //           },
  //       ],
  //       tooltip: {
  //           shared: false,
  //           intersect: true,
  //           y: {
  //               formatter: function (val) {
  //                   return val + " Orders";
  //               }
  //           }
  //       },
  //       legend: {
  //           position: 'top'
  //       },
  //       grid: {
  //           borderColor: '#f1f1f1',
  //       },
  //   }
  // }

  console.log(typeSalesData);

  const chartOptions = {
    series: [{
      name: 'Monthly Total Revenue',
      data: [
        priceOfOrderOnMonth(1),
        priceOfOrderOnMonth(2),
        priceOfOrderOnMonth(3),
        priceOfOrderOnMonth(4),
        priceOfOrderOnMonth(5),
        priceOfOrderOnMonth(6),
        priceOfOrderOnMonth(7),
        priceOfOrderOnMonth(8),
        priceOfOrderOnMonth(9),
        priceOfOrderOnMonth(10),
        priceOfOrderOnMonth(11),
        priceOfOrderOnMonth(12),
      ]
    }, {
      name: 'Number of Orders',
      data: [
        numberOfOrdersOnMonth(1),
        numberOfOrdersOnMonth(2),
        numberOfOrdersOnMonth(3),
        numberOfOrdersOnMonth(4),
        numberOfOrdersOnMonth(5),
        numberOfOrdersOnMonth(6),
        numberOfOrdersOnMonth(7),
        numberOfOrdersOnMonth(8),
        numberOfOrdersOnMonth(9),
        numberOfOrdersOnMonth(10),
        numberOfOrdersOnMonth(11),
        numberOfOrdersOnMonth(12),
      ]
    }],
    options: {
        chart: {
            background: 'transparent',
            stacked: true
        },
        colors: ['#2980b9', '#6ab04c'],
        dataLabels: {
            enabled: false,
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ['#6ab04c']
            },
        },
        stroke: {
            width: 0,
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                style: {
                    colors: ['black'],
                    fontSize: '12px'
                }
            }
        },
        yaxis: [{
            labels: {
                style: {
                    color: '#2980b9',
                }
            },
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
            },
            title: {
                text: 'Total Price In Month',
                style: {
                    color: '#2980b9',
                }
            },
            tooltip: {
                enabled: false,
                formatter: function (val) {
                    return val
                }
            }
        }, {
            opposite: true,
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
            },
            labels: {
                style: {
                    color: '#fff',
                }
            },
            title: {
                text: 'Number of Orders In Month',
                style: {
                    color: '#2980b9',
                }
            },
            tooltip: {
                enabled: false,
                formatter: function (val) {
                  return val.toLocaleString('vi-VN') + ' đ';
              }
            }
        }],
        plotOptions: {
          bar: {
              horizontal: false,
              columnWidth: '75%', 
              endingShape: 'rounded',
          },
        },
        grid: {
            show: true,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
            labels: {
                colors: ['#2980b9'],
            }
        },
    }
  }

  const chartOption = {
    series: typeSalesData.map(item => item.sales),
    options: {
      chart: {
        type: 'donut'
      },
      labels: typeSalesData.map(item => item.type),
      colors: ['#FFCC99', '#008080', '#ECAB53', '#DDC488', '#C0C0C0', '#DC143C', '#006400', '#20B2AA', '#00FA9A'],
      legend: {
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };
  

const sortedProductData = [...productData].sort((a, b) => b.totalSalePrice - a.totalSalePrice);

const chartOptio = {
  chart: {
    background: 'transparent',
    stacked: true,
    toolbar: {
      show: false
    }
  },
  colors: ['#2980b9', '#6ab04c'],
  dataLabels: {
    enabled: false,
    offsetY: -20,
    style: {
      fontSize: '12px'
    },
  },
  stroke: {
    width: 2.5
  },
  xaxis: {
    categories: sortedProductData.map(product => product.name),
    labels: {
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: [
    {
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: true,
        colors: '#2980b9'
      },
      labels: {
        style: {
          colors: '#2980b9'
        }
      },
      title: {
        text: 'Quantity',
        style: {
          color: '#2980b9',
          fontSize: '12px'
        }
      },
      tooltip: {
        enabled: false
      }
    },
    {
      opposite: true,
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: true,
        color: '#6ab04c'
      },
      labels: {
        style: {
          colors: '#6ab04c'
        }
      },
      title: {
        text: 'Total Sale Price',
        style: {
          color: '#6ab04c',
          fontSize: '12px'
        }
      }
    }
  ]
};

const series = [
  {
    name: 'Quantity',
    type: 'column',
    data: sortedProductData.map(product => product.quantity)
  },
  {
    name: 'Total Sale Price',
    type: 'line',
    data: sortedProductData.map(product => product.totalSalePrice)
  }
];

  return (
    <div>
    <div className="dashboard-middle">
          <div className="dashboard-middle-statistic">
            <div className="dashboard-middle-statistic-content">
              <li>
                <div className="dashboard-middle-statistic-icon">
                  <UserOutlined></UserOutlined>
                </div>
                <div className="dashboard-middle-statistic-title">
                  <span className="total">{totalNewUser}</span>
                  <span className="title">Total Users</span>
                </div>
              </li>
            </div>
            <div className="dashboard-middle-statistic-content">
              <li>
                <div className="dashboard-middle-statistic-icon">
                  <ShoppingCartOutlined></ShoppingCartOutlined>
                </div>
                <div className="dashboard-middle-statistic-title">
                  <span className="total">{totalNewProduct}</span>
                  <span className="title">Total Products</span>
                </div>
              </li>
            </div>
            <div className="dashboard-middle-statistic-content">
              <li>
                <div className="dashboard-middle-statistic-icon">
                  <DollarCircleOutlined></DollarCircleOutlined>
                </div>
                <div className="dashboard-middle-statistic-title">
                  <span className="total">{totalSalePrice.toLocaleString('vi-VN')}đ</span>
                  <span className="title">Total Money</span>
                </div>
              </li>
            </div>
            <div className="dashboard-middle-statistic-content">
              <li>
                <div className="dashboard-middle-statistic-icon">
                  <FileTextOutlined></FileTextOutlined>
                </div>
                <div className="dashboard-middle-statistic-title">
                  <span className="total">{totalNewOrder}</span>
                  <span className="title">Total Orders</span>
                </div>
              </li>
            </div>
          </div>
          <div className="dashboard-middle-chart">
          <Chart
            options={chartOptions.options}
            series={chartOptions.series}
            type='bar'
            width="570"
            height="365"
          />
          </div>
    </div>
          <div className="dash-type">
            <div className="dash-type-right">
              {loading ? (
                <div className="loading-dash">
                  <span><LoadingOutlined></LoadingOutlined></span>
                </div>
              ) : (
                <Chart
                options={chartOption.options}
                series={chartOption.series}
                type='donut'
                width="500"
                />
              )}
          </div>
          <div className="dash-type-left">
              {load ? (
                <div className="loading-dash">
                  <span><LoadingOutlined></LoadingOutlined></span>
                </div>
              ) : (
                <Chart
                options={chartOptio}
                series={series}
                type='line'
                width="585"
                height="365"
                />
              )}
          </div>
          </div>
    </div>
  );
}
