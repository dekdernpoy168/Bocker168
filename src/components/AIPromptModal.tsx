import React, { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';
import { generateAIContent } from '../lib/aiService';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (prompt: string) => void;
  initialTopic?: string;
}

export default function AIPromptModal({ isOpen, onClose, onExecute, initialTopic = '' }: AIPromptModalProps) {
  const [category, setCategory] = useState('Copywriting');
  const [subCategory, setSubCategory] = useState('Blog Writing');
  const [template, setTemplate] = useState('Generate Paragraph Of Text');
  const [language, setLanguage] = useState('Thai');
  const [voiceTone, setVoiceTone] = useState('Professional');
  const [writingStyle, setWritingStyle] = useState('Informative');
  const [targetAudience, setTargetAudience] = useState('General');
  const [anchorText, setAnchorText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [topic, setTopic] = useState(initialTopic);
  const [totalWords, setTotalWords] = useState(1000);
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywordCount, setSecondaryKeywordCount] = useState(5);
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [isFetchingKeywords, setIsFetchingKeywords] = useState(false);
  const [isGeneratingSecondaryKeywords, setIsGeneratingSecondaryKeywords] = useState(false);
  const [keData, setKeData] = useState<Record<string, any>>({});

  React.useEffect(() => {
    if (isOpen) {
      setTopic(initialTopic);
    }
  }, [isOpen, initialTopic]);

  const fetchVolumes = async (keywords: string[]) => {
    if (keywords.length === 0) return {};
    try {
      const resp = await fetch('/api/keywords-volume', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ keywords })
      });
      const data = await resp.json();
      if (data.configured && data.data) {
        const newData: Record<string, any> = {};
        data.data.forEach((item: any) => {
          newData[item.keyword] = { vol: item.vol, cpc: item.cpc?.value, comp: item.competition };
        });
        setKeData(prev => ({ ...prev, ...newData }));
        return newData;
      }
    } catch (e) {
      console.error('Failed to fetch keyword volumes', e);
    }
    return {};
  };

  const fetchKeywords = async (query: string, isPrimary: boolean) => {
    if (!query) return;
    setIsFetchingKeywords(true);
    try {
      const prompt = `Suggest 1 best SEO primary keyword for the topic "${query}" in Thai language. Return ONLY the keyword text, nothing else. Do not include quotes or punctuation.`;
      const text = await generateAIContent(prompt);
      const keyword = text.replace(/["']/g, '').trim();
      
      if (keyword) {
        setPrimaryKeyword(keyword);
        await fetchVolumes([keyword]);
      } else {
        alert('ไม่สามารถวิเคราะห์คีย์เวิร์ดได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Error fetching keywords:', error);
      alert('เกิดข้อผิดพลาดในการสร้างคีย์เวิร์ด กรุณาตรวจสอบการตั้งค่า API');
    } finally {
      setIsFetchingKeywords(false);
    }
  };

  const generateSecondaryKeywords = async () => {
    if (!primaryKeyword) return;
    setIsGeneratingSecondaryKeywords(true);
    try {
      const prompt = `Generate ${secondaryKeywordCount} secondary SEO keywords in Thai related to the primary keyword "${primaryKeyword}".
      Return ONLY a comma-separated list of keywords.
      Example: คีย์เวิร์ด1, คีย์เวิร์ด2, คีย์เวิร์ด3`;
      
      const text = await generateAIContent(prompt);
      
      const keywords = text.replace(/^[-\d.\s*"'\\[\\]]+/, '').replace(/["',\]]+$/, '').trim();
      
      if (keywords) {
        setSecondaryKeywords(keywords);
        const kwList = keywords.split(',').map(k => k.trim()).filter(k => k);
        await fetchVolumes(kwList);
      } else {
        alert('ไม่สามารถสร้างคีย์เวิร์ดรองได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Error generating secondary keywords:', error);
      alert('Failed to generate secondary keywords. Check console for details.');
    } finally {
      setIsGeneratingSecondaryKeywords(false);
    }
  };

  const getPromptTemplate = () => {
    let prompt = `Please ignore all previous instructions. You are an expert copywriter who writes detailed and thoughtful blog articles.\n`;
    prompt += `Tone of voice: ${voiceTone}.\n`;
    prompt += `Writing style: ${writingStyle}.\n`;
    prompt += `Target audience: ${targetAudience}.\n`;
    prompt += `Template type: ${template}.\n\n`;
    
    prompt += `I want you to write around ${totalWords} words on "${topic}" in the ${language} language. `;
    
    if (primaryKeyword) {
      prompt += `The primary keyword is "${primaryKeyword}". `;
    }
    if (secondaryKeywords) {
      prompt += `Include these secondary keywords: ${secondaryKeywords}. `;
    }
    prompt += `IMPORTANT: For all secondary keywords, style them as bold yellow (e.g., **<span style="color:yellow">keyword</span>**). For the internal link anchor text, style it as green (e.g., <span style="color:green">anchor text</span>).\n`;
    if (anchorText && linkUrl) {
      prompt += `Include an internal link with the anchor text "${anchorText}" pointing to ${linkUrl}. `;
    }
    
    return prompt;
  };

  const handleExecute = () => {
    onExecute(getPromptTemplate());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#222222] w-full max-w-5xl rounded-lg shadow-2xl border border-zinc-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">
              K
            </div>
            <h2 className="text-white font-bold text-lg">ChatGPT Prompt Templates by Keywords Everywhere</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Prompt Template Display */}
          <div className="mb-6">
            <div className="bg-[#003399] text-white text-xs font-bold px-3 py-1 inline-block">
              PROMPT TEMPLATE
            </div>
            <div className="bg-[#333333] border border-zinc-600 rounded-b rounded-tr p-4 text-zinc-300 text-sm font-mono whitespace-pre-wrap min-h-[120px] max-h-[200px] overflow-y-auto">
              {getPromptTemplate()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category:</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none">
                <option>Copywriting</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Sub-Category:</label>
              <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none">
                <option>Blog Writing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Templates:</label>
              <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none">
                <option>Generate Paragraph Of Text</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Languages:</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none">
                <option>Thai</option>
                <option>English</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Voice Tones:</label>
              <select value={voiceTone} onChange={e => setVoiceTone(e.target.value)} className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none">
                <option>Professional</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Writing Styles:</label>
              <select value={writingStyle} onChange={e => setWritingStyle(e.target.value)} className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none">
                <option>Informative</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Target Audience:</label>
              <input type="text" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Anchor Text (Internal Link):</label>
              <input type="text" value={anchorText} onChange={e => setAnchorText(e.target.value)} placeholder="Keywords for link" className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Link URL:</label>
              <input type="text" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2 md:col-span-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">หัวข้อบทความ (Topic) <Search size={10}/></label>
              <div className="flex gap-2">
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic" className="flex-1 bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none" />
                <button 
                  onClick={() => fetchKeywords(topic, false)}
                  disabled={isFetchingKeywords || !topic}
                  className="px-4 py-2 border border-[#b8860b] text-[#b8860b] rounded hover:bg-[#b8860b]/10 transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap disabled:opacity-50"
                >
                  <Search size={14} /> {isFetchingKeywords ? 'Loading...' : 'Get Keywords'}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">Total Words <Search size={10}/></label>
              <input type="number" value={totalWords} onChange={e => setTotalWords(Number(e.target.value))} className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2 md:col-span-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">คีย์เวิร์ดหลัก (Primary Keyword) <Search size={10}/></label>
              <div className="flex gap-2">
                <input type="text" value={primaryKeyword} onChange={e => setPrimaryKeyword(e.target.value)} placeholder="เช่น บาคาร่า" className="flex-1 bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none" />
                <button 
                  onClick={generateSecondaryKeywords}
                  disabled={isGeneratingSecondaryKeywords || !primaryKeyword}
                  className="px-4 py-2 border border-[#b8860b] text-[#b8860b] rounded hover:bg-[#b8860b]/10 transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap disabled:opacity-50"
                >
                  {isGeneratingSecondaryKeywords ? <div className="w-3 h-3 border-2 border-[#b8860b] border-t-transparent rounded-full animate-spin" /> : <Sparkles size={14} />}
                  {isGeneratingSecondaryKeywords ? 'Generating...' : 'Generate Keywords'}
                </button>
              </div>
              {primaryKeyword && keData[primaryKeyword] && (
                <div className="text-[10px] text-zinc-400 mt-1 flex gap-3">
                   <span><strong className="text-zinc-300">Vol:</strong> {keData[primaryKeyword].vol}</span>
                   <span><strong className="text-zinc-300">CPC:</strong> ${keData[primaryKeyword].cpc || '0.00'}</span>
                   <span><strong className="text-zinc-300">Comp:</strong> {keData[primaryKeyword].comp || '0.00'}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">จำนวนคีย์รอง:</label>
              <input type="number" value={secondaryKeywordCount} onChange={e => setSecondaryKeywordCount(Number(e.target.value))} className="w-full bg-[#333333] border border-zinc-600 rounded p-2.5 text-white text-sm focus:border-zinc-400 outline-none" />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">คีย์เวิร์ดรอง (Secondary Keywords) <Search size={10}/></label>
            <textarea 
              rows={4}
              value={secondaryKeywords}
              onChange={e => setSecondaryKeywords(e.target.value)}
              placeholder="คีย์รองจะแสดงที่นี่ แยกด้วยเครื่องหมายจุลภาค (,)"
              className="w-full bg-[#333333] border border-zinc-600 rounded p-3 text-white text-sm focus:border-zinc-400 outline-none resize-y"
            ></textarea>
            {secondaryKeywords && (
              <div className="flex flex-wrap gap-2 mt-2">
                {secondaryKeywords.split(',').map(kw => kw.trim()).filter(Boolean).map(kw => (
                  keData[kw] ? (
                    <span key={kw} className="text-[10px] bg-[#333333] border border-zinc-700 px-2 py-1 rounded text-zinc-300">
                       <strong className="text-white">{kw}</strong> · Vol: {keData[kw].vol} · CPC: ${keData[kw].cpc || '0.00'}
                    </span>
                  ) : null
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-700 flex justify-end bg-[#2a2a2a] rounded-b-lg">
          <button onClick={handleExecute} className="px-6 py-2.5 bg-[#444444] hover:bg-[#555555] text-white font-bold rounded transition-colors text-sm">
            Execute Template
          </button>
        </div>
      </div>
    </div>
  );
}
