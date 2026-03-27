/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  Clock, 
  LayoutDashboard, 
  Layers, 
  Star, 
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
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Data ---

const MENU_ITEMS = [
  { label: 'หน้าแรก', href: '#home' },
  { label: 'จุดเด่น', href: '#features' },
  { label: 'บาคาร่าออนไลน์', href: '#categories' },
  { label: 'โปรโมชั่น', href: '#promotions' },
  { label: 'คำถามที่พบบ่อย', href: '#faq' },
  { label: 'ติดต่อเรา', href: '#footer' },
];

const HIGHLIGHTS = [
  {
    icon: <LayoutDashboard className="w-8 h-8 text-red-500" />,
    title: 'บาคาร่าออนไลน์ใช้งานง่าย',
    description: 'เมนูชัดเจน เข้าถึงได้ไว ไม่ซับซ้อน'
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-amber-500" />,
    title: 'บาคาร่าเว็บตรง',
    description: 'โครงสร้างหน้าเว็บทันสมัย ดูเป็นระเบียบ และใช้งานสะดวก'
  },
  {
    icon: <Smartphone className="w-8 h-8 text-red-500" />,
    title: 'รองรับมือถือเต็มรูปแบบ',
    description: 'เล่นและใช้งานได้ดีทั้งมือถือ แท็บเล็ต และเดสก์ท็อป'
  },
  {
    icon: <Zap className="w-8 h-8 text-amber-500" />,
    title: 'ระบบลื่นไหล',
    description: 'ทุกส่วนถูกออกแบบให้ใช้งานต่อเนื่องได้อย่างคล่องตัว'
  },
  {
    icon: <Clock className="w-8 h-8 text-red-500" />,
    title: 'เข้าถึงได้ตลอดเวลา',
    description: 'ใช้งานได้สะดวกทุกช่วงเวลา'
  },
  {
    icon: <Layers className="w-8 h-8 text-amber-500" />,
    title: 'ครบในที่เดียว',
    description: 'รวมหมวดสำคัญและโปรโมชันไว้ในแพลตฟอร์มเดียว'
  }
];

const WHY_CHOOSE = [
  {
    icon: <Crown className="w-6 h-6" />,
    title: 'ดีไซน์แดง ทอง ดำ แบบพรีเมียม',
    description: 'ภาพลักษณ์โดดเด่น ดูหรู และช่วยให้หน้าเว็บจดจำได้ง่าย'
  },
  {
    icon: <Gem className="w-6 h-6" />,
    title: 'เน้นบาคาร่าออนไลน์เป็นหลัก',
    description: 'โครงสร้างเว็บไซต์ออกแบบมาเพื่อให้เข้าถึงหมวดบาคาร่าที่สำคัญได้สะดวก'
  },
  {
    icon: <Monitor className="w-6 h-6" />,
    title: 'รองรับมือถือเต็มรูปแบบ',
    description: 'ไม่ว่าจะใช้งานจากหน้าจอไหน หน้าเว็บยังคงดูดีและกดใช้งานง่าย'
  },
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: 'จัดวางเมนูเป็นระเบียบ',
    description: 'ช่วยให้ผู้ใช้ใหม่เข้าใจหน้าเว็บได้เร็วขึ้นและใช้งานได้ทันที'
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: 'โปรโมชันอัปเดตสม่ำเสมอ',
    description: 'เพิ่มความน่าสนใจให้หน้าเว็บด้วยส่วนข้อเสนอและสิทธิพิเศษที่ชัดเจน'
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'เหมาะกับการทำแลนดิ้งเพจคอนเวิร์ตสูง',
    description: 'มี CTA เด่น ข้อความกระชับ และลำดับ section ที่ปิดการขายได้ดี'
  }
];

