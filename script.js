const workspace = Blockly.inject('blocklyDiv',{
toolbox:document.getElementById('toolbox')
})

Blockly.defineBlocksWithJsonArray([

{
"type":"deal_damage",
"message0":"deal %1 damage",
"args0":[
{
"type":"field_number",
"name":"damage",
"value":10
}
],
"previousStatement":null,
"nextStatement":null,
"colour":230
},

{
"type":"heal",
"message0":"heal %1 hp",
"args0":[
{
"type":"field_number",
"name":"heal",
"value":5
}
],
"previousStatement":null,
"nextStatement":null,
"colour":200
},

{
"type":"wait",
"message0":"wait %1 seconds",
"args0":[
{
"type":"field_number",
"name":"time",
"value":1
}
],
"previousStatement":null,
"nextStatement":null,
"colour":60
},

{
"type":"velocity",
"message0":"move the player's x:%1 y:%2 z:%3",
"args0":[
{
"type":"field_number",
"name":"x",
"value":0
},

{
"type":"field_number",
"name":"y",
"value":0
},

{
"type":"field_number",
"name":"z",
"value":0
}
],
"previousStatement":null,
"nextStatement":null,
"colour":150
}

])

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