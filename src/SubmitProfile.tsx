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

export function SubmitProfile() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitProfile = useMutation(api.profiles.submitProfile);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl || !name || !title || !category) {
      toast.error("Fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await submitProfile({
        linkedinUrl,
        name,
        title,
        category,
        bio: bio || undefined,
        imageUrl: imageUrl || undefined,
      });

      if (result.alreadyExists) {
        toast.info(
          "This LinkedIn profile already exists! Redirecting to it...",
        );
      } else {
        toast.success(
          "Profile submitted! Share your profile page to get votes.",
        );
      }

      navigate(`/profile/${result.profileId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px 14px 44px",
    background: "#18181b",
    border: "1px solid #27272a",
    borderRadius: 10,
    fontSize: 15,
    color: "#fafafa",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "'Geist', sans-serif",
  };

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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              <Link2 size={16} />
              LinkedIn URL
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#52525b";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(82, 82, 91, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#27272a";
                  e.currentTarget.style.boxShadow = "none";
                }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              <User size={16} />
              Full Name
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#52525b";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(82, 82, 91, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#27272a";
                  e.currentTarget.style.boxShadow = "none";
                }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              <Briefcase size={16} />
              Job Title
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Software Engineer at Google"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#52525b";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(82, 82, 91, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#27272a";
                  e.currentTarget.style.boxShadow = "none";
                }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              <Tag size={16} />
              Category
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                ...inputStyle,
                padding: "14px 16px",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#52525b";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(82, 82, 91, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.boxShadow = "none";
              }}
              required
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
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              <FileText size={16} />
              Bio
              <span style={{ fontWeight: 400, color: "#71717a" }}>
                (optional, max 200 chars)
              </span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 200))}
              placeholder="Building the future of AI at OpenAI. Ex-Google, Stanford CS '22."
              rows={3}
              style={{
                ...inputStyle,
                padding: "14px 16px",
                resize: "vertical",
                minHeight: 100,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#52525b";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(82, 82, 91, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <div
              style={{
                fontSize: 12,
                color: "#52525b",
                textAlign: "right",
                marginTop: 6,
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {bio.length}/200
            </div>
          </div>

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
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#52525b";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(82, 82, 91, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#27272a";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
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
            {isSubmitting ? "Submitting..." : "Submit Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
