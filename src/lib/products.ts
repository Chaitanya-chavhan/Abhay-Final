export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number;
  category: string;
  image_url: string | null;
  features: string[];
  tag: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const categories = ["All", "Bundles", "Courses", "Clips", "Elements"];
