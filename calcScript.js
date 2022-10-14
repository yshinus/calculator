let textboxContents="";
let lastSentence="";
let firstNumber;
let symbol="";
let secondNumber;
let numberType;
let history=["", "", "", "", "", "", "", "", ""];

document.addEventListener("keydown", checkKeyPressed, false);

function checkKeyPressed(eventKey) {
	if (eventKey.keyCode>=48 && eventKey.keyCode<=57) {
        num=eventKey.keyCode-48;
		buttonNumber(`n${num}`);
	}
    if (eventKey.keyCode>=96 && eventKey.keyCode<=105){
        num=eventKey.keyCode-96;
		buttonNumber(`n${num}`);
    }
    if (eventKey.keyCode==13){
        writeResult();
    }
    if (eventKey.keyCode==8){
        deleteLast();
    }
    switch (eventKey.keyCode){
        case 106:
            writeSymbol("multiply");
        case 107:
            writeSymbol("plus");
        case 109:
            writeSymbol("minus");
        case 111:
            writeSymbol("divide");
        case 110:
            addDot();
    }
}

function buttonNumber(id)
{
    if(numberType==2){
        textboxContents="";
        numberType=1;
    }
    fillTextbox(textboxContents);
    if(symbol=="" && textboxContents.length<15){
        textboxContents += document.getElementById(id).value;
    }else if(symbol!="" && textboxContents.length-textboxContents.indexOf(symbol)-1<15){
        textboxContents += document.getElementById(id).value;
    }else{
        window.alert("15자 이상 입력할 수 없습니다");
    }
    lastSentence="";
    updateLastTextbox(lastSentence);
    fillTextbox(textboxContents);
}

function addDot()
{
    if(textboxContents.length>0 && textboxContents.substring(textboxContents.length-1, textboxContents.length)!=symbol){
        if(symbol=="" && !textboxContents.includes(".")){
            textboxContents+=".";
        }else if(symbol!="" && !textboxContents.substring(textboxContents.indexOf(symbol), textboxContents.length).includes(".")){
            if(symbol=="^"){
                window.alert("지수에 소수를 입력할 수 없습니다");
            }else{
                textboxContents+=".";
            }
        }
        fillTextbox(textboxContents);
    }
}

function fillTextbox(textboxContents)
{
    document.getElementById("textbox").innerHTML = textboxContents;
}

function updateLastTextbox(lastSentence)
{
    document.getElementById("lastTextbox").innerHTML=lastSentence;
}

function deleteLast()
{
    if(textboxContents[textboxContents.length-1]==symbol){
        symbol="";
    }
    numberType=1;
    textboxContents=textboxContents.slice(0,-1);
    lastSentence="";
    updateLastTextbox(lastSentence);
    fillTextbox(textboxContents);
}

function deleteAll()
{
    textboxContents="";
    symbol="";
    lastSentence="";
    updateLastTextbox(lastSentence);
    fillTextbox(textboxContents);
}

function calculate(symbol)
{
    let result;
    let ten=getMax(getLength(firstNumber), getLength(secondNumber));
    let a=parseInt(firstNumber*ten);
    let b=parseInt(secondNumber*ten);
    switch(symbol){
        case "+":
            result=(a+b)/ten;
            break;
        case "－":
            result=(a-b)/ten;
            break;
        case "×":
            result=a*b/ten/ten;
            break;
        case "÷":
            result=a/b;
            break;
        case "^":
            result=1;
            if(secondNumber>=0){
                for(i=0; i<secondNumber; i++){
                    result=result*(a);
                }
                for(i=0; i<secondNumber; i++){
                    result=result/ten;
                }
            }else{
                for(i=0; i>secondNumber; i--){
                    result=result/(firstNumber*ten);
                }
                for(i=0; i>secondNumber; i--){
                    result=result*ten;
                }
            }
            break;
    }
    if(result==Infinity){
        window.alert("계산 범위를 초과하였습니다");
        result=0;
        lastSentence="";
    }
    return result;
}

function writeSymbol(currentSymbol)
{
    if (symbol=="" && textboxContents!="" && textboxContents[textboxContents.length-1]!="-") {
        numberType=1;
        lastSentence="";
        firstNumber=parseFloat(textboxContents.replace("(", "").replace(")", ""));
        symbol=document.getElementById(currentSymbol).value;
        if(textboxContents.includes("(")){
            textboxContents += ")";    
        }
        textboxContents+=symbol;
        updateLastTextbox(lastSentence);
        fillTextbox(textboxContents);
    } else {
        if(textboxContents.substring(textboxContents.length-1,textboxContents.length)!=symbol && textboxContents[textboxContents.length-1]!="-"){
            secondNumber=parseFloat(textboxContents.substring(textboxContents.indexOf(symbol)+1, textboxContents.length).replace("(", "").replace(")", ""));
            if(textboxContents[textboxContents.indexOf(symbol)+1]=="("){
                textboxContents+=")";
            }
            lastSentence=textboxContents+"=";
            firstNumber=calculate(symbol);
            symbol=document.getElementById(currentSymbol).value;
            textboxContents=firstNumber+symbol;
            addHistory(lastSentence, textboxContents.substring(0, textboxContents.length-1));
            if(textboxContents.includes("-")){
                textboxContents="("+textboxContents;
            }
            updateLastTextbox(lastSentence);
            fillTextbox(textboxContents);
        }
    }
}

