"use server";

import { Inspiration, Favorite } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';


async function getAuthUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;
  return token ? parseInt(token) : null;
}

export async function createInspirationAction(data: { title: string; imageUrl: string; category: string }) {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Nicht autorisiert");

    await Inspiration.create({
      title: data.title,
      imageUrl: data.imageUrl,
      category: data.category,
      userId: userId, 
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error("Fehler beim Erstellen:", err); 
    return { success: false, error: "Fehler beim Speichern" };
  }
}

export async function deleteInspirationAction(id: number) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return { success: false };

    await Inspiration.destroy({ 
      where: { 
        id: id, 
        userId: userId 
      } 
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error("Löschfehler:", err);
    return { success: false };
  }
}

export async function toggleFavoriteAction(inspirationId: number) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return { success: false };
    
    const favorite = await Favorite.findOne({
      where: { userId, inspirationId }
    });

    if (favorite) {
      await Favorite.destroy({ where: { userId, inspirationId } });
    } else {
      await Favorite.create({ userId, inspirationId });
    }

    revalidatePath('/'); 
    return { success: true };
  } catch (err) {
    console.error("Favorite-Fehler:", err);
    return { success: false };
  }
}