import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [f, setF] = useState({ u: '', p: '', e: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const sub = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setErr('');

    const ok = await register(f.u, f.p, f.e);
    if (ok) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        nav('/login');
    } else {
        setErr('Đăng ký thất bại. Username hoặc Email có thể đã tồn tại.');
        setLoading(false);
    }
  };

  return (
    <div className="auth-box">
      <h2>Register</h2>
      <form onSubmit={sub}>
        <input placeholder="Username" value={f.u} onChange={e=>setF({...f, u:e.target.value})} required />
        <input type="email" placeholder="Email" value={f.e} onChange={e=>setF({...f, e:e.target.value})} required />
        <input type="password" placeholder="Password" value={f.p} onChange={e=>setF({...f, p:e.target.value})} required />
        {err && <p className="err">{err}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Register'}</button>
      </form>
      <style>{`.auth-box{max-width:400px;margin:50px auto;padding:30px;border:1px solid #ccc;border-radius:8px;text-align:center}.auth-box input{display:block;width:100%;margin-bottom:15px;padding:10px;box-sizing:border-box}.auth-box button{padding:10px 20px;cursor:pointer;background:#e74c3c;color:#fff;border:none;border-radius:4px}.auth-box button:disabled{opacity:.6}.err{color:red;margin-bottom:10px}`}</style>
    </div>
  );
}