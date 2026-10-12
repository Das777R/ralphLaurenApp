import { Link } from 'react-router-dom';

function OrderTable({ products, userId }) {
  return (
    <div className="p-5">
      <table className="table">
        <thead>
          <tr className="user-select-none">
            <th scope="col" className="text-capitalize order-summary-title">Order Summary</th>
            <th scope="col" className="text-uppercase qty-title-text d-none d-md-table-cell">QUANTITY</th>
            <th scope="col" className="text-uppercase price-title-text d-none d-md-table-cell">PRICE</th>
            <th scope="col" className="text-uppercase total-title-text d-none d-md-table-cell">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            let lookPath = '/lookup/' + item.productId;
            if (userId) {
              lookPath = '/lookup/' + item.productId + '/' + userId;
            }

            return (
              <tr key={item.productId + '-' + item.size}>
                <th scope="row" className="user-select-none">
                  <div className="d-flex gap-2 gap-lg-4 img-and-info-con-bag-submit">
                    <div className="bag-product-img-con">
                      <Link to={lookPath} style={{ textDecoration: 'inherit' }}>
                        <img
                          src={'/' + encodeURI(item.lookImage)}
                          alt=""
                          className="w-100 h-100"
                        />
                      </Link>
                    </div>
                    <div className="d-flex flex-column py-4 py-lg-3">
                      <div className="text-capitalize d-flex flex-column gap-2 bag-features">
                        <Link to={lookPath} style={{ textDecoration: 'none' }}>
                          <div className="user-select-none product-name-ordered">
                            {item.productName}
                          </div>
                        </Link>
                        <div className="user-select-none product-size-ordered">
                          Size: {item.size}
                        </div>
                        <div className="user-select-none product-color-ordered">
                          Color: {item.colorName}
                        </div>
                      </div>
                    </div>
                  </div>
                </th>
                <td className="user-select-none d-none d-md-table-cell">{Number(item.qty)}</td>
                <td className="user-select-none d-none d-md-table-cell">₹ {Number(item.price)}</td>
                <td className="user-select-none d-none d-md-table-cell">₹ {Number(item.qty) * Number(item.price)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;