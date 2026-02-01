"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import {
  User,
  Briefcase,
  Calendar,
  Camera,
  Upload,
  X,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Save,
  Settings,
  Phone,
  MapPin,
  Mail,
  Edit2,
  Globe,
  LogOut,
  Users,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SettingsDialog from "@/components/SettingsDialog";
import LogoutConfirmationDialog from "@/components/LogoutConfirmationDialog";

const AVATAR_OPTIONS = [
  { src: "/assets/Boy-1.jpg", gender: "Male" },
  { src: "/assets/Girl-1.jpg", gender: "Female" },
  { src: "/assets/Boy-2.jpg", gender: "Male" },
  { src: "/assets/Girl-2.jpg", gender: "Female" },
  { src: "/assets/Boy-3.jpg", gender: "Male" },
  { src: "/assets/Girl-3.jpg", gender: "Female" },
];

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

/* Helper Functions for Calendar */
const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    role: "",
    dob: "",
    gender: "",
    image: "",
    mobile: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  // New States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [avatarTab, setAvatarTab] = useState("Male");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (session?.user && isInitialLoad) {
      const dobVal = session.user.dob
        ? new Date(session.user.dob).toISOString().split("T")[0]
        : "";
      setFormData({
        name: session.user.name || "",
        bio: session.user.bio || "",
        role: session.user.role || "",
        dob: dobVal,
        gender: session.user.gender || "",
        image: session.user.image || "",
        mobile: session.user.mobile || "",
        location: session.user.location || "",
      });
      if (dobVal) {
        const date = new Date(dobVal);
        setSelectedDate(date);
        setCurrentDate(date);
      }
      setIsInitialLoad(false);
    }
  }, [session, isInitialLoad]);

  // Listener for logout from settings
  useEffect(() => {
    const handleLogoutRequest = () => setShowLogoutDialog(true);
    if (typeof window !== "undefined") {
      window.addEventListener("open-logout-dialog", handleLogoutRequest);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("open-logout-dialog", handleLogoutRequest);
      }
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Strict 2MB to be safe with base64 overhead
        enqueueSnackbar("Image size must be less than 2MB", {
          variant: "error",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadstart = () => setIsLoading(true);
      reader.onloadend = () => {
        setIsLoading(false);
        setSelectedAvatar(reader.result);
        console.log("Image loaded, size:", reader.result.length);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) return;

    setIsLoading(true);
    enqueueSnackbar("Updating profile picture...", { variant: "info" });

    try {
      // Direct API call for immediate update
      const updatedData = {
        ...formData,
        image: selectedAvatar,
      };

      const res = await fetch("/api/user/onboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        // Update local state
        setFormData((prev) => ({ ...prev, image: selectedAvatar }));

        // Sync session (exclude image string to keep token small)
        const { image, ...minimalData } = updatedData;
        await update({
          ...minimalData,
          lastUpdated: Date.now(),
        });

        enqueueSnackbar("Profile picture updated!", { variant: "success" });
        setIsDialogOpen(false);
        setIsEditing(false); // Reset editing state if it was triggered

        // Force reload to sync Header/Sidebar
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        const errorData = await res.json().catch(() => ({}));
        enqueueSnackbar(errorData.error || "Failed to update image", {
          variant: "error",
        });
      }
    } catch (err) {
      console.error("Save avatar error:", err);
      enqueueSnackbar("Error saving image", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    setSelectedDate(newDate);
    setFormData((prev) => ({ ...prev, dob: formattedDate }));
    setIsDateOpen(false);
  };

  const changeMonth = (increment) => {
    setCurrentDate((prev) => {
      const nextDate = new Date(
        prev.getFullYear(),
        prev.getMonth() + increment,
        1,
      );
      return nextDate;
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create the final payload, prioritizing the UI's selected image state
      const updatedData = {
        ...formData,
        image: selectedAvatar || formData.image,
      };

      console.log(
        "Initiating profile update. Payload fields:",
        Object.keys(updatedData),
      );
      console.log(
        "Image present:",
        !!updatedData.image,
        "Size:",
        updatedData.image?.length || 0,
      );

      const payloadString = JSON.stringify(updatedData);
      const payloadSize = new Blob([payloadString]).size;
      console.log("Total payload size:", payloadSize, "bytes");

      if (payloadSize > 4.5 * 1024 * 1024) {
        enqueueSnackbar(
          "Overall profile data is too large (max 3MB image allowed)",
          {
            variant: "error",
          },
        );
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/user/onboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: payloadString,
      });

      if (res.ok) {
        console.log("API Success. Triggering session sync...");

        // Trigger a session update without the image.
        // auth-options.js is now configured to NOT store image in JWT.
        const { image, ...minimalData } = formData;
        await update({
          ...minimalData,
          lastUpdated: Date.now(),
        });

        enqueueSnackbar("Profile updated successfully!", {
          variant: "success",
        });

        setIsEditing(false);

        // Final force sync because next-auth state can be stubborn
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        const errorText = await res.text();
        console.error("API Failure:", res.status, errorText);
        let errorMessage = "Save failed";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {}

        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    } catch (err) {
      console.error("Network Exception:", err);
      enqueueSnackbar("Network error: " + err.message, { variant: "error" });
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
    <div className="min-h-screen bg-background text-foreground pb-20 relative">
      {/* Absolute Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-white font-bold animate-pulse text-lg">
            Saving your changes...
          </p>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-black/5 dark:border-white/5">
        <button
          onClick={() => router.back()}
          className="p-2 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors text-primary cursor-pointer"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-bold">My Profile</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors text-primary cursor-pointer"
        >
          <Settings size={22} />
        </button>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-6">
        {/* Profile Header Card */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-primary to-purple-600 shadow-[0_0_30px_0_rgba(236,72,153,0.3)]">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-background bg-gray-100 dark:bg-zinc-900">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="w-full h-full p-6 text-gray-600" />
                )}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 p-2 bg-primary rounded-full border-4 border-background shadow-lg">
              <Camera size={14} className="text-white" />
            </div>
          </div>

          <div className="space-y-1">
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-2xl font-bold bg-transparent border-b-2 border-primary/50 text-foreground focus:outline-none focus:border-primary px-1"
                placeholder="Your Name"
              />
            ) : (
              <h2 className="text-2xl font-bold text-foreground">
                {formData.name || session?.user?.name}
              </h2>
            )}
            <p className="text-sm font-medium text-primary uppercase tracking-wide">
              Active Member
            </p>
            {formData.role && (
              <p className="text-sm text-gray-400">{formData.role}</p>
            )}
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="bg-card border border-border rounded-3xl shadow-xl lg:shadow-none">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-overlay rounded-t-3xl">
            <h3 className="font-bold text-foreground">Personal Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-full transition-colors cursor-pointer"
            >
              <Edit2 size={12} />
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="p-6 space-y-1">
            {/* Email (Read Only) */}
            <div className="flex items-center gap-4 py-3 border-b border-border">
              <div className="flex items-center justify-center text-primary">
                <Mail size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">
                  Email
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-4 py-3 border-b border-border">
              <div className="flex items-center justify-center text-primary">
                <Phone size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">
                  Phone
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mobile: e.target.value,
                      }))
                    }
                    className="w-full bg-transparent border-b border-primary/50 text-sm font-medium focus:outline-none py-0.5"
                    placeholder="+1 234 567 890"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {formData.mobile || "Not added"}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4 py-3 border-b border-border">
              <div className="flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">
                  Location
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="w-full bg-transparent border-b border-primary/50 text-sm font-medium focus:outline-none py-0.5"
                    placeholder="New York, USA"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {formData.location || "Not added"}
                  </p>
                )}
              </div>
            </div>

            {/* Role / Job */}
            <div className="flex items-center gap-4 py-3">
              <div className="flex items-center justify-center text-primary">
                <Briefcase size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">
                  Occupation
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className="w-full bg-transparent border-b border-primary/50 text-sm font-medium focus:outline-none py-0.5"
                    placeholder="e.g. Developer"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {formData.role || "Not added"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Identity Card (Gender, DOB, Bio) */}
        <div className="bg-card border border-border rounded-3xl shadow-xl lg:shadow-none">
          <div className="px-6 py-4 border-b border-border bg-overlay rounded-t-3xl">
            <h3 className="font-bold text-foreground">Identity & Bio</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Gender */}
            <div className="space-y-2 pb-6 border-b border-border">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <Users size={14} className="text-primary" />
                Gender
              </label>
              {isEditing ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsGenderOpen(!isGenderOpen)}
                    className="w-full flex items-center justify-between bg-overlay border border-border rounded-xl px-4 py-3 text-sm font-medium cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    {formData.gender || "Select Gender"}
                    <ChevronDown size={16} />
                  </button>
                  {isGenderOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-background border border-border rounded-xl overflow-hidden z-[80] shadow-xl">
                      {["Male", "Female", "Other"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, gender: opt }));
                            setIsGenderOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-overlay text-sm font-medium transition-colors cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm font-medium text-foreground">
                  {formData.gender || "Not specified"}
                </p>
              )}
            </div>

            {/* DOB */}
            <div className="space-y-2 relative pb-6 border-b border-border">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                Date of Birth
              </label>
              {isEditing ? (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.dob}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({ ...prev, dob: value }));
                        // Try to parse and update selectedDate if valid
                        if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                          const parsedDate = new Date(value);
                          if (!isNaN(parsedDate.getTime())) {
                            setSelectedDate(parsedDate);
                            setCurrentDate(parsedDate);
                          }
                        }
                      }}
                      placeholder="YYYY-MM-DD"
                      className="w-full bg-overlay border border-border rounded-xl px-4 py-3 pr-10 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setIsDateOpen(!isDateOpen)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Calendar size={16} />
                    </button>
                  </div>
                  {/* Reusing existing calendar logic visually but simplified wrapper */}
                  {isDateOpen && (
                    <div className="absolute bottom-full left-0 w-full md:w-[320px] mb-2 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-[70] animate-scale-in p-4">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => changeMonth(-1)}
                          className="p-1 hover:bg-primary/10 dark:hover:bg-white/10 rounded-full cursor-pointer transition-colors"
                        >
                          <ChevronDown
                            className="rotate-90 text-foreground"
                            size={20}
                          />
                        </button>
                        <h4 className="font-bold text-foreground">
                          {MONTHS[currentDate.getMonth()]}{" "}
                          {currentDate.getFullYear()}
                        </h4>
                        <button
                          type="button"
                          onClick={() => changeMonth(1)}
                          className="p-1 hover:bg-primary/10 dark:hover:bg-white/10 rounded-full cursor-pointer transition-colors"
                        >
                          <ChevronDown
                            className="-rotate-90 text-foreground"
                            size={20}
                          />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <div
                            key={d}
                            className="text-center text-xs text-slate-500 dark:text-gray-400 font-bold py-1"
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {days.map((day, i) => (
                          <div key={i} className="aspect-square">
                            {day && (
                              <button
                                type="button"
                                onClick={() => handleDateSelect(day)}
                                className={cn(
                                  "w-full h-full rounded-full text-sm font-medium flex items-center justify-center hover:bg-primary/10 dark:hover:bg-white/10 cursor-pointer transition-all",
                                  selectedDate?.getDate() === day &&
                                    selectedDate?.getMonth() ===
                                      currentDate.getMonth()
                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                    : "text-slate-700 dark:text-gray-300",
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
                </>
              ) : (
                <p className="text-sm font-medium text-foreground">
                  {formData.dob || "Not specified"}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <FileText size={14} className="text-primary" />
                About Me
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full bg-overlay border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 min-h-[100px]"
                  placeholder="Write something about yourself..."
                />
              ) : (
                <p className="text-sm text-gray-400 leading-relaxed">
                  {formData.bio || "No bio yet."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button (Bottom Sticky) */}
        <div
          className={cn(
            "fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t border-black/5 dark:border-white/5 transition-transform duration-300 z-30 flex justify-center",
            isEditing ? "translate-y-0" : "translate-y-full",
          )}
        >
          <button
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className={cn(
              "w-full max-w-md text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95",
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-primary shadow-primary/20 hover:shadow-primary/30",
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dialogs */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />

      {/* Avatar Dialog (Reused from existing) */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          {/* ... Same dialog content as before ... */}
          <div className="bg-background border border-black/10 dark:border-white/10 w-full max-w-md rounded-3xl shadow-2xl animate-scale-in overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-black/5 dark:bg-white/5">
              <h3 className="text-lg font-bold text-foreground">
                Choose Profile Picture
              </h3>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "p-4 border-2 border-dashed border-white/10 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group flex flex-col items-center gap-2 text-center relative overflow-hidden",
                  selectedAvatar?.startsWith("data:image") &&
                    "border-primary/50 bg-primary/5",
                )}
              >
                {selectedAvatar || formData.image ? (
                  <div className="w-full space-y-3">
                    <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-primary shadow-lg shadow-primary/20">
                      <img
                        src={selectedAvatar || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">
                        Selected Image
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Click to change image
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        Upload from System
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Max size 3MB</p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-black/10 dark:border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  Or choose avatar
                </span>
                <div className="flex-grow border-t border-black/10 dark:border-white/10"></div>
              </div>
              <div className="space-y-4">
                <div className="flex p-1 bg-white/5 rounded-xl">
                  {["Male", "Female"].map((gender) => (
                    <button
                      key={gender}
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
                <div className="grid grid-cols-3 gap-4">
                  {filteredAvatars.map((avatar, i) => (
                    <button
                      key={i}
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
                        alt="Avatar"
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
            <div className="p-5 border-t border-black/5 dark:border-white/5 flex gap-3 bg-black/5 dark:bg-white/5">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors text-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAvatar}
                disabled={isLoading || !selectedAvatar}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : null}
                {isLoading ? "Saving..." : "Save Selected"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
