import AsyncStorage from "@react-native-async-storage/async-storage";

export interface FavoritePost {
  id: number;
  slug: string;
  name: string;
  attribute?: string;
}

const FAVORITES_KEY = "@maths_exams_favorites";

export const getFavorites = async (): Promise<FavoritePost[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading favorites", e);
    return [];
  }
};

export const toggleFavorite = async (post: FavoritePost): Promise<FavoritePost[]> => {
  try {
    const favorites = await getFavorites();
    const existsIndex = favorites.findIndex(fav => fav.id === post.id);
    
    let newFavorites;
    if (existsIndex >= 0) {
      // Remove it
      newFavorites = favorites.filter(fav => fav.id !== post.id);
    } else {
      // Add it
      newFavorites = [...favorites, post];
    }
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    return newFavorites;
  } catch (e) {
    console.error("Error updating favorites", e);
    return [];
  }
};

export const isFavorite = async (id: number): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.some(fav => fav.id === id);
};
