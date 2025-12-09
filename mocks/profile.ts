export interface JobPost {
  id: string;
  title: string;
  description: string;
  skills: string[];
  postedAt: string;
  type: string;
  location: string;
  salary: string;
}

export const mockJobPosts: JobPost[] = [
  {
    id: '1',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque tellus lacus id praesent sapien in volutpat. Vitae sed nisl enim nibh lacus quis ultrices lorem. At...',
    skills: ['Skill', 'Tag'],
    postedAt: 'A day ago',
    type: 'Full-time',
    location: 'Ho Chi Minh City, Vietnam',
    salary: '30,000 - 80,000 USD',
  },
  {
    id: '2',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque tellus lacus id praesent sapien in volutpat. Vitae sed nisl enim nibh lacus quis ultrices lorem. At...',
    skills: ['Skill', 'Tag'],
    postedAt: 'A day ago',
    type: 'Full-time',
    location: 'Ho Chi Minh City, Vietnam',
    salary: '30,000 - 80,000 USD',
  },
  {
    id: '3',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque tellus lacus id praesent sapien in volutpat. Vitae sed nisl enim nibh lacus quis ultrices lorem. At...',
    skills: ['Skill', 'Tag'],
    postedAt: 'A day ago',
    type: 'Full-time',
    location: 'Ho Chi Minh City, Vietnam',
    salary: '30,000 - 80,000 USD',
  },
];

export const defaultProfileContent = {
  aboutUs:
    'Lorem ipsum dolor sit amet consectetur. Posuere amet ac eu viverra. Praesent nunc aenean non est lacus nam aliquam non sagittis. Tortor enim suspendisse porta id. Libero egestas est vitae commodo ut. Adipiscing at diam phasellus laoreet sed id. Neque sed quis feugiat non facilisi erat. Tortor bibendum et libero proin nulla et eget aliquam. Velit odio nunc eros bibendum ut aliquam quam sit cras. Risus nisl viverra in sagittis. Faucibus consectetur lorem tellus egestas sagittis est.',
  whoWeAreLookingFor:
    'Lorem ipsum dolor sit amet consectetur. Posuere amet ac eu viverra. Praesent nunc aenean non est lacus nam aliquam non sagittis. Tortor enim suspendisse porta id. Libero egestas est vitae commodo ut. Adipiscing at diam phasellus laoreet sed id. Neque sed quis feugiat non facilisi erat. Tortor bibendum et libero proin nulla et eget aliquam. Velit odio nunc eros bibendum ut aliquam quam sit cras. Risus nisl viverra in sagittis. Faucibus consectetur lorem tellus egestas sagittis est. Quisque ac enim diam nunc et morbi enim vitae eu. Ultrices odio nullam egestas aliquam id quis consectetur porttitor.',
};
