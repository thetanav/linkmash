import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ProfileImage } from "./ProfileImage";
import type { Id } from "../convex/_generated/dataModel";
import {
  Trophy,
  TrendingUp,
  Users,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

const PLATFORM_URL =
  typeof window !== "undefined" ? window.location.origin : "";

export function ProfilePage() {
  const { profileId } = useParams<{ profileId: string }>();
  const [hasCopied, setHasCopied] = useState(false);

  const profileQuery = useQuery(
    api.profiles.getProfileStats,
    profileId ? { profileId: profileId as Id<"profiles"> } : "skip",
  );

  if (profileQuery === undefined) {
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
          Loading profile...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (profileQuery === null) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <div
          style={{
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 16,
            padding: 40,
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#fafafa",
              marginBottom: 12,
              fontFamily: "'Geist', sans-serif",
            }}
          >
            Profile not found
          </div>
          <Link
            to="/"
            style={{
              color: "#22c55e",
              textDecoration: "none",
              fontSize: 14,
              fontFamily: "'Geist', sans-serif",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ArrowLeft size={16} />
            Back to voting
          </Link>
        </div>
      </div>
    );
  }

  const profile = profileQuery;
  const profileUrl = `${PLATFORM_URL}/profile/${profileId}`;

  const shareText = `Check out ${profile.name}'s hireability on LinkMash! Ranked #${profile.rank} with ${profile.winRate}% win rate.`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const getRankGradient = (rank: number) => {
    if (rank === 1)
      return "linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(234, 179, 8, 0.05) 100%)";
    if (rank === 2)
      return "linear-gradient(135deg, rgba(148, 163, 184, 0.15) 0%, rgba(148, 163, 184, 0.05) 100%)";
    if (rank === 3)
      return "linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)";
    return "#18181b";
  };

  const getRankBorder = (rank: number) => {
    if (rank === 1) return "rgba(234, 179, 8, 0.3)";
    if (rank === 2) return "rgba(148, 163, 184, 0.3)";
    if (rank === 3) return "rgba(217, 119, 6, 0.3)";
    return "#27272a";
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#eab308";
    if (rank === 2) return "#94a3b8";
    if (rank === 3) return "#d97706";
    return "#fafafa";
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Back Link */}
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#71717a",
          textDecoration: "none",
          fontSize: 14,
          marginBottom: 24,
          fontFamily: "'Geist', sans-serif",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fafafa")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#71717a")}
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div
        style={{
          background: "#111113",
          border: "1px solid #27272a",
          borderRadius: 20,
          padding: 40,
        }}
      >
        {/* Profile Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <ProfileImage profile={profile} size="large" />
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "#fafafa",
                marginBottom: 6,
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {profile.name}
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#a1a1aa",
                marginBottom: 12,
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {profile.title}
            </p>
            <span
              style={{
                display: "inline-block",
                padding: "5px 14px",
                background: "#18181b",
                color: "#a1a1aa",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 20,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {profile.category}
            </span>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
              borderRadius: 12,
              padding: 18,
              marginBottom: 28,
              fontSize: 15,
              color: "#a1a1aa",
              lineHeight: 1.6,
              fontFamily: "'Geist', sans-serif",
            }}
          >
            "{profile.bio}"
          </div>
        )}

        {/* Rank Card */}
        <div
          style={{
            background: getRankGradient(profile.rank),
            border: `1px solid ${getRankBorder(profile.rank)}`,
            borderRadius: 16,
            padding: 28,
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Trophy size={20} color={getRankColor(profile.rank)} />
            <span
              style={{
                fontSize: 13,
                color: "#71717a",
                fontWeight: 500,
                fontFamily: "'Geist', sans-serif",
              }}
            >
              HIREABILITY RANK
            </span>
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: getRankColor(profile.rank),
              letterSpacing: -2,
              fontFamily: "'Geist', sans-serif",
            }}
          >
            #{profile.rank}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "#fafafa",
              marginTop: 4,
              fontFamily: "'Geist', sans-serif",
            }}
          >
            {profile.score}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#71717a",
              marginTop: 4,
              fontFamily: "'Geist', sans-serif",
            }}
          >
            ELO SCORE
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "18px 8px",
              background: "#18181b",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 6,
              }}
            >
              <TrendingUp size={18} color="#22c55e" />
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#22c55e",
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {profile.wins}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#71717a",
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              WINS
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "18px 8px",
              background: "#18181b",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 6,
              }}
            >
              <TrendingUp
                size={18}
                color="#ef4444"
                style={{ transform: "rotate(180deg)" }}
              />
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#ef444e",
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {profile.losses}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#71717a",
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              LOSSES
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "18px 8px",
              background: "#18181b",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 6,
              }}
            >
              <Users size={18} color="#3b82f6" />
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#fafafa",
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {profile.winRate}%
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#71717a",
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              WIN RATE
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "18px 8px",
              background: "#18181b",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 6,
              }}
            >
              <Share2 size={18} color="#a855f7" />
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#fafafa",
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {profile.totalVotes}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#71717a",
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              VOTES
            </div>
          </div>
        </div>

        {/* LinkedIn Link */}
        <a
          href={profile.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px",
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 10,
            fontSize: 14,
            color: "#a1a1aa",
            textDecoration: "none",
            marginBottom: 28,
            fontFamily: "'Geist', sans-serif",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#3f3f46";
            e.currentTarget.style.color = "#fafafa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#27272a";
            e.currentTarget.style.color = "#a1a1aa";
          }}
        >
          <ExternalLink size={16} />
          View LinkedIn Profile
        </a>

        {/* Share Section */}
        <div
          style={{
            borderTop: "1px solid #27272a",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 18,
              color: "#fafafa",
              fontFamily: "'Geist', sans-serif",
              textAlign: "center",
            }}
          >
            Share this profile
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "12px 20px",
                fontSize: 13,
                fontWeight: 500,
                color: "#fafafa",
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 8,
                textDecoration: "none",
                transition: "all 0.15s",
                fontFamily: "'Geist', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#27272a";
                e.currentTarget.style.borderColor = "#3f3f46";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#18181b";
                e.currentTarget.style.borderColor = "#27272a";
              }}
            >
              Share on X
            </a>
            <a
              href={linkedinShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "12px 20px",
                fontSize: 13,
                fontWeight: 500,
                color: "#fafafa",
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 8,
                textDecoration: "none",
                transition: "all 0.15s",
                fontFamily: "'Geist', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#27272a";
                e.currentTarget.style.borderColor = "#3f3f46";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#18181b";
                e.currentTarget.style.borderColor = "#27272a";
              }}
            >
              Share on LinkedIn
            </a>
          </div>

          <button
            onClick={handleCopyLink}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: 13,
              fontWeight: 500,
              color: hasCopied ? "#22c55e" : "#71717a",
              background: "transparent",
              border: `1px solid ${hasCopied ? "#22c55e" : "#27272a"}`,
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "'Geist', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              if (!hasCopied) {
                e.currentTarget.style.borderColor = "#3f3f46";
                e.currentTarget.style.color = "#fafafa";
              }
            }}
            onMouseLeave={(e) => {
              if (!hasCopied) {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.color = "#71717a";
              }
            }}
          >
            {hasCopied ? <Check size={16} /> : <Copy size={16} />}
            {hasCopied ? "Copied!" : "Copy Profile Link"}
          </button>
        </div>
      </div>

      {/* CTA Card */}
      <div
        style={{
          marginTop: 24,
          padding: 28,
          background:
            "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 15,
            color: "#a1a1aa",
            marginBottom: 16,
            fontFamily: "'Geist', sans-serif",
          }}
        >
          Think you're more hireable?
        </div>
        <Link
          to="/submit"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 28px",
            background: "#fafafa",
            color: "#09090b",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            borderRadius: 10,
            transition: "all 0.15s",
            fontFamily: "'Geist', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e4e4e7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fafafa";
          }}
        >
          Submit Your Profile
        </Link>
      </div>
    </div>
  );
}
