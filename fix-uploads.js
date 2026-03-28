const fs = require('fs');
const file = 'c:/Users/harsh/Downloads/myne/mynovia-front/app/admin/contenido/page.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /setUploadingImage\(true\);\s*const result = await adminUploadMedia\(file, 'home'\)[\s\S]*?updateSection\('appointment_cta', 'bg_image', result\.url\)\s*\}/g,
  "setUploadingImage(true); try { const result = await adminUploadMedia(file, 'home'); updateSection('appointment_cta', 'bg_image', result.url); } finally { setUploadingImage(false); }"
);

content = content.replace(
  /setUploadingImage\(true\);\s*const result = await adminUploadMedia\(file, 'home'\)[\s\S]*?updateSection\('appointment_cta', 'bg_image', result\.url\)\s*\}/g,
  "setUploadingImage(true); try { const result = await adminUploadMedia(file, 'home'); updateSection('appointment_cta', 'bg_image', result.url); } finally { setUploadingImage(false); }"
);

content = content.replace(
  /setUploadingImage\(true\);\s*const result = await adminUploadMedia\(file, 'inspiration'\)[\s\S]*?setMsg\('Image uploaded!'\)\s*setTimeout\(\(\) => setMsg\(''\), 2000\)\s*\} catch \(err\) \{ \}/g,
  "setUploadingImage(true); try { const result = await adminUploadMedia(file, 'inspiration'); updateSection('inspiration', 'bg_image', result.url); setMsg('Image uploaded!'); setTimeout(() => setMsg(''), 2000); } catch (err) { } finally { setUploadingImage(false); }"
);

content = content.replace(
  /setUploadingImage\(true\)\s*try \{\s*const result = await adminUploadMedia\(file, 'hero'\)[\s\S]*?updateHeroSlides\(newSlides\)[\s\S]*?setMsg\('Image uploaded!'\)[\s\S]*?setTimeout\(\(\) => setMsg\(''\), 2000\)[\s\S]*?\} catch \(err\) \{\s*setMsg\('Error uploading image'\)\s*\}/g,
  "setUploadingImage(true); try { const result = await adminUploadMedia(file, 'hero'); const newSlides = [...heroSlides]; newSlides[index] = { ...newSlides[index], image: result.url }; updateHeroSlides(newSlides); setMsg('Image uploaded!'); setTimeout(() => setMsg(''), 2000); } catch (err) { setMsg('Error uploading image'); } finally { setUploadingImage(false); }"
);

content = content.replace(/import LoadingOverlay from '@\/components\/admin\/LoadingOverlay'(\r?\n)?import LoadingOverlay from '@\/components\/admin\/LoadingOverlay'/, "import LoadingOverlay from '@/components/admin/LoadingOverlay'");

content = content.replace(
  /<div className="flex items-center justify-between mb-8">\s*<h1 className="text-2xl font-heading text-charcoal">Content Editor<\/h1>\s*\{\(msg \|\| uploadingImage\) && <span className="text-sm font-sans text-green-600\">\{uploadingImage \? 'Uploading image\.\.\.' : msg\}<\/span>\}\s*<\/div>/g,
  '<LoadingOverlay isLoading={uploadingImage} message="Uploading Image..." />\n      <LoadingOverlay isLoading={savingSection !== null} message="Saving changes..." />\n      <div className="flex items-center justify-between mb-8">\n        <h1 className="text-2xl font-heading text-charcoal">Content Editor</h1>\n        {msg && <span className="text-sm font-sans text-green-600">{msg}</span>}\n      </div>'
);

// We need to fix the one-liners that had semicolons as well for 'about' sections
content = content.replace(
  /setUploadingImage\(true\);\s*const result = await adminUploadMedia\(file, 'about'\);\s*updateSection\('about', 'hero_image', result\.url\);\s*\}/g,
  "setUploadingImage(true); try { const result = await adminUploadMedia(file, 'about'); updateSection('about', 'hero_image', result.url); } finally { setUploadingImage(false); } }"
);

content = content.replace(
  /setUploadingImage\(true\);\s*const result = await adminUploadMedia\(file, 'about'\);\s*const newGallery = \[\.\.\.sections\.about\.gallery\];\s*newGallery\[index\] = result\.url;\s*updateSection\('about', 'gallery', newGallery\);\s*\}/g,
  "setUploadingImage(true); try { const result = await adminUploadMedia(file, 'about'); const newGallery = [...sections.about.gallery]; newGallery[index] = result.url; updateSection('about', 'gallery', newGallery); } finally { setUploadingImage(false); } }"
);

fs.writeFileSync(file, content);
console.log('Script ran successfully');
