import { sequelize, Inspiration, User } from '../src/lib/db'; 

async function seed() {
  try {
    await sequelize.authenticate();
    
  
    const [user] = await User.findOrCreate({
      where: { username: 'Admin' },
      defaults: { username: 'Admin', password: '123', email: 'admin@test.de' }
    });

  
    const adminId = user.get('id');
    console.log(`✅ Nutze User-ID: ${adminId}`);

   
    await Inspiration.destroy({ where: {}, truncate: true, cascade: true });
    console.log("🧹 Datenbank geleert.");

 
    const data = [
      { title: "Blauer Schuh", imageUrl: "cld-sample-5", category: "Mode", userId: adminId },
      { title: "Schneebereifte Berge", imageUrl: "cld-sample-2", category: "Natur", userId: adminId },
      { title: "Leckeres Essen", imageUrl: "cld-sample-4", category: "Kunst", userId: adminId }
    ];

    for (const item of data) {
      await Inspiration.create(item);
      console.log(`🚀 Erstellt: ${item.title} mit Image: ${item.imageUrl}`);
    }

  } catch (err) { console.error("❌ Fehler:", err); }
  finally { await sequelize.close(); }
}
seed();