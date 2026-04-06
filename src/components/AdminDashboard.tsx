import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, FileText, Target, Upload,
  Type as TypeIcon, Link as LinkIcon, Search, Folder, Tag,
  Image as ImageIcon, Calendar, Edit3, Eye, Check, Wand2,
  LayoutTemplate, Code, Database, Sparkles
} from 'lucide-react';
import { Article } from '../types';
import AIPromptModal from './AIPromptModal';
import { generateAIContent } from '../lib/aiService';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface AdminDashboardProps {
  onClose?: () => void;
  onSaveSuccess?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onSaveSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isAIPromptOpen, setIsAIPromptOpen] = useState(false);
  const [aiPromptInitialTopic, setAiPromptInitialTopic] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [slugOptions, setSlugOptions] = useState<string[]>([]);
  const [isSlugModalOpen, setIsSlugModalOpen] = useState(false);
  const [isSEOModalOpen, setIsSEOModalOpen] = useState(false);
  const [seoPrimaryKeyword, setSeoPrimaryKeyword] = useState('');
  const [seoTopic, setSeoTopic] = useState('');
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
  const [excerptOptions, setExcerptOptions] = useState<string[]>([]);
  const [isExcerptModalOpen, setIsExcerptModalOpen] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Article; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const [editorMode, setEditorMode] = useState<'visual' | 'text'>('visual');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [articles, setArticles] = useState<Article[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [dbConfig, setDbConfig] = useState<{ d1Configured: boolean, fallbackMode: boolean }>({ d1Configured: true, fallbackMode: false });
  const categories = ['บาคาร่า', 'คาสิโน', 'สูตรสล็อต'];

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles();
      fetchConfigStatus();
    }
  }, [isAuthenticated]);

  const fetchConfigStatus = async () => {
    try {
      const response = await fetch('/api/config-status');
      if (response.ok) {
        const data: any = await response.json();
        setDbConfig(data);
      }
    } catch (error) {
      console.error('Error fetching config status:', error);
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/articles?t=${Date.now()}`);
      if (response.ok) {
        const data: any = await response.json();
        setArticles(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch articles in AdminDashboard. Status:', response.status, 'Response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching articles in AdminDashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initDatabase = async () => {
    if (!window.confirm('ต้องการสร้างตารางใน D1 Database ใช่หรือไม่?')) return;
    try {
      const response = await fetch('/api/init-db', { method: 'POST' });
      const data: any = await response.json();
      if (data.success) {
        alert('สร้างตารางสำเร็จ!');
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      console.error('Error initializing DB:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const handleSort = (key: keyof Article) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredArticles = articles
    .filter(article => {
      const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            article.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // รหัสผ่านจำลองสำหรับเข้าสู่ระบบ (Hardcoded)
    if (username === 'admin' && password === 'Bankk2599++') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleSave = async (e: React.FormEvent, status: 'published' | 'draft') => {
    e.preventDefault();
    
    if (!currentArticle.title || !currentArticle.content) {
      alert('กรุณากรอกหัวข้อและเนื้อหาบทความ');
      return;
    }

    const newArticle: Article = {
      id: currentArticle.id || Date.now().toString(),
      title: currentArticle.title || '',
      slug: currentArticle.slug || currentArticle.title?.toLowerCase().replace(/\s+/g, '-') || '',
      content: currentArticle.content || '',
      excerpt: currentArticle.excerpt || '',
      category: currentArticle.category || categories[0],
      image: currentArticle.image || '',
      status: status,
      author: currentArticle.author || 'Admin',
      date: currentArticle.date || new Date().toISOString().split('T')[0],
      metaTitle: currentArticle.metaTitle || '',
      metaDescription: currentArticle.metaDescription || '',
      metaKeywords: currentArticle.metaKeywords || '',
    };

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });
      
      if (response.ok) {
        fetchArticles();
        if (onSaveSuccess) onSaveSuccess();
        setIsEditing(false);
        setCurrentArticle({});
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const err: any = await response.json();
          alert('บันทึกไม่สำเร็จ: ' + (err.error || 'Unknown error'));
        } else {
          const text = await response.text();
          console.error('Server error response:', text);
          alert('บันทึกไม่สำเร็จ: เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ (Server Error)');
        }
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("ยืนยันการลบตัวเลือกนี้?")) return;
    try {
      const response = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchArticles();
        if (onSaveSuccess) onSaveSuccess();
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleGenerateContent = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const finalPrompt = aiPrompt + "\n\nIMPORTANT: You MUST format your response entirely in HTML. Use <p> for paragraphs, <h2> and <h3> for headings, <strong> for bold text, and <ul>/<li> for lists. Do NOT use Markdown. Do NOT wrap the response in ```html code blocks, just return the raw HTML.";
      
      const text = await generateAIContent(finalPrompt);
      
      let newText = text || '';
      // Remove markdown code blocks if AI still adds them
      newText = newText.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
      
      setCurrentArticle(prev => ({
        ...prev,
        content: (prev.content || '') + '\n\n' + newText
      }));
    } catch (error) {
      console.error('Error generating content:', error);
      alert('เกิดข้อผิดพลาดในการสร้างเนื้อหา กรุณาตรวจสอบการตั้งค่า API');
    } finally {
      setIsGenerating(false);
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = currentArticle.content || '';
    
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    
    setCurrentArticle({ ...currentArticle, content: newText });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const handleGenerateSlug = async () => {
    if (!currentArticle.title?.trim()) {
      alert('กรุณาใส่หัวข้อบทความ (Title) ก่อนสร้าง Slug');
      return;
    }
    
    setIsGeneratingSlug(true);
    try {
      const prompt = `Generate 3 short, SEO-friendly URL slugs for the following article.
      Title: "${currentArticle.title}"
      Content: "${currentArticle.content?.substring(0, 1000) || ''}"
      
      Return ONLY a valid JSON array of 3 strings. 
      The slugs should be in English (translate if necessary), lowercase, and use hyphens for spaces. 
      Example: ["slug-option-1", "slug-option-2", "slug-option-3"]`;
      
      const text = await generateAIContent(prompt);
      
      const jsonMatch = text.match(/\[.*\]/s);
      let options: string[] = [];
      
      if (jsonMatch) {
        try {
          options = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Failed to parse JSON", e);
        }
      }
      
      if (!options.length) {
        // Fallback parsing
        options = text.split('\n').map(line => line.replace(/^[-\d.\s*"'\[\]]+/, '').replace(/["',\]]+$/, '').trim()).filter(Boolean).slice(0, 3);
      }
      
      if (options.length > 0) {
        setSlugOptions(options);
        setIsSlugModalOpen(true);
      } else {
        alert('ไม่สามารถสร้าง Slug ได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Error generating slug:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง Slug กรุณาตรวจสอบการตั้งค่า API');
    } finally {
      setIsGeneratingSlug(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!seoTopic.trim()) {
      alert('กรุณาใส่หัวข้อบทความ');
      return;
    }
    
    setIsGeneratingSEO(true);
    try {
      const prompt = `Generate SEO tags for an article. 
      Title: "${currentArticle.title || seoTopic}"
      Primary Keyword: "${seoPrimaryKeyword || ''}"
      Existing Keywords: "${currentArticle.metaKeywords || ''}"
      Article Content: "${currentArticle.content?.substring(0, 2000) || ''}"
      
      Return ONLY a valid JSON object with three keys: 
      1. "metaTitle" (max 60 characters, engaging, includes keyword)
      2. "metaDescription" (max 160 characters, call to action, includes keyword)
      3. "metaKeywords" (comma-separated list of 5-10 relevant keywords)
      
      The language should be Thai.
      Example: {"metaTitle": "Title here", "metaDescription": "Description here", "metaKeywords": "keyword1, keyword2"}`;
      
      const text = await generateAIContent(prompt);
      
      const jsonMatch = text.match(/\{.*\}/s);
      
      if (jsonMatch) {
        try {
          const seoData = JSON.parse(jsonMatch[0]);
          setCurrentArticle(prev => ({
            ...prev,
            metaTitle: seoData.metaTitle || prev.metaTitle,
            metaDescription: seoData.metaDescription || prev.metaDescription,
            metaKeywords: seoData.metaKeywords || prev.metaKeywords
          }));
          setIsSEOModalOpen(false);
        } catch (e) {
          console.error("Failed to parse JSON", e);
          alert('ไม่สามารถสร้าง SEO Tags ได้ กรุณาลองใหม่อีกครั้ง');
        }
      } else {
        alert('ไม่สามารถสร้าง SEO Tags ได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Error generating SEO tags:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง SEO Tags กรุณาตรวจสอบการตั้งค่า API');
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const handleGenerateExcerpt = async () => {
    if (!currentArticle.title) {
      alert('กรุณากรอกหัวข้อบทความ (Title) ก่อนสร้างคำโปรย');
      return;
    }
    
    setIsGeneratingExcerpt(true);
    try {
      const prompt = `Generate 3 short, engaging excerpts (คำโปรย) in Thai for the following article.
      Title: "${currentArticle.title}"
      Content: "${currentArticle.content?.substring(0, 1500) || ''}"
      
      Each excerpt should be 1-2 sentences long.
      Return ONLY a JSON array of strings.
      Example: ["Excerpt 1", "Excerpt 2", "Excerpt 3"]`;
      
      const text = await generateAIContent(prompt);
      
      const jsonMatch = text.match(/\[.*\]/s);
      
      if (jsonMatch) {
        try {
          const options = JSON.parse(jsonMatch[0]);
          if (Array.isArray(options) && options.length > 0) {
            setExcerptOptions(options.slice(0, 3));
            setIsExcerptModalOpen(true);
          } else {
            throw new Error("Invalid format");
          }
        } catch (e) {
          console.error("Failed to parse JSON", e);
          alert('ไม่สามารถสร้างคำโปรยได้ กรุณาลองใหม่อีกครั้ง');
        }
      } else {
        alert('ไม่สามารถสร้างคำโปรยได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Error generating excerpt:', error);
      alert('เกิดข้อผิดพลาดในการสร้างคำโปรย กรุณาตรวจสอบการตั้งค่า API');
    } finally {
      setIsGeneratingExcerpt(false);
    }
  };

  const handleGenerateKeywords = async () => {
    if (!currentArticle.title) {
      alert('กรุณากรอกหัวข้อบทความ (Title) ก่อนสร้าง Keywords');
      return;
    }
    
    setIsGeneratingKeywords(true);
    try {
      const prompt = `Generate 5-10 SEO keywords in Thai for the following article.
      Title: "${currentArticle.title}"
      Content: "${currentArticle.content?.substring(0, 2000) || ''}"
      
      Return ONLY a comma-separated list of relevant keywords.
      Example: คีย์เวิร์ด1, คีย์เวิร์ด2, คีย์เวิร์ด3`;
      
      const text = await generateAIContent(prompt);
      
      const keywords = text.replace(/^[-\d.\s*"'\[\]]+/, '').replace(/["',\]]+$/, '').trim();
      
      if (keywords) {
        setCurrentArticle(prev => ({ ...prev, metaKeywords: keywords }));
      } else {
        alert('ไม่สามารถสร้าง Keywords ได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Error generating keywords:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง Keywords กรุณาตรวจสอบการตั้งค่า API');
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 relative z-[60]">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-900 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        )}
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
              Admin <span className="text-amber-500">Login</span>
            </h1>
            <p className="text-zinc-400 mt-2">เข้าสู่ระบบเพื่อจัดการเว็บไซต์</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm text-center">
                {loginError}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-red-500 text-sm font-bold">ชื่อผู้ใช้</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none transition-colors"
                placeholder="กรอกชื่อผู้ใช้..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-red-500 text-sm font-bold">รหัสผ่าน</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none transition-colors"
                placeholder="กรอกรหัสผ่าน..."
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-xl font-black hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-black min-h-screen text-white relative z-[60]">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-900 p-2 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      )}
      
      {!dbConfig.d1Configured && (
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4 text-amber-500 text-sm">
          <Database size={20} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold mb-1">Cloudflare D1 ยังไม่ได้ตั้งค่า</p>
            <p className="text-amber-500/80">
              ระบบกำลังบันทึกข้อมูลแบบ Local ชั่วคราวในไฟล์ <code>articles_local.json</code> 
              กรุณาตั้งค่า <strong>CLOUDFLARE_ACCOUNT_ID</strong>, <strong>CLOUDFLARE_D1_DATABASE_ID</strong> และ <strong>CLOUDFLARE_API_TOKEN</strong> ใน Secrets เพื่อใช้งานฐานข้อมูลจริง
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Admin <span className="text-amber-500">Dashboard</span>
          </h1>
          <p className="text-zinc-400">จัดการบทความและเนื้อหาทั้งหมดของเว็บไซต์</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={initDatabase}
            className="bg-zinc-900 text-zinc-400 px-4 py-3 rounded-full font-bold hover:bg-zinc-800 transition-colors flex items-center border border-zinc-800"
            title="ตั้งค่าฐานข้อมูลครั้งแรก"
          >
            <Database size={20} className="mr-2" /> Init DB
          </button>
          <button 
            onClick={() => { setIsEditing(true); setCurrentArticle({}); }}
            className="bg-red-600 text-white px-8 py-3 rounded-full font-black hover:bg-red-700 transition-colors flex items-center shadow-lg shadow-red-600/20"
          >
            <Plus size={20} className="mr-2" /> เพิ่มบทความใหม่
          </button>
        </div>
      </div>

      {/* AI Prompt Modal */}
      <AIPromptModal 
        isOpen={isAIPromptOpen} 
        onClose={() => setIsAIPromptOpen(false)} 
        onExecute={(prompt) => {
          setAiPrompt(prompt);
        }}
        initialTopic={aiPromptInitialTopic}
      />

      {/* Slug Selection Modal */}
      {isSlugModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#222222] w-full max-w-md rounded-lg shadow-2xl border border-zinc-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Wand2 size={18} className="text-red-500" />
                เลือก Slug ที่ต้องการ
              </h2>
              <button onClick={() => setIsSlugModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {slugOptions.map((slug, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentArticle({ ...currentArticle, slug });
                    setIsSlugModalOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-500 rounded-lg text-zinc-300 hover:text-white transition-all text-sm font-mono"
                >
                  {slug}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEO Generation Modal */}
      {isSEOModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#222222] w-full max-w-md rounded-lg shadow-2xl border border-zinc-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Search size={18} className="text-red-500" />
                AI SEO Generator
              </h2>
              <button onClick={() => setIsSEOModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-zinc-300 text-sm font-medium">หัวข้อบทความ (Topic)</label>
                <input 
                  type="text" 
                  value={seoTopic}
                  onChange={e => setSeoTopic(e.target.value)}
                  placeholder="เช่น วิธีเล่นบาคาร่า..."
                  className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-zinc-300 text-sm font-medium">คีย์เวิร์ดหลัก (Primary Keyword - Optional)</label>
                <input 
                  type="text" 
                  value={seoPrimaryKeyword}
                  onChange={e => setSeoPrimaryKeyword(e.target.value)}
                  placeholder="เช่น บาคาร่าออนไลน์"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm transition-all"
                />
                <p className="text-[10px] text-zinc-500">AI จะใช้คีย์เวิร์ดนี้ในการสร้าง Meta Title และ Description</p>
              </div>
              <button
                onClick={handleGenerateSEO}
                disabled={isGeneratingSEO || !seoTopic.trim()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isGeneratingSEO ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wand2 size={16} />}
                {isGeneratingSEO ? 'กำลังสร้าง SEO Tags...' : 'สร้าง Meta Title, Desc, Keywords'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excerpt Selection Modal */}
      {isExcerptModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#222222] w-full max-w-md rounded-lg shadow-2xl border border-zinc-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <FileText size={18} className="text-red-500" />
                เลือกคำโปรยที่ต้องการ
              </h2>
              <button onClick={() => setIsExcerptModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {excerptOptions.map((excerpt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentArticle({ ...currentArticle, excerpt });
                    setIsExcerptModalOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-500 rounded-lg text-zinc-300 hover:text-white transition-all text-sm"
                >
                  {excerpt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Editor Section (ฟอร์มเพิ่ม/แก้ไขบทความ) */}
      {isEditing ? (
        <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-2xl mb-12 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-zinc-800">
            <div>
              <h2 className="text-2xl font-bold text-red-500 mb-1">
                {currentArticle.id ? 'แก้ไขบทความ' : 'สร้างบทความใหม่'}
              </h2>
              <p className="text-sm text-zinc-400">จัดการเนื้อหาและสถานะการเผยแพร่</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button 
                onClick={(e) => handleSave(e, 'draft')}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-colors border border-zinc-800"
              >
                <Save size={16} /> บันทึกฉบับร่าง
              </button>
              <button 
                onClick={(e) => handleSave(e, 'published')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
              >
                <Check size={16} /> เผยแพร่บทความ
              </button>
              <button onClick={() => setIsEditing(false)} className="ml-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                <X size={24} />
              </button>
            </div>
          </div>

          <form className="space-y-6">
            {/* Section 1: Upload */}
            <div className="border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center bg-zinc-900/30">
              <div className="flex items-start gap-3 mb-4 md:mb-0">
                <Upload className="text-red-500 mt-1" size={20} />
                <div>
                  <h3 className="text-red-500 font-medium text-sm">นำเข้าเนื้อหาจากไฟล์</h3>
                  <p className="text-xs text-zinc-500 mt-1">รองรับ .docx, .pdf, .txt, .md, .html, .rtf</p>
                </div>
              </div>
              <button type="button" className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors">
                <Plus size={16} /> เลือกไฟล์
              </button>
            </div>

            {/* Section 2: Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <TypeIcon size={16} /> หัวข้อบทความ (Title)
                </label>
                <input 
                  type="text" 
                  value={currentArticle.title || ''}
                  onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm transition-all"
                  placeholder="เช่น วิธีเล่นบาคาร่า..."
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-red-500 text-sm font-medium">
                    <LinkIcon size={16} /> Slug (URL)
                  </label>
                  <button 
                    type="button" 
                    onClick={handleGenerateSlug}
                    disabled={isGeneratingSlug || !currentArticle.title}
                    className="text-xs text-zinc-400 hover:text-red-500 flex items-center gap-1 border border-zinc-800 rounded px-2 py-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingSlug ? <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" /> : <Wand2 size={12} />}
                    {isGeneratingSlug ? 'Generating...' : 'Generate Slug'}
                  </button>
                </div>
                <input 
                  type="text" 
                  value={currentArticle.slug || ''}
                  onChange={e => setCurrentArticle({...currentArticle, slug: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm transition-all"
                  placeholder="เช่น how-to-play-baccarat"
                />
              </div>
            </div>

            {/* Section 3: SEO Settings */}
            <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/20 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="flex items-center gap-2 text-red-500 font-medium text-sm">
                  <Search size={16} /> SEO Settings
                </h3>
                <button 
                  type="button" 
                  onClick={() => {
                    setSeoTopic(currentArticle.title || '');
                    setIsSEOModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-600/10 rounded-lg text-xs font-medium transition-colors"
                >
                  <Wand2 size={14} /> Generate SEO Tags
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label className="text-zinc-400 font-medium uppercase">Meta Title</label>
                    <span className="text-zinc-500">{currentArticle.metaTitle?.length || 0}/60</span>
                  </div>
                  <input 
                    type="text" 
                    value={currentArticle.metaTitle || ''}
                    onChange={e => setCurrentArticle({...currentArticle, metaTitle: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label className="text-zinc-400 font-medium uppercase">Meta Description</label>
                    <span className="text-zinc-500">{currentArticle.metaDescription?.length || 0}/160</span>
                  </div>
                  <textarea 
                    value={currentArticle.metaDescription || ''}
                    onChange={e => setCurrentArticle({...currentArticle, metaDescription: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm resize-none h-[42px] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Excerpt */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <FileText size={16} /> คำโปรย (Excerpt)
                </label>
                <button 
                  type="button" 
                  onClick={handleGenerateExcerpt}
                  disabled={isGeneratingExcerpt}
                  className="text-xs text-zinc-400 hover:text-red-500 flex items-center gap-1 border border-zinc-800 rounded px-2 py-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingExcerpt ? <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" /> : <Wand2 size={12} />}
                  {isGeneratingExcerpt ? 'กำลังสร้าง...' : 'Generate Excerpt'}
                </button>
              </div>
              <textarea 
                value={currentArticle.excerpt || ''}
                onChange={e => setCurrentArticle({...currentArticle, excerpt: e.target.value})}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm min-h-[80px] resize-y transition-all"
                placeholder="สรุปสั้นๆ เกี่ยวกับบทความ..."
              />
            </div>

            {/* Section 5: Category & Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <Folder size={16} /> หมวดหมู่
                </label>
                <select 
                  value={currentArticle.category || ''}
                  onChange={e => setCurrentArticle({...currentArticle, category: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm appearance-none transition-all"
                  required
                >
                  <option value="">เลือกหมวดหมู่...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  value={!categories.includes(currentArticle.category || '') ? currentArticle.category || '' : ''}
                  onChange={e => setCurrentArticle({...currentArticle, category: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm mt-2 transition-all"
                  placeholder="หรือพิมพ์ชื่อหมวดหมู่ใหม่ที่นี่..."
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-red-500 text-sm font-medium">
                    <Tag size={16} /> Keywords Meta Tag
                  </label>
                  <button 
                    type="button" 
                    onClick={handleGenerateKeywords}
                    disabled={isGeneratingKeywords}
                    className="text-xs text-zinc-400 hover:text-red-500 flex items-center gap-1 border border-zinc-800 rounded px-2 py-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingKeywords ? <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" /> : <Wand2 size={12} />}
                    {isGeneratingKeywords ? 'กำลังสร้าง...' : 'Generate'}
                  </button>
                </div>
                <input 
                  type="text" 
                  value={currentArticle.metaKeywords || ''}
                  onChange={e => setCurrentArticle({...currentArticle, metaKeywords: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm transition-all"
                  placeholder="เช่น บาคาร่า, สูตรบาคาร่า, เล่นบาคาร่า (คั่นด้วยลูกน้ำ)"
                />
              </div>
            </div>

            {/* Section 6: Cover Image & Scheduling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <ImageIcon size={16} /> URL รูปภาพหน้าปก
                </label>
                <input 
                  type="text" 
                  value={currentArticle.image || ''}
                  onChange={e => setCurrentArticle({...currentArticle, image: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <Calendar size={16} /> วันที่เผยแพร่ (Scheduling)
                </label>
                <input 
                  type="datetime-local" 
                  value={currentArticle.date ? (currentArticle.date.length === 10 ? `${currentArticle.date}T00:00` : currentArticle.date) : ''}
                  onChange={e => setCurrentArticle({...currentArticle, date: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm [color-scheme:dark] transition-all"
                />
                <p className="text-[10px] text-zinc-500">ตั้งเวลาการเผยแพร่ล่วงหน้า ปล่อยว่างหากต้องการเผยแพร่ทันที</p>
              </div>
            </div>

            {/* Section 7: Article Content */}
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <label className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <Edit3 size={16} /> เนื้อหาบทความ
                </label>
                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                  <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEditorMode('visual')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${editorMode === 'visual' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                      <Eye size={14} className="inline mr-1" /> Visual
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('text')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${editorMode === 'text' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                      <Code size={14} className="inline mr-1" /> Text
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setAiPromptInitialTopic('');
                      setIsAIPromptOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium transition-colors border border-zinc-800"
                  >
                    <LayoutTemplate size={14} /> Templates
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setAiPromptInitialTopic('Generate 5 blog post ideas related to Baccarat online for a Thai audience.');
                      setIsAIPromptOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg text-xs font-medium transition-colors border border-red-500/30"
                  >
                    <Sparkles size={14} /> Content Ideas
                  </button>
                  <div className="flex-1 md:w-64 relative">
                    <input 
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="บอก AI ว่าอยากให้เขียนอะไร..."
                      className="w-full bg-black border border-zinc-800 rounded-lg pl-3 pr-24 py-1.5 text-zinc-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-xs transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={handleGenerateContent}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="absolute right-1 top-1 bottom-1 px-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-[10px] font-medium transition-colors flex items-center gap-1 border border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" /> : <Wand2 size={10} />}
                      {isGenerating ? 'กำลังเขียน...' : 'AI ช่วยเขียน'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Editor */}
              <div className="border border-zinc-800 rounded-lg overflow-hidden bg-black">
                {editorMode === 'visual' ? (
                  <div className="bg-white text-black quill-wrapper">
                    <ReactQuill 
                      theme="snow" 
                      value={currentArticle.content || ''} 
                      onChange={(content) => setCurrentArticle({...currentArticle, content})}
                      modules={quillModules}
                      className="h-[300px] mb-12"
                    />
                  </div>
                ) : (
                  <>
                    <div className="bg-zinc-900/50 border-b border-zinc-800 p-2 flex gap-1 text-zinc-400 overflow-x-auto">
                      <button type="button" onClick={() => insertFormatting('\n\n')} className="p-1.5 hover:bg-zinc-800 rounded text-sm transition-colors">Normal</button>
                      <div className="w-px h-5 bg-zinc-800 mx-1 self-center"></div>
                      <button type="button" onClick={() => insertFormatting('**', '**')} className="p-1.5 hover:bg-zinc-800 rounded font-bold transition-colors">B</button>
                      <button type="button" onClick={() => insertFormatting('*', '*')} className="p-1.5 hover:bg-zinc-800 rounded italic transition-colors">I</button>
                      <button type="button" onClick={() => insertFormatting('<u>', '</u>')} className="p-1.5 hover:bg-zinc-800 rounded underline transition-colors">U</button>
                      <div className="w-px h-5 bg-zinc-800 mx-1 self-center"></div>
                      <button type="button" onClick={() => {
                        const url = prompt('Enter URL:');
                        if (url) insertFormatting('[', `](${url})`);
                      }} className="p-1.5 hover:bg-zinc-800 rounded transition-colors">🔗</button>
                      <button type="button" onClick={() => {
                        const url = prompt('Enter Image URL:');
                        if (url) insertFormatting('![alt text](', `${url})`);
                      }} className="p-1.5 hover:bg-zinc-800 rounded transition-colors">📷</button>
                      <button type="button" onClick={() => insertFormatting('### ', '')} className="p-1.5 hover:bg-zinc-800 rounded transition-colors">📝</button>
                    </div>
                    <textarea 
                      ref={contentTextareaRef}
                      value={currentArticle.content || ''}
                      onChange={e => setCurrentArticle({...currentArticle, content: e.target.value})}
                      className="w-full bg-transparent p-4 text-zinc-200 outline-none text-sm min-h-[300px] resize-y font-mono"
                      placeholder="พิมพ์เนื้อหาบทความที่นี่ (รองรับ HTML/Markdown)..."
                      required
                    />
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-6 border-t border-zinc-800 mt-8">
              <button 
                type="button" 
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center gap-2 text-zinc-400 hover:text-red-500 text-sm font-medium transition-colors"
              >
                <Eye size={16} /> ดูตัวอย่าง
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-white text-sm font-medium transition-colors px-4">
                ยกเลิก
              </button>
              <button 
                onClick={(e) => handleSave(e, 'draft')}
                className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-colors border border-zinc-800"
              >
                <Save size={16} /> บันทึกฉบับร่าง
              </button>
              <button 
                onClick={(e) => handleSave(e, 'published')}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-red-600/20"
              >
                <Check size={16} /> เผยแพร่บทความ
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List Section (ตารางแสดงบทความ) */
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
          {/* ตัวกรองและค้นหา */}
          <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {['all', 'published', 'draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors whitespace-nowrap ${
                    filterStatus === status 
                      ? 'bg-red-600 text-white' 
                      : 'bg-black text-zinc-400 border border-zinc-800 hover:border-red-500'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาบทความ..."
                className="w-full bg-black border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-red-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* ตารางข้อมูล */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 text-red-500 text-sm uppercase tracking-wider">
                  <th 
                    className="p-4 font-bold cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      หัวข้อบทความ
                      {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="p-4 font-bold cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-2">
                      หมวดหมู่
                      {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="p-4 font-bold cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      วันที่
                      {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="p-4 font-bold cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      สถานะ
                      {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th className="p-4 font-bold text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">ไม่พบข้อมูลบทความ</td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-zinc-200">
                        <div className="line-clamp-1">{article.title}</div>
                      </td>
                      <td className="p-4 text-zinc-400">{article.category}</td>
                      <td className="p-4 text-zinc-500 text-xs">{article.date}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-900 text-zinc-400'
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button 
                          onClick={() => { setCurrentArticle(article); setIsEditing(true); }}
                          className="p-2 text-zinc-400 hover:text-red-500 bg-black rounded-lg transition-colors inline-flex border border-zinc-800"
                          title="แก้ไข"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => article.id && handleDelete(article.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 bg-black rounded-lg transition-colors inline-flex border border-zinc-800"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-black font-bold text-lg flex items-center gap-2">
                <Eye size={20} className="text-red-500" /> ตัวอย่างบทความ
              </h2>
              <button onClick={() => setIsPreviewOpen(false)} className="text-gray-500 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white text-black">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">{currentArticle.title || 'ไม่มีหัวข้อ'}</h1>
                {currentArticle.image ? (
                  <img src={currentArticle.image} alt="Cover" className="w-full h-auto rounded-xl mb-8 object-cover max-h-[400px]" />
                ) : null}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentArticle.content || '<p className="text-gray-500 italic">ยังไม่มีเนื้อหา</p>' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
