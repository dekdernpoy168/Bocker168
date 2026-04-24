const fs = require('fs');
let code = fs.readFileSync('src/components/AIPromptModal.tsx', 'utf8');
code = code.replace(/setIsGeneratingSecondaryKeywords\(false\);\n    \}\n  \};[\s\S]*?setIsGeneratingSecondaryKeywords\(false\);\n    \}\n  \};/gm, 'setIsGeneratingSecondaryKeywords(false);\n    }\n  };');
fs.writeFileSync('src/components/AIPromptModal.tsx', code);
