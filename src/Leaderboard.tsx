import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Link } from "react-router-dom";
import { ProfileImage } from "./ProfileImage";

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

export function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const leaderboard = useQuery(api.profiles.getLeaderboard, {
    category: selectedCategory === "all" ? undefined : selectedCategory,
    limit: 20,
  });

  if (!leaderboard) {
    return (
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 13 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
          Leaderboard
        </div>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
          Most hireable professionals
        </div>
        <div
          style={{
            display: "inline-block",
            border: "1px solid #888",
            padding: 2,
            background: "#f4f4f4",
          }}
        >
          {CATEGORIES.map((category, i) => (
            <a
              key={category.value}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory(category.value);
              }}
              style={{
                color: selectedCategory === category.value ? "#fff" : "#003399",
                background:
                  selectedCategory === category.value
                    ? "#003399"
                    : "transparent",
                border: "1px solid #888",
                padding: "2px 8px",
                textDecoration: "none",
                fontWeight:
                  selectedCategory === category.value ? "bold" : "normal",
                marginRight: i === CATEGORIES.length - 1 ? 0 : 2,
                fontSize: 13,
              }}
            >
              {category.label}
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "2px solid #888",
          overflowX: "auto",
        }}
      >
        <table
          style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#f4f4f4" }}>
            <tr>
              <th
                style={{
                  border: "1px solid #888",
                  padding: 6,
                  textAlign: "left",
                }}
              >
                #
              </th>
              <th
                style={{
                  border: "1px solid #888",
                  padding: 6,
                  textAlign: "left",
                }}
              >
                Profile
              </th>
              <th
                style={{
                  border: "1px solid #888",
                  padding: 6,
                  textAlign: "left",
                }}
              >
                Category
              </th>
              <th
                style={{
                  border: "1px solid #888",
                  padding: 6,
                  textAlign: "left",
                }}
              >
                Hireability Score
              </th>
              <th
                style={{
                  border: "1px solid #888",
                  padding: 6,
                  textAlign: "left",
                }}
              >
                Win%
              </th>
              <th
                style={{
                  border: "1px solid #888",
                  padding: 6,
                  textAlign: "left",
                }}
              >
                Votes
              </th>
              <th
                style={{
                  border: "1px solid #888",
                  padding: 6,
                  textAlign: "left",
                }}
              >
                Profile
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
                    borderTop: "1px solid #ccc",
                    background: index % 2 === 0 ? "#fff" : "#f8f8f8",
                  }}
                >
                  <td
                    style={{
                      border: "1px solid #888",
                      padding: 6,
                      fontWeight: "bold",
                      color:
                        index === 0
                          ? "#d4af37"
                          : index === 1
                            ? "#888"
                            : index === 2
                              ? "#b87333"
                              : "#222",
                    }}
                  >
                    {index + 1}
                    {index === 0 && " [1st]"}
                    {index === 1 && " [2nd]"}
                    {index === 2 && " [3rd]"}
                  </td>
                  <td style={{ border: "1px solid #888", padding: 6 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <ProfileImage profile={profile} size="small" />
                      <div>
                        <Link
                          to={`/profile/${profile._id}`}
                          style={{
                            fontWeight: "bold",
                            color: "#003399",
                            textDecoration: "none",
                          }}
                        >
                          {profile.name}
                        </Link>
                        <div style={{ fontSize: 11, color: "#666" }}>
                          {profile.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ border: "1px solid #888", padding: 6 }}>
                    <span
                      style={{
                        background: "#eee",
                        padding: "2px 6px",
                        fontSize: 11,
                      }}
                    >
                      {profile.category}
                    </span>
                  </td>
                  <td
                    style={{
                      border: "1px solid #888",
                      padding: 6,
                      fontWeight: "bold",
                    }}
                  >
                    {profile.score}
                  </td>
                  <td style={{ border: "1px solid #888", padding: 6 }}>
                    <div>{Math.round(winRate)}%</div>
                    <div style={{ fontSize: 11, color: "#888" }}>
                      {profile.wins}W/{profile.losses}L
                    </div>
                  </td>
                  <td style={{ border: "1px solid #888", padding: 6 }}>
                    {profile.totalVotes}
                  </td>
                  <td style={{ border: "1px solid #888", padding: 6 }}>
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#003399",
                        fontSize: 12,
                        textDecoration: "underline",
                      }}
                    >
                      LinkedIn
                    </a>
                    {" | "}
                    <Link
                      to={`/profile/${profile._id}`}
                      style={{
                        color: "#003399",
                        fontSize: 12,
                        textDecoration: "underline",
                      }}
                    >
                      Share
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {leaderboard.length === 0 && (
          <div style={{ textAlign: "center", padding: 24 }}>
            <span style={{ color: "#888", fontSize: 13 }}>
              No profiles found.{" "}
              <Link to="/submit" style={{ color: "#003399" }}>
                Submit one!
              </Link>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
