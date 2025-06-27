"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  isInWishlist?: boolean;
  onToggle?: (isInWishlist: boolean) => void;
}

export default function WishlistButton({
  productId,
  isInWishlist = false,
  onToggle,
}: WishlistButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);
  const [inWishlist, setInWishlist] = React.useState(isInWishlist);

  const handleToggle = async () => {
    if (!session?.user) {
      toast.error("Please sign in to add items to your wishlist");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/wishlist", {
        method: inWishlist ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }

      setInWishlist(!inWishlist);
      onToggle?.(!inWishlist);
      toast.success(
        inWishlist ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`w-6 h-6 ${
          inWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
        }`}
      />
    </button>
  );
} 