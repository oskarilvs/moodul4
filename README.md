# SHOYU & CO. — Backend

Node.js + Express backend SHOYU & CO. ramen baari veebisaidile.  
Sisaldab admin paneeli menüühalduseks ja töötavat kontaktivormi.

---

## Tehnoloogia valik: Node.js + Express

### Miks Node.js?

Node.js on JavaScripti käituskeskkond, mis töötab serveripoolselt V8 mootoril. Selle projekti jaoks oli Node.js loogiline valik mitmel põhjusel.

**Eelised:**

- **Ühtne keel kogu stackis.** Nii frontend (React) kui backend on kirjutatud JavaScriptis. See tähendab, et andmetüübid, valideerimisloogika ja utiliidid on kergesti jagatavad mõlema osapoole vahel ilma keeltevahelise konverteerimiseta.
- **Suur ökosüsteem (npm).** npm-is on üle 2 miljoni paketi. Selle projekti vajadused — sessioonihalldus, failiüleslaadimine, e-posti saatmine, andmebaas, CSRF-kaitse — kõik said lahendatud küpsete, hästi hooldatud pakettidega ilma midagi nullist kirjutamata.
- **Kiire arendus.** Express on minimalistlik raamistik ilma range struktuurita. Ruutide, vahevara ja vaadete lisamine on kiire ja paindlik, mis sobib hästi väiksema mahuga projektile nagu restoran-admin paneel.
- **Asünkroonne I/O.** Node.js sündmuspõhine mudel sobib hästi veebirakendustele, kus enamik aega kulub I/O-le (andmebaasipäringud, e-posti saatmine), mitte arvutustele.
- **Lihtne juurutamine.** Node.js rakendus vajab ainult `node server.js` käsku — ei ole vaja eraldi veebiserver (Apache/Nginx) seadistada arenduse ajal.

**Miinused:**

- **Ei sobi arvutusmahukatele ülesannetele.** Node.js on ühe lõimega (single-threaded). Kui rakendus peaks tegema keerulisi arvutusi (nt piltide töötlemine, ML), blokeeritaks kogu server. Selle projekti jaoks see probleem ei kehti.
- **Callback / async keerukus.** Asünkroonse koodi kirjutamine (`async/await`, Promise-id) on algajatele raskem kui sünkroonne kood Pythonis või PHP-s. Vead on raskemini leitavad.
- **Lahtise struktuuriga raamistik.** Express ei sunni ühtegi arhitektuurimustrit peale. Suuremas projektis võib see viia korratu koodini, kui arendaja ise head konventsioonid ei vali. NestJS (Angular-stiilis) lahendab selle, kuid on keerulisem.

### Alternatiivid ja miks neist loobuti

| Alternatiiv | Põhjus, miks ei valitud |
|---|---|
| **Python + Django** | Tugevam struktuur, kuid erinev keel frontendist; aeglasem protüüpimine väikeses projektis |
| **PHP + Laravel** | Küps ja populaarne, kuid ei kasuta JavaScript ökosüsteemi; suurem õppimiskõver |
| **Node.js + NestJS** | Sobib paremini suurele meeskonnale; liiga palju boilerplate'i lihtsa admin paneeli jaoks |
| **Node.js + Fastify** | Kiirem kui Express, kuid väiksem ökosüsteem ja vähem õppematerjale |

**Kokkuvõte:** Node.js + Express pakub selle projekti skaalal parima tasakaalu kiire arenduse, JavaScripti ühtsuse ja küpsete turvateekide vahel.

---

## Nõutav tarkvara

| Tarkvara | Versioon | Allalaadimislink |
|---|---|---|
| **Node.js** | 18 LTS või uuem | https://nodejs.org |
| **npm** | kaasas Node.js-iga | — |
| **Git** | suvaline | https://git-scm.com |

> SQLite andmebaas on kaasas (`better-sqlite3` pakett) — eraldi andmebaasiserverit **ei ole vaja**.

---

## Paigaldamine

### 1. Klooni repositoorium

```bash
git clone <repo-url>
cd moodul4
```

### 2. Installi sõltuvused

```bash
npm install
```

