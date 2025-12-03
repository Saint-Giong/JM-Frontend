// Zustand store
export {
  createJobCardStore,
  type JobCardStore,
  type UseJobCardStore,
} from './job-card-store';

// Headless context and hooks
export {
  JobCardProvider,
  useJobCard,
  useJobCardContext,
  useJobCardStore,
  type Job,
  type JobStatus,
} from './job-card-context';

// Headless composable parts
export {
  JobCardRoot,
  JobCardStatus,
  JobCardApplicants,
  JobCardTitle,
  JobCardDescription,
  JobCardSkills,
  JobCardTags,
  JobCardMeta,
  JobCardEditButton,
  JobCardMenuButton,
  useJobData,
  defaultStatusConfig,
} from './job-card-parts';

// Default styled composition
export { JobCard } from './job-card';
