import { Github, Globe, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meet the Saint Giong team behind DEVision Job Manager',
};

type Role = 'Project Manager' | 'Frontend Engineer' | 'Backend Engineer';

interface TeamMember {
  name: string;
  roles: Role[];
  email: string;
}

const jobManagerTeam: TeamMember[] = [
  {
    name: 'Phuc Vo Hoang',
    roles: ['Project Manager', 'Frontend Engineer'],
    email: 'S3926761@rmit.edu.vn',
  },
  {
    name: 'Quynh Nguyen Le Thuc',
    roles: ['Frontend Engineer'],
    email: 'S3924993@rmit.edu.vn',
  },
  {
    name: 'Tung Nguyen Son',
    roles: ['Backend Engineer'],
    email: 'S3979348@rmit.edu.vn',
  },
  {
    name: 'Viet Nguyen Dinh',
    roles: ['Backend Engineer'],
    email: 'S3927291@rmit.edu.vn',
  },
  {
    name: 'Ngoc Nguyen The Bao',
    roles: ['Backend Engineer'],
    email: 'S3924436@rmit.edu.vn',
  },
];

const jobApplicantTeam: TeamMember[] = [
  {
    name: 'Quoc Doan Huu',
    roles: ['Project Manager', 'Backend Engineer'],
    email: 'S3927776@student.rmit.edu.au',
  },
  {
    name: 'Tai Ngo Van',
    roles: ['Frontend Engineer'],
    email: 'S3974892@rmit.edu.vn',
  },
  {
    name: 'Huan Nguyen Dang',
    roles: ['Backend Engineer'],
    email: 'S3927467@rmit.edu.vn',
  },
  {
    name: 'Nhan Truong Vo Thien',
    roles: ['Backend Engineer'],
    email: 'S3929215@rmit.edu.vn',
  },
];

function TeamMemberCard({ member }: { member: TeamMember }) {
  const isManager = member.roles.includes('Project Manager');

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 ${isManager ? 'border-primary/50 bg-primary/5' : 'bg-card'}`}
    >
      <div className="flex flex-col">
        <span className="font-medium">{member.name}</span>
        <span
          className={`text-xs ${isManager ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {member.roles.join(', ')}
        </span>
      </div>
      <a
        href={`mailto:${member.email}`}
        className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-primary"
      >
        <Mail className="h-4 w-4" />
        <span className="hidden sm:inline">{member.email}</span>
      </a>
    </div>
  );
}

function TeamSection({
  title,
  members,
}: {
  title: string;
  members: TeamMember[];
}) {
  return (
    <section>
      <h2 className="mb-4 font-semibold text-xl">{title}</h2>
      <div className="grid gap-3">
        {members.map((member) => (
          <TeamMemberCard key={member.email} member={member} />
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert prose-h2:mt-10 max-w-none prose-headings:scroll-mt-20 prose-h2:border-border/40 prose-h2:border-b prose-h2:pb-3">
      <header className="not-prose mb-10 border-border/40 border-b pb-8">
        <h1 className="mb-3 font-bold text-4xl tracking-tight">About Us</h1>
        <p className="text-lg text-muted-foreground">
          Meet the team behind DEVision Job Manager
        </p>
      </header>

      <section>
        <h2>Saint Giong Squad</h2>
        <p>
          <strong>Saint Giong</strong> (Thanh Giong) is one of the four immortal
          heroes in Vietnamese folklore, symbolizing strength, strategic
          thinking, and community support — values that guide our development
          approach.
        </p>
        <p>
          We are students from RMIT University, working on the DEVision platform
          as part of the EEET2582/ISYS3461 course. Our squad is divided into two
          teams: Job Manager and Job Applicant.
        </p>
      </section>

      <section className="not-prose mt-10">
        <h2 className="mb-6 border-border/40 border-b pb-3 font-semibold text-xl">
          Our Teams
        </h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <TeamSection title="Job Manager Team" members={jobManagerTeam} />
          <TeamSection title="Job Applicant Team" members={jobApplicantTeam} />
        </div>
      </section>

      <section className="not-prose mt-12">
        <h2 className="mb-6 border-border/40 border-b pb-3 font-semibold text-xl">
          Links
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="https://jm.saintgiong.ttr.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <Globe className="h-5 w-5 text-primary" />
            <span className="font-medium">JM Frontend</span>
          </Link>
          <Link
            href="https://ja.saintgiong.ttr.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <Globe className="h-5 w-5 text-primary" />
            <span className="font-medium">JA Frontend</span>
          </Link>
          <Link
            href="https://docs.jm.saintgiong.ttr.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <Globe className="h-5 w-5 text-primary" />
            <span className="font-medium">Documentation</span>
          </Link>
          <Link
            href="https://github.com/Saint-Giong/JM-Frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <Github className="h-5 w-5 text-primary" />
            <span className="font-medium">GitHub</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
