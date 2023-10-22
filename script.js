const sliderEl = document.querySelector("#range");
const sliderValue = document.querySelector(".value");
const uppercase=document.querySelector("#Uppercase");
const lowercase=document.querySelector("#Lowercase");
const Numbers=document.querySelector("#Numbers");
const Symbols=document.querySelector("#Symbols");
const password_display=document.querySelector(".password-display");
const copy_btn= document.querySelector(".copy-to-clip-btn");
const strength_teller= document.querySelector(".strength-col");
const generate_btn= document.querySelector(".submitbtn");
const allcheckboxes=document.querySelectorAll("input[type=checkbox]")
const copy_msg=document.querySelector(".copy_msg")
const copy_icon=document.querySelector(".copy-icon");
const copied_icon=document.querySelector(".copied-icon");
let password="";
let password_length=0;
let checkcount=3;

// slider js code which changes as input slide value increases
sliderEl.addEventListener("input", (event) => {
  const tempSliderValue = event.target.value; 

  password_length=parseInt(tempSliderValue);
  
  sliderValue.textContent = parseInt(tempSliderValue);
  
  const progress = (tempSliderValue / sliderEl.max) * 100;
 
  sliderEl.style.background = `linear-gradient(to right,  yellow ${progress}%, #ccc ${progress}%)`;
})

function handleslider(){
  sliderEl.value=password_length;
  const tempSliderValue=sliderEl.value;
  sliderValue.textContent=password_length;
  const progress = (tempSliderValue / sliderEl.max) * 100;
  sliderEl.style.background = `linear-gradient(to right,  yellow ${progress}%, #ccc ${progress}%)`;
}

function setIndicator(color){
  strength_teller.style.backgroundColor=color;
  strength_teller.style.boxShadow=`0px 0px 10px ${color}`;
}

function getrandominteger(min,max){
  return Math.floor(Math.random()*(max-min))+min;
}

function Numberadd(){
  return getrandominteger(0,9);
}

function lower(){
  return String.fromCharCode(getrandominteger(97,123));
}

function upper(){
  return String.fromCharCode(getrandominteger(65,91));
}

function Symboladd(){

  return String.fromCharCode(getrandominteger(33,48));
}
function calstrength(){
  let hasUpper=false;
  let hasLower=false;
  let hasSymbol=false;
  let hasNumber=false;

  if(uppercase.checked) hasUpper=true;
  if(lowercase.checked) hasLower=true;
  if(Symbols.checked) hasSymbol=true;
  if(Numbers.checked) hasNumber=true;

  if(hasLower && hasUpper &&(hasNumber||hasSymbol)&& password_length>=8){
    setIndicator("Green");
  }

  else if(
    (hasLower||hasUpper)&&
    (hasNumber||hasSymbol)&&
    password_length>=6){
    setIndicator("White");
  }
  else{
    setIndicator("Red");
  }
}

async function copyContent(){
  try{
    await navigator.clipboard.writeText(password_display.value);
    copy_msg.innerText="Copied";
    copy_icon.style.display="none";
    copied_icon.style.display="block";
    copy_msg.style.display="block";

    setTimeout(()=>{
      copied_icon.style.display="none";
      copy_icon.style.display="block";
      copy_msg.innerText="";
      copy_msg.style.display="none";
    },2000);
    

  }

  catch(e){
    copy_msg.innerText="Failed";
  }
}

copy_btn.addEventListener('click',()=>{
  if(password_display.value){
    copyContent();
  }
});

function handlecheckboxchange(){
  checkcount=0;
  allcheckboxes.forEach((checkbox)=>{
    if(checkbox.checked){
      ++checkcount;
    }
  });

  if(password_length<checkcount){
    password_length=checkcount;
    handleslider();
  }
}

allcheckboxes.forEach((checkbox)=>{
  checkbox.addEventListener('change',handlecheckboxchange);
})

generate_btn.addEventListener('click',()=>{

  // none of the checkboxes are selected
  if(checkcount<=0){
    return;
  }

  if(password_length<checkcount){
    password_length=checkcount;
    handleslider();
  }

  // new password loading

  // remove old password

  password="";

  let funcArr=[];

  if(uppercase.checked){
    funcArr.push(upper);
  }

  if(lowercase.checked){
    funcArr.push(lower);
  }

  if(Symbols.checked){
    funcArr.push(Symboladd);
  }

  if(Numbers.checked){
    funcArr.push(Numberadd);
  }

  // implementing compose property

  for(let i=0;i<funcArr.length;i++){
    password+=funcArr[i]();
  }

  // remaining addition

  for(let i=0;i<(password_length-funcArr.length);i++){
    let randIndex=getrandominteger(0,funcArr.length);
    password+=funcArr[randIndex]();
  }

  // shuffle the password

  password=shufflepassword(Array.from(password));

  password_display.value=password;
  // calculate strength

  calstrength();

});

function shufflepassword(shuffle_password){
  // Fisher Yates method
  for(let i=shuffle_password.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    const temp=shuffle_password[i];
    shuffle_password[i]=shuffle_password[j];
    shuffle_password[j]=temp;
  }

  let str="";
  shuffle_password.forEach((el)=>(str+=el));
  return str;
}