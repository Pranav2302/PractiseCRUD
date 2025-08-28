import { useState } from 'react'
import { BrowserRouter as Router , Routes,Route,Navigate } from 'react-router-dom'
import './App.css'
import {SignupFormDemo} from "../src/components/Signup"
import { Login } from '../src/components/Login'
import StudentDashboard from "../src/components/StudentDashboard"
function App() {
  
  return (
   <Router>
    <Routes>
      <Route path="/" element={<Navigate to ="/login"/>}/>
      <Route path="/signup" element={<SignupFormDemo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
    </Routes>
   </Router>
  )
}

export default App
