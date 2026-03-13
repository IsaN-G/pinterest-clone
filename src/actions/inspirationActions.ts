"use server";

import { Inspiration, Favorite } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createInspirationAction(data: { title: string; imageUrl: string; category: string }) {
  try {
 
    const userId = 1; 

    await Inspiration.create({
      title: data.title,
      imageUrl: data.imageUrl,
      category: data.category,
      userId: userId, 
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Fehler beim Erstellen:", error);
    return { success: false, error: "Fehler beim Speichern" };
  }
}


export async function deleteInspirationAction(id: number) {
  try {
    await Inspiration.destroy({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}


export async function toggleFavoriteAction(inspirationId: number) {
  try {
    const userId = 1; 
    
    const favorite = await Favorite.findOne({
      where: { userId, inspirationId }
    });

    if (favorite) {
     
      await Favorite.destroy({
        where: { userId, inspirationId }
      });
    } else {
     
      await Favorite.create({ 
        userId, 
        inspirationId 
      });
    }

    revalidatePath('/'); 
    
    return { success: true };
  } catch (error) {
    console.error("Fehler beim Favorisieren:", error);
    return { success: false };
  }
}