import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!formData.email) errs.email = 'Email is required';
        if (!formData.password) errs.password = 'Password is required';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        setErrors({});
        try {
            // Detect if input is email or username and send the correct field
            const input = formData.email.trim();
            const credentials = input.includes('@')
                ? { email: input, password: formData.password }
                : { userName: input, password: formData.password };
            await login(credentials);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <HiOutlineVideoCamera className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-text-muted text-sm mt-1">Sign in to your VideoTube account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-bg-card border border-border-primary rounded-2xl p-6 space-y-4">
                    <Input
                        label="Email or Username"
                        type="text"
                        placeholder="Enter your email or username"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        error={errors.email}
                        id="login-email"
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        error={errors.password}
                        id="login-password"
                    />
                    <Button type="submit" disabled={submitting} className="w-full" id="login-submit">
                        {submitting ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>

                <p className="text-center text-sm text-text-muted mt-6">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-accent hover:text-accent-hover font-medium">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
