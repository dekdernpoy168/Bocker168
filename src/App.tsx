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
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Data ---

const MENU_ITEMS = [
  { label: 'หน้าแรก', path: '/' },
  { label: 'จุดเด่น', path: '/features' },
  { label: 'บาคาร่าออนไลน์', path: '/baccarat' },
  { label: 'โปรโมชั่น', path: '/promotions' },
  { label: 'บทความ', path: '/articles' },
  { label: 'คำถามที่พบบ่อย', path: '/faq' },
  { label: 'ติดต่อเรา', path: '/contact' },
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
    image: 'https://img2.pic.in.th/55-Sexy-Baccarat-Bocker168-1.png'
  },
  {
    title: 'SA Gaming',
    description: 'ค่ายคาสิโนระดับตำนาน มาตรฐานสากล มั่นคงที่สุด ภาพคมชัดระดับ Full HD',
    accent: 'from-amber-600 to-amber-900',
    image: 'https://img1.pic.in.th/images/SA-Gaming-Bocker168.webp'
  },
  {
    title: 'Dream Gaming',
    description: 'บาคาร่าสดพร้อมฟีเจอร์แชทพูดคุยกับผู้เล่นอื่นได้ เพิ่มอรรถรสในการเดิมพัน',
    accent: 'from-red-600 to-red-900',
    image: 'https://img1.pic.in.th/images/Dream-Gaming-Bocker168.webp'
  },
  {
    title: 'Pretty Gaming',
    description: 'สัมผัสประสบการณ์วีไอพีกับดีลเลอร์สาวพริตตี้ระดับท็อป บริการระดับพรีเมียม',
    accent: 'from-zinc-700 to-zinc-900',
    image: 'https://img1.pic.in.th/images/Pretty-Gaming-Bocker168.webp'
  },
  {
    title: 'Asia Gaming',
    description: 'คาสิโนสดสไตล์เอเชีย รูปแบบการเล่นเข้าใจง่าย เหมาะกับนักเดิมพันทุกระดับ',
    accent: 'from-zinc-700 to-zinc-900',
    image: 'https://img2.pic.in.th/Asia-Gaming-Bocker168.png'
  },
  {
    title: 'Evolution Gaming',
    description: 'พรีเมียมคาสิโนจากยุโรป มุมกล้องหลากหลายสมจริง เหมือนนั่งอยู่ในคาสิโนจริง',
    accent: 'from-amber-600 to-amber-900',
    image: 'https://img1.pic.in.th/images/Evolution-Gaming-Bocker168.webp'
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

const ARTICLES = [
  {
    slug: 'baccarat-formula-2026',
    title: 'สูตรบาคาร่า 2026 อ่านเค้าไพ่ยังไงให้ได้กำไรทุกวัน',
    description: 'เจาะลึกเทคนิคการอ่านเค้าไพ่บาคาร่าที่แม่นยำที่สุดในปี 2026 พร้อมวิธีเดินเงินให้ได้กำไรชัวร์ๆ',
    content: `
      <h2>สูตรบาคาร่า 2026: เจาะลึกเทคนิคการอ่านเค้าไพ่</h2>
      <p>การเล่นบาคาร่าให้ได้กำไรอย่างยั่งยืน ไม่ใช่เรื่องของการพึ่งพาดวงเพียงอย่างเดียว แต่ต้องอาศัยการอ่าน "เค้าไพ่" และการบริหารเงินทุนที่ดี ในปี 2026 นี้ มีเทคนิคใหม่ๆ ที่ได้รับการพิสูจน์แล้วว่าสามารถเพิ่มโอกาสชนะได้อย่างมาก</p>
      
      <h3>1. เค้าไพ่มังกร (Dragon)</h3>
      <p>เค้าไพ่มังกรคือการที่ผลลัพธ์ออกฝั่งใดฝั่งหนึ่งติดต่อกันยาวๆ (เช่น แดง แดง แดง แดง) เมื่อเจอเค้าไพ่นี้ ให้ตามไปเรื่อยๆ จนกว่าไพ่จะเปลี่ยนฝั่ง อย่าเพิ่งรีบสวนเด็ดขาด</p>
      
      <h3>2. เค้าไพ่ปิงปอง (Ping Pong)</h3>
      <p>เค้าไพ่ปิงปองคือการที่ผลลัพธ์สลับกันไปมา (เช่น แดง น้ำเงิน แดง น้ำเงิน) หากสังเกตเห็นรูปแบบนี้ ให้แทงสลับตามไปเรื่อยๆ เป็นอีกหนึ่งเค้าไพ่ที่ทำกำไรได้ดี</p>
      
      <h3>3. การเดินเงินแบบ Martingale</h3>
      <p>เทคนิคการเดินเงินแบบทบยอดเมื่อเสีย (เช่น 100, 200, 400, 800) วิธีนี้จะช่วยให้คุณได้ทุนคืนและกำไร 1 หน่วยเสมอเมื่อชนะ แต่ต้องระวังเรื่องลิมิตโต๊ะและทุนที่มีจำกัด</p>
      
      <p><strong>ข้อควรระวัง:</strong> ไม่มีสูตรใดในโลกที่การันตีผล 100% การเล่นอย่างมีสติและรู้จังหวะเลิกคือหัวใจสำคัญที่สุดในการทำกำไรจากบาคาร่าออนไลน์</p>
    `,
    image: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?auto=format&fit=crop&q=80&w=800',
    date: '29 มี.ค. 2026',
    category: 'สูตรบาคาร่า'
  },
  {
    slug: 'direct-web-vs-agent',
    title: 'บาคาร่าเว็บตรง vs เว็บเอเย่นต์ ต่างกันอย่างไร?',
    description: 'ทำไมถึงควรเล่นบาคาร่ากับเว็บตรงไม่ผ่านเอเย่นต์ ข้อดีและข้อเสียที่คุณต้องรู้ก่อนตัดสินใจลงทุน',
    content: `
      <h2>บาคาร่าเว็บตรง vs เว็บเอเย่นต์: เลือกเล่นแบบไหนดีกว่ากัน?</h2>
      <p>ในวงการคาสิโนออนไลน์ คำว่า "เว็บตรง" และ "เว็บเอเย่นต์" เป็นคำที่ได้ยินบ่อยมาก แต่หลายคนอาจยังไม่เข้าใจถึงความแตกต่างที่แท้จริง บทความนี้จะมาไขข้อข้องใจให้คุณ</p>
      
      <h3>เว็บตรง (Direct Website)</h3>
      <p>เว็บตรงคือเว็บไซต์ที่ให้บริการโดยตรงจากบริษัทแม่หรือค่ายเกม ไม่ผ่านตัวแทนใดๆ</p>
      <ul>
        <li><strong>ข้อดี:</strong> มีความมั่นคงทางการเงินสูงมาก จ่ายจริงทุกยอด ไม่มีการอั้นถอน ระบบฝาก-ถอนมักจะเป็นระบบออโต้ที่รวดเร็ว และมีโปรโมชั่นที่คุ้มค่ากว่า</li>
        <li><strong>ข้อเสีย:</strong> อาจมีเงื่อนไขการสมัครหรือการยืนยันตัวตนที่เข้มงวดกว่าเล็กน้อยเพื่อความปลอดภัย</li>
      </ul>
      
      <h3>เว็บเอเย่นต์ (Agent Website)</h3>
      <p>เว็บเอเย่นต์คือเว็บไซต์ที่เปิดโดยบุคคลที่สามที่ไปรับสิทธิ์ (Franchise) มาจากเว็บใหญ่อีกที</p>
      <ul>
        <li><strong>ข้อดี:</strong> สมัครง่าย บางครั้งอาจมีโปรโมชั่นดึงดูดใจในช่วงแรก</li>
        <li><strong>ข้อเสีย:</strong> มีความเสี่ยงสูงที่จะถูกโกงหรือปิดเว็บหนี หากเล่นได้ยอดใหญ่ๆ อาจโดนอั้นถอน หรือถอนไม่ได้เลย ระบบฝาก-ถอนมักจะช้าเพราะต้องทำผ่านคนกลาง</li>
      </ul>
      
      <p><strong>สรุป:</strong> การเลือกเล่นกับ "เว็บตรง" อย่าง Bocker168 เป็นทางเลือกที่ปลอดภัยและคุ้มค่าที่สุดในระยะยาว เพื่อให้คุณมั่นใจได้ว่าทุกการเดิมพันของคุณจะได้รับผลตอบแทนอย่างแน่นอน</p>
    `,
    image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=800',
    date: '28 มี.ค. 2026',
    category: 'ความรู้ทั่วไป'
  },
  {
    slug: 'bankroll-management',
    title: 'วิธีจัดการเงินทุน (Bankroll Management) สำหรับมือใหม่',
    description: 'เทคนิคการบริหารเงินทุนในการเล่นคาสิโนออนไลน์ เล่นอย่างไรไม่ให้หมดตัวและมีกำไรยั่งยืน',
    content: `
      <h2>การจัดการเงินทุน (Bankroll Management): กุญแจสู่ความสำเร็จในบาคาร่า</h2>
      <p>หลายคนมักจะโฟกัสไปที่สูตรหรือเทคนิคการเล่น แต่ลืมไปว่า "การจัดการเงินทุน" คือสิ่งที่สำคัญที่สุดที่จะทำให้คุณอยู่รอดและทำกำไรในระยะยาวได้</p>
      
      <h3>1. กำหนดงบประมาณ (Bankroll)</h3>
      <p>ก่อนเริ่มเล่น คุณต้องกำหนดจำนวนเงินที่คุณสามารถเสียได้โดยไม่เดือดร้อน (เช่น 5,000 บาท) เงินก้อนนี้คือ Bankroll ของคุณ ห้ามนำเงินร้อนหรือเงินที่ต้องใช้จ่ายในชีวิตประจำวันมาเล่นเด็ดขาด</p>
      
      <h3>2. แบ่งเงินเดิมพันเป็นหน่วย (Units)</h3>
      <p>ไม่ควรเดิมพันเงินทั้งหมดในตาเดียว แนะนำให้แบ่ง Bankroll ออกเป็นหน่วยย่อยๆ เช่น 1% - 5% ของทุนทั้งหมด (หากทุน 5,000 บาท 1 หน่วย = 50 บาท) การทำเช่นนี้จะช่วยลดความเสี่ยงในการหมดตัวอย่างรวดเร็ว</p>
      
      <h3>3. ตั้งเป้าหมายกำไรและจุดตัดขาดทุน (Stop Loss / Take Profit)</h3>
      <p>ก่อนเล่นทุกครั้ง ต้องตั้งเป้าหมายให้ชัดเจน เช่น วันนี้ต้องการกำไร 20% ของทุน (1,000 บาท) หากเล่นได้ถึงเป้าแล้วให้หยุดทันที ในขณะเดียวกัน ก็ต้องตั้งจุดตัดขาดทุนไว้ด้วย เช่น ยอมเสียได้สูงสุด 30% ของทุน หากเสียถึงจุดนี้ก็ต้องหยุดเช่นกัน</p>
      
      <h3>4. อย่าหัวร้อน (Don't Tilt)</h3>
      <p>เมื่อเสียเงินติดต่อกัน หลายคนมักจะขาดสติและเพิ่มเงินเดิมพันเพื่อหวังจะได้ทุนคืนอย่างรวดเร็ว ซึ่งเป็นวิธีที่ผิดและมักจะนำไปสู่การหมดตัว ให้ยึดมั่นในแผนการเดินเงินของคุณอย่างเคร่งครัด</p>
    `,
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800',
    date: '27 มี.ค. 2026',
    category: 'เทคนิคการเล่น'
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

const FAQItem = ({ faq, isOpen, onClick }: FAQItemProps) => (
  <div className="border-b border-zinc-800 last:border-0">
    <button 
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
    >
      <h3 className={`text-lg font-medium transition-colors ${isOpen ? 'text-amber-500' : 'text-white group-hover:text-red-500'}`}>
        {faq.question}
      </h3>
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
              <button className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-900/40 transition-all active:scale-95 flex items-center justify-center gap-2">
                {promo.cta} <Zap className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [selectedPromo, setSelectedPromo] = useState<null | typeof PROMOTIONS[0]>(null);
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

  const isHome = location.pathname === '/';
  const isFeatures = location.pathname === '/features';
  const isBaccarat = location.pathname === '/baccarat';
  const isPromotions = location.pathname === '/promotions';
  const isArticles = location.pathname === '/articles';
  const isFaq = location.pathname === '/faq';
  const isContact = location.pathname === '/contact';
  
  const isArticleDetail = location.pathname.startsWith('/article/');
  const articleSlug = isArticleDetail ? decodeURIComponent(location.pathname.split('/article/')[1]) : null;
  const currentArticle = articleSlug ? ARTICLES.find(a => (a.slug || a.title.replace(/\s+/g, '-').toLowerCase()) === articleSlug) : null;

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
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="https://img2.pic.in.th/A2-Logo-Bocker-168.png" 
              alt="Bocker168 Logo" 
              className="h-16 md:h-20 w-auto group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {MENU_ITEMS.map((item) => (
              <Link 
                key={item.label} 
                to={item.path}
                className="text-sm font-medium text-zinc-300 hover:text-amber-500 transition-colors"
              >
                {item.label}
              </Link>
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
                <Link 
                  key={item.label} 
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-bold text-white border-b border-zinc-800 pb-4"
                >
                  {item.label}
                </Link>
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

      <main className={!isHome ? "pt-24" : ""}>
      
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
                  <div className="h-64 md:h-96 overflow-hidden relative">
                    <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full">
                      {currentArticle.category}
                    </div>
                    <img 
                      src={currentArticle.image} 
                      alt={currentArticle.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80" />
                  </div>
                  
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-6">
                      <Calendar className="w-5 h-5" />
                      <span>{currentArticle.date}</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight">
                      {currentArticle.title}
                    </h1>
                    
                    <div 
                      className="max-w-none [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:text-white [&>h2]:mt-8 [&>p]:text-zinc-300 [&>p]:mb-6 [&>p]:leading-relaxed [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:text-white [&>h3]:mt-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:text-zinc-300 [&>ul>li]:mb-2 [&>strong]:text-white"
                      dangerouslySetInnerHTML={{ __html: currentArticle.content || currentArticle.description }}
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

      {/* --- Hero Section --- */}
      {isHome && (
        <>
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
                บาคาร่าออนไลน์ Bocker168 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-red-600">เว็บตรงไม่ผ่านเอเย่นต์</span> ฝากถอนไม่มีขั้นต่ำ
              </h1>
              
              <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-red-900/20 max-w-xl relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                <img 
                  src="https://img1.pic.in.th/images/Online-Baccarat-Bocker168.jpg" 
                  alt="บาคาร่าออนไลน์ Bocker168" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-lg text-zinc-400 mb-10 leading-relaxed max-w-xl">
                เล่นบาคาร่ากับเว็บตรงอันดับ 1 มั่นคง ปลอดภัย ได้เงินจริง สัมผัสประสบการณ์คาสิโนสดระดับพรีเมียม รองรับทุกระบบมือถือ พร้อมโปรโมชั่นสมาชิกใหม่จัดเต็ม
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
                  { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, text: 'ฝากถอนออโต้' },
                  { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, text: 'บริการ 24 ชม.' },
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
              <div className="relative bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden">
                {/* Glowing border effect */}
                <div className="absolute inset-0 border-2 border-transparent rounded-[2.5rem] bg-gradient-to-br from-red-600/30 via-transparent to-amber-500/30 [mask-image:linear-gradient(white,white)] pointer-events-none" style={{ WebkitMaskComposite: 'destination-out', maskComposite: 'exclude' }} />
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white font-bold tracking-widest uppercase text-sm">Live Stats</span>
                  </div>
                  <div className="bg-zinc-800/80 px-4 py-1.5 rounded-full border border-zinc-700 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-500 font-mono font-bold">00:{countdown.toString().padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Win Rates */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">PLAYER 45%</span>
                    <span className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">TIE 10%</span>
                    <span className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">BANKER 45%</span>
                  </div>
                  <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-blue-500 w-[45%] shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <div className="h-full bg-green-500 w-[10%] shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                    <div className="h-full bg-red-500 w-[45%] shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  </div>
                </div>

                {/* Recent Outcomes */}
                <div className="mb-8">
                  <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Recent Outcomes</div>
                  <div className="flex gap-2 justify-between">
                    {['B', 'P', 'B', 'B', 'T', 'P', 'B', 'P', 'P', 'B'].map((outcome, i) => (
                      <div 
                        key={i} 
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg
                          ${outcome === 'B' ? 'bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_0_10px_rgba(220,38,38,0.6)]' : 
                            outcome === 'P' ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_0_10px_rgba(37,99,235,0.6)]' : 
                            'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-[0_0_10px_rgba(22,163,74,0.6)]'}`}
                      >
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 hover:border-amber-500/50 transition-colors group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Crown className="text-amber-500 w-6 h-6 mb-2 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <div className="text-white font-bold text-sm relative z-10">VIP Tables</div>
                    <div className="text-zinc-500 text-xs relative z-10">High limits available</div>
                  </div>
                  <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 hover:border-red-500/50 transition-colors group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <TrendingUp className="text-red-500 w-6 h-6 mb-2 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <div className="text-white font-bold text-sm relative z-10">Fast Payouts</div>
                    <div className="text-zinc-500 text-xs relative z-10">Under 10 seconds</div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {WHY_CHOOSE.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-12 rounded-[4rem] hover:border-amber-500/50 transition-all group flex flex-col items-center text-center ${i === 4 ? 'md:col-span-2 md:max-w-2xl md:mx-auto' : ''}`}
              >
                <div className="relative mb-10 group-hover:scale-105 transition-transform duration-500 w-full flex justify-center">
                  <div className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full max-w-[500px] h-auto aspect-square object-contain relative z-10 drop-shadow-[0_0_30px_rgba(0,0,0,0.7)]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">{feature.title}</h3>
                <p className="text-zinc-400 text-xl leading-relaxed max-w-md">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* --- Baccarat Categories --- */}
      {(isHome || isBaccarat) && (
      <>
      <section id="categories" className="py-24 bg-zinc-950 relative">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="รวมค่ายบาคาร่าออนไลน์ชั้นนำระดับโลก"
            subtitle="เลือกเล่นคาสิโนสดจากค่ายดัง ภาพคมชัดระดับ Full HD ส่งตรงจากคาสิโนจริง"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-3xl group cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors flex flex-col"
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
            ))}
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {ARTICLES.map((article, index) => (
              <motion.div
                key={index}
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
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
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
                      {article.description}
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
                <button className="px-10 py-5 bg-white text-red-600 font-black text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95">
                  สมัครสมาชิกตอนนี้
                </button>
                <button className="px-10 py-5 bg-black/20 backdrop-blur-sm border border-white/30 text-white font-black text-xl rounded-2xl hover:bg-black/30 transition-all active:scale-95">
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
      <footer id="footer" className="bg-[#050505] pt-24 pb-12 relative z-10 overflow-hidden">
        {/* Metallic Gold Border Top */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
            <div className="space-y-8 lg:col-span-4">
              <Link to="/" className="flex items-center gap-3 group">
                <img 
                  src="https://img2.pic.in.th/A2-Logo-Bocker-168.png" 
                  alt="Bocker168 Logo" 
                  className="h-24 md:h-32 w-auto group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                เว็บตรงบาคาร่าออนไลน์อันดับ 1 มั่นคง ปลอดภัย ให้บริการคาสิโนสดจากค่ายชั้นนำระดับโลก พร้อมระบบฝากถอนออโต้ 24 ชั่วโมง
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  'บาคาร่าออนไลน์', 'บาคาร่าเว็บตรง', 'สมัครบาคาร่า', 'บาคาร่าทรูวอเลท', 
                  'สูตรบาคาร่า', 'ทดลองเล่นบาคาร่า', 'เว็บบาคาร่าอันดับ1', 'คาสิโนสด', 'SA Gaming', 'Sexy Baccarat'
                ].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-zinc-900/50 text-zinc-400 text-xs font-bold rounded-xl border border-zinc-800 hover:border-red-600/50 hover:text-white transition-all cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-white font-black text-lg mb-8 tracking-tight uppercase">เกี่ยวกับเรา</h4>
              <ul className="space-y-5">
                {[
                  { label: 'หน้าแรก', path: '/' },
                  { label: 'จุดเด่น', path: '/features' },
                  { label: 'บาคาร่าออนไลน์', path: '/baccarat' },
                  { label: 'โปรโมชั่น', path: '/promotions' },
                  { label: 'บทความ', path: '/articles' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.path} 
                      className="text-zinc-500 hover:text-red-500 transition-all text-sm font-semibold flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-white font-black text-lg mb-8 tracking-tight uppercase">ช่วยเหลือ</h4>
              <ul className="space-y-5">
                {[
                  { label: 'คำถามที่พบบ่อย', path: '/faq' },
                  { label: 'ติดต่อเรา', path: '/contact' },
                  { label: 'วิธีสมัครสมาชิก', path: '#' },
                  { label: 'วิธีฝาก-ถอน', path: '#' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.path} 
                      className="text-zinc-500 hover:text-red-500 transition-all text-sm font-semibold flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-white font-black text-lg mb-8 tracking-tight uppercase">ข้อกำหนด</h4>
              <ul className="space-y-5">
                {[
                  { label: 'ข้อตกลงและเงื่อนไข', path: '#' },
                  { label: 'นโยบายความเป็นส่วนตัว', path: '#' },
                  { label: 'นโยบายคุกกี้', path: '#' },
                  { label: 'ความรับผิดชอบต่อสังคม', path: '#' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.path} 
                      className="text-zinc-500 hover:text-red-500 transition-all text-sm font-semibold flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
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
