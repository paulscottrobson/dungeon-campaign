#
#	Dungeon Campaign (Apple ][ Integer Basic) decoder
#
import sys,re 

class Decoder:
	def __init__(self,varDefs):
		self.variableDef = varDefs
		# load binary add ending marker
		self.binary = [x for x in open("dungeon.bin","rb").read(32768)]
		self.binary.append(-1)
		self.lineAddresses = {}
		# scan through looking for line numbers
		p = 0
		while self.binary[p] != -1:
			lineNumber = self.binary[p+1]+self.binary[p+2]*256
			self.lineAddresses[lineNumber] = p + 3
			p = p + self.binary[p]
		# get list of line numbers
		self.lineNumbers = [x for x in self.lineAddresses.keys()]
		self.lineNumbers.sort()

		# create token table
		self.tokens = """
		?|?|?|_|LOAD|SAVE|CON|RUN|RUN|DEL|,|NEW|CLR|AUTO|,|MAN|HIMEM:|LOMEM:|+|-|*|/|=|#|>=|>|<=|<>|<|AND|OR|
		MOD|^|+|(|,|THEN|THEN|,|,|\|\|(|!|!|(|PEEK|RND|SGN|ABS|PDL|RNDX|(|+|-|NOT|(|=(unary)|
		#|LEN(|ASC(|SCRN(|,|(|$|$|(|,|,|;|;|;|,|,|,|TEXT|GR|CALL|DIM|DIM|TAB|END|INPUT|INPUT|INPUT|
		FOR|=|TO|STEP|NEXT|,|RETURN|GOSUB|REM|LET|GOTO|IF|PRINT|PRINT|PRINT|POKE|,|COLOR =|PLOT|,|HLIN|,|
		AT|VLIN|,|AT|VTAB|=|=|)|)|LIST|,|LIST|POP|NODSP|DSP|NOTRACE|DSP|DSP|TRACE|PR#|IN#
		""".lower().replace("\t","").replace("\n","").replace(" ","").split("|")

	#
	#	decode line into text
	#
	def decodeLine(self,lineNumber,formatting):
		line = self.analyse(lineNumber)
		self.variableGotoGosubProcess(line,lineNumber)
		output = []
		# for each line part
		for l in line:
			# if next reduce by 1 plus 1 for each comma next i,j
			if l[0][0] == 'T' and l[0][1] == 'next':
				formatting["indent"] -= 1
				for c in l:
					if c[0] == 'T' and c[1] == ',':
						formatting["indent"] -= 1
			# add indentation (| placeholder for space)
			id = "||||||"+("||||" * formatting["indent"]) + ("".join([self.render(x) for x in l])).strip()
			# remove exces spacing
			id = self.replaceAll(id,"  "," ")
			id = self.replaceAll(id,"( ","(")
			id = self.replaceAll(id," (","(")
			id = self.replaceAll(id," )",")")
			id = self.replaceAll(id,"; ",";")
			id = self.replaceAll(id," ;",";")
			id = self.replaceAll(id," , ",",")
			# do indentation
			output.append(id.replace("|"," "))
			# indent FOR
			if l[0][0] == 'T' and l[0][1] == 'for':
				formatting["indent"] += 1
			# put line number in.
			output[0] = "{0:4}".format(lineNumber)+output[0][4:]
		return "\n".join(output)

	def render(self,item):
		if item[0] == 'T':
			return " "+item[1][0].upper()+item[1][1:].lower()+" "
		return item[1]

	def replaceAll(self,s,f,r):
		while s.find(f) >= 0:
			s = s.replace(f,r)
		return s
	#
	#	Convert into lists of (S)trings (T)okens (V)ariables (I)ntegers (C)haracters
	#
	def analyse(self,lineNumber):
		line = [[]]
		p = self.lineAddresses[lineNumber]
		while self.binary[p] != 1:
			n = self.binary[p]
			p += 1
			# line break
			if n == 3:
				line.append([])
			# quoted string
			elif n == 40:
				qstr = ""
				while self.binary[p] != 41:
					qstr = qstr+chr(self.binary[p] & 0x7F)
					p = p + 1
				p = p + 1 
				line[-1].append(['S','"'+qstr.lower()+'"'])
			# other token
			elif n < 128:
				line[-1].append(['T',self.tokens[n]])
			# variable with optional $ and ( for string and array
			elif n >= 0xC1 and n <= 0xDA:
				variable = chr(n-128)
				while (self.binary[p] >= 0xC1 and self.binary[p] != 0xDA) or (self.binary[p] >= 0xB0 and self.binary[p] <= 0xB9):
					variable = variable+chr(self.binary[p]-128)
					p += 1
				if self.binary[p] == 64:
					variable = variable + "$"
					p = p + 1
				if self.binary[p] == 45:
					variable = variable + "("
					p = p + 1
				line[-1].append(['V',variable.lower()])
			# integer
			elif n >= 0xB0 and n <= 0xB9:
				line[-1].append(['I',str(self.binary[p+1]*256+self.binary[p])])
				p = p + 2
			# anything else.
			else:
				line[-1] += ['C',chr(n-128)]
		return line 
	#
	#	process Variable Names and gotos.
	#
	def variableGotoGosubProcess(self,line,lineNumber):
		for l in line:
			for i in range(0,len(l)):
				# convert variable names.
				if l[i][0] == 'V':
					newName = self.variableTranslate(l[i][1],lineNumber)
					if newName is not None:
						l[i][1] = newName
				# convert goto/gosub
				if l[i][0] == 'T' and (l[i][1] == 'goto' or l[i][1] == 'gosub' or l[i][1] == 'then'):
					if l[i+1][0] == 'I':
						newLabel = self.labelTranslate(int(l[i+1][1]))
						if newLabel is not None:
							l[i+1][0] = 'L'
							l[i+1][1] = newLabel
	#
	#	Translate variable name
	#
	def variableTranslate(self,variable,lineNumber):
		vnew = self.variableDef.get(variable.lower(),lineNumber)
		if vnew is None:
			return None
		if lineNumber < vnew["from"] or lineNumber > vnew["to"]:
			return None
		return vnew["full"]
	#
	#	Translate line number
	#
	def labelTranslate(self,lineNumber):
		return "{"+str(lineNumber)+"}"
