/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Define User interface for type safety
interface User {
  username: string;
  password: string;
  role: 'admin' | 'user';
  fullName: string;
  nik?: string;
  jenisKelamin?: string;
  alamat?: string;
  pekerjaan?: string;
  jabatan?: string;
  ort?: string;
  orw?: string;
}

// Admin default
const defaultAdmin: User = { username: 'admin', password: '123', role: 'admin', fullName: 'Admin' };

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState('login'); // 'login', 'register'
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem('users');
      const parsedUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      if (!parsedUsers.find(u => u.username === defaultAdmin.username)) {
        parsedUsers.push(defaultAdmin);
      } else {
        // Ensure admin password is up to date if code changes
        return parsedUsers.map(u => u.username === defaultAdmin.username ? defaultAdmin : u);
      }
      return parsedUsers;
    } catch (error) {
      return [defaultAdmin];
    }
  });

  // Form states
  const [fullName, setFullName] = useState('');
  const [nik, setNik] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [alamat, setAlamat] = useState('');
  const [pekerjaan, setPekerjaan] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [jabatanLainnya, setJabatanLainnya] = useState('');
  const [ort, setOrt] = useState('');
  const [orw, setOrw] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [nikError, setNikError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [pekerjaanError, setPekerjaanError] = useState('');
  const [jabatanLainnyaError, setJabatanLainnyaError] = useState('');
  const [ortError, setOrtError] = useState('');
  const [orwError, setOrwError] = useState('');
  const [isLoginPasswordVisible, setIsLoginPasswordVisible] = useState(false);
  const [isRegisterPasswordVisible, setIsRegisterPasswordVisible] = useState(false);


  // Admin panel states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [editModalError, setEditModalError] = useState('');


  useEffect(() => {
    try {
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  useEffect(() => {
    const defaultBgColor = '#f5f5f5';
    const loginBgColor = '#e3f2fd'; // Light Blue
    const registerBgColor = '#ede7f6'; // Light Purple

    if (!currentUser) {
        if (view === 'login') {
            document.body.style.backgroundColor = loginBgColor;
        } else if (view === 'register') {
            document.body.style.backgroundColor = registerBgColor;
        } else {
            document.body.style.backgroundColor = defaultBgColor;
        }
    } else {
      document.body.style.backgroundColor = defaultBgColor;
    }

    // Cleanup function to reset the background color when the component unmounts
    return () => {
      document.body.style.backgroundColor = defaultBgColor;
    };
  }, [view, currentUser]);

  const clearFormState = () => {
    setFullName('');
    setNik('');
    setJenisKelamin('');
    setAlamat('');
    setPekerjaan('');
    setJabatan('');
    setJabatanLainnya('');
    setOrt('');
    setOrw('');
    setUsername('');
    setPassword('');
    setError('');
    setNikError('');
    setFullNameError('');
    setPekerjaanError('');
    setJabatanLainnyaError('');
    setOrtError('');
    setOrwError('');
    setIsLoginPasswordVisible(false);
    setIsRegisterPasswordVisible(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      clearFormState();
    } else {
      setError('Nama pengguna atau kata sandi salah.');
    }
  };

  const validateRegistrationForm = () => {
    setError('');
    setNikError('');
    setFullNameError('');
    setPekerjaanError('');
    setJabatanLainnyaError('');
    setOrtError('');
    setOrwError('');

    let isValid = true;
    
    if (!fullName || !nik || !jenisKelamin || !alamat || !pekerjaan || !jabatan || !ort || !orw || !username || !password) {
      setError('Semua kolom wajib diisi.');
      isValid = false;
    }
    
    if (!/^[a-zA-Z\s']+$/.test(fullName)) {
        setFullNameError('Nama Lengkap tidak valid. Hanya boleh berisi huruf dan spasi.');
        isValid = false;
    }
    
    if (!/^\d{16}$/.test(nik)) {
        setNikError('NIK tidak valid. NIK harus terdiri dari 16 digit angka.');
        isValid = false;
    }

    if (!/^[a-zA-Z\s]+$/.test(pekerjaan)) {
        setPekerjaanError('Pekerjaan tidak valid. Hanya boleh berisi huruf dan spasi.');
        isValid = false;
    }
    
    if (jabatan === 'Lainnya') {
      if (!jabatanLainnya.trim()) {
        setJabatanLainnyaError('Jabatan Lainnya tidak boleh kosong.');
        isValid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(jabatanLainnya)) {
        setJabatanLainnyaError('Jabatan Lainnya tidak valid. Hanya boleh berisi huruf dan spasi.');
        isValid = false;
      }
    }

    const ortOrwRegex = /^00\d{1,2}$/;
    if (!ortOrwRegex.test(ort)) {
        setOrtError("ORT tidak valid. Harus diawali '00' dan memiliki total 3-4 digit angka.");
        isValid = false;
    }

    if (!ortOrwRegex.test(orw)) {
        setOrwError("ORW tidak valid. Harus diawali '00' dan memiliki total 3-4 digit angka.");
        isValid = false;
    }

    if (users.find(u => u.username === username)) {
      setError('Nama pengguna sudah ada. Silakan pilih yang lain.');
      isValid = false;
    }
    
    return isValid;
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegistrationForm()) {
      return;
    }
    
    const finalJabatan = jabatan === 'Lainnya' ? jabatanLainnya : jabatan;
    const newUser: User = { fullName, nik, jenisKelamin, alamat, pekerjaan, jabatan: finalJabatan, ort, orw, username, password, role: 'user' };
    setUsers([...users, newUser]);
    setView('login');
    alert('Registrasi berhasil! Silakan login.');
    clearFormState();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
  };

  const handleDeleteUser = (usernameToDelete: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna ${usernameToDelete}?`)) {
        setUsers(users.filter(user => user.username !== usernameToDelete));
    }
  };

  const handleOpenEditModal = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setEditFormData(userToEdit);
    setIsEditModalOpen(true);
    setEditModalError('');
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditFormData({});
    setEditModalError('');
  };
  
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'nik' || name === 'ort' || name === 'orw') {
        setEditFormData({ ...editFormData, [name]: value.replace(/\D/g, '') });
    } else {
        setEditFormData({ ...editFormData, [name]: value });
    }
  };
  
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setEditModalError('');

    // Validation: Check for duplicate username if it's being changed
    if (editFormData.username && editFormData.username !== editingUser?.username) {
        if (users.some(user => user.username === editFormData.username)) {
            setEditModalError('Nama pengguna ini sudah digunakan. Silakan pilih yang lain.');
            return;
        }
    }

    setUsers(users.map(user => 
        user.username === editingUser?.username ? { ...user, ...editFormData } : user
    ));
    handleCloseEditModal();
  };


  const renderLoginForm = () => (
    <div className="form-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
           <label htmlFor="login-username">Nama Pengguna</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="login-password">Kata Sandi</label>
          <div className="password-input-wrapper">
            <input
              id="login-password"
              type={isLoginPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setIsLoginPasswordVisible(!isLoginPasswordVisible)}
                aria-label={isLoginPasswordVisible ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
            >
                {isLoginPasswordVisible ? 'Sembunyikan' : 'Lihat'}
            </button>
          </div>
        </div>
        <button type="submit" className="button-primary">Login</button>
        <p className="switch-view">
          Belum punya akun? <button type="button" onClick={() => { setView('register'); clearFormState(); }}>Registrasi</button>
        </p>
      </form>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="form-container">
      <form onSubmit={handleRegister} noValidate>
        <h2>Registrasi Pengguna</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="register-fullname" className="required">Nama Lengkap</label>
          <input
            id="register-fullname"
            type="text"
            value={fullName}
            onChange={(e) => {
                setFullName(e.target.value);
                if (fullNameError) setFullNameError('');
            }}
            required
            aria-invalid={!!fullNameError}
            aria-describedby="fullname-message"
           />
           {fullNameError && <small id="fullname-message" className="input-error-text">{fullNameError}</small>}
        </div>
        <div className="input-group">
          <label htmlFor="register-nik" className="required">NIK</label>
          <input
            id="register-nik"
            type="text"
            value={nik}
            onChange={(e) => {
                setNik(e.target.value.replace(/\D/g, ''));
                if (nikError) setNikError('');
            }}
            maxLength={16}
            required
            aria-invalid={!!nikError}
            aria-describedby="nik-message"
          />
          {nikError ? (
            <small id="nik-message" className="input-error-text">{nikError}</small>
          ) : (
            <small id="nik-message" className="input-helper-text">Wajib diisi, harus 16 digit angka.</small>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="register-jenis-kelamin" className="required">Jenis Kelamin</label>
          <select id="register-jenis-kelamin" value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} required>
            <option value="" disabled>Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="register-alamat" className="required">Alamat</label>
          <textarea id="register-alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="register-pekerjaan" className="required">Pekerjaan</label>
          <input 
            id="register-pekerjaan" 
            type="text" 
            value={pekerjaan} 
            onChange={(e) => {
              setPekerjaan(e.target.value);
              if (pekerjaanError) setPekerjaanError('');
            }} 
            required
            aria-invalid={!!pekerjaanError}
            aria-describedby="pekerjaan-message"
          />
          {pekerjaanError && <small id="pekerjaan-message" className="input-error-text">{pekerjaanError}</small>}
        </div>
        <div className="input-group">
          <label htmlFor="register-jabatan" className="required">Jabatan</label>
          <select id="register-jabatan" value={jabatan} onChange={(e) => {
              const selectedValue = e.target.value;
              setJabatan(selectedValue);
              if (selectedValue !== 'Lainnya') {
                setJabatanLainnya('');
                setJabatanLainnyaError('');
              }
          }} required>
            <option value="" disabled>Pilih Jabatan</option>
            <option value="Ketua ORW">Ketua ORW</option>
            <option value="Ketua ORT">Ketua ORT</option>
            <option value="Ketua LPM">Ketua LPM</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        {jabatan === 'Lainnya' && (
          <div className="input-group">
            <label htmlFor="register-jabatan-lainnya" className="required">Jabatan Lainnya</label>
            <input
              id="register-jabatan-lainnya"
              type="text"
              value={jabatanLainnya}
              onChange={(e) => {
                setJabatanLainnya(e.target.value);
                if (jabatanLainnyaError) setJabatanLainnyaError('');
              }}
              required
              aria-invalid={!!jabatanLainnyaError}
              aria-describedby="jabatan-lainnya-message"
            />
            {jabatanLainnyaError && <small id="jabatan-lainnya-message" className="input-error-text">{jabatanLainnyaError}</small>}
          </div>
        )}
        <div className="input-group">
          <label htmlFor="register-ort" className="required">ORT</label>
          <input
            id="register-ort"
            type="text"
            value={ort}
            onChange={(e) => {
              setOrt(e.target.value.replace(/\D/g, ''));
              if (ortError) setOrtError('');
            }}
            maxLength={4}
            required
            aria-invalid={!!ortError}
            aria-describedby="ort-message"
          />
          {ortError ? (
            <small id="ort-message" className="input-error-text">{ortError}</small>
          ) : (
            <small id="ort-message" className="input-helper-text">Wajib diisi, diawali '00', total 3-4 digit (misal: 001, 0012).</small>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="register-orw" className="required">ORW</label>
          <input
            id="register-orw"
            type="text"
            value={orw}
            onChange={(e) => {
              setOrw(e.target.value.replace(/\D/g, ''));
              if (orwError) setOrwError('');
            }}
            maxLength={4}
            required
            aria-invalid={!!orwError}
            aria-describedby="orw-message"
          />
          {orwError ? (
            <small id="orw-message" className="input-error-text">{orwError}</small>
          ) : (
            <small id="orw-message" className="input-helper-text">Wajib diisi, diawali '00', total 3-4 digit (misal: 001, 0012).</small>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="register-username" className="required">Nama Pengguna</label>
          <input
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="register-password" className="required">Kata Sandi</label>
          <div className="password-input-wrapper">
            <input
              id="register-password"
              type={isRegisterPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setIsRegisterPasswordVisible(!isRegisterPasswordVisible)}
                aria-label={isRegisterPasswordVisible ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
            >
                {isRegisterPasswordVisible ? 'Sembunyikan' : 'Lihat'}
            </button>
          </div>
        </div>
        <button type="submit" className="button-primary">Registrasi</button>
        <button type="button" className="button-secondary" onClick={() => { setView('login'); clearFormState(); }}>
          Kembali
        </button>
      </form>
    </div>
  );

  const renderHomePage = () => (
    <div className="home-container">
      <h1>Selamat Datang, {currentUser!.fullName || currentUser!.username}!</h1>
      {currentUser!.fullName && <p className="username-display">(@{currentUser!.username})</p>}
      <p>Peran Anda: <span className={`role ${currentUser!.role}`}>{currentUser!.role}</span></p>

      {currentUser!.role === 'user' && (
        <div className="user-details">
            <p><strong>NIK:</strong> {currentUser!.nik}</p>
            <p><strong>Jenis Kelamin:</strong> {currentUser!.jenisKelamin}</p>
            <p><strong>Alamat:</strong> {currentUser!.alamat}</p>
            <p><strong>Pekerjaan:</strong> {currentUser!.pekerjaan}</p>
            <p><strong>Jabatan:</strong> {currentUser!.jabatan}</p>
            <p><strong>Lokasi:</strong> RT {currentUser!.ort} / RW {currentUser!.orw}</p>
        </div>
      )}

      {currentUser!.role === 'admin' && (
        <div className="admin-panel">
          <h3>Panel Kelola Pengguna</h3>
          <div className="table-responsive">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Nama Lengkap</th>
                  <th>Username</th>
                  <th>Kata Sandi</th>
                  <th>NIK</th>
                  <th>Jenis Kelamin</th>
                  <th>Alamat</th>
                  <th>Pekerjaan</th>
                  <th>Jabatan</th>
                  <th>RT dan RW</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role !== 'admin').map(user => (
                  <tr key={user.username}>
                    <td data-label="Nama Lengkap">{user.fullName}</td>
                    <td data-label="Username">{user.username}</td>
                    <td data-label="Kata Sandi">{user.password}</td>
                    <td data-label="NIK">{user.nik}</td>
                    <td data-label="Jenis Kelamin">{user.jenisKelamin}</td>
                    <td data-label="Alamat">{user.alamat}</td>
                    <td data-label="Pekerjaan">{user.pekerjaan}</td>
                    <td data-label="Jabatan">{user.jabatan}</td>
                    <td data-label="RT dan RW">{`RT ${user.ort} / RW ${user.orw}`}</td>
                    <td data-label="Aksi">
                      <div className="action-buttons">
                        <button className="button-edit" onClick={() => handleOpenEditModal(user)}>Edit</button>
                        <button className="button-delete" onClick={() => handleDeleteUser(user.username)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <button onClick={handleLogout} className="button-danger">Logout</button>
    </div>
  );

  const renderEditModal = () => {
    if (!isEditModalOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <form onSubmit={handleUpdateUser}>
                    <h2>Edit Pengguna: {editingUser?.fullName}</h2>
                    {editModalError && <p className="error-message">{editModalError}</p>}
                    <div className="input-group">
                        <label htmlFor="edit-username">Nama Pengguna</label>
                        <input type="text" id="edit-username" name="username" value={editFormData.username || ''} onChange={handleEditFormChange} required />
                    </div>
                     <div className="input-group">
                        <label htmlFor="edit-password">Kata Sandi</label>
                        <input type="text" id="edit-password" name="password" value={editFormData.password || ''} onChange={handleEditFormChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="edit-fullName">Nama Lengkap</label>
                        <input type="text" id="edit-fullName" name="fullName" value={editFormData.fullName || ''} onChange={handleEditFormChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="edit-nik">NIK</label>
                        <input type="text" id="edit-nik" name="nik" value={editFormData.nik || ''} onChange={handleEditFormChange} maxLength={16} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="edit-jenisKelamin">Jenis Kelamin</label>
                        <select id="edit-jenisKelamin" name="jenisKelamin" value={editFormData.jenisKelamin || ''} onChange={handleEditFormChange}>
                            <option value="" disabled>Pilih Jenis Kelamin</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="edit-alamat">Alamat</label>
                        <textarea id="edit-alamat" name="alamat" value={editFormData.alamat || ''} onChange={handleEditFormChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="edit-pekerjaan">Pekerjaan</label>
                        <input type="text" id="edit-pekerjaan" name="pekerjaan" value={editFormData.pekerjaan || ''} onChange={handleEditFormChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="edit-jabatan">Jabatan</label>
                        <input type="text" id="edit-jabatan" name="jabatan" value={editFormData.jabatan || ''} onChange={handleEditFormChange} />
                    </div>
                     <div className="input-group">
                        <label htmlFor="edit-ort">ORT</label>
                        <input type="text" id="edit-ort" name="ort" value={editFormData.ort || ''} onChange={handleEditFormChange} maxLength={4} />
                    </div>
                     <div className="input-group">
                        <label htmlFor="edit-orw">ORW</label>
                        <input type="text" id="edit-orw" name="orw" value={editFormData.orw || ''} onChange={handleEditFormChange} maxLength={4} />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="button-primary">Simpan Perubahan</button>
                        <button type="button" className="button-secondary" onClick={handleCloseEditModal}>Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
  };

  return (
    <div className="app-container">
      {!currentUser && view === 'login' && (
        <h1 className="login-page-header">
          KELURAHAN BARA BARAYA SELATAN
        </h1>
      )}
      {currentUser
        ? renderHomePage()
        : view === 'login'
        ? renderLoginForm()
        : renderRegisterForm()}
      {renderEditModal()}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);