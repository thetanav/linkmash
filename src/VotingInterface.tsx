import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "developer", label: "Dev" },
  { value: "founder", label: "Founder" },
  { value: "designer", label: "Design" },
  { value: "pm", label: "PM" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "other", label: "Other" },
];

function ProfileImage({ profile }: { profile: any }) {
  const [imageError, setImageError] = useState(false);
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  if (imageError || !profile.imageUrl) {
    return (
      <div
        style={{
          width: 64,
          height: 64,
          background: "#ccc",
          border: "1px solid #888",
          textAlign: "center",
          lineHeight: "64px",
          fontWeight: "bold",
          fontSize: 20,
          margin: "0 auto 8px auto",
        }}
      >
        {getInitials(profile.name)}
      </div>
    );
  }
  return (
    <div
      style={{
        width: 64,
        height: 64,
        overflow: "hidden",
        border: "1px solid #888",
        margin: "0 auto 8px auto",
      }}
    >
      <img
        src={profile.imageUrl}
        alt={profile.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={() => setImageError(true)}
      />
    </div>
  );
}

export function VotingInterface() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isVoting, setIsVoting] = useState(false);
  const matchup = useQuery(api.profiles.getRandomMatchup, {
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });
  const submitVote = useMutation(api.profiles.submitVote);
  const handleVote = async (winnerId: string, loserId: string) => {
    if (!matchup) return;
    setIsVoting(true);
    try {
      await submitVote({
        winnerProfileId: winnerId as any,
        loserProfileId: loserId as any,
        category: selectedCategory,
      });
      toast.success("Vote recorded!");
    } catch (error) {
      toast.error("Failed to record vote");
    } finally {
      setIsVoting(false);
    }
  };

  if (!matchup) {
    return (
      <div style={{ textAlign: "center", padding: 32 }}>
        <div
          style={{
            background: "#fff",
            border: "2px solid #888",
            padding: 24,
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            Loading...
          </div>
          <div style={{ fontSize: 13, color: "#666" }}>
            Not enough profiles in this category. Submit some first!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 4 }}>
          Who's More Hireable?
        </div>
        <div style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>
          Choose the candidate you'd rather hire
        </div>
      </div>
      {/* Voting Interface */}
      <table
        width="100%"
        cellPadding={8}
        cellSpacing={0}
        style={{
          maxWidth: 700,
          margin: "0 auto",
          borderCollapse: "separate",
          borderSpacing: 16,
        }}
      >
        <tbody>
          <tr>
            {[matchup.profile1, matchup.profile2].map((profile, idx) => (
              <td
                key={profile._id}
                style={{
                  background: "#fff",
                  border: "2px solid #888",
                  verticalAlign: "top",
                  width: "50%",
                }}
              >
                <ProfileImage profile={profile} />
                <div style={{ textAlign: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: "bold", fontSize: 15 }}>
                    {profile.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#444", marginBottom: 4 }}>
                    {profile.title}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      background: "#e0eaff",
                      color: "#003399",
                      fontSize: 11,
                      border: "1px solid #b0c4de",
                      fontWeight: "bold",
                    }}
                  >
                    {profile.category.toUpperCase()}
                  </span>
                </div>
                <div
                  style={{
                    background: "#f4f4f4",
                    border: "1px solid #ccc",
                    padding: 8,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: 18 }}>
                    {profile.score}
                  </div>
                  <div style={{ fontSize: 11, color: "#666" }}>ELO RATING</div>
                </div>
                <table width="100%" style={{ marginBottom: 8, fontSize: 12 }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          background: "#eaffea",
                          border: "1px solid #b0deb0",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {profile.wins}
                        <br />
                        <span
                          style={{ color: "#228822", fontWeight: "normal" }}
                        >
                          Wins
                        </span>
                      </td>
                      <td
                        style={{
                          background: "#ffeaea",
                          border: "1px solid #deb0b0",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {profile.losses}
                        <br />
                        <span
                          style={{ color: "#bb2222", fontWeight: "normal" }}
                        >
                          Losses
                        </span>
                      </td>
                      <td
                        style={{
                          background: "#eaf0ff",
                          border: "1px solid #b0c4de",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {profile.totalVotes}
                        <br />
                        <span
                          style={{ color: "#2255bb", fontWeight: "normal" }}
                        >
                          Total
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  onClick={() =>
                    handleVote(
                      profile._id,
                      idx === 0 ? matchup.profile2._id : matchup.profile1._id,
                    )
                  }
                  disabled={isVoting}
                  style={{
                    width: "100%",
                    background: "#228822",
                    color: "#fff",
                    padding: "8px 0",
                    fontWeight: "bold",
                    border: "1px solid #888",
                    fontSize: 14,
                    cursor: isVoting ? "not-allowed" : "pointer",
                    marginBottom: 6,
                  }}
                >
                  {isVoting ? "VOTING..." : "🏆 MORE HIREABLE"}
                </button>
                <div style={{ textAlign: "center", marginTop: 4 }}>
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#003399",
                      fontSize: 13,
                      textDecoration: "underline",
                    }}
                  >
                    📎 View LinkedIn Profile →
                  </a>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
