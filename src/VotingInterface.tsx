import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ProfileImage } from "./ProfileImage";
import { Trophy, Users, TrendingUp, RefreshCw, ArrowRight } from "lucide-react";

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

type VoteResult = {
  success: boolean;
  winnerNewScore: number;
  loserNewScore: number;
  winnerWinRate: number;
  loserWinRate: number;
  agreementPct: number;
  totalMatchupVotes: number;
};

type Profile = {
  _id: string;
  name: string;
  title: string;
  category: string;
  bio?: string;
  score: number;
  wins: number;
  losses: number;
  totalVotes: number;
  linkedinUrl: string;
  imageUrl?: string;
  username: string;
};

type Matchup = {
  profile1: Profile;
  profile2: Profile;
};

function ShareButtons({
  profile1,
  profile2,
}: {
  profile1: string;
  profile2: string;
}) {
  const text = `I just voted on LinkMash — who's more hireable? ${profile1} vs ${profile2}. Cast your vote!`;
  const url = typeof window !== "undefined" ? window.location.origin : "";

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        justifyContent: "center",
        marginTop: 24,
      }}
    >
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "10px 20px",
          fontSize: 13,
          fontWeight: 500,
          color: "#fafafa",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: 8,
          textDecoration: "none",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
          gap: 8,
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
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "10px 20px",
          fontSize: 13,
          fontWeight: 500,
          color: "#fafafa",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: 8,
          textDecoration: "none",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
          gap: 8,
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
  );
}

