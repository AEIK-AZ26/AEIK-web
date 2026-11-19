# Azərbaycan Elm və İnnovasiya Könüllüləri (AEİK) — Veb Sayt və Şəxsi Kabinet

Bu layihə **Azərbaycan Elm və İnnovasiya Könüllüləri (AEİK)** təşkilatının rəsmi veb saytı, autentifikasiya sistemi (Login & Register) və **İdarə Heyəti Şəxsi Kabineti** (Board Management Dashboard) üçün hazırlanmış tam funksional tətbiqdir.

---

## 🚀 Texnoloji Yığın (Tech Stack)

- **Frontend**: Next.js 14 (React 18), Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes (Node.js)
- **Verilənlər Bazası**: Google Cloud Firestore & Firebase Auth
- **Yerləşdirmə (Deploy)**: Vercel (1 kliklə birbaşa yerləşdirmə üçün tam hazır)

---

## 📋 Şəxsi Kabinetin Əsas Bölmələri (10 Modul)

1. **Hesabatlar (`reports`)**:
   - Əsas Google Drive qovluğuna sürətli keçid
   - Departamentlər üzrə 12 ayın Drive linkləri (*Layihələrin idarə olunması*, *SMM və dizayn*, *Jurnal və layihələr*)
   - Adminlər üçün istənilən ayın Drive linkini dəyişmə və saxlama imkanı
2. **Aktivlik / Davamiyyət (`activity`)**:
   - İdarə heyəti üzvlərinin qeydiyyatı və siyahısı
   - 12 ay üzrə davamiyyət matrisi (`+` qatıldı, `−` qatılmadı, `boş`)
   - Aylar üzrə dinamik iştirak sütun qrafiki
   - Hər üzv üzrə fərdi iştirak faizi və irəliləyiş zolağı (progress bar)
3. **Layihələr (`projects`)**:
   - Dövri və Böyük layihələrin qeydiyyatı, filtrlənməsi
   - Mərhələlər: *Planlaşma*, *Hazırlıq*, *İcrada*, *Tamamlandı*
   - İştirakçı sayı, məsul şəxs, qonaqlar və təfərrüat qeydləri
   - Hər layihəyə xüsusi təqvim tarixləri təyin etmə
4. **Təqvim / Fəaliyyət Planı (`calendar`)**:
   - İllik və aylıq naviqator
   - 7 günlük interaktiv təqvim qridi (B.e. - Baz)
   - Layihələr üçün xüsusi rəng çipləri ilə hadisələrin vizual görüntüsü
   - Günə klikləyərək tədbir əlavə etmə və aylıq hadisələr siyahısı
5. **Post Planı (`posts`)**:
   - SMM paylaşımlarının qeydiyyatı (Instagram, Facebook, LinkedIn, Telegram, X)
   - Statuslar: *İdeya*, *Hazırlanır*, *Təsdiqdə*, *Paylaşıldı*
   - Layihə ilə əlaqələndirmə və nəticə linkinin əlavə edilməsi
6. **Əməkdaşlıq (`partners`)**:
   - Tərəfdaş universitetlər, dövlət qurumları, QHT-lər və sponsorlar
   - Statuslar: *Əlaqə qurulub*, *Danışıqlar*, *Razılaşma*, *Aktiv*, *Dayandırılıb*
   - Əlaqə şəxsi, son əlaqə tarixi və növbəti addım qeydi
7. **Nəticələr (`results`)**:
   - Əldə olunan nailiyyətlər, qrantlar, sponsorluqlar və statistik nəticələr
   - Məbləğ və ya say göstəricisi, hesabat və sənəd linkləri
8. **İclaslar və Qərarlar (`meetings`)**:
   - İclas protokolları, müzakirə gündəliyi və qəbul olunmuş rəsmi qərarlar
9. **Görüləcək İşlər (`tasks`)**:
   - Tapşırıqlar lövhəsi (*Gözləyir*, *Davam edir*, *Tamam*)
   - Məsul şəxs və təfərrüat qeydləri
10. **Qeydlər (`notes`)**:
    - Daxili xatırlatmalar və təşkilati qeydlər jurnalı

---

## 🔒 Autentifikasiya və Rollar

- **Giriş (Login)**: Email və şifrə ilə daxil olma. Həmçinin dərhal yoxlamaq üçün **1 kliklə Admin və Üzv kimi test girişi** düymələri mövcuddur.
- **Qeydiyyat (Register)**: Ad, soyad, email, şöbə seçimi və şifrə ilə qeydiyyat.
- **Rollar**:
  - `Admin`: Məlumatları əlavə edir, redaktə edir, silir və üzvlərin davamiyyətini qeyd edir.
  - `Üzv`: Panel məlumatlarını izləyir, tapşırıqları və layihələri görür.
  - *Qeyd: Paneldəki header-də yerləşən "Admin / Üzv" düyməsi ilə istənilən vaxt iki baxış rejimini dərhal dəyişib sınaqdan keçirə bilərsiniz.*

---

## 💾 Firebase & Firestore İnteqrasiyası

Tətbiq **Cloud Firestore** və **Firebase Auth** ilə tam inteqrasiya üçün kodlaşdırılmışdır.

### Firebase açarlarını necə əlavə etmək olar?
1. Layihənin ana qovluğunda `.env.local` adlı fayl yaradın (və ya `.env.example` faylının adını dəyişin).
2. Firebase Console-dan (`https://console.firebase.google.com`) əldə etdiyiniz parametrləri daxil edin:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aeik-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aeik-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aeik-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

> **İnnovativ Demo Xüsusiyyəti**: Firebase açarlarını hələ daxil etməsəniz belə, tətbiq daxili **LocalStorage rejimində** işləyir və bütün dataları yaddaşda saxlayır. Firebase açarlarını daxil etdiyiniz anda isə məlumatlar birbaşa Google Cloud Firestore ilə sinxronlaşır.

---

## 💻 Layihəni Lokal İşə Salmaq

```bash
# Asılılıqları quraşdırın (artıq quraşdırılıb)
npm install

# İnkişaf serverini işə salın
npm run dev
```

Brauzerinizdə `http://localhost:3000` ünvanını açın:
- **Əsas Sayt**: `http://localhost:3000`
- **Şəxsi Kabinet**: `http://localhost:3000/kabinet`
- **Giriş**: `http://localhost:3000/login`
- **Qeydiyyat**: `http://localhost:3000/register`

---

## ☁️ Vercel-də Deploy Etmək

Layihə Next.js üzərində qurulduğu üçün Vercel-də yerləşdirmək olduqca sadədir:
1. Layihəni GitHub / GitLab / Bitbucket reponuza göndərin (`git push`).
2. [Vercel](https://vercel.com) saytına daxil olun və "Add New Project" seçib reponuzu seçin.
3. "Environment Variables" bölməsinə Firebase açarlarınızı əlavə edin (istəyə bağlı).
4. **Deploy** düyməsinə klikləyin. 1 dəqiqə ərzində saytınız canlı yayımda olacaq!
