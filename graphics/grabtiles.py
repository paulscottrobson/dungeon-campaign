
import os,sys,re
from PIL import Image

tiles = """
	mazefloor	112 465
	rock		530 531
	gas			1293 334
	player		1077 48
	serpent		1192 178
	spectre 	111 274
	dragon		80 114
	treasure	1391 1462
	stairsd		488 498
	stairsu 	1355 496
	pit			1581 402
	exit		498 495
	gold 		563 686
	carpet 		1909 1425
	lycanthropes 750 180
	viciousorcs 431 313
	gargoyles	790 176
	balrogs		496 175
	vampires	402 274
	goblins		114 78
	mightyogres	48 80
	cyclopses	787 305
	skeletons	880 174
	zombies		1905 241
	eviltrolls	973 209
	mummies		690 209
	hugespiders	272 141
	werewolves	782 146
	minotaurs	1970 175
	centaurs	590 208
	berserkers	1330 80
	griffons	1744 300
	basilisks	1646 272
	gorgons		1680 270
	frame 		1843 496

""".replace("\t"," ").split("\n")

img = Image.open("tiles.png")
for t in tiles:
	if t.strip() != "":
		m = re.match("^\\s*([a-z]+)\\s*(\d+)\\s*(\d+)\\s*$",t)
		assert m is not None,"error "+t
		x = int(int(m.group(2))/32)*32
		y = int(int(m.group(3))/32)*32
		name = "source"+os.sep+m.group(1).lower()+".png"
		#print(name,x,y)
		newImg = img.crop((x,y,x+32,y+32))
		newImg.save(name)
