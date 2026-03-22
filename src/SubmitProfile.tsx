import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Link2,
  User,
  Briefcase,
  Tag,
  FileText,
  Image,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const CATEGORIES = [
  { value: "developer", label: "Developer" },
  { value: "founder", label: "Founder" },
  { value: "designer", label: "Designer" },
  { value: "pm", label: "Product Manager" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "other", label: "Other" },
];

interface ValidationError {
  field: string;
  message: string;
}

interface FormData {
  linkedinUrl: string;
  name: string;
  title: string;
  category: string;
  bio: string;
  imageUrl: string;
}

interface FormErrors {
  linkedinUrl?: string;
  name?: string;
  title?: string;
  category?: string;
  bio?: string;
  imageUrl?: string;
}

const validateLinkedInUrl = (url: string): boolean => {
  if (!url) return false;
  const linkedinRegex =
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
  return linkedinRegex.test(url.trim());
};

const validateImageUrl = (url: string): boolean => {
  if (!url) return true; // Optional field
  const urlRegex = /^https?:\/\/.+/i;
  return urlRegex.test(url.trim());
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

export function SubmitProfile() {
  const [formData, setFormData] = useState<FormData>({
    linkedinUrl: "",
    name: "",
    title: "",
    category: "",
    bio: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitProfile = useMutation(api.profiles.submitProfile);
  const navigate = useNavigate();

  const validateField = (
    field: keyof FormData,
    value: string,
  ): string | undefined => {
    switch (field) {
      case "linkedinUrl":
        if (!value.trim()) return "LinkedIn URL is required";
        if (!validateLinkedInUrl(value)) {
          return "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)";
        }
        return undefined;

      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        if (value.trim().length > 100)
          return "Name must be less than 100 characters";
        return undefined;

      case "title":
        if (!value.trim()) return "Job title is required";
        if (value.trim().length < 2)
          return "Job title must be at least 2 characters";
        if (value.trim().length > 150)
          return "Job title must be less than 150 characters";
        return undefined;

      case "category":
        if (!value) return "Please select a category";
        return undefined;

      case "bio":
        if (value.length > 200) return "Bio must be less than 200 characters";
        return undefined;

      case "imageUrl":
        if (value && !validateImageUrl(value)) {
          return "Please enter a valid image URL (must start with http:// or https://)";
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    const sanitizedValue = field === "bio" ? value : sanitizeInput(value);

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));

    // Validate on change if field has been touched
    if (touched[field]) {
      const error = validateField(field, sanitizedValue);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      linkedinUrl: true,
      name: true,
      title: true,
      category: true,
      bio: true,
      imageUrl: true,
    });

    if (!validateForm()) {
      const errorCount = Object.keys(errors).length;
      toast.error(
        errorCount > 0
          ? `Please fix ${errorCount} error${errorCount > 1 ? "s" : ""} before submitting`
          : "Please fill in all required fields correctly",
        { icon: <AlertCircle size={16} color="#ef4444" /> },
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitProfile({
        linkedinUrl: formData.linkedinUrl.trim(),
        name: formData.name.trim(),
        title: formData.title.trim(),
        category: formData.category,
        bio: formData.bio.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
      });

      if (result.alreadyExists) {
        toast.info(
          "This LinkedIn profile already exists! Redirecting to it...",
          {
            duration: 3000,
          },
        );
      } else {
        toast.success(
          "Profile submitted successfully! Share your profile to get votes.",
          {
            duration: 4000,
            icon: <CheckCircle size={16} color="#22c55e" />,
          },
        );
      }

      navigate(`/profile/${result.profileId}`);
    } catch (error) {
      let errorMessage = "Failed to submit profile. Please try again.";

      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes("linkedin") || message.includes("url")) {
          errorMessage = "Invalid LinkedIn URL. Please check and try again.";
          setErrors((prev) => ({ ...prev, linkedinUrl: errorMessage }));
        } else if (message.includes("name")) {
          errorMessage = "Invalid name. Please check and try again.";
          setErrors((prev) => ({ ...prev, name: errorMessage }));
        } else if (message.includes("title")) {
          errorMessage = "Invalid job title. Please check and try again.";
          setErrors((prev) => ({ ...prev, title: errorMessage }));
        } else if (message.includes("rate") || message.includes("too fast")) {
          errorMessage = "You're submitting too fast. Please wait a moment.";
        } else if (message.includes("image")) {
          errorMessage = "Invalid image URL. Please check and try again.";
          setErrors((prev) => ({ ...prev, imageUrl: errorMessage }));
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage, {
        duration: 5000,
        icon: <AlertCircle size={16} color="#ef4444" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (fieldName: keyof FormData): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px 14px 44px",
    background: "#18181b",
    border: `1px solid ${errors[fieldName] && touched[fieldName] ? "#ef4444" : "#27272a"}`,
    borderRadius: 10,
    fontSize: 15,
    color: "#fafafa",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "'Geist', sans-serif",
  });

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#a1a1aa",
    marginBottom: 10,
    fontFamily: "'Geist', sans-serif",
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div
        style={{
          background: "#111113",
          border: "1px solid #27272a",
          borderRadius: 20,
          padding: 40,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <UserPlus size={32} color="#09090b" />
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#fafafa",
              marginBottom: 8,
              fontFamily: "'Geist', sans-serif",
            }}
          >
            Submit Profile
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#71717a",
              fontFamily: "'Geist', sans-serif",
            }}
          >
            Add your LinkedIn profile to the voting pool
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* LinkedIn URL */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              <Link2 size={16} />
              LinkedIn URL
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                onBlur={() => handleBlur("linkedinUrl")}
                placeholder="https://linkedin.com/in/yourprofile"
                style={inputStyle("linkedinUrl")}
                onFocus={(e) => {
                  if (!errors.linkedinUrl) {
                    e.currentTarget.style.borderColor = "#52525b";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(82, 82, 91, 0.2)";
                  }
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = errors.linkedinUrl
                    ? "#ef4444"
                    : "#27272a";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            {errors.linkedinUrl && touched.linkedinUrl && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  fontSize: 13,
                  color: "#ef4444",
                  fontFamily: "'Geist', sans-serif",
                }}
              >
                <AlertCircle size={14} />
                {errors.linkedinUrl}
              </div>
            )}
          </div>

          {/* Name */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              <User size={16} />
              Full Name
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="John Doe"
                style={inputStyle("name")}
                onFocus={(e) => {
                  if (!errors.name) {
                    e.currentTarget.style.borderColor = "#52525b";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(82, 82, 91, 0.2)";
                  }
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = errors.name
                    ? "#ef4444"
                    : "#27272a";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            {errors.name && touched.name && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  fontSize: 13,
                  color: "#ef4444",
                  fontFamily: "'Geist', sans-serif",
                }}
              >
                <AlertCircle size={14} />
                {errors.name}
              </div>
            )}
          </div>

          {/* Job Title */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              <Briefcase size={16} />
              Job Title
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                onBlur={() => handleBlur("title")}
                placeholder="Senior Software Engineer at Google"
                style={inputStyle("title")}
                onFocus={(e) => {
                  if (!errors.title) {
                    e.currentTarget.style.borderColor = "#52525b";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(82, 82, 91, 0.2)";
                  }
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = errors.title
                    ? "#ef4444"
                    : "#27272a";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            {errors.title && touched.title && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  fontSize: 13,
                  color: "#ef4444",
                  fontFamily: "'Geist', sans-serif",
                }}
              >
                <AlertCircle size={14} />
                {errors.title}
              </div>
            )}
          </div>

          {/* Category */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              <Tag size={16} />
              Category
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              onBlur={() => handleBlur("category")}
              style={{
                ...inputStyle("category"),
                padding: "14px 16px",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
              }}
              onFocus={(e) => {
                if (!errors.category) {
                  e.currentTarget.style.borderColor = "#52525b";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(82, 82, 91, 0.2)";
                }
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.borderColor = errors.category
                  ? "#ef4444"
                  : "#27272a";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <option value="" style={{ background: "#18181b" }}>
                Select a category
              </option>
              {CATEGORIES.map((cat) => (
                <option
                  key={cat.value}
                  value={cat.value}
                  style={{ background: "#18181b" }}
                >
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && touched.category && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  fontSize: 13,
                  color: "#ef4444",
                  fontFamily: "'Geist', sans-serif",
                }}
              >
                <AlertCircle size={14} />
                {errors.category}
              </div>
            )}
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              <FileText size={16} />
              Bio
              <span style={{ fontWeight: 400, color: "#71717a" }}>
                (optional, max 200 chars)
              </span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              onBlur={() => handleBlur("bio")}
              placeholder="Building the future of AI at OpenAI. Ex-Google, Stanford CS '22."
              rows={3}
              style={{
                ...inputStyle("bio"),
                padding: "14px 16px",
                resize: "vertical",
                minHeight: 100,
              }}
              onFocus={(e) => {
                if (!errors.bio) {
                  e.currentTarget.style.borderColor = "#52525b";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(82, 82, 91, 0.2)";
                }
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.borderColor = errors.bio
                  ? "#ef4444"
                  : "#27272a";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              {errors.bio && touched.bio && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "#ef4444",
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  <AlertCircle size={14} />
                  {errors.bio}
                </div>
              )}
              <div
                style={{
                  fontSize: 12,
                  color: formData.bio.length > 200 ? "#ef4444" : "#52525b",
                  textAlign: "right",
                  fontFamily: "'Geist', sans-serif",
                  marginLeft: "auto",
                }}
              >
                {formData.bio.length}/200
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>
              <Image size={16} />
              Profile Image URL
              <span style={{ fontWeight: 400, color: "#71717a" }}>
                (optional)
              </span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                onBlur={() => handleBlur("imageUrl")}
                placeholder="https://example.com/your-photo.jpg"
                style={inputStyle("imageUrl")}
                onFocus={(e) => {
                  if (!errors.imageUrl) {
                    e.currentTarget.style.borderColor = "#52525b";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(82, 82, 91, 0.2)";
                  }
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = errors.imageUrl
                    ? "#ef4444"
                    : "#27272a";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            {errors.imageUrl && touched.imageUrl && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  fontSize: 13,
                  color: "#ef4444",
                  fontFamily: "'Geist', sans-serif",
                }}
              >
                <AlertCircle size={14} />
                {errors.imageUrl}
              </div>
            )}
            <div
              style={{
                fontSize: 12,
                color: "#52525b",
                marginTop: 8,
                fontFamily: "'Geist', sans-serif",
              }}
            >
              Provide a direct URL to your profile image. If not provided,
              initials will be displayed.
            </div>
          </div>

          {/* Guidelines */}
          <div
            style={{
              marginBottom: 28,
              padding: 20,
              background: "#18181b",
              border: "1px solid #27272a",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 600,
                color: "#fafafa",
                marginBottom: 14,
                fontFamily: "'Geist', sans-serif",
                fontSize: 14,
              }}
            >
              <CheckCircle size={16} color="#22c55e" />
              Guidelines
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 20,
                color: "#71717a",
                lineHeight: 1.8,
                fontSize: 13,
                fontFamily: "'Geist', sans-serif",
              }}
            >
              <li>Profile will be shown publicly</li>
              <li>Only submit profiles you own</li>
              <li>One profile per LinkedIn URL</li>
              <li>Voting is completely anonymous</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "16px 0",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "#09090b",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              borderRadius: 10,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              opacity: isSubmitting ? 0.6 : 1,
              fontFamily: "'Geist', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.filter = "brightness(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.filter = "brightness(1)";
              }
            }}
          >
            {isSubmitting ? (
              <>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: "2px solid #09090b",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Submitting...
              </>
            ) : (
              "Submit Profile"
            )}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
