import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ProfileImage } from "./ProfileImage";
import type { Id } from "../convex/_generated/dataModel";

const SITE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://linkmash.vercel.app";

export function ProfilePage() {
  const { profileId } = useParams<{ profileId: string }>();
  const profile = useQuery(
    api.profiles.getProfileStats,
    profileId ? { profileId: profileId as Id<"profiles"> } : "skip",
  );

  if (profile === undefined) {
    return (
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 13 }}>Loading profile...</div>
      </div>
    );
  }

  if (profile === null) {
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
            Profile not found
          </div>
          <Link to="/" style={{ color: "#003399" }}>
            Go back to voting
          </Link>
        </div>
      </div>
    );
  }

  const profileUrl = `${SITE_URL}/profile/${profileId}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out ${profile.name}'s hireability score on LinkMash! Ranked #${profile.rank} with a ${profile.winRate}% win rate. Think you can beat them?`,
  )}&url=${encodeURIComponent(profileUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <div
        style={{ background: "#fff", border: "2px solid #888", padding: 18 }}
      >
        {/* Profile header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <ProfileImage profile={profile} size="large" />
          <div>
            <div style={{ fontWeight: "bold", fontSize: 18 }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 13, color: "#444" }}>{profile.title}</div>
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                background: "#e0eaff",
                color: "#003399",
                fontSize: 11,
                border: "1px solid #b0c4de",
                fontWeight: "bold",
                marginTop: 4,
              }}
            >
              {profile.category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div
            style={{
              background: "#f8f8f8",
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
              fontSize: 13,
              color: "#444",
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            "{profile.bio}"
          </div>
        )}

        {/* Rank badge */}
        <div
          style={{
            background:
              profile.rank === 1
                ? "#fff8dc"
                : profile.rank <= 3
                  ? "#f8f8f8"
                  : "#f4f4f4",
            border: `2px solid ${profile.rank === 1 ? "#d4af37" : profile.rank <= 3 ? "#888" : "#ccc"}`,
            padding: 16,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
            HIREABILITY RANK
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color:
                profile.rank === 1
                  ? "#d4af37"
                  : profile.rank === 2
                    ? "#888"
                    : profile.rank === 3
                      ? "#b87333"
                      : "#003399",
            }}
          >
            #{profile.rank}
          </div>
          <div style={{ fontSize: 24, fontWeight: "bold" }}>
            {profile.score}
          </div>
          <div style={{ fontSize: 11, color: "#666" }}>ELO SCORE</div>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#eaffea",
              border: "1px solid #b0deb0",
              textAlign: "center",
              padding: 8,
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: 18 }}>
              {profile.wins}
            </div>
            <div style={{ fontSize: 11, color: "#228822" }}>Wins</div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#ffeaea",
              border: "1px solid #deb0b0",
              textAlign: "center",
              padding: 8,
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: 18 }}>
              {profile.losses}
            </div>
            <div style={{ fontSize: 11, color: "#bb2222" }}>Losses</div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#eaf0ff",
              border: "1px solid #b0c4de",
              textAlign: "center",
              padding: 8,
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: 18 }}>
              {profile.winRate}%
            </div>
            <div style={{ fontSize: 11, color: "#2255bb" }}>Win Rate</div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#f4f4f4",
              border: "1px solid #ccc",
              textAlign: "center",
              padding: 8,
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: 18 }}>
              {profile.totalVotes}
            </div>
            <div style={{ fontSize: 11, color: "#666" }}>Total Votes</div>
          </div>
        </div>

        {/* LinkedIn link */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
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
            View LinkedIn Profile
          </a>
        </div>

        {/* Share buttons */}
        <div
          style={{
            borderTop: "1px solid #ccc",
            paddingTop: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: "bold",
              marginBottom: 8,
              color: "#444",
            }}
          >
            Share this profile:
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#000",
                color: "#fff",
                padding: "6px 16px",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: "bold",
                border: "1px solid #333",
              }}
            >
              Share on X
            </a>
            <a
              href={linkedinShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#0077b5",
                color: "#fff",
                padding: "6px 16px",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: "bold",
                border: "1px solid #005f8d",
              }}
            >
              Share on LinkedIn
            </a>
          </div>

          {/* Copy link */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(profileUrl);
              // Simple visual feedback
              const btn = document.getElementById("copy-btn");
              if (btn) {
                btn.textContent = "Copied!";
                setTimeout(() => {
                  btn.textContent = "Copy Profile Link";
                }, 2000);
              }
            }}
            id="copy-btn"
            style={{
              marginTop: 8,
              background: "#f4f4f4",
              color: "#003399",
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: "bold",
              border: "1px solid #888",
              cursor: "pointer",
            }}
          >
            Copy Profile Link
          </button>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          padding: 12,
          background: "#ffffcc",
          border: "1px solid #e6e600",
        }}
      >
        <div style={{ fontSize: 13, marginBottom: 8 }}>
          Think you're more hireable?
        </div>
        <Link
          to="/submit"
          style={{
            background: "#003399",
            color: "#fff",
            padding: "6px 16px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 13,
            border: "1px solid #888",
          }}
        >
          Submit Your Profile
        </Link>
      </div>
    </div>
  );
}
