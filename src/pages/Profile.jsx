import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

  useEffect(() => {
    if (user?.token) {
      fetch('/api/api/users/profile', {
        headers: {
          'Content-Type': 'application/json',
          'x-app-token': appToken,
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(res => res.json())
      .then(d => {
        const data = d.data || d;
        setProfile({ username: data.username || '', email: data.email || '' });
        setLoading(false);
      })
      .catch(() => setLoading(false));
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-app-token': appToken,
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ email: profile.email })
      });
      
      if (res.ok) {
        setMsg('Cập nhật thông tin thành công!');
        // Cập nhật lại localStorage để đồng bộ phiên làm việc
        const currentUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...currentUser, email: profile.email }));
      } else {
        setMsg('Lỗi khi cập nhật.');
      }
    } catch (err) {
      setMsg('Đã xảy ra lỗi.');
    }
  };

  if (loading) return <div className="loading-box"><div className="spinner"></div><style>{`.loading-box{min-height:80vh;display:flex;justify-content:center;align-items:center}.spinner{width:50px;height:50px;border:5px solid rgba(255,255,255,.1);border-top:5px solid #e74c3c;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div className="profile-container">
      <h2>Hồ Sơ Của Tôi</h2>
      
      <div className="profile-card">
        <div className="avatar-section">
          <div className="avatar">{profile.username.charAt(0).toUpperCase()}</div>
          <h3>{profile.username}</h3>
        </div>

        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-group">
            <label>Username (Không thể đổi)</label>
            <input type="text" value={profile.username} disabled className="disabled-input" />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={profile.email} 
              onChange={e => setProfile({...profile, email: e.target.value})} 
              required 
            />
          </div>

          {msg && <p className={`msg ${msg.includes('Lỗi') ? 'error' : 'success'}`}>{msg}</p>}

          <button type="submit" className="save-btn">Lưu Thay Đổi</button>
        </form>

        <div className="actions">
          <Link to="/favorites" className="fav-link-btn">❤️ Xem Danh Sách Yêu Thích</Link>
        </div>
      </div>

      <style>{`.profile-container{max-width:600px;margin:50px auto;padding:20px;color:#fff}.profile-card{background:rgba(255,255,255,0.05);padding:40px;border-radius:15px;border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(10px)}.avatar-section{text-align:center;margin-bottom:30px}.avatar{width:80px;height:80px;background:#e74c3c;color:#fff;font-size:40px;font-weight:700;display:flex;justify-content:center;align-items:center;border-radius:50%;margin:0 auto 15px}.form-group{margin-bottom:20px}.form-group label{display:block;margin-bottom:8px;font-weight:500;color:#bbb}.form-group input{width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#222;color:#fff;outline:none}.form-group input:focus{border-color:#e74c3c}.disabled-input{opacity:0.6;cursor:not-allowed}.save-btn{width:100%;padding:12px;background:#3498db;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;transition:0.3s;margin-top:10px}.save-btn:hover{background:#2980b9}.actions{margin-top:30px;border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;text-align:center}.fav-link-btn{display:inline-block;color:#e74c3c;text-decoration:none;font-weight:700;border:1px solid #e74c3c;padding:10px 20px;border-radius:6px;transition:0.3s}.fav-link-btn:hover{background:#e74c3c;color:#fff}.msg{text-align:center;margin-top:10px;font-size:0.9rem}.msg.success{color:#2ecc71}.msg.error{color:#e74c3c}`}</style>
    </div>
  );
}