const CATEGORIES = [
  {
    title: 'บาคาร่าออนไลน์',
    description: 'หมวดหลักสำหรับผู้ที่ต้องการเข้าถึงประสบการณ์ใช้งานที่รวดเร็วและทันสมัย',
    accent: 'from-red-600 to-red-900'
  },
  {
    title: 'บาคาร่าเว็บตรง',
    description: 'ออกแบบข้อความและเลย์เอาต์ให้สื่อถึงความชัดเจนและความน่าเชื่อถือ',
    accent: 'from-amber-600 to-amber-900'
  },
  {
    title: 'คาสิโนสด',
    description: 'เสริมภาพลักษณ์ความตื่นเต้นด้วยการจัดวางแบบพรีเมียมและอ่านง่าย',
    accent: 'from-red-600 to-red-900'
  },
  {
    title: 'SA Gaming',
    description: 'ใส่เป็นหมวดหรือไฮไลต์คีย์เวิร์ด เพื่อรองรับการค้นหาที่เฉพาะเจาะจงมากขึ้น',
    accent: 'from-zinc-700 to-zinc-900'
  },
  {
    title: 'Sexy Baccarat',
    description: 'เหมาะสำหรับใช้เป็นคีย์เสริมใน section หมวดหมู่หรือ FAQ',
    accent: 'from-zinc-700 to-zinc-900'
  },
  {
    title: 'โปรโมชั่นสมาชิกใหม่',
    description: 'เพิ่มแรงจูงใจด้วยข้อความสั้น ชัด และปุ่ม CTA ที่เด่น',
    accent: 'from-amber-600 to-amber-900'
  }
];

const STEPS = [
  {
    number: '01',
    title: 'สมัครสมาชิก',
    description: 'กรอกข้อมูลเบื้องต้นเพื่อเริ่มต้นใช้งานได้อย่างรวดเร็ว'
  },
  {
    number: '02',
    title: 'เข้าสู่ระบบ',
    description: 'เข้าถึงเมนูหลัก โปรโมชัน และหมวดบาคาร่าออนไลน์ได้ทันที'
  },
  {
    number: '03',
    title: 'เริ่มต้นใช้งาน',
    description: 'เลือกหมวดที่ต้องการและใช้งานได้สะดวกบนทุกอุปกรณ์'
  }
];

const PROMOTIONS = [
  {
    badge: 'HOT',
    title: 'โปรโมชั่นสมาชิกใหม่',
    description: 'เริ่มต้นใช้งานกับข้อเสนอพิเศษที่ออกแบบมาเพื่อดึงดูดผู้สมัครใหม่',
    cta: 'รับสิทธิ์เลย'
  },
  {
    badge: 'DAILY',
    title: 'โปรโมชันอัปเดตรายวัน',
    description: 'เพิ่มความเคลื่อนไหวให้หน้าเว็บด้วยแบนเนอร์และข้อความที่สดใหม่',
    cta: 'ดูรายละเอียด'
  },
  {
    badge: 'VIP',
    title: 'สิทธิพิเศษสำหรับสมาชิก',
    description: 'ช่วยให้ภาพรวมของแพลตฟอร์มดูครบและมีความคุ้มค่ามากขึ้น',
    cta: 'ดูโปรโมชั่นทั้งหมด'
  }
];

