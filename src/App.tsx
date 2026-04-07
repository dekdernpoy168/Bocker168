/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  Circle
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

const MENU_ITEMS = [
  { label: 'หน้าแรก', path: '/' },
  { label: 'บาคาร่าออนไลน์', path: '/baccarat' },
  { label: 'จุดเด่น', path: '/features' },
  { label: 'โปรโมชั่น', path: '/promotions' },
  { label: 'บทความ', path: '/articles' },
  { label: 'ติดต่อเรา', path: '/contact' },
  { label: 'วิธีสมัครสมาชิก', path: '/register-guide' },
  { label: 'วิธีฝาก-ถอน', path: '/deposit-withdraw-guide' },
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
    image: 'https://img2.pic.in.th/New-members-receive-a-100-bonus.png',
    title: 'สมาชิกใหม่รับโบนัส 100%',
    description: 'ฝากครั้งแรกรับโบนัสเพิ่มทันที ทำเทิร์นน้อย ถอนได้ไม่อั้น คุ้มค่าที่สุด',
    details: 'โปรโมชั่นสำหรับสมาชิกใหม่ที่มียอดฝากครั้งแรกเท่านั้น รับโบนัสสูงสุด 1,000 บาท ทำเทิร์นเพียง 5 เท่า ถอนได้ทันที ไม่จำกัดยอดถอนสูงสุด',
    cta: 'รับสิทธิ์เลย'
  },
  {
    badge: 'CASHBACK',
    image: 'https://img1.pic.in.th/images/Get-5-cashback-on-losses-every-week..jpg',
    title: 'คืนยอดเสีย 5% ทุกสัปดาห์',
    description: 'เล่นเสียไม่ต้องเศร้า เรารับประกันคืนยอดเสียให้ นำไปเป็นทุนต่อยอดได้',
    details: 'ระบบจะคำนวณยอดเสียสะสมตั้งแต่วันจันทร์ถึงวันอาทิตย์ และคืนเข้ากระเป๋าเครดิตของคุณทุกวันจันทร์ เวลา 12:00 น. โดยอัตโนมัติ ไม่ต้องทำเทิร์น',
    cta: 'ดูรายละเอียด'
  },
  {
    badge: 'COMMISSION',
    image: 'https://img2.pic.in.th/Get-5-cashback-on-losses-every-week.jpg',
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

// --- Components ---

interface SectionTitleProps {
  title: string;
  subtitle?: string | null;
  centered?: boolean;
}

const SectionTitle = ({ title, subtitle = null, centered = true }: SectionTitleProps) => (
  <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-bold text-white mb-4"
    >
      {title}
    </motion.h2>
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
);

interface FAQItemProps {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
  key?: React.Key;
}

const FAQItem = ({ faq, isOpen, onClick }: FAQItemProps) => {
  const faqId = faq.question
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/(^-|-$)/g, '');
    
  return (
  <div className="border-b border-zinc-800 last:border-0">
    <button 
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${faqId}`}
      id={`faq-question-${faqId}`}
      className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
    >
      <h3 className={`text-lg font-medium transition-colors ${isOpen ? 'text-amber-500' : 'text-white group-hover:text-red-500'}`}>
        {faq.question}
      </h3>
      {isOpen ? <ChevronUp className="text-amber-500" aria-hidden="true" /> : <ChevronDown className="text-zinc-500" aria-hidden="true" />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          id={`faq-answer-${faqId}`}
          role="region"
          aria-labelledby={`faq-question-${faqId}`}
          initial={{ height: 0, opacity: 0, y: -10 }}
          animate={{ height: 'auto', opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <p className="pb-6 text-zinc-400 leading-relaxed">
            {faq.answer}
          </p>
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
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
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
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [articleError, setArticleError] = useState<string | null>(null);

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
        // Silent fail for background polling, but set error state
        setArticleError('Unable to load articles at this time.');
      }
    } catch (error) {
      // Graceful error handling
      setArticleError('Connection error while fetching articles.');
    }
  };

  useEffect(() => {
    setIsLoadingArticles(true);
    fetchArticles().finally(() => setIsLoadingArticles(false));
  }, []);

  useEffect(() => {
    // Re-fetch when admin dashboard is closed to ensure latest data
    if (!showAdmin) {
      fetchArticles();
    }
  }, [showAdmin]);

  const isHome = location.pathname === '/';
  const isFeatures = location.pathname === '/features';
  const isBaccarat = location.pathname === '/baccarat';
  const isPromotions = location.pathname === '/promotions';
  const isArticles = location.pathname.replace(/\/$/, '') === '/articles';
  const isFaq = location.pathname.replace(/\/$/, '') === '/faq';
  const isContact = location.pathname.replace(/\/$/, '') === '/contact';
  const isRegisterGuide = location.pathname.replace(/\/$/, '') === '/register-guide';
  const isDepositWithdrawGuide = location.pathname.replace(/\/$/, '') === '/deposit-withdraw-guide';
  const isTerms = location.pathname.replace(/\/$/, '') === '/terms';
  const isPrivacy = location.pathname.replace(/\/$/, '') === '/privacy';
  const isCookies = location.pathname.replace(/\/$/, '') === '/cookies';
  const isResponsibleGambling = location.pathname.replace(/\/$/, '') === '/responsible-gambling';
  
  const isArticleDetail = location.pathname.startsWith('/article/');
  const articleSlug = isArticleDetail ? decodeURIComponent(location.pathname.split('/article/')[1]) : null;
  const currentArticle = articleSlug ? articles.find(a => (a.slug || a.title.replace(/\s+/g, '-').toLowerCase()) === articleSlug) : null;

  const getPageTitle = () => {
    if (isHome) return 'Bocker168 - บาคาร่าออนไลน์ เว็บตรงไม่ผ่านเอเย่นต์ ฝากถอนไม่มีขั้นต่ำ';
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
    if (isArticleDetail && currentArticle) {
      return currentArticle.metaTitle || `${currentArticle.title} - Bocker168`;
    }
    return 'Bocker168 - บาคาร่าออนไลน์';
  };

  const getPageDescription = () => {
    if (isArticleDetail && currentArticle) {
      return currentArticle.metaDescription || currentArticle.excerpt || (currentArticle as any).description || 'อ่านบทความเกี่ยวกับบาคาร่าและคาสิโนออนไลน์ได้ที่ Bocker168';
    }
    return 'เล่นบาคาร่ากับเว็บตรงอันดับ 1 มั่นคง ปลอดภัย ได้เงินจริง สัมผัสประสบการณ์คาสิโนสดระดับพรีเมียม รองรับทุกระบบมือถือ พร้อมโปรโมชั่นสมาชิกใหม่จัดเต็ม';
  };

  const getPageKeywords = () => {
    if (isArticleDetail && currentArticle && currentArticle.metaKeywords) return currentArticle.metaKeywords;
    return 'บาคาร่า, บาคาร่าออนไลน์, บาคาร่าเว็บตรง, สมัครบาคาร่า, คาสิโนสด, bocker168';
  };

  if (showAdmin) {
    return <AdminDashboard onClose={() => setShowAdmin(false)} onSaveSuccess={fetchArticles} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content={getPageKeywords()} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:type" content={isArticleDetail ? "article" : "website"} />
        <meta property="og:url" content={`https://bocker168.com${location.pathname}`} />
        <link rel="canonical" href={`https://bocker168.com${location.pathname}`} />
        
        {/* Schema.org JSON-LD Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OnlineCasino",
            "name": "Bocker168",
            "url": "https://bocker168.com",
            "logo": "https://img2.pic.in.th/A2-Logo-Bocker-168.png",
            "description": "เล่นบาคาร่ากับเว็บตรงอันดับ 1 มั่นคง ปลอดภัย ได้เงินจริง สัมผัสประสบการณ์คาสิโนสดระดับพรีเมียม รองรับทุกระบบมือถือ พร้อมโปรโมชั่นสมาชิกใหม่จัดเต็ม",
            "currenciesAccepted": "THB",
            "paymentAccepted": "Bank Transfer, TrueMoney Wallet",
            "openingHours": "Mo-Su 00:00-24:00",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "TH"
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CasinoGame",
            "name": "บาคาร่าออนไลน์",
            "description": "เกมบาคาร่าสดจากค่ายดัง SA Gaming, Sexy Baccarat, Dream Gaming พร้อมสูตรและเทคนิคการอ่านเค้าไพ่",
            "gameCategory": "Card Game",
            "publisher": {
              "@type": "Organization",
              "name": "Bocker168"
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
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
          })}
        </script>
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
          <nav className="lg:hidden grid grid-cols-4 gap-2 py-3 border-t border-zinc-800/50 mt-3">
            {MENU_ITEMS.map((item) => (
              <Link 
                key={item.label} 
                to={item.path}
                className="flex items-center justify-center text-center px-1 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-white hover:border-red-600 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className={!isHome ? "pt-56 lg:pt-24" : ""}>
      
      {/* --- Article Detail Section --- */}
      {isArticleDetail && (
        <section className="py-24 relative bg-[#050505] min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link to="/articles" className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors mb-8 font-medium">
                <ArrowRight className="w-4 h-4 rotate-180" />
                กลับไปหน้าบทความ
              </Link>
              
              {currentArticle ? (
                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden">
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                        {currentArticle.category}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Calendar className="w-5 h-5" />
                        <span>{currentArticle.date}</span>
                      </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black text-red-500 mb-8 leading-tight">
                      {currentArticle.title}
                    </h1>
                    
                    <div 
                      className="max-w-none [&>h1]:text-red-500 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:text-red-500 [&>h2]:mt-8 [&>p]:text-zinc-300 [&>p]:mb-6 [&>p]:leading-relaxed [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:text-red-500 [&>h3]:mt-6 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-red-500 [&>h4]:mt-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:text-zinc-300 [&>ul>li]:mb-2 [&>strong]:text-amber-500 [&>b]:text-amber-500 [&>a]:text-sky-400 hover:[&>a]:text-sky-300 [&>a]:underline transition-colors [&>p>img]:rounded-2xl [&>p>img]:mb-8 [&>p>img]:w-full"
                      dangerouslySetInnerHTML={{ __html: currentArticle.content || (currentArticle as any).description }}
                    />
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

      {/* --- Register Guide Section --- */}
      {isRegisterGuide && (
        <section className="py-24 bg-zinc-950 min-h-[60vh]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="วิธีสมัครสมาชิก Bocker168" centered={false} />
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
              <SectionTitle title="วิธีฝาก-ถอนเงิน ระบบออโต้" centered={false} />
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
              <SectionTitle title="ข้อตกลงและเงื่อนไข" centered={false} />
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
              <SectionTitle title="นโยบายความเป็นส่วนตัว" centered={false} />
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
              <SectionTitle title="นโยบายคุกกี้" centered={false} />
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
      {isResponsibleGambling && (
        <section className="py-24 bg-zinc-950 min-h-[60vh]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="ความรับผิดชอบต่อสังคม" centered={false} />
              <div className="mt-12 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-12 text-zinc-400 leading-relaxed prose prose-invert max-w-none">
                <p>Bocker168 สนับสนุนการเล่นพนันอย่างมีความรับผิดชอบ เพื่อให้การเดิมพันเป็นเพียงกิจกรรมสันทนาการที่สนุกสนาน:</p>
                <h3 className="text-red-500 text-xl font-bold mt-8 mb-4">คำแนะนำในการเล่นอย่างมีความรับผิดชอบ</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>เล่นเพื่อความสนุกสนาน ไม่ใช่เพื่อหารายได้หลัก</li>
                  <li>กำหนดงบประมาณที่สามารถเสียได้และไม่เดือดร้อนต่อตนเองและครอบครัว</li>
                  <li>ไม่ควรใช้เวลาในการเล่นมากเกินไปจนกระทบต่อหน้าที่การงานหรือการเรียน</li>
                  <li>หากรู้สึกว่าการเล่นเริ่มส่งผลเสียต่อชีวิตประจำวัน ควรหยุดพักและขอคำปรึกษา</li>
                </ul>
                <p className="mt-8 p-6 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-500 font-bold">
                  "การพนันควรเป็นเรื่องของความบันเทิง กรุณาเล่นอย่างมีสติ"
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- Hero Section --- */}
      {isHome && (
        <>
          <section id="home" className="relative pt-56 pb-20 md:pt-48 md:pb-32 overflow-hidden">
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
                บาคาร่าเว็บตรงอันดับ 1
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
                บาคาร่าออนไลน์ Bocker168 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-red-600">เว็บตรงไม่ผ่านเอเย่นต์</span> ฝากถอนไม่มีขั้นต่ำ
              </h1>
              
              <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-red-900/20 max-w-xl relative group mx-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                <img 
                  src="https://img1.pic.in.th/images/Online-Baccarat-Bocker168.jpg" 
                  alt="บาคาร่าออนไลน์ Bocker168" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-lg text-zinc-400 mb-10 leading-relaxed max-w-xl mx-auto">
                เล่นบาคาร่ากับเว็บตรงอันดับ 1 มั่นคง ปลอดภัย ได้เงินจริง สัมผัสประสบการณ์คาสิโนสดระดับพรีเมียม รองรับทุกระบบมือถือ พร้อมโปรโมชั่นสมาชิกใหม่จัดเต็ม
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

      {/* --- Highlight Bar --- */}
      <section className="py-12 bg-zinc-900/30 border-y border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {HIGHLIGHTS.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-4 p-3 bg-zinc-900 rounded-2xl border border-zinc-800 group-hover:border-red-500/50 transition-all group-hover:-translate-y-1">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-zinc-500 text-xs">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      </>
      )}

      {/* --- Why Choose Section --- */}
      {(isHome || isFeatures) && (
      <section id="features" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="mb-20">
            <SectionTitle 
              title="ทำไมต้องเลือกเล่นบาคาร่ากับ Bocker168"
              subtitle="เว็บตรง มั่นคง ปลอดภัย พร้อมให้บริการระดับพรีเมียม ตอบโจทย์ทุกการเดิมพัน"
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
                      <img 
                        src={feature.image} 
                        alt={feature.title} 
                        className="w-full max-w-[250px] h-auto aspect-square object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                        referrerPolicy="no-referrer"
                      />
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
      {(isHome || isBaccarat) && (
      <>
      {/* --- Live Stats Section --- */}
      <section className="py-24 bg-zinc-950 border-b border-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/50 border border-red-900/50 text-red-500 font-bold text-sm mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              LIVE BACCARAT STATS
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              สถิติเค้าไพ่สด <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">เรียลไทม์</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              อัปเดตสถานะโต๊ะบาคาร่ายอดฮิตแบบวินาทีต่อวินาที เลือกโต๊ะที่ใช่ ทำกำไรได้ทันที ไม่ต้องสุ่มเดา
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LIVE_STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-red-500/30 transition-colors group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">{stat.provider}</h3>
                    <p className="text-zinc-500 text-sm">{stat.table}</p>
                  </div>
                  <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-300 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-amber-500" />
                    {stat.status}
                  </div>
                </div>

                <div className="mb-6 p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      stat.hot === 'Banker' ? 'bg-red-500/20 text-red-500' :
                      stat.hot === 'Player' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-green-500/20 text-green-500'
                    }`}>
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-zinc-400 text-xs mb-1">กำลังมาแรง</p>
                      <p className={`font-bold text-sm ${
                        stat.hot === 'Banker' ? 'text-red-500' :
                        stat.hot === 'Player' ? 'text-blue-500' :
                        'text-green-500'
                      }`}>
                        {stat.hot === 'Banker' ? 'แบงค์เกอร์ (แดง)' : stat.hot === 'Player' ? 'เพลเยอร์ (น้ำเงิน)' : 'เสมอ (เขียว)'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-black text-2xl">{stat.streak}</p>
                    <p className="text-zinc-500 text-xs">ตาติดกัน</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-red-500">B {stat.stats.banker}%</span>
                    <span className="text-green-500">T {stat.stats.tie}%</span>
                    <span className="text-blue-500">P {stat.stats.player}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-red-500" style={{ width: `${stat.stats.banker}%` }} />
                    <div className="h-full bg-green-500" style={{ width: `${stat.stats.tie}%` }} />
                    <div className="h-full bg-blue-500" style={{ width: `${stat.stats.player}%` }} />
                  </div>
                </div>

                <div>
                  <p className="text-zinc-500 text-xs mb-3">ผลล่าสุด (ซ้ายไปขวา)</p>
                  <div className="flex gap-2">
                    {stat.history.map((result, idx) => (
                      <div 
                        key={idx}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                          result === 'B' ? 'bg-red-500 shadow-red-500/20' :
                          result === 'P' ? 'bg-blue-500 shadow-blue-500/20' :
                          'bg-green-500 shadow-green-500/20'
                        }`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
                
                <a 
                  href="https://inlnk.co/registerbocker168" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-6 w-full py-3 bg-zinc-800 hover:bg-red-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-red-600"
                >
                  เข้าเล่นโต๊ะนี้ <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="py-24 bg-zinc-950 relative">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="รวมค่ายบาคาร่าออนไลน์ชั้นนำระดับโลก"
            subtitle="เลือกเล่นคาสิโนสดจากค่ายดัง ภาพคมชัดระดับ Full HD ส่งตรงจากคาสิโนจริง"
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
                        src={cat.image} 
                        alt={cat.title} 
                        className="w-full h-full object-contain object-bottom group-hover:scale-110 transition-transform duration-500 relative z-0"
                        referrerPolicy="no-referrer"
                      />
                      <img 
                        src={cat.logo} 
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

      {/* --- How To Start --- */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="เริ่มต้นเล่นบาคาร่าง่ายๆ ใน 3 ขั้นตอน"
            subtitle="สมัคร ฝาก เล่น ทำกำไรได้ทันที ไม่ต้องรอนานด้วยระบบออโต้"
          />

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line - Adjusted to align with circles */}
            <div className="hidden md:block absolute top-[160px] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-zinc-800 to-transparent z-0" />
            
            {STEPS.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="flex flex-col items-center min-h-[200px] justify-end mb-8">
                  {step.image ? (
                    <div className="mb-6 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg max-w-[280px] group-hover:border-red-500/50 transition-colors">
                      <img 
                        src={step.image} 
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
                <p className="text-zinc-500 max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </>
      )}

      {/* --- Promotions Section --- */}
      {(isHome || isPromotions) && (
      <>
      <section id="promotions" className="py-24 relative">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="โปรโมชั่นบาคาร่าสุดคุ้ม"
            subtitle="ข้อเสนอพิเศษสำหรับสมาชิก Bocker168 เท่านั้น รับโบนัสจัดเต็มทุกวัน"
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {PROMOTIONS.map((promo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden group hover:border-red-600/50 transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-zinc-800 to-zinc-950 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent" />
                  {promo.image ? (
                    <img 
                      src={promo.image} 
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
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{promo.title}</h3>
                  <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
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
            ))}
          </div>
          
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

      {/* --- Articles Section --- */}
      {(isHome || isArticles) && (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden hover:border-red-600/30 transition-all duration-500 flex flex-col"
                >
                  <Link to={`/article/${article.slug || article.title.replace(/\s+/g, '-').toLowerCase()}`} className="flex flex-col h-full">
                    <div className="h-56 overflow-hidden relative">
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                        {article.category}
                      </div>
                      {article.image ? (
                        <img 
                          src={article.image} 
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
                      <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                        {article.excerpt || (article as any).description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-red-500 font-bold text-sm group/btn mt-auto w-fit">
                        อ่านเพิ่มเติม
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
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
      )}

      {/* --- FAQ Section --- */}
      {(isHome || isFaq) && (
      <section id="faq" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionTitle 
              title="คำถามที่พบบ่อยเกี่ยวกับ Bocker168 บาคาร่าออนไลน์"
              centered={false}
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
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
                พร้อมที่จะทำกำไรจาก <br className="hidden md:block" /> บาคาร่าออนไลน์ หรือยัง?
              </h2>
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

      {/* Floating Action Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40">
        <a 
          href="https://inlnk.co/registerbocker168" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center animate-bounce"
        >
          <PlayCircle className="w-8 h-8" />
        </a>
      </div>

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
