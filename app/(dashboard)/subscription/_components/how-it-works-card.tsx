'use client';

import { Card, CardContent } from '@saint-giong/bamboo-ui';

const steps = [
  {
    step: '1',
    title: 'Define Criteria',
    desc: 'Set your ideal candidate requirements',
  },
  {
    step: '2',
    title: 'Auto Scanning',
    desc: 'System scans new applicant profiles',
  },
  {
    step: '3',
    title: 'Instant Alerts',
    desc: 'Get notified when matches are found',
  },
];

export function HowItWorksCard() {
  return (
    <Card className="mt-4 border-dashed bg-muted/30">
      <CardContent className="p-6">
        <h4 className="mb-4 text-center font-medium">
          How Automatic Matching Works
        </h4>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {item.step}
              </div>
              <h5 className="font-medium text-sm">{item.title}</h5>
              <p className="text-muted-foreground text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
