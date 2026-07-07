import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { HiOutlineVideoCamera, HiOutlinePhotograph } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Register() {
    const [formData, setFormData] = useState({ fullName: '', userName: '', email: '', password: '' });
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        if (type === 'avatar') {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setCoverImage(file);
        }
    };

    const validate = () => {
        const errs = {};
        if (!formData.fullName) errs.fullName = 'Full name is required';
        if (!formData.userName) errs.userName = 'Username is required';
        if (!formData.email) errs.email = 'Email is required';
        if (!formData.password) errs.password = 'Password is required';
        if (formData.password && formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
        if (!avatar) errs.avatar = 'Avatar is required';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        setErrors({});
        try {
            const fd = new FormData();
            fd.append('fullName', formData.fullName);
            fd.append('userName', formData.userName);
            fd.append('email', formData.email);
            fd.append('password', formData.password);
            fd.append('avatar', avatar);
            if (coverImage) fd.append('coverImage', coverImage);

            await registerUser(fd);
            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <HiOutlineVideoCamera className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Create account</h1>
                    <p className="text-text-muted text-sm mt-1">Join VideoTube today</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-bg-card border border-border-primary rounded-2xl p-6 space-y-4">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-2">
                        <label htmlFor="avatar-upload" className="cursor-pointer group">
                            <div className="w-20 h-20 rounded-full bg-bg-tertiary border-2 border-dashed border-border-secondary group-hover:border-accent overflow-hidden flex items-center justify-center transition-colors">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <HiOutlinePhotograph className="w-8 h-8 text-text-muted" />
                                )}
                            </div>
                            <p className="text-xs text-text-muted text-center mt-2">Upload avatar *</p>
                        </label>
                        <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
                        {errors.avatar && <p className="text-xs text-danger mt-1">{errors.avatar}</p>}
                    </div>

                    <Input label="Full Name" placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} error={errors.fullName} id="register-fullname" />
                    <Input label="Username" placeholder="johndoe" value={formData.userName} onChange={(e) => setFormData({ ...formData, userName: e.target.value.toLowerCase() })} error={errors.userName} id="register-username" />
                    <Input label="Email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email} id="register-email" />
                    <Input label="Password" type="password" placeholder="Min. 6 characters" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} error={errors.password} id="register-password" />

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Cover Image (optional)</label>
                        <label htmlFor="cover-upload" className="flex items-center gap-2 cursor-pointer px-4 py-2.5 bg-bg-secondary border border-border-primary rounded-lg hover:border-accent transition-colors">
                            <HiOutlinePhotograph className="w-4 h-4 text-text-muted" />
                            <span className="text-sm text-text-muted">{coverImage ? coverImage.name : 'Choose cover image'}</span>
                        </label>
                        <input type="file" id="cover-upload" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'cover')} />
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full" id="register-submit">
                        {submitting ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>

                <p className="text-center text-sm text-text-muted mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-accent hover:text-accent-hover font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
