import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const { login } = useAuth();
  const [err, setErr] = useState('');

  const hSubmit = async (e) => {
    e.preventDefault();
    const success = await login(u, p);
    if (!success) setErr('Sai tài khoản hoặc mật khẩu (Thử admin/123)');
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={hSubmit}>
        <input placeholder="Username" value={u} onChange={e=>setU(e.target.value)} required />
        <input type="password" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} required />
        {err && <p className="err">{err}</p>}
        <button type="submit">Login</button>
      </form>
      <style>{`.auth-container{max-width:400px;margin:50px auto;padding:30px;border:1px solid #ccc;border-radius:8px;text-align:center}.auth-container input{display:block;width:100%;margin-bottom:15px;padding:10px;box-sizing:border-box}.auth-container button{padding:10px 20px;cursor:pointer}.err{color:red}`}</style>
    </div>
  );
}