# Drug_PhamacyApp

โปรเจกต์นี้เป็นระบบช่วยค้นหาและวิเคราะห์ข้อมูลยาในประเทศไทย ประกอบด้วยทั้ง Web Application (React + OCR) และเครื่องมือ Python สำหรับประมวลผลข้อมูลยา

## โครงสร้างโปรเจค (อัปเดต 2024)

```
Drug_PhamacyApp/
│
├── backend/                  # โค้ด Python และข้อมูล
│   ├── analyze_drug_forms.py
│   ├── chromedriver.exe
│   ├── count_drugs.py
│   ├── duplicate_drug_names.txt
│   ├── Name_Ya_all.txt
│   ├── processed_keywords.txt
│   ├── requirements.txt
│   ├── skipped_drug_names.txt
│   ├── test_model/
│   └── data/
│       ├── drug_backup.csv
│       ├── drug_backup.json
│       ├── drug_backup.txt
│       ├── drug_backup.xlsx
│       ├── drug_full_details.csv
│       ├── drug_full_details.json
│       ├── drug_full_details.txt
│       └── drug_full_details.xlsx
│
├── frontend/
│   └── drug-label-ocr/       # React App (Vite)
│
├── docs/
│   ├── notefile/
│   └── Web_app/
│
├── README.md
├── render.yaml
├── vercel.json
├── .gitignore
└── (ไฟล์ config อื่นๆ)
```

## อัปเดตล่าสุด

- ระบบ Web App (React) เปลี่ยนเป็นใช้ไฟล์ local (`drug_backup.json`) เป็นหลัก 100% ไม่ต้องพึ่ง API ภายนอก
- ปรับปรุงระบบค้นหาและแสดงข้อมูลยาให้รองรับทั้งชื่อการค้าและชื่อสามัญ
- ปรับ UI/UX หน้า Search ให้รายการสุดท้ายไม่โดนทับ Bottom Navigation
- ปรับหน้า DrugDetails ให้แสดงชื่อสามัญเป็นหัวข้อหลัก และรองรับ query string (`/drug-details?name=...`)
- ปรับ Route และการอ่าน query string ให้เหมาะกับ static hosting
- เพิ่มคู่มือ deploy ทั้ง frontend และ backend ขึ้น Render ใน README.md
- ปรับปรุง README.md ให้มีรายละเอียดการใช้งานและโครงสร้างโปรเจคที่อัปเดตล่าสุด

## ฟีเจอร์หลัก

### 1. Web Application (React: drug-label-ocr)
- **ค้นหาข้อมูลยา** ด้วยชื่อ, หมวดหมู่, หรือสแกนฉลากยา (OCR)
- **สแกนฉลากยา** ด้วยกล้องหรืออัปโหลดรูปภาพ แล้วใช้ OCR (Tesseract.js) เพื่อแปลงข้อความบนฉลากเป็นข้อมูลสำหรับค้นหา
- **แสดงรายละเอียดของยา** เช่น ชื่อสามัญ, ชื่อการค้า, รูปแบบยา, วิธีใช้, อาการข้างเคียง, การเก็บรักษา ฯลฯ
- **แนะนำยาที่คล้ายกัน** และแสดงประวัติการดูยา
- **รองรับการใช้งานบนมือถือ** และมี UI ที่ใช้งานง่าย

### 2. เครื่องมือ Python สำหรับประมวลผลข้อมูลยา
- **count_drugs.py**: ดึงรายชื่อยาทั้งหมดจากเว็บไซต์ yaandyou.net และบันทึกลงไฟล์
- **analyze_drug_forms.py**: วิเคราะห์และสรุปรูปแบบยาที่มีในฐานข้อมูล (เช่น เม็ด, น้ำ, ครีม ฯลฯ)
- **test_model/web_test_v05.1.py**: สคริปต์สำหรับดึงและประมวลผลข้อมูลยาแบบอัตโนมัติจากแหล่งข้อมูลออนไลน์ พร้อมฟังก์ชันทำความสะอาดข้อมูล, ตรวจสอบชื่อซ้ำ, และบันทึกผลลัพธ์ในหลายรูปแบบ (CSV, JSON, TXT, Excel)

