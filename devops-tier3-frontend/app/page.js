"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaTrash, FaDatabase, FaServer, FaSpinner } from 'react-icons/fa';

export default function Home() {
  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Initial load state

  // --- CONFIG ---
  // 1. Remove "/users" from here. Just the server address.
  // 2. Use the Public IP of your EC2 instance.
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://13.203.200.9:5000";

  // --- FUNCTIONS ---

  // 1. Fetch Users
  const fetchUsers = async () => {
    try {
      // We append "/users" here
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Connection Error:", err);
      // Only alert on real errors, not just empty lists
      if (err.code === "ERR_NETWORK") {
        alert(`Cannot connect to Backend at ${API_BASE_URL}. Check AWS Security Groups!`);
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Handle Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email) return alert("Please fill all fields");

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/users`, formData);
      setFormData({ name: '', email: '' }); 
      fetchUsers(); 
    } catch (err) {
      console.error(err);
      alert("Error adding user. See console for details.");
    }
    setLoading(false);
  };

  // 4. Delete User
  const handleDelete = async (id) => {
    if(!confirm("Delete this user?")) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center py-10 px-4">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <FaServer className="text-blue-500" /> DevOps EC2 App
        </h1>
        <p className="text-slate-400">
          Frontend (Port 3000) <span className="text-blue-500">↔</span> Backend (Port 5000)
        </p>
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
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition flex justify-center items-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
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
            {fetching ? (
               <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                  <FaSpinner className="animate-spin text-2xl mb-2" />
                  Connecting to {API_BASE_URL}...
               </div>
            ) : users.length === 0 ? (
              <div className="text-slate-500 text-center py-10 bg-slate-900/50 rounded-lg border border-slate-700 border-dashed">
                 No data found.<br/>
                 <span className="text-xs">Is the backend running?</span>
              </div>
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