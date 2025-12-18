'use client';

import {
  type Activity,
  useActivityList,
} from '@/components/headless/activity-post';
import { ActivityCard } from '@/components/profile';
import { Button, Card } from '@saint-giong/bamboo-ui';
import { Plus } from 'lucide-react';

export type { Activity } from '@/components/headless/activity-post';

interface ActivitiesSectionProps {
  activities: Activity[];
  onAddActivity?: () => void;
}

export function ActivitiesSection({
  activities,
  onAddActivity,
}: ActivitiesSectionProps) {
  const { isEmpty, listProps } = useActivityList({ activities });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="section-heading">Activities</h3>
        <Button
          size="icon"
          variant="default"
          className="h-8 w-8 rounded-sm"
          onClick={onAddActivity}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="space-y-4" {...listProps}>
        {!isEmpty ? (
          activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No activities yet. Click the + button to add your first post.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
