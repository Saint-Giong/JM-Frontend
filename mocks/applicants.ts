import type {
  Applicant,
  ApplicantMark,
  EducationDegree,
  EmploymentType,
} from '@/components/applicant/types';

const firstNames = [
  'Nguyen',
  'Tran',
  'Le',
  'Pham',
  'Hoang',
  'Vo',
  'Bui',
  'Dang',
  'Do',
  'Ngo',
  'Duong',
  'Ly',
  'Truong',
  'Dinh',
  'Mai',
  'Vu',
  'Cao',
  'Lam',
  'Ta',
  'Trinh',
];

const lastNames = [
  'Van Minh',
  'Thi Lan',
  'Hoang Nam',
  'Duc Anh',
  'Minh Thu',
  'Van Tuan',
  'Thi Hoa',
  'Quang Huy',
  'Thanh Son',
  'Ngoc Linh',
  'Hai Long',
  'Phuong Mai',
  'Duc Thang',
  'Thi Ngoc',
  'Minh Quan',
  'Van Khanh',
  'Thi Huong',
  'Anh Tuan',
  'Ngoc Anh',
  'Van Dat',
];

const cities = [
  'Ho Chi Minh City',
  'Hanoi',
  'Da Nang',
  'Can Tho',
  'Hai Phong',
  'Bien Hoa',
  'Nha Trang',
];
const countries = ['Vietnam', 'Singapore', 'Thailand', 'Malaysia'];

const degrees: EducationDegree[] = ['bachelor', 'master', 'doctorate'];
const fields = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Data Science',
  'Business Analytics',
  'Electrical Engineering',
];
const institutions = [
  'HCMC University of Technology',
  'Hanoi University of Science and Technology',
  'FPT University',
  'Vietnam National University',
  'University of Da Nang',
  'Bach Khoa University',
];

const jobTitles = [
  'Software Engineer',
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Mobile Developer',
  'QA Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Cloud Architect',
  'System Administrator',
];

const companies = [
  'Tech Corp Vietnam',
  'FPT Software',
  'VNG Corporation',
  'Grab Vietnam',
  'Shopee Vietnam',
  'Tiki',
  'VNPAY',
  'Momo',
  'ZaloPay',
  'Viettel',
  'BIDV',
  'Techcombank',
];

const skillSets = [
  ['Java', 'Spring Boot', 'Kafka', 'Docker', 'Kubernetes', 'PostgreSQL'],
  ['React', 'TypeScript', 'JavaScript', 'CSS', 'Tailwind', 'Next.js'],
  ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Docker'],
  ['Python', 'Spark', 'Kafka', 'AWS', 'PostgreSQL', 'Airflow'],
  ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Python'],
  ['React Native', 'TypeScript', 'JavaScript', 'iOS', 'Android', 'Firebase'],
  ['Node.js', 'Express', 'MongoDB', 'Redis', 'GraphQL', 'Docker'],
  ['Go', 'gRPC', 'Kubernetes', 'PostgreSQL', 'Redis', 'Prometheus'],
  ['Vue.js', 'Nuxt.js', 'TypeScript', 'Tailwind', 'Pinia', 'Vitest'],
  ['Angular', 'RxJS', 'NgRx', 'TypeScript', 'Jest', 'Cypress'],
];

const objectiveSummaries = [
  'Experienced software engineer with strong background in backend development. Passionate about building scalable distributed systems.',
  'Frontend developer focused on creating beautiful and accessible user interfaces. Strong background in React ecosystem.',
  'Full stack developer with expertise in modern web technologies. Enjoys solving complex problems and learning new technologies.',
  'DevOps engineer passionate about automation and cloud-native technologies. AWS certified professional.',
  'Data engineer with expertise in building scalable data infrastructure. Experience in fintech and e-commerce domains.',
  'Mobile developer specializing in cross-platform development. Passionate about creating smooth and performant mobile experiences.',
  'Machine learning engineer with research background. Interested in applying AI to solve real-world problems.',
  'Product-minded engineer who loves building user-centric applications. Strong communication and collaboration skills.',
];

const employmentTypeSets: EmploymentType[][] = [
  ['full-time'],
  ['full-time', 'contract'],
  ['full-time', 'part-time'],
  ['full-time', 'internship'],
  ['contract'],
];

const marks: ApplicantMark[] = [
  'favorite',
  'warning',
  null,
  null,
  null,
  null,
  null,
  null,
];

function generateApplicant(id: number): Applicant {
  const firstName = firstNames[id % firstNames.length];
  const lastName = lastNames[id % lastNames.length];
  const city = cities[id % cities.length];
  const country = countries[id % countries.length];
  const degree = degrees[id % degrees.length];
  const field = fields[id % fields.length];
  const institution = institutions[id % institutions.length];
  const skills = skillSets[id % skillSets.length];
  const jobTitle = jobTitles[id % jobTitles.length];
  const company = companies[id % companies.length];
  const summary = objectiveSummaries[id % objectiveSummaries.length];
  const employmentTypes = employmentTypeSets[id % employmentTypeSets.length];
  const mark = marks[id % marks.length];

  const hasExperience = id % 5 !== 0; // 20% have no experience
  const graduationYear = 2018 + (id % 6);

  return {
    id: String(id),
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}${id}@email.com`,
    city,
    country,
    highestDegree: degree,
    education: [
      {
        degree,
        field,
        institution,
        graduationYear,
      },
      ...(degree !== 'bachelor'
        ? [
            {
              degree: 'bachelor' as EducationDegree,
              field: 'Computer Science',
              institution: institutions[(id + 1) % institutions.length],
              graduationYear: graduationYear - 2,
            },
          ]
        : []),
    ],
    workExperience: hasExperience
      ? [
          {
            title: jobTitle,
            company,
            startDate: `${2020 + (id % 4)}-0${1 + (id % 9)}`,
            endDate: null,
            description: `Working on ${skills.slice(0, 3).join(', ')} projects. Building scalable solutions for enterprise clients.`,
          },
          ...(id % 3 === 0
            ? [
                {
                  title: jobTitles[(id + 5) % jobTitles.length],
                  company: companies[(id + 3) % companies.length],
                  startDate: `${2018 + (id % 3)}-0${1 + (id % 9)}`,
                  endDate: `${2020 + (id % 4)}-0${1 + (id % 9)}`,
                  description: `Previous role working with ${skills.slice(2, 5).join(', ')}.`,
                },
              ]
            : []),
        ]
      : [],
    objectiveSummary: summary,
    skills,
    employmentTypes,
    mark,
  };
}

// Generate 150 applicants (15 pages × 10 items)
export const mockApplicants: Applicant[] = Array.from({ length: 150 }, (_, i) =>
  generateApplicant(i + 1)
);
