import fs from 'fs';
import path from 'path';
import https from 'https';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGES_ROOT = path.join(PUBLIC_DIR, 'images');
const DIRS = {
  breakfast: path.join(IMAGES_ROOT, 'breakfast'),
  lunch: path.join(IMAGES_ROOT, 'lunch'),
  dinner: path.join(IMAGES_ROOT, 'dinner'),
  foods: path.join(IMAGES_ROOT, 'foods'),
};
const allowedDirs = ['breakfast', 'lunch', 'dinner', 'foods'];

// 1. CLEAN UP OUTSIDE FILES & FOLDERS
console.log('Cleaning up extra directories and files...');
if (fs.existsSync(IMAGES_ROOT)) {
  const items = fs.readdirSync(IMAGES_ROOT);
  items.forEach(item => {
    const itemPath = path.join(IMAGES_ROOT, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      if (!allowedDirs.includes(item)) {
        console.log(`- Deleting directory: ${item}`);
        fs.rmSync(itemPath, { recursive: true, force: true });
      }
    } else {
      console.log(`- Deleting file: ${item}`);
      fs.unlinkSync(itemPath);
    }
  });
}

// Ensure all 4 directories exist
Object.values(DIRS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const images = [
  // --- BREAKFAST ---
  { folder: 'breakfast', name: 'b1_oats_bowl.jpg', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80' },
  { folder: 'breakfast', name: 'b2_poha.jpg', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80' },
  { folder: 'breakfast', name: 'b3_upma.jpg', url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&auto=format&fit=crop&q=80' },
  { folder: 'breakfast', name: 'b4_besan_toast.jpg', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80' },
  { folder: 'breakfast', name: 'b5_oats_cheela.jpg', url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80' },
  { folder: 'breakfast', name: 'b6_omelette_sandwich.jpg', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80' },
  { folder: 'breakfast', name: 'b7_moong_dal_cheela.jpg', url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80' },
  { folder: 'breakfast', name: 'b8_ragi_porridge.jpg', url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80' },
  { folder: 'breakfast', name: 'b9_dosa.jpg', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' },

  // --- LUNCH ---
  { folder: 'lunch', name: 'l1_rice_dal.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
  { folder: 'lunch', name: 'l2_khichdi.jpg', url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&auto=format&fit=crop&q=80' },
  { folder: 'lunch', name: 'l3_chana_rice.jpg', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' },
  { folder: 'lunch', name: 'l4_paneer_rice.jpg', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80' },
  { folder: 'lunch', name: 'l5_soya_rice.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
  { folder: 'lunch', name: 'l6_veg_pulao.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
  { folder: 'lunch', name: 'l7_tomato_rice.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
  { folder: 'lunch', name: 'l8_lemon_rice.jpg', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' },
  { folder: 'lunch', name: 'l9_curd_rice.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },

  // --- DINNER ---
  { folder: 'dinner', name: 'd1_paneer_bhurji.jpg', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80' },
  { folder: 'dinner', name: 'd2_paneer_stir_fry.jpg', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' },
  { folder: 'dinner', name: 'd3_dry_soya_chilli.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
  { folder: 'dinner', name: 'd4_soya_cutlet.jpg', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80' },
  { folder: 'dinner', name: 'd5_egg_bhurji.jpg', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80' },
  { folder: 'dinner', name: 'd6_tomato_soup.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80' },
  { folder: 'dinner', name: 'd7_mushroom_soup.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80' },
  { folder: 'dinner', name: 'd8_pasta_paneer.jpg', url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&auto=format&fit=crop&q=80' },
  { folder: 'dinner', name: 'd9_veg_noodles.jpg', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80' },

  // --- FOODS DATABASE ---
  { folder: 'foods', name: 'fp_paneer.jpg', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fp_soya_chunks.jpg', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fp_eggs.jpg', url: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fp_milk.jpg', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fp_curd.jpg', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fp_dal.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fp_chana.jpg', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fp_tofu.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fc_rice.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fc_oats.jpg', url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fc_poha.jpg', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fc_bread.jpg', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fc_sweet_potato.jpg', url: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fc_ragi.jpg', url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fc_pasta.jpg', url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500&auto=format&fit=crop&q=80' },
  { folder: 'foods', name: 'fc_noodles.jpg', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80' }
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Status: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function main() {
  console.log(`Starting downloads for ${images.length} divided images...`);
  let successes = 0;
  let failures = 0;

  for (const img of images) {
    const dir = DIRS[img.folder];
    const dest = path.join(dir, img.name);
    try {
      await download(img.url, dest);
      console.log(`✓ Saved ${img.folder}/${img.name}`);
      successes++;
    } catch (err) {
      console.error(`✗ Error downloading ${img.folder}/${img.name}: ${err.message}`);
      failures++;
    }
  }

  console.log(`\nDivided download summary: ${successes} succeeded, ${failures} failed.`);
}

main();
