import React, { useState } from 'react';
import { Problem, Topic } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
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
  User,
  Shield,
  LogOut,
} from 'lucide-react';

interface LandingPageProps {
  topics: Topic[];
  problems: Problem[];
  onOpenNotebook: (problemId?: string) => void;
  onOpenAuthModal?: () => void;
  onOpenAdminModal?: () => void;
  solvedCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  topics,
  problems,
  onOpenNotebook,
  onOpenAuthModal,
  onOpenAdminModal,
  solvedCount,
}) => {
  const { user, profile, isAdmin, signOut } = useAuth();

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
        </nav>

        {/* Right Auth & CTA Actions */}
        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <Button
              size="sm"
              variant="default"
              onClick={onOpenAdminModal}
              className="h-9 px-3 bg-dew-drop border-2 border-marker-orange text-marker-orange hover:bg-primary-fixed-dim font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 fill-marker-orange/20" />
              <span>admin panel</span>
            </Button>
          )}

          {user ? (
            <div className="flex items-center gap-1.5 bg-dew-drop p-1 rounded-pill border border-charcoal">
              <span className="text-xs font-mono font-bold px-2 py-0.5 text-charcoal truncate max-w-[120px]">
                {profile?.username || user.email?.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                className="p-1 text-on-surface-variant hover:text-red-600 rounded-full transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="default"
              onClick={onOpenAuthModal}
              className="h-9 px-3.5 rounded-pill border-[1.5px] border-charcoal bg-surface text-charcoal hover:bg-dew-drop text-xs md:text-sm font-mono font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-marker-orange" />
              <span>sign in</span>
            </Button>
          )}

          <Button
            onClick={() => onOpenNotebook()}
            className="h-9 px-4 rounded-pill border-[1.5px] border-charcoal bg-primary-container text-on-primary-container hover:bg-primary-container/90 text-xs md:text-sm font-bold shadow-hard transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">open notebook</span>
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

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              onClick={() => onOpenNotebook()}
              className="h-12 sm:h-14 px-8 rounded-pill border-2 border-charcoal bg-primary-container text-on-primary-container hover:bg-primary-container/90 text-base sm:text-lg font-bold shadow-hard transition-all duration-200 active:translate-x-1 active:translate-y-1 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>start learning (191 problems)</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>

            {!user && (
              <Button
                variant="outline"
                onClick={onOpenAuthModal}
                className="h-12 sm:h-14 px-6 rounded-pill border-2 border-charcoal bg-surface text-charcoal hover:bg-dew-drop text-base font-mono font-bold shadow-hard transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4 text-marker-orange" />
                <span>sign in / create account</span>
              </Button>
            )}
          </div>
        </div>

        {/* 3. INTERACTIVE HERO DEMO ENGINE */}
        <div id="demo" className="max-w-4xl mx-auto rounded-2xl border-2 border-charcoal bg-surface p-6 sm:p-8 shadow-hard space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary-container text-on-primary-container font-mono text-xs font-bold border border-charcoal">
                live engine
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold lowercase text-charcoal">
                sort colors (dutch national flag)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="default" onClick={resetDemo} className="h-8 px-2.5 text-xs font-mono">
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>reset</span>
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={stepDemo}
                disabled={isDemoFinished}
                className="h-8 px-3 text-xs font-mono font-bold"
              >
                <span>{isDemoFinished ? 'partition complete!' : `step ${demoStep + 1} →`}</span>
              </Button>
            </div>
          </div>

          {/* Interactive Array Elements */}
          <div className="py-6 px-4 bg-dew-drop rounded-xl border border-charcoal flex flex-col items-center gap-4 overflow-x-auto">
            <div className="flex items-end justify-center gap-2 sm:gap-3 flex-wrap min-w-max">
              {demoArr.map((val, idx) => {
                const isLow = idx === demoLow;
                const isMid = idx === demoMid;
                const isHigh = idx === demoHigh;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 min-w-[50px]">
                    <div className="h-5 flex items-center justify-center gap-1 text-[10px] font-mono font-bold">
                      {isLow && <span className="bg-[#ba1a1a] text-white px-1.5 rounded-pill">low</span>}
                      {isMid && <span className="bg-marker-orange text-white px-1.5 rounded-pill">mid</span>}
                      {isHigh && <span className="bg-sprout-sticker text-white px-1.5 rounded-pill">high</span>}
                    </div>
                    <div
                      className={`w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center font-mono font-bold text-lg sm:text-xl rounded-xl border-2 shadow-hard transition-all duration-300 ${
                        val === 0
                          ? 'border-[#ba1a1a] bg-[#ffdad6] text-[#93000a]'
                          : val === 1
                          ? 'border-charcoal bg-surface text-charcoal'
                          : 'border-marker-orange bg-primary-fixed text-burnt-sienna'
                      } ${isMid ? 'ring-2 ring-marker-orange scale-105' : ''}`}
                    >
                      {val}
                    </div>
                    <span className="text-[10px] font-mono text-on-surface-variant">[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Explanation */}
          <div className="p-4 rounded-xl bg-cream-paper border border-outline/30 text-xs sm:text-sm font-mono text-cocoa-ink flex items-start gap-2.5">
            <Info className="w-4 h-4 text-marker-orange flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{demoAction}</p>
          </div>
        </div>
      </section>

      {/* 4. FEATURE GRID */}
      <section id="features" className="px-4 sm:px-6 md:px-10 py-16 bg-dew-drop/50 border-t border-charcoal/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl sm:text-5xl font-black lowercase text-charcoal">
              built for first-principles mastery
            </h2>
            <p className="text-sm sm:text-base font-mono text-on-surface-variant">
              everything you need to crack top tier technical interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border-2 border-charcoal bg-surface shadow-hard space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container border border-charcoal flex items-center justify-center text-on-primary-container">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold lowercase text-charcoal">191 interactive visualizers</h3>
              <p className="text-xs sm:text-sm font-sans text-cocoa-ink leading-relaxed">
                Step through every data structure transition with live pointer tracking, dynamic node scaling, and zero clipping.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-charcoal bg-surface shadow-hard space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container border border-charcoal flex items-center justify-center text-on-primary-container">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold lowercase text-charcoal">dual-language code viewers</h3>
              <p className="text-xs sm:text-sm font-sans text-cocoa-ink leading-relaxed">
                Canonical Python 3 and modern C++ implementations formatted vertically with clean line gutters and complexity tags.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-charcoal bg-surface shadow-hard space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container border border-charcoal flex items-center justify-center text-on-primary-container">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold lowercase text-charcoal">cloud notes & admin controls</h3>
              <p className="text-xs sm:text-sm font-sans text-cocoa-ink leading-relaxed">
                Save concise 250-character insights per problem synced to Supabase Cloud, with role management and admin tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOPIC CURRICULUM */}
      <section id="curriculum" className="px-4 sm:px-6 md:px-10 py-16 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/30 pb-4">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold lowercase text-charcoal">
              complete curriculum breakdown
            </h2>
            <p className="text-xs sm:text-sm font-mono text-on-surface-variant">
              27 topics spanning 191 interview-critical problems
            </p>
          </div>
          <Button onClick={() => onOpenNotebook()} className="h-9 font-mono text-xs font-bold">
            <span>explore all in notebook →</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map(topic => (
            <div
              key={topic.id}
              onClick={() => onOpenNotebook(topic.problems[0]?.id)}
              className="p-4 rounded-xl border border-charcoal bg-surface hover:bg-dew-drop transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-bold lowercase text-charcoal group-hover:text-marker-orange transition-colors">
                  {topic.title}
                </span>
                <span className="text-xs font-mono font-bold bg-primary-container px-2 py-0.5 rounded-pill border border-charcoal">
                  {topic.count} problems
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CTA & FOOTER */}
      <footer className="border-t border-charcoal/30 bg-dew-drop py-12 px-4 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-container text-on-primary-container font-extrabold text-xs border border-charcoal shadow-xs">
            <Lightbulb className="w-3.5 h-3.5 text-on-primary-container" />
          </span>
          <span className="font-display text-lg font-bold lowercase text-charcoal">
            intuition<span className="text-marker-orange">lab.</span>
          </span>
        </div>
        <p className="text-xs font-mono text-on-surface-variant">
          made with <strong className="text-marker-orange">marker orange</strong> & <strong className="text-cocoa-ink">cocoa ink</strong> ✦ open source & free
        </p>
      </footer>
    </div>
  );
};
