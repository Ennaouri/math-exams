import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://192.168.11.121:3000/api/mobile";

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  
  const [category, setCategory] = useState<any>(null);
  const [underCategories, setUnderCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/category/${slug}`);
        setCategory(response.data.category);
        setUnderCategories(response.data.underCategories);
      } catch (error) {
        console.error("Erreur chargement category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (!category) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
        <Text className="text-white">Catégorie introuvable.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-4 bg-blue-600 rounded-xl">
          <Text className="text-white">Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={["top", "bottom"]}>
      <View className="flex-row items-center p-4 border-b border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl flex-1">{category.name}</Text>
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        <View className="mb-6">
          <Text className="text-slate-400 text-base">
            {category.description || "Sélectionnez une matière pour voir les cours."}
          </Text>
        </View>

        <View className="mb-6">
          {underCategories.length === 0 ? (
            <Text className="text-slate-500 italic">Aucune matière disponible.</Text>
          ) : (
            underCategories.map((uc) => (
              <TouchableOpacity 
                key={uc.id}
                onPress={() => router.push(`/undercategory/${uc.slug}`)}
                className="bg-slate-800 p-5 rounded-2xl mb-4 border border-slate-700 shadow-md flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg">{uc.name}</Text>
                  {uc.description && (
                    <Text className="text-slate-400 text-sm mt-1" numberOfLines={2}>
                      {uc.description}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={24} color="#64748b" />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
