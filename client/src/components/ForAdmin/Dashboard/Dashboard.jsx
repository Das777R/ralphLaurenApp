
import { Row, Col, Card } from 'react-bootstrap';
import './Dashboard.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import { Line, Bar } from 'react-chartjs-2';
import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await api.get('/admin/orders');
        setOrders(res.data.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  // Calculate total sales
  const totalSales = useMemo(() => {
    return orders.reduce((total, order) => {
      const orderTotal = order.products?.reduce(
        (sum, product) =>
          sum + Number(product.price || 0) * Number(product.qty || 0),
        0
      ) || 0;

      return total + orderTotal;
    }, 0);
  }, [orders]);

  // Calculate total profit (30%)
  const totalProfit = useMemo(() => {
    return orders.reduce((total, order) => {
      const orderProfit = order.products?.reduce(
        (sum, product) => {
          const price = Number(product.price || 0);
          const qty = Number(product.qty || 0);

          return sum + (price * qty * 0.30);
        },
        0
      ) || 0;

      return total + orderProfit;
    }, 0);
  }, [orders]);

  // Calculate monthly sales
  const monthlySales = useMemo(() => {
    const sales = Array(12).fill(0);

    orders.forEach(order => {
      const date = new Date(order.updatedAt);

      if (isNaN(date.getTime())) return;

      const month = date.getMonth();

      const orderTotal = order.products?.reduce(
        (sum, product) =>
          sum + Number(product.price || 0) * Number(product.qty || 0),
        0
      ) || 0;

      sales[month] += orderTotal;
    });

    return sales;
  }, [orders]);

  // Sales chart
  const salesData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        fill: true,
        label: 'Monthly Sales ($)',
        data: monthlySales,
        borderColor: 'darkred',
        backgroundColor: 'rgba(228, 84, 115, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Trending products
  const trendingProductsData = useMemo(() => {
    const productSales = {};

    orders.forEach(order => {
      order.products?.forEach(product => {
        const name = product.category || 'Unknown';

        productSales[name] =
          (productSales[name] || 0) + Number(product.qty || 0);
      });
    });

    const sortedProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sortedProducts.map(item => item[0]),
      datasets: [
        {
          label: 'Units Sold',
          data: sortedProducts.map(item => item[1]),
          backgroundColor: [
            '#18318b',
            '#15683d',
            '#0c76a4',
            '#b48c11',
            '#dc3545'
          ],
          borderRadius: 4,
        },
      ],
    };
  }, [orders]);

  const trendingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container-fluid py-2">

      <h2 className="fs-1 mb-4 text-body dashbord-overview-title">
        Dashboard Overview
      </h2>

      <Row className="g-3 mb-4">

        {/* Total Sales */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-2 border-black shadow-sm h-100">
            <Card.Body>
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Total Sales
                </span>

                <h3 className="fw-bold text-body mt-1 mb-0">
                  {loading
                    ? 'Loading...'
                    : `₹${totalSales.toLocaleString()}`}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Customers */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-2 border-black shadow-sm h-100">
            <Card.Body>
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Total Customers
                </span>

                <h3 className="fw-bold text-body mt-1 mb-0">
                  {orders.length}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Products */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-2 border-black shadow-sm h-100">
            <Card.Body>
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Total Products
                </span>

                <h3 className="fw-bold text-body mt-1 mb-0">
                  {new Set(
                    orders.flatMap(order =>
                      order.products?.map(product =>
                        product.productId || product._id
                      ) || []
                    )
                  ).size}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Profit */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-2 border-black shadow-sm h-100">
            <Card.Body>
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Total Profit
                </span>

                <h3 className="fw-bold text-body mt-1 mb-0">
                  {loading
                    ? 'Loading...'
                    : `₹${totalProfit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`}
                </h3>

                <span className="text-success small fw-medium">
                  30% profit margin
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      <Row className="g-4">

        {/* Monthly Sales */}
        <Col xs={12} lg={7}>
          <Card className="border-2 border-black shadow-sm h-100 p-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-body mb-0 sales-title">
                  Monthly Sales Overview
                </h5>

                <span className="badge bg-light text-secondary border">
                  Monthly
                </span>
              </div>

              <div style={{ height: '300px' }}>
                {loading ? (
                  <p>Loading sales...</p>
                ) : (
                  <Line data={salesData} options={salesOptions} />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Trending Products */}
        <Col xs={12} lg={5}>
          <Card className="border-2 border-black shadow-sm h-100 p-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-body mb-0 sales-title">
                  Top 5 Trending Products
                </h5>

                <span className="badge bg-light text-secondary border">
                  Best Sellers
                </span>
              </div>

              <div style={{ height: '300px' }}>
                {loading ? (
                  <p>Loading products...</p>
                ) : (
                  <Bar
                    data={trendingProductsData}
                    options={trendingOptions}
                  />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>

    </div>
  );
}

export default Dashboard;
