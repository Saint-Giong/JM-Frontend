import type { Activity } from '@/components/headless/activity-post';

export const mockActivities: Activity[] = [
  {
    id: '1',
    content:
      'Lorem ipsum dolor sit amet consectetur. Posuere amet ac eu viverra.',
    createdAt: '2025-12-14T14:30:00',
  },
  {
    id: '2',
    content:
      'We are excited to announce our new office opening in District 7! Join us for the grand opening celebration next week.',
    imageUrl: '/DEVision-light.png',
    createdAt: '2025-12-12T10:15:00',
  },
  {
    id: '3',
    content:
      'Our team just completed a successful hackathon! Amazing projects were built in just 48 hours.',
    imageUrl:
      'https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/images/news/hackathon-sgs-overview-900x600.jpg',
    createdAt: '2025-12-07T16:45:00',
  },
];
