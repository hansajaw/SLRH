import api from "../../utils/api";

export type Team = {
  id: string;
  name: string;
  logo?: { uri: string };
  city?: string;
  founded?: string;
  drivers?: string[];
  about?: string;
  members?: string[]; // Added members property
  achievements?: string; // Added achievements property
};

export async function getTeams(): Promise<Team[]> {
  try {
    const { data } = await api.get("/media", { params: { category: "teams" } });
    return data.items.map((item: any) => ({
      id: item._id,
      name: item.title,
      logo: { uri: item.url },
      city: item.description, // Assuming city is in description
    }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

