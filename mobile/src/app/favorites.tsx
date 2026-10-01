import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, FavoritePost } from "../utils/favorites";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const renderItem = ({ item }: { item: FavoritePost }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/post/${item.slug}`)}
      className="bg-slate-800 rounded-2xl mb-4 overflow-hidden border border-slate-700 shadow-md p-4 flex-row items-center"
    >
      <View className="bg-red-500/20 p-3 rounded-xl mr-4">
        <Ionicons name="heart" size={24} color="#ef4444" />
      </View>
      <View className="flex-1">
        <Text className="text-white font-bold text-lg mb-1" numberOfLines={2}>
          {item.name}
        </Text>
        {item.attribute ? (
          <Text className="text-blue-400 font-bold uppercase text-xs">
            {item.attribute}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#64748b" className="ml-2" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={["top"]}>
      <View className="px-5 py-4 mb-2">
        <Text className="text-white font-extrabold text-3xl">Mes Favoris</Text>
        <Text className="text-slate-400 text-base mt-2">
          Retrouvez rapidement vos chapitres et examens préférés.
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6 pb-20">
          <Ionicons name="heart-dislike-outline" size={80} color="#334155" />
          <Text className="text-slate-400 text-lg text-center mt-4">
            Vous n'avez encore ajouté aucun cours à vos favoris.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
