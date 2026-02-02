"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import {
  User,
  Briefcase,
  ArrowRight,
  Loader2,
  Calendar,
  Camera,
  Upload,
  X,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AVATAR_OPTIONS = [
  { src: "/assets/Boy-1.jpg", gender: "Male" },
  { src: "/assets/Girl-1.jpg", gender: "Female" },
  { src: "/assets/Boy-2.jpg", gender: "Male" },
  { src: "/assets/Girl-2.jpg", gender: "Female" },
  { src: "/assets/Boy-3.jpg", gender: "Male" },
  { src: "/assets/Girl-3.jpg", gender: "Female" },
];

/* Helper Functions for Calendar */
const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Onboarding() {
  /* Component States */
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    bio: "",
    role: "",
    dob: "",
    gender: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [avatarTab, setAvatarTab] = useState("Male");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

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
        setIsDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (selectedAvatar) {
      setFormData({ ...formData, image: selectedAvatar });
      setIsDialogOpen(false);
    }
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    // Format YYYY-MM-DD for consistency
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    setSelectedDate(newDate);
    setFormData({ ...formData, dob: formattedDate });
    setIsDateOpen(false);
  };

  const changeMonth = (increment) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + increment,
      1,
    );
    setCurrentDate(newDate);
  };

  const handleOnboard = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/onboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await update({ isOnboarded: true });
        enqueueSnackbar("Profile setup complete! Welcome aboard 🚀", {
          variant: "success",
        });
        router.push("/dashboard");
      } else {
        enqueueSnackbar("Something went wrong. Please try again.", {
          variant: "error",
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Network error. Please try again.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAvatars = AVATAR_OPTIONS.filter(
    (av) => av.gender === avatarTab,
  );

  // Calendar Logic
  const daysInMonth = getDaysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear(),
  );
  const firstDay = getFirstDayOfMonth(
    currentDate.getMonth(),
    currentDate.getFullYear(),
  );
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="h-dvh bg-background text-foreground relative overflow-hidden transition-colors duration-500 flex flex-col">
      {/* Fixed Logo & Brand - Top Left */}
      <div className="fixed top-0 left-0 z-50 p-4 md:p-6 animate-fade-in">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 cursor-pointer transition-all duration-300 group-hover:scale-110">
            <img
              src="/icons/Logo.png"
              alt="SunMoonie"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-foreground font-black text-xl tracking-tight transition-all duration-300 group-hover:text-primary">
            SunMoonie
          </span>
        </div>
      </div>

      {/* Animated Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/20 blur-[120px] rounded-full transition-opacity duration-1000 animate-float" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 blur-[100px] rounded-full transition-opacity duration-1000 animate-float-delayed" />
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-pink-500/5 dark:bg-pink-500/10 blur-[80px] rounded-full transition-opacity duration-1000 animate-pulse-slow" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="min-h-full flex items-center justify-center px-4 pt-24 pb-12 md:p-8 z-10 transition-colors duration-500">
          <div className="w-full max-w-[600px] space-y-8 animate-slide-up">
            {/* Header */}
            <div className="text-center space-y-2 animate-fade-in-delayed">
              <h1 className="text-3xl font-bold text-foreground leading-tight">
                Let's set up your profile
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Customize your identity in the SunMoonie universe
              </p>
            </div>

            <form onSubmit={handleOnboard} className="space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--auth-input-border)] shadow-xl bg-[var(--auth-input-bg)] flex items-center justify-center">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={48} className="text-gray-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Camera size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Click camera to upload or choose avatar
                </p>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Role */}
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 ml-1">
                    What do you do?
                  </label>
                  <div className="relative">
                    <Briefcase
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm text-foreground font-medium backdrop-blur-sm hover:border-primary/30 focus:scale-[1.01]"
                      placeholder="e.g. Designer"
                      required
                    />
                  </div>
                </div>

                {/* Gender Custom Dropdown */}
                <div className="space-y-2 relative">
                  <label className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 ml-1">
                    Gender
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsGenderOpen(!isGenderOpen)}
                    onBlur={() => setTimeout(() => setIsGenderOpen(false), 200)}
                    className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm font-medium backdrop-blur-sm hover:border-primary/30 focus:scale-[1.01] flex items-center justify-between text-foreground cursor-pointer"
                  >
                    <span
                      className={
                        formData.gender ? "text-foreground" : "text-gray-500"
                      }
                    >
                      {formData.gender || "Select Gender"}
                    </span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        "text-gray-500 transition-transform duration-300",
                        isGenderOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={cn(
                      "absolute top-[calc(100%+8px)] left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden transition-all duration-200 z-50 origin-top",
                      isGenderOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
                    )}
                  >
                    {["Male", "Female", "Other"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, gender: option });
                          setIsGenderOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-primary/20 hover:text-primary transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        {option}
                        {formData.gender === option && (
                          <ArrowRight size={14} className="text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date of Birth - Custom Theme */}
                <div className="space-y-2 relative">
                  <label className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 ml-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 pointer-events-none"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.dob}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, dob: val });
                        const date = new Date(val);
                        if (!isNaN(date.getTime()) && val.length === 10) {
                          setSelectedDate(date);
                          setCurrentDate(date);
                        }
                      }}
                      onClick={() => setIsDateOpen(true)}
                      className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-xl py-3 pl-12 pr-10 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm font-medium backdrop-blur-sm hover:border-primary/30 focus:scale-[1.01] text-foreground placeholder:text-gray-500"
                      placeholder="YYYY-MM-DD"
                    />
                    <button
                      type="button"
                      onClick={() => setIsDateOpen(!isDateOpen)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                    >
                      <ChevronDown
                        size={18}
                        className={cn(
                          "transition-transform duration-300",
                          isDateOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </div>

                  {/* Custom Calendar Dropdown */}
                  {isDateOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full md:w-[320px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in p-4">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => changeMonth(-1)}
                          className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <ChevronDown className="rotate-90" size={20} />
                        </button>
                        <h4 className="font-bold text-foreground">
                          {MONTHS[currentDate.getMonth()]}{" "}
                          {currentDate.getFullYear()}
                        </h4>
                        <button
                          type="button"
                          onClick={() => changeMonth(1)}
                          className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <ChevronDown className="-rotate-90" size={20} />
                        </button>
                      </div>

                      {/* Days Header */}
                      <div className="grid grid-cols-7 mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <div
                            key={d}
                            className="text-center text-xs text-gray-500 font-medium py-1"
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {days.map((day, i) => (
                          <div key={i} className="aspect-square">
                            {day && (
                              <button
                                type="button"
                                onClick={() => handleDateSelect(day)}
                                className={cn(
                                  "w-full h-full rounded-full text-sm font-medium transition-all hover:bg-white/10 flex items-center justify-center",
                                  selectedDate?.getDate() === day &&
                                    selectedDate?.getMonth() ===
                                      currentDate.getMonth() &&
                                    selectedDate?.getFullYear() ===
                                      currentDate.getFullYear()
                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                    : "text-gray-300",
                                )}
                              >
                                {day}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 ml-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm text-foreground font-medium backdrop-blur-sm hover:border-primary/30 focus:scale-[1.01] h-24 resize-none"
                  placeholder="Tell us a bit about yourself..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-pink-500 text-white font-bold text-sm hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Finalizing...
                    </>
                  ) : (
                    <>
                      Complete Profile <ArrowRight size={18} />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Image Selection Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-background border border-white/10 w-full max-w-md rounded-3xl shadow-2xl animate-scale-in overflow-hidden flex flex-col max-h-[90vh]">
            {/* Dialog Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="text-lg font-bold text-foreground">
                Choose Profile Picture
              </h3>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                type="button"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              {/* Option 1: System Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 border-2 border-dashed border-white/10 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group flex flex-col items-center gap-2 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    Upload from System
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Max size 3MB</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  Or choose avatar
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Option 2: Avatar Selection */}
              <div className="space-y-4">
                {/* Gender Tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl">
                  {["Male", "Female"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setAvatarTab(gender)}
                      className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                        avatarTab === gender
                          ? "bg-primary text-white shadow-lg"
                          : "text-gray-500 hover:text-foreground",
                      )}
                    >
                      {gender}
                    </button>
                  ))}
                </div>

                {/* Avatars Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {filteredAvatars.map((avatar, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.src)}
                      className={cn(
                        "aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer relative group",
                        selectedAvatar === avatar.src
                          ? "border-primary ring-4 ring-primary/20 scale-105"
                          : "border-transparent bg-white/5 hover:bg-white/10",
                      )}
                    >
                      <img
                        src={avatar.src}
                        alt={`${avatar.gender} Avatar`}
                        className="w-full h-full object-cover"
                      />
                      {selectedAvatar === avatar.src && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <ArrowRight size={14} className="text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="p-5 border-t border-white/5 flex gap-3 bg-white/5">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors text-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
                disabled={!selectedAvatar}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
