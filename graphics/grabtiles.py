
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
	stairsd		1322 406
	stairsu 	1355 496
	pit			1581 402
	exit		498 495
	gold 		563 686
	carpet 		1909 1425
	lycanthrope	750 180
	gargoyle	790 176
	balrog		496 175
	vampire		402 274
	goblin		114 78
	ogre		48 80
	cyclops		787 305
	skeleton	880 174
	zombie		1905 241
	troll		973 209
	mummy		690 209
	spider		272 141
	werewolf	782 146
	minotaur	1970 175
	centaur		590 208
	berserker	1330 80

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
