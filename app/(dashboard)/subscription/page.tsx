'use client';

import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@saint-giong/bamboo-ui';
import { Plus, Search, Sparkles } from 'lucide-react';
import { Suspense } from 'react';
import {
  HowItWorksCard,
  PlanComparison,
  PremiumFeaturesGrid,
  PremiumStatusCard,
  QuickActionsCard,
  SearchProfileCard,
  SearchProfileForm,
  SearchProfilesEmpty,
  SubscriptionHeader,
  UpgradeHero,
  useSubscription,
} from './_components';

function SubscriptionContent() {
  const {
    isPremium,
    isProcessing,
    searchProfiles,
    isCreating,
    isSaving,
    formData,
    availableSkillTags,
    handleUpgrade,
    handleManageBilling,
    toggleArrayItem,
    setFormField,
    handleSaveProfile,
    handleDeleteProfile,
    startCreating,
    cancelCreating,
  } = useSubscription();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SubscriptionHeader isPremium={isPremium} />

      <main className="flex-1 overflow-y-auto">
        {isPremium ? (
          <div className="p-6">
            <Tabs defaultValue="features" className="mx-auto max-w-5xl">
              <TabsList className="mb-6 grid w-full grid-cols-2 lg:flex lg:w-auto lg:grid-cols-none">
                <TabsTrigger value="features" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Premium Features</span>
                </TabsTrigger>
                <TabsTrigger value="profiles" className="gap-2">
                  <Search className="h-4 w-4" />
                  <span>Search Profiles</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="space-y-6">
                <PremiumStatusCard onManageBilling={handleManageBilling} />
                <PremiumFeaturesGrid />
                <QuickActionsCard onCreateProfile={startCreating} />
              </TabsContent>

              <TabsContent value="profiles" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">Search Profiles</h2>
                    <p className="text-muted-foreground text-sm">
                      Create profiles to automatically match candidates
                    </p>
                  </div>
                  {!isCreating && (
                    <Button onClick={startCreating} className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Profile
                    </Button>
                  )}
                </div>

                {isCreating && (
                  <SearchProfileForm
                    formData={formData}
                    isSaving={isSaving}
                    availableSkillTags={availableSkillTags}
                    onToggleSkill={(skillId) => {
                      const currentIds = formData.skillIds;
                      const newIds = currentIds.includes(skillId)
                        ? currentIds.filter(id => id !== skillId)
                        : [...currentIds, skillId];
                      setFormField('skillIds', newIds);
                    }}
                    onToggleEmployment={(type) =>
                      toggleArrayItem('employmentTypes', type)
                    }
                    onToggleEducation={(level) =>
                      toggleArrayItem('education', level)
                    }
                    onFieldChange={setFormField}
                    onSave={handleSaveProfile}
                    onCancel={cancelCreating}
                  />
                )}

                {searchProfiles.length === 0 ? (
                  <SearchProfilesEmpty onCreateProfile={startCreating} />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {searchProfiles.map((profile) => (
                      <SearchProfileCard
                        key={profile.profileId}
                        profile={profile}
                        onDelete={handleDeleteProfile}
                      />
                    ))}
                  </div>
                )}

                <HowItWorksCard />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="relative">
            <UpgradeHero
              isProcessing={isProcessing}
              onUpgrade={handleUpgrade}
            />
            <PlanComparison
              isProcessing={isProcessing}
              onUpgrade={handleUpgrade}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
}
