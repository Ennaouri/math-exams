import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { isFavorite, toggleFavorite } from "../../utils/favorites";

const API_URL = "http://192.168.11.121:3000/api/mobile";

export default function PostDetailsScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  
  const [post, setPost] = useState<any>(null);
  const [postDetails, setPostDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/post/${slug}`);
        setPost(response.data.post);
        setPostDetails(response.data.postDetails);
        
        // Check if it's a favorite
        const favStatus = await isFavorite(response.data.post.id);
        setIsFav(favStatus);
      } catch (error) {
        console.error("Erreur chargement post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleToggleFavorite = async () => {
    if (!post) return;
    const newFavorites = await toggleFavorite({
      id: post.id,
      slug: post.slug,
      name: post.name,
      attribute: post.attribute
    });
    // Check if still in array
    setIsFav(newFavorites.some(fav => fav.id === post.id));
  };

  const handleOpenMedia = async (url: string) => {
    if (!url) return;
    
    // Si l'URL commence par /, on lui ajoute le domaine complet
    const fullUrl = url.startsWith("/") ? `https://maths-exams.com${url}` : url;
    
    try {
      // Le navigateur intégré d'Expo est parfait pour lire les PDF sur mobile !
      await WebBrowser.openBrowserAsync(fullUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: "#0f172a", // slate-900
        controlsColor: "#ffffff",
      });
    } catch (error) {
      Alert.alert("Erreur", "Un problème est survenu lors de l'ouverture du document.");
    }
  };

  const renderMediaButton = (thumbnail: string) => {
    const isYouTube = thumbnail.includes("youtube.com") || thumbnail.includes("youtu.be");
    const isPdf = thumbnail.toLowerCase().endsWith(".pdf");
    const isVideo = thumbnail.match(/\.(mp4|webm|mov)$/i);

    let iconName = "link-outline";
    let label = "Ouvrir le lien";
    let color = "bg-blue-600";

    if (isYouTube) {
      iconName = "logo-youtube";
      label = "Regarder la vidéo";
      color = "bg-red-600";
    } else if (isPdf) {
      iconName = "document-text";
      label = "Lire le PDF";
      color = "bg-orange-600";
    } else if (isVideo) {
      iconName = "play-circle";
      label = "Lire la vidéo";
      color = "bg-purple-600";
    }

    return (
      <TouchableOpacity 
        onPress={() => handleOpenMedia(thumbnail)}
        className={`${color} flex-row items-center justify-center p-3 rounded-xl mt-4`}
      >
        {/* @ts-ignore */}
        <Ionicons name={iconName} size={20} color="white" className="mr-2" />
        <Text className="text-white font-bold ml-2">{label}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
        <Text className="text-white">Contenu introuvable.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-4 bg-blue-600 rounded-xl">
          <Text className="text-white">Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between p-4 border-b border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text className="text-white font-bold text-xl flex-1 text-center" numberOfLines={1}>
          {post.name}
        </Text>
        
        <TouchableOpacity onPress={handleToggleFavorite} className="ml-4 p-2">
          <Ionicons name={isFav ? "heart" : "heart-outline"} size={28} color={isFav ? "#ef4444" : "white"} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        <View className="mb-6">
          {post.attribute && (
            <View className="bg-blue-500/20 self-start px-3 py-1 rounded-md mb-3">
              <Text className="text-blue-400 font-bold uppercase">{post.attribute}</Text>
            </View>
          )}
          <Text className="text-slate-300 text-base">
            {post.description || "Détails du cours / examen."}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-bold text-xl mb-4">Documents PDF & Vidéos ({postDetails.length})</Text>
          
          {postDetails.length === 0 ? (
            <Text className="text-slate-500 italic">Aucun document attaché.</Text>
          ) : (
            postDetails.map((detail) => {
              const isExpanded = expandedId === detail.id;
              
              return (
                <View key={detail.id} className="bg-slate-800 rounded-2xl mb-4 overflow-hidden border border-slate-700 shadow-md">
                  <TouchableOpacity 
                    onPress={() => toggleExpand(detail.id)}
                    className="p-5 flex-row items-center justify-between"
                  >
                    <Text className="text-white font-bold text-lg flex-1 mr-4">{detail.name}</Text>
                    <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="#64748b" />
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View className="px-5 pb-5 pt-2 border-t border-slate-700">
                      {detail.description ? (
                        <Text className="text-slate-400 text-sm mb-3">
                          {detail.description}
                        </Text>
                      ) : null}
                      
                      {detail.thumbnail ? (
                        renderMediaButton(detail.thumbnail)
                      ) : (
                        <Text className="text-slate-500 italic mt-2">Aucun média associé</Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
