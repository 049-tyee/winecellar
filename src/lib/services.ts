// 服务目录（与 PRD 定价一致），静态导出模式下由前端共享
export interface ServiceDef {
  key: string;
  price: number; // 元
  unit: 'hour' | 'map' | 'match' | 'tier';
  tiers?: { key: 'basic' | 'advanced' | 'master'; price: number }[];
}

export const SERVICES: ServiceDef[] = [
  { key: 'coaching_1on1', price: 150, unit: 'hour' },
  { key: 'team_boost', price: 300, unit: 'hour' },
  { key: 'demo_review_personal', price: 50, unit: 'map' },
  { key: 'demo_review_team', price: 200, unit: 'match' },
  { key: 'team_sparring', price: 100, unit: 'hour' },
  {
    key: 'position_tutorial',
    price: 100,
    unit: 'tier',
    tiers: [
      { key: 'basic', price: 100 },
      { key: 'advanced', price: 300 },
      { key: 'master', price: 500 },
    ],
  },
];
