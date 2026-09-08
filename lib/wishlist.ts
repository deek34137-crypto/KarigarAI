/**
 * Buyer Wishlist — stored in localStorage, no auth required.
 * Stores minimal product snapshots so the wishlist works offline
 * and survives page refreshes without a network call.
 */

const WISHLIST_KEY = "karigarai_buyer_wishlist";

export interface WishlistItem {
  id: string;
  slug: string;
  title_en: string;
  title_hi: string;
  artisan_name: string;
  craft_type: string;
  price: number;
  image_url: string | null;
  saved_at: string; // ISO timestamp
}

function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota errors
  }
}

export function getWishlist(): WishlistItem[] {
  return readWishlist();
}

export function isWishlisted(productId: string): boolean {
  return readWishlist().some((item) => item.id === productId);
}

export function addToWishlist(item: Omit<WishlistItem, "saved_at">): void {
  const list = readWishlist().filter((i) => i.id !== item.id);
  writeWishlist([{ ...item, saved_at: new Date().toISOString() }, ...list]);
}

export function removeFromWishlist(productId: string): void {
  writeWishlist(readWishlist().filter((i) => i.id !== productId));
}

export function toggleWishlist(item: Omit<WishlistItem, "saved_at">): boolean {
  if (isWishlisted(item.id)) {
    removeFromWishlist(item.id);
    return false; // removed
  } else {
    addToWishlist(item);
    return true; // added
  }
}
