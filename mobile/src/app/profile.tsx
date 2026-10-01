import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const loadUser = async () => {
    try {
      const data = await SecureStore.getItemAsync("userData");
      if (data) {
        setUser(JSON.parse(data));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  // Re-load user whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userData");
      setUser(null);
      Alert.alert("Déconnexion", "Vous avez été déconnecté avec succès.");
      // Optional: push to home
      // router.push("/");
    } catch (error) {
      Alert.alert("Erreur", "Problème lors de la déconnexion.");
    }
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 justify-center px-6">
        <View className="items-center mb-8">
          <Ionicons name="person-circle-outline" size={100} color="#64748b" />
          <Text className="text-white font-bold text-2xl mt-4 mb-2">Mon Profil</Text>
          <Text className="text-slate-400 text-center text-base">
            Connectez-vous pour sauvegarder votre progression et accéder à vos examens.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="bg-blue-600 rounded-xl py-4 items-center shadow-lg"
        >
          <Text className="text-white font-bold text-lg">Se connecter</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1 px-5 py-4">
        <View className="items-center mb-8 mt-4">
          <View className="bg-blue-600/20 p-4 rounded-full mb-4">
            <Ionicons name="person" size={60} color="#3b82f6" />
          </View>
          <Text className="text-white font-extrabold text-3xl mb-1">{user.name}</Text>
          <Text className="text-slate-400 text-base">{user.email}</Text>
          <View className="bg-slate-800 px-3 py-1 rounded-full mt-3 border border-slate-700">
            <Text className="text-blue-400 font-bold uppercase text-xs">
              Rôle: {user.role || "Étudiant"}
            </Text>
          </View>
        </View>

        <View className="bg-slate-800 rounded-2xl p-4 mb-6 border border-slate-700">
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-slate-700">
            <View className="flex-row items-center">
              <Ionicons name="settings-outline" size={24} color="#94a3b8" />
              <Text className="text-white font-bold text-lg ml-3">Paramètres du compte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-slate-700">
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={24} color="#94a3b8" />
              <Text className="text-white font-bold text-lg ml-3">Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <Ionicons name="help-circle-outline" size={24} color="#94a3b8" />
              <Text className="text-white font-bold text-lg ml-3">Aide & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600/20 border border-red-600/50 rounded-xl py-4 items-center mb-8 flex-row justify-center"
        >
          <Ionicons name="log-out-outline" size={22} color="#ef4444" className="mr-2" />
          <Text className="text-red-500 font-bold text-lg ml-2">Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
