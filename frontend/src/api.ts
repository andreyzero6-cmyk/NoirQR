import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function fetchMenu(venueSlug: string) {
  const res = await axios.get(`${API_URL}/venue/${venueSlug}/menu`);
  return res.data;
}
