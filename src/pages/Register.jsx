import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [e, setE] = useState('');
  const { register } = useAuth();
  const nav = useNavigate();

  const hSubmit = async (evt) => {
    evt.preventDefault();
    await register(u, p, e);
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    nav('/login');
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={hSubmit}>
        <input placeholder="Username" value={u} onChange={evt=>setU(evt.target.value)} required />
        <input placeholder="Email" type="email" value={e} onChange={evt=>setE(evt.target.value)} required />
        <input type="password" placeholder="Password" value={p} onChange={evt=>setP(evt.target.value)} required />
        <button type="submit">Register</button>
      </form>
      <style>{`.auth-container{max-width:400px;margin:50px auto;padding:30px;border:1px solid #ccc;border-radius:8px;text-align:center}.auth-container input{display:block;width:100%;margin-bottom:15px;padding:10px;box-sizing:border-box}.auth-container button{padding:10px 20px;cursor:pointer}`}</style>
    </div>
  );
}