### 3. Sea üles keskkonna muutujad

```bash
# Kopeeri näidisfail
cp .env.example .env
```

Ava `.env` ja täida väljad:

```env
PORT=3000
SESSION_SECRET=vali-pikk-juhuslik-string

# Admin konto (luuakse automaatselt esimesel käivitamisel)
ADMIN_EMAIL=admin@shoyu.ee
ADMIN_PASSWORD=turvaline-parool

# E-posti saatmine (valikuline — kontaktivorm salvestab sõnumid ka ilma selleta)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=sinu@gmail.com
MAIL_PASS=rakenduse-parool        # Gmail App Password
MAIL_TO=info@shoyu.ee
```

> **Gmail App Password seadistamine:**  
> Google konto → Turvalisus → 2-sammuline kinnitamine → Rakenduse paroolid

### 4. Lisa algsed andmed (valikuline)

```bash
npm run seed
```

See lisab 22 menüükirjet moodul3 frontendist andmebaasi.

### 5. Käivita server

```bash
# Tootmisrežiim
npm start

# Arendusrežiim (automaatne taaskäivitus muudatustel)
npm run dev
```

Server töötab aadressil: **http://localhost:3000**

---

## Kasutamine

| URL | Kirjeldus |
|---|---|
| `http://localhost:3000/admin` | Admin paneel (suunab sisselogimisele) |
| `http://localhost:3000/admin/login` | Admin sisselogimine |
| `http://localhost:3000/admin/menu` | Menüükirjete loend |
| `http://localhost:3000/admin/menu/new` | Lisa uus roog |
| `http://localhost:3000/admin/messages` | Kontaktisõnumid |
| `http://localhost:3000/api/menu` | REST API — kõik menüükirjed (JSON) |
| `http://localhost:3000/api/menu/:id` | REST API — üks kirje |
| `http://localhost:3000/api/contact` | REST API — kontaktivorm (POST) |

### Admin vaikeväärtused

- **E-post:** väärtus `.env` failis (`ADMIN_EMAIL`)  
- **Parool:** väärtus `.env` failis (`ADMIN_PASSWORD`)  
- Vaikimisi (kui `.env` puudub): `admin@shoyu.ee` / `admin123`

---

## REST API näited

### GET /api/menu

```bash
curl http://localhost:3000/api/menu
curl http://localhost:3000/api/menu?category=Ramen
curl http://localhost:3000/api/menu?sort=asc
```

### GET /api/menu/categories

```bash
curl http://localhost:3000/api/menu/categories
```

### POST /api/contact

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mari Maasikas",
    "email": "mari@email.ee",
    "subject": "Broneering",
    "message": "Tere, soovin reserveerida laua viiele."
  }'
```

---

## Menüükirje väljad (admin vorm)

| Väli | Tüüp | Kohustuslik | Selgitus |
|---|---|---|---|
| **Nimi** | tekst | ✅ | Roa nimi |
| **Kategooria** | valik | ✅ | Eripakkumised, Ramen, Eelroad jne |
| **Kirjeldus** | tekst | — | Roa lühikirjeldus |
| **Hind** | number | ✅ | Hind eurodes (nt `15.50`) |
| **Vürtsisus** | 0–3 | — | 0 = ei ole, 3 = väga vürtsikas |
| **Koostis** | tekst | — | Komadega eraldatud koostisosad |
| **Allergeenid** | tekst | — | Komadega eraldatud allergeenid |
| **Pilt** | fail | — | Max 5 MB, JPG/PNG/WebP |
| **Uus** | märkeruut | — | Kuvab "Uus" märgist |

---

## Projekti struktuur

```
moodul4/
├── server.js              # Serveri sisendpunkt
├── package.json
├── .env.example           # Keskkonna muutujate näidis
├── .gitignore
├── README.md
├── database/
│   ├── db.js              # SQLite ühendus ja skeema
│   └── seed.js            # Algsete andmete lisamine
├── middleware/
│   └── auth.js            # Sessiooni autentimise kontroll
├── routes/
│   ├── admin.js           # Admin paneel (HTML vaated)
│   └── api/
│       ├── menu.js        # Avalik menüü API
│       └── contact.js     # Kontaktivorm API
├── views/                 # EJS mallid
│   ├── login.ejs
│   ├── dashboard.ejs
│   ├── messages.ejs
│   ├── menu/
│   │   ├── index.ejs      # Menüükirjete loend
│   │   └── form.ejs       # Lisa/muuda vorm
│   └── partials/
│       └── nav.ejs        # Navigatsioon
└── public/
    └── uploads/           # Üleslaaditud pildid
