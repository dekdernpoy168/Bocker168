import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText, Target, Upload } from 'lucide-react';

// กำหนด Type สำหรับบทความ
interface Article {
  id?: string;
  title: string;
  content: string;
  category: string;
  status: 'published' | 'draft' | 'scheduled';
  author: string;
}

const AdminDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  // ข้อมูลจำลอง (Mock Data)
  const articles: Article[] = []; 
  const categories = ['บาคาร่า', 'คาสิโน', 'สูตรสล็อต'];

  const handleSave = async (e: React.FormEvent, status: 'published' | 'draft') => {
    e.preventDefault();
    // TODO: ใส่โค้ดบันทึกข้อมูลลง Database ของคุณที่นี่
    console.log('Saving article:', { ...currentArticle, status });
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("ยืนยันการลบตัวเลือกนี้?")) return;
    // TODO: ใส่โค้ดลบข้อมูลจาก Database ของคุณที่นี่
    console.log('Deleting article:', id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-black min-h-screen text-white">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            Admin <span className="text-yellow-500">Dashboard</span>
          </h1>
          <p className="text-gray-400">จัดการบทความและเนื้อหาทั้งหมดของเว็บไซต์</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setIsEditing(true); setCurrentArticle({}); }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-full font-black hover:scale-105 transition-transform flex items-center"
          >
            <Plus size={20} className="mr-2" /> เพิ่มบทความใหม่
          </button>
        </div>
      </div>

      {/* Editor Section (ฟอร์มเพิ่ม/แก้ไขบทความ) */}
      {isEditing ? (
        <div className="bg-gray-900 border border-yellow-500/20 p-8 rounded-3xl mb-12">
          <div className="flex justify-between items-center mb-8 border-b border-yellow-500/10 pb-6">
            <h2 className="text-2xl font-bold text-yellow-500 uppercase">
              {currentArticle.id ? 'แก้ไขบทความ' : 'สร้างบทความใหม่'}
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={(e) => handleSave(e, 'draft')}
                className="bg-gray-800 text-white px-6 py-2.5 rounded-full font-bold hover:bg-gray-700 flex items-center"
              >
                <FileText size={18} className="mr-2 text-yellow-500" /> บันทึกฉบับร่าง
              </button>
              <button 
                onClick={(e) => handleSave(e, 'published')}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-2.5 rounded-full font-black hover:scale-105 flex items-center"
              >
                <Save size={18} className="mr-2" /> เผยแพร่บทความ
              </button>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white ml-2">
                <X size={24} />
              </button>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ชื่อบทความ */}
              <div className="space-y-2">
                <label className="text-yellow-500 text-sm font-bold">หัวข้อบทความ</label>
                <input 
                  type="text" 
                  value={currentArticle.title || ''}
                  onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})}
                  className="w-full bg-black border border-yellow-500/20 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none"
                  placeholder="ใส่หัวข้อบทความ..."
                  required
                />
              </div>

              {/* หมวดหมู่ */}
              <div className="space-y-2">
                <label className="text-yellow-500 text-sm font-bold">หมวดหมู่</label>
                <select 
                  value={currentArticle.category || ''}
                  onChange={e => setCurrentArticle({...currentArticle, category: e.target.value})}
                  className="w-full bg-black border border-yellow-500/20 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none"
                  required
                >
                  <option value="">เลือกหมวดหมู่...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* เนื้อหาบทความ */}
            <div className="space-y-2">
              <label className="text-yellow-500 text-sm font-bold">เนื้อหาบทความ</label>
              <textarea 
                value={currentArticle.content || ''}
                onChange={e => setCurrentArticle({...currentArticle, content: e.target.value})}
                className="w-full bg-black border border-yellow-500/20 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none min-h-[300px]"
                placeholder="พิมพ์เนื้อหาบทความที่นี่..."
                required
              />
            </div>
          </form>
        </div>
      ) : (
        /* List Section (ตารางแสดงบทความ) */
        <div className="bg-gray-900 border border-yellow-500/20 rounded-3xl overflow-hidden">
          {/* ตัวกรองสถานะ */}
          <div className="p-6 border-b border-yellow-500/10 flex gap-2">
            {['all', 'published', 'draft'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${
                  filterStatus === status 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-black text-gray-400 border border-yellow-500/20 hover:border-yellow-500'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* ตารางข้อมูล */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 text-yellow-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-bold">หัวข้อบทความ</th>
                  <th className="p-4 font-bold">หมวดหมู่</th>
                  <th className="p-4 font-bold">สถานะ</th>
                  <th className="p-4 font-bold text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-500/10">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">ยังไม่มีบทความ</td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">{article.title}</td>
                      <td className="p-4 text-gray-400">{article.category}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => { setCurrentArticle(article); setIsEditing(true); }}
                          className="p-2 text-gray-400 hover:text-yellow-500 bg-black rounded-lg transition-colors inline-flex"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => article.id && handleDelete(article.id)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-black rounded-lg transition-colors inline-flex"
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
    </div>
  );
};

export default AdminDashboard;
