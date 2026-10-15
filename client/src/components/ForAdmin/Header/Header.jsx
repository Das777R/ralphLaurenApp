import { useState } from 'react';
import { Navbar, Container, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { FiSearch, FiFilter, FiBell, FiSun, FiMoon } from 'react-icons/fi';
import { RxHamburgerMenu } from "react-icons/rx";
import './Header.css';

function Header({ toggleSidebar }) {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-bs-theme') === 'dark'
  );

  const handleThemeToggle = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.setAttribute('data-bs-theme', next ? 'dark' : 'light');
  };

  return (
    <Navbar className="top-navbar px-3 px-md-4 shadow-sm">
      <Container fluid className="px-0">

        {/* Left: Hamburger (mobile/tablet only) + Search */}
        <div className="header-left d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-link p-0 border-0 text-body d-flex align-items-center flex-shrink-0 d-lg-none"
            onClick={toggleSidebar}
            aria-label="Open navigation"
          >
            <RxHamburgerMenu size={24} />
          </button>

          <InputGroup className="search-input-group d-none d-sm-flex">
            <InputGroup.Text className="bg-transparent border-end-0 text-muted">
              <FiSearch size={16} />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Search products, orders, customers..."
              className="border-start-0 bg-transparent ps-0"
            />
          </InputGroup>
        </div>

        {/* Right: Filter, Notifications, Theme */}
        <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">

          <Button variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2 px-2">
            <FiFilter size={16} />
            <span className="d-none d-md-inline">Filter</span>
          </Button>

          <Dropdown align="end">
            <Dropdown.Toggle
              as={Button}
              variant="light"
              className="position-relative rounded-circle p-2 border-0 bg-body no-caret"
              aria-label="Notifications"
            >
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger notification-badge">
                3
              </span>
              <FiBell size={20} className="text-secondary" />
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="shadow border-0 py-2"
              style={{ width: '280px', maxWidth: 'calc(100vw - 2rem)' }}
            >
              <Dropdown.Header className="fw-bold text-body">Notifications</Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item href="#order1" className="py-2 small text-wrap">
                📦 New order #1042 received from Ronald.
              </Dropdown.Item>
              <Dropdown.Item href="#stock" className="py-2 small text-wrap">
                ⚠️ Low stock alert on 12 products.
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <div className="d-flex align-items-center ps-2 ps-md-3 border-start">
            <div className="form-check form-switch m-0 ps-0 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input mt-0 ms-0"
                role="switch"
                id="switchMdLabel"
                checked={isDarkMode}
                onChange={handleThemeToggle}
                style={{ cursor: 'pointer', width: '2.5em', height: '1.25em' }}
              />
              <label
                className="ms-2 d-none d-lg-inline mb-0"
                htmlFor="switchMdLabel"
                style={{ cursor: 'pointer' }}
              >
                {isDarkMode
                  ? <FiMoon size={14} className="text-warning" />
                  : <FiSun size={14} className="text-warning" />}
              </label>
            </div>
          </div>

        </div>
      </Container>
    </Navbar>
  );
}

export default Header;