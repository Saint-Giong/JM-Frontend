import { cn } from '@saint-giong/bamboo-ui';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ComponentProps } from 'react';

function Breadcrumb({ className, ...props }: ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" className={className} {...props} />;
}

function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return <ol className={cn('flex gap-2', className)} {...props} />;
}

function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return <li className={cn('inline-flex', className)} {...props} />;
}

function BreadcrumbLink({
  className,
  href,
  ...props
}: ComponentProps<'a'> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn('text-muted-foreground hover:underline', className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-current="page"
      className={cn('font-medium', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li role="presentation" aria-hidden="true" className={className} {...props}>
      {props.children ?? (
        <ChevronRight className="mx-2 inline size-4 text-muted-foreground" />
      )}
    </li>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
