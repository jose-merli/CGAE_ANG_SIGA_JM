var l="<siga:Idioma key='calendario.literal.semana.lunes'/>";
var m="<siga:Idioma key='calendario.literal.semana.martes'/>";
var x="<siga:Idioma key='calendario.literal.semana.miercoles'/>";
var j="<siga:Idioma key='calendario.literal.semana.jueves'/>";
var v="<siga:Idioma key='calendario.literal.semana.viernes'/>";
var s="<siga:Idioma key='calendario.literal.semana.sabado'/>";
var d="<siga:Idioma key='calendario.literal.semana.domingo'/>";

  var weekdayArray=new Array (l,
                              m,
                              x,
                              j,
                              v,
                              s,
                              d);
var calDateFormat="DD/MM/YYYY";

var inputElem;
var blankCell;
var calendarBegin;
var calendarEnd;
var day;
var month;
var year;
var calDate;

function setToday(){
  calDate=new Date();
  month=calDate.getMonth();
  year=calDate.getFullYear();
  document.calControl.month.selectedIndex=month;
  document.calControl.year.value=year;
  buildDetail();
  returnDate(calDate.getDate());
}

function setReset(){
  window.dialogArguments.value='';
  close();
}

function setYear(){
	year=parseInt(document.calControl.year.value,10);
	if(year>1900&&year<3000){
		calDate.setFullYear(year);
		buildDetail();
	}else {
	document.getElementById("detail").innerHTML="";
    alert('Año no valido');
    document.calControl.year.select();
    document.calControl.year.focus();
	}
}

function setNextYear(){
    if(isFourDigitYear(year)){
    year++;
    calDate.setFullYear(year);
    document.calControl.year.value=year;
    buildDetail();
    }
}

function setPreviousYear(){if(isFourDigitYear(year)&&year>1000){year--;calDate.setFullYear(year);document.calControl.year.value=year;buildDetail();}}
function setMonth(){month=document.calControl.month.selectedIndex;calDate.setMonth(month);buildDetail();}
function setPreviousMonth(){if(isFourDigitYear(year)){if(month==0){month=11;if(year>1000){year--;calDate.setFullYear(year);document.calControl.year.value=year;}}else month--;calDate.setMonth(month);document.calControl.month.selectedIndex=month;buildDetail();}}
function setNextMonth(){if(isFourDigitYear(year)){if(month==11){month=0;year++;calDate.setFullYear(year);document.calControl.year.value=year;}else month++;calDate.setMonth(month);document.calControl.month.selectedIndex=month;buildDetail();}}
function getDaysInMonth(){switch (month){case 0:case 2:case 4:case 6:case 7:case 9:case 11:{return (31);}case 3:case 5:case 8:case 10:{return (30);}case 1:{if((((year % 4)==0)&&((year % 100)!=0)||((year % 400)==0))) return(29);else return(28);}}}
function isFourDigitYear(year){if(year<1000){with (document.calControl.year){value=calDate.getFullYear();select();focus();}}else return true;}
function jsReplace(inString,find,replace){var outString="";if(!inString)return "";if(inString.indexOf(find)!=-1){t=inString.split(find);return(t.join(replace));}else return inString;}
function makeTwoDigit(inValue){var numVal=parseInt(inValue,10);if(numVal<10)return("0"+numVal);else return numVal;}
function buildCalParts(){
		weekdays="<TR class=cellColor>";
		for(var cont=0;cont<7;cont++)
			weekdays+="<TD class='heading'>"+weekdayArray[cont]+"</TD>";
		weekdays+="</TR>";
		blankCell="<TD class=cellColor>&nbsp;&nbsp;&nbsp;</TD>";
		calendarBegin="<CENTER><TABLE class=weekClass CELLPADDING=3 border=0 CELLSPACING=0>";
		calendarBegin+=weekdays+"<TR>";
		calendarEnd="</TABLE></CENTER>";
}
function buildDetail(){
		var calDoc=calendarBegin;
		var days=getDaysInMonth();
		var firstOfMonth=new Date(year,month,1);
		var startingPos=firstOfMonth.getDay();
		var columnCount=0;
		
		if(startingPos==0)
			startingPos=7;
		startingPos--;
		days+=startingPos;
		
		for(var cont=0;cont < startingPos;cont++){
			calDoc+=blankCell;columnCount++;
		}
		
		var currentDay=0;
		var dayType="weekday";
		
		for (var cont=startingPos;cont<days;cont++){
			currentDay=cont-startingPos+1;
			if(currentDay==day)
				dayType="focusDay";
			else dayType="weekDay";
				calDoc+="<TD class=cellColor>";
			calDoc+="<a class='"+dayType+"' href='_' onClick=returnDate(";
			calDoc+=currentDay+");return(false)>&nbsp;"+currentDay+"&nbsp;</a></TD>";
			columnCount++;
			
			if (columnCount % 7 == 0) 
				calDoc+="</TR><TR>";
		}
		
		for (var cont=days; cont<42; cont++){
			calDoc+=blankCell;columnCount++;
			
			if (columnCount % 7==0){
				calDoc+="</TR>";
				if (cont<41) 
					calDoc+="<TR>";
			}
		}
		
		calDoc+=calendarEnd;
		document.getElementById("detail").innerHTML=calDoc;
}
var meses=new Array ( "","Enero",
                        "Febrero",
                        "Marzo",
                        "Abril",
                        "Mayo",
                        "Junio",
                        "Julio",
                        "Agosto",
                        "Septiembre",
                        "Octubre",
                        "Noviembre",
                        "Diciembre");
