const BLOCK_DEFS = [

{
category:"Combat",
type:"hitbox",
message:"deal %1 damage in a area of x:%2 y:%3 z:%4 with an offset of x:%5 y:%6 z:%7",
args:[
{
type:"field_number",
name:"amount",
value:10
},
{
type:"field_number",
name:"x",
value:6
},
{
type:"field_number",
name:"y",
value:6
},
{
type:"field_number",
name:"z",
value:6
},
{
type:"field_number",
name:"offx",
value:0
},
{
type:"field_number",
name:"offy",
value:0
},
{
type:"field_number",
name:"offz",
value:4
}
],
color:245
},

{
category:"Movement",
type:"velocity",
message:"set velocity x:%1 y:%2 z:%3 for %4 seconds",
args:[
{
type:"field_number",
name:"x",
value:0
},
{
type:"field_number",
name:"y",
value:0
},
{
type:"field_number",
name:"z",
value:0
},
{
type:"field_number",
name:"time",
value:1
}
],
color:150
},

{
category:"Combat",
type:"heal",
message:"heal %1 hp",
args:[
{
type:"field_number",
name:"amount",
value:5
}
],
color:0
},

{
category:"Misc",
type:"wait",
message:"wait %1 seconds",
args:[
{
type:"field_number",
name:"amount",
value:1
}
],
color:0
},

{
category:"Animations",
type:"sound",
message:"play sound id %1",
args:[
{
type:"field_number",
name:"id",
value:12222253
}
],
color:100
},

{
category:"Misc",
type:"connect",
message:"connect to thing with signal %1 for time %2 with range %3",
args:[
{
type:"field_input",
name:"signal",
value:"Signal"
},
{
type:"field_number",
name:"time",
value:0.1
},
{
type:"field_number",
name:"range",
value:1e+100
}

],
color:230
},

{
category:"Operators",
type:"math_add",
message:"%1 + %2",
args:[
{type:"input_value",name:"A"},
{type:"input_value",name:"B"}
],
output:"Number",
color:260
},

{
category:"Operators",
type:"math_sub",
message:"%1 - %2",
args:[
{type:"input_value",name:"A"},
{type:"input_value",name:"B"}
],
output:"Number",
color:260
},

{
category:"Operators",
type:"math_mul",
message:"%1 * %2",
args:[
{type:"input_value",name:"A"},
{type:"input_value",name:"B"}
],
output:"Number",
color:260
},

{
category:"Operators",
type:"math_div",
message:"%1 / %2",
args:[
{type:"input_value",name:"A"},
{type:"input_value",name:"B"}
],
output:"Number",
color:260
},

{
category:"Values",
type:"number_value",
message:"number %1",
args:[
{
type:"field_number",
name:"NUM",
value:0
}
],
color:230,
output:"Number"
},

{
category:"Values",
type:"text_value",
message:"text %1",
args:[
{
type:"field_input",
name:"TEXT",
text:"hello"
}
],
color:160,
output:"String"
}

]

const CATEGORY_COLORS = {
"Combat": "#c50000",
"Movement": "#abffdc",
"Variables": "#e95f10",
"Animations": "#FFFF55",
"Operators": "#55aaff",
"Values": "#ffaa00"
}

function registerBlocks(){

let blocks=[]

BLOCK_DEFS.forEach(def=>{

blocks.push({
type:def.type,
message0:def.message,
args0:def.args,
previousStatement:def.output ? undefined : null,
nextStatement:def.output ? undefined : null,
output:def.output || undefined,
colour:def.color
})

})

Blockly.defineBlocksWithJsonArray(blocks)

}

function buildToolbox(){

let toolbox=document.getElementById("toolbox")

// ADD VARIABLES CATEGORY FIRST
let varCat=document.createElement("category")
varCat.setAttribute("name","Variables")
varCat.setAttribute("colour", CATEGORY_COLORS["Variables"] || "#ff8800")
varCat.setAttribute("custom","VARIABLE")

toolbox.appendChild(varCat)

let categories={}

BLOCK_DEFS.forEach(def=>{

if(!categories[def.category]){
categories[def.category]=[]
}

categories[def.category].push(def.type)

})

for(let cat in categories){

let catXML=document.createElement("category")

catXML.setAttribute("name",cat)
catXML.setAttribute("colour", CATEGORY_COLORS[cat] || "#888888")

categories[cat].forEach(type=>{

let block=document.createElement("block")
block.setAttribute("type",type)

catXML.appendChild(block)

})

toolbox.appendChild(catXML)

}

}

registerBlocks()

buildToolbox()

const workspace = Blockly.inject('blocklyDiv',{
toolbox:document.getElementById('toolbox')
})

function workspaceToJSON(){

let blocks = workspace.getTopBlocks(true)

let line=[]

blocks.forEach(block=>{

if(block.type==="deal_damage"){

line.push({
K_NAME:"DAMAGE",
VALUE:block.getFieldValue("damage")
})

}

if(block.type==="heal"){

line.push({
K_NAME:"HEAL",
VALUE:block.getFieldValue("heal")
})

}

if(block.type==="wait"){

line.push({
K_NAME:"WAIT",
VALUE:block.getFieldValue("time")
})

}

})

return line

}

document.getElementById("exportBtn").onclick=function(){

let line = workspaceToJSON()

let move = [{
ADD:false,
NAME:"Custom Character",
K_NAME:"Custom Move",
KEY:1,
DATA:JSON.stringify({
Line:line,
Prop:[],
Req:[]
}),
COOLDOWN:0
}]

let json = JSON.stringify(move,null,2)

document.getElementById("output").value=json

}

document.getElementById("importBtn").onclick=function(){

let code = prompt("Paste JSON")

try{

let data = JSON.parse(code)

document.getElementById("output").value=JSON.stringify(data,null,2)

}catch(e){

alert("Invalid JSON")

}

}
