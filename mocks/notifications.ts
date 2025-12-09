export type NotificationType = 'application' | 'match' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  applicantName?: string;
  jobTitle?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'application',
    title: 'New Application Received',
    message: 'has applied for your Social Media Manager position.',
    timestamp: '2 hours ago',
    read: false,
    applicantName: 'John Doe',
    jobTitle: 'Social Media Manager',
  },
  {
    id: '2',
    type: 'match',
    title: 'New Candidate Match',
    message:
      'matches your search criteria for Full-Stack Developer. View their profile to learn more.',
    timestamp: '5 hours ago',
    read: false,
    applicantName: 'Jane Smith',
  },
  {
    id: '3',
    type: 'application',
    title: 'New Application Received',
    message: 'has applied for your Frontend Developer position.',
    timestamp: '1 day ago',
    read: true,
    applicantName: 'Mike Johnson',
    jobTitle: 'Frontend Developer',
  },
  {
    id: '4',
    type: 'system',
    title: 'Subscription Expiring Soon',
    message:
      'Your premium subscription will expire in 7 days. Renew now to continue enjoying premium features.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'match',
    title: 'New Candidate Match',
    message: 'matches your search criteria for Data Engineer.',
    timestamp: '3 days ago',
    read: true,
    applicantName: 'Sarah Williams',
  },
];
