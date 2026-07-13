מערכת לניטור נתוני RF בזמן אמת, הכוללת ממשק משתמש וניהול נתונים בבסיסי נתונים שונים.

רכיבי תשתית
המערכת מבוססת על Docker להרצת השירותים הבאים:

PostgreSQL: אחסון נתוני דגימות (Samples).

MongoDB: אחסון התראות (Alerts).

Redis: ניהול תורים/Caching.

MinIO: אחסון קבצים אובייקטיבי.

הוראות הפעלה
1. הרצת התשתית
יש להריץ את קובץ ה-Docker Compose כדי להרים את בסיסי הנתונים והשירותים הנדרשים:

Bash
docker-compose up -d
2. הפעלת ה-Backend
לאחר שהתשתית פעילה, יש להריץ את ה-API (בהתאם לשיטת העבודה שלך - דרך ה-IDE או דרך Docker container נפרד):

Bash
# דוגמה להרצה במידה וה-API מוגדר כ-Service בנפרד
docker-compose up backend
3. הפעלת ה-Frontend
יש להפעיל את ממשק ה-React:

Bash
cd frontend
npm install
npm run dev
גישה לשירותים
Frontend: http://localhost:5173

API Documentation: http://localhost:8000/docs

MinIO Console: http://localhost:9002 (משתמש: minioadmin, סיסמה: minioadmin)

PostgreSQL: localhost:5432 (משתמש: user, סיסמה: password)