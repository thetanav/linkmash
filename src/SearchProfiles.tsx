import { useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Link } from "react-router-dom";
import { ProfileImage } from "./ProfileImage";
import { Search, X, User, TrendingUp, ArrowRight } from "lucide-react";

interface ProfileSearchResult {
  _id: string;
  name: string;
  title: string;
  category: string;
  score: number;
  wins: number;
  losses: number;
  totalVotes: number;
  linkedinUrl: string;
  imageUrl?: string;
  bio?: string;
  username: string;
}

export function SearchProfiles() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input to avoid excessive queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const searchResults = useQuery(
    api.profiles.searchProfiles,
    debouncedSearchTerm.length >= 2
      ? { query: debouncedSearchTerm, limit: 20 }
      : "skip",
  ) as ProfileSearchResult[] | undefined;

  const clearSearchInput = useCallback(() => {
    setSearchInput("");
    setDebouncedSearchTerm("");
  }, []);

  const calculateWinRate = (wins: number, totalVotes: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round((wins / totalVotes) * 100);
  };

  const getWinRateColor = (winRate: number): string => {
    if (winRate > 60) return "#22c55e";
    if (winRate < 40) return "#ef4444";
    return "#a1a1aa";
  };

  const isSearchTooShort = debouncedSearchTerm.length < 2;
  const hasNoResults = !isSearchTooShort && searchResults?.length === 0;
  const hasResults =
    !isSearchTooShort && searchResults && searchResults.length > 0;

  return (
    <div>
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={24} color="#fafafa" />
          </div>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: "#fafafa",
              letterSpacing: -1,
              fontFamily: "'Geist', sans-serif",
            }}
          >
            Find Profiles
          </h1>
        </div>
        <p
          style={{
            fontSize: 16,
            color: "#71717a",
            fontFamily: "'Geist', sans-serif",
          }}
        >
          Search for professionals by name
        </p>
      </div>

      {/* Search Input Section */}
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto 40px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#71717a",
            pointerEvents: "none",
          }}
        >
          <Search size={20} />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name..."
          style={{
            width: "100%",
            padding: "18px 52px 18px 56px",
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 14,
            fontSize: 16,
            color: "#fafafa",
            outline: "none",
            transition: "all 0.2s ease",
            fontFamily: "'Geist', sans-serif",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3f3f46";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(63, 63, 70, 0.3)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#27272a";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {searchInput && (
          <button
            onClick={clearSearchInput}
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "#27272a",
              border: "none",
              color: "#a1a1aa",
              cursor: "pointer",
              width: 28,
              height: 28,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3f3f46";
              e.currentTarget.style.color = "#fafafa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#27272a";
              e.currentTarget.style.color = "#a1a1aa";
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results Section */}
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {isSearchTooShort ? (
          <div
            style={{
              textAlign: "center",
              padding: 80,
              color: "#52525b",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                background: "#111113",
                border: "1px solid #27272a",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <User size={36} color="#3f3f46" />
            </div>
            <p style={{ fontSize: 16, fontFamily: "'Geist', sans-serif" }}>
              Type at least 2 characters to search
            </p>
          </div>
        ) : searchResults === undefined ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 80 }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: "2px solid #27272a",
                borderTopColor: "#3b82f6",
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
        ) : hasNoResults ? (
          <div
            style={{
              textAlign: "center",
              padding: 80,
              color: "#52525b",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                background: "#111113",
                border: "1px solid #27272a",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Search size={36} color="#3f3f46" />
            </div>
            <p
              style={{
                fontSize: 16,
                fontFamily: "'Geist', sans-serif",
                marginBottom: 16,
              }}
            >
              No profiles found matching "{debouncedSearchTerm}"
            </p>
            <Link
              to="/submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#3b82f6",
                textDecoration: "none",
                fontSize: 14,
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#60a5fa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#3b82f6")}
            >
              Submit a new profile
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : hasResults ? (
          <div
            style={{
              background: "#111113",
              border: "1px solid #27272a",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #27272a",
                fontSize: 13,
                color: "#71717a",
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
              }}
            >
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} found
            </div>
            {searchResults.map((profileResult) => {
              const winRate = calculateWinRate(
                profileResult.wins,
                profileResult.totalVotes,
              );
              return (
                <Link
                  key={profileResult._id}
                  to={`/profile/${profileResult._id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "22px 24px",
                    borderBottom: "1px solid #27272a",
                    textDecoration: "none",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#18181b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <ProfileImage profile={profileResult} size="medium" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#fafafa",
                        marginBottom: 4,
                        fontFamily: "'Geist', sans-serif",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {profileResult.name}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#71717a",
                        marginBottom: 8,
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      {profileResult.title}
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
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
                      {profileResult.category}
                    </span>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 70 }}>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#fafafa",
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      {profileResult.score}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#71717a",
                        fontWeight: 500,
                      }}
                    >
                      ELO
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 80 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 4,
                        fontSize: 16,
                        fontWeight: 600,
                        color: getWinRateColor(winRate),
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      <TrendingUp size={14} />
                      {winRate}%
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#71717a",
                        fontWeight: 500,
                      }}
                    >
                      Win rate
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
