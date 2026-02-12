import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { SubmitProfile } from "./SubmitProfile";
import { VotingInterface } from "./VotingInterface";
import { Leaderboard } from "./Leaderboard";
import { ProfilePage } from "./ProfilePage";
import { SearchProfiles } from "./SearchProfiles";

function NavLink({
  to,
  label,
  currentPath,
}: {
  to: string;
  label: string;
  currentPath: string;
}) {
  const isActive = currentPath === to || currentPath.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      style={{
        padding: "8px 14px",
        fontSize: 14,
        fontWeight: 500,
        color: isActive ? "#fafafa" : "#71717a",
        textDecoration: "none",
        transition: "all 0.15s",
        borderRadius: 6,
        background: isActive ? "#18181b" : "transparent",
        fontFamily: "'Geist', sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = "#fafafa";
          e.currentTarget.style.background = "#18181b";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = "#71717a";
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {label}
    </Link>
  );
}

export default function App() {
  const location = useLocation();
  const stats = useQuery(api.profiles.getTotalVotes);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 14,
        color: "#fafafa",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(9, 9, 11, 0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(39, 39, 42, 0.5)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 16,
                color: "#09090b",
              }}
            >
              L
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#fafafa",
                letterSpacing: -0.5,
                fontFamily: "'Geist', sans-serif",
              }}
            >
              LinkMash
            </span>
          </Link>
          <nav style={{ display: "flex", gap: 4 }}>
            <NavLink to="/" label="Vote" currentPath={location.pathname} />
            <NavLink
              to="/leaderboard"
              label="Leaderboard"
              currentPath={location.pathname}
            />
            <NavLink
              to="/search"
              label="Search"
              currentPath={location.pathname}
            />
            <NavLink
              to="/submit"
              label="Submit"
              currentPath={location.pathname}
            />
          </nav>
        </div>
      </header>

      {/* Live stats bar */}
      {stats && stats.totalVotes > 0 && (
        <div
          style={{
            background: "#111113",
            borderBottom: "1px solid rgba(39, 39, 42, 0.5)",
            padding: "12px 24px",
            fontSize: 13,
            textAlign: "center",
            color: "#71717a",
            fontFamily: "'Geist', sans-serif",
          }}
        >
          <span style={{ color: "#fafafa", fontWeight: 500 }}>
            {stats.totalVotes.toLocaleString()}
          </span>{" "}
          votes cast across{" "}
          <span style={{ color: "#fafafa", fontWeight: 500 }}>
            {stats.totalProfiles}
          </span>{" "}
          profiles
        </div>
      )}

      {/* Main content */}
      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        <Routes>
          <Route path="/" element={<VotingInterface />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/search" element={<SearchProfiles />} />
          <Route path="/submit" element={<SubmitProfile />} />
          <Route path="/profile/:profileId" element={<ProfilePage />} />
        </Routes>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#18181b",
            border: "1px solid #27272a",
            color: "#fafafa",
            fontFamily: "'Geist', sans-serif",
          },
        }}
      />
    </div>
  );
}