const FAQS = [
  {
    question: 'สมัครบาคาร่าอย่างไร?',
    answer: 'สามารถกดปุ่มสมัครสมาชิกและกรอกข้อมูลตามขั้นตอนบนหน้าเว็บได้ทันที'
  },
  {
    question: 'Bocker168 รองรับมือถือหรือไม่?',
    answer: 'รองรับการใช้งานทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์อย่างเต็มรูปแบบ'
  },
  {
    question: 'หน้าเว็บนี้เน้นบาคาร่าเว็บตรงหรือไม่?',
    answer: 'ใช่ หน้าเว็บถูกออกแบบให้สื่อสารเรื่องบาคาร่าออนไลน์และบาคาร่าเว็บตรงอย่างชัดเจน'
  },
  {
    question: 'มีหมวดคาสิโนสดหรือคีย์เสริมอย่าง SA Gaming และ Sexy Baccarat หรือไม่?',
    answer: 'สามารถเพิ่มเป็นหมวดไฮไลต์หรือคีย์เวิร์ดเสริมในหน้าเว็บเพื่อช่วยเรื่อง SEO และการเข้าถึงคอนเทนต์ได้'
  },
  {
    question: 'มีโปรโมชันอัปเดตบ่อยแค่ไหน?',
    answer: 'สามารถออกแบบ section โปรโมชันให้เปลี่ยนข้อความหรือแบนเนอร์ได้อย่างยืดหยุ่น'
  },
  {
    question: 'ผู้ใช้ใหม่ใช้งานยากไหม?',
    answer: 'ไม่ยาก เพราะโครงสร้างหน้าเว็บเน้นเมนูชัด CTA เด่น และลำดับ section ที่เข้าใจง่าย'
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

const FAQItem = ({ faq, isOpen, onClick }: FAQItemProps) => (
  <div className="border-b border-zinc-800 last:border-0">
    <button 
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
    >
      <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-amber-500' : 'text-white group-hover:text-red-500'}`}>
        {faq.question}
      </span>
      {isOpen ? <ChevronUp className="text-amber-500" /> : <ChevronDown className="text-zinc-500" />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="pb-6 text-zinc-400 leading-relaxed">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = ({ onAccept, onManage }: { onAccept: () => void; onManage: () => void }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-6"
  >
    <div className="container mx-auto">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
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
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={onManage}
            className="flex-1 md:flex-none px-6 py-3 text-zinc-400 hover:text-white text-sm font-bold transition-colors"
          >
            ตั้งค่าคุกกี้
          </button>
          <button 
            onClick={onAccept}
            className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-900/40 transition-all active:scale-95"
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
                  <h4 className="text-white font-bold mb-1">คุกกี้ที่จำเป็น</h4>
                  <p className="text-zinc-500 text-xs">จำเป็นสำหรับการทำงานของเว็บไซต์</p>
                </div>
                <div className="w-12 h-6 bg-red-600 rounded-full relative opacity-50 cursor-not-allowed">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800">
                <div>
                  <h4 className="text-white font-bold mb-1">คุกกี้เพื่อการวิเคราะห์</h4>
                  <p className="text-zinc-500 text-xs">ช่วยให้เราเข้าใจการใช้งานเว็บไซต์</p>
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
                  <h4 className="text-white font-bold mb-1">คุกกี้เพื่อการตลาด</h4>
                  <p className="text-zinc-500 text-xs">เพื่อนำเสนอโปรโมชันที่ตรงใจคุณ</p>
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

export default function Bocker168Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: true,
    marketing: true
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
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAcceptAllCookies = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowCookieBanner(false);
  };

  const handleSaveCookieSettings = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...cookieSettings,
      timestamp: new Date().toISOString()
    }));
    setShowCookieSettings(false);
    setShowCookieBanner(false);
  };

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
      
      {/* Red Glow Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[120px] rounded-full" />
      </div>

      {/* --- Header --- */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/90 backdrop-blur-md py-3 border-b border-zinc-800' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20 group-hover:scale-110 transition-transform">
              <Crown className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              BOCKER<span className="text-red-600">168</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {MENU_ITEMS.map((item) => (
              <a 
                key={item.label} 
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-sm font-medium text-zinc-300 hover:text-amber-500 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="px-6 py-2 text-sm font-bold text-white hover:text-amber-500 transition-colors">
              เข้าสู่ระบบ
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold rounded-full shadow-lg shadow-red-900/40 transition-all active:scale-95">
              สมัครสมาชิก
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed inset-0 top-[60px] bg-black z-40 lg:hidden p-6 flex flex-col gap-6"
            >
              {MENU_ITEMS.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="text-xl font-bold text-white border-b border-zinc-800 pb-4"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-4 mt-4">
                <button className="w-full py-4 bg-zinc-900 text-white font-bold rounded-xl border border-zinc-800">
                  เข้าสู่ระบบ
                </button>
                <button className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-900/40">
                  สมัครสมาชิก
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- Hero Section --- */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/30 border border-red-900/50 text-red-500 text-xs font-bold uppercase tracking-widest mb-6">
                <Zap className="w-4 h-4 fill-current" />
                บาคาร่าเว็บตรงอันดับ 1
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
                Bocker168 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-red-600">บาคาร่าออนไลน์</span> ดีไซน์พรีเมียม ครบจบในที่เดียว
              </h1>
              <p className="text-lg text-zinc-400 mb-10 leading-relaxed max-w-xl">
                สัมผัสประสบการณ์ บาคาร่าเว็บตรง ที่ออกแบบมาให้ใช้งานลื่นไหล รองรับมือถือเต็มรูปแบบ พร้อมโครงสร้างหน้าเว็บที่ดูน่าเชื่อถือ เข้าถึงง่าย และเหมาะกับผู้ใช้งานยุคใหม่
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-900/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  สมัครบาคาร่า
                </button>
                <button className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-2xl border border-zinc-800 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-500" />
                  ดูโปรโมชั่น
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, text: 'บาคาร่าออนไลน์' },
                  { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, text: 'บาคาร่าเว็บตรง' },
                  { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, text: 'รองรับมือถือ' },
                  { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, text: 'ใช้งานได้ตลอดเวลา' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                    {badge.icon}
                    {badge.text}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full animate-pulse" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-red-600 to-red-900 p-6 rounded-3xl shadow-lg">
                      <Crown className="text-white w-10 h-10 mb-4" />
                      <div className="text-white font-black text-2xl">VIP CLUB</div>
                      <div className="text-red-200 text-xs">Premium Experience</div>
                    </div>
                    <div className="bg-zinc-800 p-6 rounded-3xl border border-zinc-700">
                      <TrendingUp className="text-amber-500 w-8 h-8 mb-2" />
                      <div className="text-white font-bold">Win Rate</div>
                      <div className="text-amber-500 text-2xl font-black">98.5%</div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-zinc-800 p-6 rounded-3xl border border-zinc-700">
                      <Smartphone className="text-red-500 w-8 h-8 mb-2" />
                      <div className="text-white font-bold">Mobile App</div>
                      <div className="text-zinc-400 text-xs">Ready for iOS & Android</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 rounded-3xl shadow-lg">
                      <Gem className="text-white w-10 h-10 mb-4" />
                      <div className="text-white font-black text-2xl">JACKPOT</div>
                      <div className="text-amber-100 text-xs">฿1,000,000+</div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-600/20 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-500/10 rounded-full blur-xl" />
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

      {/* --- Why Choose Section --- */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="ทำไมหลายคนเลือกใช้งานบาคาร่าออนไลน์กับ Bocker168"
            subtitle="Bocker168 ออกแบบหน้าเว็บโดยเน้นประสบการณ์ใช้งานจริง ทั้งความสวยงาม ความเร็ว และความสะดวกในการเข้าถึงหมวด บาคาร่าออนไลน์ บนทุกอุปกรณ์"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_CHOOSE.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-3xl hover:border-amber-500/50 transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-red-600/20 to-amber-600/20 rounded-2xl flex items-center justify-center mb-6 border border-red-900/30 group-hover:from-red-600 group-hover:to-amber-600 transition-all">
                  <div className="text-red-500 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Baccarat Categories --- */}
      <section id="categories" className="py-24 bg-zinc-950 relative">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="ครบทุกไฮไลต์ของบาคาร่าออนไลน์ในหน้าเดียว"
            subtitle="คัดหมวดสำคัญที่เกี่ยวกับบาคาร่าเพื่อให้ผู้ใช้เข้าถึงคอนเทนต์หลักได้ง่ายและตัดสินใจได้เร็วขึ้น"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-3xl group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="relative p-8 border border-zinc-800 h-full flex flex-col justify-between">
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
            ))}
          </div>
        </div>
      </section>

      {/* --- How To Start --- */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="เริ่มต้นใช้งานบาคาร่าออนไลน์กับ Bocker168 ใน 3 ขั้นตอน"
          />

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-zinc-800 to-transparent -translate-y-1/2 z-0" />
            
            {STEPS.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-zinc-900 border-4 border-zinc-800 rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:border-red-600 transition-all">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-amber-500">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-zinc-500 max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Promotions Section --- */}
      <section id="promotions" className="py-24 relative">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="โปรโมชั่นที่ช่วยเพิ่มความน่าสนใจให้หน้าเว็บบาคาร่าออนไลน์"
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
                  <Gift className="w-20 h-20 text-red-600/20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 px-4 py-1 bg-red-600 text-white text-xs font-black rounded-full shadow-lg">
                    {promo.badge}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{promo.title}</h3>
                  <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                    {promo.description}
                  </p>
                  <button className="w-full py-4 bg-zinc-800 hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                    {promo.cta} <Zap className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="text-amber-500 font-bold hover:underline underline-offset-8">
              ดูโปรโมชั่นทั้งหมด
            </button>
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
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

      {/* --- Final CTA Section --- */}
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
                พร้อมเริ่มต้นกับ Bocker168 บาคาร่าออนไลน์ <br className="hidden md:block" /> ที่ดูพรีเมียมกว่าและใช้งานง่ายกว่า
              </h2>
              <p className="text-red-100 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                ยกระดับแลนดิ้งเพจของคุณด้วยดีไซน์แดง ทอง ดำ ที่โดดเด่น พร้อมข้อความขายที่เน้น บาคาร่าออนไลน์, บาคาร่าเว็บตรง และคีย์เวิร์ดสำคัญอย่างเป็นธรรมชาติ
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button className="px-10 py-5 bg-white text-red-600 font-black text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95">
                  สมัครสมาชิกตอนนี้
                </button>
                <button className="px-10 py-5 bg-black/20 backdrop-blur-sm border border-white/30 text-white font-black text-xl rounded-2xl hover:bg-black/30 transition-all active:scale-95">
                  ดูรายละเอียดเพิ่มเติม
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer id="footer" className="bg-[#050505] pt-24 pb-12 relative z-10 overflow-hidden">
        {/* Metallic Gold Border Top */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8">
              <a href="#home" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20 group-hover:scale-110 transition-transform">
                  <Crown className="text-white w-7 h-7" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">
                  BOCKER<span className="text-red-600">168</span>
                </span>
              </a>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                แพลตฟอร์มหน้าเว็บสไตล์พรีเมียมที่ออกแบบมาเพื่อเน้น บาคาร่าออนไลน์ ให้ดูโดดเด่น ใช้งานง่าย และปิดการขายได้ชัดเจนยิ่งขึ้น
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <MessageCircle className="w-5 h-5" />, href: "#" },
                  { icon: <Send className="w-5 h-5" />, href: "#" },
                  { icon: <Mail className="w-5 h-5" />, href: "#" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    className="w-12 h-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-amber-500 hover:border-amber-500/50 hover:bg-zinc-900 transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-black text-lg mb-8 tracking-tight uppercase">ลิงก์ด่วน</h4>
              <ul className="space-y-5">
                {MENU_ITEMS.map((item) => (
                  <li key={item.label}>
                    <a 
                      href={item.href} 
                      onClick={(e) => scrollToSection(e, item.href)}
                      className="text-zinc-500 hover:text-red-500 transition-all text-sm font-semibold flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-lg mb-8 tracking-tight uppercase">คีย์เวิร์ดยอดนิยม</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  'บาคาร่า', 'บาคาร่าออนไลน์', 'บาคาร่าเว็บตรง', 'สมัครบาคาร่า', 
                  'ฝากถอนออโต้', 'ไม่มีขั้นต่ำ', 'คาสิโนสด', 'SA Gaming', 'Sexy Baccarat'
                ].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-zinc-900/50 text-zinc-400 text-xs font-bold rounded-xl border border-zinc-800 hover:border-red-600/50 hover:text-white transition-all cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-black text-lg mb-8 tracking-tight uppercase">ติดต่อเรา</h4>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-zinc-400 text-sm font-medium group cursor-pointer">
                  <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span>Line: @bocker168</span>
                </li>
                <li className="flex items-center gap-4 text-zinc-400 text-sm font-medium group cursor-pointer">
                  <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Send className="w-5 h-5" />
                  </div>
                  <span>Telegram: @bocker168</span>
                </li>
                <li className="flex items-center gap-4 text-zinc-400 text-sm font-medium group cursor-pointer">
                  <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>Email: support@bocker168.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase">
              © 2026 Bocker168. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-zinc-500 text-xs bg-zinc-900/30 px-6 py-3 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span className="font-bold">สำหรับผู้มีอายุ 18 ปีขึ้นไป กรุณาใช้งานอย่างมีความรับผิดชอบ</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40">
        <button className="w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center animate-bounce">
          <PlayCircle className="w-8 h-8" />
        </button>
      </div>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <CookieConsent 
            onAccept={handleAcceptAllCookies} 
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

    </div>
  );
}
