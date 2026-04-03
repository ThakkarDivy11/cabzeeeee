import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  User as UserIcon, 
  Phone, 
  Camera, 
  ChevronLeft,
  Save,
  Loader2,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeCard from '../ui/ThemeCard';
import ThemeButton from '../ui/ThemeButton';
import ThemeInput from '../ui/ThemeInput';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setFormData({
            name: data.data.name,
            phone: data.data.phone,
            profilePicture: data.data.profilePicture || ''
          });
          if (data.data.profilePicture) {
            setPreview(data.data.profilePicture);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.name === 'profilePicture') {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const uploadData = new FormData();
      uploadData.append('name', formData.name);
      uploadData.append('phone', formData.phone);
      if (selectedFile) {
        uploadData.append('profilePicture', selectedFile);
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Identity updated successfully');
        localStorage.setItem('user', JSON.stringify(data.data));
        navigate('/user-profile');
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network synchronization error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-black text-primary animate-pulse tracking-widest uppercase">Opening Identity Terminal</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
            <button
                onClick={() => navigate(-1)}
                className="p-3 rounded-2xl glass border border-[var(--border-color)] text-[var(--text-muted)] hover:text-primary transition-all"
            >
                <ChevronLeft size={20} />
            </button>
            <div>
                <h1 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">Edit Identity</h1>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Profile Synchronization Hub</p>
            </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <ThemeCard className="grid lg:grid-cols-3 gap-12 p-10 pt-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            {/* Left: Picture Upload */}
            <div className="lg:col-span-1 flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-primary/20 shadow-2xl relative group bg-white/5">
                        {preview ? (
                            <img 
                                src={preview.startsWith('data:') || preview.startsWith('http') ? preview : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${preview}`} 
                                alt="Profile" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]/20">
                                <UserIcon size={64} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={32} className="text-white" />
                        </div>
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl border-4 border-[var(--bg-color)] cursor-pointer hover:scale-110 transition-all">
                        <Camera size={20} />
                        <input
                            type="file"
                            name="profilePicture"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Digital Avatar</p>
                    <p className="text-[9px] font-bold text-primary mt-1 opacity-50 uppercase tracking-widest">JPG, PNG OR SVG (MAX. 2MB)</p>
                </div>
                {preview && (
                    <ThemeButton 
                        variant="secondary" 
                        className="py-2 text-[10px] px-4 bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white"
                        onClick={() => { setPreview(null); setSelectedFile(null); }}
                        type="button"
                    >
                        <Trash2 size={12} /> Remove
                    </ThemeButton>
                )}
            </div>

            {/* Right: Info Fields */}
            <div className="lg:col-span-2 space-y-8">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                             <div className="w-1.5 h-4 bg-primary rounded-full" />
                             Core Identity
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Legal Name</label>
                                <ThemeInput
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    icon={UserIcon}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Secure Phone Line</label>
                                <ThemeInput
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    icon={Phone}
                                    placeholder="+91 00000 00000"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-[var(--border-color)]">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto px-10 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                        >
                            Discard Changes
                        </button>
                        <ThemeButton
                            type="submit"
                            disabled={updating}
                            className="w-full sm:w-auto px-12 py-4 h-auto shadow-xl shadow-primary/20"
                        >
                            {updating ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Synchronizing...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save size={18} /> Push Updates
                                </div>
                            )}
                        </ThemeButton>
                    </div>
                </div>
            </div>
        </ThemeCard>
      </form>
    </div>
  );
};

export default EditProfile;
