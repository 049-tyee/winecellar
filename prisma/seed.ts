import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Seed services
  const services = [
    {
      name_key: 'services.list.coaching_1on1.name',
      description_key: 'services.list.coaching_1on1.desc',
      base_price: 15000,
      unit: 'hour',
      category: 'coaching',
      sort_order: 1,
    },
    {
      name_key: 'services.list.team_boost.name',
      description_key: 'services.list.team_boost.desc',
      base_price: 30000,
      unit: 'hour',
      category: 'coaching',
      sort_order: 2,
    },
    {
      name_key: 'services.list.demo_review_personal.name',
      description_key: 'services.list.demo_review_personal.desc',
      base_price: 5000,
      unit: 'map',
      category: 'demo_review',
      sort_order: 3,
    },
    {
      name_key: 'services.list.demo_review_team.name',
      description_key: 'services.list.demo_review_team.desc',
      base_price: 20000,
      unit: 'match',
      category: 'demo_review',
      sort_order: 4,
    },
    {
      name_key: 'services.list.team_sparring.name',
      description_key: 'services.list.team_sparring.desc',
      base_price: 10000,
      unit: 'hour',
      category: 'coaching',
      sort_order: 5,
    },
    {
      name_key: 'services.list.position_tutorial.name',
      description_key: 'services.list.position_tutorial.desc',
      base_price: 10000,
      unit: 'tier',
      category: 'tutorial',
      tier_levels: JSON.stringify([
        { key: 'basic', price: 10000, label_key: 'services.list.position_tutorial.tier_basic' },
        { key: 'advanced', price: 30000, label_key: 'services.list.position_tutorial.tier_advanced' },
        { key: 'master', price: 50000, label_key: 'services.list.position_tutorial.tier_master' },
      ]),
      sort_order: 6,
    },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { name_key: service.name_key },
    });
    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }

  console.log('Seeded services:', services.length);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
