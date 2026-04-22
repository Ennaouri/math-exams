import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Les deux mots de passe sont requis" },
        { status: 400 }
      );
    }

    const hashedCurrentPassword = crypto
      .createHash("sha256")
      .update(currentPassword)
      .digest("hex");

    const hashedNewPassword = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");

    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND password = $2",
      [session.user.email, hashedCurrentPassword]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedNewPassword, session.user.email]
    );

    return NextResponse.json({ message: "Mot de passe modifié" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}