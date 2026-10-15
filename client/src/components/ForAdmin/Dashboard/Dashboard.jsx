
import { Row, Col, Card } from 'react-bootstrap';
import { FiDollarSign, FiUsers, FiBox, FiTrendingUp } from 'react-icons/fi';
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

// Register Chart.js components
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
  // --- Chart Data 1: Average Sales & Trends (Line Chart) ---
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        fill: true,
        label: 'Average Sales ($)',
        data: [1200, 1900, 1500, 2200, 2800, 2500, 3400],
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // --- Chart Data 2: Top 5 Trending Products (Bar Chart) ---
  const trendingProductsData = {
    labels: ['Slim Fit Polo', 'Classic Hoodie', 'Denim Jacket', 'Chino Pants', 'Leather Belt'],
    datasets: [
      {
        label: 'Units Sold',
        data: [320, 290, 250, 210, 180],
        backgroundColor: ['#0d6efd', '#6c757d', '#198754', '#ffc107', '#dc3545'],
        borderRadius: 4,
      },
    ],
  };

  const trendingOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="container-fluid py-2">
      <h2 className="fw-bold mb-4 text-dark">Dashboard Overview</h2>

      {/* --- Top 4 KPI Cards --- */}
      <Row className="g-3 mb-4">
        {/* Total Sales */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-0 shadow-sm h-100 border-start border-primary border-4">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Sales</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">$48,250</h3>
                <span className="text-success small fw-medium">↑ +12% from last month</span>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                <FiDollarSign size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Customers */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-0 shadow-sm h-100 border-start border-success border-4">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Customers</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">1,420</h3>
                <span className="text-success small fw-medium">↑ +8% new users</span>
              </div>
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle">
                <FiUsers size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Products */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-0 shadow-sm h-100 border-start border-warning border-4">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Products</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">312</h3>
                <span className="text-muted small fw-medium">12 low in stock</span>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle">
                <FiBox size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Profit */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-0 shadow-sm h-100 border-start border-info border-4">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Profit</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">$18,940</h3>
                <span className="text-success small fw-medium">↑ +15% margins</span>
              </div>
              <div className="p-3 bg-info bg-opacity-10 text-info rounded-circle">
                <FiTrendingUp size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- Bottom Section: Analytics Charts --- */}
      <Row className="g-4">
        {/* Average Sales Chart */}
        <Col xs={12} lg={7}>
          <Card className="border-0 shadow-sm h-100 p-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Average Sales Overview</h5>
                <span className="badge bg-light text-secondary border">Monthly</span>
              </div>
              <div style={{ height: '300px' }}>
                <Line data={salesData} options={salesOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Top 5 Trending Products Chart */}
        <Col xs={12} lg={5}>
          <Card className="border-0 shadow-sm h-100 p-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Top 5 Trending Products</h5>
                <span className="badge bg-light text-secondary border">Best Sellers</span>
              </div>
              <div style={{ height: '300px' }}>
                <Bar data={trendingProductsData} options={trendingOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;