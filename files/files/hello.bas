10  TEXT : HOME 
20 D$ =  CHR$(4): REM  CTRL-D
60  PRINT D$;"BLOAD LOADER.OBJ0"
70  CALL 4096: REM  FAST LOAD IN INTEGER BASIC
100  PRINT D$;"BRUN MENU"