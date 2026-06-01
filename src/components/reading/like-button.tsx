"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  publicationType: string;
  publicationId: string;
  initialLikes: number;
}

export function LikeButton({
  publicationType,
  publicationId,
  initialLikes,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setCount((c) => c + 1);

    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicationType, publicationId }),
      });
    } catch {
      /* silencioso em demo */
    }
  };

  return (
    <Button
      variant={liked ? "primary" : "outline"}
      size="sm"
      onClick={handleLike}
      disabled={liked}
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
      {count}
    </Button>
  );
}
