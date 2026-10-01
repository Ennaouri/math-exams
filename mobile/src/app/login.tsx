import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Constants, { ExecutionEnvironment } from "expo-constants";

// L'adresse IP locale de votre ordinateur
const API_URL = "http://192.168.11.121:3000/api/mobile";
const WEB_CLIENT_ID = "215811155499-sv2k7gsg9mrpcpdtjdhm80crcq31s683.apps.googleusercontent.com";

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let GoogleSignin: any = null;
let statusCodes: any = {};

if (!isExpoGo) {
  const GSigninModule = require("@react-native-google-signin/google-signin");
  GoogleSignin = GSigninModule.GoogleSignin;
  statusCodes = GSigninModule.statusCodes;

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    offlineAccess: true,
  });
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const saveAuthData = async (token: string, user: any) => {
    await SecureStore.setItemAsync("userToken", token);
    await SecureStore.setItemAsync("userData", JSON.stringify(user));
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      await saveAuthData(token, user);

      Alert.alert("Succès", `Bienvenue ${user.name} !`);
      router.back();
    } catch (error: any) {
      const message = error.response?.data?.error || "Erreur de connexion";
      Alert.alert("Erreur", message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isExpoGo) {
      Alert.alert(
        "Mode Développement", 
        "L'authentification Google nécessite l'application compilée (.apk / .ipa). Elle est désactivée dans Expo Go."
      );
      return;
    }

    try {
      setGoogleLoading(true);
      
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();
      
      // Sign in to get userInfo and idToken
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      if (!idToken) {
        throw new Error("Token Google introuvable");
      }

      // Send the token to our Next.js API
      const response = await axios.post(`${API_URL}/auth/google`, {
        idToken,
      });

      const { token, user } = response.data;
      await saveAuthData(token, user);

      Alert.alert("Succès", `Bienvenue ${user.name} !`);
      router.back();

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert("Erreur", "Google Play Services non disponible.");
      } else {
        const message = error.response?.data?.error || error.message || "Erreur Google Auth";
        Alert.alert("Erreur de connexion", message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center px-6">
      <View className="mb-8">
        <Text className="text-white font-extrabold text-4xl mb-2 text-center">
          Connexion
        </Text>
        <Text className="text-slate-400 text-base text-center">
          Connectez-vous à votre compte Maths-Exams
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleGoogleLogin}
        disabled={googleLoading || loading}
        className={`bg-white rounded-xl py-3.5 flex-row items-center justify-center shadow-lg mb-6 ${(googleLoading || loading) ? "opacity-70" : ""}`}
      >
        {googleLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <>
            <Ionicons name="logo-google" size={24} color="#db4437" />
            <Text className="text-slate-800 font-bold text-lg ml-3">Continuer avec Google</Text>
          </>
        )}
      </TouchableOpacity>

      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-slate-700" />
        <Text className="text-slate-500 px-4 font-semibold">OU</Text>
        <View className="flex-1 h-px bg-slate-700" />
      </View>

      <View className="mb-4">
        <Text className="text-slate-300 font-bold mb-2">Email</Text>
        <TextInput
          className="bg-slate-800 text-white p-4 rounded-xl"
          placeholder="votre@email.com"
          placeholderTextColor="#64748b"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View className="mb-8">
        <Text className="text-slate-300 font-bold mb-2">Mot de passe</Text>
        <TextInput
          className="bg-slate-800 text-white p-4 rounded-xl"
          placeholder="********"
          placeholderTextColor="#64748b"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading || googleLoading}
        className={`bg-blue-600 rounded-xl py-4 items-center shadow-lg ${(loading || googleLoading) ? "opacity-70" : ""}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">Se connecter</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
