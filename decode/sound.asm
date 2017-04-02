;
;           The sound machine code.
;      

      org   $2

$0002 LDA $C030         AD 30 C0                            ; toggle speaker
$0005 LDA $00           A5 00                               ; get time delay
$0007 JSR $FCA8         20 A8 FC                            ; wait for (5*(dly*dly)+27*dly+26))*0.5 us defines frequency
$000A LDA $01           A5 01                               ; sub counter zero
$000C BNE $04           D0 04                               ; no, decrement it and go round again.
$000E DEC $18           C6 18                               ; decrement length of note
$0010 BEQ $05           F0 05                               ; if zero then exit
$0012 DEC $01           C6 01                               ; decrement sub counter.
$0014 JMP $0002         4C 02 00                            ; and loop round
$0017 RTS               60    

;
;     time period = 5.delay^2 + 27.delay + 26 / 2000000 seconds where delay is in [$00]
;     one complete cycle is half this.
;     frequency is the inverse of this.
;     it is played 256 x [$24] times
;