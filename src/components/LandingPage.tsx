import React, { useState } from 'react';
import { Problem, Topic } from '@/types/problem';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Code2,
  Layers,
  RotateCcw,
  Lightbulb,
  PenTool,
  CheckCircle2,
  Activity,
  Info,
} from 'lucide-react';

interface LandingPageProps {
  topics: Topic[];
  problems: Problem[];
  onOpenNotebook: (problemId?: string) => void;
  solvedCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  topics,
  problems,
  onOpenNotebook,
  solvedCount,
}) => {
  // Interactive mini demo state on landing page (Dutch National Flag 3-pointer)
  const initialArr = [2, 0, 2, 1, 1, 0];
  const [demoArr, setDemoArr] = useState<number[]>([...initialArr]);
  const [demoLow, setDemoLow] = useState<number>(0);
  const [demoMid, setDemoMid] = useState<number>(0);
  const [demoHigh, setDemoHigh] = useState<number>(initialArr.length - 1);
  const [demoStep, setDemoStep] = useState<number>(0);
  const [demoAction, setDemoAction] = useState<string>(
    'Initial state: low=0 (red partition), mid=0 (current scanner), high=5 (blue partition).'
  );

  const resetDemo = () => {
    setDemoArr([...initialArr]);
    setDemoLow(0);
    setDemoMid(0);
    setDemoHigh(initialArr.length - 1);
    setDemoStep(0);
    setDemoAction('Reset to initial state: all elements between mid and high are unclassified.');
  };

  const stepDemo = () => {
    if (demoMid > demoHigh) {
      setDemoAction('Partition complete: [0..low-1] are 0s, [low..mid-1] are 1s, [high+1..n-1] are 2s.');
      return;
    }

    const cur = demoArr[demoMid];
    const nextArr = [...demoArr];

    if (cur === 0) {
      [nextArr[demoLow], nextArr[demoMid]] = [nextArr[demoMid], nextArr[demoLow]];
      setDemoArr(nextArr);
      setDemoLow(l => l + 1);
      setDemoMid(m => m + 1);
      setDemoStep(s => s + 1);
      setDemoAction(`Found 0 at mid (${demoMid}) → Swapped with low (${demoLow}). Incremented low & mid.`);
    } else if (cur === 1) {
      setDemoMid(m => m + 1);
      setDemoStep(s => s + 1);
      setDemoAction(`Found 1 at mid (${demoMid}) → Already in middle partition. Incremented mid to ${demoMid + 1}.`);
    } else {
      [nextArr[demoMid], nextArr[demoHigh]] = [nextArr[demoHigh], nextArr[demoMid]];
      setDemoArr(nextArr);
      setDemoHigh(h => h - 1);
      setDemoStep(s => s + 1);
      setDemoAction(`Found 2 at mid (${demoMid}) → Swapped with high (${demoHigh}). Decremented high to ${demoHigh - 1}. (Mid not advanced as swapped value is uninspected).`);
    }
  };

  const isDemoFinished = demoMid > demoHigh;

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container relative overflow-x-hidden font-sans">
      {/* 1. TOP STICKY NAVBAR */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-charcoal/30 bg-surface/95 px-4 md:px-10 backdrop-blur-xs transition-all">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-on-primary-container font-extrabold text-base border-[1.5px] border-charcoal shadow-xs">
              <Lightbulb className="w-4 h-4 text-on-primary-container" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-xl font-extrabold lowercase leading-tight text-charcoal tracking-tight">
                intuition<span className="text-marker-orange">lab.</span>
              </span>
              <span className="text-[10px] font-mono text-on-surface-variant hidden sm:inline-block">
                sde sheet notebook & visualizer
              </span>
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-mono font-bold text-on-surface-variant lowercase">
          <a href="#features" className="hover:text-charcoal transition-colors">
            features
          </a>
          <a href="#demo" className="hover:text-charcoal transition-colors">
            interactive visualizers
          </a>
          <a href="#curriculum" className="hover:text-charcoal transition-colors">
            27 topics ({problems.length} problems)
          </a>
          <a href="#philosophy" className="hover:text-charcoal transition-colors">
            why intuition
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onOpenNotebook()}
            className="h-9 px-4 rounded-pill border-[1.5px] border-charcoal bg-primary-container text-on-primary-container hover:bg-primary-container/90 text-xs md:text-sm font-bold shadow-hard transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>open notebook</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative px-4 sm:px-6 md:px-10 pt-10 pb-16 max-w-[1600px] mx-auto space-y-10">
        {/* Hero Copy */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-dew-drop border border-charcoal/40 text-xs md:text-sm font-mono text-charcoal shadow-xs">
            <span className="w-2 h-2 rounded-full bg-marker-orange animate-pulse" />
            <span>191 striver sde problems • 100% interactive visualizers</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black lowercase text-charcoal tracking-tight leading-[1.05]">
            master every algorithm.{' '}
            <span className="text-marker-orange block sm:inline underline decoration-marker-orange/40 decoration-wavy decoration-2">
              with visual intuition.
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-cocoa-ink font-sans leading-relaxed max-w-3xl mx-auto font-medium">
            stop memorizing lines of boilerplate. step through data structure transitions, trace pointer mechanics, and understand the core invariant behind every optimal leap.
          </p>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => onOpenNotebook()}
              className="h-12 px-6 rounded-pill border-2 border-charcoal bg-primary-container text-on-primary-container hover:bg-primary-container/90 text-sm sm:text-base font-bold shadow-hard-lg transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2"
            >
              <span>launch interactive notebook</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <a
              href="#curriculum"
              className="h-12 px-6 rounded-pill border-2 border-charcoal bg-cream-paper text-charcoal hover:bg-dew-drop text-sm sm:text-base font-bold shadow-hard flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4 text-marker-orange" />
              <span>browse 27 topics</span>
            </a>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
            <div className="p-3 bg-cream-paper rounded-xl border border-charcoal/40 shadow-xs text-center">
              <div className="font-display font-black text-2xl sm:text-3xl text-charcoal">191</div>
              <div className="text-xs font-mono text-on-surface-variant">curated problems</div>
            </div>
            <div className="p-3 bg-cream-paper rounded-xl border border-charcoal/40 shadow-xs text-center">
              <div className="font-display font-black text-2xl sm:text-3xl text-marker-orange">27</div>
              <div className="text-xs font-mono text-on-surface-variant">topic categories</div>
            </div>
            <div className="p-3 bg-cream-paper rounded-xl border border-charcoal/40 shadow-xs text-center">
              <div className="font-display font-black text-2xl sm:text-3xl text-sky-sticker">2</div>
              <div className="text-xs font-mono text-on-surface-variant">python 3 & c++20</div>
            </div>
            <div className="p-3 bg-cream-paper rounded-xl border border-charcoal/40 shadow-xs text-center">
              <div className="font-display font-black text-2xl sm:text-3xl text-sprout-sticker">100%</div>
              <div className="text-xs font-mono text-on-surface-variant">free & open source</div>
            </div>
          </div>
        </div>

        {/* 3. HERO INTERACTIVE PLAYGROUND WIDGET */}
        <div id="demo" className="rounded-2xl border-2 border-charcoal bg-surface p-5 sm:p-8 shadow-hard-lg space-y-6 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline/30 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container font-bold text-sm border border-charcoal">
                <Activity className="w-4 h-4 text-on-primary-container" />
              </span>
              <div>
                <h2 className="font-display text-lg sm:text-2xl font-bold lowercase text-charcoal">
                  interactive visualizer demo: dutch national flag (sort colors)
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant font-sans">
                  test-drive the 3-pointer partition algorithm right here.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={stepDemo}
                disabled={isDemoFinished}
                className="h-8 px-3.5 text-xs font-bold"
              >
                <span>{isDemoFinished ? 'finished' : 'next step →'}</span>
              </Button>
              <Button size="sm" variant="ghost" onClick={resetDemo} className="h-8 px-2.5">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Array Visual Display */}
          <div className="py-8 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6">
            <div className="flex items-end gap-3 sm:gap-4 flex-wrap justify-center">
              {demoArr.map((val, idx) => {
                const isLow = idx === demoLow;
                const isMid = idx === demoMid;
                const isHigh = idx === demoHigh;

                const colorClass =
                  val === 0
                    ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]'
                    : val === 1
                    ? 'bg-cream-paper text-charcoal border-charcoal'
                    : 'bg-primary-fixed text-burnt-sienna border-marker-orange';

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div className="h-6 flex items-center justify-center gap-0.5 font-mono text-xs font-bold">
                      {isLow && <span className="bg-[#ba1a1a] text-white px-1.5 rounded-xs text-[10px]">L</span>}
                      {isMid && <span className="bg-sky-sticker text-white px-1.5 rounded-xs text-[10px]">M</span>}
                      {isHigh && <span className="bg-sprout-sticker text-white px-1.5 rounded-xs text-[10px]">H</span>}
                    </div>

                    <div
                      className={`w-12 h-14 sm:w-16 sm:h-18 flex items-center justify-center font-mono font-bold text-lg sm:text-2xl rounded-lg border-2 shadow-hard transition-all duration-300 ${colorClass} ${
                        isMid ? 'ring-2 ring-marker-orange scale-105' : ''
                      }`}
                    >
                      {val}
                    </div>

                    <span className="text-[11px] font-mono text-on-surface-variant font-medium">idx {idx}</span>
                  </div>
                );
              })}
            </div>

            {/* Pointers State Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold">
              <span className="bg-dew-drop px-3 py-1 rounded-pill border border-charcoal/40 text-charcoal">
                low: <strong className="text-[#ba1a1a]">{demoLow}</strong>
              </span>
              <span className="bg-dew-drop px-3 py-1 rounded-pill border border-charcoal/40 text-charcoal">
                mid: <strong className="text-sky-sticker">{demoMid}</strong>
              </span>
              <span className="bg-dew-drop px-3 py-1 rounded-pill border border-charcoal/40 text-charcoal">
                high: <strong className="text-burnt-sienna">{demoHigh}</strong>
              </span>
            </div>
          </div>

          {/* Action Callout */}
          <div className="p-4 bg-dew-drop rounded-xl border border-charcoal/30 text-xs sm:text-sm font-mono text-cocoa-ink flex items-start gap-2.5">
            <Info className="w-4 h-4 text-marker-orange shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Step {demoStep}:</strong> {demoAction}
            </p>
          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES SECTION */}
      <section id="features" className="py-16 px-4 sm:px-6 md:px-10 border-t border-charcoal/20 bg-dew-drop/50">
        <div className="max-w-[1600px] mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-marker-orange">
              built for deep understanding
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold lowercase text-charcoal">
              everything you need to crack coding interviews
            </h2>
            <p className="text-sm sm:text-lg text-cocoa-ink font-sans">
              a notebook engineered from the ground up for clarity, spatial thinking, and active recall.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-surface border-2 border-charcoal shadow-hard space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center border-[1.5px] border-charcoal shadow-xs">
                <Layers className="w-6 h-6 text-on-primary-container" />
              </div>
              <h3 className="font-display text-xl font-bold lowercase text-charcoal">
                step-by-step visualizers
              </h3>
              <p className="text-xs sm:text-sm text-cocoa-ink font-sans leading-relaxed">
                interactive models for matrices, 3-way partition, Kadane&apos;s sum, linked list pointer flips, tree traversals, and 2D DP grids.
              </p>
              <div className="text-xs font-mono text-marker-orange font-bold pt-2">
                • play, step, and reset controls
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-surface border-2 border-charcoal shadow-hard space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center border-[1.5px] border-charcoal shadow-xs">
                <Code2 className="w-6 h-6 text-on-secondary-container" />
              </div>
              <h3 className="font-display text-xl font-bold lowercase text-charcoal">
                canonical class Solution code
              </h3>
              <p className="text-xs sm:text-sm text-cocoa-ink font-sans leading-relaxed">
                standard LeetCode & GFG structure with separate helper member functions, Python 3 and C++20 tabs, and copy feedback.
              </p>
              <div className="text-xs font-mono text-sky-sticker font-bold pt-2">
                • brute force, better, & optimal tabs
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-surface border-2 border-charcoal shadow-hard space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center border-[1.5px] border-charcoal shadow-xs">
                <Lightbulb className="w-6 h-6 text-burnt-sienna" />
              </div>
              <h3 className="font-display text-xl font-bold lowercase text-charcoal">
                intuition & key insights
              </h3>
              <p className="text-xs sm:text-sm text-cocoa-ink font-sans leading-relaxed">
                hand-drawn marker callouts extracting the central mathematical or pointer trick that makes the optimal solution click.
              </p>
              <div className="text-xs font-mono text-burnt-sienna font-bold pt-2">
                • time & space complexity badges
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-surface border-2 border-charcoal shadow-hard space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-dew-drop flex items-center justify-center border-[1.5px] border-charcoal shadow-xs">
                <PenTool className="w-6 h-6 text-sprout-sticker" />
              </div>
              <h3 className="font-display text-xl font-bold lowercase text-charcoal">
                scratchpad & progress
              </h3>
              <p className="text-xs sm:text-sm text-cocoa-ink font-sans leading-relaxed">
                track solved problems with confetti bursts, bookmark difficult patterns, and save custom notes locally per problem.
              </p>
              <div className="text-xs font-mono text-sprout-sticker font-bold pt-2">
                • full keyboard shortcuts (←, →, S, B)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOPICS CURRICULUM GRID */}
      <section id="curriculum" className="py-16 px-4 sm:px-6 md:px-10 border-t border-charcoal/20">
        <div className="max-w-[1600px] mx-auto space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/20 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-marker-orange">
                complete 27-topic roadmap
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold lowercase text-charcoal">
                explore the 191 sde sheet problems
              </h2>
            </div>

            <Button
              onClick={() => onOpenNotebook()}
              className="h-9 px-4 rounded-pill border-[1.5px] border-charcoal bg-primary-container text-on-primary-container font-bold text-xs md:text-sm shadow-sm"
            >
              <span>open full syllabus →</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topics.map(topic => (
              <div
                key={topic.id}
                onClick={() => onOpenNotebook(topic.problems[0]?.id)}
                className="p-4 rounded-xl border-[1.5px] border-charcoal bg-cream-paper hover:bg-dew-drop cursor-pointer shadow-hard transition-all duration-200 hover:-translate-y-0.5 group space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-primary-fixed px-2 py-0.5 rounded border border-charcoal/40 text-charcoal">
                    #{topic.index}
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant font-medium">
                    {topic.count} problems
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold lowercase text-charcoal group-hover:text-marker-orange transition-colors">
                  {topic.title}
                </h3>

                <div className="text-[11px] font-mono text-on-surface-variant truncate">
                  e.g. {topic.problems[0]?.title || 'Standard patterns'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LEARNING PHILOSOPHY COMPARISON */}
      <section id="philosophy" className="py-16 px-4 sm:px-6 md:px-10 border-t border-charcoal/20 bg-dew-drop/40">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-marker-orange">
              the intuition advantage
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold lowercase text-charcoal">
              why visual mental models beat rote memorization
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 rounded-2xl bg-cream-paper border-2 border-outline/50 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
                <span>The Traditional Way</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm font-sans text-on-surface-variant">
                <li>• Staring at static text and memorizing loop counters</li>
                <li>• Getting stuck when the interviewer tweaks array constraints</li>
                <li>• Re-reading long blog posts to remember boundary base cases</li>
                <li>• Copying boilerplate without seeing the pointer shifts</li>
              </ul>
            </div>

            {/* The IntuitionLab Way */}
            <div className="p-6 rounded-2xl bg-surface border-2 border-charcoal shadow-hard-lg space-y-4">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-charcoal">
                <span className="w-2.5 h-2.5 rounded-full bg-sprout-sticker" />
                <span>The IntuitionLab Way</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm font-sans text-cocoa-ink font-medium">
                <li>• <strong>Watch state transitions live</strong>: pointers, partitions, and DP tables</li>
                <li>• <strong>Understand invariants</strong>: know exactly why a pointer moves</li>
                <li>• <strong>Canonical class Solution</strong>: ready for live whiteboard & online IDEs</li>
                <li>• <strong>Active Recall</strong>: test your intuition before writing the code</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-6 md:px-10 border-t border-charcoal/20">
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-primary-container border-2 border-charcoal shadow-hard-lg text-center space-y-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white mx-auto border-[1.5px] border-charcoal shadow-xs">
            <Sparkles className="w-6 h-6 text-marker-orange" />
          </span>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black lowercase text-charcoal tracking-tight">
            ready to master data structures?
          </h2>

          <p className="text-base sm:text-xl text-cocoa-ink font-sans max-w-2xl mx-auto font-medium">
            jump into the interactive notebook, step through 191 problems, and build unforgettable algorithmic intuition.
          </p>

          <div className="pt-2">
            <Button
              size="lg"
              onClick={() => onOpenNotebook()}
              className="h-13 px-8 rounded-pill border-2 border-charcoal bg-white text-charcoal hover:bg-dew-drop text-base font-bold shadow-hard transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>open interactive notebook (free) →</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-charcoal/30 bg-surface px-4 md:px-10 py-8 text-xs font-mono text-on-surface-variant flex flex-wrap items-center justify-between gap-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2 font-display text-base font-bold lowercase text-charcoal">
          <span>intuitionlab.</span>
          <span className="text-xs font-mono text-on-surface-variant">
            • 191 problems • 27 topics
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => onOpenNotebook()} className="hover:text-charcoal transition-colors">
            notebook workspace
          </button>
          <span>•</span>
          <a href="#curriculum" className="hover:text-charcoal transition-colors">
            curriculum
          </a>
        </div>
      </footer>
    </div>
  );
};
