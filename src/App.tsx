/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
export class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = { hasError: false };
  }
  public static getDerivedStateFromError() { return { hasError: true }; }
  public componentDidCatch(error: any, errorInfo: any) { console.error(error, errorInfo); }
  public render() {
    if ((this as any).state.hasError) return <div className="text-white p-20 text-center font-bold py-32 bg-zinc-900/50 rounded-3xl m-8 border border-zinc-800">เกิดข้อผิดพลาด กรุณารีเฟรชหน้าเว็บ</div>;
    return (this as any).props.children;
  }
}
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  ShieldCheck, 
  Smartphone, 
  Zap, 
  Clock, 
  LayoutDashboard, 
  Layers, 
  Star,
  CreditCard,
  Headset, 
  Gift, 
  UserPlus, 
  LogIn, 
  PlayCircle, 
  MessageCircle, 
  Send, 
  Mail,
  CheckCircle2,
  TrendingUp,
  Gem,
  Crown,
  Monitor,
  BookOpen,
  ArrowRight,
  Calendar,
  Flame,
  Activity,
  Circle,
  User,
  Share2,
  Facebook,
  Twitter,
  Link as LinkIcon,
  List,
  Check,
  Sparkles,
  Copy,
  User,
  MapPin,
  Trophy,
  Gem,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Helmet } from 'react-helmet-async';
import LiveChat from './components/LiveChat';
import { Article } from './types';

// --- Constants & Data ---

const CATEGORY_MAP: Record<string, string> = {
  'บาคาร่า': 'baccarat',
  'วิธีเล่นเบื้องต้น': 'beginner-guide',
  'สูตรบาคาร่า': 'baccarat-strategy',
  'ทริคระดับเซียน': 'expert-tips',
  'ข่าวสารคาสิโน': 'casino-news',
  'เทคนิคการเดินเงิน': 'money-management',
  'เคล็ดลับการเล่น': 'playing-tips'
};

const REVERSE_CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

const MENU_ITEMS = [
  { label: 'บาคาร่า', path: '/' },
  { label: 'บาคาร่าออนไลน์', path: '/baccarat' },
  { label: 'จุดเด่น', path: '/features' },
  { label: 'โปรโมชั่น', path: '/promotions' },
  { label: 'บทความ', path: '/articles' },
  { label: 'ติดต่อเรา', path: '/contact' },
];

const LIVE_STATS = [
  {
    provider: 'SA Gaming',
    table: 'Table E03',
    status: 'กำลังแจกไพ่',
    hot: 'Banker',
    streak: 4,
    stats: { banker: 52, player: 38, tie: 10 },
    history: ['B', 'B', 'B', 'B', 'P', 'B', 'T', 'P', 'B', 'B']
  },
  {
    provider: 'Sexy Baccarat',
    table: 'Room 08',
    status: 'รอเดิมพัน',
    hot: 'Player',
    streak: 3,
    stats: { banker: 40, player: 55, tie: 5 },
    history: ['P', 'P', 'P', 'B', 'P', 'T', 'P', 'P', 'B', 'P']
  },
  {
    provider: 'Dream Gaming',
    table: 'Table 01',
    status: 'กำลังสับไพ่',
    hot: 'Tie',
    streak: 1,
    stats: { banker: 45, player: 45, tie: 10 },
    history: ['T', 'B', 'P', 'B', 'P', 'B', 'P', 'B', 'P', 'T']
  }
];

const HIGHLIGHTS = [
  {
    icon: <Zap className="w-8 h-8 text-red-500" />,
    title: 'ฝากถอนออโต้ 10 วิ',
    description: 'รวดเร็ว ทันใจ ไม่ต้องรอนาน ทำรายการได้ด้วยตัวเอง'
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-amber-500" />,
    title: 'บาคาร่าเว็บตรง 100%',
    description: 'ปลอดภัย ไม่ผ่านเอเย่นต์ มั่นคงทางการเงิน จ่ายจริงทุกยอด'
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-red-500" />,
    title: 'เริ่มต้นเพียง 10 บาท',
    description: 'ทุนน้อยก็เล่นได้ ไม่มีขั้นต่ำ เหมาะสำหรับทุกคน'
  },
  {
    icon: <Monitor className="w-8 h-8 text-amber-500" />,
    title: 'คาสิโนสด ภาพคมชัด',
    description: 'สตรีมมิ่งตรงจากคาสิโนจริงระดับโลก ลื่นไหลไม่มีสะดุด'
  },
  {
    icon: <Smartphone className="w-8 h-8 text-red-500" />,
    title: 'รองรับทุกธนาคาร & วอเลท',
    description: 'สะดวกสบาย ทุกช่องทางการเงิน บาคาร่าทรูวอเลท'
  },
  {
    icon: <Clock className="w-8 h-8 text-amber-500" />,
    title: 'บริการลูกค้า 24 ชม.',
    description: 'ทีมงานมืออาชีพพร้อมดูแลและให้คำปรึกษาตลอดเวลา'
  }
];

const WHY_CHOOSE = [
  {
    image: 'https://img1.pic.in.th/images/Stable-system-no-interruptions.png',
    title: 'ระบบเสถียร ไม่มีสะดุด',
    description: 'เล่นบาคาร่าได้อย่างลื่นไหล แทงได้ทุกไม้ไม่มีพลาด ด้วยเซิร์ฟเวอร์คุณภาพสูง'
  },
  {
    image: 'https://img1.pic.in.th/images/A-collection-of-leading-baccarat-providers..png',
    title: 'รวมค่ายบาคาร่าชั้นนำ',
    description: 'มีให้เลือกเล่นครบทั้ง SA Gaming, Sexy Baccarat และค่ายดังอื่นๆ อีกมากมาย'
  },
  {
    image: 'https://img2.pic.in.th/Unlimited-withdrawals-guaranteed-payouts.png',
    title: 'ถอนได้ไม่อั้น จ่ายจริง',
    description: 'เล่นได้หลักล้านก็จ่าย ถอนเงินได้ไม่จำกัดจำนวนครั้งต่อวัน'
  },
  {
    image: 'https://img2.pic.in.th/Return-the-lost-amount-every-week.png',
    title: 'คืนยอดเสียทุกสัปดาห์',
    description: 'รับโบนัสคืนยอดเสียสูงสุด นำไปต่อยอดทำกำไรได้ทันที ไม่ต้องทำเทิร์น'
  },
  {
    image: 'https://img2.pic.in.th/Customer-information-is-confidential.png',
    title: 'ข้อมูลลูกค้าเป็นความลับ',
    description: 'ระบบรักษาความปลอดภัยขั้นสูงสุด ข้อมูลไม่มีรั่วไหล ปลอดภัย 100%'
  }
];

const CATEGORIES = [
  {
    title: 'Sexy Baccarat',
    description: 'ดีลเลอร์สาวสวยสุดเซ็กซี่ พร้อมแจกไพ่ให้คุณลุ้นสนุกทุกตา เพลิดเพลินไม่มีเบื่อ',
    accent: 'from-red-600 to-red-900',
    image: 'https://img2.pic.in.th/55-Sexy-Baccarat-Bocker168-1.png',
    logo: 'https://placehold.co/100x100?text=Sexy'
  },
  {
    title: 'SA Gaming',
    description: 'ค่ายคาสิโนระดับตำนาน มาตรฐานสากล มั่นคงที่สุด ภาพคมชัดระดับ Full HD',
    accent: 'from-amber-600 to-amber-900',
    image: 'https://img1.pic.in.th/images/SA-Gaming-Bocker168.webp',
    logo: 'https://placehold.co/100x100?text=SA'
  },
  {
    title: 'Dream Gaming',
    description: 'บาคาร่าสดพร้อมฟีเจอร์แชทพูดคุยกับผู้เล่นอื่นได้ เพิ่มอรรถรสในการเดิมพัน',
    accent: 'from-red-600 to-red-900',
    image: 'https://img1.pic.in.th/images/Dream-Gaming-Bocker168.webp',
    logo: 'https://placehold.co/100x100?text=DG'
  },
  {
    title: 'Pretty Gaming',
    description: 'สัมผัสประสบการณ์วีไอพีกับดีลเลอร์สาวพริตตี้ระดับท็อป บริการระดับพรีเมียม',
    accent: 'from-zinc-700 to-zinc-900',
    image: 'https://img1.pic.in.th/images/Pretty-Gaming-Bocker168.webp',
    logo: 'https://placehold.co/100x100?text=Pretty'
  },
  {
    title: 'Asia Gaming',
    description: 'คาสิโนสดสไตล์เอเชีย รูปแบบการเล่นเข้าใจง่าย เหมาะกับนักเดิมพันทุกระดับ',
    accent: 'from-zinc-700 to-zinc-900',
    image: 'https://img2.pic.in.th/Asia-Gaming-Bocker168.png',
    logo: 'https://placehold.co/100x100?text=AG'
  },
  {
    title: 'Evolution Gaming',
    description: 'พรีเมียมคาสิโนจากยุโรป มุมกล้องหลากหลายสมจริง เหมือนนั่งอยู่ในคาสิโนจริง',
    accent: 'from-amber-600 to-amber-900',
    image: 'https://img1.pic.in.th/images/Evolution-Gaming-Bocker168.webp',
    logo: 'https://placehold.co/100x100?text=Evo'
  }
];

const STEPS = [
  {
    number: '01',
    title: 'สมัครสมาชิก',
    description: 'กรอกเบอร์โทรศัพท์และข้อมูลบัญชีธนาคารผ่านระบบออโต้ ใช้เวลาเพียง 1 นาที',
    image: 'https://img1.pic.in.th/images/Signing-up-for-Bocker168-takes-only-1-minute.png'
  },
  {
    number: '02',
    title: 'ฝากเงินเข้าเล่น',
    description: 'ทำรายการฝากเงิน ไม่มีขั้นต่ำ รองรับทุกธนาคารและ True Wallet',
    image: 'https://img1.pic.in.th/images/Deposit-money-to-play-at-Bocker168.png'
  },
  {
    number: '03',
    title: 'เข้าโต๊ะบาคาร่า',
    description: 'เลือกค่ายเกมที่คุณชื่นชอบ และเริ่มต้นทำกำไรจากบาคาร่าได้ทันที',
    image: 'https://img2.pic.in.th/Choose-the-Baccarat-game-at-Bocker168.png'
  }
];

const PROMOTIONS = [
  {
    badge: 'NEW',
    image: 'https://img.hongkonglex.com/New-members-receive-a-100-bonus.png',
    title: 'สมาชิกใหม่รับโบนัส 100%',
    description: 'ฝากครั้งแรกรับโบนัสเพิ่มทันที ทำเทิร์นน้อย ถอนได้ไม่อั้น คุ้มค่าที่สุด',
    details: 'โปรโมชั่นสำหรับสมาชิกใหม่ที่มียอดฝากครั้งแรกเท่านั้น รับโบนัสสูงสุด 1,000 บาท ทำเทิร์นเพียง 5 เท่า ถอนได้ทันที ไม่จำกัดยอดถอนสูงสุด',
    cta: 'รับสิทธิ์เลย'
  },
  {
    badge: 'CASHBACK',
    image: 'https://img.hongkonglex.com/Get-5-cashback-on-losses-every-week.jpg',
    title: 'คืนยอดเสีย 5% ทุกสัปดาห์',
    description: 'เล่นเสียไม่ต้องเศร้า เรารับประกันคืนยอดเสียให้ นำไปเป็นทุนต่อยอดได้',
    details: 'ระบบจะคำนวณยอดเสียสะสมตั้งแต่วันจันทร์ถึงวันอาทิตย์ และคืนเข้ากระเป๋าเครดิตของคุณทุกวันจันทร์ เวลา 12:00 น. โดยอัตโนมัติ ไม่ต้องทำเทิร์น',
    cta: 'ดูรายละเอียด'
  },
  {
    badge: 'COMMISSION',
    image: 'https://img.hongkonglex.com/refer-a-friend-commission.jpg',
    title: 'แนะนำเพื่อนรับค่าคอม',
    description: 'ชวนเพื่อนมาเล่นบาคาร่า รับค่าคอมมิชชั่นทุกยอดการเล่นของเพื่อน สร้างรายได้ง่ายๆ',
    details: 'รับค่าคอมมิชชั่น 0.8% จากทุกยอดการเดิมพันของเพื่อนที่คุณแนะนำ ยิ่งเพื่อนเล่นมาก คุณยิ่งได้มาก ถอนเป็นเงินสดได้ทุกวัน ไม่จำกัดจำนวนเพื่อน',
    cta: 'ดูโปรโมชั่นทั้งหมด'
  }
];

const FAQS = [
  {
    question: 'บาคาร่า คืออะไร?',
    answer: 'บาคาร่าคือเกมไพ่คาสิโนที่แบ่งฝ่ายผู้เล่น (Player) และเจ้ามือ (Banker) ทายฝั่งไหนแต้มใกล้ 9 สุดเป็นผู้ชนะ เล่นง่าย จบไว ได้เงินเร็ว'
  },
  {
    question: 'Bocker168 เป็นบาคาร่าเว็บตรงหรือไม่?',
    answer: 'ใช่ เราเป็นเว็บตรงไม่ผ่านเอเย่นต์ มีใบรับรองคาสิโนออนไลน์ถูกต้อง มั่นคงทางการเงิน 100%'
  },
  {
    question: 'ฝากถอนขั้นต่ำเท่าไหร่?',
    answer: 'ระบบฝากถอนออโต้ของเราไม่มีขั้นต่ำ 1 บาทก็ฝากได้ ถอนได้สูงสุดไม่จำกัดจำนวนครั้ง'
  },
  {
    question: 'เล่นบนมือถือได้ไหม?',
    answer: 'รองรับการเล่นบนสมาร์ทโฟนทุกรุ่น ทุกระบบ (iOS และ Android) โดยไม่ต้องโหลดแอปพลิเคชัน เล่นผ่านเบราว์เซอร์ได้เลย'
  },
  {
    question: 'มีสูตรบาคาร่าให้ใช้ไหม?',
    answer: 'เรามีกลุ่ม VIP นำเล่นและแจกสูตรบาคาร่า AI ให้สมาชิกใช้งานฟรี เพื่อเพิ่มโอกาสในการชนะ'
  },
  {
    question: 'ถอนเงินใช้เวลานานแค่ไหน?',
    answer: 'ระบบออโต้ของเราประมวลผลการถอนเงินภายใน 10 วินาที เงินเข้าบัญชีทันที รวดเร็วทันใจ'
  }
];

const CDN_URL = import.meta.env.VITE_CDN_URL?.replace(/\/$/, '') || '';

export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/images/') && CDN_URL) {
    return `${CDN_URL}${path}`;
  }
  return path;
};

// --- Components ---

interface SectionTitleProps {
  title: string;
  subtitle?: string | null;
  centered?: boolean;
  as?: 'h1' | 'h2';
}

