import { useState } from "react";

export function ProfileImage({
  profile,
  size = "small",
}: {
  profile: { name: string; imageUrl?: string };
  size?: "small" | "medium" | "large";
}) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const px = size === "small" ? 40 : size === "medium" ? 56 : 96;
  const fontSize = size === "small" ? 14 : size === "medium" ? 18 : 28;

  if (imageError || !profile.imageUrl) {
    return (
      <div
        style={{
          width: px,
          height: px,
          background: "linear-gradient(135deg, #27272a 0%, #3f3f46 100%)",
          borderRadius: "50%",
          textAlign: "center",
          lineHeight: px + "px",
          fontWeight: 500,
          fontSize,
          color: "#a1a1aa",
          flexShrink: 0,
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {getInitials(profile.name)}
      </div>
    );
  }

  return (
    <div
      style={{
        width: px,
        height: px,
        overflow: "hidden",
        borderRadius: "50%",
        flexShrink: 0,
        border: "2px solid #27272a",
      }}
    >
      <img
        src={profile.imageUrl}
        alt={profile.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={() => setImageError(true)}
      />
    </div>
  );
}
