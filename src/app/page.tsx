import { Inspiration, Favorite } from '@/lib/db';
import ClientPage from '@/components/ClientPage';

export default async function Home() {

  const pinsData = await Inspiration.findAll({
    order: [['createdAt', 'DESC']],
  });


  const userFavorites = await Favorite.findAll({
    where: { userId: 1 }
  });

  const favoriteIds = new Set(userFavorites.map(f => f.inspirationId));


  const pins = pinsData.map(pin => ({
    id: pin.id,
    title: pin.title,
    imageUrl: pin.imageUrl,
    category: pin.category,
    userId: pin.userId,
    isFavorite: favoriteIds.has(pin.id) 
  }));

  return <ClientPage initialPins={pins} currentUserId={1} />;
}