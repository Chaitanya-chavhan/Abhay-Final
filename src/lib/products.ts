export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  features: string[];
  tag?: string;
}

export const products: Product[] = [
  {
    id: "yt-bundle",
    title: "YouTube Starter Bundle",
    description: "Everything you need to start a professional YouTube channel. Includes intros, outros, thumbnails, and lower thirds.",
    price: 49,
    originalPrice: 499,
    category: "Bundles",
    image: "",
    features: ["500+ Templates", "HD Quality", "Copyright Free", "Lifetime Access"],
    tag: "Best Seller",
  },
  {
    id: "ipl-clips",
    title: "6000+ IPL HD Clips",
    description: "Premium IPL cricket clips in HD quality. Perfect for Reels, Shorts, and YouTube content creation.",
    price: 49,
    originalPrice: 299,
    category: "Clips",
    image: "",
    features: ["6000+ Clips", "HD Quality", "Copyright Free", "Ready to Use"],
    tag: "Hot",
  },
  {
    id: "reels-pack",
    title: "Instagram Reels Pack",
    description: "Trending transitions, effects, and templates for viral Instagram Reels. No editing skills needed.",
    price: 79,
    originalPrice: 599,
    category: "Elements",
    image: "",
    features: ["200+ Effects", "Trending Styles", "Easy to Edit", "All Formats"],
  },
  {
    id: "thumbnail-pack",
    title: "Thumbnail Design Pack",
    description: "Professional YouTube thumbnail templates with bold designs that get clicks.",
    price: 29,
    originalPrice: 199,
    category: "Elements",
    image: "",
    features: ["100+ Designs", "PSD Files", "Customizable", "High CTR"],
  },
  {
    id: "editing-course",
    title: "Video Editing Masterclass",
    description: "Learn professional video editing from scratch. Covers Premiere Pro, After Effects, and DaVinci Resolve.",
    price: 99,
    originalPrice: 999,
    category: "Courses",
    image: "",
    features: ["30+ Hours", "Project Files", "Certificate", "Lifetime Access"],
    tag: "Popular",
  },
  {
    id: "pinterest-course",
    title: "Pinterest Money Guide",
    description: "Step by step complete guide to earn money from Pinterest. Learn affiliate marketing and traffic strategies.",
    price: 49,
    originalPrice: 399,
    category: "Courses",
    image: "",
    features: ["Complete Guide", "Live Examples", "Templates", "Support"],
  },
  {
    id: "yt-earn-course",
    title: "YouTube Monetization Course",
    description: "Complete method to earn money through YouTube. From serial to monetization, everything covered.",
    price: 99,
    originalPrice: 499,
    category: "Courses",
    image: "",
    features: ["Copyright Solutions", "Step by Step", "Monetization", "Editing Guide"],
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics Pack",
    description: "Stunning motion graphics elements for videos. Includes lower thirds, transitions, titles, and overlays.",
    price: 59,
    originalPrice: 399,
    category: "Elements",
    image: "",
    features: ["300+ Elements", "4K Quality", "After Effects", "Premiere Pro"],
  },
  {
    id: "sound-effects",
    title: "SFX & Music Library",
    description: "Royalty-free sound effects and background music for content creators. All genres covered.",
    price: 39,
    originalPrice: 299,
    category: "Bundles",
    image: "",
    features: ["1000+ Sounds", "All Genres", "Royalty Free", "WAV + MP3"],
  },
  {
    id: "social-media-kit",
    title: "Social Media Starter Kit",
    description: "Complete social media branding kit with templates for all platforms. Posts, stories, and banners.",
    price: 69,
    originalPrice: 499,
    category: "Bundles",
    image: "",
    features: ["All Platforms", "500+ Templates", "Canva + PSD", "Brand Kit"],
    tag: "New",
  },
  {
    id: "luts-pack",
    title: "Cinematic LUTs Collection",
    description: "Professional color grading LUTs for videos and photos. Hollywood-style cinematic looks.",
    price: 29,
    originalPrice: 199,
    category: "Elements",
    image: "",
    features: ["150+ LUTs", "All Software", "Cinematic", "One-Click"],
  },
  {
    id: "mega-bundle",
    title: "Ultimate Creator Bundle",
    description: "Everything a content creator needs in one mega bundle. All products included at a massive discount.",
    price: 199,
    originalPrice: 2999,
    category: "Bundles",
    image: "",
    features: ["All Products", "Lifetime Updates", "Priority Support", "Exclusive Bonus"],
    tag: "Best Value",
  },
];

export const categories = ["All", "Bundles", "Courses", "Clips", "Elements"];
