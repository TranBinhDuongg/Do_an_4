import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { Header } from '../../components/common/Header';

export function HomePage() {
  const { users, loading, error, addUser, removeUser } = useUsers();
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.email) {
      setFormError('Vui lòng nhập tên và email');
      return;
    }

    const res = await addUser(form);
    if (res.success) {
      setForm({ name: '', email: '', role: 'user' });
    } else {
      setFormError(res.message);
    }
  };

  return (
    <div className="container">
      <Header
        title="Dự Án Đồ Án 4 - React + Node.js (3 Lớp & OOP)"
        subtitle="Kiến trúc chuẩn phân tách Presentation -> Business Logic -> Data Access"
      />

      <div className="card-layer-info">
        <strong>🏛️ Minh họa kiến trúc 3 lớp:</strong>
        <ul style={{ marginLeft: '1.2rem', marginTop: '0.5rem' }}>
          <li><b>Lớp 1 (Presentation):</b> Express Controller & React UI / Custom Hooks</li>
          <li><b>Lớp 2 (Business Logic):</b> UserService & User Entity xử lý quy tắc nghiệp vụ</li>
          <li><b>Lớp 3 (Data Access):</b> UserRepository kế thừa BaseRepository thực hiện CRUD</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          placeholder="Họ và tên..."
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Địa chỉ Email..."
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Thêm Người Dùng</button>
      </form>

      {formError && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ {formError}</p>}
      {error && <p style={{ color: '#ef4444' }}>❌ {error}</p>}
      {loading && <p>Đang tải dữ liệu...</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Vai trò (OOP Badge)</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`badge ${user.isAdmin ? 'badge-admin' : 'badge-user'}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <button
                  className="btn-danger"
                  onClick={() => removeUser(user.id)}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
