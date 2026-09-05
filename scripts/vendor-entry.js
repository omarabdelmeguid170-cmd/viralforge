/* ============================================================
   ViralForge — scripts/vendor-entry.js
   Bundle entry: gathers all third-party dependencies into one
   IIFE that exposes a single global `window.VF`.
   Tree-shaken: only the Lucide icons we actually use are kept.
   ============================================================ */

import Gsap from "gsap";
import Lenis from "lenis";
import { autoAnimate } from "@formkit/auto-animate";
import confetti from "canvas-confetti";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { createStore } from "zustand/vanilla";
import { createElement, createIcons } from "lucide";
import {
  Activity, ArrowLeftRight, ArrowRight, ArrowUp, BarChart3, Bell, Bolt, Bookmark,
  Brain, Check, Clock, Coins, Copy, CopyPlus, Crown, Download, ExternalLink, Eye,
  Filter, Flag, Gauge, Gift, Globe, Heart, LayoutGrid, Link, Lock, Map, MessageCircle,
  Mouse, Pen, Quote, RefreshCw, Rocket, Search, Share2, ShieldCheck, Sparkles, Star,
  Tag, Trash2, TrendingUp, Trophy, Tv, Upload, Users, Video, Wrench, Zap
} from "lucide";

/* map our internal icon names to Lucide icon nodes */
const LUCIDE_REG = {
  grid: LayoutGrid, pulse: Activity, bolt: Bolt, eye: Eye, pen: Pen, map: Map,
  users: Users, swap: ArrowLeftRight, heart: Heart, flag: Flag, clock: Clock,
  up: ArrowUp, check: Check, star: Star, comment: MessageCircle, clone: CopyPlus,
  search: Search, upload: Upload, trash: Trash2, copy: Copy, external: ExternalLink,
  video: Video, gift: Gift, rocket: Rocket, download: Download, chart: BarChart3,
  sparkle: Sparkles, shield: ShieldCheck, quote: Quote, bookmark: Bookmark,
  crown: Crown, trophy: Trophy, share: Share2, coins: Coins, lock: Lock,
  mouse: Mouse, tv: Tv, tag: Tag, zap: Zap, brain: Brain, filter: Filter,
  wrench: Wrench, arrow: ArrowRight, gauge: Gauge, link: Link, bell: Bell,
  world: Globe, refresh: RefreshCw, trend: TrendingUp
};

/* render a named Lucide icon to inline SVG markup (or null) */
function lucideIcon(name, size) {
  try {
    const node = LUCIDE_REG[name];
    if (!node) return null;
    const el = createElement(node, {
      width: size || 24,
      height: size || 24,
      "aria-hidden": "true"
    });
    return el && el.outerHTML ? el.outerHTML : null;
  } catch (e) {
    return null;
  }
}

/* class name merger: clsx + tailwind-merge */
function cn() {
  return twMerge(clsx.apply(null, arguments));
}

module.exports = {
  gsap: Gsap,
  Lenis,
  autoAnimate,
  confetti,
  createStore,
  createIcons,
  clsx,
  twMerge,
  lucideIcon,
  cn
};