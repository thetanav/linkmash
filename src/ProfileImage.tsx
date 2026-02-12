import { useState } from "react";

export function ProfileImage({
  profile,
  size = "small",
}: {
  profile: { name: string; imageUrl?: string; resolvedImageUrl?: string };
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

  const px = size === "small" ? 24 : size === "medium" ? 48 : 80;
  const fontSize = size === "small" ? 12 : size === "medium" ? 18 : 28;

  // Prefer resolvedImageUrl (auto-generated from LinkedIn), fall back to imageUrl
  const imgSrc = profile.resolvedImageUrl || profile.imageUrl;

  if (imageError || !imgSrc) {
    return (
      <div
        style={{
          width: px,
          height: px,
          background: "#ccc",
          border: "1px solid #888",
          textAlign: "center",
          lineHeight: px + "px",
          fontWeight: "bold",
          fontSize,
          flexShrink: 0,
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
        border: "1px solid #888",
        flexShrink: 0,
      }}
    >
      <img
        src={imgSrc}
        alt={profile.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={() => setImageError(true)}
      />
    </div>
  );
}
