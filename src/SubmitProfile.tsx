import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitProfile = useMutation(api.profiles.submitProfile);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl || !name || !title || !category) {
      toast.error("Fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitProfile({ linkedinUrl, name, title, category });
      toast.success("Profile submitted!");
      setLinkedinUrl(""); setName(""); setTitle(""); setCategory("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ background: '#fff', border: '2px solid #888', padding: 18 }}>
        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>Submit Profile</div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Add your LinkedIn profile to the voting pool.</div>
        <form onSubmit={handleSubmit}>
          <table style={{ width: '100%', fontSize: 13 }}>
            <tbody>
              <tr>
                <td style={{ paddingBottom: 8 }}>
                  <label style={{ fontWeight: 'bold', fontSize: 13 }}>LinkedIn URL *</label><br />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    style={{ width: '100%', padding: 4, border: '1px solid #888', fontSize: 13 }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: 8 }}>
                  <label style={{ fontWeight: 'bold', fontSize: 13 }}>Full Name *</label><br />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    style={{ width: '100%', padding: 4, border: '1px solid #888', fontSize: 13 }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: 8 }}>
                  <label style={{ fontWeight: 'bold', fontSize: 13 }}>Job Title *</label><br />
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Senior Software Engineer at Google"
                    style={{ width: '100%', padding: 4, border: '1px solid #888', fontSize: 13 }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: 8 }}>
                  <label style={{ fontWeight: 'bold', fontSize: 13 }}>Category *</label><br />
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ width: '100%', padding: 4, border: '1px solid #888', fontSize: 13 }}
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: 8 }}>
                  <div style={{ background: '#ffffe0', border: '1px solid #e6e600', padding: 8, fontSize: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 2 }}>Important:</div>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      <li>• Profile will be shown publicly</li>
                      <li>• Only submit profiles you own</li>
                      <li>• Voting is anonymous</li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ width: '100%', background: '#003399', color: '#fff', padding: '8px 0', fontWeight: 'bold', border: '1px solid #888', fontSize: 14, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    {isSubmitting ? "Submitting..." : "SUBMIT PROFILE"}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}