```

---

## Kasutatavad paketid

| Pakett | Eesmärk |
|---|---|
| `express` | Veebiraamistik |
| `ejs` | HTML mallimootor admin vaadete jaoks |
| `express-session` | Sessiooni haldus |
| `bcryptjs` | Parooli räsimine |
| `better-sqlite3` | SQLite andmebaas |
| `multer` | Pildifailide üleslaadimine |
| `nodemailer` | E-posti saatmine |
| `dotenv` | Keskkonna muutujad |
| `concurrently` | Backend + frontend samaaegne käivitamine |

---

## Turvalisus

### Paroolid räsitud (bcrypt)
Admin parool salvestatakse andmebaasi `bcrypt` räsina (cost factor 10).  
Avateksti parooli **ei salvestata** kunagi.

```javascript
// Räsimine (db.js / seed.js)
const hash = bcrypt.hashSync(password, 10);

// Kontrollimine (admin.js)
bcrypt.compareSync(inputPassword, storedHash)
```

### SQL-i süsti kaitse — parameetritega päringud
Kõik andmebaasipäringud kasutavad `better-sqlite3` ettevalmistatud lauseid (`prepare().run(...)` / `.get(...)`). Kasutaja sisend **ei ühildu** kunagi otse SQL-stringiga.

```javascript
// ✅ Õige — parameetriga
db.prepare('SELECT * FROM admins WHERE email = ?').get(email)

// ❌ Vale — string konkatenatsioon (ei kasutata)
db.prepare(`SELECT * FROM admins WHERE email = '${email}'`)
```

### Serveripoolne sisendi valideerimine
Kõik vormid valideeritakse serveris (`middleware/validate.js`):

| Väli | Kontrollid |
|---|---|
| Nimi | kohustuslik, max 120 märki |
| E-post | kohustuslik, regex formaat, max 254 märki |
| Teema | max 200 märki |
| Sõnum | kohustuslik, max 5000 märki |
| Hind | kohustuslik, arv, vahemik 0–10 000 |
| Vürtsisus | täisarv, vahemik 0–3 |
| Kategooria | peab kuuluma lubatud loendisse |
| ID parameetrid | valideeritakse positiivse täisarvuna |

### CSRF-kaitse
Kõik oleku muutvad vormid (login, lisa/muuda/kustuta roog, kustuta sõnum, logout) sisaldavad varjatud CSRF-tokeni välja.

Token genereeritakse sessiooni loomisel (`crypto.randomBytes(32)`) ja kontrollitakse iga POST päringu töötlemisel. Kehtetu tokeniga päring saab `403 Forbidden` vastuse.

Pärast edukat sisselogimist **regenereeritakse sessioon** (kaitse session fixation rünnakute vastu).

### Saladused keskkonnamuutujates
`.env` fail on `.gitignore`-is ja **ei jõua** kunagi repositooriumisse.  
Koodis ei ole ühtegi parooli, API võtit ega muud saladust.

```
.env             ← ainult kohalik, gitignore'd
.env.example     ← näidis ilma pärisväärtusteta, gitis OK
```

---

## Andmebaasi struktuur

Skeem asub failis `database/schema.sql`. Tabelid luuakse automaatselt serveri esimesel käivitamisel (`database/db.js`).

Käsitsi andmebaasi loomiseks:

```bash
sqlite3 database/shoyu.db < database/schema.sql
```

| Tabel | Sisu |
|---|---|
| `admins` | Admin kasutajad (bcrypt parooliga) |
| `menu_items` | Menüükirjed koos kõigi väljadega |
| `contact_messages` | Kontaktivormist saadetud sõnumid |
