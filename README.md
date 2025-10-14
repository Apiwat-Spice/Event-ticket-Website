# Event Ticketing (Node/Express/EJS/MongoDB)

## Quick start
1. copy `.env.example` to `.env` and set MONGO_URI and SESSION_SECRET
2. `npm install`
3. `npm run seed` (creates sample users/events)
4. `npm run dev` or `npm start`

Default seed users:
- organizer: json wallhee / jz / org@example.com / 1 
- attendee: json2 wallhee / jz2 / att@example.com / 2

to do list 
✅แก้ไขโปรไฟล์ ตรวจบัค UI 
✅โปรไฟล์เพิ่ม ส่วนดู ประวัติ event
✅เพิ่มเงินให้ organizer เมื่อ att ซื้อ
✅ถอนตังค์ได้ UI
ใช้คราวด์

!! กู re mongo แล้ว organizer add event แล้วรูปไม่ขึ้นฝากแก้ที่ Bro (หรือไม่ก็เปลี่ยนไปใช้ cloud เลยก็ได้)
จารย์บอกต้องมีเพิ่มรอบได้ด้วย -> เหมือนดูหนังมีรอบ เช้า บ่าย  เย็น 
มีที่นั่งด้วย ปล จารย์นึกว่าต้องมี but กลุ่มไอกล้องไปเถียงกับจารย์ว่าไม่มีใน PDF โจทย์
QR scan เพื่อเช็คชื่อเหมือนเป็น บัตร/ตั๋ว เข้างาน หรือ เอา QR ส่งใน email ก็ได้
ยังไม่ได้ทำตรวจสอบ วันที่เริ่ม ถึง วันที่จบ 
-วันที่จบน้อยกว่าวันที่เริ่มไม่ได้


