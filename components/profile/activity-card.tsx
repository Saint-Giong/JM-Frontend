'use client';

import {
  type Activity,
  useActivityPost,
} from '@/components/headless/activity-post';
import { Card } from '@saint-giong/bamboo-ui';
import { Clock, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ActivityCardProps {
  activity: Activity;
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
}

export function ActivityCard({
  activity,
  onEdit,
  onDelete,
}: ActivityCardProps) {
  const { timeAgo, hasImage, cardProps, timestampProps } = useActivityPost({
    activity,
    onEdit,
    onDelete,
  });

  return (
    <Card className="overflow-hidden" {...cardProps}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch px-5">
        <div className="flex-[2] space-y-4 sm:pr-8">
          <time
            className="flex items-center gap-2 text-muted-foreground text-sm"
            {...timestampProps}
          >
            <Clock className="h-4 w-4" />
            <span>{timeAgo}</span>
          </time>

          <p className="text-foreground leading-relaxed">{activity.content}</p>
        </div>

        {/* Image Section - 60% */}
        {hasImage && (
          <div className="relative flex-[3] bg-muted/50">
            <div className="relative h-full min-h-[400px] w-full sm:min-h-[500px]">
              <Image
                src={activity.imageUrl!}
                alt="Activity media"
                fill
                className="object-cover rounded-md"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
