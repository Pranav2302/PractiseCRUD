"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [response, setResponse] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("❌ No token found, redirecting to login");
      navigate('/login');
      return;
    }
    console.log("✅ Token found, user is authenticated");
    setIsLoading(false);
    getAllStudents();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log("🚪 User logged out");
    navigate('/login');
  };

  // GET all students
  const getAllStudents = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      console.log("🔍 Making GET request to /api/students/all");
      const res = await fetch("http://localhost:3000/api/students/all", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.status === 401) {
        console.log("🔒 Token expired or invalid, redirecting to login");
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      const data = await res.json();
      console.log("📥 Response:", data);
      setResponse(JSON.stringify(data, null, 2));
      
      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (error) {
      console.log("❌ Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };

  // GET student by ID
  const getStudentById = async () => {
    if (!studentId) {
      alert("Enter student ID");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      console.log(`🔍 Making GET request to /api/students/${studentId}`);
      const res = await fetch(`http://localhost:3000/api/students/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.status === 401) {
        console.log("🔒 Token expired or invalid, redirecting to login");
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      const data = await res.json();
      console.log("📥 Response:", data);
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.log("❌ Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };

  // Load all students on mount
  useEffect(() => {
    // Token check is already done in the first useEffect
    // This effect is just to load data after authentication
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">🔍 Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header with Logout */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🎓 Simple Student Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          🚪 Logout
        </Button>
      </div>
      
      {/* API Testing Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">📡 API Testing</h2>
        
        {/* Get All Students */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">GET All Students</h3>
          <Button onClick={getAllStudents} className="w-full">
            🔄 GET /api/students/all
          </Button>
        </div>

        {/* Get Student by ID */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">GET Student by ID</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={getStudentById}>
              🔍 GET /api/students/{studentId}
            </Button>
          </div>
        </div>
      </div>

      {/* Response Display */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">📥 API Response</h2>
        <div className="p-4 bg-gray-100 rounded border">
          <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
            {response || "No response yet. Click a button above to test the API."}
          </pre>
        </div>
      </div>

      {/* Simple Student List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">👥 Students List ({students.length})</h2>
        {students.length === 0 ? (
          <p className="text-gray-500">No students found.</p>
        ) : (
          <div className="space-y-2">
            {students.map((student, index) => (
              <div key={student.id || index} className="p-3 border rounded bg-white">
                <strong>ID:</strong> {student.id} | <strong>Name:</strong> {student.name} | <strong>Email:</strong> {student.email}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
