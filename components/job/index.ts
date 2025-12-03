// Headless hook - the core of the headless architecture
export {
  useJobCard,
  type Job,
  type JobStatus,
  type UseJobCardOptions,
  type JobCardStatus,
  type JobCardApplicants,
  type JobCardSalary,
  type JobCardMeta,
  type JobCardActions,
  type JobCardReturn,
} from './use-job-card';

// Styled UI component - example implementation using the headless hook
export { JobCard } from './job-card';
