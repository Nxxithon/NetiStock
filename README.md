# NetiStock

## 🛠 การติดตั้งและรันระบบ (Setup & Installation)

### 1. การเตรียมฐานข้อมูล (Database Setup)
ทางเราได้แนบไฟล์ฐานข้อมูล (**SQL Server**) ไปให้ในโปรเจกต์แล้ว กรุณาดำเนินการดังนี้:
1.  ทำการ **Restore Database** จากไฟล์ โฟลเดอร์ Database `automotion.bak` ไฟล์ฐานข้อมูลเข้ากับ SQL Server ของท่าน
2.  ตรวจสอบชื่อฐานข้อมูลให้เป็น `automotion` (หรือแก้ไขชื่อตามต้องการในไฟล์ `.env` ของฝั่ง API)
3.  ตรวจสอบการเชื่อมต่อในส่วนของ **Connection String** ในไฟล์ `NetiStock/.env` ให้ตรงกับชื่อเครื่อง (Server Name) ของท่าน

### 2. การรันฝั่ง Backend (ASP.NET Core API)  โฟลเดอร์  source
1.  เข้าไปที่โฟลเดอร์โครงการ:
    ```bash
    cd source/repos/NetiStock/NetiStock
    ```
2.  รันคำสั่งเพื่อติดตั้ง Dependencies และรันโปรเจกต์:
    ```bash
    dotnet restore
    dotnet run
    ```
    *ระบบจะรันอยู่ที่: `https://localhost:7241`*

### 3. การรันฝั่ง Frontend (React + Vite) โฟลเดอร์ netistock-web

1.  เข้าไปที่โฟลเดอร์เว็บ:
    ```bash
    cd netistock-web
    ```
2.  ติดตั้งโมดูลที่จำเป็น:
    ```bash
    npm install
    ```
3.  รันระบบ Frontend:
    ```bash
    npm run dev
    ```
    *ระบบจะรันอยู่ที่: `http://localhost:5173`*

---

## 🏗 โครงสร้างระบบ

ระบบนี้ใช้หลักการ 
ทำหน้าที่สร้างรายการ "รับเข้า (Receive)" หรือ "เบิกออก (Withdraw)" ในหน้า **Transaction Page**
ทำหน้าที่ตรวจสอบและกด "ยืนยัน" หรือ "ยกเลิก" การนำเข้าสินค้า ในหน้า **History Page** เพื่อให้สต็อกสินค้าเปลี่ยนแปลงจริง

---

