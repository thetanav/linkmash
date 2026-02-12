import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Link } from "react-router-dom";
import { ProfileImage } from "./ProfileImage";
import { Trophy, Medal, Award } from "lucide-react";

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

const getRankIcon = (index: number) => {
  if (index === 0) return <Trophy size={18} color="#eab308" />;
  if (index === 1) return <Medal size={18} color="#94a3b8" />;
  if (index === 2) return <Award size={18} color="#d97706" />;
  return null;
};

const getRankColor = (index: number) => {
  if (index === 0) return "#eab308";
  if (index === 1) return "#94a3b8";
  if (index === 2) return "#d97706";
  return "#a1a1aa";
};

export function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const leaderboard = useQuery(api.profiles.getLeaderboard, {
    category: selectedCategory === "all" ? undefined : selectedCategory,
    limit: 20,
  });

  if (!leaderboard) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "2px solid #27272a",
            borderTopColor: "#22c55e",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: "#71717a", fontFamily: "'Geist', sans-serif" }}>
          Loading leaderboard...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Trophy size={32} color="#eab308" />
          <h1
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "#fafafa",
              letterSpacing: -1,
              fontFamily: "'Geist', sans-serif",
            }}
          >
            Leaderboard
          </h1>
        </div>
        <p
          style={{
            fontSize: 16,
            color: "#71717a",
            marginBottom: 28,
            fontFamily: "'Geist', sans-serif",
          }}
        >
          Most hireable professionals
        </p>
        <div
          style={{
            display: "inline-flex",
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 10,
            padding: 4,
          }}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 500,
                color:
                  selectedCategory === category.value ? "#09090b" : "#71717a",
                background:
                  selectedCategory === category.value
                    ? "#fafafa"
                    : "transparent",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#111113",
          border: "1px solid #27272a",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #27272a" }}>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: 500,
                    color: "#71717a",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  Rank
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: 500,
                    color: "#71717a",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  Profile
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: 500,
                    color: "#71717a",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: 500,
                    color: "#71717a",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  Score
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: 500,
                    color: "#71717a",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  Win Rate
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: 500,
                    color: "#71717a",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  Votes
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: 500,
                    color: "#71717a",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  Links
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((profile, index) => {
                const winRate =
                  profile.totalVotes > 0
                    ? (profile.wins / profile.totalVotes) * 100
                    : 0;
                return (
                  <tr
                    key={profile._id}
                    style={{
                      borderBottom: "1px solid #27272a",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#18181b";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "18px 20px",
                        fontWeight: 600,
                        color: getRankColor(index),
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {getRankIcon(index)}
                        <span>{index + 1}</span>
                      </div>
                    </td>
                    <td style={{ padding: "18px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        <ProfileImage profile={profile} size="small" />
                        <div>
                          <Link
                            to={`/profile/${profile._id}`}
                            style={{
                              fontWeight: 500,
                              color: "#fafafa",
                              textDecoration: "none",
                              fontSize: 15,
                              fontFamily: "'Geist', sans-serif",
                            }}
                          >
                            {profile.name}
                          </Link>
                          <div
                            style={{
                              fontSize: 13,
                              color: "#71717a",
                              marginTop: 2,
                              fontFamily: "'Geist', sans-serif",
                            }}
                          >
                            {profile.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "18px 20px" }}>
                      <span
                        style={{
                          padding: "5px 12px",
                          background: "#18181b",
                          color: "#a1a1aa",
                          fontSize: 11,
                          fontWeight: 600,
                          borderRadius: 20,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          fontFamily: "'Geist', sans-serif",
                        }}
                      >
                        {profile.category}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "18px 20px",
                        fontWeight: 600,
                        color: "#fafafa",
                        fontSize: 16,
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      {profile.score}
                    </td>
                    <td style={{ padding: "18px 20px" }}>
                      <div
                        style={{
                          color: "#fafafa",
                          fontWeight: 500,
                          fontSize: 15,
                          fontFamily: "'Geist', sans-serif",
                        }}
                      >
                        {Math.round(winRate)}%
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#71717a",
                          marginTop: 2,
                          fontFamily: "'Geist', sans-serif",
                        }}
                      >
                        {profile.wins}W / {profile.losses}L
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "18px 20px",
                        color: "#a1a1aa",
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      {profile.totalVotes}
                    </td>
                    <td style={{ padding: "18px 20px" }}>
                      <div style={{ display: "flex", gap: 14 }}>
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 13,
                            color: "#71717a",
                            textDecoration: "none",
                            transition: "color 0.15s",
                            fontFamily: "'Geist', sans-serif",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#fafafa";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#71717a";
                          }}
                        >
                          LinkedIn
                        </a>
                        <Link
                          to={`/profile/${profile._id}`}
                          style={{
                            fontSize: 13,
                            color: "#71717a",
                            textDecoration: "none",
                            transition: "color 0.15s",
                            fontFamily: "'Geist', sans-serif",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#fafafa";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#71717a";
                          }}
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {leaderboard.length === 0 && (
          <div style={{ textAlign: "center", padding: 60 }}>
            <span
              style={{
                color: "#71717a",
                fontSize: 15,
                fontFamily: "'Geist', sans-serif",
              }}
            >
              No profiles found.{" "}
              <Link
                to="/submit"
                style={{
                  color: "#fafafa",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Submit one!
              </Link>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
