import React, { useState } from "react";
import "./RestaurantRegister_2.css";
import axios from "axios"

const RestaurantRegister = () => {
     const [isLoading, setIsLoading] = useState(false);
     const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: "",
    cuisineType: "",
    deliveryTime: 30,
    priceRange: "$$",
    images: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       address: {
//         street: formData.street,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode
//       }
//     };

//      try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_PORT}/api/Restaurant/create`,
//         formData,
//         { withCredentials: true }
//       );

//       console.log("restaurant Registration success:", response.data);
//       alert("Registration successful! Redirecting to vendor dahsboard");
//       window.location.href = "/VendorDashboard"; // or your vendor login path
//     } catch (error) {
//       console.error("Registration failed:", error);

//       if (error.response?.data?.errors) {
//         const backendErrors = error.response.data.errors;
//         setErrors({
//           Username:
//             backendErrors.Username?.[0] ||
//             backendErrors.userName?.[0] ||
//             "",
//           Email:
//             backendErrors.Email?.[0] || backendErrors.email?.[0] || "",
//           phoneNumber: backendErrors.phoneNumber?.[0] || "",
//           Password:
//             backendErrors.Password?.[0] || backendErrors.password?.[0] || "",
//         });
//       } else {
//         alert(error.response?.data?.message || "Registration failed");
//       }
//     } finally {
//       setIsLoading(false);
//     }

//     console.log("Submitting:", payload);
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrors({});

  try {
    const payload = {
      ...formData,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_PORT}/api/Restaurant/create`,
      payload,
      { withCredentials: true }
    );

    console.log("Restaurant registration success:", response.data);
    alert("Registration successful! Redirecting to vendor dashboard");
    window.location.href = "/VendorDashboard";
  } catch (error) {
    console.error("Registration failed:", error);

    const backendErrors = error.response?.data?.errors;
    if (backendErrors) {
      setErrors({
        name: backendErrors.name?.[0] || "",
        email: backendErrors.email?.[0] || "",
        phoneNumber: backendErrors.phoneNumber?.[0] || "",
        password: backendErrors.password?.[0] || "",
      });
    } else {
      alert(error.response?.data?.message || "Registration failed");
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="restaurant-page">
      <div className="restaurant-card">
        <div className="restaurant-header">
          <h1>Register your Kitchen</h1>
          <p>Join the QuickBite network and start selling today.</p>
        </div>

        <form onSubmit={handleSubmit} className="restaurant-form">
          <div className="promo-banner">
            <h2>Get started with 0% commission for your first month</h2>
            <p>Add your kitchen details and go live faster.</p>
          </div>

          <div className="form-grid two-col">
            <div className="field">
              <label>Restaurant Name</label>
              <input
                type="text"
                name="name"
                required
                onChange={handleChange}
                placeholder="e.g. Pizza Heaven"
              />
            </div>

            <div className="field">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                required
                onChange={handleChange}
                placeholder="+91 ..."
              />
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              onChange={handleChange}
              placeholder="Tell us about your kitchen..."
            />
          </div>

          <div className="location-box">
            <h3>Location Details</h3>

            <div className="form-grid two-col">
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                onChange={handleChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                onChange={handleChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                onChange={handleChange}
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid three-col">
            <div className="field">
              <label>Cuisines</label>
              <input
                type="text"
                name="cuisineType"
                placeholder="Italian, Chinese"
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Delivery Time (min)</label>
              <input
                type="number"
                name="deliveryTime"
                defaultValue="30"
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Price Range</label>
              <select name="priceRange" onChange={handleChange}>
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Expensive)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Restaurant Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantRegister;