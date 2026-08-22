import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distIndexPath = path.resolve(__dirname, '../dist/index.html');
const rootIndexPath = path.resolve(__dirname, '../index.html');

if (fs.existsSync(distIndexPath)) {
  let content = fs.readFileSync(distIndexPath, 'utf-8');
  // Convert /assets/ or ./assets/ references to /dist/assets/ for static web server fallback
  content = content.replace(/src="\.?\/assets\//g, 'src="/dist/assets/');
  content = content.replace(/href="\.?\/assets\//g, 'href="/dist/assets/');
  fs.writeFileSync(rootIndexPath, content, 'utf-8');
  console.log("✅ [Sync Dist] index.html de raíz sincronizado exitosamente con assets de producción en /dist/assets/");
} else {
  console.warn("⚠️ [Sync Dist] dist/index.html no encontrado.");
}