export function VotingInterface() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isVoting, setIsVoting] = useState(false);
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);
  const [matchup, setMatchup] = useState<Matchup | null>(null);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [voteCount, setVoteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const getRandomMatchup = useMutation(api.profiles.getRandomMatchup);
  const submitVote = useMutation(api.profiles.submitVote);

  const fetchMatchup = useCallback(async () => {
    setLoading(true);
    setVoteResult(null);
    setWinnerId(null);
    try {
      const result = await getRandomMatchup({
        category: selectedCategory === "all" ? undefined : selectedCategory,
      });
      setMatchup(result as Matchup | null);
    } catch {
      toast.error("Failed to load matchup");
    } finally {
      setLoading(false);
    }
  }, [getRandomMatchup, selectedCategory]);

  // Fetch matchup on mount and category change
  useState(() => {
    fetchMatchup();
  });

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setLoading(true);
    setVoteResult(null);
    setWinnerId(null);
    getRandomMatchup({
      category: cat === "all" ? undefined : cat,
    }).then((result) => {
      setMatchup(result as Matchup | null);
      setLoading(false);
    });
  };

  const handleVote = async (winId: string, loseId: string) => {
    if (!matchup) return;
    setIsVoting(true);
    setWinnerId(winId);
    try {
      const result = await submitVote({
        winnerProfileId: winId as any,
        loserProfileId: loseId as any,
        category: selectedCategory,
      });
      setVoteResult(result);
      setVoteCount((c) => c + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to record vote",
      );
      setWinnerId(null);
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 500,
          gap: 20,
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
          Loading matchup...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!matchup) {
    return (
      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          textAlign: "center",
          padding: "60px 24px",
        }}
      >
        <div
          style={{
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 16,
            padding: 48,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: "#18181b",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Users size={32} color="#71717a" />
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#fafafa",
              marginBottom: 12,
              fontFamily: "'Geist', sans-serif",
            }}
          >
            Not enough profiles
          </div>
          <div
            style={{
              fontSize: 15,
              color: "#71717a",
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            We need at least 2 profiles to start voting. Be the first to submit!
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
              fontWeight: 500,
              textDecoration: "none",
              borderRadius: 8,
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
            Submit a Profile
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Title + Category Filter */}
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
            Who's More Hireable?
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
          Choose the candidate you'd rather hire
        </p>
        {/* Category filter */}
        <div
          style={{
            display: "inline-flex",
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 10,
            padding: 4,
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: selectedCategory === cat.value ? "#09090b" : "#71717a",
                background:
                  selectedCategory === cat.value ? "#fafafa" : "transparent",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* VS Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
          gap: 16,
        }}
      >
        <div style={{ flex: 1, height: 1, background: "#27272a" }} />
        <span
          style={{
            padding: "8px 16px",
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            color: "#71717a",
            fontFamily: "'Geist', sans-serif",
          }}
        >
          VS
        </span>
        <div style={{ flex: 1, height: 1, background: "#27272a" }} />
      </div>

      {/* Voting Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 24,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {[matchup.profile1, matchup.profile2].map((profile, idx) => {
          const isWinner = winnerId === profile._id;
          const isLoser = winnerId !== null && !isWinner;

          return (
            <div
              key={profile._id}
              style={{
                background: isWinner
                  ? "rgba(34, 197, 94, 0.08)"
                  : isLoser
                    ? "rgba(239, 68, 68, 0.08)"
                    : "#111113",
                border: isWinner
                  ? "1px solid rgba(34, 197, 94, 0.3)"
                  : isLoser
                    ? "1px solid rgba(239, 68, 68, 0.3)"
                    : "1px solid #27272a",
                borderRadius: 20,
                padding: 32,
                transition: "all 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Winner/Loser Badge */}
              {winnerId && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'Geist', sans-serif",
                    background: isWinner
                      ? "rgba(34, 197, 94, 0.2)"
                      : "rgba(239, 68, 68, 0.2)",
                    color: isWinner ? "#22c55e" : "#ef4444",
                  }}
                >
                  {isWinner ? "Winner" : ""}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ProfileImage profile={profile} size="large" />
                <div style={{ textAlign: "center", marginTop: 24 }}>
                  <Link
                    to={`/profile/${profile._id}`}
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: "#fafafa",
                      textDecoration: "none",
                      fontFamily: "'Geist', sans-serif",
                    }}
                  >
                    {profile.name}
                  </Link>
                  <div
                    style={{
                      fontSize: 15,
                      color: "#a1a1aa",
                      marginTop: 6,
                      fontFamily: "'Geist', sans-serif",
                    }}
                  >
                    {profile.title}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 14,
                      padding: "5px 14px",
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
                  {profile.bio && (
                    <div
                      style={{
                        fontSize: 14,
                        color: "#71717a",
                        marginTop: 16,
                        lineHeight: 1.6,
                        fontStyle: "italic",
                        maxWidth: 280,
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      "{profile.bio}"
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  marginTop: 28,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 8px",
                    background: "#18181b",
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: "#fafafa",
                      fontFamily: "'Geist', sans-serif",
                    }}
                  >
                    {voteResult
                      ? isWinner
                        ? voteResult.winnerNewScore
                        : voteResult.loserNewScore
                      : profile.score}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#71717a",
                      marginTop: 4,
                      fontWeight: 500,
                    }}
                  >
                    ELO
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 8px",
                    background: "#18181b",
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
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
                      marginTop: 4,
                      fontWeight: 500,
                    }}
                  >
                    WINS
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 8px",
                    background: "#18181b",
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: "#ef4444",
                      fontFamily: "'Geist', sans-serif",
                    }}
                  >
                    {profile.losses}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#71717a",
                      marginTop: 4,
                      fontWeight: 500,
                    }}
                  >
                    LOSSES
                  </div>
                </div>
              </div>

              {!voteResult ? (
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
                    padding: "16px 0",
                    background: "#fafafa",
                    color: "#09090b",
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    borderRadius: 10,
                    cursor: isVoting ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                    opacity: isVoting ? 0.6 : 1,
                    fontFamily: "'Geist', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    if (!isVoting) {
                      e.currentTarget.style.background = "#e4e4e7";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isVoting) {
                      e.currentTarget.style.background = "#fafafa";
                    }
                  }}
                >
                  {isVoting ? "Voting..." : "More Hireable"}
                </button>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 0",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isWinner ? "#22c55e" : "#ef4444",
                      fontFamily: "'Geist', sans-serif",
                    }}
                  >
                    {isWinner ? "Winner" : ""}
                  </div>
                  {isWinner && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#71717a",
                        marginTop: 6,
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      Win rate: {voteResult.winnerWinRate}%
                    </div>
                  )}
                </div>
              )}

              <div style={{ textAlign: "center", marginTop: 20 }}>
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
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fafafa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#71717a";
                  }}
                >
                  View LinkedIn
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post-vote engagement */}
      {voteResult && (
        <div
          style={{
            maxWidth: 600,
            margin: "48px auto 0",
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 20,
            padding: 36,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "#18181b",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <TrendingUp size={28} color="#22c55e" />
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#a1a1aa",
              marginBottom: 24,
              fontFamily: "'Geist', sans-serif",
            }}
          >
            {voteResult.totalMatchupVotes > 1 ? (
              <>
                <span style={{ color: "#fafafa", fontWeight: 600 }}>
                  {voteResult.agreementPct}%
                </span>{" "}
                of voters agreed with you
                {voteResult.agreementPct < 55 && " — this one is close"}
                {voteResult.agreementPct > 80 && " — landslide"}
              </>
            ) : (
              <>You're the first to vote on this matchup!</>
            )}
          </div>

          <button
            onClick={fetchMatchup}
            style={{
              padding: "14px 32px",
              background: "#fafafa",
              color: "#09090b",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "'Geist', sans-serif",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e4e4e7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fafafa";
            }}
          >
            <RefreshCw size={16} />
            Next Matchup
          </button>

          <ShareButtons
            profile1={matchup.profile1.name}
            profile2={matchup.profile2.name}
          />

          {/* CTA after voting a few times */}
          {voteCount >= 3 && voteCount % 3 === 0 && (
            <div
              style={{
                marginTop: 28,
                padding: 20,
                background: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                borderRadius: 12,
                fontSize: 14,
                color: "#a1a1aa",
                fontFamily: "'Geist', sans-serif",
              }}
            >
              Think you're hireable?{" "}
              <Link
                to="/submit"
                style={{
                  color: "#22c55e",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Submit your own profile
              </Link>{" "}
              and see how you rank.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
