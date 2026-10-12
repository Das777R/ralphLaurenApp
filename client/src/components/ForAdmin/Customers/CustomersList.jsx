import CustomersCard from "./CustomersCard";
import "./CustomersList.css";

function CustomersList() {
  return (
    <main className="admin-content customers-page  p-3">
      <CustomersCard />
    </main>
  );
}

export default CustomersList;