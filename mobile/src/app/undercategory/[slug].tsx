import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://192.168.11.121:3000/api/mobile";

export default function UnderCategoryScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  
  const [underCategory, setUnderCategory] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/undercategory/${slug}/posts`);
        setUnderCategory(response.data.underCategory);
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Erreur chargement posts:", error);
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

  if (!underCategory) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
        <Text className="text-white">Sous-catégorie introuvable.</Text>
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
        <Text className="text-white font-bold text-xl flex-1" numberOfLines={1}>
          {underCategory.name}
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        <View className="mb-6">
          <Text className="text-slate-400 text-base">
            {underCategory.description || "Retrouvez tous les cours et examens."}
          </Text>
        </View>

        <View className="mb-6">
          {posts.length === 0 ? (
            <Text className="text-slate-500 italic">Aucun contenu disponible pour le moment.</Text>
          ) : (
            posts.map((post) => (
              <TouchableOpacity 
                key={post.id}
                onPress={() => router.push(`/post/${post.slug}`)}
                className="bg-slate-800 rounded-2xl mb-4 overflow-hidden border border-slate-700 shadow-md"
              >
                <View className="p-5 flex-row items-start">
                  <View className="flex-1 pr-3">
                    <Text className="text-white font-bold text-lg mb-1">{post.name}</Text>
                    {post.description && (
                      <Text className="text-slate-400 text-sm" numberOfLines={2}>
                        {post.description}
                      </Text>
                    )}
                    {post.attribute && (
                      <View className="mt-2 bg-blue-500/20 self-start px-2 py-1 rounded-md">
                        <Text className="text-blue-400 text-xs font-bold uppercase">{post.attribute}</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="document-text-outline" size={32} color="#475569" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
