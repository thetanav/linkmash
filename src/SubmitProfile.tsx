import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
      toast.error("Fill in all fields");
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

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <div
        style={{ background: "#fff", border: "2px solid #888", padding: 18 }}
      >
        <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 6 }}>
          Submit Profile
        </div>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
          Add your LinkedIn profile to the voting pool. Only one profile per
          LinkedIn URL is allowed.
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: "bold", fontSize: 13 }}>
              LinkedIn URL *
            </label>
            <br />
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              style={{
                width: "100%",
                padding: 4,
                border: "1px solid #888",
                fontSize: 13,
                boxSizing: "border-box",
              }}
              required
            />
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
              Your profile photo will be automatically fetched from LinkedIn
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: "bold", fontSize: 13 }}>
              Full Name *
            </label>
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              style={{
                width: "100%",
                padding: 4,
                border: "1px solid #888",
                fontSize: 13,
                boxSizing: "border-box",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: "bold", fontSize: 13 }}>
              Job Title *
            </label>
            <br />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Senior Software Engineer at Google"
              style={{
                width: "100%",
                padding: 4,
                border: "1px solid #888",
                fontSize: 13,
                boxSizing: "border-box",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: "bold", fontSize: 13 }}>
              Category *
            </label>
            <br />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: 4,
                border: "1px solid #888",
                fontSize: 13,
                boxSizing: "border-box",
              }}
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: "bold", fontSize: 13 }}>
              Bio{" "}
              <span style={{ fontWeight: "normal", color: "#888" }}>
                (optional, max 200 chars)
              </span>
            </label>
            <br />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 200))}
              placeholder="Building the future of AI at OpenAI. Ex-Google, Stanford CS '22. Open source enthusiast."
              rows={3}
              style={{
                width: "100%",
                padding: 4,
                border: "1px solid #888",
                fontSize: 13,
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
            <div style={{ fontSize: 11, color: "#888", textAlign: "right" }}>
              {bio.length}/200
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: "bold", fontSize: 13 }}>
              Custom Profile Image URL{" "}
              <span style={{ fontWeight: "normal", color: "#888" }}>
                (optional -- auto-fetched from LinkedIn)
              </span>
            </label>
            <br />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              style={{
                width: "100%",
                padding: 4,
                border: "1px solid #888",
                fontSize: 13,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                background: "#ffffe0",
                border: "1px solid #e6e600",
                padding: 8,
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 2 }}>
                Important:
              </div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                <li>Profile will be shown publicly</li>
                <li>Only submit profiles you own</li>
                <li>One profile per LinkedIn URL</li>
                <li>Voting is anonymous</li>
              </ul>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              background: "#003399",
              color: "#fff",
              padding: "8px 0",
              fontWeight: "bold",
              border: "1px solid #888",
              fontSize: 14,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Submitting..." : "SUBMIT PROFILE"}
          </button>
        </form>
      </div>
    </div>
  );
}