### 3. ฐานข้อมูลและไฟล์ข้อมูล
- **drug_full_details.json/csv/txt/xlsx**: ฐานข้อมูลรายละเอียดของยา
- **drug_backup.json/csv/txt/xlsx**: สำรองข้อมูลยา
- **Name_Ya_all.txt**: รายชื่อยาทั้งหมด
- **duplicate_drug_names.txt, skipped_drug_names.txt**: รายงานชื่อยาที่ซ้ำหรือถูกข้าม
- **notefile/**: ไฟล์บันทึกโน้ตและรายละเอียดที่เกี่ยวข้องกับการพัฒนา

### 4. Web App (HTML)
- **Web_app/**: หน้าเว็บ HTML สำหรับค้นหา, ดูรายละเอียด, หมวดหมู่, ช่วยเหลือ ฯลฯ (เวอร์ชัน static)

---

## วิธีเริ่มต้นใช้งาน

### Web Application (React)
1. เข้าโฟลเดอร์ `frontend/drug-label-ocr`
2. ติดตั้ง dependencies ด้วย `npm install`
3. รันแอปด้วย `npm start`
4. เปิดใช้งานที่ http://localhost:3000

### Python Tools
1. เข้าโฟลเดอร์ `backend/`
2. ติดตั้ง dependencies จาก `requirements.txt`
3. รันแต่ละสคริปต์ตามต้องการ เช่น
   ```
   python count_drugs.py
   python analyze_drug_forms.py
   python test_model/web_test_v05.1.py
   ```

## หมายเหตุ
- path ของไฟล์ข้อมูลในโค้ด Python จะอยู่ใน `backend/data/` เช่น `backend/data/drug_full_details.json`
- test_model อยู่ใน `backend/test_model/`
- เอกสารและโน้ตอยู่ใน `docs/`

---

## ผู้พัฒนา

- Feeldown (https://github.com/Feeldown)

---

ถ้าต้องการรายละเอียดเชิงเทคนิคหรือคู่มือการใช้งานเพิ่มเติม สามารถดูในแต่ละโฟลเดอร์หรือสอบถามผู้พัฒนาได้โดยตรง 

---

## วิธี Deploy ขึ้น Render (ทั้ง Frontend และ Backend)

### 1. โครงสร้างโปรเจค (แนะนำ)
```
Drug_PhamacyApp/
  drug-label-ocr/      (frontend: React/Vite)
  backend/             (backend: Node.js/Express หรือ Python/FastAPI)
```

### 2. Deploy ฝั่ง Frontend (React/Vite)
1. เข้า [https://dashboard.render.com/](https://dashboard.render.com/)
2. กด "New" → "Static Site"
3. เลือก repo โปรเจคนี้
4. กำหนดค่า:
   - **Root Directory:** `drug-label-ocr`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
5. กด Deploy รอจนขึ้นสถานะ Live
6. จะได้ลิงก์เว็บสำหรับ frontend

### 3. Deploy ฝั่ง Backend (Node.js/Express)
1. กด "New" → "Web Service"
2. เลือก repo โปรเจคนี้
3. กำหนดค่า:
   - **Root Directory:** `backend` (ถ้า backend อยู่ในโฟลเดอร์นี้)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (หรือ `node index.js` ตามที่ตั้งไว้ใน package.json)
4. กด Deploy รอจนขึ้นสถานะ Live
5. จะได้ลิงก์ backend API (เช่น https://your-backend.onrender.com)

### 4. เชื่อมต่อ Frontend กับ Backend
- ใน React ให้เรียก API ด้วย URL ที่ Render ให้มา เช่น
  `https://your-backend.onrender.com/api/xxx`
- ถ้า frontend กับ backend คนละ domain ให้ backend เปิด CORS ด้วย (Express: `app.use(require('cors')())`)

### 5. หมายเหตุ
- ถ้า deploy แล้วเจอ error ให้ดู log ในหน้า Events ของ Render
- ถ้าแก้ไขโค้ดแล้ว push ขึ้น GitHub, Render จะ auto deploy ให้ใหม่
- สามารถตั้ง Environment Variable ได้ในหน้า Environment ของแต่ละ service

---

**Deploy เสร็จแล้วจะได้ทั้ง frontend และ backend พร้อมใช้งาน สามารถแชร์ลิงก์ให้ผู้อื่นเข้าถึงได้ทันที** 