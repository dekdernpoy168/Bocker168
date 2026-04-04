import fs from 'fs';

const path = './src/components/AdminDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements: Record<string, string> = {
  'bg-[#020617]': 'bg-black',
  'bg-[#0f172a]': 'bg-zinc-950',
  'bg-slate-800': 'bg-zinc-900',
  'border-slate-800': 'border-zinc-800',
  'border-slate-700': 'border-zinc-800',
  'bg-slate-900': 'bg-zinc-900',
  'bg-slate-700': 'bg-zinc-800',
  'text-slate-400': 'text-zinc-400',
  'text-slate-500': 'text-zinc-500',
  'text-slate-300': 'text-zinc-300',
  'text-slate-200': 'text-zinc-200',
  'text-[#eab308]': 'text-red-500',
  'bg-[#eab308]': 'bg-red-600',
  'hover:bg-[#eab308]/10': 'hover:bg-red-500/10',
  'border-[#eab308]': 'border-red-500',
  'focus:border-[#eab308]': 'focus:border-red-500',
  'focus:ring-[#eab308]': 'focus:ring-red-500',
  'hover:text-[#eab308]': 'hover:text-red-500',
  'hover:border-[#eab308]': 'hover:border-red-500',
  'hover:bg-yellow-400': 'hover:bg-red-700',
  'shadow-yellow-500/20': 'shadow-red-600/20',
  'text-slate-900': 'text-white'
};

for (const [key, value] of Object.entries(replacements)) {
  content = content.split(key).join(value);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Colors replaced successfully!');
