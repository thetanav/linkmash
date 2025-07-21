import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { useState } from "react";
import { SubmitProfile } from "./SubmitProfile";
import { VotingInterface } from "./VotingInterface";
import { Leaderboard } from "./Leaderboard";

export default function App() {
  const [currentView, setCurrentView] = useState<
    "vote" | "submit" | "leaderboard"
  >("vote");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "Tahoma, Geneva, sans-serif",
        fontSize: 14,
        color: "#222",
      }}
    >
      <table
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        style={{ borderBottom: "2px solid #888", background: "#f8f8f8" }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "8px 16px" }}>
              <b style={{ fontSize: 18, color: "#003399" }}>LinkMash</b>
              <div style={{ fontSize: 12, color: "#666" }}>
                Who's more hireable?
              </div>
            </td>
            <td align="right" style={{ padding: "8px 16px" }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView("vote");
                }}
                style={{
                  color: currentView === "vote" ? "#fff" : "#003399",
                  background:
                    currentView === "vote" ? "#003399" : "transparent",
                  border: "1px solid #888",
                  padding: "2px 10px",
                  textDecoration: "none",
                  marginRight: 4,
                  fontWeight: currentView === "vote" ? "bold" : "normal",
                }}
              >
                Vote
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView("leaderboard");
                }}
                style={{
                  color: currentView === "leaderboard" ? "#fff" : "#003399",
                  background:
                    currentView === "leaderboard" ? "#003399" : "transparent",
                  border: "1px solid #888",
                  padding: "2px 10px",
                  textDecoration: "none",
                  marginRight: 4,
                  fontWeight: currentView === "leaderboard" ? "bold" : "normal",
                }}
              >
                Leaderboard
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView("submit");
                }}
                style={{
                  color: currentView === "submit" ? "#fff" : "#003399",
                  background:
                    currentView === "submit" ? "#003399" : "transparent",
                  border: "1px solid #888",
                  padding: "2px 10px",
                  textDecoration: "none",
                  fontWeight: currentView === "submit" ? "bold" : "normal",
                }}
              >
                Submit
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: 12 }}>
        {currentView === "vote" && <VotingInterface />}
        {currentView === "submit" && <SubmitProfile />}
        {currentView === "leaderboard" && <Leaderboard />}
      </div>

      <footer className="flex text-center w-full mb-8 items-center justify-center">
        <p>
          Follow me on Twitter:{" "}
          <a href="https://twitter.com/tanavtwt">@tanavtwt</a>
        </p>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
}