function getMonthNumber2 (aMonth) {
		aMonth=aMonth.toUpperCase();for (var cont=1; cont<13; cont++) if (aMonth==meses[cont]) return (cont);return (0);}
function getObjectDay2 (aDay) {
	var dayArray=aDay.split ("/");
	var monthArray = aDay.split(" - ");
	if (dayArray.length!=3 && monthArray.length != 2)
		 return (false);
	if (dayArray.length==3) 
		return (new Date (parseFloat (dayArray[2]), parseFloat(dayArray[1])-1, parseFloat(dayArray[0])));
	if (monthArray.length==2) 
		return (new Date(parseFloat(monthArray[1]),getMonthNumber2(monthArray[0])-1,1));
		}
function load(fecha){
    buildCalParts();
    //calDate = (window.dialogArguments.value == "") ? (new Date()) : (getObjectDay2(window.dialogArguments.value));
    
    if (fecha.length != 0) {
    	datos = fecha.split("/");
    	calDate = new Date(datos[2], datos[1]-1, datos[0]);
    } 
    else {
    	calDate = new Date();
    }
        
    day=calDate.getDate();
    month=calDate.getMonth();
    year=calDate.getFullYear();    
    
    buildDetail();
    document.calControl.month.selectedIndex=month;
    document.calControl.year.value=year;
}

function returnDate(inDay){
		var outDate=calDateFormat;
		outDate=jsReplace(outDate,"DD",makeTwoDigit(inDay));
		outDate=jsReplace(outDate,"MM",makeTwoDigit(month+1));
		if(calDateFormat.indexOf("YYYY")!=-1)outDate=jsReplace(outDate,"YYYY",year);
		else if(calDateFormat.indexOf("YY")!=-1)outDate=jsReplace(outDate,"YY",new String(year).substring(2,4));
		window.top.returnValue=outDate;		
		close();
}

function showCalendarGeneral(inputElement){
	var resultado = showModalDialog("<%=app%>/html/jsp/general/calendarGeneral.jsp?valor="+inputElement.value,inputElement,"dialogHeight:275px;dialogWidth:400px;help:no;scroll:no;status:no;");	
	if (resultado) {
		inputElement.value = resultado;		
		jQuery(inputElement).blur();
	} 
	else 
		if (inputElement.value=="") 
			jQuery(inputElement).blur();
	return false;
}	