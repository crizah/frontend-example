import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {SignUp } from './SignUp';
// import {ResendEmail} from './ResendEmail/ResendEmail';
// import { VerifyEmail } from './VerifyEmail/VerifyEmail';
import { Login } from './LogIn'; 
// import { PasswordResetReq } from './PasswordResetReq/PasswordResetReq';
// import { ResetPassword } from './ResetPassword/ResetPassword';
import {DashBoard} from './DashBoard'
import { ProtectedRoute } from "./ProtectedRoute";


import './App.css';



function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<VerifyEmail/>}/>
          <Route path="/resend" element={<ResendEmail/>} /> */}
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/pass-reset-req" element={<PasswordResetReq />} />
          <Route path="/reset-password" element={<ResetPassword/>} /> */}
          <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashBoard />
    </ProtectedRoute>
  }
/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;