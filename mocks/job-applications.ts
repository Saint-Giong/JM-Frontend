import type {
  ApplicationStatus,
  JobApplication,
  JobPost,
} from '@/components/job/types';
import { mockApplicants } from './applicants';

// Cover letter templates
const coverLetterTemplates = [
  'I am excited to apply for this position. With my background in software development and passion for building scalable solutions, I believe I would be a great fit for your team.',
  'I am writing to express my strong interest in this role. My experience aligns well with the requirements, and I am eager to contribute to your company.',
  'Having followed your company for some time, I am thrilled at the opportunity to apply. My skills in modern technologies make me well-suited for this position.',
  'I am applying for this position with great enthusiasm. My technical background and collaborative approach would allow me to make immediate contributions.',
  'This role caught my attention as it perfectly matches my career goals and expertise. I am confident that my experience would be valuable to your team.',
];

// Application statuses with weighted distribution
const applicationStatuses: ApplicationStatus[] = [
  'pending',
  'pending',
  'pending',
  'pending',
  'favorite',
  'favorite',
  'archived',
  'hiring',
];

// Extended mock jobs with new salary format
export const mockJobPosts: JobPost[] = [
  {
    id: '1',
    title: 'Social Media Manager',
    description: `Lorem ipsum dolor sit amet consectetur. Et sit etiam blandit sit. Dictum duis laoreet nulla sed nunc ac. Feugiat posuere sit auctor ultrices enim integer dui. Potenti consequat neque arcu sem semper curabitur tempor est nunc. Phasellus adipiscing fermentum scelerisque ullamcorper tempus vestibulum hendrerit. Nec in quis quisque odio quis quam tristique accumsan. Cursus eu dictumst scelerisque pulvinar tristique. Quis porta enim amet faucibus at non pulvinar nulla congue. Ut dui ut fermentum elit etiam. Molestie sapien posuere vitae egestas at luctus felis.

Sed in lacinia fringilla nisl dui faucibus dolor vehicula. Imperdiet mattis justo curabitur netus arcu. Eget eu purus molestie morbi hendrerit sed. Quam pharetra sed morbi turpis amet condimentum nibh aliquet massa. Hac ipsum potenti sed nam augue mi nisl egestas libero. In quam augue mi mi aliquet lectus. Turpis elementum lobortis facilisis id at sit sagittis. Ornare blandit suspendisse justo amet malesuada nibh lacinia. Mattis quis bibendum cursus in. Pulvinar erat posuere in mauris arcu malesuada at. Amet ullamcorper eleifend leo lorem cum consectetur aliquet. Quis morbi ultricies non velit tellus aliquam nibh aliquam libero. Volutpat nulla praesent imperdiet malesuada vestibulum viverra tincidunt ullamcorper ut. Ut ipsum suspendisse at diam lectus pretium fringilla aliquet.

- Proin ultrices nascetur adipiscing ultrices neque erat.
- Cras pharetra etiam erat facilisis placerat risus duis odio.
- Nulla pellentesque quis magnis suspendisse.
- Blandit amet faucibus faucibus ultrices pharetra nunc potenti.
- Vel arcu tellus rutrum semper in purus vel congue.
- Enim sit consequat leo eleifend nascetur ipsum magna.
- Sit at fusce maecenas etiam id at.

Enim quam cras consequat nascetur donec diam quisque vel. Scelerisque aliquet commodo ullamcorper turpis eget integer non vel. Purus sed amet mauris consectetur. Odio tincidunt imperdiet augue venenatis. In elit non penatibus odio etiam sit venenatis orci.`,
    status: 'published',
    employmentTypes: ['full-time'],
    postedAt: 'A day ago',
    expiryDate: '01 November 2026',
    salary: { type: 'range', min: 30000, max: 80000, currency: 'USD' },
    location: 'Ho Chi Minh City',
    skills: ['Skill', 'Tag'],
    applicantCount: 10,
    hasNewApplicants: true,
  },
  {
    id: '2',
    title: 'Senior Full-Stack Developer',
    description:
      'We are looking for an experienced full-stack developer to join our engineering team. You will work on building scalable web applications using modern technologies.',
    status: 'hiring',
    employmentTypes: ['full-time', 'contract'],
    postedAt: '3 days ago',
    expiryDate: '15 December 2026',
    salary: { type: 'range', min: 4000, max: 7000, currency: 'USD' },
    location: 'Ho Chi Minh City, Vietnam',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    applicantCount: 25,
    hasNewApplicants: true,
  },
  {
    id: '3',
    title: 'Junior Data Analyst',
    description:
      'Join our data team as a junior analyst. You will help analyze business data and create insightful reports for stakeholders.',
    status: 'published',
    employmentTypes: ['full-time', 'internship'],
    postedAt: '1 week ago',
    salary: {
      type: 'estimation',
      estimationType: 'up-to',
      amount: 2000,
      currency: 'USD',
    },
    location: 'Hanoi, Vietnam',
    skills: ['Python', 'SQL', 'Excel', 'Tableau'],
    applicantCount: 42,
    hasNewApplicants: false,
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    description:
      'We need a DevOps engineer to help us build and maintain our cloud infrastructure. Experience with AWS and Kubernetes required.',
    status: 'draft',
    employmentTypes: ['full-time'],
    postedAt: '2 weeks ago',
    expiryDate: '30 January 2027',
    salary: { type: 'range', min: 3500, max: 6000, currency: 'USD' },
    location: 'Remote',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
    applicantCount: 0,
    hasNewApplicants: false,
  },
  {
    id: '5',
    title: 'UI/UX Designer',
    description:
      'Creative designer needed to design user interfaces for our mobile and web applications. Strong portfolio required.',
    status: 'published',
    employmentTypes: ['part-time', 'contract'],
    postedAt: '5 days ago',
    salary: { type: 'negotiable' },
    location: 'Da Nang, Vietnam',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'UI Design', 'Prototyping'],
    applicantCount: 18,
    hasNewApplicants: true,
  },
  {
    id: '6',
    title: 'Backend Developer Intern',
    description:
      'Great opportunity for students to gain hands-on experience in backend development. Mentorship provided.',
    status: 'hiring',
    employmentTypes: ['internship'],
    postedAt: '1 day ago',
    expiryDate: '28 February 2027',
    salary: {
      type: 'estimation',
      estimationType: 'about',
      amount: 500,
      currency: 'USD',
    },
    location: 'Ho Chi Minh City, Vietnam',
    skills: ['Java', 'Spring Boot', 'SQL'],
    applicantCount: 35,
    hasNewApplicants: true,
  },
  {
    id: '7',
    title: 'Product Manager',
    description:
      'Experienced product manager to lead our product development initiatives. Strong communication and leadership skills required.',
    status: 'archived',
    employmentTypes: ['full-time'],
    postedAt: '1 month ago',
    salary: {
      type: 'estimation',
      estimationType: 'from',
      amount: 5000,
      currency: 'USD',
    },
    location: 'Singapore',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis'],
    applicantCount: 67,
    hasNewApplicants: false,
  },
  {
    id: '8',
    title: 'Mobile Developer',
    description:
      'Looking for a mobile developer proficient in React Native to build cross-platform mobile applications.',
    status: 'published',
    employmentTypes: ['full-time', 'contract'],
    postedAt: '4 days ago',
    expiryDate: '20 March 2027',
    salary: { type: 'range', min: 2500, max: 4500, currency: 'USD' },
    location: 'Ho Chi Minh City, Vietnam',
    skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Firebase'],
    applicantCount: 22,
    hasNewApplicants: false,
  },
];

