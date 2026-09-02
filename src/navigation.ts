export const localePrefix = 'always';

export const pathnames = {
  '/': '/',
  '/services': {
    zh: '/services',
    en: '/services',
  },
  '/booking': {
    zh: '/booking',
    en: '/booking',
  },
  '/portfolio': {
    zh: '/portfolio',
    en: '/portfolio',
  },
  '/players': {
    zh: '/players',
    en: '/players',
  },
  '/assessment': {
    zh: '/assessment',
    en: '/assessment',
  },
  '/community': {
    zh: '/community',
    en: '/community',
  },
  '/about': {
    zh: '/about',
    en: '/about',
  },
  '/admin': {
    zh: '/admin',
    en: '/admin',
  },
} as const;

export type AppPathnames = keyof typeof pathnames;
