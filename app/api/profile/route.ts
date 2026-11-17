import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, pool } from "@/lib/db";
import { getAuthUser, signToken } from "@/lib/serverAuth";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rows = await query<any>(
      "SELECT id, username, email, phone, role FROM User WHERE id = ?",
      [user.id]
    );

    if (!rows.length) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userProfile = rows[0];
    return NextResponse.json({
      ...userProfile,
      user: userProfile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, email, phone, currentPassword, newPassword } = body;

    if (username?.trim()) {
      await pool.execute("UPDATE User SET username = ? WHERE id = ?", [username.trim(), user.id]);
    }
    if (phone !== undefined) {
      await pool.execute("UPDATE User SET phone = ? WHERE id = ?", [phone?.trim() ?? null, user.id]);
    }

    if (email?.trim() && email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = await query<any>(
        "SELECT id FROM User WHERE LOWER(email) = LOWER(?) AND id != ?",
        [normalizedEmail, user.id]
      );
      if (existing.length > 0) {
        return NextResponse.json({ message: "Email is already taken" }, { status: 400 });
      }
      await pool.execute("UPDATE User SET email = ? WHERE id = ?", [normalizedEmail, user.id]);
    }

    if (currentPassword && newPassword) {
      const dbUsers = await query<any>(
        "SELECT password FROM User WHERE id = ?",
        [user.id]
      );
      if (!dbUsers.length) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const match = await bcrypt.compare(currentPassword, dbUsers[0].password);
      if (!match) {
        return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { message: "New password must be at least 8 characters." },
          { status: 400 }
        );
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await pool.execute("UPDATE User SET password = ? WHERE id = ?", [hashed, user.id]);
    }

    const rows = await query<any>(
      "SELECT id, username, email, phone, role FROM User WHERE id = ?",
      [user.id]
    );

    const updatedUser = rows[0];
    const token = signToken({ email: updatedUser.email, role: updatedUser.role });

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: updatedUser,
      token,
      ...updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
