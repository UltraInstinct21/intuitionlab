import React, { useState } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

interface GreedyStep {
  title: string;
  whatHappens: string;
  whyRationale: string;
  items: { label: string; value: string | number; chosen?: boolean; active?: boolean }[];
  states: Record<string, string | number | boolean | undefined>;
  codeSnippet: string;
  impact?: string;
}

function buildGreedySteps(problem?: Problem): GreedyStep[] {
  const t = (problem?.title || '').toLowerCase();

  // 1. Minimum Platforms Required
  if (t.includes('platform') || t.includes('railway')) {
    return [
      {
        title: 'Sort Arrivals and Departures',
        whatHappens: 'Arrivals: [9:00, 9:40, 9:50, 11:00]. Departures: [9:10, 11:20, 11:30, 12:00].',
        whyRationale: 'Sorting both chronologically lets us track overlapping trains in O(N log N).',
        items: [{ label: 'arr[0]', value: '9:00', active: true }, { label: 'dep[0]', value: '9:10' }, { label: 'arr[1]', value: '9:40' }, { label: 'arr[2]', value: '9:50' }],
        states: { currentPlatforms: 0, maxPlatforms: 0, i: 0, j: 0 },
        codeSnippet: 'arr.sort()\ndep.sort()\nplatforms = 0; max_p = 0',
        impact: 'Time: O(N log N) | Space: O(1)',
      },
      {
        title: 'Train 1 arrives at 9:00 (< 9:10)',
        whatHappens: 'arr[0] <= dep[0] → Need new platform: count = 1. Max platforms = 1.',
        whyRationale: 'Train arrives before any train departs, so a new platform must be allocated.',
        items: [{ label: '9:00 (ARR)', value: 'Plat 1', chosen: true }, { label: '9:10 (DEP)', value: 'pending' }],
        states: { currentPlatforms: 1, maxPlatforms: 1, i: 1, j: 0 },
        codeSnippet: 'if arr[i] <= dep[j]:\n    platforms += 1\n    max_p = max(max_p, platforms)\n    i += 1',
      },
      {
        title: 'Train 1 departs at 9:10 (< 9:40)',
        whatHappens: 'dep[0] < arr[1] → Platform freed: count decreases to 0. Advance departure pointer j.',
        whyRationale: 'Platform becomes available for future trains.',
        items: [{ label: '9:10 (DEP)', value: 'Freed', chosen: true }, { label: '9:40 (ARR)', value: 'next' }],
        states: { currentPlatforms: 0, maxPlatforms: 1, i: 1, j: 1 },
        codeSnippet: 'else:\n    platforms -= 1\n    j += 1',
      },
      {
        title: 'Consecutive Arrivals (9:40, 9:50)',
        whatHappens: 'Two trains arrive before 11:20 departure → count reaches 2. Max platforms = 2.',
        whyRationale: 'Peak simultaneous train occupancy is 2.',
        items: [{ label: '9:40', value: 'Plat 1', chosen: true }, { label: '9:50', value: 'Plat 2', chosen: true }],
        states: { currentPlatforms: 2, maxPlatforms: 2 },
        codeSnippet: 'return max_p # 2 platforms needed',
      },
    ];
  }

  // 2. Fractional Knapsack
  if (t.includes('fractional knapsack')) {
    return [
      {
        title: 'Sort Items by Value / Weight Ratio',
        whatHappens: 'Capacity W=50. Item 1: v=60, w=10 (ratio=6.0). Item 2: v=100, w=20 (ratio=5.0). Item 3: v=120, w=30 (ratio=4.0).',
        whyRationale: 'Greedy choice: take items with highest value density first.',
        items: [{ label: 'Item 1', value: 'ratio 6.0' }, { label: 'Item 2', value: 'ratio 5.0' }, { label: 'Item 3', value: 'ratio 4.0' }],
        states: { capacity: 50, totalValue: 0 },
        codeSnippet: 'items.sort(key=lambda x: x.val / x.wt, reverse=True)',
        impact: 'Time: O(N log N) | Space: O(1)',
      },
      {
        title: 'Take 100% of Item 1 (ratio 6.0)',
        whatHappens: 'Weight 10 <= 50. Take full item: value += 60, capacity left = 40.',
        whyRationale: 'Full item fits in remaining capacity.',
        items: [{ label: 'Item 1', value: '100% (+60)', chosen: true }, { label: 'Item 2', value: 'ratio 5.0' }, { label: 'Item 3', value: 'ratio 4.0' }],
        states: { capacityLeft: 40, totalValue: 60 },
        codeSnippet: 'if item.wt <= W:\n    total_val += item.val\n    W -= item.wt',
      },
      {
        title: 'Take 100% of Item 2 (ratio 5.0)',
        whatHappens: 'Weight 20 <= 40. Take full item: value += 100 (now 160), capacity left = 20.',
        whyRationale: 'Highest remaining value density item.',
        items: [{ label: 'Item 1', value: '100% (+60)', chosen: true }, { label: 'Item 2', value: '100% (+100)', chosen: true }, { label: 'Item 3', value: 'ratio 4.0' }],
        states: { capacityLeft: 20, totalValue: 160 },
        codeSnippet: 'total_val += 100; W -= 20',
      },
      {
        title: 'Take Fraction (20/30) of Item 3',
        whatHappens: 'Weight 30 > 20. Take fraction (20/30) * 120 = +80 value. Total value = 240.',
        whyRationale: 'Knapsack completely filled to capacity 50.',
        items: [{ label: 'Item 1', value: '+60', chosen: true }, { label: 'Item 2', value: '+100', chosen: true }, { label: 'Item 3 (2/3)', value: '+80 (fraction)', chosen: true }],
        states: { capacityLeft: 0, finalMaxProfit: 240 },
        codeSnippet: 'total_val += item.val * (W / item.wt)\nreturn total_val # 240.0',
      },
    ];
  }

  // 3. Default: N Meetings in One Room / Interval Scheduling
  const meetings = [
    { label: '[1, 2]', value: 'end=2', chosen: true },
    { label: '[3, 4]', value: 'end=4', chosen: true },
    { label: '[0, 6]', value: 'end=6 (overlaps)', chosen: false },
    { label: '[5, 7]', value: 'end=7', chosen: true },
    { label: '[8, 9]', value: 'end=9', chosen: true },
  ];

  return [
    {
      title: 'Sort Meetings by End Time',
      whatHappens: 'Sort meetings in ascending order of end time: [1,2], [3,4], [0,6], [5,7], [8,9].',
      whyRationale: 'Greedy choice: picking the meeting that finishes earliest leaves maximum time for remaining meetings.',
      items: meetings.map(m => ({ ...m, chosen: false })),
      states: { sortedBy: 'endTime', count: 0 },
      codeSnippet: 'meetings.sort(key=lambda x: x.end)',
      impact: 'Time: O(N log N) | Space: O(1)',
    },
    {
      title: 'Select Meeting [1, 2]',
      whatHappens: 'Pick first meeting. lastEnd updated to 2. Count = 1.',
      whyRationale: 'Earliest ending meeting always belongs to an optimal schedule.',
      items: [{ ...meetings[0], chosen: true }, ...meetings.slice(1).map(m => ({ ...m, chosen: false }))],
      states: { lastEnd: 2, totalMeetings: 1 },
      codeSnippet: 'count = 1\nlast_end = meetings[0].end',
    },
    {
      title: 'Select Meeting [3, 4]',
      whatHappens: 'start (3) > lastEnd (2) → Valid! Pick [3, 4]. lastEnd updated to 4. Count = 2.',
      whyRationale: 'No time conflict with previously selected meeting.',
      items: [{ ...meetings[0], chosen: true }, { ...meetings[1], chosen: true }, ...meetings.slice(2).map(m => ({ ...m, chosen: false }))],
      states: { lastEnd: 4, totalMeetings: 2 },
      codeSnippet: 'if meeting.start > last_end:\n    count += 1\n    last_end = meeting.end',
    },
    {
      title: 'Skip Overlapping [0, 6] & Select [5, 7], [8, 9]',
      whatHappens: 'Meeting [0, 6] starts at 0 <= 4 (conflict!). Skip it. Pick [5, 7] and [8, 9]. Total = 4 meetings.',
      whyRationale: 'Maximum set of non-overlapping meetings found.',
      items: meetings,
      states: { maxMeetings: 4, schedule: '[1,2], [3,4], [5,7], [8,9]' },
      codeSnippet: 'return count # 4 meetings',
    },
  ];
}

