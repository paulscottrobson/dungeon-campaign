1 GOTO 769
5 FOR I=1 TO 1000:NEXT I
6 FOR I=1 TO 500:NEXT I
7 FOR I=1 TO 500:NEXT I:RETURN 
10 VLIN HY,HY+1 AT HX:VLIN HY,HY+1 AT HX+1:RETURN 
11 Q1=Q*169+X+13*(Y-1):HX=3*X-2:HY=3*Y-2:K=M(Q1)/10:RETURN 
12 X= RND (11)+2:Y= RND (11)+2:GOSUB 11:IF K#0 THEN 12:RETURN 
13 GOSUB 12:IF M(Q1+1)<-5 OR M(Q1+13)<-5 OR M(Q1+14)<-5 THEN 13:M(Q1)=0
14 COLOR= 0:FOR J=0 TO 4:VLIN HY,HY+4 AT HX+J:NEXT J
15 IF (Q#1 AND Q#2) OR I#1 THEN 16:FOR J=0 TO 1:FOR K=0 TO 1:M(Q1+J+13*K)=M(Q1+J+13*K)-90:NEXT K,J
16 M(Q1+1)=M(Q1+1)+2*((M(Q1+1) MOD 10)=-2):M(Q1+13)=M(Q1+13)+((M(Q1+13) MOD 10)=-1):Q1=Q1+ RND (2)+13*( RND (2)):RETURN 
18 V= PEEK (-16384):IF V<128 THEN 20: POKE -16368,0:RT=1:RETURN 
20 IF RT=1 AND ND#3 THEN 18:IF ND=3 THEN GOSUB 40:CR=CR+1:IF (CR MOD (5+15*(ND#3)))#0 OR RT=1 THEN 18
25 TAB 35:GS=GS-(GS>0):PRINT GS;:IF GS#0 OR ((CR MOD (10+30*(ND#3)))#0) THEN 18
30 NUM=NUM-1:PRINT :PRINT "  ONE OF YOUR PARTY DIED FROM THE GAS.";:GOSUB 5:IF NUM<=0 THEN 8325:POP :GOTO 1500
40 M=1:I= RND (2):SX=SX(1)+QX*I:SY=SY(1)+QY*(I=0)
41 IF SX<1 OR SY<1 OR SX>38 OR SY>38 THEN 60
42 N= SCRN(SX,SY):IF N=C(5) THEN 50:IF N=C(Q+1) MOD 16 OR N=C(9) THEN 60:M=1:U= SCRN(SX(8),SY(8)):COLOR= U+(8*(U#0))
45 PLOT SX(8),SY(8):COLOR= 8+(N*(N#8)):PLOT SX,SY:FOR I=8 TO 1 STEP -1:SX(I)=SX(I-1):SY(I)=SY(I-1):NEXT I:RETURN 
47 M=1:QX=(SX=1)-(SX=38):QY=(SY=1)-(SY=38):IF QX=0 THEN QX=2* RND (2)-1:IF QY=0 THEN QY=2* RND (2)-1:GOTO 40
50 COLOR= 8:PLOT SX,SY:GOSUB 6:CALL -936:PRINT :PRINT "   THE SERPENT ATE ONE OF YOUR PARTY!":COLOR= 0:GOSUB 7
55 PLOT SX,SY:FOR I=1 TO 8:PLOT SX(I),SY(I):FOR J=1 TO 200:NEXT J,I:ND=0:NUM=NUM-1:POP :GOTO 3750
60 IF M=0 THEN 47:SX=SX-QX*I+QX*(I=0):SY=SY-QY*(I=0)+QY*I:M=0:GOTO 41
500 D=0:U=625:GOSUB 600:U=620:QX=QX+SGN (HX-QX)-(HY=QY):QY=QY+SGN (HY-QY)-(HX=QX):GOSUB 600:IF D=1 THEN 700:DC=0:RETURN 
600 FOR I=-1 TO 2:L=QY:R=QX+I:GOSUB U:L=QY+1:GOSUB U:NEXT I:FOR I=0 TO 1:L=QY-1:R=QX+I:GOSUB U:L=QY+2:GOSUB U:NEXT I:RETURN 
620 IF  SCRN(R,L)=C(5) THEN D=1:COLOR= C(16):IF  SCRN(R,L)=0 THEN PLOT R,L:RETURN 
625 COLOR= 0:IF  SCRN(R,L)=C(16) THEN PLOT R,L:RETURN 
700 CALL -936:PRINT :PRINT "THE SPECTRE GOT ONE OF YOUR PARTY!":ND=0
705 U=620:GOSUB 600:COLOR= C(5):IF  SCRN(QX,QY)=C(16) THEN PLOT QX,QY:COLOR= C(16):IF  SCRN(QX+1,QY)=C(5) THEN PLOT QX+1,QY:U=625:GOSUB 600
707 QX=QX-1:IF QX>1 THEN 705:PLOT QX+1,QY:NUM=NUM-1:POP :GOTO 3750
769 REM 
770  POKE 50,63:GOSUB 5:VTAB 21:TAB 17:PRINT "  BY   ":PRINT :TAB 14:PRINT "ROBERT CLARDY":GOSUB 5
777 VTAB 21:TAB 11:PRINT "COPYRIGHT (C) 1979":PRINT :TAB 9:PRINT "BY SYNERGISTIC SOFTWARE":GOSUB 6: POKE 50,255
780  POKE 2,173: POKE 3,48: POKE 4,192: POKE 5,165: POKE 6,0: POKE 7,32: POKE 8,168: POKE 9,252: POKE 10,165: POKE 11,1: POKE 12,208
785  POKE 13,4: POKE 14,198: POKE 15,24: POKE 16,240: POKE 17,5: POKE 18,198: POKE 19,1: POKE 20,76: POKE 21,2: POKE 22,0: POKE 23,96
790 DIM SX(8),SY(8),C(16):SX=0:SY=0:NUM=15:STR=1:RT=1:GS=9:C(1)=12:C(2)=3:C(3)=9:C(4)=11:C(5)=1:C(6)=7
795 C(7)=7:C(8)=4:C(9)=15:C(10)=0:C(11)=13:C(12)=4:C(13)=14:C(14)=5:C(16)=10:GOTO 801
801 REM 
802 DIM M(676):FOR I=1 TO 676:M(I)=3:NEXT I
1001 FOR Q=0 TO 3:GR :PRINT :PRINT :TAB 8:PRINT "THIS IS THE MAP  FOR LEVEL ";Q+1:COLOR= C(Q+1)
1003 FOR I=0 TO 39:VLIN 0,39 AT I:NEXT I:COLOR= 0:GOSUB 12:C=121
1030 GOSUB 12:IF M(Q1)<0 THEN 1030:C=121
1035 IF C#1 THEN 1040:COLOR= C(Q+1):FOR Q1=Q*169+1 TO (Q+1)*169:IF M(Q1)>0 THEN M(Q1)=-63
1036 NEXT Q1:GOTO 1200
1040 R=0:D=0:L=0:U=0:GOSUB 11:GOSUB 10:M(Q1)=-ABS (M(Q1)):C=C-1
1050 IF X#13 THEN R=M(Q1+1)>0:IF Y#13 THEN D=M(Q1+13)>0:IF X#1 THEN L=M(Q1-1)>0:IF Y#1 THEN U=M(Q1-13)>0
1080 K=R+D+L+U:IF (K<3 AND  RND (10)<2) OR K=0 THEN 1170
1110 GOTO 1130+10* RND (4)
1130 IF NOT R THEN 1110:M(Q1)=M(Q1)+1:X=X+1:VLIN 3*Y-2,3*Y-1 AT 3*(X-1):GOTO 1035
1140 IF NOT D THEN 1110:M(Q1)=M(Q1)+2:Y=Y+1:HLIN 3*X-2,3*X-1 AT 3*(Y-1):GOTO 1035
1150 IF NOT L THEN 1110:M(Q1-1)=M(Q1-1)-1:X=X-1:VLIN 3*Y-2,3*Y-1 AT 3*X:GOTO 1035
1160 IF NOT U THEN 1110:M(Q1-13)=M(Q1-13)-2:Y=Y-1:HLIN 3*X-2,3*X-1 AT 3*Y:GOTO 1035
1170 X= RND (13)+1:Y= RND (13)+1:GOSUB 11:IF M(Q1)>0 THEN 1170:C=C+1:GOTO 1035
1200 FOR I=1 TO 5:GOSUB 13:IF I>2 THEN M(Q1)=M(Q1)-70:NEXT I: POKE 0,4: POKE 24,8:CALL 2:NEXT Q
1205 REM 
1210 FOR Q=0 TO 3:FOR I=1 TO 2
1212 GOSUB 12:IF M(Q1+169*(Q<3))/10=-6 OR M(Q1+338*(Q<2))/10=-6 THEN 1212:M(Q1)=M(Q1)-20:GOSUB 12:M(Q1)=M(Q1)-30:GOSUB 12:M(Q1)=M(Q1)-80
1215 NEXT I:FOR I=1 TO 3:IF Q=0 THEN 1220:GOSUB 12:IF M(Q1-169)<-5 THEN 1215:M(Q1)=M(Q1)-50
1220 NEXT I:GOSUB 12:M(Q1)=M(Q1)-40:NEXT Q:Q=3
1260 GOSUB 12:I= RND (2):J= RND (2):IF I THEN X=J*13:IF NOT I THEN Y=J*13:GOSUB 11:IF ABS (M(Q1)/10)#0 THEN 1260:WX=X:WY=Y:Q=0:GOSUB 12
1265 GR :COLOR= C(5):GOSUB 10:COLOR= C(1):HLIN 0,39 AT 0:HLIN 0,39 AT 39:VLIN 0,39 AT 0:VLIN 0,39 AT 39:GOSUB 4010
1280 DIM A$(15),B$(250),C$(5)
1290 B$="LYCANTHROPESGARGOYLES   BALROGS     VAMPIRES    GOBLINS     MIGHTY OGRESVICIOUS ORCSCYCLOPSES   SKELETONS   "
1292 B$(109)="ZOMBIES     EVIL TROLLS MUMMIES     HUGE SPIDERSWEREWOLVES  MINOTAURS   CENTAURS    BERSERKERS  GRIFFONS    "
1294 B$(217)="BASILISKS   GORGONS     "
1300 GOTO 1560
1500 CALL -936:PRINT :TAB 10:PRINT "WHAT IS YOUR COMMAND?":TAB 5:RT=((M(Q1)/10)#9):IF RT=0 THEN PRINT "GAS EXPOSURE TIME REMAINING = ";GS;
1501 GOSUB 18:IF IN=15 THEN 1520:IF ND=0 THEN GOSUB 4250:IF ND=2 THEN GOSUB 500:IF DC>0 THEN GOSUB 7000
1520 IF V=210 THEN 2000:IF V=204 THEN 2500:IF V=213 THEN 3000:IF V=196 THEN 3500:IF CP AND V=198 THEN 3755
1530 IF V=211 THEN 4310:IF V=195 THEN 8300:IF V=202 THEN 3700:IF V=197 THEN 6000:IF V=216 THEN 3740:IF IN>1 AND V=201 THEN 3900
1560  POKE 50,63:PRINT :PRINT "          LEGAL COMMANDS ARE:          ";: POKE 50,255:TAB 1:IF CP THEN PRINT "F=FLY  ";
1565 TAB 32:IF IN>1 THEN PRINT "I=INVIS  ";:IF IN=0 THEN PRINT :PRINT "L=LEFT         U=UP            E=EXIT"
1570 PRINT "R=RIGHT        S=SEARCH        J=JUMP":PRINT "D=DOWN         X=STATUS        C=COLORS";:GOTO 1501
2000 IF M(Q1) MOD 2#0 THEN 5000:DX=1:DY=0
2020 IF DW THEN GOSUB 4000:FOR I=1 TO 3:COLOR= (C(13))*((M(Q1)/10)=9):GOSUB 10:COLOR= IN+C(5):HX=HX+DX:HY=HY+DY:GOSUB 10:NEXT I:X=X+DX:Y=Y+DY
2100 GOSUB 11:IF K#-9 THEN 2120:I=X:J=Y:X=X-1:Y=Y-1
2102 GOSUB 11:IF K=-9 THEN 2105:X=X+1:IF X=I THEN 2102:Y=Y+1:X=X-2:GOTO 2102
2105 COLOR= C(13):FOR U=0 TO 4:VLIN HY,HY+4 AT HX+U:NEXT U:GOSUB 4005:X=X+1:GOSUB 4005:Y=Y+1:GOSUB 4005:X=X-1:GOSUB 4005:X=I:Y=J
2110 GOSUB 11:COLOR= IN+C(5):GOSUB 10
2120 GOSUB 4005:IF ND=1 THEN DC=DC+1:IF MP#0 THEN 4550:IF NOT V1 THEN 2130:V1=0:GOTO 1520
2130 J=1:K=ABS (K):IF Q#0 AND K=5 THEN 4110:J=0:IF Q#3 THEN IF ABS (M(Q1+169)/10)=5 THEN 4110
2145 IF EL OR (Q=0 AND Y=1) OR (Q=3 AND Y=13) THEN 2170
2150 FOR D=-1 TO 1 STEP 2:FOR U=1 TO 13 STEP 12:I=ABS (M(Q1+D*U)/10):IF I=2 OR I=3 THEN 2160:NEXT U,D:GOTO 2170
2160  POKE 50,127:CALL -936:PRINT :TAB 10:PRINT "BEWARE! DANGER NEAR!": POKE 50,255:GOSUB 7
2170 IF K=4 OR K=8 THEN 4510:IF ND=1 AND IN#15 AND X=SX AND Y=SY THEN 8000:IF K=3 THEN 4800:IF K=2 THEN 4910:GOTO 1500
2500 IF X=1 THEN 5000:IF M(Q1-1) MOD 2#0 THEN 5000:DX=-1:DY=0:GOTO 2020
3000 IF Y=1 THEN 5000:IF (ABS (M(Q1-13) MOD 10))>1 THEN 5000:DX=0:DY=-1:GOTO 2020
3500 IF (ABS (M(Q1) MOD 10))>1 THEN 5000:DX=0:DY=1:GOTO 2020
3700 V1=1:CALL -936:PRINT :TAB 15:PRINT "DIRECTION?":GOSUB 18:GOTO 1520
3740 CALL -936:C$="ALIVE":IF EL THEN C$="DEAD":PRINT "THE ELF IS ";C$;". THE DWARF IS ";:C$="ALIVE":IF DW THEN C$="DEAD":PRINT C$;"."
3750 PRINT "YOUR PARTY NOW NUMBERS ";NUM:PRINT "TOTAL STRENGTH = ";NUM*STR
3751 PRINT "YOUR TREASURE IS WORTH ";S;" QUADROONS.";:GOTO 1501
3755 BX=2* RND (2)-1:BY=2* RND (2)-1
3760 I= RND (2):DX=BX*(I=0):DY=BY*I
3765 IF (X=13 AND DX=1) OR (Y=13 AND DY=1) OR (X=1 AND DX=-1) OR (Y=1 AND DY=-1) THEN 3755:IF (ABS (M(Q1+DX+13*DY))/10)=6 THEN 3755
3770 IF I THEN 3780:FOR I=1 TO 3:COLOR=  SCRN(HX+DX+(DX=1),HY)+C(5):VLIN HY,HY+1 AT HX+DX+(DX=1)
3771 COLOR= 16+ SCRN(HX+(DX#1),HY)-C(5):VLIN HY,HY+1 AT HX+(DX#1):HX=HX+DX:NEXT I:X=X+DX
3775 GOSUB 11:GOSUB 4005:IF  PEEK (-16384)<128 THEN 3760: POKE -16368,0:CP=0:IF MP THEN 4555:GOTO 2130
3780 FOR I=1 TO 3:COLOR=  SCRN(HX,HY+DY+(DY=1))+C(5):HLIN HX,HX+1 AT HY+DY+(DY=1)
3781 COLOR= 16+ SCRN(HX,HY+(DY#1))-C(5):HLIN HX,HX+1 AT HY+(DY#1):HY=HY+DY:NEXT I:Y=Y+DY:GOTO 3775
3900 IN=15*(IN=16):COLOR= IN+C(5):GOSUB 10:GOTO 5050
4000 COLOR= C(Q+1)*(C(Q+1)>16):GOTO 4010
4002 M(Q1)=-ABS (M(Q1)):GOTO 4010
4005 COLOR= C(Q+1):GOSUB 11
4010 P=M(Q1):IF P>0 AND K#5 THEN RETURN :IF DW=0 THEN M(Q1)=ABS (P)+10*(P=0):IF X>12 THEN 4020:IF M(Q1+1)>0 AND RT THEN 4020
4015 IF P MOD 2#0 THEN VLIN 3*(Y-1),3*Y AT 3*X
4020 IF X>1 THEN IF M(Q1-1) MOD 2=-1 THEN VLIN 3*(Y-1),3*Y AT 3*(X-1)
4030 IF Y>1 THEN IF (M(Q1-13) MOD 10)<-1 THEN HLIN 3*(X-1),3*X AT 3*(Y-1)
4040 IF Y>12 THEN RETURN :IF RT AND M(Q1+13)>0 THEN RETURN :IF (P MOD 10)<-1 THEN HLIN 3*(X-1),3*X AT 3*Y:RETURN 
4110 COLOR= C(9):I=SGN (M(Q1)):RT=0:GOSUB 4002:IF I>0 THEN M(Q1)=ABS (M(Q1)):RT=1:A$="DOWN":IF J THEN A$="UP"
4115 IF J=0 AND Q<3 THEN M(Q1+169)=ABS (M(Q1+169)):IF J AND Q THEN M(Q1-169)=ABS (M(Q1-169))
4120 CALL -936:PRINT :TAB 7:PRINT "STAIRWAY. GO ";A$;" IT (Y/N)?"
4130 GOSUB 18:IF V#217 THEN 2145:Q=Q-J+(J=0):FOR I=J*8+8 TO (J=0)*8+8 STEP ((J=0)-J): POKE 0,I: POKE 24,2:CALL 2
4145 FOR K=1 TO 70:NEXT K,I:GOSUB 11:CALL -936:GOSUB 4150:GOTO 2130
4150 GR :COLOR= C(5):GOSUB 10:MP=0:RT=0:ND=0:SX=-1:SY=-1:IF IN=15 THEN IN=0
4160 COLOR= C(Q+1):VLIN 0,39 AT 0:VLIN 0,39 AT 39:HLIN 0,39 AT 0:HLIN 0,39 AT 39:IF C(Q+1)>15 THEN 4420
4170 J=X:U=Y:FOR X=1 TO 13:FOR Y=1 TO 13:GOSUB 11:IF M(Q1)<=0 THEN 4190:COLOR= C(Q+1):GOSUB 4002:M(Q1)=ABS (M(Q1))
4180 IF Q#3 THEN IF (M(Q1+169)/10)=5 THEN K=5:COLOR= C(K+4):IF K=6 THEN COLOR= C(Q+1):IF K=5 THEN GOSUB 4002:IF K#5 AND K>1 THEN GOSUB 10
4190 NEXT Y,X:RT=1:X=J:Y=U:GOSUB 4005
4220 COLOR= 0:IF Q=3 AND (WY=0 OR WY=13) THEN HLIN 3*WX-2,3*WX-1 AT 3*WY:IF Q=3 AND (WX=0 OR WX=13) THEN VLIN 3*WY-2,3*WY-1 AT 3*WX:RETURN 
4250 DC=0:IF  RND (30)>0 THEN RETURN :IF Q<2 THEN 4260:IF Q=2 THEN 4256:ND=2:U=620:QX=36:QY=36:GOSUB 600: POKE 50,63:CALL -936:FOR I=1 TO 83:PRINT " ";:NEXT I
4255 PRINT "A SPECTRE HAS ENTERED THE DUNGEON";:FOR I=1 TO 83:PRINT " ";:NEXT I: POKE 50,255:GOTO 4259
4256 U=X:D=Y:QX=1:QY=1:GOSUB 12:ND=3:COLOR= 8:PLOT HX,HY:SX(8)=HX:SY(8)=HY:FOR I=8 TO 2 STEP -1
4257 DY=0:DX= RND (3)-1:IF DX=0 THEN DY=2* RND (2)-1:IF  SCRN(SX(I)+DX,SY(I)+DY)=C(Q+1) MOD 16 THEN 4257:SX(I-1)=SX(I)+DX
4258 SY(I-1)=SY(I)+DY:PLOT SX(I-1),SY(I-1):FOR J=1 TO 100:NEXT J,I:CALL -936:PRINT :PRINT "A GIANT SERPENT HAS ENTERED THE DUNGEON!":X=U:Y=D
4259 GOSUB 6:GOSUB 11:RETURN 
4260 ND=1:QX=X:QY=Y
4265 GOSUB 12:IF ABS (X-QX)+ABS (Y-QY)<6 THEN 4265:COLOR= C(14):GOSUB 10:SX=X:SY=Y:X=QX:Y=QY:QX=HX:QY=HY:GOSUB 11
4267 CALL -936:PRINT : POKE 50,127:PRINT "DANGER!!!";: POKE 50,63:PRINT " YOU WOKE A MAN-EATING DRAGON!": POKE 50,255
4270 FOR I=1 TO 70:D= PEEK (-16336):FOR J=1 TO 3:NEXT J,I:GOTO 4259
4310 GOSUB 11:IF K=7 OR K=8 THEN 4325:CALL -936:PRINT :TAB 10:PRINT "SORRY, NO TREASURE HERE.";:GOTO 1501
4325 FOR J=1 TO 8:D=J MOD 2:COLOR= C(5+6*D):GOSUB 10:FOR L=1 TO 50:NEXT L: POKE 0,8-D: POKE 24,2:CALL 2:NEXT J:M(Q1)=M(Q1)-40-(30*(K=7))
4328 L=100*( RND (10)+2+4*Q)
4330 S=S+L:CALL -936:PRINT "YOU'VE FOUND ";L;" QUADROONS WORTH OF":PRINT "GOLD AND JEWELS.";:IF  RND (2) THEN 1501
4335 PRINT " YOU'VE ALSO FOUND ":GOTO 4370+10* RND (8)
4345 I=X:J=Y:FOR X=1 TO 13:FOR Y=1 TO 13:GOSUB 11:K=ABS (K):IF K#U AND K#D THEN 4346:COLOR= C(U+4):GOSUB 10:GOSUB 4005
4346 NEXT Y,X:GOTO 5045
4370 COLOR= C(9):I=X:J=Y:FOR X=1 TO 13:FOR Y=1 TO 13:GOSUB 11:IF Q#0 AND ABS (K)=5 THEN GOSUB 4010
4375 IF Q=3 THEN 4377:K=ABS (M(Q1+169)/10):IF K#5 THEN 4377:GOSUB 4010:M(Q1+169)=ABS (M(Q1+169))
4377 NEXT Y,X:GOTO 5045
4380 U=7:D=8:GOTO 4345
4390 U=4:D=8:GOTO 4345
4400 U=2:D=3:GOTO 4345
4410 WP=1:PRINT "A MAGIC SWORD (CAN BE USED ONLY ONCE).";:GOTO 5050
4420 I=X:J=Y:C(Q+1)=C(Q+1)+16:FOR X=1 TO 13:FOR Y=1 TO 13:GOSUB 11:D=(K>=0)-(K<0):GOSUB 4005:IF ABS (K)=6 THEN GOSUB 10:M(Q1)=D*M(Q1)
4425 NEXT Y,X:GOTO 5045
4430 PRINT "A MAGIC CARPET.":CP=1:GOTO 5050
4440 PRINT "AN INVISIBILITY POTION!";:IN=16:GOTO 5050
4510 HX=HX-3*DX:HY=HY-3*DY:MX=HX:MY=HY:COLOR= C(8):GOSUB 10:MP=1:TX=X:TY=Y
4521 MSTR=15+ RND (10)+Q*20:I= RND (20)*12+1:A$=B$(I,I+11):CALL -936:PRINT "YOU'VE COME UPON "; RND (19)+5;" ";A$
4522 GOSUB 11:PRINT "THEIR STRENGTH IS ";MSTR;" WHILE YOURS":PRINT "IS ";NUM*STR;". WHAT IS YOUR COMMAND?":GOTO 1501
4550 IF HX=MX AND HY=MY AND IN#15 THEN 4710:IF (HX=MX OR HY=MY) AND IN#15 THEN 4560
4555 COLOR= C(8):HX=3*TX-2:HY=3*TY-2:GOSUB 10:COLOR= 0:HX=MX:HY=MY:GOSUB 10:GOSUB 11:MP=0:GOTO 2130
4560 HX=MX:HY=MY:FOR I=1 TO 6:COLOR= 0:GOSUB 10:COLOR= C(8):HX=HX+DX:HY=HY+DY:GOSUB 10:NEXT I:GOSUB 11:GOTO 4710
4710 FOR I=1 TO 6: POKE 0,20: POKE 24,2:COLOR= C(8):GOSUB 10:FOR L=1 TO 100:NEXT L:COLOR= C(5):GOSUB 10:CALL 2:NEXT I:I=Q*169+TX+13*(TY-1)
4711 M(I)=M(I)-10-30*((M(I)/10)=4):COLOR= C(8):PLOT HX+1,HY:PLOT HX,HY+1:IF WP=0 THEN 4713:CALL -936:PRINT :TAB 6
4712 PRINT "USE YOUR MAGIC SWORD (Y/N)?";:GOSUB 18:IF V=217 THEN 4750
4713 CALL -936:PRINT "BATTLE HAS BEGUN. HIT SPACE BAR TO ROLL DICE FOR YOUR ATTACK. HIT IT AGAIN TO   STOP DICE.";:K=0:J=0:GOSUB 18
4716 I= RND (10)+1:PRINT I:IF  PEEK (-16384)<128 THEN 4716:L=(NUM*STR*I)>MSTR*3: POKE -16368,0
4718 PRINT "YOU ROLLED ";I;".":IF L THEN PRINT "YOU GOT A HIT!":IF NOT L THEN PRINT "NO HIT.":J=J+L
4719 PRINT "NOW ROLL FOR THE ENEMY.";:GOSUB 18
4721 I= RND (10)+1:PRINT I:IF  PEEK (-16384)<128 THEN 4721: POKE -16368,0:K=K+(I>7)
4722 PRINT :PRINT "THE ENEMY GETS A ";I:PRINT "YOU'VE LOST ";K;" OF YOUR PARTY.":GOSUB 6
4723 IF K>=NUM THEN 8325:IF J=2 THEN 4730:C$="NONE":IF J THEN C$="HALF":PRINT C$;" OF THE ";A$;" ARE DEAD."
4724 IF K>3 THEN MSTR=MSTR/2
4725 PRINT "ROLL AGAIN FOR YOUR SIDE.";:GOSUB 18:GOTO 4716
4730 NUM=NUM-K:STR=STR+1:IF K AND Q AND NOT EL AND  RND (15)>NUM THEN 4740:IF K AND Q=2 AND NOT DW AND  RND (15)>NUM THEN 4741
4731 PRINT :PRINT "THE ";A$;" WERE ALL KILLED.":MP=0:GOTO 3750
4740 EL=1:PRINT :PRINT "THE ELF WAS KILLED. NO MORE WARNINGS.":GOSUB 5:GOTO 4731
4741 DW=1:PRINT :PRINT "THE DWARF WAS KILLED. NO MORE MAP.":GOSUB 5:GOTO 4731
4750 WP=0:STR=STR+MSTR/NUM:PRINT :PRINT "THE MAGIC SWORD KILLED THE ";A$:COLOR= C(5):GOSUB 10:MP=0:GOTO 3750
4800 CALL -936:IF  RND (2) THEN 4801:PRINT "YOU DISTURBED AN EVIL NECROMANCER WHO   SENT YOU HERE.":GOTO 4802
4801 PRINT "YOU WERE GRABBED BY PTERIDACTYLS, FLOWN HERE AND LEFT."
4802 I=20:FOR J=1 TO 15: POKE 0,I: POKE 24,2:I=I-1:CALL 2:NEXT J: POKE 0,22: POKE 24,2:CALL 2
4805 Q= RND (3):GOSUB 12:GOSUB 4150:GOTO 2130
4910 CALL -936:PRINT : POKE 50,127:TAB 14:PRINT "PIT TRAP!!!": POKE 50,255:FOR I=1 TO 4:COLOR= 1+(I MOD 2)*10:GOSUB 10:FOR J=1 TO 6: POKE 0,12: POKE 24,2
4920 CALL 2:NEXT J,I:IF Q=3 THEN 4950:Q=Q+ RND (2)+1:IF Q>3 THEN Q=3:TAB 8:PRINT "YOU'VE FALLEN TO LEVEL ";Q+1
4942 GOSUB 11:GOSUB 4150:GOTO 2100
4950 I=1+ RND (2):NUM=NUM-I:IF NUM<=0 THEN 8325:PRINT I;" OF YOUR MEN FELL INTO THE BOTTOMLESS"
4951 PRINT "PIT. THERE ARE ONLY ";NUM;" OF YOU LEFT.";:GOTO 1501
5000  POKE 0,15: POKE 24,2:CALL 2:GOTO 2100
5045 X=I:Y=J:GOSUB 11:IF RT=0 THEN 4170:PRINT "THIS MAP!"
5050 P=9:FOR I=1 TO 8: POKE 0,P: POKE 24,2:CALL 2:P=P-1:NEXT I:GOTO 1501
6000 IF NOT (Q=3 AND (X=WX OR X=WX+1) AND (Y=WY OR Y=WY+1)) THEN 5000:M(1)=10:M(2)=3:M(3)=10:M(4)=3:M(5)=9:M(6)=3:M(7)=7
6005 M(8)=8:FOR J=1 TO 3:IF J=3 THEN M(8)=16:FOR I=1 TO 7 STEP 2: POKE 0,M(I): POKE 24,M(I+1):CALL 2:NEXT I,J
6006 TEXT :CALL -936:VTAB 10:PRINT "YOU MADE IT!!! YOU GOT OUT OF THE DUN-  GEON WITH ";S;" QUADROONS WORTH OF GOLD"
6010 PRINT "AND JEWELS! ONLY ";NUM;" OF YOUR PARTY SUR-":PRINT "VIVED THOUGH.":PRINT "COME AGAIN SOON.":END 
7000 T=Q*169+SX+13*(SY-1):R=(ABS (M(T) MOD 2)=0):L=(ABS (M(T-1) MOD 2)=0):D=(ABS (M(T) MOD 10)<2):DC=-1:U=0:IF Q=0 AND Y=1 THEN 7005
7002 U=(ABS (M(T-13) MOD 10)<2)
7005 DX=(X>SX)*R-(X<SX)*L:DY=(Y>SY)*D-(Y<SY)*U:I= RND (2):IF DX#0 OR DY#0 THEN 7018:DX=R-L:DY=D-U:IF CT<4 THEN 7018
7015 DX=SGN (X-SX):DY=SGN (Y-SY)
7018 IF DX#0 AND DY#0 THEN DX=DX*I:IF DX#0 AND DY#0 THEN DY=0:IF 2*DX+3*DY#-LM THEN CT=-1:CT=CT+1:LM=2*DX+3*DY:U=HX:R=HY
7020 HX=QX:HY=QY:FOR I=1 TO 3:COLOR= 0:GOSUB 10:COLOR= C(14):HX=HX+DX:HY=HY+DY:GOSUB 10:NEXT I:QX=HX:QY=HY:SX=SX+DX:SY=SY+DY:HX=U:HY=R
7030 IF X#SX OR Y#SY THEN RETURN :POP 
8000 FOR I=1 TO 6:COLOR= 1+(I MOD 2)*4:GOSUB 10:FOR J=1 TO 8: POKE 0,5: POKE 24,2:CALL 2:NEXT J,I:ND=0:SX=-1:SY=-1:A$="DRAGON":IF WP THEN 4750
8002 IF NUM<=2 THEN 8325:NUM=NUM-2:CALL -936:PRINT "THE DRAGON ATE TWO OF YOUR PARTY.":GOTO 3750
8300 DC=-1: POKE 50,63:CALL -936:PRINT "       COLOR CODES FOR LEVEL ";Q+1;" ARE:     ";: POKE 50,255
8305 IF Q=0 THEN PRINT "L.GREEN";:IF Q=1 THEN PRINT "ORANGE";:IF Q=2 THEN PRINT "VIOLET";:IF Q=3 THEN PRINT "FLESH";:PRINT "=WALLS";
8307 TAB 16:PRINT "L.BLUE=HAZ   RED=YOU     YELLOW=TREAS.  ";:IF Q=0 OR Q=1 THEN PRINT "GREY=DRAGON";:IF Q=2 THEN PRINT "BROWN=SNAKE";
8310 IF Q=3 THEN PRINT "GREY=SPECT";:TAB 29:PRINT "WHITE=STAIRSD.GREEN=MONST  ";:IF Q=1 OR Q=2 THEN PRINT "OLIVE=GAS";:GOTO 1501
8325 TEXT :CALL -936:VTAB 10:PRINT "YOUR EXPEDITION HAD NO SURVIVORS.  CON- DOLENCES WILL BE SENT TO NEXT OF KIN.":END 
