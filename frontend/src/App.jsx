import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserLogin from './Components/Auth pages/userLogin'
import HomePage from './Components/HomePage'
import RiderLogin from './Components/Auth pages/RiderLogin'
import RestaurantLogin from './Components/Auth pages/VendorLogin'
import UserRegister from './Components/Auth pages/UserRegister'
import VendorDashboard from './Components/Dashboard/VendorDashboard'
import VendorRegister from './Components/Auth pages/VendorRegister'
import VendorLogin from './Components/Auth pages/VendorLogin'
import RestaurantRegister from './Components/Auth pages/RestaurantRegister'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />

        {/* auth routes */}
        <Route path="/userLogin" element={<UserLogin/>} />
        <Route path="/userRegister" element={<UserRegister/>} />


        <Route path="/vendorRegister" element={<VendorRegister/>} />
        <Route path="/RestaurantLogin" element={<VendorLogin/>} />

        <Route path="/RestaurantRegister" element={<RestaurantRegister/>} />
        <Route path="/RestaurantLogin" element={<VendorLogin/>} />


        <Route path="/VendorDashboard" element={<VendorDashboard/>} />
        <Route path="/RestaurantLogin" element={<RestaurantLogin/>} />



        <Route path="/RiderLogin" element={<RiderLogin/>} />
        <Route path="/RestaurantLogin" element={<RestaurantLogin/>} />

      </Routes>
    </Router>
  )
}

export default App
