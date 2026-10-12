import { useEffect, useMemo, useState } from "react";
import api from "../../../api/api";

function CustomersCard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getOrders() {
      try {
        const res = await api.get("/admin/allOrders");
        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    }

    getOrders();
  }, []);

  const customers = useMemo(() => {
    const byEmail = new Map();

    orders.forEach((order) => {
      const key = order.email.toLowerCase();
      const orderTotal = (order.products || []).reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      );
      const existing = byEmail.get(key);

      if (existing) {
        existing.orders += 1;
        existing.totalSpent += orderTotal;
      } else {
        byEmail.set(key, {
          id: key,
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.email,
          orders: 1,
          totalSpent: orderTotal
        });
      }
    });

    return [...byEmail.values()];
  }, [orders]);

  return (
    <div className="card border-0 shadow-sm customers-card rounded-1">
      <h2 className="card-header bg-body border-0 p-3 m-0 fs-4 fw-bold text-uppercase font-monospace text-primary">
        Customers list
      </h2>

      {loading && <p className="text-center text-secondary py-4 m-0">Loading...</p>}

      {!loading && customers.length === 0 && (
        <p className="text-center text-secondary py-4 m-0">No customers yet</p>
      )}

      {!loading && customers.length > 0 && (
        <table className="table table-hover align-middle mb-0 customers-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td data-label="Customer">
                  <div className="d-flex align-items-center gap-2">
                    <span className="customers-avatar">
                      {customer.firstName?.[0]}
                      {customer.lastName?.[0]}
                    </span>
                    <span className="text-body fw-medium">
                      {customer.firstName} {customer.lastName}
                    </span>
                  </div>
                </td>
                <td data-label="Email">{customer.email}</td>
                <td data-label="Orders">{customer.orders}</td>
                <td data-label="Total Spent">
                  ₹ {customer.totalSpent.toLocaleString("en-IN")}
                </td>
                <td data-label="Action">
                  <button
                    type="button"
                    className="btn btn-link p-0 fw-medium text-decoration-none"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomersCard;