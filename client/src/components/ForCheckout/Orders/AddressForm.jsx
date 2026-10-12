function AddressForm({ address, onChange }) {
  return (
    <div className="w-lg-50 w-100 user-select-none">
      <div className="billing-address-title text-start">Billing Address</div>
      <div className="flex-wrap ba-text mt-3 w-75">
        For a successful delivery, please ensure the details you add at checkout are accurate.
      </div>

      <div className="mb-3 mt-4">
        <label htmlFor="addressName" className="form-label">Address Name</label>
        <input
          type="text"
          className="form-control form-address-input"
          id="addressName"
          placeholder="Address Name"
          name="addressName"
          value={address.addressName}
          onChange={onChange}
        />
      </div>

      <div className="mb-3 mt-4">
        <label htmlFor="firstName" className="form-label">First Name</label>
        <input
          type="text"
          className="form-control form-address-input"
          id="firstName"
          placeholder="First Name"
          name="firstName"
          value={address.firstName}
          onChange={onChange}
        />
      </div>

      <div className="mb-3 mt-4">
        <label htmlFor="lastName" className="form-label">Last Name</label>
        <input
          type="text"
          className="form-control form-address-input"
          id="lastName"
          placeholder="Last Name"
          name="lastName"
          value={address.lastName}
          onChange={onChange}
        />
      </div>

      <div className="mb-3 mt-4">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control form-address-input"
          id="email"
          placeholder="Email"
          name="email"
          value={address.email}
          onChange={onChange}
        />
      </div>

      <div className="mb-3 mt-4">
        <label htmlFor="country" className="form-label">Country</label>
        <input
          type="text"
          className="form-control form-address-input"
          id="country"
          placeholder="Country"
          name="country"
          value={address.country}
          onChange={onChange}
        />
      </div>

      <div className="mb-3 mt-4">
        <label htmlFor="address1" className="form-label">Address Line 1</label>
        <input
          type="text"
          className="form-control form-address-input"
          id="address1"
          placeholder="Address Line 1"
          name="address1"
          value={address.address1}
          onChange={onChange}
        />
      </div>

      <div className="mb-3 mt-4">
        <label htmlFor="address2" className="form-label">Address Line 2</label>
        <input
          type="text"
          className="form-control form-address-input"
          id="address2"
          placeholder="Address Line 2"
          name="address2"
          value={address.address2}
          onChange={onChange}
        />
      </div>

      <div className="mb-3 mt-4">
        <label htmlFor="city" className="form-label">City / Suburb</label>
        <input
          type="text"
          className="form-control form-address-input"
          id="city"
          placeholder="City / Suburb"
          name="city"
          value={address.city}
          onChange={onChange}
        />
      </div>

      <div className="mb-3 mt-4">
        <label htmlFor="postcode" className="form-label">Zip / Postcode</label>
        <input
          type="text"
          className="form-control form-address-input"
          id="postcode"
          placeholder="e.g. 6 digits, for example: 908078"
          name="postcode"
          value={address.postcode}
          onChange={onChange}
        />
      </div>

      <div className="mb-3 mt-4">
        <label htmlFor="mobileNumber" className="form-label">Mobile Phone</label>
        <input
          type="tel"
          maxLength={10}
          className="form-control form-address-input"
          id="mobileNumber"
          placeholder="e.g. 8753490856"
          name="mobileNumber"
          value={address.mobileNumber}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default AddressForm;