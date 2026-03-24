const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      walk(fp);
    } else if (fp.endsWith('.tsx') || fp.endsWith('.ts')) {
      let c = fs.readFileSync(fp, 'utf8');
      const orig = c;
      c = c.replace(/getSupabaseServerPublicClient\(\)/g, 'getSupabaseServerClient()');
      c = c.replace(
        /import \{ getSupabaseServerPublicClient,\s*getSupabaseServerClient \} from "@\/lib\/supabase\/server"/g,
        'import { getSupabaseServerClient } from "@/lib/supabase/server"'
      );
      c = c.replace(
        /import \{ getSupabaseServerPublicClient \} from "@\/lib\/supabase\/server"/g,
        'import { getSupabaseServerClient } from "@/lib/supabase/server"'
      );
      if (c !== orig) {
        fs.writeFileSync(fp, c);
        console.log('Fixed:', fp);
      }
    }
  }
}

walk('app');
console.log('Done.');
