"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import {
  User,
  Briefcase,
  FileText,
  Calendar,
  Camera,
  Save,
  Loader2,
  Mail,
} from "lucide-react";

const AVATARS = [
  "/avatars/boy1.png",
  "/avatars/girl1.png",
  "/avatars/boy2.png",
  "/avatars/girl2.png",
  "/avatars/boy3.png",
  "/avatars/girl3.png",
];

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    bio: "",
    role: "",
    dob: "",
    gender: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        bio: session.user.bio || "",
        role: session.user.role || "",
        dob: session.user.dob
          ? new Date(session.user.dob).toISOString().split("T")[0]
          : "",
        gender: session.user.gender || "",
        image: session.user.image || "",
      });
    }
  }, [session]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        enqueueSnackbar("Image size must be less than 3MB", {
          variant: "error",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/onboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await update(formData);
        enqueueSnackbar("Profile updated successfully!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Failed to update profile", {
          variant: "error",
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Network error", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            My Profile
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your personal information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-background border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-2xl ring-4 ring-primary/10">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">
                {session?.user?.name}
              </h2>
              <p className="text-sm text-gray-500">{session?.user?.email}</p>
            </div>

            <div className="w-full pt-4 border-t border-black/5 dark:border-white/5">
              <div className="flex gap-3 justify-center flex-wrap">
                {AVATARS.map((avatar, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: avatar })}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all hover:scale-110 cursor-pointer ${
                      formData.image === avatar
                        ? "border-primary ring-2 ring-primary/30 scale-110"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-background border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <form
              onSubmit={handleUpdateProfile}
              className="space-y-6 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 ml-1">
                    Role
                  </label>
                  <div className="relative">
                    <Briefcase
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 ml-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* DOB */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 ml-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium cursor-pointer"
                    />
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 ml-1">
                    Email
                  </label>
                  <div className="relative opacity-70">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={session?.user?.email || ""}
                      disabled
                      className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-xl py-3 pl-12 pr-4 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500 ml-1">
                  Bio
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-4 top-4 text-gray-400"
                    size={18}
                  />
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium h-32 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
