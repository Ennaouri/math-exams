import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { getUserByEmail, createUser } from "@/lib/db";
import jwt from "jsonwebtoken";

// ID Client Web (le même utilisé pour NextAuth)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "215811155499-sv2k7gsg9mrpcpdtjdhm80crcq31s683.apps.googleusercontent.com";
const JWT_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret-for-jwt";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: "Token Google manquant" }, { status: 400 });
    }

    // Verify the Google ID Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID, 
    });

    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const { email, name, picture } = payload;

    // Check if user exists
    let user = await getUserByEmail(email);

    // If not, create them
    if (!user) {
      // Create user with a random password since they use Google Auth
      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
      
      const newUser = await createUser({
        name: name || email.split("@")[0],
        email,
        password: randomPassword,
        role: "etudiant", // Default role
      });
      
      if (!newUser) {
        return NextResponse.json({ error: "Erreur création compte" }, { status: 500 });
      }
      
      user = newUser;
    }
    
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé après création" }, { status: 500 });
    }

    // Generate JWT for mobile app
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ token, user: userWithoutPassword });

  } catch (error: any) {
    console.error("Google Auth error:", error);
    return NextResponse.json({ error: "Erreur d'authentification", details: error.message }, { status: 500 });
  }
}
