#  DETAYLI KURULUM REHBERİ - Sıfırdan Başlayanlar İçin

Bu rehber, hiç yapmadığınız şeyleri adım adım öğrenmeniz için hazırlanmıştır.

##  İÇİNDEKİLER

1. PostgreSQL Kurulumu ve Veritabanı Oluşturma
2. Redis Kurulumu  
3. Environment Dosyalarını Düzenleme
4. OpenAI API Key Alma
5. Projeyi Çalıştırma

---

## 1. PostgreSQL Kurulumu ve Veritabanı Oluşturma

### PostgreSQL Nedir?
PostgreSQL, verilerinizi saklamak için kullanılan bir veritabanı programıdır.

### Adım 1: PostgreSQL Kurulumu

1. https://www.postgresql.org/download/windows/ adresine gidin
2. "Download the installer" butonuna tıklayın
3. İndirdiğiniz .exe dosyasını çalıştırın
4. Kurulum sırasında size bir şifre soracak - MUTLAKA NOT EDİN!
5. Port numarası için 5432'yi kullanın

### Adım 2: Veritabanı Oluşturma (pgAdmin ile)

1. Başlat menüsünden "pgAdmin 4" arayın ve açın
2. Sol tarafta "Servers" > PostgreSQL'e sağ tıklayın
3. "Connect Server" seçin, şifrenizi girin
4. "Databases" üzerine sağ tıklayın
5. "Create" > "Database..." seçin
6. Database name: prompt_platform yazın
7. "Save" butonuna tıklayın

---

## 2. Redis Kurulumu

### Redis Nedir?
Redis, hızlı veri saklama için kullanılan bir programdır.

### Windows için Redis Kurulumu

**Yöntem 1: Memurai (Kolay)**

1. https://www.memurai.com/get-memurai adresine gidin
2. "Download Memurai Developer Edition" indirin
3. .msi dosyasını çalıştırın ve kurun
4. Redis otomatik başlar

**Yöntem 2: WSL ile**

1. PowerShell'i Yönetici olarak açın
2. wsl --install komutunu çalıştırın
3. Bilgisayarı yeniden başlatın
4. WSL terminalinde: sudo apt install redis-server
5. sudo service redis-server start

---

## 3. Environment Dosyalarını Düzenleme

### Adım 1: backend/.env Dosyasını Açın

1. prompt-platform/backend/.env dosyasını bulun
2. Notepad ile açın

### Adım 2: Şu Değerleri Değiştirin

```env
# PostgreSQL şifrenizi yazın:
DATABASE_PASSWORD=postgres123

# Rastgele bir şifre oluşturun (32+ karakter):
JWT_SECRET=MySuperSecretKey12345678901234567890

# OpenAI API key'inizi yazın (sonraki bölümde öğreneceksiniz):
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### Adım 3: Dosyayı Kaydedin

Ctrl + S ile kaydedin

---

## 4. OpenAI API Key Alma

### Adım 1: Hesap Oluşturun

1. https://platform.openai.com adresine gidin
2. "Sign up" ile kayıt olun
3. Email doğrulaması yapın

### Adım 2: API Key Oluşturun

1. Sol menüden "API keys" seçin
2. "Create new secret key" butonuna tıklayın
3. Key'i kopyalayın (bir daha gösterilmeyecek!)
4. backend/.env dosyasına yapıştırın

### Adım 3: Kredi Yükleyin

1. "Billing" > "Add payment method"
2. Kredi kartı bilgilerinizi girin
3. En az $5 yükleyin

---

## 5. Projeyi Çalıştırma

### Adım 1: Terminal Açın

1. prompt-platform klasörüne gidin
2. Klasör içinde sağ tık > "Open in Terminal"

### Adım 2: Komutu Çalıştırın

```bash
npm run dev
```

### Adım 3: Tarayıcıda Açın

1. http://localhost:3000 - Frontend
2. http://localhost:3001/health - Backend test

### Adım 4: İlk Kullanım

1. "Sign Up" ile hesap oluşturun
2. "Create Prompt" ile ilk prompt'unuzu oluşturun
3. "Run Prompt" ile çalıştırın!

---

##  SORUN GİDERME

### Database hatası
- PostgreSQL çalışıyor mu kontrol edin
- Şifre doğru mu kontrol edin
- Veritabanı oluşturuldu mu kontrol edin

### Redis hatası  
- Redis çalışıyor mu kontrol edin
- WSL: wsl service redis-server start

### OpenAI hatası
- API key doğru mu kontrol edin
- Hesapta kredi var mı kontrol edin

---

##  KONTROL LİSTESİ

- [ ] PostgreSQL kurulu
- [ ] prompt_platform veritabanı oluşturuldu
- [ ] Redis kurulu ve çalışıyor
- [ ] backend/.env düzenlendi
- [ ] OpenAI API key alındı
- [ ] npm run dev çalıştırıldı
- [ ] Tarayıcıda açıldı

 TEBRİKLER! Artık kullanmaya hazırsınız!
