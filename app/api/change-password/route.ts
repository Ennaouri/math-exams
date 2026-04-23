import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import bcrypt from 'bcrypt';

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

    const result = await pool.query(
      'SELECT password FROM users WHERE email = $1',
      [session.user.email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const storedHash = result.rows[0].password;
    if (!storedHash) {
      return NextResponse.json({ error: "Mot de passe non défini" }, { status: 400 });
    }

    const validPassword = await bcrypt.compare(currentPassword, storedHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 400 }
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedNewPassword, session.user.email]
    );

    return NextResponse.json({ message: "Mot de passe modifié" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}