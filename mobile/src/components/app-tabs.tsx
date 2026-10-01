import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#0f172a", borderTopColor: "#1e293b" },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoris",
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      {/* Hide other routes from tabs */}
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="category/[slug]" options={{ href: null }} />
      <Tabs.Screen name="undercategory/[slug]" options={{ href: null }} />
      <Tabs.Screen name="post/[slug]" options={{ href: null }} />
    </Tabs>
  );
}
