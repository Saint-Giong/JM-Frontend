export interface MockUser {
  id: string;
  email: string;
  password: string;
  companyName?: string;
  country: string;
  dialCode?: string;
  phoneNumber?: string;
  city?: string;
  address?: string;
  createdAt: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'Admin123!',
    companyName: 'Acme Corp',
    country: 'United States',
    dialCode: '+1',
    phoneNumber: '5551234567',
    city: 'New York',
    address: '123 Main St',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'user@test.com',
    password: 'Test@1234',
    companyName: 'Test Company',
    country: 'United Kingdom',
    dialCode: '+44',
    phoneNumber: '7911123456',
    city: 'London',
    address: '456 High Street',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    email: 'demo@demo.com',
    password: 'Demo#5678',
    companyName: '',
    country: 'Germany',
    dialCode: '+49',
    phoneNumber: '1512345678',
    city: 'Berlin',
    address: '',
    createdAt: '2024-03-10T09:15:00Z',
  },
  {
    id: '4',
    email: 'jane.doe@company.com',
    password: 'Jane$2024',
    companyName: 'Jane Enterprises',
    country: 'Canada',
    dialCode: '+1',
    phoneNumber: '4165551234',
    city: 'Toronto',
    address: '789 Queen St W',
    createdAt: '2024-04-05T16:45:00Z',
  },
  {
    id: '5',
    email: 'dev@localhost.com',
    password: 'Dev!9999',
    country: 'Australia',
    dialCode: '+61',
    phoneNumber: '412345678',
    createdAt: '2024-05-01T08:00:00Z',
  },
];

// utils
export function findUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export function validateCredentials(
  email: string,
  password: string
): MockUser | null {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}

export function isEmailTaken(email: string): boolean {
  return mockUsers.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export function createMockUser(
  data: Omit<MockUser, 'id' | 'createdAt'>
): MockUser {
  const newUser: MockUser = {
    ...data,
    id: String(mockUsers.length + 1),
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return newUser;
}

// test
export const testCredentials = {
  admin: { email: 'admin@example.com', password: 'Admin123!' },
  user: { email: 'user@test.com', password: 'Test@1234' },
  demo: { email: 'demo@demo.com', password: 'Demo#5678' },
} as const;