export const GreedyVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const steps = buildGreedySteps(problem);
  const cur = steps[step] || steps[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="h-8 px-2.5 text-xs">
            <ChevronLeft className="w-4 h-4" /><span>prev</span>
          </Button>
          <Button size="sm" variant="primary" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} className="h-8 px-3 text-xs">
            <span>{step === steps.length - 1 ? 'completed!' : 'next step →'}</span><ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setStep(0)} className="h-8"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
        <div className="text-xs md:text-sm font-mono flex items-center gap-3">
          <span className="text-marker-orange font-bold">step {step + 1} of {steps.length}</span>
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 flex-wrap justify-center max-w-lg">
          {cur.items.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border-2 shadow-hard flex flex-col items-center gap-1 transition-all duration-200 ${
                item.chosen
                  ? 'bg-primary-container text-on-primary-container border-charcoal scale-105'
                  : item.active
                  ? 'bg-primary-fixed border-marker-orange'
                  : 'bg-surface border-outline/40 text-charcoal'
              }`}
            >
              <span className="font-mono font-bold text-sm">{item.label}</span>
              <span className="font-mono text-xs text-on-surface-variant font-medium">{item.value}</span>
              {item.chosen && <span className="text-xs font-bold text-sprout-sticker">✓ Selected</span>}
            </div>
          ))}
        </div>
      </div>

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={cur.title}
        whatHappens={cur.whatHappens}
        whyRationale={cur.whyRationale}
        variableStates={cur.states}
        codeSnippet={cur.codeSnippet}
        timeSpaceImpact={cur.impact || 'Time: O(N log N) | Space: O(1)'}
      />
    </div>
  );
};