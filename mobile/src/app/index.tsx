import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";

// L'adresse IP locale de votre ordinateur
const API_URL = "http://192.168.11.121:3000/api";

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    SecureStore.getItemAsync("userData").then((data) => {
      if (data) {
        setUser(JSON.parse(data));
      }
    });

    // Fetch categories
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur chargement categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1 px-5 py-4">
        <View className="mb-8 mt-4">
          <Text className="text-white font-extrabold text-3xl mb-2">
            Maths-Exams
          </Text>
          <Text className="text-slate-400 text-base">
            Votre plateforme éducative pour maîtriser les mathématiques.
          </Text>
        </View>

        {!user ? (
          <TouchableOpacity 
            onPress={() => router.push("/login")}
            className="bg-blue-600 rounded-xl py-4 items-center shadow-lg mb-6"
          >
            <Text className="text-white font-bold text-lg">Se connecter</Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-green-600/20 border border-green-500 rounded-xl p-4 mb-6">
            <Text className="text-green-400 font-bold">Connecté en tant que {user.name}</Text>
          </View>
        )}
        
        <View className="mb-6">
          <Text className="text-white font-bold text-xl mb-4">Parcourir les Niveaux</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#3b82f6" className="mt-4" />
          ) : (
            categories.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => router.push(`/category/${cat.slug}`)}
                className="bg-slate-800 rounded-2xl mb-4 overflow-hidden border border-slate-700 shadow-md"
              >
                {/* Fallback image style since Next.js images might use relative paths */}
                <View className="h-32 bg-slate-700 relative">
                  {cat.thumbnail && (
                    <Image 
                      source={{ uri: cat.thumbnail.startsWith("http") ? cat.thumbnail : `http://localhost:3000${cat.thumbnail}` }} 
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  )}
                  <View className="absolute inset-0 bg-black/40 justify-center items-center">
                    <Text className="text-white font-extrabold text-2xl text-center px-4">
                      {cat.name}
                    </Text>
                  </View>
                </View>
                <View className="p-4">
                  <Text className="text-slate-300 text-sm">
                    {cat.description || "Découvrez les cours, exercices et examens pour ce niveau."}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
