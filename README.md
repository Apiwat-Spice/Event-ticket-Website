# Event Ticketing (Node/Express/EJS/MongoDB)

## Quick start
1. copy `.env.example` to `.env` and set MONGO_URI and SESSION_SECRET
2. `npm install`
3. `npm run seed` (creates sample users/events)
4. `npm run dev` or `npm start`

Default seed users:
- organizer: 
    org1 / org1@example.com / 1 
- attendee: 
    jz1 / at1t@example.com / 1

#	Firstname	Lastname	Username	Email	                Birthdate	Password
1	Ananya	    Chaiyaporn	ananya_c	ananya.c@gmail.com      1998-03-14	A!nanya2024
2	Kittisak	Wongchai	kitti_w	    kittiw99@hotmail.com    1995-11-23	Kt@1123pw
3	Nattapong	Srisuk	    nattapon9	nattapong.s@example.com 2000-07-02	Nt#2000ss
4	Prapaporn	Meesri	    prapa_m	    prapaporn.m@gmail.com   1999-12-19	Pm@9912z
5	Chanin	    Rattanakul	chanin_rk	chanin_rk@yahoo.com     1997-04-27	Cr@0427pw

6	Waranya	    Tansiri	    wara_t	    waranya.t@outlook.com   2001-05-10	Wa#1050tk 
7	Thanapat	Boonmee	    thana_bm	thanapat.bm@gmail.com   1996-09-09	Tb@9699pw
8	Sirinya	    Keawkla	    sirin_k	    sirinya.k@gmail.com     2002-01-25	Sk@0125pw
9	Phuri	    Lertchai	phuri_lc	phuri.lc@example.com    1994-08-30	Pl#9430pw
10	Kanokwan	Saelim	    kano_kw	    kanokwan.kw@gmail.com   1999-06-18	Kw@0618pw
	



แก้บัค mongo
rmdir /s /q node_modules
del package-lock.json
npm install
npm install mongodb@6.16.0
npm start