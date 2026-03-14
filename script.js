// ---------------------- Block Definitions ----------------------
const BLOCK_DEFS = [
  {
    category:"Combat",
    type:"hitbox",
    message:"deal %1 damage in area x:%2 y:%3 z:%4 offset x:%5 y:%6 z:%7",
    args:[
      {type:"field_number_or_var", name:"amount", value:10},
      {type:"field_number_or_var", name:"x", value:6},
      {type:"field_number_or_var", name:"y", value:6},
      {type:"field_number_or_var", name:"z", value:6},
      {type:"field_number_or_var", name:"offx", value:0},
      {type:"field_number_or_var", name:"offy", value:0},
      {type:"field_number_or_var", name:"offz", value:4},
    ],
    color:245
  },
  {
    category:"Movement",
    type:"velocity",
    message:"set velocity x:%1 y:%2 z:%3 for %4 seconds",
    args:[
      {type:"field_number_or_var", name:"x", value:0},
      {type:"field_number_or_var", name:"y", value:0},
      {type:"field_number_or_var", name:"z", value:0},
      {type:"field_number_or_var", name:"time", value:1}
    ],
    color:150
  },
  {
    category:"Combat",
    type:"heal",
    message:"heal %1 hp",
    args:[
      {type:"field_number_or_var", name:"amount", value:5}
    ],
    color:0
  },
  {
    category:"Misc",
    type:"wait",
    message:"wait %1 seconds",
    args:[
      {type:"field_number_or_var", name:"amount", value:1}
    ],
    color:0
  },
  {
    category:"Animation",
    type:"sound",
    message:"play sound id %1",
    args:[
      {type:"field_number_or_var", name:"id", value:12222253}
    ],
    color:100
  },
  {
    category:"Variables",
    type:"set_variable",
    message:"set variable %1 to %2",
    args:[
      {type:"field_variable", name:"VAR", variable:"_myVar"},
      {type:"input_value", name:"VALUE"}
    ],
    color:230
  },
  {
    category:"Variables",
    type:"get_variable",
    message:"%1",
    args:[
      {type:"field_variable", name:"VAR", variable:"_myVar"}
    ],
    color:230,
    output:true
  },
  {
    category:"Operators",
    type:"math_operation",
    message:"%1 %2 %3",
    args:[
      {type:"input_value", name:"A"},
      {type:"field_dropdown", name:"OP", options:[["+","+"], ["-","-"], ["*","*"], ["/","/"]]},
      {type:"input_value", name:"B"}
    ],
    color:260,
    output:true
  },
  {
    category:"Operators",
    type:"text_join",
    message:"join %1 and %2",
    args:[
      {type:"input_value", name:"A"},
      {type:"input_value", name:"B"}
    ],
    color:260,
    output:true
  }
];

// ---------------------- Category Colors ----------------------
const CATEGORY_COLORS = {
    "Combat": "#c50000",
    "Movement": "#abffdc",
    "Variables": "#e95f10",
    "Animation": "#FFFF55",
    "Operators": "#8888ff",
    "Misc": "#888888"
};

// ---------------------- Custom Field: Number or Variable ----------------------
Blockly.FieldNumberOrVar = class extends Blockly.Field {
  constructor(value) {
    super(value || 0);
    this.setValue(value || 0);
  }

  showEditor_() {
    let workspace = this.sourceBlock_.workspace;
    Blockly.prompt("Enter number or variable:", this.getValue(), val => {
      if(val !== null) this.setValue(val);
    });
  }

  getValue() { return this.value_; }
  setValue(newValue) { this.value_ = newValue; this.setText(newValue); }
};

// ---------------------- Register Blocks ----------------------
function registerBlocks(){
  let blocks=[];
  BLOCK_DEFS.forEach(def=>{
    let args = def.args.map(arg=>{
      if(arg.type === "field_number_or_var"){
        return { type:"input_value", name:arg.name };
      }
      return arg;
    });
    blocks.push({
      type:def.type,
      message0:def.message,
      args0:args,
      previousStatement:null,
      nextStatement:null,
      colour:def.color,
      output:def.output || undefined
    });
  });
  Blockly.defineBlocksWithJsonArray(blocks);
}

registerBlocks();

// ---------------------- Build Toolbox ----------------------
function buildToolbox(){
  let toolbox=document.getElementById("toolbox");
  let categories={};
  BLOCK_DEFS.forEach(def=>{
    if(!categories[def.category]) categories[def.category]=[];
    categories[def.category].push(def.type);
  });
  for(let cat in categories){
    let catXML=document.createElement("category");
    catXML.setAttribute("name",cat);
    catXML.setAttribute("colour",CATEGORY_COLORS[cat]||"#888888");
    categories[cat].forEach(type=>{
      let block=document.createElement("block");
      block.setAttribute("type",type);
      catXML.appendChild(block);
    });
    toolbox.appendChild(catXML);
  }
}

// ---------------------- Inject Blockly ----------------------
buildToolbox();
const workspace = Blockly.inject('blocklyDiv',{
  toolbox:document.getElementById('toolbox')
});

// ---------------------- Export/Import JSON ----------------------
function workspaceToJSON(){
  let blocks = workspace.getTopBlocks(true);
  let line = [];
  blocks.forEach(block=>{
    let fields = {};
    block.inputList.forEach(input=>{
      let target = input.connection.targetBlock();
      if(target && target.type === "get_variable"){
        fields[input.name] = "_VAR_" + target.getFieldValue("VAR");
      } else if(target){
        fields[input.name] = target.getFieldValue ? target.getFieldValue("VAR") || target.getFieldValue("value") : null;
      } else {
        fields[input.name] = block.getFieldValue(input.name);
      }
    });
    line.push({ K_NAME:block.type.toUpperCase(), ...fields });
  });
  return line;
}

document.getElementById("exportBtn").onclick=function(){
  let line = workspaceToJSON();
  let move = [{
    ADD:false,
    NAME:"Custom Character",
    K_NAME:"Custom Move",
    KEY:1,
    DATA:JSON.stringify({ Line:line, Prop:[], Req:[] }),
    COOLDOWN:0
  }];
  document.getElementById("output").value = JSON.stringify(move,null,2);
}

document.getElementById("importBtn").onclick=function(){
  let code = prompt("Paste JSON");
  try{
    let data = JSON.parse(code);
    document.getElementById("output").value = JSON.stringify(data,null,2);
  }catch(e){
    alert("Invalid JSON");
  }
}
