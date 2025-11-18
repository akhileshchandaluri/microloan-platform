import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Edit2, Save, X } from 'lucide-react';

export default function ProfileCard({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    pan: user?.pan || ''
  });

  const token = localStorage.getItem('token');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        toast.success('Profile updated');
        onUpdate(res.data.user);
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full Name"
            className="w-full bg-slate-900/30 border border-slate-600 rounded px-4 py-2 text-white"
          />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone Number"
            className="w-full bg-slate-900/30 border border-slate-600 rounded px-4 py-2 text-white"
          />
          <input
            type="text"
            value={formData.pan}
            onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
            placeholder="PAN"
            className="w-full bg-slate-900/30 border border-slate-600 rounded px-4 py-2 text-white"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div><p className="text-slate-400">Email</p><p className="text-white font-semibold">{user?.email}</p></div>
          <div><p className="text-slate-400">Name</p><p className="text-white font-semibold">{user?.name}</p></div>
          <div><p className="text-slate-400">Phone</p><p className="text-white font-semibold">{user?.phone || 'N/A'}</p></div>
          <div><p className="text-slate-400">PAN</p><p className="text-white font-semibold">{user?.pan || 'N/A'}</p></div>
        </div>
      )}
    </div>
  );
}