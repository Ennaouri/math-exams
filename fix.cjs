const fs = require('fs');

// Fix app/api/register/route.ts
let registerCode = fs.readFileSync('app/api/register/route.ts', 'utf8');
registerCode = registerCode.replace(
  'const user = await createUser(email, password, name, validRole, userMeta, niveau, phone);',
  'const user = await createUser({ email, password, name, role: validRole, metadata: userMeta, niveau, phone });'
);
fs.writeFileSync('app/api/register/route.ts', registerCode);

// Fix app/api/quiz/route.ts
let quizCode = fs.readFileSync('app/api/quiz/route.ts', 'utf8');
quizCode = quizCode.replace('let attempt = null;', 'let attempt: any = null;');
fs.writeFileSync('app/api/quiz/route.ts', quizCode);

// Fix lib/auth.ts
let authCode = fs.readFileSync('lib/auth.ts', 'utf8');
authCode = authCode.replace(
  "dbUser = await createUser(email, '', profile.name || 'Google User', 'etudiant', userMeta);",
  "dbUser = await createUser({ email, password: '', name: profile.name || 'Google User', role: 'etudiant', metadata: userMeta });"
);
fs.writeFileSync('lib/auth.ts', authCode);

// Fix app/api/upload/route.ts
let uploadCode = fs.readFileSync('app/api/upload/route.ts', 'utf8');
uploadCode = uploadCode.replace('const formData = await request.formData();', 'const formData = await request.formData() as any;');
fs.writeFileSync('app/api/upload/route.ts', uploadCode);

// Fix app/generateSitemap.ts
let genSitemapCode = fs.readFileSync('app/generateSitemap.ts', 'utf8');
genSitemapCode = genSitemapCode.replace(/pool\.query<[^>]+>/g, 'pool.query');
fs.writeFileSync('app/generateSitemap.ts', genSitemapCode);

// Fix app/sitemap.ts
let sitemapCode = fs.readFileSync('app/sitemap.ts', 'utf8');
sitemapCode = sitemapCode.replace(/pool\.query<[^>]+>/g, 'pool.query');
fs.writeFileSync('app/sitemap.ts', sitemapCode);

// Fix lib/db.ts
let dbCode = fs.readFileSync('lib/db.ts', 'utf8');
dbCode = dbCode.replace('let ucData = null;', 'let ucData: any = null;');
fs.writeFileSync('lib/db.ts', dbCode);