function writeResult()
{
    if(symbol!="" && textboxContents[textboxContents.length-1]!=symbol){
        secondNumber=parseFloat(textboxContents.substring(textboxContents.indexOf(symbol)+1, textboxContents.length).replace("(", "").replace(")", ""));
        if(textboxContents[textboxContents.indexOf(symbol)+1]=="("){
            textboxContents+=")";
        }
        lastSentence=textboxContents+"=";
        firstNumber=calculate(symbol);
        symbol="";
        textboxContents=firstNumber.toString();
        addHistory(lastSentence, textboxContents);
        if(textboxContents[0]=="-"){
            textboxContents="("+textboxContents;
        }
        numberType=2;
        updateLastTextbox(lastSentence);
        fillTextbox(textboxContents);
    }
}

function makePercent()
{
    if(textboxContents.length>0 && textboxContents.substring(textboxContents.length-1, textboxContents.length)!=symbol){
        if(symbol==""){
            firstNumber=parseFloat(textboxContents.replace("(", "").replace(")", ""));
            firstNumber=firstNumber/100;
            textboxContents=`${firstNumber}`;
        }else{
            secondNumber=parseFloat(textboxContents.substring(textboxContents.indexOf(symbol)+1, textboxContents.length).replace("(", "").replace(")", ""));
            secondNumber=secondNumber/100;
            textboxContents=textboxContents.substring(0, textboxContents.indexOf(symbol)+1);
            textboxContents+=`${secondNumber}`;
        }
        fillTextbox(textboxContents);
    }
}

function addMinus()
{
    if(symbol==""){
        if(textboxContents[0]=="("){
            textboxContents=textboxContents.substring(2,textboxContents.length);
        }else{
            textboxContents="(-"+textboxContents;
        }
    }else{
        if(textboxContents[textboxContents.indexOf(symbol)+1]=="("){
            textboxContents=textboxContents.substring(0,textboxContents.indexOf(symbol)+1)+textboxContents.substring(textboxContents.indexOf(symbol)+3,textboxContents.length);
        }else{
            textboxContents=textboxContents.substring(0,textboxContents.indexOf(symbol)+1)+"(-"+textboxContents.substring(textboxContents.indexOf(symbol)+1, textboxContents.length);
        }
    }
    fillTextbox(textboxContents);
}

function addHistory(sentence, result)
{
    history.unshift(sentence+'\n'+result);
    history.pop()
    for(i=0; i<9; i++){
        document.getElementById(`c${i+1}`).innerText=history[i];
    }
}

function getLength(number)
{
    let a=number.toString();
    let result=1;
    if(!Number.isInteger(number)){
        for(i=0; i<a.length-a.indexOf(".")-1; i++){
            result=result*10;
        }
    }
    return result;
}

function getMax(a, b)
{
    if(a>b){
        return a;
    }
    else{
        return b;
    }
}

const clockDiv = document.getElementById("clock");

//시계
function getTime() {
    let now = new Date();
    let hour = changeNumber(now.getHours()); //시 0-23
    let minute = changeNumber(now.getMinutes()); //분 0-59
    let second = changeNumber(now.getSeconds()); //초 0-59
    let year = now.getFullYear(); //년도
    let month = changeNumber(now.getMonth() + 1); //달 1-12, getMonth 에서 0 = 1월, 1 = 2월
    let date = changeNumber(now.getDate()); //날짜 1-31
    let dayNumber = now.getDay(); //요일 1-7
    const dayList = ["일", "월", "화", "수", "목", "금", "토"];
    let day = dayList[dayNumber]; //배열은 0부터 숫자를 셈

    //0시는 12시로 변경
    if (now.getHours() == 0) {
        hour = 12;
    }

    clockDiv.innerText=`${year}.${month}.${date} (${day})`+"\n"+`${hour}:${minute}:${second}`;
}

function changeNumber(num) {
    if (num < 10){
        num = "0" + num; //5같은경우 05로 표시
    }
    return num;
}

function clock() {
    getTime();
}

setInterval(clock, 1000) //시계 1초마다 작동