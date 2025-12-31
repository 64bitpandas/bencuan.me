
import fs from 'node:fs/promises';
import path from 'node:path';
import { labToHex, rgbToHex } from '../../../../utils/color-conversion';
import friendlyNamesData from '../../../../color-books/_pantone-color-names.json';

const friendlyNames: Record<string, { name: string }> = friendlyNamesData;

export async function GET({ params }: { params: { name: string } }) {
  const { name } = params;
  const booksDir = path.join(process.cwd(), 'src/color-books');
  const filePath = path.join(booksDir, `${name}.json`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const isLab = data.colorSpace === 'LAB';
    const isRGB = data.colorSpace === 'RGB'; 
    // If neither, we might need to handle CMYK or others, but for now assuming mostly Lab/RGB as per prompt focus on Pantone TCX (Lab)

    const colors = Object.values(data.records).map((record: any) => {
        let hex = '#000000';
        
        if (isLab) {
            const [l, a, b] = record.components;
            hex = labToHex(l, a, b);
        } else if (isRGB) {
             const [r, g, b] = record.components;
             hex = rgbToHex(r, g, b);
        } else {
             // Fallback or todo for other color spaces if encountered
             // Many pantone books in the repo might be CMYK. 
             // The prompt explicitly asks to ensure Pantone TCX works (which is Lab).
             // We can try a crude CMYK conversion if needed later, but sticking to requested scope.
             hex = '#cccccc'; 
        }

        // Add friendly name if exists
        // Pantone keys are like "PANTONE 11-0601 TCX"
        // Friendly map keys are "11-0601" (assumed from previous view of the file)
        // Let's check the key format again.
        // The viewed keys were "11-0103". So we strip "PANTONE " and " TCX" or " TPX".
        
        let friendly = "";
        const cleanCode = record.name.replace('PANTONE ', '').replace(' TCX', '').replace(' TPX', '').replace(' TPG', '');
        if (friendlyNames[cleanCode]) {
            friendly = friendlyNames[cleanCode].name; // e.g. "egret"
            // Title case it for display
             friendly = friendly.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        
        return {
            name: record.name,
            code: record.code,
            hex: hex,
            friendly: friendly
        };
    });

    return new Response(JSON.stringify({ ...data, colors }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (e) {
      console.error(e);
    return new Response(JSON.stringify({ error: 'Book not found' }), {
      status: 404, // or 500
      headers: {
         'Content-Type': 'application/json'
      }
    });
  }
}

export async function getStaticPaths() {
  const booksDir = path.join(process.cwd(), 'src/color-books');
  const files = await fs.readdir(booksDir);
  return files
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => ({
      params: { name: f.replace('.json', '') },
    }));
}
