const fs=require('node:fs');const {spawnSync}=require('node:child_process');const path=require('node:path');
const edits={
 'app/membership.tsx':[["!expired?.valueOf()?.valueOf()",'!expired'],['className="checkout-dialog"','className="checkout-dialog" aria-label="Membership checkout preview"']],
 'next.config.ts':[['output: "export",','output: "export",\n  images: { unoptimized: true },']],
};
for(const [file,replacements]of Object.entries(edits)){const target=path.join(__dirname,file);const old=fs.readFileSync(target,'utf8');let next=old;for(const [from,to]of replacements)next=next.replace(from,to);if(old===next)continue;const patch='*** Begin Patch\n*** Delete File: '+target+'\n*** Add File: '+target+'\n'+next.trimEnd().split(/\r?\n/).map(l=>'+'+l).join('\n')+'\n*** End Patch';const r=spawnSync('C:/Users/kushv/AppData/Local/OpenAI/Codex/bin/12219cbfbcbddde7/codex.exe',['--codex-run-as-apply-patch',patch],{encoding:'utf8'});console.log(r.stdout,r.stderr);if(r.status)process.exit(r.status);}
