"use server";

import { User } from "@/lib/db";
import * as bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ModelStatic, Model } from "sequelize";


interface UserInstance extends Model {
  id: number;
  username: string;
  email: string;
  password: string;
}

export const loginUserAction = async (formData: FormData): Promise<void> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return;

  
  const UserWithTypes = User as ModelStatic<UserInstance>;

  const user = await UserWithTypes.findOne({
    where: { email: email }
  });

  if (!user) {
    console.log("Email oder Passwort ist falsch");
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    console.log("Email oder Passwort ist falsch");
    return;
  }

  const cookieStore = await cookies();
  await cookieStore.set("sessionToken", String(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  
  return redirect("/");
};

export const registerUserAction = async (
  prevState: unknown, 
  formData: FormData
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  if (!email || !password || !username) {
    return { error: "Alle Felder sind Pflichtfelder." };
  }

  const UserWithTypes = User as ModelStatic<UserInstance>;

  try {
    const existingUser = await UserWithTypes.findOne({
      where: { email: email }
    });

    if (existingUser) {
      return { error: "Diese Email ist bereits vergeben!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserWithTypes.create({
      username,
      email,
      password: hashedPassword,
    });
  } catch (err: unknown) { 
    console.error(err);
    return { error: "Fehler bei der Registrierung." };
  }

  redirect("/login");
};

export const logoutUserAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("sessionToken");
  redirect("/login");
};