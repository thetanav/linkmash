import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
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

const SITE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://linkmash.vercel.app";

function ShareButtons({ text }: { text: string }) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SITE_URL)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        justifyContent: "center",
        marginTop: 16,
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
          borderRadius: 6,
          textDecoration: "none",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#27272a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#18181b";
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
          borderRadius: 6,
          textDecoration: "none",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#27272a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#18181b";
        }}
      >
        Share on LinkedIn
      </a>
    </div>
  );
}

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
  resolvedImageUrl?: string;
  username: string;
};

type Matchup = {
  profile1: Profile;
  profile2: Profile;
};

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
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "2px solid #27272a",
            borderTopColor: "#fafafa",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
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
          padding: "48px 24px",
        }}
      >
        <div
          style={{
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 12,
            padding: 40,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#fafafa",
              marginBottom: 12,
            }}
          >
            Not enough profiles
          </div>
          <div style={{ fontSize: 14, color: "#71717a", marginBottom: 24 }}>
            We need at least 2 profiles to start voting.
          </div>
          <Link
            to="/submit"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#fafafa",
              color: "#09090b",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              borderRadius: 6,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e4e4e7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fafafa";
            }}
          >
            Submit a Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Title + Category Filter */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#fafafa",
            marginBottom: 8,
            letterSpacing: -0.5,
          }}
        >
          Who's More Hireable?
        </div>
        <div style={{ fontSize: 15, color: "#71717a", marginBottom: 24 }}>
          Choose the candidate you'd rather hire
        </div>
        {/* Category filter */}
        <div
          style={{
            display: "inline-flex",
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 8,
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
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voting Cards */}
      <div
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 32,
        }}
      >
        {[matchup.profile1, matchup.profile2].map((profile, idx) => {
          const isWinner = winnerId === profile._id;
          const isLoser = winnerId !== null && !isWinner;

          return (
            <div
              key={profile._id}
              style={{
                flex: "1 1 340px",
                maxWidth: 380,
                background: isWinner
                  ? "rgba(34, 197, 94, 0.1)"
                  : isLoser
                    ? "rgba(239, 68, 68, 0.1)"
                    : "#111113",
                border: isWinner
                  ? "1px solid rgba(34, 197, 94, 0.3)"
                  : isLoser
                    ? "1px solid rgba(239, 68, 68, 0.3)"
                    : "1px solid #27272a",
                borderRadius: 16,
                padding: 32,
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ProfileImage profile={profile} size="large" />
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <Link
                    to={`/profile/${profile._id}`}
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#fafafa",
                      textDecoration: "none",
                    }}
                  >
                    {profile.name}
                  </Link>
                  <div style={{ fontSize: 14, color: "#a1a1aa", marginTop: 4 }}>
                    {profile.title}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 12,
                      padding: "4px 12px",
                      background: "#18181b",
                      color: "#a1a1aa",
                      fontSize: 12,
                      fontWeight: 500,
                      borderRadius: 4,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {profile.category}
                  </span>
                  {profile.bio && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#71717a",
                        marginTop: 16,
                        lineHeight: 1.6,
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
                  marginTop: 24,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 8px",
                    background: "#18181b",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: "#fafafa",
                    }}
                  >
                    {voteResult
                      ? isWinner
                        ? voteResult.winnerNewScore
                        : voteResult.loserNewScore
                      : profile.score}
                  </div>
                  <div style={{ fontSize: 11, color: "#71717a", marginTop: 4 }}>
                    ELO
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 8px",
                    background: "#18181b",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: "#22c55e",
                    }}
                  >
                    {profile.wins}
                  </div>
                  <div style={{ fontSize: 11, color: "#71717a", marginTop: 4 }}>
                    WINS
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 8px",
                    background: "#18181b",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: "#ef4444",
                    }}
                  >
                    {profile.losses}
                  </div>
                  <div style={{ fontSize: 11, color: "#71717a", marginTop: 4 }}>
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
                    padding: "14px 0",
                    background: "#fafafa",
                    color: "#09090b",
                    fontSize: 14,
                    fontWeight: 500,
                    border: "none",
                    borderRadius: 8,
                    cursor: isVoting ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                    opacity: isVoting ? 0.5 : 1,
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
                    padding: "14px 0",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isWinner ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {isWinner ? "Winner" : ""}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#71717a",
                      marginTop: 4,
                    }}
                  >
                    Win rate:{" "}
                    {isWinner
                      ? voteResult.winnerWinRate
                      : voteResult.loserWinRate}
                    %
                  </div>
                </div>
              )}

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 13,
                    color: "#71717a",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fafafa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#71717a";
                  }}
                >
                  View LinkedIn Profile
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
            margin: "0 auto",
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 16,
            padding: 32,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 15, color: "#a1a1aa", marginBottom: 20 }}>
            {voteResult.totalMatchupVotes > 1 ? (
              <>
                <span style={{ color: "#fafafa", fontWeight: 500 }}>
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
              padding: "12px 32px",
              background: "#fafafa",
              color: "#09090b",
              fontSize: 14,
              fontWeight: 500,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e4e4e7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fafafa";
            }}
          >
            Next Matchup
          </button>

          <ShareButtons
            text={`I just voted on LinkMash — who's more hireable? ${matchup.profile1.name} vs ${matchup.profile2.name}. Cast your vote!`}
          />

          {/* CTA after voting a few times */}
          {voteCount >= 3 && voteCount % 3 === 0 && (
            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                borderRadius: 10,
                fontSize: 14,
                color: "#a1a1aa",
              }}
            >
              Think you're hireable?{" "}
              <Link
                to="/submit"
                style={{
                  color: "#fafafa",
                  fontWeight: 500,
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
