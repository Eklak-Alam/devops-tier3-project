"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaTrash, FaDatabase, FaServer } from 'react-icons/fa';

export default function Home() {
  // State for storing users list
  const [users, setUsers] = useState([]);
  
  // State for form inputs
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  // State for loading status
  const [loading, setLoading] = useState(false);

  // Get API URL from env file
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/users";

  // --- FUNCTIONS ---

  // 1. Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("Error connecting to backend:", err);
      alert("Could not connect to backend. Is it running on port 5000?");
    }
  };

  // Run fetchUsers when page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Handle Typing in Input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit Form (Create User)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email) return alert("Please fill all fields");

    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      setFormData({ name: '', email: '' }); // Reset form
      fetchUsers(); // Refresh list immediately
    } catch (err) {
      console.error(err);
      alert("Error adding user");
    }
    setLoading(false);
  };

  // 4. Delete User
  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  // --- RENDER UI ---
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center py-10 px-4">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <FaServer className="text-blue-500" /> DevOps Tier 3 App
        </h1>
        <p className="text-slate-400">Frontend (Next.js) + Backend (Node) + DB (MySQL)</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT: Add User Form */}
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg h-fit">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaUserPlus className="text-emerald-400" /> Add New User
          </h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-slate-400">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name..."
                className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email..."
                className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button 
              disabled={loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition"
            >
              {loading ? 'Saving...' : 'Add to Database'}
            </button>
          </form>
        </div>

        {/* RIGHT: Users List */}
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaDatabase className="text-purple-400" /> Live Data
          </h2>

          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
            {users.length === 0 ? (
              <p className="text-slate-500 text-center py-10">No data found in MySQL.</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 flex justify-between items-center group hover:bg-slate-700 transition">
                  <div>
                    <h3 className="font-bold text-white">{user.name}</h3>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}