#
#	Class for looking up variable definitions
#
class VariableDefinitions:
	def __init__(self,definitionFile):
		vars = [x if x.find("#") < 0 else x[:x.find("#")] for x in open(definitionFile,"r").readlines()]
		vars = [x.strip().replace("\t"," ") for x in vars if x.strip() != ""]
		self.lookupVariable = {}
		for v in vars:
			 vm = re.match("^([A-Za-z0-9\\$\\()]+)\\s*\\{(.*)\\}\\s*([A-Za-z0-9\\$\\(]+)\\s*.*$",v)		
			 assert vm is not None,"Bad line" + v
			 newRect = { "short":vm.group(1).lower(), "from":0,"to":99999,"full":vm.group(3) }
			 self.lookupVariable[newRect["short"]] = newRect
			 if vm.group(2) != "":
			 	rv = re.match("^(\\d+)\\-(\\d+)$",vm.group(2))
			 	assert rv is not None,"Bad range"+v
			 	newRect["from"] = int(rv.group(1))
			 	newRect["to"] = int(rv.group(2))

	def get(self,name,lineNumber):
		name = name.lower()
		if name not in self.lookupVariable:
			return None
		return self.lookupVariable[name]

vars = VariableDefinitions("variables.def")
d = Decoder(vars)
fmt = { "indent":0 }
h = open("dungeon.lst","w")
for l in d.lineNumbers:
	h.write(d.decodeLine(l,fmt)+"\n")
h.close()

