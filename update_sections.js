const fs = require('fs');
const file = 'app/admin/contenido/page.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const [saving, setSaving] = useState(false)",
  "const [savingSection, setSavingSection] = useState(null);\n  const [uploadingImage, setUploadingImage] = useState(false);"
);

code = code.replace(/setSaving\(true\)/g, "setSavingSection(name || slug)");
code = code.replace(/setSaving\(false\)/g, "setSavingSection(null)");

// Replace saving with savingSection for buttons
code = code.replace(/disabled={saving}/g, "disabled={savingSection !== null || uploadingImage}");

const replaceBtn = (name, text) => {
  code = code.replace(
    new RegExp(`{saving \\? 'SAVING\\.\\.\\.' : '${text}'}`, 'g'),
    `{savingSection === '${name}' ? 'SAVING...' : '${text}'}`
  );
  code = code.replace(
    new RegExp(`>${text}</button>`, 'g'),
    `>{savingSection === '${name}' ? 'SAVING...' : '${text}'}</button>`
  );
}

replaceBtn('hero', 'SAVE HERO');
replaceBtn('welcome', 'SAVE WELCOME');
replaceBtn('featured_dresses', 'SAVE FEATURED DRESSES');
replaceBtn('featured_accessories', 'SAVE FEATURED ACCESSORIES');
replaceBtn('appointment_cta', 'SAVE APPOINTMENT CTA');
replaceBtn('inspiration', 'SAVE INSPIRATION');
replaceBtn('about', 'SAVE ALL ABOUT CHANGES');
replaceBtn('contact', 'SAVE CONTACT CHANGES');

// Add uploading state to image uploads
code = code.replace(
  /async function handleHeroImageUpload\(file, index\) {[\s\S]*?try {/g,
  `async function handleHeroImageUpload(file, index) {\n    setUploadingImage(true);\n    try {`
);
code = code.replace(
  /setMsg\('Error uploading image'\)\n    }/g,
  `setMsg('Error uploading image')\n    }\n    setUploadingImage(false);`
);

// Other image uploads
code = code.replace(/const result = await adminUploadMedia/g, "setUploadingImage(true); const result = await adminUploadMedia");
code = code.replace(/updateSection\([\s\S]*?\)\s*}/g, (match) => match + "\nsetUploadingImage(false);");
code = code.replace(/updateSection\([\s\S]*?\);\s*}/g, (match) => match + "\nsetUploadingImage(false);");
// Specifically for the try-catches in image uploads:
code = code.replace(/\} catch \(err\) \{ \}/g, "} catch (err) { }\nsetUploadingImage(false);");

// Message for uploading image
code = code.replace(
  "{msg && <span className=\"text-sm font-sans text-green-600\">{msg}</span>}",
  "{(msg || uploadingImage) && <span className=\"text-sm font-sans text-green-600\">{uploadingImage ? 'Uploading image...' : msg}</span>}"
);

// Move Inspiration before Featured Accessories
const inspirationRegex = /\{\/\* Inspiration Section \*\/\}([\s\S]*?)(?=\{\/\*\s*contact|\{\/\* about|<\/div>\s*\}|\]\)\s*\})/g;
let inspirationMatch = code.match(/\{\/\* Inspiration Section \*\/\}(.|\n)*?<\/button>\n\s*<\/div>/);
let featuredMatch = code.match(/\{\/\* Featured Accessories \*\/\}(.|\n)*?SAVE FEATURED ACCESSORIES.*/);
if (inspirationMatch) {
  let inspirationStr = inspirationMatch[0];
  code = code.replace(inspirationStr, '');
  code = code.replace(/\{\/\* Featured Accessories Section \*\/\}/, inspirationStr + '\n\n          {/* Featured Accessories Section */}');
}

fs.writeFileSync(file, code);
console.log('Done');