const SectionTitle = ({ title, subtitle = null, centered = true, as = 'h2' }: SectionTitleProps) => {
  const Tag = as === 'h1' ? motion.h1 : motion.h2;
  return (
  <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
    <Tag 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${as === 'h1' ? 'text-3xl md:text-4xl lg:text-5xl font-black' : 'text-2xl md:text-3xl lg:text-4xl font-bold'} text-white mb-4`}
    >
      {title}
    </Tag>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-zinc-400 max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
    <div className={`h-1 w-20 bg-gradient-to-r from-red-600 to-amber-500 mt-6 ${centered ? 'mx-auto' : ''}`} />
  </div>
)};

interface FAQItemProps {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
  key?: React.Key;
}

const FAQItem = ({ faq, isOpen, onClick }: FAQItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Scroll behavior removed as requested by user
  }, [isOpen]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(faq.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqId = faq.question
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/(^-|-$)/g, '');
    
  return (
  <div ref={itemRef} className="border-b border-zinc-800 last:border-0 group">
    <div className="flex items-start gap-4">
      <button 
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faqId}`}
        id={`faq-question-${faqId}`}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="flex-1 flex flex-col gap-2">
          <h3 className={`text-lg md:text-xl font-bold transition-all duration-300 ${isOpen ? 'text-amber-500 translate-x-2' : 'text-zinc-100 group-hover:text-amber-500/80 group-hover:translate-x-1'}`}>
            {faq.question}
          </h3>
        </span>
        <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-amber-500/10 rotate-180' : 'bg-zinc-900 group-hover:bg-zinc-800'}`}>
          <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-amber-500' : 'text-zinc-400 group-hover:text-amber-500'}`} aria-hidden="true" />
        </span>
      </button>
    </div>

    <AnimatePresence>
      {isOpen && (
        <motion.div 
          id={`faq-answer-${faqId}`}
          role="region"
          aria-labelledby={`faq-question-${faqId}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="overflow-hidden"
        >
          <div className="pb-8 pr-12 text-zinc-400 leading-relaxed text-sm md:text-base">
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 mb-4 relative group/copy">
              <p className="text-zinc-300 pr-10">{faq.answer}</p>
              <button
                onClick={handleCopy}
                aria-label="คัดลอกคำตอบ"
                title="คัดลอก"
                className={`absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all backdrop-blur-sm shadow-lg ${copied ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'hover:bg-amber-500 hover:text-white'}`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)};

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = ({ onAccept, onReject, onManage }: { onAccept: () => void; onReject: () => void; onManage: () => void }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-6"
  >
    <div className="container mx-auto">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl flex flex-col xl:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck className="text-red-500 w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">เราใช้คุกกี้เพื่อประสบการณ์ที่ดีที่สุด</h4>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
              เราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพในการใช้งานเว็บไซต์ และนำเสนอเนื้อหาที่ตรงกับความสนใจของคุณ 
              คุณสามารถเลือกตั้งค่าคุกกี้ได้ตามความต้องการ
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <button 
            onClick={onManage}
            className="flex-1 md:flex-none px-4 py-3 text-zinc-400 hover:text-white text-sm font-bold transition-colors"
          >
            ตั้งค่าคุกกี้
          </button>
          <button 
            onClick={onReject}
            className="flex-1 md:flex-none px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            ปฏิเสธทั้งหมด
          </button>
          <button 
            onClick={onAccept}
            className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-900/40 transition-all active:scale-95"
          >
            ยอมรับทั้งหมด
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const CookieSettingsModal = ({ 
  isOpen, 
  onClose, 
  settings, 
  setSettings, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  settings: CookieSettings; 
  setSettings: React.Dispatch<React.SetStateAction<CookieSettings>>;
  onSave: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white">ตั้งค่าคุกกี้</h3>
              <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800">
                <div>
                  <h4 className="text-white font-bold mb-1">คุกกี้ที่จำเป็น (Necessary)</h4>
                  <p className="text-zinc-400 text-xs max-w-[250px]">คุกกี้พื้นฐานที่จำเป็นสำหรับการทำงานของเว็บไซต์ เช่น การรักษาความปลอดภัยและการเข้าสู่ระบบ ไม่สามารถปิดการใช้งานได้</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-medium">เปิดใช้งานเสมอ</span>
                  <div className="w-12 h-6 bg-red-600 rounded-full relative opacity-50 cursor-not-allowed">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800">
                <div>
                  <h4 className="text-white font-bold mb-1">คุกกี้เพื่อการวิเคราะห์ (Analytics)</h4>
                  <p className="text-zinc-400 text-xs max-w-[250px]">ช่วยให้เราเก็บสถิติและเข้าใจพฤติกรรมการใช้งานเว็บไซต์ เพื่อนำไปพัฒนาประสบการณ์การใช้งานให้ดียิ่งขึ้น</p>
                </div>
                <button 
                  onClick={() => setSettings(s => ({ ...s, analytics: !s.analytics }))}
                  className={`w-12 h-6 rounded-full relative transition-colors ${settings.analytics ? 'bg-red-600' : 'bg-zinc-700'}`}
                >
                  <motion.div 
                    animate={{ x: settings.analytics ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full" 
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800">
                <div>
                  <h4 className="text-white font-bold mb-1">คุกกี้เพื่อการตลาด (Marketing)</h4>
                  <p className="text-zinc-400 text-xs max-w-[250px]">ช่วยให้เรานำเสนอเนื้อหาและโปรโมชันที่ตรงกับความสนใจของคุณ รวมถึงการแสดงโฆษณาที่เกี่ยวข้อง</p>
                </div>
                <button 
                  onClick={() => setSettings(s => ({ ...s, marketing: !s.marketing }))}
                  className={`w-12 h-6 rounded-full relative transition-colors ${settings.marketing ? 'bg-red-600' : 'bg-zinc-700'}`}
                >
                  <motion.div 
                    animate={{ x: settings.marketing ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full" 
                  />
                </button>
              </div>
            </div>

            <button 
              onClick={onSave}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-900/40"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const PromotionModal = ({ 
  promo, 
  onClose 
}: { 
  promo: typeof PROMOTIONS[0] | null; 
  onClose: () => void;
}) => (
  <AnimatePresence>
    {promo && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div className="h-40 bg-gradient-to-br from-red-600 to-red-900 relative flex items-center justify-center">
            <Gift className="w-20 h-20 text-white/20" />
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute -bottom-6 left-8 px-6 py-2 bg-zinc-900 border border-zinc-800 text-red-500 text-xs font-black rounded-full shadow-xl">
              {promo.badge}
            </div>
          </div>
          
          <div className="p-8 pt-12">
            <h3 className="text-3xl font-bold text-white mb-4">{promo.title}</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              {promo.details}
            </p>
            
            <div className="space-y-4">
              <a 
                href="https://inlnk.co/registerbocker168" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {promo.cta} <Zap className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

import AdminDashboard from './components/AdminDashboard';

const ArticlesPagination = ({ items, dynamicCategoryMap, itemsPerPage = 9 }: { items: Article[], dynamicCategoryMap: Record<string, string>, itemsPerPage?: number }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {currentItems.map((article, index) => (
          <ArticleCard key={article.id || index} article={article} index={index} dynamicCategoryMap={dynamicCategoryMap} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-900 border border-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            ←
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                currentPage === i + 1 
                  ? 'bg-red-600 text-white border border-red-500' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-900 border border-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            →
          </button>
        </div>
      )}
      
      {items.length === 0 && (
        <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-4">ยังไม่มีบทความ</h2>
        </div>
      )}
    </div>
  );
};

const getArticleExcerpt = (text: string) => {
  if (!text) return '';
  const stripped = text.replace(/<[^>]+>/g, '').trim(); 
  return stripped.length > 200 ? stripped.substring(0, 200) + '...' : stripped;
};

const ArticleCard = ({ article, index, dynamicCategoryMap }: { article: Article, index: number, dynamicCategoryMap: Record<string, string>, key?: any }) => {
  const postSlug = article.slug || article.title.replace(/\s+/g, '-').toLowerCase();
  const categorySlug = dynamicCategoryMap[article.category] || article.category;

  return (
    <motion.div
      key={article.id || index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden hover:border-red-600/30 transition-all duration-500 flex flex-col"
    >
      <div className="flex flex-col h-full relative">
        <Link 
          to={`/category/${encodeURIComponent(categorySlug)}`}
          className="absolute top-4 left-4 z-20 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors"
        >
          {article.category}
        </Link>
        <Link to={`/${encodeURIComponent(postSlug)}`} className="flex flex-col h-full">
          <div className="h-56 overflow-hidden relative">
          {article.image ? (
            <img 
              src={article.image || null} 
              alt={article.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-zinc-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80" />
        </div>
        
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-4 text-zinc-400 text-sm mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{article.date}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-2">
                {article.authorImage ? (
                  <img src={article.authorImage} alt={article.author} className="w-5 h-5 rounded-full object-cover border border-zinc-700" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="truncate max-w-[100px]">{article.author}</span>
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 text-justify flex-grow">
            {article.excerpt || getArticleExcerpt((article as any).description || article.content)}
          </p>
          
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm group/btn mt-auto w-fit">
            อ่านเพิ่มเติม
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
    </motion.div>
  );
};



const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <section className="py-24 bg-zinc-950/50 relative overflow-hidden" id="contact-form-section">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">ติดต่อ Bocker168</h1>
            <p className="text-zinc-400 text-lg">มีข้อสงสัยหรือต้องการความช่วยเหลือ? ทีมงานของเราพร้อมให้บริการคุณตลอด 24 ชั่วโมง</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-amber-500" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">ชื่อของคุณ</label>
                  <input
                    required
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-sans"
                    placeholder="ใส่ชื่อของคุณ"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">อีเมล (ถ้ามี)</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-sans"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-zinc-400 mb-2">หัวข้อที่ต้องการติดต่อ</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-sans"
                >
                  <option value="">เลือกหัวข้อ...</option>
                  <option value="deposit">แจ้งปัญหา ฝาก-ถอน</option>
                  <option value="register">สอบถามวิธีสมัครสมาชิก</option>
                  <option value="promotion">สอบถามโปรโมชั่น</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">ข้อความ</label>
                <textarea
                  required
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-sans resize-none"
                  placeholder="พิมพ์ข้อความของคุณที่นี่..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-zinc-800 disabled:to-zinc-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {status === 'submitting' ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : status === 'success' ? (
                  <>ส่งข้อความสำเร็จแล้ว <CheckCircle2 className="w-5 h-5" /></>
                ) : (
                  <>ส่งข้อความ <MessageSquare className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const BaccaratGuide = () => {
  return (
    <section className="py-16 bg-zinc-950">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="เริ่มต้นเล่นบาคาร่าง่ายๆ ใน 3 ขั้นตอน"
          subtitle="สมัคร ฝาก เล่น ทำกำไรได้ทันที ไม่ต้องรอนานด้วยระบบออโต้"
          centered={true}
          as="h2"
        />

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="mt-16 pb-16 relative z-10"
        >
          {STEPS.map((step, i) => (
            <SwiperSlide key={i} className="h-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group h-full"
              >
                <div className="flex flex-col items-center min-h-[200px] justify-end mb-8">
                  {step.image ? (
                    <div className="mb-6 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg max-w-[280px] group-hover:border-red-500/50 transition-colors">
                      <img 
                        src={step.image || null} 
                        alt={step.title} 
                        className="w-full h-auto object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="mb-6 h-[120px] flex items-center justify-center">
                    </div>
                  )}
                  <div className="w-20 h-20 bg-zinc-900 border-4 border-zinc-800 rounded-full flex items-center justify-center shadow-xl group-hover:border-red-600 transition-all">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-amber-500">
                      {step.number}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-500 transition-colors">{step.title}</h3>
                <p className="text-zinc-500 max-w-xs mb-8">
                  {step.description}
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

const SeoContentBlock = () => {
  return (
    <section className="py-16 bg-black border-t border-zinc-900/50 border-b relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="prose prose-invert prose-lg prose-red mx-auto text-zinc-300">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-8 text-white">บาคาร่า เว็บตรงอันดับ 1 Bocker168 เว็บบาคาร่าออนไลน์ยอดนิยม</h2>
          <p className="leading-relaxed mb-6">
            หากคุณกำลังมองหา <strong>เว็บบาคาร่าออนไลน์</strong> ที่เชื่อถือได้และได้มาตรฐานระดับสากล <strong>Bocker168</strong> คือคำตอบที่ใช่ที่สุดสำหรับคุณ! เราคือผู้ให้บริการ <a href="/" className="text-red-500 hover:text-red-400 no-underline">บาคาร่าเว็บตรงไม่ผ่านเอเย่นต์</a> อันดับ 1 ของไทย ที่นำเสนอประสบการณ์การเล่นคาสิโนสดที่เหนือระดับ ด้วยระบบสตรีมมิ่งความละเอียดคมชัด Full HD ส่งตรงจากคาสิโนต่างประเทศที่ได้รับใบอนุญาต (License) อย่างถูกต้องตามกฎหมาย
          </p>
  
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-white mt-12">ทำไมต้องเลือกเล่น บาคาร่าออนไลน์ กับ Bocker168?</h3>
          <ul className="space-y-4 mb-8">
            <li className="flex gap-3">
              <span className="text-red-500 font-bold">✓</span> 
              <span><strong>ฝาก-ถอน ระบบออโต้ (Auto):</strong> รวดเร็วทันใจภายใน 10 วินาที ไม่ต้องส่งสลิป ยอดอัปเดตอัตโนมัติ</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500 font-bold">✓</span> 
              <span><strong>ไม่มีขั้นต่ำ:</strong> ทุนน้อยก็รวยได้ เริ่มต้นเดิมพันฝากถอนไม่มีขั้นต่ำ 10 บาทก็เล่นคาสิโนสดได้ทุกค่าย</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500 font-bold">✓</span> 
              <span><strong>รองรับทุกระบบ:</strong> ทำงานร่วมกับระบบธนาคารชั้นนำของไทยทั้งหมด รวมถึง <em>True Wallet (ทรูวอเลท)</em> มั่นใจในความสะดวกสบาย</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500 font-bold">✓</span> 
              <span><strong>รวมค่ายดังครบจบในเว็บเดียว:</strong> ทั้ง Sexy Baccarat, SA Gaming, Dream Gaming, Pretty Gaming และอื่นๆ อีกมากมาย</span>
            </li>
          </ul>
  
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-white mt-12">เทคนิคและสูตรบาคาร่า (Baccarat Strategy) การอ่านเค้าไพ่เบื้องต้น</h3>
          <p className="leading-relaxed mb-6">
            การทำกำไรจากการเล่นบาคาร่าไม่ได้พึ่งพาแค่ดวง แต่คือการผสมผสานการวิเคราะห์สถิติและการเดินเงินอย่างมีระบบ เค้าไพ่บาคาร่ายอดนิยมที่เหล่านักเดิมพันนิยมใช้ได้แก่:
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8 mt-8">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h4 className="text-white font-bold mb-3 text-lg">1. เค้าไพ่มังกร (Dragon)</h4>
              <p className="text-sm">การที่ผลการชนะออกฝั่งใดฝั่งหนึ่งติดต่อกันยาวๆ อย่างน้อยยาว 4-5 ตาติดกัน (เช่น แดง-แดง-แดง-แดง) วิธีการคือให้แทงตามน้ำไปเรื่อยๆ จนกว่าไพ่จะเปลี่ยนฝั่ง</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h4 className="text-white font-bold mb-3 text-lg">2. เค้าไพ่ปิงปอง (Ping Pong)</h4>
              <p className="text-sm">ผลออกสลับฝั่งชนะกันไปมา (เช่น แดง-น้ำเงิน-แดง-น้ำเงิน) ให้คุณแทงสลับสีในรอบถัดไปตามจังหวะลูกปิงปอง</p>
            </div>
          </div>
  
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white mt-12">การบริหารเงินลงทุน (Money Management)</h3>
          <p className="leading-relaxed mb-6">
            การเดินเงินคือหัวใจสำคัญของการเล่นคาสิโนให้ยั่งยืน เราแนะนำสูตรเดินเงินมาติงเกล (Martingale) ทบไม้ หรือสูตร N+1 สำหรับผู้เริ่มต้นเพื่อกระจายความเสี่ยงและตามทุนคืนได้เมื่อมีความผิดพลาด ทั้งนี้ควรตั้งเป้าหมายการได้-เสียในแต่ละวันให้ชัดเจนและปฏิบัติตามอย่างเคร่งครัด
          </p>

          <div className="bg-gradient-to-r from-red-950/20 to-black border border-red-900/30 rounded-2xl p-8 my-12">
            <h3 className="text-2xl font-bold text-white mb-4">กฎกติกาการนับแต้มบาคาร่า (เบื้องต้น)</h3>
            <p className="text-zinc-400 mb-6">
              การเล่นประกอบด้วย 2 ฝั่งคือ ฝั่งผู้เล่น (Player - สีน้ำเงิน) และฝั่งเจ้ามือ (Banker - สีแดง) โดยดีลเลอร์จะแจกไพ่ฝ่ายละ 2 ใบ และสามารถจั่วไพ่ใบที่ 3 ได้ตามกติกาที่กำหนด ฝ่ายไหนมีแต้มใกล้เคียง 9 มากที่สุดจะเป็นฝ่ายชนะ!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/50 p-4 border border-zinc-800 rounded-xl text-center">
                <div className="text-red-500 text-2xl font-black mb-1">A</div>
                <div className="text-zinc-400 text-sm">นับเป็น 1 แต้ม</div>
              </div>
              <div className="bg-black/50 p-4 border border-zinc-800 rounded-xl text-center">
                <div className="text-red-500 text-2xl font-black mb-1">2-9</div>
                <div className="text-zinc-400 text-sm">นับแต้มตามหน้าไพ่</div>
              </div>
              <div className="bg-black/50 p-4 border border-zinc-800 rounded-xl text-center">
                <div className="text-red-500 text-xl font-black mb-1 mt-1">10, J, Q, K</div>
                <div className="text-zinc-400 text-sm">นับเป็น 0 แต้ม</div>
              </div>
              <div className="bg-black/50 p-4 border border-zinc-800 rounded-xl text-center flex flex-col justify-center">
                <div className="text-red-500 text-lg font-black mb-1">ชนะทันที (ป๊อก)</div>
                <div className="text-zinc-400 text-sm">ได้แต้ม 8 หรือ 9</div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-zinc-800/50">
              <h4 className="text-xl font-bold text-white mb-6">กฎการจั่วไพ่ใบที่ 3 (Third Card Rule)</h4>
              <div className="flex gap-6 mb-8 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth custom-scrollbar">
                <div className="min-w-[85%] md:min-w-[calc(50%-12px)] shrink-0 snap-center bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                  <div className="text-blue-400 font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    ฝั่งผู้เล่น (Player)
                  </div>
                  <ul className="text-zinc-300 space-y-3">
                    <li><span className="text-red-500 mr-2">•</span>แต้ม 0-5 : <strong className="text-white">ต้องจั่วไพ่</strong> ใบที่ 3 เพิ่ม</li>
                    <li><span className="text-red-500 mr-2">•</span>แต้ม 6-7 : <strong className="text-white">อยู่ (Stand)</strong> ไม่ต้องจั่วไพ่เพิ่ม</li>
                    <li><span className="text-red-500 mr-2">•</span>แต้ม 8-9 : <strong className="text-white">ป๊อก (Natural)</strong> ชนะหรือเสมอทันที</li>
                  </ul>
                </div>
                <div className="min-w-[85%] md:min-w-[calc(50%-12px)] shrink-0 snap-center bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                  <div className="text-red-400 font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    ฝั่งเจ้ามือ (Banker)
                  </div>
                  <ul className="text-zinc-300 space-y-3">
                    <li><span className="text-red-500 mr-2">•</span>แต้ม 0-2 : <strong className="text-white">ต้องจั่วไพ่</strong> เสมอ</li>
                    <li><span className="text-red-500 mr-2">•</span>แต้ม 3-6 : การจั่วไพ่จะ <strong className="text-white">ขึ้นอยู่กับไพ่ใบที่ 3 ของ Player</strong></li>
                    <li><span className="text-red-500 mr-2">•</span>แต้ม 7 : <strong className="text-white">อยู่ (Stand)</strong> ไม่ต้องจั่ว</li>
                    <li><span className="text-red-500 mr-2">•</span>แต้ม 8-9 : <strong className="text-white">ป๊อก (Natural)</strong> ชนะหรือเสมอ</li>
                  </ul>
                </div>
              </div>

              <h4 className="text-xl font-bold text-white mb-6">รูปแบบการเดิมพันและอัตราจ่ายเงิน</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-zinc-300 border-collapse">
                  <thead className="bg-zinc-900 text-white uppercase font-bold border-b-2 border-red-900">
                    <tr>
                      <th className="px-6 py-4">รูปแบบการเดิมพัน</th>
                      <th className="px-6 py-4 hidden sm:table-cell">เงื่อนไขการชนะ</th>
                      <th className="px-6 py-4">อัตราจ่าย</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    <tr className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 text-blue-400 font-bold">Player (ผู้เล่น)</td>
                      <td className="px-6 py-4 hidden sm:table-cell">ผู้เล่นมีแต้มสูงกว่า</td>
                      <td className="px-6 py-4 text-white font-bold text-lg">1 : 1</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 text-red-400 font-bold">Banker (เจ้ามือ)</td>
                      <td className="px-6 py-4 hidden sm:table-cell">เจ้ามือมีแต้มสูงกว่า</td>
                      <td className="px-6 py-4 text-white font-bold text-lg">1 : 0.95 <span className="block text-xs text-zinc-500 font-normal">หักต๋ง 5%</span></td>
                    </tr>
                    <tr className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 text-green-400 font-bold">Tie (เสมอ)</td>
                      <td className="px-6 py-4 hidden sm:table-cell">แต้มออกมาเท่ากัน</td>
                      <td className="px-6 py-4 text-white font-bold text-lg">1 : 8</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 text-purple-400 font-bold">Player/Banker Pair</td>
                      <td className="px-6 py-4 hidden sm:table-cell">ไพ่ 2 ใบแรกออกคู่</td>
                      <td className="px-6 py-4 text-white font-bold text-lg">1 : 11</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-950/40 to-zinc-900 border border-red-900/30 p-8 rounded-3xl mt-12 text-center shadow-lg">
            <h3 className="text-2xl md:text-3xl font-black mb-4 text-white">สมัครบาคาร่ากับ Bocker168 วันนี้</h3>
            <p className="mb-8 max-w-2xl mx-auto">
              สัมผัสประสบการณ์บาคาร่าที่ดีที่สุดบนมือถือ ภาพลื่นไหล ไม่มีกระตุก พร้อมทีมงานแอดมินดูแลท่านระดับ VIP ตลอด 24 ชั่วโมง
            </p>
            <a href="https://inlnk.co/registerbocker168" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full transition-colors w-full md:w-auto">
              สมัครสมาชิกฟรี คลิกเลย!
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ResponsibleGambling = () => {
  return (
    <div className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">ความรับผิดชอบต่อสังคม (Responsible Gambling)</h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Bocker168 ให้ความสำคัญอย่างยิ่งกับการเล่นพนันอย่างมีความรับผิดชอบ เรามุ่งมั่นสร้างสภาพแวดล้อมที่ปลอดภัย และสนับสนุนให้ทุกคนเล่นเพื่อความบันเทิงเท่านั้น
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Commitment Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Star className="w-6 h-6 text-amber-500" /> 
              ความมุ่งมั่นของเรา
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>เราตระหนักดีว่า แม้การพนันออนไลน์จะเป็นกิจกรรมที่สนุกสนานสำหรับผู้คนส่วนใหญ่ แต่สำหรับบางคน อาจนำไปสู่ปัญหาและผลกระทบเชิงลบได้ เราจึงมีมาตรการต่างๆ เพื่อป้องกันปัญหาเหล่านี้แต่เนิ่นๆ</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-zinc-300">
                <li>ไม่อนุญาตให้ผู้ที่มีอายุต่ำกว่า 18 ปี เข้าใช้บริการอย่างเด็ดขาด</li>
                <li>มีระบบช่วยจำกัดวงเงินฝาก-ถอน และจำกัดเวลาเข้าใช้งาน หากสมาชิกร้องขอ</li>
                <li>ให้ข้อมูลและเครื่องมือในการประเมินตนเองอย่างสม่ำเสมอ</li>
              </ul>
            </div>
          </motion.section>

          {/* Tips Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors" />
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-red-500" /> 
              คำแนะนำสำหรับการเล่นอย่างปลอดภัย
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {[
                "มองการพนันเป็นเพียง 'ความบันเทิง' รูปแบบหนึ่ง ไม่ใช่วิธีหาเงิน",
                "อย่าเล่นเพื่อถอนทุนคืน",
                "กำหนดงบประมาณที่ยอมเสียได้ก่อนเล่นเสมอ",
                "จำกัดเวลาในการเล่น และอย่าให้กระทบเวลาพักผ่อน",
                "อย่าเล่นพนันเมื่อคุณรู้สึกเศร้า เครียด หรืออยู่ภายใต้ฤทธิ์แอลกอฮอล์",
                "รักษาสมดุลของชีวิตด้วยกิจกรรมอื่นๆ ควบคู่ไปด้วย"
              ].map((tip, idx) => (
                <div key={idx} className="flex gap-3 items-start bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                  <Check className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-zinc-300 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Resources Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-500" /> 
              ต้องการความช่วยเหลือ?
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              หากคุณรู้สึกว่าการพนันเริ่มส่งผลกระทบต่อชีวิตคุณหรือคนรอบข้าง โปรดอย่าลังเลที่จะขอความช่วยเหลือ มีหน่วยงานและเครื่องมือมากมายที่พร้อมช่วยเหลือ:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col gap-2">
                <h3 className="text-white font-bold">1. ประเมินตนเองเบื้องต้น</h3>
                <p className="text-sm text-zinc-500">ตอบแบบสอบถามพฤติกรรมการเล่นเพื่อตรวจสอบความเสี่ยง</p>
                <button className="text-left mt-2 text-red-500 hover:text-red-400 font-medium text-sm transition-colors uppercase tracking-widest flex items-center gap-1">เริ่มประเมิน <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col gap-2">
                <h3 className="text-white font-bold">2. ติดต่อทีมงาน Bocker168</h3>
                <p className="text-sm text-zinc-500">ขอยูสเซอร์พักชั่วคราว หรือจำกัดการฝากเงิน (Self-Exclusion)</p>
                <Link to="/contact" className="text-left mt-2 text-amber-500 hover:text-amber-400 font-medium text-sm transition-colors uppercase tracking-widest flex items-center gap-1">ติดต่อเจ้าหน้าที่ <ChevronRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Bocker168Landing />
    </Router>
  );
}

function Bocker168Landing() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [selectedPromo, setSelectedPromo] = useState<null | typeof PROMOTIONS[0]>(null);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Check cookie consent
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setShowCookieBanner(true), 2000);
    } else {
      try {
        const parsedConsent = JSON.parse(consent);
        setCookieSettings(parsedConsent);
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            'analytics_storage': parsedConsent.analytics ? 'granted' : 'denied',
            'ad_storage': parsedConsent.marketing ? 'granted' : 'denied'
          });
        }
      } catch (e) {
        console.error('Failed to parse cookie consent', e);
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 15));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleAcceptAllCookies = () => {
    const newSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(newSettings));
    setCookieSettings(newSettings);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
    }
    setShowCookieBanner(false);
  };

  const handleRejectAllCookies = () => {
    const newSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(newSettings));
    setCookieSettings(newSettings);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
    }
    setShowCookieBanner(false);
  };

  const handleSaveCookieSettings = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...cookieSettings,
      timestamp: new Date().toISOString()
    }));
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': cookieSettings.analytics ? 'granted' : 'denied',
        'ad_storage': cookieSettings.marketing ? 'granted' : 'denied'
      });
    }
    setShowCookieSettings(false);
    setShowCookieBanner(false);
  };

  const [articles, setArticles] = useState<Article[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dynamicCategoryMap, setDynamicCategoryMap] = useState<Record<string, string>>(CATEGORY_MAP);
  const [dynamicReverseCategoryMap, setDynamicReverseCategoryMap] = useState<Record<string, string>>(REVERSE_CATEGORY_MAP);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [showArticleQR, setShowArticleQR] = useState(false);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`/api/articles?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setArticles(data);
          setArticleError(null);
        }
      } else {
        setArticleError('Unable to load articles at this time.');
      }
    } catch (error) {
      setArticleError('Connection error while fetching articles.');
    }
  };

  const fetchPages = async () => {
    try {
      setIsLoadingPages(true);
      const response = await fetch(`/api/pages?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json() as any;
        setCategories(data);
        if (data && (data as any).length > 0) {
          const map: Record<string, string> = {};
          const revMap: Record<string, string> = {};
          (data as any).forEach((cat: any) => {
            map[cat.name] = cat.slug;
            revMap[cat.slug] = cat.name;
          });
          setDynamicCategoryMap(map);
          setDynamicReverseCategoryMap(revMap);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    setIsLoadingArticles(true);
    fetchArticles().finally(() => setIsLoadingArticles(false));
    fetchPages();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Re-fetch when admin dashboard is closed to ensure latest data
    if (!showAdmin) {
      fetchArticles();
      fetchPages();
      fetchCategories();
    }
  }, [showAdmin]);

  // --- Routes ---
  // ... existing code ...

  const isHome = location.pathname === '/';
  const isFeatures = location.pathname === '/features';
  const isBaccarat = location.pathname === '/baccarat';
  const isPromotions = location.pathname === '/promotions';
  const isArticles = location.pathname.replace(/\/$/, '') === '/articles';
  const isFaq = location.pathname.replace(/\/$/, '') === '/faq';
  const isContact = location.pathname.replace(/\/$/, '') === '/contact';
  
  // New status checks
  const categoryMatch = location.pathname.match(/^\/category\/([^/]+)$/);
  const isCategoryPage = !!categoryMatch;
  const urlCategorySlug = categoryMatch ? categoryMatch[1] : null;

  // Slug Match (Flat routing /{slug})
  const slugMatch = location.pathname.match(/^\/([^/]+)$/);
  const potentialSlug = slugMatch ? decodeURIComponent(slugMatch[1]) : null;

  // Reserved routes (static pages that should not be matched as dynamic post slugs)
  const reservedRoutes = [
    'articles', 'faq', 'contact', 'baccarat', 'features', 'promotions', 
    'category', 'author', 'admin', 'dashboard', 'api'
  ];
  
  const isPotentialFlatRoute = potentialSlug && !reservedRoutes.includes(potentialSlug);

  // Distinguish Article vs Page vs Other
  const currentPage = potentialSlug ? pages.find(p => (p.slug || p.id) === potentialSlug) : null;
  const currentPost = potentialSlug && !currentPage ? articles.find(a => (a.slug || a.id) === potentialSlug) : null;

  const isPageDetail = !!currentPage;
  const isPostDetail = !!currentPost; 
  
  const isRegisterGuide = location.pathname.replace(/\/$/, '') === '/register-guide' && !currentPage;
  const isDepositWithdrawGuide = location.pathname.replace(/\/$/, '') === '/deposit-withdraw-guide' && !currentPage;
  const isTerms = location.pathname.replace(/\/$/, '') === '/terms' && !currentPage;
  const isPrivacy = location.pathname.replace(/\/$/, '') === '/privacy' && !currentPage;
  const isCookies = location.pathname.replace(/\/$/, '') === '/cookies' && !currentPage;
  const isResponsibleGambling = location.pathname.replace(/\/$/, '') === '/responsible-gambling' && !currentPage;

  const authorMatch = location.pathname.match(/^\/author\/([^/]+)$/);
  const isAuthorPage = !!authorMatch;
  const currentAuthorSlug = isAuthorPage ? decodeURIComponent(authorMatch[1]) : null;

  const currentCategory = urlCategorySlug ? (dynamicReverseCategoryMap[urlCategorySlug] || decodeURIComponent(urlCategorySlug)) : null;

  const getPageTitle = () => {
    let pathAlias = potentialSlug || location.pathname.substring(1);
    if (!pathAlias) pathAlias = 'baccarats';

    const dbPageSearch = pages.find(p => p.slug === pathAlias || p.id === pathAlias);
    if (dbPageSearch && dbPageSearch.metaTitle) {
      return dbPageSearch.metaTitle;
    }

    if (isHome) return 'บาคาร่า Bocker168 - เว็บบาคาร่าออนไลน์ อันดับ 1 เว็บตรง ฝากถอนไม่มีขั้นต่ำ';
    if (isFeatures) return 'จุดเด่นของเรา - Bocker168 บาคาร่าเว็บตรง';
    if (isBaccarat) return 'บาคาร่าออนไลน์ คาสิโนสด - Bocker168';
    if (isPromotions) return 'โปรโมชั่นบาคาร่า - Bocker168';
    if (isArticles) return 'บทความและเทคนิคบาคาร่า - Bocker168';
    if (isFaq) return 'คำถามที่พบบ่อย - Bocker168';
    if (isContact) return 'ติดต่อเรา - Bocker168';
    if (isRegisterGuide) return 'วิธีสมัครสมาชิก - Bocker168';
    if (isDepositWithdrawGuide) return 'วิธีฝาก-ถอนเงิน - Bocker168';
    if (isTerms) return 'ข้อตกลงและเงื่อนไข - Bocker168';
    if (isPrivacy) return 'นโยบายความเป็นส่วนตัว - Bocker168';
    if (isCookies) return 'นโยบายคุกกี้ - Bocker168';
    if (isResponsibleGambling) return 'ความรับผิดชอบต่อสังคม - Bocker168';
    if (isCategoryPage && currentCategory) {
      if (urlCategorySlug === 'baccarat') return 'หมวดหมู่บาคาร่า | รวมบทความบาคาร่าออนไลน์ Bocker168';
      if (urlCategorySlug === 'baccarat-strategy') return 'หมวดหมู่สูตรบาคาร่า | รวมเทคนิคและกลยุทธ์บาคาร่า';
      if (urlCategorySlug === 'beginner-guide') return 'วิธีเล่นบาคาร่าเบื้องต้น | คู่มือสำหรับมือใหม่';
      return `หมวดหมู่${currentCategory} | รวมบทความเกี่ยวกับ${currentCategory} - Bocker168`;
    }
    if (isPostDetail && currentPost) {
      if (currentPost.metaTitle) {
        // Anti-duplicate logic: if more than 2 posts share this EXACT metaTitle, it's likely a generic fallback that was saved
        const countWithSameMeta = articles.filter(a => a.metaTitle === currentPost.metaTitle).length;
        if (countWithSameMeta > 2) {
          return `${currentPost.title} | Bocker168`;
        }
        return currentPost.metaTitle;
      }
      return `${currentPost.title} | Bocker168`;
    }
    if (isPageDetail && currentPage) {
      return currentPage.metaTitle || `${currentPage.title} | Bocker168`;
    }
    return 'Bocker168 - เว็บบาคาร่าออนไลน์ อันดับ 1';
  };

  const getPageDescription = () => {
    let pathAlias = potentialSlug || location.pathname.substring(1);
    if (!pathAlias) pathAlias = 'baccarats';

    const dbPageSearch = pages.find(p => p.slug === pathAlias || p.id === pathAlias);
    if (dbPageSearch && dbPageSearch.metaDescription) {
      return dbPageSearch.metaDescription;
    }

    if (isHome) return 'Bocker168 เว็บบาคาร่าออนไลน์ อันดับ 1 เว็บตรงไม่ผ่านเอเย่นต์ มั่นคง ปลอดภัย 100% เล่นบาคาร่าคาสิโนสด ฝากถอนไม่มีขั้นต่ำ รองรับทุกระบบมือถือ';
    if (isBaccarat) return 'เล่นบาคาร่าออนไลน์ที่ Bocker168 คาสิโนสดส่งตรงจากค่ายดัง สัมผัสประสบการณ์บาคาร่าเว็บตรงของแท้ ได้เงินจริง พร้อมระบบฝากถอนออโต้รวดเร็ว';
    if (isPromotions) return 'รวมโปรโมชั่นบาคาร่าสุดคุ้มจาก Bocker168 เว็บตรง แจกโบนัสเครดิตฟรีและสิทธิพิเศษสำหรับสมาชิกใหม่และปัจจุบัน เพิ่มโอกาสทำกำไรคาสิโนออนไลน์';
    if (isArticles) return 'อ่านบทความและเทคนิคการเล่นบาคาร่าให้ได้เงินทุกวัน อัปเดตสูตรบาคาร่า เคล็ดลับคาสิโนออนไลน์จากผู้เชี่ยวชาญ Bocker168 เว็บตรงอันดับ 1';
    if (isFaq) return 'คำถามที่พบบ่อยเกี่ยวกับการเล่นบาคาร่าออนไลน์และคาสิโนเว็บตรง Bocker168 ข้อสงสัยเรื่องการฝากถอน สมัครสมาชิก หรือปัญหาการเดิมพัน';
    if (isContact) return 'ติดต่อ Bocker168 เว็บบาคาร่าออนไลน์ ทีมงานแอดมินมืออาชีพพร้อมให้บริการและดูแลคุณตลอด 24 ชั่วโมง ผ่านช่องทาง Line และอื่นๆ';
    if (isCategoryPage && currentCategory) {
      if (urlCategorySlug === 'baccarat') return 'รวมบทความบาคาร่า เทคนิคการเล่น วิธีเริ่มต้น และคำแนะนำสำหรับผู้เล่นที่ต้องการศึกษาเกมบาคาร่าออนไลน์กับ Bocker168';
      if (urlCategorySlug === 'baccarat-strategy') return 'รวมบทความสูตรบาคาร่า วิธีอ่านเค้าไพ่ เทคนิคการวางเดิมพัน และแนวทางเล่นอย่างมีระบบ';
      if (urlCategorySlug === 'beginner-guide') return 'รวมบทความแนะนำวิธีเล่นบาคาร่าเบื้องต้น กติกา คำศัพท์ และแนวทางเริ่มต้นสำหรับผู้เล่นใหม่';
      // Added other requested slugs here
      if (urlCategorySlug === 'casino-news') return 'อัปเดตข่าวสารวงการคาสิโน เกมใหม่ โปรโมชั่นเด็ด และกิจกรรมพิเศษที่ Bocker168 ก่อนใคร';
      if (urlCategorySlug === 'money-management') return 'เทคนิคการเดินเงิน บริหารเงินทุนในการเล่นคาสิโนออนไลน์ให้ได้กำไรอย่างยั่งยืน เพิ่มโอกาสชนะ ลดความเสี่ยง';
      if (urlCategorySlug === 'expert-tips') return 'รวมเคล็ดลับคาสิโนระดับเซียน เทคนิคการเล่นขั้นสูง และกลยุทธ์ลับที่นักพนันมืออาชีพใช้ทำกำไร';
      return `รวบรวมเทคนิค วิธีการ และข่าวสารน่าสนใจในหมวดหมู่${currentCategory} ส่งตรงจากผู้เชี่ยวชาญ Bocker168`;
    }
    if (isPostDetail && currentPost) {
      if (currentPost.metaDescription) {
        return currentPost.metaDescription;
      }
      
      const contentExcerpt = getArticleExcerpt(currentPost.excerpt || (currentPost as any).description || currentPost.content || '');
      if (contentExcerpt) {
        return `${currentPost.title} - Bocker168 สรุปเนื้อหาเบื้องต้น: ${contentExcerpt} ... อ่านเคล็ดลับและเทคนิคบาคาร่าเพิ่มเติมได้ที่เว็บตรงของเราเลย!`;
      }
      
      return `บทความ ${currentPost.title} - ศูนย์รวมเทคนิคบาคาร่าและคาสิโนออนไลน์ที่อัพเดทใหม่ล่าสุด ส่งตรงจากทีมงาน Bocker168 เว็บบาคาร่าอันดับ 1 มั่นคง ปลอดภัย ฝากถอนไว`;
    }
    if (isPageDetail && currentPage) {
      return currentPage.metaDescription || currentPage.excerpt || `${currentPage.title} - Bocker168 บาคาร่าออนไลน์ เว็บตรงไม่ผ่านเอเย่นต์ อันดับ 1`;
    }
    return 'เล่นบาคาร่ากับ Bocker168 เว็บตรงอันดับ 1 มั่นคง ปลอดภัย ได้เงินจริง สัมผัสประสบการณ์คาสิโนสดระดับพรีเมียม รองรับทุกระบบมือถือ';
  };

  const getPageKeywords = () => {
    if (isPostDetail && currentPost && currentPost.metaKeywords) return currentPost.metaKeywords;
    return 'บาคาร่า, บาคาร่าออนไลน์, บาคาร่าเว็บตรง, สมัครบาคาร่า, คาสิโนสด, bocker168';
  };

  const getRobotsTag = () => {
    if (location.pathname === '/admin' || location.pathname.startsWith('/dashboard')) {
      return "noindex, nofollow";
    }
    return "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
  };

  const getCanonicalUrl = () => {
    let path = location.pathname.replace(/\/$/, '');
    if (path === '') path = '/';
    
    // Deduplicate / alias paths
    if (path === '/baccarat-what-is-it') {
      return 'https://hongkonglex.com/what-is-baccarat';
    }

    if (isPostDetail && currentPost) {
       const properSlug = currentPost.slug || currentPost.title.replace(/\s+/g, '-').toLowerCase();
       return `https://hongkonglex.com/${properSlug}`;
    }
    
    if (isCategoryPage && urlCategorySlug) {
       return `https://hongkonglex.com/category/${urlCategorySlug}`;
    }
    
    if (isPageDetail && currentPage) {
       const properSlug = currentPage.slug || currentPage.title.replace(/\s+/g, '-').toLowerCase();
       return `https://hongkonglex.com/${properSlug}`;
    }

    return `https://hongkonglex.com${path}`;
  };

  const processHeadingLogic = (content: string, returnType: 'toc' | 'html') => {
    if (!content) return returnType === 'toc' ? [] : '';
    let mainCounter = 0;
    let h3Counter = 0;
    let h4Counter = 0;
    let index = 0;
    const toc: any[] = [];
    
    const html = content.replace(/<h([1-6])([^>]*)>(.*?)<\/h\1>/gis, (match, levelStr, attrs, textRaw) => {
      const level = parseInt(levelStr);
      let rawText = textRaw.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
      let cleanText = rawText.replace(/^(?:\d+\.)+\s*|^(?:\d+)\s+/, '').trim();
      
      let numStr = '';
      if (level === 1 || level === 2) {
        mainCounter++;
        h3Counter = 0;
        h4Counter = 0;
        numStr = `${mainCounter}.`;
      } else if (level === 3) {
        if (mainCounter === 0) mainCounter = 1;
        h3Counter++;
        h4Counter = 0;
        numStr = `${mainCounter}.${h3Counter}`;
      } else if (level >= 4) {
        if (mainCounter === 0) mainCounter = 1;
        if (h3Counter === 0) h3Counter = 1;
        h4Counter++;
        numStr = `${mainCounter}.${h3Counter}.${h4Counter}`;
      }
      
      const slug = cleanText.toLowerCase().replace(/[^a-zA-Z0-9ก-๙]+/g, '-').replace(/(^-|-$)/g, '');
      const id = slug ? `heading-${index++}-${slug}` : `heading-${index++}`;
      
      const finalTitle = `${numStr} ${cleanText}`;
      toc.push({ id, text: finalTitle, level });
      
      let articleTitleHtml = textRaw.replace(/^(\s*(?:<[^>]+>\s*)*)(?:(?:\d+\.)+\s*|\d+\s+)/i, '$1');
      let cleanAttrs = attrs.replace(/\s*id=["'][^"']*["']/i, '');
      return `<h${levelStr} id="${id}"${cleanAttrs}>${articleTitleHtml}</h${levelStr}>`;
    });
    
    return returnType === 'toc' ? toc : html;
  };

  const getTableOfContents = (content: string) => processHeadingLogic(content, 'toc') as any[];
  const addIdsToHeadings = (content: string) => processHeadingLogic(content, 'html') as string;

  const lazyLoadImages = (content: string, articleTitle: string = '') => {
    if (!content) return '';
    return content.replace(/<img([^>]*)>/gis, (match, attrs) => {
      let newAttrs = attrs;
      if (!newAttrs.includes('alt=')) {
        let altText = `รูปภาพประกอบบทความ: ${articleTitle || 'คาสิโนออนไลน์ Bocker168'}`;
        const srcMatch = attrs.match(/src=["'](.*?)["']/);
        if (srcMatch && srcMatch[1]) {
          const pathSegments = srcMatch[1].split('/');
          const filenameWithExt = pathSegments[pathSegments.length - 1];
          const filename = filenameWithExt.split('.')[0] || '';
          if (filename && filename.length > 2) {
            const cleanFilename = filename.replace(/[-_]/g, ' ');
            altText = `${cleanFilename} - ${articleTitle || 'Bocker168'}`;
          }
        }
        newAttrs += ` alt="${altText}"`;
      }
      if (!newAttrs.includes('loading=')) {
        newAttrs += ' loading="lazy"';
      }
      return `<img${newAttrs}>`;
    });
  };

  const splitArticleContent = (content: string) => {
    if (!content) return ['', ''];
    
    let textLength = 0;
    const minThreshold = 400; // Aim for about 400 characters in the preview
    
    // Find block-level elements using matchAll
    const matches = Array.from(content.matchAll(/(<p[^>]*>.*?<\/p>|<h[2-6][^>]*>.*?<\/h[2-6]>|<ul[^>]*>.*?<\/ul>|<ol[^>]*>.*?<\/ol>|<blockquote[^>]*>.*?<\/blockquote>)/gis));
    
    let splitIndex = -1;
    let fallbackIndex = -1;
    let pCount = 0;
    
    for (const m of matches) {
      const outerHtml = m[0];
      const innerText = outerHtml.replace(/<[^>]*>/g, '').trim();
      textLength += innerText.length;
      
      if (outerHtml.toLowerCase().startsWith('<p')) {
        pCount++;
        // Fallback: at least one paragraph
        if (fallbackIndex === -1 && innerText.length > 50 && !outerHtml.toLowerCase().includes('<img')) {
          fallbackIndex = m.index! + outerHtml.length;
        }
      }
      
      // If we crossed the threshold and we are currently on a paragraph
      // (We don't want to split immediately after a heading to avoid dangling headings)
      if (textLength >= minThreshold && outerHtml.toLowerCase().startsWith('<p') && !outerHtml.toLowerCase().includes('<img')) {
        splitIndex = m.index! + outerHtml.length;
        break;
      }
    }
    
    // Choose the best split point
    const finalSplitIndex = splitIndex !== -1 ? splitIndex : fallbackIndex;
    
    if (finalSplitIndex !== -1 && finalSplitIndex < content.length) {
      return [content.slice(0, finalSplitIndex), content.slice(finalSplitIndex)];
    }
    
    return [content, ''];
  };

  if (showAdmin) {
    return <AdminDashboard onClose={() => setShowAdmin(false)} onSaveSuccess={fetchArticles} />;
  }

  const renderArticlesSection = () => (
      <section id="articles" className="py-24 relative bg-[#050505]">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="บทความและเทคนิคบาคาร่า"
            subtitle="อัปเดตความรู้ เทคนิค และสูตรบาคาร่าใหม่ๆ เพื่อเพิ่มโอกาสชนะของคุณ"
            centered={true}
          />

          {isLoadingArticles ? (
            <div className="flex flex-col items-center justify-center py-24 mt-16">
              <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-4" />
              <p className="text-zinc-400 animate-pulse">กำลังโหลดบทความ...</p>
            </div>
          ) : articleError ? (
            <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl mt-16">
              <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ขออภัย เกิดข้อผิดพลาด</h3>
              <p className="text-zinc-400">{articleError}</p>
              <button 
                onClick={() => {
                  setIsLoadingArticles(true);
                  fetchArticles().finally(() => setIsLoadingArticles(false));
                }}
                className="mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-full transition-colors"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl mt-16">
              <BookOpen className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">ยังไม่มีบทความในขณะนี้</h3>
              <p className="text-zinc-400">บทความใหม่ๆ จะถูกอัปเดตและแสดงผลที่นี่เร็วๆ นี้</p>
            </div>
          ) : (isHome || isBaccarat) ? (
            <div className="mt-16 relative">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 }
                }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                className="py-10"
              >
                {articles.filter(a => a.status !== 'draft').slice(0, 12).map((article, index) => (
                  <SwiperSlide key={article.id || index} className="h-auto">
                    <ArticleCard article={article} index={index} dynamicCategoryMap={dynamicCategoryMap} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
           <div className="space-y-16 mt-16">
             {Array.from(new Set(articles.filter(a => a.status !== 'draft').map(a => a.category))).map(category => (
               <div key={category}>
                 <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">
                   {category}
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {articles
                     .filter(a => a.status !== 'draft' && a.category === category)
                     .map((article, index) => <ArticleCard key={article.id || index} article={article} index={index} dynamicCategoryMap={dynamicCategoryMap} />)}
                 </div>
               </div>
             ))}
           </div>
          )}
          
          <div className="mt-16 text-center">
            <Link to="/articles" className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600/50 text-white font-bold rounded-2xl transition-all flex items-center gap-3 mx-auto group w-fit">
              <BookOpen className="w-5 h-5 text-red-500" />
              ดูบทความทั้งหมด
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
  );

  const renderCategoriesSection = (isHomeTitle: boolean) => (
      <section id="categories" className="py-24 bg-zinc-950 relative">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="รวมค่ายบาคาร่าออนไลน์ชั้นนำระดับโลก"
            subtitle="เลือกเล่นคาสิโนสดจากค่ายดัง ภาพคมชัดระดับ Full HD ส่งตรงจากคาสิโนจริง"
            as={isHomeTitle ? 'h2' : 'h1'}
          />

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation
            className="pb-16"
          >
            {CATEGORIES.map((cat, i) => (
              <SwiperSlide key={i} className="h-auto">
                <Link to="/baccarat" className="block h-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative overflow-hidden rounded-3xl group cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors flex flex-col h-full"
                  >
                    <div className="relative h-64 overflow-hidden pt-6 px-4 flex items-end justify-center">
                      <div className={`absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent z-10`} />
                      <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-20 group-hover:opacity-40 transition-opacity z-10`} />
                      <img 
                        src={cat.image || null} 
                        alt={cat.title} 
                        className="w-full h-full object-contain object-bottom group-hover:scale-110 transition-transform duration-500 relative z-0"
                        referrerPolicy="no-referrer"
                      />
                      <img 
                        src={cat.logo || null} 
                        alt={`${cat.title} logo`} 
                        className="absolute top-4 left-4 w-12 h-12 z-20 rounded-full border border-zinc-700 bg-zinc-900 p-1"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="relative p-8 pt-0 flex-1 flex flex-col justify-between z-20">
                      <div>
                        <h3 className="text-2xl font-black text-white mb-4 group-hover:text-amber-500 transition-colors">{cat.title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                          {cat.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-red-500 font-bold text-sm group-hover:translate-x-2 transition-transform">
                        ดูรายละเอียด <Zap className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content={getPageKeywords()} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:type" content={isPostDetail ? "article" : "website"} />
        <meta property="og:url" content={`https://hongkonglex.com${location.pathname}`} />
        <meta property="og:image" content={isPostDetail && currentPost?.image ? currentPost.image : "https://img2.pic.in.th/A2-Logo-Bocker-168.png"} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getPageDescription()} />
        <meta name="twitter:image" content={isPostDetail && currentPost?.image ? currentPost.image : "https://img2.pic.in.th/A2-Logo-Bocker-168.png"} />
        
        <meta name="robots" content={getRobotsTag()} />
        <link rel="canonical" href={getCanonicalUrl()} />
        
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://hongkonglex.com/#website",
              "url": "https://hongkonglex.com/",
              "name": "Bocker168",
              "alternateName": "บาคาร่าออนไลน์ Bocker168",
              "description": "เว็บไซต์บาคาร่าออนไลน์อันดับ 1 เว็บตรงไม่ผ่านเอเย่นต์ ปลอดภัย 100% ฝากถอนออโต้ ไม่มีขั้นต่ำ",
              "inLanguage": "th-TH"
            },
            ...(isHome ? [
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://hongkonglex.com/#organization",
                "name": "Bocker168",
                "url": "https://hongkonglex.com/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://img2.pic.in.th/A2-Logo-Bocker-168.png"
                },
                "sameAs": [
                  "https://www.facebook.com/bocker168",
                  "https://line.me/R/ti/p/@bocker168"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "OnlineCasino",
                "name": "Bocker168",
                "url": "https://hongkonglex.com",
                "logo": "https://img2.pic.in.th/A2-Logo-Bocker-168.png",
                "description": "เล่นบาคาร่ากับเว็บตรงอันดับ 1 มั่นคง ปลอดภัย ได้เงินจริง สัมผัสประสบการณ์คาสิโนสดระดับพรีเมียม รองรับทุกระบบมือถือ พร้อมโปรโมชั่นสมาชิกใหม่จัดเต็ม",
                "currenciesAccepted": "THB",
                "paymentAccepted": "Bank Transfer, TrueMoney Wallet",
                "openingHours": "Mo-Su 00:00-24:00",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "TH"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "CasinoGame",
                "name": "บาคาร่าออนไลน์",
                "description": "เกมบาคาร่าสดจากค่ายดัง SA Gaming, Sexy Baccarat, Dream Gaming พร้อมสูตรและเทคนิคการอ่านเค้าไพ่",
                "gameCategory": "Card Game",
                "publisher": {
                  "@type": "Organization",
                  "name": "Bocker168"
                }
              }
            ] : []),
            ...((isFaq || isHome) ? [{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": FAQS.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            }] : [])
          ])}
        </script>

        {isPostDetail && currentPost && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": currentPost.metaTitle || currentPost.title,
              "description": currentPost.metaDescription || currentPost.excerpt || (currentPost as any).description,
              "abstract": currentPost.excerpt || currentPost.metaDescription,
              "articleBody": currentPost.content?.replace(/<[^>]*>?/gm, ''),
              "articleSection": currentPost.category,
              "image": currentPost.image || "https://img2.pic.in.th/A2-Logo-Bocker-168.png",
              "author": {
                "@type": "Person",
                "name": currentPost.author || "Admin Bocker168",
                "url": "https://hongkonglex.com"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Bocker168",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://img2.pic.in.th/A2-Logo-Bocker-168.png"
                }
              },
              "datePublished": currentPost.date || currentPost.createdAt || new Date().toISOString(),
              "dateModified": currentPost.updatedAt || currentPost.date || currentPost.createdAt || new Date().toISOString(),
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://hongkonglex.com/${currentPost.slug}`
              },
              "keywords": currentPost.metaKeywords || "บาคาร่า, สูตรบาคาร่า"
            })}
          </script>
        )}
      </Helmet>
      
      {/* Red Glow Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[120px] rounded-full" />
      </div>

      {/* --- Header --- */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/95 backdrop-blur-md py-2 border-b border-zinc-800' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 mb-2 lg:mb-0">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img 
                src="https://img2.pic.in.th/A2-Logo-Bocker-168.png" 
                alt="Bocker168 Logo" 
                className="h-12 md:h-16 lg:h-20 w-auto group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </Link>

            {/* Desktop Nav (Hidden on Mobile/Tablet, shown in separate row below for them) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {MENU_ITEMS.map((item) => (
                <Link 
                  key={item.label} 
                  to={item.path}
                  className="text-[13px] xl:text-sm font-bold text-zinc-300 hover:text-red-500 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <button 
                onClick={() => setShowAdmin(true)}
                className="px-3 md:px-6 py-2 text-xs md:text-sm font-bold text-white hover:text-red-500 transition-colors"
              >
                เข้าสู่ระบบ
              </button>
              <a 
                href="https://inlnk.co/registerbocker168" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 md:px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs md:text-sm font-bold rounded-full shadow-lg shadow-red-900/40 transition-all active:scale-95 inline-block whitespace-nowrap"
              >
                สมัครสมาชิก
              </a>
            </div>
          </div>

          {/* Mobile/Tablet Nav - Button Grid */}
          <nav className="lg:hidden grid grid-cols-3 gap-1.5 py-2 border-t border-zinc-800/50 mt-2">
            {MENU_ITEMS.map((item) => (
              <Link 
                key={item.label} 
                to={item.path}
                className={`flex items-center justify-center text-center px-1 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-md text-[11px] font-medium transition-all ${
                  location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                    ? 'text-white border-red-600 bg-red-600/10'
                    : 'text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className={!isHome ? "pt-36 md:pt-40 lg:pt-24" : ""}>
      
      {/* --- Page Detail Section --- */}
      {isPageDetail && currentPage && (
        <section className="py-24 relative bg-[#050505] min-h-[70vh]">
          <div className="container mx-auto px-4 pt-20 lg:pt-0">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <h1 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
                  {currentPage.title}
                </h1>
              </div>
              <div 
                className="max-w-none [&>h1]:text-red-500 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:text-red-500 [&>h2]:mt-8 [&>p]:text-zinc-300 [&>p]:mb-6 [&>p]:leading-relaxed [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:text-red-500 [&>h3]:mt-6 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-red-500 [&>h4]:mt-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:text-zinc-300 [&>ul>li]:mb-2 [&>strong]:text-amber-500 [&>b]:text-amber-500 [&>a]:text-green-500 [&>a]:font-bold hover:[&>a]:text-green-400 [&>a]:underline transition-colors [&>p>img]:rounded-2xl [&>p>img]:mb-8 [&>p>img]:w-full"
                dangerouslySetInnerHTML={{ __html: currentPage.content }}
              />
            </div>
          </div>
        </section>
      )}

      {/* --- Article Detail Section --- */}
      {isPostDetail && (
        <section className="py-24 relative bg-[#050505] min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-zinc-400 mb-8 font-medium text-sm flex-wrap">
            <Link to="/" className="hover:text-amber-500 transition-colors">บาคาร่า</Link>
            <span>/</span>
            {currentPost ? (
              <>
                <Link to={`/category/${encodeURIComponent(dynamicCategoryMap[currentPost.category] || currentPost.category)}`} className="hover:text-amber-500 transition-colors">
                  {currentPost.category}
                </Link>
                <span>/</span>
                <span className="text-zinc-500 line-clamp-1">{currentPost.title}</span>
              </>
            ) : (
                <span className="text-zinc-500 line-clamp-1">กำลังโหลด...</span>
            )}
          </div>
          
          {currentPost ? (
                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden">
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-6 flex-wrap">
                      <Link 
                        to={`/category/${encodeURIComponent(dynamicCategoryMap[currentPost.category] || currentPost.category)}`}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors"
                      >
                        {currentPost.category}
                      </Link>
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Calendar className="w-5 h-5" />
                        <span>{currentPost.date}</span>
                      </div>
                      {currentPost.author && (
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          {currentPost.authorImage && currentPost.authorImage.trim() !== '' ? (
                            <img src={currentPost.authorImage} alt={currentPost.author} className="w-6 h-6 rounded-full object-cover border border-zinc-700" referrerPolicy="no-referrer" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                          <span>{currentPost.author}</span>
                        </div>
                      )}
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black text-red-500 mb-8 leading-tight">
                      {currentPost.title}
                    </h1>

                    {/* Meta TOC & Social Sharing */}
                    <div className="flex flex-col lg:flex-row gap-8 mb-10">
                      <div className="flex-1">
                        {(() => {
                          const content = currentPost.content || (currentPost as any).description || '';
                          const toc = getTableOfContents(content);
                          if (toc.length === 0) return null;
                          return (
                            <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6">
                              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <List className="w-5 h-5 text-red-500" />
                                สารบัญบทความ
                              </h3>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                {toc.map((item, i) => {
                                  const indentClass = item.level >= 4 ? 'ml-8 pl-4 border-l-2 border-zinc-800' : item.level === 3 ? 'ml-4 pl-3 border-l text-[13px]' : '';
                                  return (
                                    <li key={i} className={`${indentClass} mb-1`}>
                                      <a 
                                        href={`#${item.id}`} 
                                        className="text-zinc-400 hover:text-red-400 text-sm transition-colors block py-1.5"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                      >
                                        <span className="text-red-500/50 mt-0.5">•</span>
                                        {item.text}
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })()}
                      </div>
                      
                    </div>
                    
                    {(() => {
                      let content = currentPost.content || (currentPost as any).description || '';
                      content = addIdsToHeadings(content);
                      content = lazyLoadImages(content, currentPost.title);
                      const [part1, part2] = splitArticleContent(content);
                      
                      return (
                        <>
                          <div 
                            className="max-w-none [&>h1]:text-red-500 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:text-red-500 [&>h2]:mt-8 [&>p]:text-zinc-300 [&>p]:mb-6 [&>p]:leading-relaxed [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:text-red-500 [&>h3]:mt-6 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-red-500 [&>h4]:mt-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:text-zinc-300 [&>ul>li]:mb-2 [&>strong]:text-amber-500 [&>b]:text-amber-500 [&>a]:text-green-500 [&>a]:font-bold hover:[&>a]:text-green-400 [&>a]:underline transition-colors [&>p>img]:rounded-2xl [&>p>img]:mb-8 [&>p>img]:w-full"
                            dangerouslySetInnerHTML={{ __html: part1 }}
                          />
                          
                          {/* CTR Buttons */}
                          {part1 && (
                            <div className="flex flex-col sm:flex-row gap-2 my-8 relative">
                              <a href="https://line.me/R/ti/p/@so168" target="_blank" className="flex-1 bg-[#00B900] hover:bg-[#009900] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-center text-sm md:text-base">
                                สมัครสมาชิกผ่าน LINE
                              </a>
                              <a href="https://inlnk.co/registerbocker168" target="_blank" className="flex-1 bg-[#E50914] hover:bg-[#B20710] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-center text-sm md:text-base">
                                สมัครสมาชิกระบบ AUTO
                              </a>
                              <button onClick={() => setShowArticleQR(true)} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-center text-sm md:text-base">
                                กดเพื่อสแกน QR
                              </button>

                              {/* Local QR Popover */}
                              <AnimatePresence>
                                {showArticleQR && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    className="absolute bottom-0 left-0 right-0 z-50 bg-white p-6 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-zinc-100"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <button 
                                      onClick={() => setShowArticleQR(false)}
                                      className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 transition-colors"
                                    >
                                      <X size={20} />
                                    </button>
                                    <h3 className="text-lg font-bold text-center text-zinc-900 mb-4">สแกน QR Code</h3>
                                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 mb-4">
                                      <a href="https://line.me/R/ti/p/@so168" target="_blank" className="block">
                                        <img src="https://img1.pic.in.th/images/QR-code-registerbocker168.png" alt="QR Code" className="w-full max-w-[200px] mx-auto h-auto rounded-lg hover:opacity-90 transition-opacity" referrerPolicy="no-referrer" />
                                      </a>
                                    </div>
                                    <p className="text-center text-zinc-500 text-xs font-medium mb-4">สแกนเพื่อสมัครสมาชิกและติดต่อเรา</p>
                                    <button 
                                      onClick={() => setShowArticleQR(false)}
                                      className="w-full py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors text-sm"
                                    >
                                      ปิดหน้าต่าง
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}

                          <div 
                            className="max-w-none [&>h1]:text-red-500 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:text-red-500 [&>h2]:mt-8 [&>p]:text-zinc-300 [&>p]:mb-6 [&>p]:leading-relaxed [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:text-red-500 [&>h3]:mt-6 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-red-500 [&>h4]:mt-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:text-zinc-300 [&>ul>li]:mb-2 [&>strong]:text-amber-500 [&>b]:text-amber-500 [&>a]:text-green-500 [&>a]:font-bold hover:[&>a]:text-green-400 [&>a]:underline transition-colors [&>p>img]:rounded-2xl [&>p>img]:mb-8 [&>p>img]:w-full"
                            dangerouslySetInnerHTML={{ __html: part2 }}
                          />

                          {/* Author Identity Card */}
                          <div className="mt-16 p-6 sm:p-8 bg-black/40 border border-zinc-800 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-red-600/10 transition-all duration-700" />
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                              <Link to={`/author/${encodeURIComponent(currentPost.author || 'Admin Bocker168')}`} className="shrink-0 hover:opacity-90 transition-opacity">
                                <img 
                                  src={currentPost.authorImage || 'https://img2.pic.in.th/A2-Logo-Bocker-168.png'} 
                                  alt={currentPost.author || 'Admin Bocker168'} 
                                  className="w-24 h-24 rounded-full object-cover border-2 border-zinc-800 shadow-xl"
                                  referrerPolicy="no-referrer"
                                />
                              </Link>
                              <div className="text-center sm:text-left">
                                <div className="text-red-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Article Author</div>
                                <Link to={`/author/${encodeURIComponent(currentPost.author || 'Admin Bocker168')}`} className="hover:text-amber-500 transition-colors">
                                  <h3 className="text-2xl font-black text-white mb-1">{currentPost.author || 'Admin Bocker168'}</h3>
                                </Link>
                                {currentPost.authorPosition && (
                                  <div className="text-amber-500 text-sm font-bold mb-3">{currentPost.authorPosition}</div>
                                )}
                                <div className="text-zinc-400 text-sm leading-relaxed mb-4 max-w-2xl italic">
                                  {currentPost.authorDescription || 'ผู้เชี่ยวชาญด้านคาสิโนออนไลน์และบาคาร่า พร้อมแบ่งปันเทคนิคและประสบการณ์เพื่อช่วยให้คุณเอาชนะในทุกการเดิมพัน'}
                                </div>
                                <div className="flex items-center justify-center sm:justify-start gap-4">
                                  <div className="text-zinc-500 text-[11px] font-mono flex items-center gap-1.5">
                                    <Check className="w-3 h-3 text-green-500" /> Verified Content
                                  </div>
                                  <div className="text-zinc-500 text-[11px] font-mono flex items-center gap-1.5 border-l border-zinc-800 pl-4">
                                    <Sparkles className="w-3 h-3 text-amber-500" /> Expert Insight
                                  </div>
                                  <Link to={`/author/${encodeURIComponent(currentPost.author || 'Admin Bocker168')}`} className="text-red-500 hover:text-red-400 text-[11px] font-mono flex items-center gap-1 border-l border-zinc-800 pl-4 transition-colors">
                                    อ่านบทความทั้งหมด <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                  <span className="text-xs text-zinc-500 font-medium">ติดตามผู้เขียน:</span>
                                  <a href="https://facebook.com/bocker168" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#1877F2] transition-colors">
                                    <Facebook size={16} />
                                  </a>
                                  <a href="https://twitter.com/bocker168" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                                    <Twitter size={16} />
                                  </a>
                                  <a href="mailto:contact@bocker168.com" className="text-zinc-500 hover:text-red-500 transition-colors">
                                    <Mail size={16} />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Navigation Prev/Next */}
                          {(() => {
                            const sortedArticles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                            const currentIndex = sortedArticles.findIndex(a => a.id === currentPost.id);
                            const nextArticle = currentIndex > 0 ? sortedArticles[currentIndex - 1] : null;
                            const prevArticle = currentIndex < sortedArticles.length - 1 ? sortedArticles[currentIndex + 1] : null;

                            if (!prevArticle && !nextArticle) return null;

                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-12 border-t border-zinc-800">
                                {prevArticle ? (
                                  <Link to={`/${prevArticle.slug || prevArticle.title.replace(/\s+/g, '-').toLowerCase()}`} className="group p-6 bg-zinc-950/30 border border-zinc-800 rounded-2xl hover:border-red-500/50 transition-all text-left">
                                    <div className="text-zinc-500 text-xs font-bold mb-2 flex items-center gap-1 group-hover:text-red-400 transition-colors">
                                      <BookOpen size={14} /> บทความก่อนหน้า
                                    </div>
                                    <div className="text-white font-bold line-clamp-2 text-sm group-hover:text-red-500 transition-colors">
                                      {prevArticle.title}
                                    </div>
                                  </Link>
                                ) : <div />}
                                
                                {nextArticle && (
                                  <Link to={`/${nextArticle.slug || nextArticle.title.replace(/\s+/g, '-').toLowerCase()}`} className="group p-6 bg-zinc-950/30 border border-zinc-800 rounded-2xl hover:border-red-500/50 transition-all text-right">
                                    <div className="text-zinc-500 text-xs font-bold mb-2 flex items-center gap-1 justify-end group-hover:text-red-400 transition-colors">
                                      บทความถัดไป <BookOpen size={14} />
                                    </div>
                                    <div className="text-white font-bold line-clamp-2 text-sm group-hover:text-red-500 transition-colors">
                                      {nextArticle.title}
                                    </div>
                                  </Link>
                                )}
                              </div>
                            );
                          })()}

                          {/* Related Articles */}
                          {(() => {
                            const related = articles
                              .filter(a => a.id !== currentPost.id && a.category === currentPost.category && a.status !== 'draft')
                              .slice(0, 3);
                            
                            if (related.length === 0) return null;

                            return (
                              <div className="mt-16">
                                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                  <Flame className="w-8 h-8 text-red-500" />
                                  บทความที่เกี่ยวข้อง
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {related.map(item => (
                                    <Link key={item.id} to={`/${item.slug || item.title.replace(/\s+/g, '-').toLowerCase()}`} className="group block group">
                                      <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-zinc-800">
                                        {item.image ? (
                                        <img 
                                          src={item.image} 
                                          alt={item.title} 
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                          referrerPolicy="no-referrer"
                                          loading="lazy"
                                        />
                                        ) : (
                                          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                            <BookOpen className="w-8 h-8 text-zinc-700" />
                                          </div>
                                        )}
                                      </div>
                                      <h4 className="text-zinc-300 font-bold text-sm line-clamp-2 group-hover:text-red-500 transition-colors">
                                        {item.title}
                                      </h4>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Share Article Bottom Section */}
                          <div className="mt-16 bg-black/40 border border-zinc-800 rounded-3xl p-8 text-center max-w-2xl mx-auto">
                            <h3 className="text-white font-bold mb-6 text-lg flex items-center justify-center gap-2">
                              <Share2 className="w-5 h-5 text-red-500" />
                              แชร์บทความนี้
                            </h3>
                            <div className="flex flex-wrap gap-4 justify-center">
                              <a 
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://hongkonglex.com${location.pathname}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] py-3 px-6 rounded-xl transition-all border border-[#1877F2]/20 font-bold"
                              >
                                <Facebook className="w-5 h-5" />
                                Facebook
                              </a>
                              <a 
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentPost.title)}&url=${encodeURIComponent(`https://hongkonglex.com${location.pathname}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white py-3 px-6 rounded-xl transition-all border border-white/10 font-bold"
                              >
                                <Twitter className="w-5 h-5" />
                                Twitter (X)
                              </a>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://hongkonglex.com${location.pathname}`);
                                  alert('คัดลอกลิงก์เรียบร้อยแล้ว');
                                }}
                                className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 px-6 rounded-xl transition-all border border-zinc-700 font-bold"
                              >
                                <LinkIcon className="w-5 h-5" />
                                Coppy Link
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl">
                  <h2 className="text-2xl font-bold text-white mb-4">ไม่พบบทความที่คุณค้นหา</h2>
                  <p className="text-zinc-400">บทความนี้อาจถูกลบไปแล้ว หรือ URL ไม่ถูกต้อง</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* --- Category Page Section --- */}
      {isCategoryPage && (
        <section className="py-24 relative bg-[#050505] min-h-screen">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-12 text-center">
              <span className="text-red-500">หมวดหมู่{currentCategory}</span>
            </h1>
            <div className="max-w-6xl mx-auto">
              <ArticlesPagination 
                items={articles.filter(a => (dynamicCategoryMap[a.category] || a.category) === urlCategorySlug && a.status !== 'draft')} 
                dynamicCategoryMap={dynamicCategoryMap} 
              />
            </div>
          </div>
        </section>
      )}

      {/* --- Author Page Section --- */}
      {isAuthorPage && (
        <section className="py-24 relative bg-[#050505] min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-16">
              {articles.filter(a => (a.author === currentAuthorSlug || a.author === dynamicReverseCategoryMap[currentAuthorSlug!]) && a.status !== 'draft').length > 0 ? (() => {
                const authorArticles = articles.filter(a => (a.author === currentAuthorSlug || a.author === dynamicReverseCategoryMap[currentAuthorSlug!]) && a.status !== 'draft');
                const authorDetails = authorArticles[0];
                return (
                  <div className="p-8 md:p-12 bg-black/40 border border-zinc-800 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                      <img 
                        src={authorDetails.authorImage || 'https://img2.pic.in.th/A2-Logo-Bocker-168.png'} 
                        alt={authorDetails.author || 'Admin Bocker168'} 
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-zinc-800 shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-center md:text-left flex-1">
                        <div className="text-red-500 font-bold mb-2 uppercase tracking-widest text-xs">Author Profile</div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{authorDetails.author || 'Admin Bocker168'}</h1>
                        {authorDetails.authorPosition && (
                          <div className="text-amber-500 font-bold mb-4">{authorDetails.authorPosition}</div>
                        )}
                        <p className="text-zinc-400 leading-relaxed mb-6 max-w-2xl text-lg italic">
                          "{authorDetails.authorDescription || 'ผู้เชี่ยวชาญด้านคาสิโนออนไลน์และบาคาร่า พร้อมแบ่งปันเทคนิคและประสบการณ์'}"
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-6 pt-6 border-t border-zinc-800/50">
                          <div className="text-center">
                            <div className="text-3xl font-black text-white mb-1">{authorArticles.length}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Articles</div>
                          </div>
                          <div className="w-px h-12 bg-zinc-800/50 hidden md:block"></div>
                          <div className="flex gap-3">
                            <a href="https://facebook.com/bocker168" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-colors" title="Facebook">
                              <Facebook size={18} />
                            </a>
                            <a href="https://twitter.com/bocker168" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-colors" title="Twitter (X)">
                              <Twitter size={18} />
                            </a>
                            <a href="mailto:contact@bocker168.com" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500 transition-colors" title="Email">
                              <Mail size={18} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="text-center">
                  <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                    ผู้เขียน: <span className="text-red-500">{currentAuthorSlug}</span>
                  </h1>
                </div>
              )}
            </div>
            
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">บทความทั้งหมดโดยผู้เขียนนี้</h2>
              <ArticlesPagination 
                items={articles.filter(a => (a.author === currentAuthorSlug || a.author === dynamicReverseCategoryMap[currentAuthorSlug!]) && a.status !== 'draft')} 
                dynamicCategoryMap={dynamicCategoryMap} 
              />
            </div>
          </div>
        </section>
      )}

      {isRegisterGuide && (
        <section className="py-24 bg-zinc-950 min-h-[60vh]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="วิธีสมัครสมาชิก Bocker168" centered={false} as="h1" />
              <div className="mt-12 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-12 text-zinc-300 leading-relaxed space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xl shrink-0">1</div>
                  <div>
                    <h3 className="text-red-500 text-2xl font-bold mb-4">คลิกปุ่มสมัครสมาชิก</h3>
                    <p>กดที่ปุ่ม "สมัครสมาชิก" บนหน้าเว็บไซต์ Bocker168 เพื่อเข้าสู่ระบบการสมัครอัตโนมัติ</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xl shrink-0">2</div>
                  <div>
                    <h3 className="text-red-500 text-2xl font-bold mb-4">กรอกข้อมูลส่วนตัว</h3>
                    <p>ระบุเบอร์โทรศัพท์มือถือที่ใช้งานจริง และข้อมูลบัญชีธนาคาร (ชื่อ-นามสกุล ต้องตรงกับชื่อบัญชีธนาคารเพื่อความรวดเร็วในการฝาก-ถอน)</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xl shrink-0">3</div>
                  <div>
                    <h3 className="text-red-500 text-2xl font-bold mb-4">ยืนยันและรับยูสเซอร์</h3>
                    <p>ตรวจสอบความถูกต้องของข้อมูลแล้วกดยืนยัน ระบบจะส่ง Username และ Password ให้คุณทันที สามารถเข้าเล่นได้เลย!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- Deposit Withdraw Guide Section --- */}
      {isDepositWithdrawGuide && (
        <section className="py-24 bg-zinc-950 min-h-[60vh]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="วิธีฝาก-ถอนเงิน ระบบออโต้" centered={false} as="h1" />
              <div className="mt-12 grid md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
                  <h3 className="text-red-500 text-2xl font-bold mb-6 flex items-center gap-3">
                    <LogIn className="w-6 h-6" /> วิธีการฝากเงิน
                  </h3>
                  <ul className="space-y-4 text-zinc-400">
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> เข้าสู่ระบบด้วยยูสเซอร์ของคุณ</li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> เลือกเมนู "ฝากเงิน"</li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> คัดลอกเลขบัญชีของทางเว็บ</li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> โอนเงินผ่านแอปธนาคารของคุณ (ต้องใช้บัญชีที่สมัครเท่านั้น)</li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> รอระบบอัปเดตยอดเงินภายใน 10 วินาที</li>
                  </ul>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
                  <h3 className="text-amber-500 text-2xl font-bold mb-6 flex items-center gap-3">
                    <Zap className="w-6 h-6" /> วิธีการถอนเงิน
                  </h3>
                  <ul className="space-y-4 text-zinc-400">
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> เลือกเมนู "ถอนเงิน"</li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> ระบุจำนวนเงินที่ต้องการถอน</li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> กดยืนยันการถอนเงิน</li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> เงินจะเข้าบัญชีธนาคารของคุณโดยอัตโนมัติ</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- Terms Section --- */}
      {isTerms && (
        <section className="py-24 bg-zinc-950 min-h-[60vh]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="ข้อตกลงและเงื่อนไข" centered={false} as="h1" />
              <div className="mt-12 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-12 text-zinc-400 leading-relaxed prose prose-invert max-w-none">
                <p>ยินดีต้อนรับสู่ Bocker168 ในการใช้บริการเว็บไซต์ของเรา คุณตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขดังต่อไปนี้:</p>
                <h3 className="text-white text-xl font-bold mt-8 mb-4">1. การสมัครสมาชิก</h3>
                <p>ผู้สมัครต้องมีอายุไม่ต่ำกว่า 18 ปีบริบูรณ์ และต้องให้ข้อมูลที่เป็นจริงเท่านั้น หากตรวจพบข้อมูลเท็จ ทางเราขอสงวนสิทธิ์ในการระงับบัญชีทันที</p>
                <h3 className="text-white text-xl font-bold mt-8 mb-4">2. การรักษาความปลอดภัย</h3>
                <p>สมาชิกมีหน้าที่รับผิดชอบในการรักษาความลับของรหัสผ่านและข้อมูลบัญชีของตนเอง ทางเว็บไซต์จะไม่รับผิดชอบต่อความเสียหายที่เกิดจากการละเลยของผู้ใช้</p>
                <h3 className="text-white text-xl font-bold mt-8 mb-4">3. กฎกติกาการเล่น</h3>
                <p>การเดิมพันทั้งหมดต้องเป็นไปตามกฎกติกาที่เว็บไซต์กำหนด หากตรวจพบการใช้โปรแกรมช่วยเล่นหรือการกระทำที่ส่อไปในทางทุจริต ทางเราจะยกเลิกยอดเงินและระงับบัญชีถาวร</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- Privacy Section --- */}
      {isPrivacy && (
        <section className="py-24 bg-zinc-950 min-h-[60vh]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="นโยบายความเป็นส่วนตัว" centered={false} as="h1" />
              <div className="mt-12 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-12 text-zinc-400 leading-relaxed prose prose-invert max-w-none">
                <p>Bocker168 ให้ความสำคัญกับความเป็นส่วนตัวของสมาชิกทุกท่าน ข้อมูลของคุณจะถูกเก็บรักษาเป็นความลับสูงสุด:</p>
                <h3 className="text-red-500 text-xl font-bold mt-8 mb-4">1. การเก็บรวบรวมข้อมูล</h3>
                <p>เราเก็บรวบรวมข้อมูลที่จำเป็นสำหรับการให้บริการ เช่น ชื่อ-นามสกุล, เบอร์โทรศัพท์, และข้อมูลบัญชีธนาคาร เพื่อใช้ในการทำรายการฝาก-ถอน</p>
                <h3 className="text-red-500 text-xl font-bold mt-8 mb-4">2. การใช้งานข้อมูล</h3>
                <p>ข้อมูลของคุณจะถูกใช้เพื่อวัตถุประสงค์ในการให้บริการ ปรับปรุงประสบการณ์การใช้งาน และแจ้งข่าวสารโปรโมชั่นที่น่าสนใจเท่านั้น</p>
                <h3 className="text-red-500 text-xl font-bold mt-8 mb-4">3. การรักษาความปลอดภัย</h3>
                <p>เราใช้ระบบเข้ารหัสข้อมูลขั้นสูง (SSL) เพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต คุณจึงมั่นใจได้ว่าข้อมูลของคุณจะปลอดภัย 100%</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- Cookies Section --- */}
      {isCookies && (
        <section className="py-24 bg-zinc-950 min-h-[60vh]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="นโยบายคุกกี้" centered={false} as="h1" />
              <div className="mt-12 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-12 text-zinc-400 leading-relaxed prose prose-invert max-w-none">
                <p>เว็บไซต์ของเรามีการใช้งานคุกกี้ (Cookies) เพื่อเพิ่มประสิทธิภาพในการใช้งานและมอบประสบการณ์ที่ดีที่สุดให้กับคุณ:</p>
                <h3 className="text-red-500 text-xl font-bold mt-8 mb-4">คุกกี้คืออะไร?</h3>
                <p>คุกกี้คือไฟล์ขนาดเล็กที่ถูกเก็บไว้ในอุปกรณ์ของคุณเมื่อคุณเข้าชมเว็บไซต์ ช่วยให้เราจดจำการตั้งค่าและพฤติกรรมการใช้งานของคุณได้</p>
                <h3 className="text-red-500 text-xl font-bold mt-8 mb-4">เราใช้คุกกี้อย่างไร?</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>คุกกี้ที่จำเป็น: เพื่อให้เว็บไซต์ทำงานได้อย่างถูกต้อง</li>
                  <li>คุกกี้เพื่อการวิเคราะห์: เพื่อทำความเข้าใจว่าผู้ใช้งานเข้าถึงส่วนใดของเว็บมากที่สุด</li>
                  <li>คุกกี้เพื่อการตลาด: เพื่อนำเสนอโปรโมชั่นที่ตรงกับความสนใจของคุณ</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- Responsible Gambling Section --- */}
      {isResponsibleGambling && <ResponsibleGambling />}

      {/* --- Hero Section --- */}
      {isHome && (
        <>
          <section id="home" className="relative pt-40 pb-12 md:pt-48 md:pb-16 lg:pt-48 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/30 border border-red-900/50 text-red-500 text-xs font-bold uppercase tracking-widest mb-6">
                <Zap className="w-4 h-4 fill-current" />
                บาคาร่า เว็บตรงอันดับ 1 ฝากถอนไม่มีขั้นต่ำ
              </div>

               <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-red-900/20 max-w-xl relative group mx-auto">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                 <img 
                   src="https://img.hongkonglex.com/Baccarat-2.png" 
                   alt="บาคาร่าออนไลน์ Bocker168" 
                   className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                   referrerPolicy="no-referrer"
                 />
               </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-8 max-w-5xl mx-auto text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-red-500">
                บาคาร่า ออนไลน์ เว็บตรง ไม่ผ่านเอเย่นต์<br className="hidden md:block" /> คาสิโนครบจบ Bocker168 มีรางวัลใหญ่ทุกวัน
              </h1>

               <p className="text-lg text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                 สัมผัสประสบการณ์เดิมพันระดับโลกไปกับ Bocker168 บาคาร่าเว็บตรงของแท้ 100% เล่นง่าย ได้เงินจริง ไม่ล็อคยูส! หมดกังวลเรื่องโดนโกง เพราะเรามีฐานการเงินมั่นคงระดับประเทศ พร้อมระบบฝาก-ถอนออโต้ที่รวดเร็วที่สุดใน 5 วินาที ทุนน้อยก็บวกได้ เริ่มต้นความสนุกและรับกำไรไปกับเราได้เลยตอนนี้!
               </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <a 
                  href="https://inlnk.co/registerbocker168" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-900/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  สมัครบาคาร่า
                </a>
                <Link to="/promotions" className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-2xl border border-zinc-800 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-500" />
                  ดูโปรโมชั่น
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center">
                {[
                  { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, text: 'บาคาร่าออนไลน์' },
                  { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, text: 'บาคาร่าเว็บตรง' },
                  { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, text: 'ฝากถอนออโต้' },
                  { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, text: 'บริการ 24 ชม.' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center justify-center gap-2 text-zinc-500 text-sm font-medium">
                    {badge.icon}
                    {badge.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SEO Content Block (Home & Baccarat) --- */}
      {(isHome || isBaccarat) && <div className={isHome ? "mt-[-20px] md:mt-[-40px]" : ""}><SeoContentBlock /></div>}
    
      {/* --- Baccarat Guide Section --- */}
      {isHome && <div className="mt-[-80px] md:mt-[-100px]"><BaccaratGuide /></div>}
    
      {/* --- Baccarat Page - Top Guide --- */}
      {isBaccarat && (
        <div className="pt-16 md:pt-20 bg-zinc-950">
          <BaccaratGuide />
        </div>
      )}

      {/* --- Baccarat SEO Article Section --- */}
      {isBaccarat && (
        <section className="py-24 bg-[#050505] border-t border-zinc-900">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="markdown-body prose prose-invert prose-red max-w-none prose-headings:font-black prose-a:text-red-500 hover:prose-a:text-red-400">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-8 border-l-4 border-red-600 pl-4 py-1">
                บาคาร่าออนไลน์ (Baccarat Online) เกมคาสิโนสดอันดับ 1 ของโลก
              </h2>
              
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-10">
                <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                  <strong>บาคาร่าออนไลน์</strong> คือเกมไพ่คาสิโนสดที่ได้รับความนิยมสูงสุดในประเทศไทยและทั่วเอเชีย ด้วยรูปแบบการเล่นที่เรียบง่าย คล้ายกับไพ่ป๊อกเด้งที่คนไทยคุ้นเคย ทำให้นักพนันหน้าใหม่สามารถทำความเข้าใจกติกาได้ภายในเวลาไม่ถึง 1 นาที ที่ Bocker168 เราได้รวบรวมค่ายเกมแบรนด์ดังระดับโลกมาไว้ในที่เดียว ไม่ว่าจะเป็น SA Gaming, Sexy Baccarat, หรือ Dream Gaming ให้คุณได้สัมผัสประสบการณ์เสมือนนั่งอยู่ในคาสิโนจริง
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                      <Check className="w-5 h-5" />
                    </div>
                    <span>เล่นง่าย รู้ผลไว ใน 30 วินาที</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                      <Check className="w-5 h-5" />
                    </div>
                    <span>อัตราจ่ายเงินรางวัลสูงถึง 11 เท่า (ทายผลไพ่คู่)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                      <Check className="w-5 h-5" />
                    </div>
                    <span>เปิดไพ่ลุ้นเองได้ (บางห้องที่รองรับ)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                      <Check className="w-5 h-5" />
                    </div>
                    <span>สถิติเค้าไพ่ชัดเจน วางแผนเดิมพันง่าย</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-950/20 to-black border border-red-900/30 rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-white mb-4">กฎกติกาการนับแต้มบาคาร่า (เบื้องต้น)</h3>
                <p className="text-zinc-400 text-sm mb-6">
                  การเล่นประกอบด้วย 2 ฝั่งคือ ฝั่งผู้เล่น (Player - สีน้ำเงิน) และฝั่งเจ้ามือ (Banker - สีแดง) โดยดีลเลอร์จะแจกไพ่ฝ่ายละ 2 ใบ และสามารถจั่วไพ่ใบที่ 3 ได้ตามกติกาที่กำหนด ฝ่ายไหนมีแต้มใกล้เคียง 9 มากที่สุดจะเป็นฝ่ายชนะ!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/50 p-4 border border-zinc-800 rounded-xl text-center">
                    <div className="text-red-500 font-black mb-1">A</div>
                    <div className="text-zinc-500 text-xs">นับเป็น 1 แต้ม</div>
                  </div>
                  <div className="bg-black/50 p-4 border border-zinc-800 rounded-xl text-center">
                    <div className="text-red-500 font-black mb-1">2-9</div>
                    <div className="text-zinc-500 text-xs">นับแต้มตามหน้าไพ่</div>
                  </div>
                  <div className="bg-black/50 p-4 border border-zinc-800 rounded-xl text-center">
                    <div className="text-red-500 font-black mb-1">10, J, Q, K</div>
                    <div className="text-zinc-500 text-xs">นับเป็น 0 แต้ม</div>
                  </div>
                  <div className="bg-black/50 p-4 border border-zinc-800 rounded-xl text-center flex flex-col justify-center">
                    <div className="text-red-500 font-black mb-1">ชนะทันที (ป๊อก)</div>
                    <div className="text-zinc-500 text-xs">ได้แต้ม 8 หรือ 9</div>
                  </div>
                </div>
                
                {/* --- เพิ่มเติมกติกาการจั่วไพ่และอัตราจ่าย --- */}
                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <h4 className="text-lg font-bold text-white mb-4">กฎการจั่วไพ่ใบที่ 3 (Third Card Rule)</h4>
                  <div className="flex gap-6 mb-8 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth custom-scrollbar">
                    <div className="min-w-[85%] md:min-w-[calc(50%-12px)] shrink-0 snap-center bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
                      <div className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        ฝั่งผู้เล่น (Player)
                      </div>
                      <ul className="text-zinc-400 text-sm space-y-2">
                        <li>• แต้ม 0-5 : <strong className="text-white">ต้องจั่วไพ่</strong> ใบที่ 3 เพิ่ม</li>
                        <li>• แต้ม 6-7 : <strong className="text-white">อยู่ (Stand)</strong> ไม่ต้องจั่วไพ่เพิ่ม</li>
                        <li>• แต้ม 8-9 : <strong className="text-white">ป๊อก (Natural)</strong> ชนะหรือเสมอทันที ไม่มีการจั่วไพ่เพิ่มทั้งสองฝั่ง</li>
                      </ul>
                    </div>
                    <div className="min-w-[85%] md:min-w-[calc(50%-12px)] shrink-0 snap-center bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
                      <div className="text-red-400 font-bold mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        ฝั่งเจ้ามือ (Banker)
                      </div>
                      <ul className="text-zinc-400 text-sm space-y-2">
                        <li>• แต้ม 0-2 : <strong className="text-white">ต้องจั่วไพ่</strong> เสมอ</li>
                        <li>• แต้ม 3-6 : การจั่วไพ่จะ <strong className="text-white">ขึ้นอยู่กับไพ่ใบที่ 3 ของฝั่ง Player</strong> (ตามตารางกติกาบาคาร่ามาตรฐานสากล)</li>
                        <li>• แต้ม 7 : <strong className="text-white">อยู่ (Stand)</strong> ไม่ต้องจั่วไพ่เพิ่ม</li>
                        <li>• แต้ม 8-9 : <strong className="text-white">ป๊อก (Natural)</strong> ชนะหรือเสมอทันที</li>
                      </ul>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-4">รูปแบบการวางเดิมพันและอัตราการจ่ายเงิน</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-zinc-400 border-collapse">
                      <thead className="bg-zinc-900/80 text-zinc-300 text-xs uppercase border-b border-zinc-700">
                        <tr>
                          <th className="px-4 py-3 font-semibold">รูปแบบการเดิมพัน</th>
                          <th className="px-4 py-3 font-semibold">เงื่อนไขการชนะ</th>
                          <th className="px-4 py-3 font-semibold">อัตราจ่าย</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        <tr className="hover:bg-zinc-900/30">
                          <td className="px-4 py-3 text-blue-400 font-medium">Player (ผู้เล่น)</td>
                          <td className="px-4 py-3">ฝั่งผู้เล่นมีแต้มสูงกว่าเจ้ามือ</td>
                          <td className="px-4 py-3 text-white">1 : 1</td>
                        </tr>
                        <tr className="hover:bg-zinc-900/30">
                          <td className="px-4 py-3 text-red-400 font-medium">Banker (เจ้ามือ)</td>
                          <td className="px-4 py-3">ฝั่งเจ้ามือมีแต้มสูงกว่าผู้เล่น</td>
                          <td className="px-4 py-3 text-white">1 : 0.95 <span className="text-xs text-zinc-500">(หักค่าต๋ง 5%)</span></td>
                        </tr>
                        <tr className="hover:bg-zinc-900/30">
                          <td className="px-4 py-3 text-green-400 font-medium">Tie (เสมอ)</td>
                          <td className="px-4 py-3">ทั้งสองฝั่งมีแต้มรวมเท่ากัน <span className="text-xs text-zinc-500">(คืนทุนแทง Player/Banker)</span></td>
                          <td className="px-4 py-3 text-white">1 : 8</td>
                        </tr>
                        <tr className="hover:bg-zinc-900/30">
                          <td className="px-4 py-3 text-purple-400 font-medium">Player Pair / Banker Pair</td>
                          <td className="px-4 py-3">วงไพ่ 2 ใบแรกของฝั่งที่แทง ออกมาเป็นไพ่คู่ (เช่น 7-7, K-K)</td>
                          <td className="px-4 py-3 text-white">1 : 11</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mt-12 mb-6 line-clamp-1">
                เคล็ดลับทำกำไรจาก บาคาร่า (Baccarat Strategy)
              </h3>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                แม้ว่าบาคาร่าจะเป็นเกมที่อาศัยดวง แต่การมี <strong>สูตรบาคาร่า หรือเทคนิคการเดินเงิน</strong> จะช่วยเพิ่มอัตราการชนะ (Win Rate) ให้กับคุณได้อย่างมหาศาล:
              </p>
              <div className="space-y-6 mb-10 text-zinc-400 text-sm">
                <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex gap-4">
                  <div className="text-2xl pt-1">📊</div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-2">การอ่านเค้าไพ่ (Roadmap Reading)</h4>
                    <p>ฝึกสังเกตเค้าไพ่ยอดฮิต เช่น เค้าไพ่มังกร (ออกฝั่งเดิมซ้ำๆ ยาวๆ) หรือ เค้าไพ่ปิงปอง (ออกสลับฝั่งกัน) หากจับจังหวะได้ คุณสามารถแทงตามน้ำรับทรัพย์ได้อย่างต่อเนื่อง</p>
                  </div>
                </div>
                <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex gap-4">
                  <div className="text-2xl pt-1">💰</div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-2">เทคนิคการแทงทบ (Martingale Method)</h4>
                    <p>กำหนดทุนให้ชัดเจน หากตานี้เสีย ตาหน้าให้แทงทบเพิ่มอีก 1 เท่า เพื่อเรียกทุนคืนพร้อมกำไร (ต้องตั้งเป้าการทบให้ชัดเจน เช่น ไม่เกิน 3-4 ไม้เพื่อลดความเสี่ยง)</p>
                  </div>
                </div>
                <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex gap-4">
                  <div className="text-2xl pt-1">🧘‍♂️</div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-2">เล่นอย่างมีสติ ตั้งเป้าหมายกำไร-ขาดทุน</h4>
                    <p>สิ่งสำคัญที่สุดของการเดิมพันคือ "วินัย" ได้ตามเป้าต้องถอน เสียถึงลิมิตต้องพัก การควบคุมอารมณ์คือหัวใจสำคัญในการเอาชนะบาคาร่าในระยะยาว</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center pb-2">
              <Link to="/register" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all">
                ทดลองเล่นบาคาร่าฟรี <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* --- Highlight Bar --- */}
      <section className="py-12 bg-zinc-900/30 border-y border-zinc-800 overflow-hidden">
        <div className="container mx-auto px-4">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 6 },
            }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-12"
          >
            {HIGHLIGHTS.map((item, i) => (
              <SwiperSlide key={i} className="h-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center group h-full bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50"
                >
                  <div className="mb-4 p-3 bg-zinc-900 rounded-2xl border border-zinc-800 group-hover:border-red-500/50 transition-all group-hover:-translate-y-1">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-zinc-500 text-xs">{item.description}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      </>
      )}

      {/* --- Why Choose Section --- */}
      {isFeatures && (
      <section id="features" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="mb-20">
            <SectionTitle 
              title="ทำไมต้องเลือกเล่นบาคาร่ากับ Bocker168"
              subtitle="เว็บตรง มั่นคง ปลอดภัย พร้อมให้บริการระดับพรีเมียม ตอบโจทย์ทุกการเดิมพัน"
              as={isHome ? 'h2' : 'h1'}
            />
          </div>

          <div className="max-w-7xl mx-auto">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation
              className="py-10"
            >
              {WHY_CHOOSE.map((feature, i) => (
                <SwiperSlide key={i}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-[2rem] hover:border-amber-500/50 transition-all group flex flex-col items-center text-center h-full"
                  >
                    <div className="relative mb-8 group-hover:scale-105 transition-transform duration-500 w-full flex justify-center">
                      <div className="absolute inset-0 bg-amber-500/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {feature.image && (
                        <img 
                          src={feature.image} 
                          alt={feature.title} 
                          className="w-full max-w-[250px] h-auto aspect-square object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      )}

      {/* --- Baccarat Categories --- */}
      {isHome && renderCategoriesSection(true)}

      {/* --- Articles Section (Home & Articles) --- */}
      {(isHome || isArticles) && renderArticlesSection()}

      {/* --- How To Start --- */}
      {false && isHome && (
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="เริ่มต้นเล่นบาคาร่าง่ายๆ ใน 3 ขั้นตอน"
            subtitle="สมัคร ฝาก เล่น ทำกำไรได้ทันที ไม่ต้องรอนานด้วยระบบออโต้"
          />

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-16"
          >
            {STEPS.map((step, i) => (
              <SwiperSlide key={i} className="h-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative z-10 flex flex-col items-center text-center group h-full"
                >
                  <div className="flex flex-col items-center min-h-[200px] justify-end mb-8">
                    {step.image ? (
                      <div className="mb-6 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg max-w-[280px] group-hover:border-red-500/50 transition-colors">
                        <img 
                          src={step.image || null} 
                          alt={step.title} 
                          className="w-full h-auto object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="mb-6 h-[120px] flex items-center justify-center">
                        {/* Placeholder or just empty space to keep circles aligned */}
                      </div>
                    )}
                    <div className="w-20 h-20 bg-zinc-900 border-4 border-zinc-800 rounded-full flex items-center justify-center shadow-xl group-hover:border-red-600 transition-all">
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-amber-500">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-500 transition-colors">{step.title}</h3>
                  <p className="text-zinc-500 max-w-xs mb-8">
                    {step.description}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      )}

      {/* --- Promotions Section --- */}
      {isPromotions && (
      <>
      <section id="promotions" className="py-24 relative">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="โปรโมชั่นบาคาร่าสุดคุ้ม"
            subtitle="ข้อเสนอพิเศษสำหรับสมาชิก Bocker168 เท่านั้น รับโบนัสจัดเต็มทุกวัน"
            as={isHome ? 'h2' : 'h1'}
          />

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-16"
          >
            {PROMOTIONS.map((promo, i) => (
              <SwiperSlide key={i} className="h-auto">
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden group hover:border-red-600/50 transition-all h-full flex flex-col"
                >
                  <div className="h-48 bg-gradient-to-br from-zinc-800 to-zinc-950 relative flex items-center justify-center overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent" />
                    {promo.image ? (
                      <img 
                        src={promo.image || null} 
                        alt={promo.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Gift className="w-20 h-20 text-red-600/20 group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <div className="absolute top-4 right-4 px-4 py-1 bg-red-600 text-white text-xs font-black rounded-full shadow-lg z-10">
                      {promo.badge}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-4">{promo.title}</h3>
                    <p className="text-zinc-400 mb-8 text-sm leading-relaxed flex-1">
                      {promo.description}
                    </p>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => setSelectedPromo(promo)}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {promo.cta} <Zap className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="mt-12 text-center">
            <Link to="/promotions" className="text-amber-500 font-bold hover:underline underline-offset-8">
              ดูโปรโมชั่นทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* Promotion Details Modal */}
      <PromotionModal 
        promo={selectedPromo} 
        onClose={() => setSelectedPromo(null)} 
      />
      </>
      )}

      {/* --- Baccarat Categories (At Bottom of Baccarat Page) --- */}
      {isBaccarat && renderCategoriesSection(false)}

      {/* --- Articles Section (At Bottom of Baccarat Page) --- */}
      {isBaccarat && renderArticlesSection()}

      {/* --- FAQ Section --- */}
      {(isHome || isFaq) && (
      <section id="faq" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionTitle 
              title="คำถามที่พบบ่อยเกี่ยวกับ Bocker168 บาคาร่าออนไลน์"
              centered={false}
              as={isHome ? 'h2' : 'h1'}
            />
            <div className="mt-12 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-4 md:p-8">
              {FAQS.map((faq, i) => (
                <FAQItem 
                  key={i} 
                  faq={faq} 
                  isOpen={openFaqIndex === i} 
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {isContact && <ContactForm />}

      {/* --- Final CTA Section --- */}
      {(isHome || isContact) && (
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-red-600 via-red-700 to-amber-600 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-red-900/40 relative overflow-hidden"
          >
            {/* Decorative patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </div>

            <div className="relative z-10">
              {React.createElement(
                isHome ? 'h2' : 'h1',
                { className: "text-3xl md:text-4xl lg:text-5xl font-black text-white mb-8 leading-tight" },
                <>พร้อมที่จะทำกำไรจาก <br className="hidden md:block" /> บาคาร่าออนไลน์ หรือยัง?</>
              )}
              <p className="text-red-100 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                สมัครสมาชิกวันนี้ รับโบนัสฟรี 100% ฝากถอนไม่มีขั้นต่ำด้วยระบบออโต้ 10 วินาที เล่นง่าย จ่ายจริง มั่นคง 100%
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a 
                  href="https://inlnk.co/registerbocker168" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-10 py-5 bg-white text-red-600 font-black text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95 inline-block"
                >
                  สมัครสมาชิกตอนนี้
                </a>
                <button 
                  onClick={() => setShowAdmin(true)}
                  className="px-10 py-5 bg-black/20 backdrop-blur-sm border border-white/30 text-white font-black text-xl rounded-2xl hover:bg-black/30 transition-all active:scale-95"
                >
                  เข้าสู่ระบบ
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      )}
      </main>

      {/* --- Footer --- */}
      <footer id="footer" className="bg-[#050505] pt-20 pb-10 relative z-10 overflow-hidden">
        {/* Metallic Gold Border Top */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <Link to="/" className="mb-8 block group">
              <img 
                src="https://img2.pic.in.th/A2-Logo-Bocker-168.png" 
                alt="Bocker168 Logo" 
                className="h-20 md:h-24 w-auto group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </Link>
            
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto leading-relaxed mb-10">
              Bocker168 เว็บตรงบาคาร่าออนไลน์อันดับ 1 มั่นคง ปลอดภัย ให้บริการคาสิโนสดจากค่ายชั้นนำระดับโลก พร้อมระบบฝากถอนออโต้ 24 ชั่วโมง
            </p>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10">
              {[
                { label: 'คำถามที่พบบ่อย', path: '/faq' },
                { label: 'ข้อตกลงและเงื่อนไข', path: '/terms' },
                { label: 'นโยบายความเป็นส่วนตัว', path: '/privacy' },
                { label: 'นโยบายคุกกี้', path: '/cookies' },
                { label: 'ความรับผิดชอบต่อสังคม', path: '/responsible-gambling' },
              ].map((item) => (
                <Link 
                  key={item.label} 
                  to={item.path} 
                  className="text-zinc-500 hover:text-red-500 transition-all text-sm font-bold uppercase tracking-wider"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                { icon: ShieldCheck, label: 'Licensed & Certified' },
                { icon: CreditCard, label: 'Secure Payments' },
                { icon: Zap, label: 'Fast Auto-Deposit' },
                { icon: Headset, label: '24/7 Support' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 bg-zinc-900/30 px-4 py-2 rounded-xl border border-zinc-800/50">
                  <badge.icon className="w-4 h-4 text-red-500" />
                  <span className="text-zinc-300 font-bold text-[10px] uppercase tracking-tight">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-zinc-600 text-[10px] font-bold tracking-widest uppercase">
              © 2026 Bocker168. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-zinc-500 text-[10px] bg-zinc-900/30 px-5 py-2 rounded-full border border-zinc-800/50">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span className="font-bold">สำหรับผู้มีอายุ 18 ปีขึ้นไป กรุณาใช้งานอย่างมีความรับผิดชอบ</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <CookieConsent 
            onAccept={handleAcceptAllCookies} 
            onReject={handleRejectAllCookies}
            onManage={() => setShowCookieSettings(true)} 
          />
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <CookieSettingsModal 
        isOpen={showCookieSettings}
        onClose={() => setShowCookieSettings(false)}
        settings={cookieSettings}
        setSettings={setCookieSettings}
        onSave={handleSaveCookieSettings}
      />

      {/* Live Chat Widget */}
      <LiveChat />

    </div>
  );
}