// Generate job applications by linking applicants to jobs
function generateApplications(): JobApplication[] {
  const applications: JobApplication[] = [];
  let applicationId = 1;

  // For each job with applicants, create applications
  mockJobPosts.forEach((job) => {
    const numApplications = Math.min(job.applicantCount, 15); // Max 15 applications per job for mock

    for (let i = 0; i < numApplications; i++) {
      const applicantIndex =
        (parseInt(job.id, 10) * 7 + i) % mockApplicants.length;
      const applicant = mockApplicants[applicantIndex];
      const status =
        applicationStatuses[(applicationId + i) % applicationStatuses.length];
      const coverLetter = coverLetterTemplates[i % coverLetterTemplates.length];
      // Use deterministic math instead of random to prevent hydration mismatches
      const daysAgo = (i % 14) + 1;

      applications.push({
        id: `app-${applicationId}`,
        jobId: job.id,
        applicant,
        coverLetter,
        submittedAt: `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`,
        status,
        isMock: true,
      });

      applicationId++;
    }
  });

  return applications;
}

export const mockJobApplications: JobApplication[] = generateApplications();

// Helper to generate consistent mock applications for any job ID
function generateMockApplicationsForJob(jobId: string): JobApplication[] {
  // Simple hash function for consistent random generation
  const hash = jobId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Deterministic count between 5 and 25
  const count = 5 + (Math.abs(hash) % 21);

  const applications: JobApplication[] = [];

  for (let i = 0; i < count; i++) {
    // Pick an applicant deterministically based on job hash and index
    const applicantIndex = (Math.abs(hash) + i * 7) % mockApplicants.length;
    const applicant = mockApplicants[applicantIndex];

    // Pick status deterministically
    const statusIndex = (Math.abs(hash) + i) % applicationStatuses.length;
    const status = applicationStatuses[statusIndex];

    // Pick cover letter deterministically
    const letterIndex = (Math.abs(hash) + i) % coverLetterTemplates.length;
    const coverLetter = coverLetterTemplates[letterIndex];

    // Generate submitted date (1-30 days ago)
    const daysAgo = 1 + ((Math.abs(hash) + i * 3) % 30);

    applications.push({
      id: `mock-app-${jobId}-${i}`,
      jobId: jobId,
      applicant,
      coverLetter,
      submittedAt: `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`,
      status,
      isMock: true,
    });
  }

  return applications;
}

// Helper to get applications for a specific job
export function getApplicationsForJob(jobId: string): JobApplication[] {
  // First check if we have static mock applications for this job
  const staticApps = mockJobApplications.filter((app) => app.jobId === jobId);

  // If we have static apps (for static mock jobs), return them
  if (staticApps.length > 0) {
    return staticApps;
  }

  // Otherwise, generate mock applications for this job ID (for real jobs)
  return generateMockApplicationsForJob(jobId);
}

// Helper to get job post by ID
export function getJobPostById(jobId: string): JobPost | undefined {
  return mockJobPosts.find((job) => job.id === jobId);
}

// Helper to get application counts by status for a job
export function getApplicationCountsByStatus(
  jobId: string
): Record<ApplicationStatus | 'all', number> {
  const applications = getApplicationsForJob(jobId);
  return {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    favorite: applications.filter((a) => a.status === 'favorite').length,
    archived: applications.filter((a) => a.status === 'archived').length,
    hiring: applications.filter((a) => a.status === 'hiring').length,
  };
}
