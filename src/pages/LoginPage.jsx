import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    // Simulate demo login
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003d6b] via-[#005583] to-[#006CAA] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/3 rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#005583] to-[#006CAA] px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl mb-4 shadow-lg">
              <img
                src="/ism-logo.png"
                alt="ISM Data Technology"
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span style="color:#006CAA;font-weight:800;font-size:1.1rem;">ISM</span>';
                }}
              />
            </div>
            <h1 className="text-white font-bold text-xl tracking-tight">ISM Data Technology</h1>
            <p className="text-blue-100 text-sm mt-1">Work Allocation Portal</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-brand-text font-bold text-xl mb-1">Admin Login</h2>
            <p className="text-gray-500 text-sm mb-6">
              Manage work, track deadlines and monitor vendor progress in one place.
            </p>

            {/* Demo notice */}
            <div className="bg-primary-light border border-primary/20 rounded-lg px-4 py-3 mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-primary">
                <strong>Demo Mode:</strong> Enter any valid email and any password (min. 4 chars) to proceed.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="mb-4">
                <label htmlFor="login-email" className="label">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                  placeholder="Enter your email"
                  className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <label htmlFor="login-password" className="label">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                    placeholder="Enter your password"
                    className={`input-field pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              <button
                id="sign-in-btn"
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-4">
          © 2026 ISM Data Technology. Empowering Rural Women's.
        </p>
      </div>
    </div>
  );
}
