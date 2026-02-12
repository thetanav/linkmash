import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { SubmitProfile } from "./SubmitProfile";
import { VotingInterface } from "./VotingInterface";
import { Leaderboard } from "./Leaderboard";
import { ProfilePage } from "./ProfilePage";

function NavLink({
  to,
  label,
  currentPath,
}: {
  to: string;
  label: string;
  currentPath: string;
}) {
  const isActive = currentPath === to;
  return (
    <Link
      to={to}
      style={{
        padding: "8px 16px",
        fontSize: 14,
        fontWeight: 500,
        color: isActive ? "#fafafa" : "#71717a",
        textDecoration: "none",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#fafafa";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = isActive ? "#fafafa" : "#71717a";
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
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
          background: "rgba(9, 9, 11, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #27272a",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#fafafa",
                letterSpacing: -0.5,
              }}
            >
              LinkMash
            </span>
          </Link>
          <nav style={{ display: "flex", gap: 8 }}>
            <NavLink to="/" label="Vote" currentPath={location.pathname} />
            <NavLink
              to="/leaderboard"
              label="Leaderboard"
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
            borderBottom: "1px solid #27272a",
            padding: "10px 24px",
            fontSize: 13,
            textAlign: "center",
            color: "#71717a",
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
          padding: "32px 24px",
        }}
      >
        <Routes>
          <Route path="/" element={<VotingInterface />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
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
          },
        }}
      />
    </div>
  );
}
