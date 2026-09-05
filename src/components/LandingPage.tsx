import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
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
  Info,
  User,
  Shield,
  LogOut,
  Zap,
  Search,
  Brain,
  Timer,
  ChevronUp,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Cpu,
  Flame,
  BookmarkCheck,
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

  // Scroll Progress Bar
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 25, restDelta: 0.001 });

  // Floating back to top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    return scrollY.on('change', latest => {
      setShowScrollTop(latest > 400);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      setDemoAction(
        `Found 2 at mid (${demoMid}) → Swapped with high (${demoHigh}). Decremented high to ${
          demoHigh - 1
        }. (Mid not advanced as swapped value is uninspected).`
      );
    }
  };

  const isDemoFinished = demoMid > demoHigh;

  // Scroll Zoom Transforms for Demo Section
  const demoContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: demoScrollProgress } = useScroll({
    target: demoContainerRef,
    offset: ['start end', 'end start'],
  });

  const demoScale = useTransform(demoScrollProgress, [0, 0.35, 0.65, 1], [0.88, 1.02, 1.02, 0.9]);
  const demoOpacity = useTransform(demoScrollProgress, [0, 0.25, 0.75, 1], [0.6, 1, 1, 0.7]);
  const demoRotateX = useTransform(demoScrollProgress, [0, 0.35, 0.65, 1], [6, 0, 0, -6]);

  // Topic search & filter in curriculum section
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Topics' },
      { id: 'arrays', label: 'Arrays & Matrix' },
      { id: 'linked_list', label: 'Linked Lists' },
      { id: 'trees', label: 'Trees & BST' },
      { id: 'dp', label: 'Dynamic Programming' },
      { id: 'graphs', label: 'Graphs & Heaps' },
      { id: 'recursion', label: 'Recursion & Backtracking' },
    ];
  }, []);

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => {
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.problems?.some(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (selectedCategory === 'all') return true;

      const titleLower = topic.title.toLowerCase();
      if (selectedCategory === 'arrays') return titleLower.includes('array') || titleLower.includes('matrix') || titleLower.includes('string');
      if (selectedCategory === 'linked_list') return titleLower.includes('linked list');
      if (selectedCategory === 'trees') return titleLower.includes('tree') || titleLower.includes('bst') || titleLower.includes('trie');
      if (selectedCategory === 'dp') return titleLower.includes('dynamic') || titleLower.includes('dp');
      if (selectedCategory === 'graphs') return titleLower.includes('graph') || titleLower.includes('heap');
      if (selectedCategory === 'recursion') return titleLower.includes('recursion') || titleLower.includes('backtrack');

      return true;
    });
  }, [topics, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container relative overflow-x-hidden font-sans">
      {/* 0. TOP SCROLL PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-marker-orange via-burnt-sienna to-marker-orange origin-left z-50 shadow-xs"
        style={{ scaleX }}
      />

      {/* 1. TOP STICKY NAVBAR */}
      <header className="sticky top-0 z-40 flex h-14 sm:h-16 items-center justify-between border-b border-charcoal/30 bg-surface/90 px-3 sm:px-6 md:px-10 backdrop-blur-md transition-all">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={scrollToTop}
          >
            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-primary-container text-on-primary-container font-extrabold text-sm sm:text-base border-[1.5px] border-charcoal shadow-xs">
              <Lightbulb className="w-4 h-4 text-on-primary-container" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg sm:text-xl font-extrabold lowercase leading-tight text-charcoal tracking-tight">
                intuition<span className="text-marker-orange">lab.</span>
              </span>
              <span className="text-[10px] font-mono text-on-surface-variant hidden sm:inline-block">
                sde sheet notebook & visualizer
              </span>
            </div>
          </motion.div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-mono font-bold text-on-surface-variant lowercase">
          <a href="#features" className="hover:text-charcoal transition-colors">
            features
          </a>
          <a href="#demo" className="hover:text-charcoal transition-colors">
            interactive visualizer
          </a>
          <a href="#revision" className="hover:text-charcoal transition-colors">
            rapid revision
          </a>
          <a href="#curriculum" className="hover:text-charcoal transition-colors">
            27 topics ({problems.length} problems)
          </a>
        </nav>

        {/* Right Auth & CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {isAdmin && (
            <Button
              size="sm"
              variant="default"
              onClick={onOpenAdminModal}
              className="h-8 sm:h-9 px-2.5 sm:px-3 bg-dew-drop border-2 border-marker-orange text-marker-orange hover:bg-primary-fixed-dim font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs rounded-md"
            >
              <Shield className="w-3.5 h-3.5 fill-marker-orange/20" />
              <span className="hidden sm:inline">admin panel</span>
            </Button>
          )}

          {user ? (
            <div className="flex items-center gap-1.5 bg-dew-drop p-1 rounded-md border border-charcoal">
              <span className="text-xs font-mono font-bold px-2 py-0.5 text-charcoal truncate max-w-[100px] sm:max-w-[120px]">
                {profile?.username || user.email?.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                className="p-1 text-on-surface-variant hover:text-red-600 rounded transition-colors cursor-pointer"
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
              className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-md border-[1.5px] border-charcoal bg-surface text-charcoal hover:bg-dew-drop text-xs md:text-sm font-mono font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-marker-orange" />
              <span>sign in</span>
            </Button>
          )}

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              onClick={() => onOpenNotebook()}
              className="h-8 sm:h-9 px-3 sm:px-4 rounded-md border-[1.5px] border-charcoal bg-primary-container text-on-primary-container hover:bg-primary-container/90 text-xs md:text-sm font-bold shadow-hard transition-all duration-200 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">open notebook</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5" />
            </Button>
          </motion.div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative px-3 sm:px-8 lg:px-12 xl:px-16 pt-8 sm:pt-12 pb-16 sm:pb-20 max-w-[1600px] mx-auto space-y-12 sm:space-y-16">
        {/* Hero Copy */}
        <div className="text-center max-w-5xl xl:max-w-6xl mx-auto space-y-5 sm:space-y-6">
          <motion.h1
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black lowercase text-charcoal tracking-tight leading-[1.05] break-words"
          >
            master every algorithm.{' '}
            <span className="text-marker-orange block sm:inline underline decoration-marker-orange/40 decoration-wavy decoration-2">
              with visual intuition.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-cocoa-ink font-sans leading-relaxed max-w-4xl mx-auto font-medium"
          >
            Great for revising and brushing up core concepts before interviews. Step through data structure transitions, trace pointer mechanics, and grasp the core invariant behind every optimal leap.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 pt-2 sm:pt-4"
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => onOpenNotebook()}
                className="h-11 sm:h-14 px-6 sm:px-10 rounded-xl border-2 border-charcoal bg-primary-container text-on-primary-container hover:bg-primary-container/90 text-sm sm:text-lg font-bold shadow-hard transition-all flex items-center gap-2 sm:gap-2.5"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>start learning (191 problems)</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 sm:ml-1" />
              </Button>
            </motion.div>

            {!user && (
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Button
                  variant="outline"
                  onClick={onOpenAuthModal}
                  className="h-11 sm:h-14 px-5 sm:px-8 rounded-xl border-2 border-charcoal bg-surface text-charcoal hover:bg-dew-drop text-sm sm:text-base font-mono font-bold shadow-hard transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-marker-orange" />
                  <span>sign in / create account</span>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* 3. INTERACTIVE HERO DEMO ENGINE WITH EXPANSIVE WIDE STAGE */}
        <div ref={demoContainerRef} className="perspective-[1000px] max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto pt-2">
          <motion.div
            id="demo"
            style={{
              scale: demoScale,
              opacity: demoOpacity,
              rotateX: demoRotateX,
            }}
            className="rounded-3xl border-2 border-charcoal bg-surface p-6 sm:p-10 shadow-hard-lg space-y-8 transition-shadow duration-300 hover:shadow-hard-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline/30 pb-5">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-primary-container text-on-primary-container font-mono text-xs font-bold border border-charcoal shadow-xs">
                  live engine
                </span>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold lowercase text-charcoal">
                    sort colors (dutch national flag 3-pointer)
                  </h3>
                  <span className="text-xs font-mono text-on-surface-variant">
                    linear partition invariant with O(1) memory
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" variant="default" onClick={resetDemo} className="h-9 px-3.5 text-xs font-mono">
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    <span>reset</span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={stepDemo}
                    disabled={isDemoFinished}
                    className="h-9 px-4 text-xs font-mono font-bold"
                  >
                    <span>{isDemoFinished ? 'partition complete! 🎉' : `step ${demoStep + 1} →`}</span>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Interactive Array Elements with Animated Layout Transitions */}
            <div className="py-6 sm:py-8 px-3 sm:px-6 bg-dew-drop rounded-2xl border border-charcoal flex flex-col items-center gap-6 overflow-x-auto shadow-inner max-w-full">
              <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap min-w-max">
                {demoArr.map((val, idx) => {
                  const isLow = idx === demoLow;
                  const isMid = idx === demoMid;
                  const isHigh = idx === demoHigh;

                  return (
                    <motion.div
                      key={idx}
                      layout
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-[50px] sm:min-w-[60px] md:min-w-[72px]"
                    >
                      <div className="h-6 flex items-center justify-center gap-1 text-xs font-mono font-bold">
                        {isLow && <span className="bg-[#ba1a1a] text-white px-2 py-0.5 rounded-md shadow-xs">low</span>}
                        {isMid && <span className="bg-marker-orange text-white px-2 py-0.5 rounded-md shadow-xs">mid</span>}
                        {isHigh && <span className="bg-sprout-sticker text-white px-2 py-0.5 rounded-md shadow-xs">high</span>}
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        className={`w-12 h-14 sm:w-16 sm:h-20 md:w-20 md:h-24 flex items-center justify-center font-mono font-bold text-lg sm:text-2xl md:text-3xl rounded-xl sm:rounded-2xl border-2 shadow-hard transition-all duration-300 ${
                          val === 0
                            ? 'border-[#ba1a1a] bg-[#ffdad6] text-[#93000a]'
                            : val === 1
                            ? 'border-charcoal bg-surface text-charcoal'
                            : 'border-marker-orange bg-primary-fixed text-burnt-sienna'
                        } ${isMid ? 'ring-4 ring-marker-orange scale-105' : ''}`}
                      >
                        {val}
                      </motion.div>
                      <span className="text-xs font-mono text-on-surface-variant font-semibold">[{idx}]</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Step Explanation & Live Invariant State Inspector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-cream-paper border border-outline/30 text-xs sm:text-sm font-mono text-cocoa-ink flex items-start gap-3 shadow-xs">
                <Info className="w-5 h-5 text-marker-orange flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-charcoal block">current transition:</span>
                  <p className="leading-relaxed">{demoAction}</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-cream-paper border border-outline/30 text-xs font-mono text-cocoa-ink flex flex-col justify-center gap-2 shadow-xs">
                <span className="font-bold text-charcoal">partition ranges:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="text-[#93000a] font-bold">0s: [0..{demoLow > 0 ? demoLow - 1 : 'none'}]</span>
                  <span className="text-charcoal font-bold">1s: [{demoLow}..{demoMid > demoLow ? demoMid - 1 : 'none'}]</span>
                  <span className="text-burnt-sienna font-bold">2s: [{demoHigh < initialArr.length - 1 ? demoHigh + 1 : 'none'}..5]</span>
                  <span className="text-on-surface-variant">unsorted: [{demoMid}..{demoHigh}]</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* STATS / HIGH-YIELD STRIP WITH ZOOM-IN SCROLL TRIGGER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto pt-2 sm:pt-4"
        >
          <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            className="p-6 rounded-2xl border-2 border-charcoal bg-cream-paper shadow-hard text-center space-y-1.5"
          >
            <div className="font-display text-4xl sm:text-5xl font-black text-marker-orange">191</div>
            <div className="text-sm font-mono font-bold text-charcoal lowercase">sde sheet problems</div>
            <div className="text-xs font-sans text-on-surface-variant">hand-curated canonical solutions</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            className="p-6 rounded-2xl border-2 border-charcoal bg-cream-paper shadow-hard text-center space-y-1.5"
          >
            <div className="font-display text-4xl sm:text-5xl font-black text-sky-sticker">100%</div>
            <div className="text-sm font-mono font-bold text-charcoal lowercase">interactive visualizers</div>
            <div className="text-xs font-sans text-on-surface-variant">live pointer & node transitions</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            className="p-6 rounded-2xl border-2 border-charcoal bg-cream-paper shadow-hard text-center space-y-1.5"
          >
            <div className="font-display text-4xl sm:text-5xl font-black text-sprout-sticker">27</div>
            <div className="text-sm font-mono font-bold text-charcoal lowercase">core interview topics</div>
            <div className="text-xs font-sans text-on-surface-variant">arrays, trees, graphs, dp & more</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            className="p-6 rounded-2xl border-2 border-charcoal bg-cream-paper shadow-hard text-center space-y-1.5"
          >
            <div className="font-display text-4xl sm:text-5xl font-black text-bubblegum-sticker">&lt; 2 min</div>
            <div className="text-sm font-mono font-bold text-charcoal lowercase">concept brush-up</div>
            <div className="text-xs font-sans text-on-surface-variant">rapid revision before interviews</div>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. FEATURE GRID WITH ZOOM-IN SCROLL ANIMATIONS */}
      <section id="features" className="px-4 sm:px-8 lg:px-12 xl:px-16 py-20 bg-dew-drop/60 border-t border-charcoal/30 relative">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black lowercase text-charcoal tracking-tight">
              built for first-principles mastery
            </h2>
            <p className="text-sm sm:text-base font-mono text-on-surface-variant">
              everything you need to brush up key concepts and crack top-tier technical interviews
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Interactive Visualizers */}
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.03, y: -6 }}
              className="p-8 sm:p-10 rounded-3xl border-2 border-charcoal bg-surface shadow-hard space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-container border border-charcoal flex items-center justify-center text-on-primary-container shadow-xs">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold lowercase text-charcoal">191 interactive visualizers</h3>
                <p className="text-sm sm:text-base font-sans text-cocoa-ink leading-relaxed">
                  Step through every data structure transition with live pointer tracking, dynamic node scaling, and zero clipping.
                </p>
              </div>
            </motion.div>

            {/* Feature 2: Dual-Language Code Viewers */}
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -6 }}
              className="p-8 sm:p-10 rounded-3xl border-2 border-charcoal bg-surface shadow-hard space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-container border border-charcoal flex items-center justify-center text-on-primary-container shadow-xs">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold lowercase text-charcoal">dual-language code viewers</h3>
                <p className="text-sm sm:text-base font-sans text-cocoa-ink leading-relaxed">
                  Canonical Python 3 and modern C++ implementations formatted vertically with clean line gutters and complexity tags.
                </p>
              </div>
            </motion.div>

            {/* Feature 3: Great for Revising & Brushing Up Concepts */}
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.03, y: -6 }}
              className="p-8 sm:p-10 rounded-3xl border-2 border-charcoal bg-surface shadow-hard space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-container border border-charcoal flex items-center justify-center text-on-primary-container shadow-xs">
                  <Sparkles className="w-6 h-6 text-on-primary-container" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold lowercase text-charcoal">
                  great for revising &amp; brushing up concepts
                </h3>
                <p className="text-sm sm:text-base font-sans text-cocoa-ink leading-relaxed">
                  Speed through high-yield intuition summaries and pointer mechanics before interviews. Refresh core invariants and mental models in seconds without wading through hours of video lectures.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE COMPARISON / "WHY INTUITIONLAB" WITH ZOOM SPOTLIGHT */}
      <section id="revision" className="px-4 sm:px-8 lg:px-12 xl:px-16 py-20 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black lowercase text-charcoal tracking-tight">
            stop memorizing. start understanding.
          </h2>
          <p className="text-sm sm:text-base font-mono text-on-surface-variant">
            why top candidates brush up with visual step engines over static solution sheets
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Old Way */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="p-8 sm:p-10 rounded-3xl border-2 border-charcoal/40 bg-surface-container-low/60 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-red-100 text-red-700 border border-red-300">
                <XCircle className="w-6 h-6" />
              </span>
              <h3 className="font-display text-2xl font-bold lowercase text-charcoal/80">
                the traditional grind
              </h3>
            </div>
            <ul className="space-y-4 font-sans text-sm sm:text-base text-on-surface-variant">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold font-mono text-lg">✕</span>
                <span>Sitting through 45-minute video tutorials to understand a 2-line invariant leap.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold font-mono text-lg">✕</span>
                <span>Rote memorization of cryptic index bounds that vanish under interview anxiety.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold font-mono text-lg">✕</span>
                <span>No step-by-step pointers or visual feedback when edge cases fail.</span>
              </li>
            </ul>
          </motion.div>

          {/* IntuitionLab Way */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
            className="p-8 sm:p-10 rounded-3xl border-2 border-charcoal bg-surface shadow-hard-lg space-y-5 ring-2 ring-marker-orange/40 relative overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-sprout-sticker/20 text-sprout-sticker border border-sprout-sticker">
                <CheckCircle2 className="w-6 h-6" />
              </span>
              <h3 className="font-display text-2xl font-bold lowercase text-charcoal">
                the intuitionlab way
              </h3>
            </div>
            <ul className="space-y-4 font-sans text-sm sm:text-base text-cocoa-ink font-medium">
              <li className="flex items-start gap-3">
                <span className="text-sprout-sticker font-bold font-mono text-lg">✓</span>
                <span><strong>Instant Concept Recall:</strong> Brush up the core invariant in &lt; 60 seconds with live diagram transitions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sprout-sticker font-bold font-mono text-lg">✓</span>
                <span><strong>Deep Mental Models:</strong> Understand why the pointers move, cementing permanent problem-solving intuition.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sprout-sticker font-bold font-mono text-lg">✓</span>
                <span><strong>Dual Language Code:</strong> High-yield Python 3 and C++ snippets with zero clutter.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 6. TOPIC CURRICULUM WITH SEARCH, FILTER & EXPANSIVE 4-COLUMN ZOOM CARDS */}
      <section id="curriculum" className="px-4 sm:px-8 lg:px-12 xl:px-16 py-20 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/30 pb-5">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold lowercase text-charcoal">
                complete curriculum breakdown
              </h2>
              <p className="text-xs sm:text-sm font-mono text-on-surface-variant">
                27 topics spanning 191 interview-critical problems. Filter and search below:
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => onOpenNotebook()} className="h-10 px-5 font-mono text-xs font-bold shadow-hard">
                <span>explore all in notebook →</span>
              </Button>
            </motion.div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. Arrays, Trees, DP, Graphs)..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border-[1.5px] border-charcoal bg-cream-paper text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-marker-orange shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-on-surface-variant hover:text-charcoal cursor-pointer"
                >
                  clear
                </button>
              )}
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-charcoal text-white border-charcoal shadow-xs'
                      : 'bg-surface text-on-surface-variant border-charcoal/30 hover:bg-dew-drop'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Topics Grid with 4-Column Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          <AnimatePresence>
            {filteredTopics.map((topic, index) => {
              const firstProblem =
                problems.find(
                  p => p.topicFolder === topic.id || p.topicTitle.toLowerCase() === topic.title.toLowerCase()
                ) || topic.problems?.[0];
              const targetProblemId = firstProblem?.id || topic.problems?.[0]?.id || topic.id;

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, scale: 0.88, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenNotebook(targetProblemId)}
                  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-charcoal bg-surface hover:bg-dew-drop hover:border-marker-orange transition-all cursor-pointer shadow-hard group flex flex-col justify-between min-h-[130px] sm:min-h-[140px]"
                  title={`Explore ${topic.title} in Interactive Notebook`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-base font-bold lowercase text-charcoal group-hover:text-marker-orange transition-colors truncate">
                        {topic.title}
                      </span>
                      <span className="text-xs font-mono font-bold bg-primary-container px-2 py-0.5 rounded-md border border-charcoal shadow-xs flex-shrink-0">
                        {topic.count}
                      </span>
                    </div>
                    {firstProblem && (
                      <div className="mt-2.5 text-xs font-mono text-on-surface-variant group-hover:text-charcoal transition-colors flex items-center gap-1.5 truncate">
                        <span className="text-marker-orange font-bold">1st:</span>
                        <span className="truncate">{firstProblem.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-outline/20 flex items-center justify-between text-xs font-mono text-on-surface-variant group-hover:text-charcoal">
                    <span>open topic</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-charcoal/30 rounded-2xl bg-dew-drop/30 space-y-3">
            <p className="font-mono text-base text-charcoal font-bold">No topics found matching "{searchQuery}"</p>
            <Button size="sm" variant="default" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* 7. BOTTOM CALLOUT / REVISION BANNER WITH ZOOM IN */}
      <section className="px-3 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl sm:rounded-3xl border-2 border-charcoal bg-gradient-to-br from-primary-fixed/60 via-dew-drop to-secondary-container/40 p-6 sm:p-12 md:p-16 text-center shadow-hard-lg space-y-6 sm:space-y-8 relative overflow-hidden"
        >
          <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black lowercase text-charcoal tracking-tight">
              ready to master the sde sheet?
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-sans text-cocoa-ink leading-relaxed">
              Step through all 191 visual problem solutions, test your mental models, and brush up on optimal invariants before your next interview round.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Button
              onClick={() => onOpenNotebook()}
              className="h-12 sm:h-14 px-6 sm:px-10 rounded-xl border-2 border-charcoal bg-primary-container text-on-primary-container hover:bg-primary-container/90 text-base sm:text-lg font-bold shadow-hard transition-all flex items-center gap-2.5"
            >
              <BookOpen className="w-5 h-5" />
              <span>launch interactive notebook</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-charcoal/30 bg-dew-drop py-8 sm:py-12 px-4 text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-container text-on-primary-container font-extrabold text-xs border border-charcoal shadow-xs">
            <Lightbulb className="w-3.5 h-3.5 text-on-primary-container" />
          </span>
          <span className="font-display text-base sm:text-lg font-bold lowercase text-charcoal">
            intuition<span className="text-marker-orange">lab.</span>
          </span>
        </div>
        <p className="text-xs font-mono text-on-surface-variant">
          made with <strong className="text-marker-orange">marker orange</strong> &amp;{' '}
          <strong className="text-cocoa-ink">cocoa ink</strong> ✦ great for interview revision &amp; first-principles mastery
        </p>
      </footer>

      {/* 9. FLOATING BACK TO TOP BUTTON WITH SPRING ZOOM */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-xl bg-primary-container text-on-primary-container border-2 border-charcoal shadow-hard cursor-pointer transition-colors"
            title="Back to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

