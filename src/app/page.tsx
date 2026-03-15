import { Inspiration, Favorite } from '@/lib/db';
import ClientPage from '@/components/ClientPage';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sessionToken")?.value ? parseInt(cookieStore.get("sessionToken")!.value) : null;

  const pinsData = await Inspiration.findAll({ order: [['createdAt', 'DESC']] });

  let favoriteIds = new Set<number>();
  if (userId) {
    const userFavorites = await Favorite.findAll({ where: { userId } });
    favoriteIds = new Set(userFavorites.map(f => f.inspirationId));
  }

  const pins = pinsData.map(pin => ({
    id: pin.id,
    title: pin.title,
    imageUrl: pin.imageUrl,
    category: pin.category,
    userId: pin.userId,
    isFavorite: favoriteIds.has(pin.id) 
  }));

  return <ClientPage initialPins={pins} currentUserId={userId} />;
}