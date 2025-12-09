'use client';

import {
  Button,
  Card,
  CardContent,
  Separator,
  Switch,
} from '@saint-giong/bamboo-ui';
import type { NotificationPreferences } from './types';

interface PreferenceItemProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function PreferenceItem({
  label,
  description,
  checked,
  onCheckedChange,
}: PreferenceItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <label className="font-medium text-sm">{label}</label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

interface NotificationPreferencesFormProps {
  preferences: NotificationPreferences;
  isSaving: boolean;
  onUpdatePreference: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => void;
  onSave: () => void;
}

export function NotificationPreferencesForm({
  preferences,
  isSaving,
  onUpdatePreference,
  onSave,
}: NotificationPreferencesFormProps) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="mb-4 font-semibold text-lg">Email Notifications</h3>
          <div className="space-y-4">
            <PreferenceItem
              label="Email Notifications"
              description="Receive notifications via email"
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) =>
                onUpdatePreference('emailNotifications', checked)
              }
            />

            <Separator />

            <PreferenceItem
              label="Weekly Digest"
              description="Receive a weekly summary of your recruitment activity"
              checked={preferences.weeklyDigest}
              onCheckedChange={(checked) =>
                onUpdatePreference('weeklyDigest', checked)
              }
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-4 font-semibold text-lg">Push Notifications</h3>
          <div className="space-y-4">
            <PreferenceItem
              label="Application Alerts"
              description="Get notified when someone applies to your job posts"
              checked={preferences.applicationAlerts}
              onCheckedChange={(checked) =>
                onUpdatePreference('applicationAlerts', checked)
              }
            />

            <Separator />

            <PreferenceItem
              label="Candidate Match Alerts"
              description="Get notified when new candidates match your search profiles (Premium)"
              checked={preferences.matchAlerts}
              onCheckedChange={(checked) =>
                onUpdatePreference('matchAlerts', checked)
              }
            />

            <Separator />

            <PreferenceItem
              label="System Notifications"
              description="Important updates about your account and subscription"
              checked={preferences.systemNotifications}
              onCheckedChange={(checked) =>
                onUpdatePreference('systemNotifications', checked)
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
