window.OlvyInstances=[];let canvasX=0;let canvasY=0;let lastMouseX=0;let mousex=0;let canvasMouseDrag=false;let canvasElements=[];let lastElementDimensions={};let selectedCanvasElement="rect";let screenRecorderStream={};let feedbackWidgetInstance=null;let organisationMeta=null;const OLVY_SCREENSHOT_PREFERRED_MODE="third-party";const OLVY_WIDGET_TYPE_RELEASES="announcements";const OLVY_WIDGET_TYPE_FEEDBACK="feedback";const OLVY_WIDGET_FEEDBACK_SUB_TYPE_SIMPLE="simple";const OLVY_WIDGET_FEEDBACK_SUB_TYPE_RATING="rating";const OLVY_WIDGET_RELEASES_SUB_TYPE_MODAL="modal";const OLVY_WIDGET_RELEASES_SUB_TYPE_SIDEBAR="sidebar";const OLVY_WIDGET_RELEASES_SUB_TYPE_EMBED="embed";const OLVY_WIDGET_RELEASES_SUB_TYPE_POPUP="popup";let isUserActive=false;let isScrolling=false;let isNotificationPopupSetup=false;let htmlToImageScriptTag=null;let currentlyRecording=false;let currentRecordingTime={seconds:00,minutes:00,};let screenRecordingInterval=null;const DEFAULT_WIDGET_CONFIG={appearance:{customCSS:``,showSearch:false,compact:false,showUnreadIndicator:true,unreadIndicatorColor:"#cc1919",unreadIndicatorPosition:"top-right",},config:{floatPosition:"",targetElement:"#olvy-whats-new",appendTo:"body",},};function _checkTargetExists(targetElement){const element=document.querySelector(targetElement);if(element){return true;}
return false;}
function useNativeScreenshotForCurrentOrganisation(){if(organisationMeta&&organisationMeta?.useNativeScreenshot===true)
return true;else return false;}
function _drawAllCanvasElements(clearCanvas=true){const canvas=document.getElementById("olvy-attach-screenshot");if(canvas){if(clearCanvas)ctx.clearRect(0,0,canvas.width,canvas.height);ctx.strokeStyle="rgb(219 39 119)";ctx.lineWidth=2;canvasElements.forEach((element)=>{if(element.type==="rect"){ctx.beginPath();ctx.rect(element.top,element.left,element.width,element.height);ctx.stroke();}else if(element.type==="line"){ctx.lineWidth=2;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();ctx.moveTo(element?.initalCoordinates?.x,element?.initalCoordinates?.y);if(element?.coordinates?.length>0){element.coordinates.forEach((values)=>{ctx.lineTo(values.x,values.y);});}
ctx.stroke();}});}}
function _allowScreenshot(instance){feedbackWidgetInstance=instance;canvasElements=[];if(OLVY_SCREENSHOT_PREFERRED_MODE==="third-party"){htmlToImageScriptTag=document.createElement("script");htmlToImageScriptTag.src=`https://app.olvy.co/htmlToImage.js`;document.head.appendChild(htmlToImageScriptTag);}
const currentWindowScroll=window.scrollY;const bodyElement=document.querySelector(`body`);bodyElement.classList.add("olvy-screenshot-overlay");bodyElement.style.top=`-${currentWindowScroll}px`;const styleEl=document.createElement("style");styleEl.id=`olvy-screenshot`;CSSElement=styleEl;CSSElement.innerHTML=`
    .olvy-screenshot-overlay {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 2000000;
    }
    .olvy-screenshot-element {
      position: fixed;
      top: 0;
      left: 0;
      cursor: crosshair;
      z-index: 199999991;
    }
    .olvy-screenshot-element::selection {
      background: white;
    }
    .olvy-screenshot-options {
      position: fixed;
      top: 0;
      left: 0.5rem;
      width: auto;
      height: auto;
      z-index: 199999992;
    }
    .olvy-screenshot-options .tooltiptext {
      visibility: hidden;
      background-color: white;
      color: rgb(219 39 119);
      text-align: center;
      border-radius: 6px;
      padding: 5px 0;    
      position: absolute;
      z-index: 1;
      font-size: 0.75rem;
      padding: 0.5rem 0.75rem;
      left: 4rem;
      border: 1px solid rgb(219 39 119);
    }
    .olvy-screenshot-options:hover .tooltiptext {
      visibility: visible;
    }
    .olvy-screenshot-options-circle {
      height: 3rem;
      width: 3rem;
      border-radius: 100%;
      margin: 0.75rem 0;
      background-color: rgb(219 39 119);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid rgb(219 39 119);
    }
    .olvy-screenshot-options-circle-selected {
      color: rgb(219 39 119) !important;
      background: white !important;
    }
    .olvy-screenshot-options-close {
      position: fixed;
      top: 0rem;
      right: 1rem;
      height: 3rem;
      width: 3rem;
      border-radius: 100%;
      margin: 0.75rem 0;
      background-color: rgb(219 39 119);
      color: white;
      z-index: 199999992;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .olvy-screenshot-attach-image {
      position: fixed;
      bottom: 0;
      right: 1rem;
      height: auto;
      width: auto;
      font-size: 1.25rem;
      background-color: rgb(219 39 119);
      color: white;
      z-index: 199999992;
      border-radius: 0.75rem 0.75rem 0 0;
      padding: 1rem 1.25rem;
      font-family: inherit;
      font-weight: 500;
      cursor: pointer;
    }
    .olvy-screenshot-options-hide {
      visibility: hidden !important;
    }
    .olvy-attachement-container {
      height: 100vh;
      width: 100vw;
      position: fixed;
      top: 0; 
      left: 0;
      border: 5px solid rgb(219 39 119);
      box-sizing: border-box;
    }
    .olvy-screenshot-loading-state{
      height: 100vh;
      width: 100vw;
      position: fixed;
      top: 0; 
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 199999993;
    }
  `;_showScreenshotOptions();document.querySelector("head").appendChild(CSSElement);let canvas=document.createElement("canvas");canvas.id="olvy-attach-screenshot";canvas.classList.add("olvy-screenshot-element");canvas.height=window.innerHeight;canvas.width=window.innerWidth;document.querySelector("body").appendChild(canvas);ctx=canvas.getContext("2d");canvasX=canvas.getBoundingClientRect().left;canvasY=canvas.getBoundingClientRect().top;document.getElementById("olvy-attach-screenshot").addEventListener("mousedown",function(e){lastMouseX=parseInt(e.clientX-canvasX);lastMouseY=parseInt(e.clientY-canvasY);canvasMouseDrag=true;if(selectedCanvasElement==="line"){ctx.strokeStyle="rgb(219 39 119)";ctx.lineWidth=2;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();ctx.moveTo(lastMouseX,lastMouseY);lastElementDimensions={type:"line",initalCoordinates:{x:lastMouseX,y:lastMouseY},};}});document.getElementById("olvy-attach-screenshot").addEventListener("mouseup",function(e){canvasMouseDrag=false;if(Object.keys(lastElementDimensions).length>0){canvasElements.push(lastElementDimensions);}
if(document.getElementById("olvy-screenshot-close").classList.contains("olvy-screenshot-options-hide")){_toggleScreenShotOptionsVisibility();}
_drawAllCanvasElements();});document.getElementById("olvy-attach-screenshot").addEventListener("mousemove",function(e){mousex=parseInt(e.clientX-canvasX);mousey=parseInt(e.clientY-canvasY);if(canvasMouseDrag){if(!document.getElementById("olvy-screenshot-close").classList.contains("olvy-screenshot-options-hide")){_toggleScreenShotOptionsVisibility();}
if(selectedCanvasElement==="rect"){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.beginPath();var width=mousex-lastMouseX;var height=mousey-lastMouseY;ctx.rect(lastMouseX,lastMouseY,width,height);ctx.strokeStyle="rgb(219 39 119)";ctx.lineWidth=2;ctx.stroke();lastElementDimensions={width:width,height:height,type:"rect",top:lastMouseX,left:lastMouseY,};_drawAllCanvasElements(false);}else if(selectedCanvasElement==="line"){ctx.lineTo(mousex,mousey);ctx.stroke();let currentCoordinates=lastElementDimensions?.coordinates||[];currentCoordinates.push({x:mousex,y:mousey,});lastElementDimensions["coordinates"]=currentCoordinates;}}});}
function _removeAllowScreenshot(){const bodyElement=document.querySelector(`body`);bodyElement.classList.remove("olvy-screenshot-overlay");bodyElement.style.top="0px";bodyElement.removeChild(document.getElementById("olvy-attach-screenshot"));bodyElement.removeChild(document.getElementById("olvy-screenshot-options"));bodyElement.removeChild(document.getElementById("olvy-screenshot-attach"));bodyElement.removeChild(document.getElementById("olvy-screenshot-close"));bodyElement.removeChild(document.getElementById("olvy-screenshot-container"));}
function _showScreenshotOptions(){const leftOptionsWrapper=document.createElement("div");leftOptionsWrapper.classList.add("olvy-screenshot-options");leftOptionsWrapper.id="olvy-screenshot-options";const clearButton=document.createElement("div");clearButton.classList.add("olvy-screenshot-options-circle");clearButton.innerHTML=`
  <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.25rem; width: 1.25rem;" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
  `;clearButton.onclick=_clearScreenshotCanvas;clearButton.id="olvy-screenshot-clear";const clearTooltop=document.createElement("span");clearTooltop.innerHTML="Clear";clearTooltop.classList.add("tooltiptext");clearButton.appendChild(clearTooltop);const pencilButton=document.createElement("div");pencilButton.classList.add("olvy-screenshot-options-circle");pencilButton.id="olvy-screenshot-pencil-element";pencilButton.innerHTML=`
  <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.25rem; width: 1.25rem;" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
  </svg>
  `;pencilButton.onclick=()=>_changeCanvasElement("line");const pencilTooltip=document.createElement("span");pencilTooltip.innerHTML="Pen";pencilTooltip.classList.add("tooltiptext");pencilButton.appendChild(pencilTooltip);const rectButton=document.createElement("div");rectButton.classList.add("olvy-screenshot-options-circle");rectButton.id="olvy-screenshot-reactangle-element";rectButton.innerHTML=`
  <svg xmlns="http://www.w3.org/2000/svg"style="height: 1.25rem; width: 1.25rem;" fill="currentColor" class="bi bi-square" viewBox="0 0 16 16">
    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
  </svg>
  `;rectButton.onclick=()=>_changeCanvasElement("rect");const rectTooltip=document.createElement("span");rectTooltip.innerHTML="Highlight";rectTooltip.classList.add("tooltiptext");rectButton.appendChild(rectTooltip);leftOptionsWrapper.appendChild(rectButton);leftOptionsWrapper.appendChild(pencilButton);leftOptionsWrapper.appendChild(clearButton);const closeButton=document.createElement("div");closeButton.classList.add("olvy-screenshot-options-close");closeButton.innerHTML=`
  <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.25rem; width: 1.25rem;" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
  </svg>
  `;closeButton.id="olvy-screenshot-close";closeButton.onclick=()=>{_removeAllowScreenshot();if(feedbackWidgetInstance?.widgetTypeInstance?.show)
feedbackWidgetInstance.widgetTypeInstance.show();feedbackWidgetInstance=null;};const attachButton=document.createElement("div");attachButton.classList.add("olvy-screenshot-attach-image");attachButton.innerHTML=`
    <div style="display: flex; align-items: center; justify-content: center;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height: 1.5rem; width: 1.25rem; margin-right: 0.5rem; fill: white;"><path fill="none" d="M0 0h24v24H0z"/><path d="M9 3h6l2 2h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4l2-2zm3 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>
      Add Screenshot
    </div>
    `;attachButton.onclick=_attachCanvasScreenshot;attachButton.id="olvy-screenshot-attach";const screenshotContainer=document.createElement("div");screenshotContainer.classList.add("olvy-attachement-container");screenshotContainer.id="olvy-screenshot-container";document.querySelector("body").appendChild(screenshotContainer);document.querySelector("body").appendChild(leftOptionsWrapper);document.querySelector("body").appendChild(attachButton);document.querySelector("body").appendChild(closeButton);_changeCanvasElement("rect");}
function _toggleScreenshotLoading(toShow){if(document.getElementById("olvy-screenshot-attach")&&toShow){document.getElementById("olvy-screenshot-attach").classList.remove("olvy-screenshot-options-hide");if(!document.getElementById("olvy-screenshot-loading-state")){const loadingDiv=document.createElement("div");loadingDiv.classList.add("olvy-screenshot-loading-state");loadingDiv.id="olvy-screenshot-loading-state";document.querySelector("body").appendChild(loadingDiv);}
const attachButton=document.getElementById("olvy-screenshot-attach");attachButton.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center;">
      Adding Screenshot...
    </div>`;}else{if(document.getElementById("olvy-screenshot-loading-state"))
document.querySelector("body").removeChild(document.getElementById("olvy-screenshot-loading-state"));}}
async function _attachCanvasScreenshot(){const node=document.querySelector("body");if(!document.getElementById("olvy-screenshot-close").classList.contains("olvy-screenshot-options-hide"))
_toggleScreenShotOptionsVisibility();_toggleScreenshotLoading(true);if(OLVY_SCREENSHOT_PREFERRED_MODE==="third-party"&&!useNativeScreenshotForCurrentOrganisation()){if(html2canvas){try{html2canvas(document.body).then(function(canvas){const dataURL=canvas.toDataURL("image/png");fetch(dataURL).then((res)=>res.blob()).then((blob)=>{document.head.removeChild(htmlToImageScriptTag);if(feedbackWidgetInstance!==null){window.frames[`olvy-frame-${feedbackWidgetInstance.alias}`].postMessage({key:`olvy-captured-screenshot`,value:blob,},"*");_removeAllowScreenshot();if(feedbackWidgetInstance?.widgetTypeInstance?.show)
feedbackWidgetInstance.widgetTypeInstance.show();feedbackWidgetInstance=null;_toggleScreenshotLoading(false);}});});}catch(error){console.error("[Olvy] - Unable to save screenshot",error);}}else{_toggleScreenshotLoading(false);console.warn("[Olvy] - Unable to save screenshot");}}else{const canvas=document.createElement("canvas");const video=document.createElement("video");try{const captureStream=await navigator.mediaDevices.getDisplayMedia({preferCurrentTab:true,});video.srcObject=captureStream;video.autoplay=true;const windowDimensions={height:window.innerHeight,width:window.innerWidth,};canvas.height=windowDimensions.height;canvas.width=windowDimensions.width;video.addEventListener("play",()=>{canvas.getContext("2d").drawImage(video,0,0,windowDimensions.width,windowDimensions.height);let dataURL=canvas.toDataURL("image/png");captureStream.getTracks().forEach((track)=>track.stop());fetch(dataURL).then((res)=>res.blob()).then((blob)=>{if(feedbackWidgetInstance!==null){window.frames[`olvy-frame-${feedbackWidgetInstance.alias}`].postMessage({key:`olvy-captured-screenshot`,value:blob,},"*");_removeAllowScreenshot();if(feedbackWidgetInstance?.widgetTypeInstance?.show)
feedbackWidgetInstance.widgetTypeInstance.show();feedbackWidgetInstance=null;_toggleScreenshotLoading(false);}});});}catch(err){console.error("[Olvy] - Unable to save screenshot",err);}}}
function _changeCanvasElement(type){selectedCanvasElement=type;lastElementDimensions={};if(type==="rect"){document.getElementById("olvy-screenshot-reactangle-element").classList.add("olvy-screenshot-options-circle-selected");document.getElementById("olvy-screenshot-pencil-element").classList.remove("olvy-screenshot-options-circle-selected");}else{document.getElementById("olvy-screenshot-reactangle-element").classList.remove("olvy-screenshot-options-circle-selected");document.getElementById("olvy-screenshot-pencil-element").classList.add("olvy-screenshot-options-circle-selected");}}
function _clearScreenshotCanvas(){const canvas=document.getElementById("olvy-attach-screenshot");if(ctx){ctx.clearRect(0,0,canvas.width,canvas.height);canvasElements=[];lastElementDimensions={};}}
function _toggleScreenShotOptionsVisibility(){if(document.getElementById("olvy-screenshot-close").classList.contains("olvy-screenshot-options-hide")){document.getElementById("olvy-screenshot-close").classList.remove("olvy-screenshot-options-hide");document.getElementById("olvy-screenshot-attach").classList.remove("olvy-screenshot-options-hide");document.getElementById("olvy-screenshot-reactangle-element").classList.remove("olvy-screenshot-options-hide");document.getElementById("olvy-screenshot-pencil-element").classList.remove("olvy-screenshot-options-hide");document.getElementById("olvy-screenshot-clear").classList.remove("olvy-screenshot-options-hide");}else{document.getElementById("olvy-screenshot-close").classList.add("olvy-screenshot-options-hide");document.getElementById("olvy-screenshot-attach").classList.add("olvy-screenshot-options-hide");document.getElementById("olvy-screenshot-reactangle-element").classList.add("olvy-screenshot-options-hide");document.getElementById("olvy-screenshot-pencil-element").classList.add("olvy-screenshot-options-hide");document.getElementById("olvy-screenshot-clear").classList.add("olvy-screenshot-options-hide");}}
function _screenRecord(instance){feedbackWidgetInstance=instance;const styleEl=document.createElement("style");styleEl.id=`olvy-screenrecord`;CSSElement=styleEl;CSSElement.innerHTML=`
    .olvy-screenrecord-options {
      position: absolute;
      top: 0;
      left: 0rem;
      width: auto;
      height: auto;
      z-index: 100;
    }
    .olvy-screenrecord-options-close {
      position: fixed;
      top: 0rem;
      right: 1rem;
      height: 3rem;
      width: 3rem;
      border-radius: 100%;
      margin: 0.75rem 0;
      background-color: rgb(219 39 119);
      color: white;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .olvy-screenrecord-record {
      position: fixed;
      bottom: 0;
      right: 0.5rem;
      height: auto;
      width: auto;
      font-size: 1.25rem;
      background-color: rgb(219 39 119);
      color: white;
      z-index: 10000;
      padding: 1rem 1.25rem;
      font-family: inherit;
      font-weight: 500;
      cursor: pointer;
      border-radius: 0.75rem 0.75rem 0 0;
    }
    .olvy-screenrecord-hide {
      visibility: hidden !important;
    }
    .olvy-screenrecord-floating-button{
      position: fixed;
      bottom: 5.25rem;
      right: 0;
      left: 0;
      margin: 0 auto;
      height: 3rem;
      width: fit-content;
      background: white;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #D9D0D0;
      padding: 0 0.5rem;
      box-shadow: 0px 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .olvy-drag-focus {
      border: 1px solid #DB2777;
    }
    .olvy-screenrecord-container {
      height: 100vh;
      width: 100vw;
      box-sizing: border-box;
      position: fixed;
      top: 0; 
      left: 0;
      border: 5px solid rgb(219 39 119);
    }
  `;document.querySelector("head").appendChild(CSSElement);const closeButton=document.createElement("div");closeButton.classList.add("olvy-screenrecord-options-close");closeButton.innerHTML=`
  <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.25rem; width: 1.25rem;" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
  </svg>
  `;closeButton.id="olvy-screenrecord-close";closeButton.onclick=()=>{if(feedbackWidgetInstance?.widgetTypeInstance?.show)
feedbackWidgetInstance.widgetTypeInstance.show();feedbackWidgetInstance=null;_removeScreenRecording();};const recordingFloatingButton=document.createElement("div");recordingFloatingButton.classList.add("olvy-screenrecord-floating-button");recordingFloatingButton.id="olvy-screenrecord-floating-button";recordingFloatingButton.innerHTML=`
    <div style="background-color: #DB2777; height: 2rem; width:auto; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem;padding: 0 0.75rem; cursor: pointer;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  style="height: 1.25rem; width: auto; margin-right: 0.25rem; fill: white;" id="olvy-floating-button-start-icon"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  style="height: 1.25rem; width: auto; margin-right: 0.25rem; fill: white; display: none;" id="olvy-floating-button-stop-icon"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9 9h6v6H9V9z"/></svg>
      <div style="font-size: 0.85rem; color: white; font-family: inherit; white-space: no-wrap;" id="olvy-floating-button-text">Record</div>
    </div>
    <div style="font-size: 0.85rem; color: black; font-family: inherit; white-space: no-wrap; margin-left: 0.5rem; display: none;" id="olvy-floating-button-timer"></div>

  `;recordingFloatingButton.onclick=_recorderButtonClicked;const screenRecordContainer=document.createElement("div");screenRecordContainer.classList.add("olvy-screenrecord-container");screenRecordContainer.id="olvy-screenrecord-container";document.querySelector("body").appendChild(screenRecordContainer);document.querySelector("body").appendChild(recordingFloatingButton);document.querySelector("body").appendChild(closeButton);}
function _recorderButtonClicked(){if(currentlyRecording===false)_startScreenRecording();else{currentlyRecording=false;clearInterval(screenRecordingInterval);_stopScreenRecording();}}
function _stopScreenRecordingInterval(){clearInterval(screenRecordingInterval);currentlyRecording=false;currentRecordingTime.seconds=00;currentRecordingTime.minutes=00;_stopScreenRecording();}
function _startRecorderInterval(){const recordStartIconElement=document.getElementById("olvy-floating-button-start-icon");const recordStopIconElement=document.getElementById("olvy-floating-button-stop-icon");const recordTextElement=document.getElementById("olvy-floating-button-text");const recordTimerElement=document.getElementById("olvy-floating-button-timer");currentlyRecording=true;recordStartIconElement.style.display="none";recordStopIconElement.style.display="block";recordTextElement.innerText="Stop Recording";if(document.getElementById("olvy-screenrecord-close"))
document.getElementById("olvy-screenrecord-close").classList.add("olvy-screenrecord-hide");screenRecordingInterval=setInterval(()=>{currentRecordingTime.seconds+=1;if(currentRecordingTime.seconds>=60){currentRecordingTime.minutes+=1;currentRecordingTime.seconds-=60;}
if(currentRecordingTime.minutes>=60)_stopScreenRecordingInterval();if(recordTimerElement.style.display==="none")
recordTimerElement.style.display="block";recordTimerElement.innerText=`${currentRecordingTime.minutes}:${currentRecordingTime.seconds}`;},1000);}
async function _startScreenRecording(){try{let stream=await navigator.mediaDevices.getDisplayMedia({preferCurrentTab:true,});let recorder;if(MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus"))
recorder=new MediaRecorder(stream,{mimeType:"video/webm;codecs=vp8,opus",});else recorder=new MediaRecorder(stream);let data=[];recorder.ondataavailable=(event)=>{data.push(event.data);};recorder.addEventListener("stop",function(){_stopScreenRecordingInterval();currentlyRecording=false;let blob=new Blob(data,{type:data[0].type,});if(feedbackWidgetInstance!==null){window.frames[`olvy-frame-${feedbackWidgetInstance.alias}`].postMessage({key:`olvy-captured-screenrecording`,value:blob,},"*");if(feedbackWidgetInstance?.widgetTypeInstance?.show)
feedbackWidgetInstance.widgetTypeInstance.show();feedbackWidgetInstance=null;_removeScreenRecording();}});recorder.start();_startRecorderInterval();screenRecorderStream=stream;}catch(e){console.warn("[Olvy] - Unable to start recorder",e);}}
function _stopScreenRecording(){const stream=screenRecorderStream;stream.getTracks().forEach((track)=>track.stop());_removeScreenRecording();}
function _hideStopRecordingButton(){document.getElementById("olvy-stop-screenrecord").classList.add("olvy-screenrecord-hide");}
function _removeScreenRecording(){const bodyElement=document.querySelector(`body`);if(document.getElementById("olvy-screenrecord-floating-button"))
bodyElement.removeChild(document.getElementById("olvy-screenrecord-floating-button"));if(document.getElementById("olvy-screenrecord-close"))
bodyElement.removeChild(document.getElementById("olvy-screenrecord-close"));if(document.getElementById("olvy-screenrecord-container"))
bodyElement.removeChild(document.getElementById("olvy-screenrecord-container"));}
function __addPathChangeListener(fn){var currentPath=window.location.pathname;return window.setInterval(()=>{if(window.location.pathname!==currentPath){currentPath=window.location.pathname;fn();}},1000);}
function _checkPageRules(rules){if(rules&&rules.length>0){let showWidget=[];const location=window.location;rules.forEach((rule)=>{if(rule?.value.length>0||rule?.queryValue?.key?.length>0){if(rule.ruleType==="query-params"){let currentQueries=[];new URLSearchParams(location.search).forEach((value,key)=>currentQueries.push({key:key,value:value}));if(rule.ruleCondition==="is-empty"&&new URLSearchParams(location.search).get(rule?.queryValue?.key)==="")
showWidget.push("true");if(rule.ruleCondition==="not-equal"&&new URLSearchParams(location.search).get(rule?.queryValue?.key)!==rule?.queryValue?.value)
showWidget.push("true");if(rule.ruleCondition==="equals"&&new URLSearchParams(location.search).get(rule?.queryValue?.key)===rule?.queryValue?.value)
showWidget.push("true");if(rule.ruleCondition==="not-contains"&&new URLSearchParams(location.search).get(rule?.queryValue?.key).indexOf(rule?.queryValue?.value)==-1)
showWidget.push("true");if(rule.ruleCondition==="contains"&&new URLSearchParams(location.search).get(rule?.queryValue?.key).indexOf(rule?.queryValue?.value)>-1)
showWidget.push("true");if(rule.ruleCondition==="starts-with"&&new URLSearchParams(location.search).get(rule?.queryValue?.key).startsWith(rule.queryValue?.value))
showWidget.push("true");if(rule.ruleCondition==="ends-with"&&new URLSearchParams(location.search).get(rule?.queryValue?.key).endsWith(rule.queryValue?.value))
showWidget.push("true");}
if(rule.ruleType==="hostname"){if(rule.ruleCondition==="equals"&&location.hostname===rule.value)
showWidget.push("true");if(rule.ruleCondition==="not-equal"&&location.hostname!==rule.value)
showWidget.push("true");if(rule.ruleCondition==="contains"&&location.hostname.indexOf(rule.value)>-1)
showWidget.push("true");if(rule.ruleCondition==="not-contains"&&location.hostname.indexOf(rule.value)==-1)
showWidget.push("true");if(rule.ruleCondition==="starts-with"&&location.hostname.startsWith(rule.value))
showWidget.push("true");if(rule.ruleCondition==="ends-with"&&location.hostname.endsWith(rule.value))
showWidget.push("true");}
if(rule.ruleType==="path"){if(rule.ruleCondition==="equals"&&location.pathname===rule.value)
showWidget.push("true");if(rule.ruleCondition==="not-equals"&&location.pathname!==rule.value)
showWidget.push("true");if(rule.ruleCondition==="contains"&&location.pathname.indexOf(rule.value)>-1)
showWidget.push("true");if(rule.ruleCondition==="not-contains"&&location.pathname.indexOf(rule.value)==-1)
showWidget.push("true");if(rule.ruleCondition==="starts-with"&&location.pathname.startsWith(rule.value))
showWidget.push("true");if(rule.ruleCondition==="ends-with"&&location.pathname.endsWith(rule.value))
showWidget.push("true");}}});return showWidget.length===rules.length;}else{return true;}}
function __waitForElement(selector){return new Promise((resolve,reject)=>{const interval=setInterval(()=>{if(document.querySelector(selector)){window.clearTimeout(timeout);window.clearInterval(interval);resolve(document.querySelector(selector));}},2000);const timeout=setTimeout(()=>{window.clearInterval(interval);reject(new Error("target element not found in the DOM"));},10000);});}
function __removePathChangeListener(id){return window.clearInterval(id);}
function __setLocalStorage(key,value){try{if(_isLocalStorageAvailable())window.localStorage.setItem(key,value);}catch(e){console.warn("[Olvy] - Unable to set local storage",e);}}
function _isLocalStorageAvailable(){try{window.localStorage.setItem("check","checkingLocalStorage");window.localStorage.removeItem("check");return true;}catch(e){return false;}}
function __getLocalStorage(key){try{if(_isLocalStorageAvailable())return window.localStorage.getItem(key);return null;}catch(e){console.warn("[Olvy] - Unable to get local storage",e);return null;}}
function _getLocalStorageValues(alias){try{let LCValues={disable_snooze:__getLocalStorage(`olvy-rating-${alias}-disable-autoSnooze`),snooze_timestamp:__getLocalStorage(`olvy-rating-${alias}-snooze`),};return LCValues;}catch(e){return{};}}
function getAliasFromCookies(){var cookie=document.cookie.split(";");for(var i=0;i<cookie.length;i++){var name=cookie[i].split("=")[0].trim();if(name=="olvyWorkspaceAlias"){return cookie[i].split("=")[1];}}}
function __checkAndAddMetaViewPort(){const isViewportTagPresent=document.querySelector('meta[name="viewport"]');if(!isViewportTagPresent&&document){const meta=document.createElement("meta");meta.name="viewport";meta.content="width=device-width, initial-scale=1.0";document.head.appendChild(meta);}}
function getPopupPosition(widgetInstance){try{let viewHeight=Math.max(document.documentElement.clientHeight||0,window.innerHeight||0);let viewWidth=Math.max(document.documentElement.clientWidth||0,window.innerWidth||0);let popupHeight=viewHeight*0.6;let popupWidth=480;let targetEl=document.querySelector(widgetInstance.config.targetElement);var viewportOffset=targetEl.getBoundingClientRect();let targetButtonHeight=targetEl.clientHeight;let targetButtonWidth=targetEl.clientWidth;const viewportX=viewportOffset.x;const viewportY=viewportOffset.y;let bodyRect=document.body.getBoundingClientRect();let targetButtonOffsetTop=Math.round(viewportOffset.top-bodyRect.top);const heightAvailable=viewportY>popupHeight;const widthAvailable=viewportX>popupWidth;const bottomPositionOfPopup=Math.round(viewHeight-targetButtonOffsetTop);const rightPositionOfPopup=Math.round(viewWidth-viewportX-targetButtonWidth);const popupFinalPosition=`
      ${
heightAvailable?"bottom: "+bottomPositionOfPopup+"px;":"top: "+(targetButtonOffsetTop+targetButtonHeight+10)+"px;"
}
      ${
widthAvailable?"right: "+rightPositionOfPopup+"px;":"left: "+viewportX+"px;"
}
    `;return{popupFinalPosition,heightAvailable,widthAvailable,};}catch(e){console.warn("[Olvy] - We ran into issue finding or linking your target element with the widget. Please check if the element you've added to the widget config exists on the page");}}
function getPopupPositionOnScroll(widgetInstance){let popupId="olvy-iframe-container-"+widgetInstance.alias;let{heightAvailable,popupFinalPosition}=getPopupPosition(widgetInstance);applyPopupFinalPosition(popupId,popupFinalPosition);}
function applyPopupFinalPosition(popupId,popupFinalPosition){let popupElement=document.getElementById(popupId);if(popupElement){popupElement.setAttribute("style",popupFinalPosition);}else{console.warn("popup not found");}}
function __isObject(item){return item&&typeof item==="object"&&!Array.isArray(item);}
function __deepMerge(target,...sources){if(!sources.length)return target;const source=sources.shift();if(__isObject(target)&&__isObject(source)){for(const key in source){if(__isObject(source[key])){if(!target[key])Object.assign(target,{[key]:{}});__deepMerge(target[key],source[key]);}else{Object.assign(target,{[key]:source[key]});}}}
return __deepMerge(target,...sources);}
function __onPageReady(fn){if(document.readyState==="complete"){fn();}else{window.addEventListener("load",()=>{fn();});}}
function _triggerOnIdle(cb){const cbTimeout=10000;if(window.requestIdleCallback){const idleCbID=window.requestIdleCallback((callInfo)=>{window.cancelIdleCallback(idleCbID);if(callInfo.timeRemaining()>0)cb();},{timeout:cbTimeout});}else{setTimeout(cb,cbTimeout);}}
function _triggerFileDownload(link,name){const downloadElement=document.createElement("a");downloadElement.href=link;downloadElement.download=`attached-media-${name}`;downloadElement.style.cssText="display:none;";document.body.appendChild(downloadElement);downloadElement.click();}
function _listenForAutoTheme(cb){if(window.matchMedia){if(window.matchMedia("(prefers-color-scheme: dark)").matches){cb("dark");}
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",(e)=>{if(e.matches)cb("dark");else cb("light");});}}
function OlvyReleasesModalWidget(widgetInstance){this.widgetInstance=widgetInstance;this.olvyInstance=widgetInstance.olvyInstance;this.handleTargetClick=(e)=>{e.preventDefault();e.stopPropagation();this.widgetInstance.show();};this.init=()=>{};this.setup=()=>{const modalElement=document.createElement("div");modalElement.id=`olvy-modal-${this.widgetInstance.alias}`;modalElement.classList.add("olvy-modal");modalElement.innerHTML=`
      <div data-test="modal-overlay" class="olvy-modal-overlay" id="${`olvy-modal-overlay-${this.widgetInstance.alias}`}"></div>
          <div data-test="modal-frame-container" class="olvy-frame-container olvy-frame-modal" id="${`olvy-frame-container-${this.widgetInstance.alias}`}">
        <iframe data-test="modal-iframe" allow="clipboard-read; clipboard-write" class="olvy-frame" name="olvy-frame-${
this.widgetInstance.alias
}" src="https://${this.olvyInstance.getAlias()}.olvy.co/embed?widget=${encodeURIComponent(JSON.stringify(this.widgetInstance.widgetObject))}&workspaceAlias=${this.olvyInstance.getAlias()}"></iframe>
          </div>
        `;this.widgetInstance.setElement(modalElement);document.querySelector(this.widgetInstance?.config?.appendTo).appendChild(modalElement);this.insertCSS(this.widgetInstance);this.setupEventListeners();this.autoShowWidget();};this.autoShowWidget=()=>{let widgetLastOpened="";if(_isLocalStorageAvailable()===true){widgetLastOpened=window?.localStorage?.getItem(`olvy-${this.olvyInstance.workspaceAlias}-lastOpened`)||"";}
if(this.widgetInstance?.appearance?.autoShowWidget){let isNewReleasePresent=this.widgetInstance.getUnreadReleasesCount();if(isNewReleasePresent>0||(_isLocalStorageAvailable()===true&&!widgetLastOpened)){this.show();}}};this.setupEventListeners=()=>{document.addEventListener("click",(e)=>{if(this.widgetInstance?.config?.disableOverlay){if(!e.target.closest(`#olvy-sidebar-overlay-${this.widgetInstance.alias}`)?.length){this.widgetInstance.hide();}}else{if(e.target.id===`olvy-modal-overlay-${this.widgetInstance.alias}`||e.target.id===`olvy-frame-container-${this.widgetInstance.alias}`){e.preventDefault();e.stopPropagation();this.widgetInstance.hide();}}});document.addEventListener("keydown",(e)=>{if(e.keyCode==27){this.widgetInstance.hide();}});if(this.widgetInstance.config&&this.widgetInstance?.config?.targetElement){const targetElement=document.querySelector(this.widgetInstance?.config?.targetElement);if(targetElement){targetElement.addEventListener("click",this.handleTargetClick);}}
if(this.widgetInstance?.appearance?.showUnreadIndicator){this.widgetInstance.refreshUnreadCount();}else{this.widgetInstance.removeUnreadIndicatorElement();}};this.teardown=()=>{this.widgetInstance.removeUnreadIndicatorElement();this.removeCSS();if(document.querySelector(`#${`olvy-modal-${this.widgetInstance.alias}`}`)&&document.querySelector(this.widgetInstance?.config?.appendTo)){document.querySelector(this.widgetInstance?.config?.appendTo).removeChild(document.querySelector(`#${`olvy-modal-${this.widgetInstance.alias}`}`));}
window.removeEventListener("message",(e)=>{if(e.data===this.widgetInstance.eventKeys.close){this.widgetInstance.hide();}else if(e.data===this.widgetInstance.eventKeys.loaded){this.widgetInstance.contentLoaded=true;}},false);this.teardownEventListeners();this.widgetInstance.setElement(null);};this.teardownEventListeners=()=>{if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){const targetElement=document.querySelector(this.widgetInstance.config.targetElement);if(targetElement){targetElement.removeEventListener("click",this.handleTargetClick);}}};this.show=()=>{if(!this.widgetInstance.elementRef){this.setup(true);}
this.widgetInstance.elementRef.classList.add("visible");const bodyElement=document.querySelector(`body`);bodyElement.classList.add("olvy-modal-open");document.getElementsByName(`olvy-frame-${this.widgetInstance.alias}`)[0].classList.add("bounceInAnimation");this.widgetInstance.visible=true;__setLocalStorage(`olvy-${this.olvyInstance.workspaceAlias}-lastOpened`,new Date().toISOString());if(this.widgetInstance?.config?.targetElement&&document.querySelector(this.widgetInstance?.config?.targetElement)&&document.querySelector(this.widgetInstance?.config?.targetElement).querySelector(`.olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}`)){document.querySelector(this.widgetInstance?.config?.targetElement).removeChild(document.querySelector(this.widgetInstance?.config?.targetElement).querySelector(`.olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}`));}
this.olvyInstance.registerEvent("widget_open",this.widgetInstance.widgetObject.widgetId,this.olvyInstance.organisationId,null,null);};this.hide=()=>{if(this.widgetInstance.elementRef){this.widgetInstance.elementRef.classList.remove("visible");}
const bodyElement=document.querySelector(`body`);if(bodyElement){bodyElement.classList.remove("olvy-modal-open");}
this.widgetInstance.visible=false;};this.insertCSS=()=>{let CSSElement=document.querySelector(`style#olvy-css-${this.widgetInstance.alias}`);if(CSSElement){CSSElement.remove();}
const styleEl=document.createElement("style");styleEl.id=`olvy-css-${this.widgetInstance.alias}`;CSSElement=styleEl;CSSElement.innerHTML=`
        ${this.widgetInstance?.config?.targetElement} {
          position: relative;
        }
        .olvy-modal {
          display: none;
          transition: display 0.5s ease-in-out;
        }
        .olvy-modal-open {
          overflow: hidden !important;
        }
        .olvy-modal.visible {
          display: block;
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          z-index: 2000000;
        }
        .olvy-modal-overlay {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background-color: #000000bf;
          z-index: 2000000;
          opacity: 0;
          animation: opacityTransition 0.5s ease forwards;
        }
        .olvy-frame-modal .olvy-frame {
          max-height: 45rem;
          height: 100%;
          max-width: 700px;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          border: none;
          background-color: var(--widget-background);
        }
        .olvy-frame-container.olvy-frame-modal {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          z-index: 2000002;
          position: relative;
        }
        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias} {
          position: absolute;
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${this.widgetInstance?.appearance?.unreadIndicatorColor};
          box-shadow: 0 0 0 ${this.widgetInstance?.appearance?.unreadIndicatorColor};
          animation: olvyPulse-${this.widgetInstance.alias} 2s infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #fff;
        }
        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}.top-right {
          right: -10px;
          top: -10px;
        }
        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}.top-left {
          left: -10px;
          top: -10px;
        }
        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}.bottom-left {
          bottom: -10px;
          left: -10px;
        }
        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}.bottom-right {
          bottom: -10px;
          right: -10px;
        }
        @-webkit-keyframes olvyPulse-${this.widgetInstance.alias} {
          0% {
            -webkit-box-shadow: 0 0 0 0 ${this.widgetInstance?.appearance?.unreadIndicatorColor};
          }
          70% {
              -webkit-box-shadow: 0 0 0 10px #0000;
          }
          100% {
              -webkit-box-shadow: 0 0 0 0 #0000;
          }
        }
        @keyframes olvyPulse-${this.widgetInstance.alias} {
          0% {
            -moz-box-shadow: 0 0 0 0 ${this.widgetInstance?.appearance?.unreadIndicatorColor};
            box-shadow: 0 0 0 0 ${this.widgetInstance?.appearance?.unreadIndicatorColor};
          }
          70% {
              -moz-box-shadow: 0 0 0 10px #0000;
              box-shadow: 0 0 0 10px #0000;
          }
          100% {
              -moz-box-shadow: 0 0 0 0 #0000;
              box-shadow: 0 0 0 0 #0000;
          }
        }
       .bounceInAnimation {
        animation-name: bounce;
        animation-duration: 0.3s;
        transition-timing-function: ease;
       }
       @keyframes bounce {
        0% {
          opacity: 0;
          transform: scale(0.8) translate3d(0,0,0);
        }
        100% {
          opacity: 1;
          transform: scale(1) translate3d(0,0,0);
        }
       }
       @keyframes opacityTransition {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
       }
      `;document.querySelector("head").appendChild(CSSElement);};this.removeCSS=()=>{let CSSElement=document.querySelector(`style#olvy-css-${this.widgetInstance.alias}`);if(CSSElement){CSSElement.remove();}};}
function OlvyReleasesSidebarWidget(widgetInstance){this.widgetInstance=widgetInstance;this.olvyInstance=widgetInstance.olvyInstance;this.handleTargetClick=(e)=>{e.preventDefault();e.stopPropagation();this.widgetInstance.show();};this.init=()=>{};this.setup=(forceSetup)=>{let isWidgetToBeAutoShown=this.widgetInstance?.appearance?.autoShowWidget;let sidebarTargetElement=null;if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){sidebarTargetElement=document.querySelector(this.widgetInstance.config.targetElement);}
if(sidebarTargetElement||isWidgetToBeAutoShown||forceSetup){const sidebarElement=document.createElement("div");sidebarElement.id=`olvy-sidebar-${this.widgetInstance.alias}`;sidebarElement.classList.add("olvy-sidebar");sidebarElement.innerHTML=`
        <div data-test="sidebar-overlay" class="olvy-sidebar-overlay" id="${`olvy-sidebar-overlay-${this.widgetInstance.alias}`}"></div>
          <div data-test="sidebar-frame-container" class="olvy-frame-container olvy-frame-sidebar" id="${`olvy-frame-container-${this.widgetInstance.alias}`}">
          <iframe data-test="sidebar-iframe" allow="clipboard-read; clipboard-write" class="olvy-frame" name="olvy-frame-${
this.widgetInstance.alias
}" src="https://${this.olvyInstance.getAlias()}.olvy.co/embed?widget=${encodeURIComponent(JSON.stringify(this.widgetInstance.widgetObject))}&workspaceAlias=${this.olvyInstance.getAlias()}"></iframe> 
          </div>
        `;this.widgetInstance.setElement(sidebarElement);document.querySelector(this.widgetInstance?.config?.appendTo).appendChild(sidebarElement);this.insertCSS(this.widgetInstance);this.setupEventListeners();this.autoShowWidget();}};this.autoShowWidget=()=>{let widgetLastOpened="";if(_isLocalStorageAvailable()===true){widgetLastOpened=window?.localStorage?.getItem(`olvy-${this.olvyInstance.workspaceAlias}-lastOpened`)||"";}
if(this.widgetInstance?.appearance?.autoShowWidget){let isNewReleasePresent=this.widgetInstance.getUnreadReleasesCount();if(isNewReleasePresent>0||(_isLocalStorageAvailable()===true&&!widgetLastOpened)){this.show();}}};this.setupEventListeners=()=>{document.addEventListener("click",(e)=>{if(this.widgetInstance?.config?.disableOverlay){if(!e.target.closest(`#olvy-sidebar-overlay-${this.widgetInstance.alias}`)?.length){this.widgetInstance.hide();}}else{if(e.target.id===`olvy-sidebar-overlay-${this.widgetInstance.alias}`||e.target.id===`olvy-frame-container-${this.widgetInstance.alias}`){e.preventDefault();e.stopPropagation();this.widgetInstance.hide();}}});document.addEventListener("keydown",(e)=>{if(e.keyCode==27){this.widgetInstance.hide();}});if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){const targetElement=document.querySelector(this.widgetInstance.config.targetElement);if(targetElement){targetElement.addEventListener("click",this.handleTargetClick);}}
if(this.widgetInstance?.appearance?.showUnreadIndicator){this.widgetInstance.refreshUnreadCount();}else{this.widgetInstance.removeUnreadIndicatorElement();}};this.teardown=()=>{this.widgetInstance.removeUnreadIndicatorElement();this.removeCSS();if(document.querySelector(`#${`olvy-sidebar-${this.widgetInstance.alias}`}`)&&document.querySelector(this.widgetInstance?.config?.appendTo)){document.querySelector(this.widgetInstance?.config?.appendTo).removeChild(document.querySelector(`#${`olvy-sidebar-${this.widgetInstance.alias}`}`));}
window.removeEventListener("message",(e)=>{if(e.data===this.widgetInstance.eventKeys.close){this.widgetInstance.hide();}else if(e.data===this.widgetInstance.eventKeys.loaded){this.widgetInstance.contentLoaded=true;}},false);this.teardownEventListeners();this.widgetInstance.setElement(null);};this.teardownEventListeners=()=>{if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){const targetElement=document.querySelector(this.widgetInstance.config.targetElement);if(targetElement){targetElement.removeEventListener("click",this.handleTargetClick);}}};this.show=()=>{if(!this.widgetInstance.elementRef){this.setup(true);}
this.widgetInstance.elementRef.classList.add("visible");const bodyElement=document.querySelector(`body`);bodyElement.classList.add("olvy-sidebar-open");document.getElementsByName(`olvy-frame-${this.widgetInstance.alias}`)[0].classList.add("transitionAnimation");this.widgetInstance.visible=true;__setLocalStorage(`olvy-${this.olvyInstance.workspaceAlias}-lastOpened`,new Date().toISOString());if(this.widgetInstance?.config?.targetElement&&document.querySelector(this.widgetInstance?.config?.targetElement)&&document.querySelector(this.widgetInstance?.config?.targetElement).querySelector(`.olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}`)){document.querySelector(this.widgetInstance?.config?.targetElement).removeChild(document.querySelector(this.widgetInstance?.config?.targetElement).querySelector(`.olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}`));}
this.olvyInstance.registerEvent("widget_open",this.widgetInstance.widgetObject.widgetId,this.olvyInstance.organisationId,null,null);};this.hide=()=>{if(this.widgetInstance.elementRef){this.widgetInstance.elementRef.classList.remove("visible");}
const bodyElement=document.querySelector(`body`);if(bodyElement){bodyElement.classList.remove("olvy-sidebar-open");}
this.widgetInstance.visible=false;};this.insertCSS=()=>{let CSSElement=document.querySelector(`style#olvy-css-${this.widgetInstance.alias}`);if(CSSElement){CSSElement.remove();}
const styleEl=document.createElement("style");styleEl.id=`olvy-css-${this.widgetInstance.alias}`;CSSElement=styleEl;CSSElement.innerHTML=`
        ${this.widgetInstance?.config?.targetElement} {
          position: relative;
        }
        .olvy-sidebar {
          display: none;
          transition: display 0.5s ease-in-out;
        }
        .olvy-sidebar-open {
          overflow: hidden !important;
        }
        .olvy-sidebar.visible {
          display: block;
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          z-index: 2000000;
        }
        .olvy-sidebar-overlay {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background-color: #000000bf;
          z-index: 2000000;
          opacity: 0;
          animation: opacityTransition 0.5s ease forwards;
        }
        .olvy-frame-sidebar .olvy-frame {
          height: 100%;
          max-width: 450px;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          border: none;
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          background: var(--widget-background);
        }
        .olvy-frame-container.olvy-frame-sidebar {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          z-index: 2000002;
          position: relative;
        }
        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias} {
          position: absolute;
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${this.widgetInstance?.appearance?.unreadIndicatorColor};
          box-shadow: 0 0 0 ${this.widgetInstance?.appearance?.unreadIndicatorColor};
          animation: olvyPulse-${this.widgetInstance.alias} 2s infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #fff;
        }
        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}.top-right {
          right: -10px;
          top: -10px;
        }
        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}.top-left {
          left: -10px;
          top: -10px;
        }
        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}.bottom-left {
          bottom: -10px;
          left: -10px;
        }
        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}.bottom-right {
          bottom: -10px;
          right: -10px;
        }
        @-webkit-keyframes olvyPulse-${this.widgetInstance.alias} {
          0% {
            -webkit-box-shadow: 0 0 0 0 ${this.widgetInstance?.appearance?.unreadIndicatorColor};
          }
          70% {
              -webkit-box-shadow: 0 0 0 10px #0000;
          }
          100% {
              -webkit-box-shadow: 0 0 0 0 #0000;
          }
        }
        @keyframes olvyPulse-${this.widgetInstance.alias} {
          0% {
            -moz-box-shadow: 0 0 0 0 ${this.widgetInstance?.appearance?.unreadIndicatorColor};
            box-shadow: 0 0 0 0 ${this.widgetInstance?.appearance?.unreadIndicatorColor};
          }
          70% {
              -moz-box-shadow: 0 0 0 10px #0000;
              box-shadow: 0 0 0 10px #0000;
          }
          100% {
              -moz-box-shadow: 0 0 0 0 #0000;
              box-shadow: 0 0 0 0 #0000;
          }
        }
        .transitionAnimation{
          animation-name: slide;
          animation-duration: 0.2s;
          transition-timing-function: ease;
        }
        
        @-webkit-keyframes slide {
          0% {right: -450px;}
          100% { right: 0; }
        }
        
        @keyframes slide {
          0% {right: -450px;}
          100% { right: 0; }
        }
        @keyframes opacityTransition {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `;document.querySelector("head").appendChild(CSSElement);};this.removeCSS=()=>{let CSSElement=document.querySelector(`style#olvy-css-${this.widgetInstance.alias}`);if(CSSElement){CSSElement.remove();}};}
function OlvyReleasesEmbedWidget(widgetInstance){this.widgetInstance=widgetInstance;this.olvyInstance=widgetInstance.olvyInstance;this.init=()=>{};this.setup=()=>{let embedElement="";if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){embedElement=document.querySelector(this.widgetInstance.config?.targetElement);}
if(embedElement){embedElement.innerHTML=`<iframe data-test="embed-iframe" allow="clipboard-read; clipboard-write" class="olvy-frame" name="${`olvy-frame-${this.widgetInstance.alias}`}" src="https://${this.olvyInstance.getAlias()}.olvy.co/embed?widget=${encodeURIComponent(JSON.stringify(this.widgetInstance.widgetObject))}" style="height: 100%; width: 100%; border: none;"></iframe>`;this.widgetInstance.setElement(embedElement);this.olvyInstance.registerEvent("widget_open",this.widgetInstance.widgetObject.widgetId,this.olvyInstance.organisationId,null,null);}};this.teardown=()=>{const embedElement=document.querySelector(this.widgetInstance?.config?.targetElement);if(embedElement){embedElement.innerHTML=``;this.widgetInstance.setElement(null);}};this.show=()=>{};this.hide=()=>{};this.insertCSS=()=>{};}
function OlvyReleasesPopupWidget(widgetInstance){this.widgetInstance=widgetInstance;this.olvyInstance=widgetInstance.olvyInstance;this.handleTargetClick=(e)=>{e.preventDefault();e.stopPropagation();this.widgetInstance.show();};this.init=()=>{};this.setup=(forceSetup)=>{let isWidgetToBeAutoShown=this.widgetInstance?.appearance?.autoShowWidget;let popupTargetElement="";if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){popupTargetElement=document.querySelector(this.widgetInstance.config.targetElement);}
if(popupTargetElement||isWidgetToBeAutoShown||forceSetup){const popupElement=document.createElement("div");popupElement.id=`olvy-popup-${this.widgetInstance.alias}`;popupElement.classList.add("olvy-popup","olvy-popup-iframe-container","rounded-lg");popupElement.setAttribute("data-test","popup-frame");popupElement.setAttribute("id",`olvy-iframe-container-${this.widgetInstance.alias}`);popupElement.innerHTML=`
        <iframe data-test="popup-iframe" allow="clipboard-read; clipboard-write" class="popup-widget" name="olvy-frame-${
this.widgetInstance.alias
}" src="https://${this.olvyInstance.getAlias()}.olvy.co/embed?widget=${encodeURIComponent(JSON.stringify(this.widgetInstance.widgetObject))}&workspaceAlias=${this.olvyInstance.getAlias()}">
        </iframe>
        `;this.widgetInstance.setElement(popupElement);document.querySelector(this.widgetInstance?.config?.appendTo).appendChild(popupElement);this.insertCSS(this.widgetInstance);this.setupEventListeners();this.autoShowWidget();}};this.autoShowWidget=()=>{let widgetLastOpened="";if(_isLocalStorageAvailable()===true){widgetLastOpened=window?.localStorage?.getItem(`olvy-${this.olvyInstance.workspaceAlias}-lastOpened`)||"";}
if(this.widgetInstance?.appearance?.autoShowWidget&&_checkTargetExists(this.widgetInstance?.config?.targetElement)&&this.widgetInstance?.config?.targetElement){let isNewReleasePresent=this.widgetInstance.getUnreadReleasesCount();if(isNewReleasePresent>0||(_isLocalStorageAvailable()===true&&!widgetLastOpened)){this.show();}}};this.setupEventListeners=()=>{document.addEventListener("click",(e)=>{if(!e.target.closest(`#olvy-iframe-container-${this.widgetInstance.alias}`)?.length){this.widgetInstance.hide();}});document.addEventListener("keydown",(e)=>{if(e.keyCode==27){this.widgetInstance.hide();}});window.addEventListener("scroll",(e)=>{isScrolling=true;});let widgetInstanceForPopup=this.widgetInstance;if(_checkTargetExists(this.widgetInstance?.config?.targetElement)){setInterval(function(){if(isScrolling){isScrolling=false;getPopupPositionOnScroll(widgetInstanceForPopup);}},500);}
if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){const targetElement=document.querySelector(this.widgetInstance.config.targetElement);if(targetElement){targetElement.addEventListener("click",this.handleTargetClick);}}
if(this.widgetInstance?.appearance?.showUnreadIndicator){this.widgetInstance.refreshUnreadCount();}else{this.widgetInstance.removeUnreadIndicatorElement();}};this.teardown=()=>{this.widgetInstance.removeUnreadIndicatorElement();this.removeCSS();if(document.querySelector(`#${`olvy-iframe-container-${this.widgetInstance.alias}`}`)&&document.querySelector(this.widgetInstance?.config?.appendTo)){document.querySelector(this.widgetInstance?.config?.appendTo).removeChild(document.querySelector(`#${`olvy-iframe-container-${this.widgetInstance.alias}`}`));}
window.removeEventListener("message",(e)=>{if(e.data===this.widgetInstance.eventKeys.close){this.widgetInstance.hide();}else if(e.data===this.widgetInstance.eventKeys.loaded){this.widgetInstance.contentLoaded=true;}},false);window.removeEventListener("scroll",(e)=>{isScrolling=false;});this.teardownEventListeners();this.widgetInstance.setElement(null);};this.teardownEventListeners=()=>{if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){const targetElement=document.querySelector(this.widgetInstance.config.targetElement);if(targetElement){targetElement.removeEventListener("click",this.handleTargetClick);}}};this.show=()=>{this.widgetInstance.elementRef.classList.add("visible");this.widgetInstance.visible=true;__setLocalStorage(`olvy-${this.olvyInstance.workspaceAlias}-lastOpened`,new Date().toISOString());if(this.widgetInstance?.config?.targetElement&&document.querySelector(this.widgetInstance?.config?.targetElement)&&document.querySelector(this.widgetInstance?.config?.targetElement).querySelector(`.olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}`)){document.querySelector(this.widgetInstance?.config?.targetElement).removeChild(document.querySelector(this.widgetInstance?.config?.targetElement).querySelector(`.olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias}`));}
let docBody=document.querySelector("body");if(window.innerWidth<440){if(docBody){docBody.classList.add("widget-show-close-button");}}else{if(docBody){docBody.classList.add("widget-hide-close-button");}}
this.olvyInstance.registerEvent("widget_open",this.widgetInstance.widgetObject.widgetId,this.olvyInstance.organisationId,null,null);if(!this.widgetInstance.elementRef){this.setup(true);}};this.hide=()=>{if(this.widgetInstance.elementRef){this.widgetInstance.elementRef.classList.remove("visible");}
this.widgetInstance.visible=false;};this.insertCSS=()=>{let CSSElement=document.querySelector(`style#olvy-css-${this.widgetInstance.alias}`);if(CSSElement){CSSElement.remove();}
const styleEl=document.createElement("style");styleEl.id=`olvy-css-${this.widgetInstance.alias}`;CSSElement=styleEl;const popupPosition=getPopupPosition(this.widgetInstance);let popupFinalPosition="";if(popupPosition){const{popupFinalPosition:finalPosition}=popupPosition;popupFinalPosition=finalPosition;}
CSSElement.innerHTML=`
        ${this.widgetInstance?.config?.targetElement} {
          position: relative;
        }
        .olvy-popup {
          display: none;
          transition: display 0.5s ease-in-out;
        }
        .olvy-popup {
          --widget-topbar-background:
          ${
this.widgetInstance?.appearance?.theme?.headerBackgroundColor||"#ffffff"
}; --widget-background:
          ${
this.widgetInstance?.appearance?.theme?.backgroundColor||"#ffffff"
}; --widget-card-background:
          ${
this.widgetInstance?.appearance?.theme?.cardBackgroundColor||"#ffffff"
}; --widget-text-primary-color:
          ${this.widgetInstance?.appearance?.theme?.textColor||"#303855"};
          --widget-text-secondary-color:
          ${
this.widgetInstance?.appearance?.theme?.secondaryTextColor||"#4a5568"
}; --widget-brand-color:
          ${this.widgetInstance?.appearance?.theme?.brandColor||"#db2777"};
          --widget-link-color:
          ${this.widgetInstance?.appearance?.theme?.linkColor||"#2b43d8"};
          --widget-link-hover-color:
          ${
this.widgetInstance?.appearance?.theme?.linkHoverColor||"#2b43d8"
};
          --widget-border-color:
          ${this.widgetInstance?.appearance?.theme?.borderColor||"#e4e8ea"};
          --widget-input-background-color:
          ${
this.widgetInstance?.appearance?.theme?.inputBackgroundColor||"#ffffff"
}; --widget-input-text-color:
          ${
this.widgetInstance?.appearance?.theme?.inputTextColor||"#303956"
};
          --widget-input-placeholder-color:
          ${
this.widgetInstance?.appearance?.theme?.inputPlaceholderColor||"#cfd8dc"
};
        }
        .olvy-popup-open {
          overflow: hidden !important;
        }
        .olvy-popup.visible {
          display: block;
          width: 360px;
          max-width: 480px;
          position: absolute;
          ${popupFinalPosition}
          height: 60%;
          max-height: 510px;
          z-index: 2000000;
          filter: drop-shadow(0px 2px 20px rgba(220,220,220,1));
          background: var(--widget-background);
          border-radius: 8px;
        }
        .popup-widget {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          border: none;
        }
        #widget-close-button, .popup-close-icon{
          display:none;
        }

        @media(min-width: 768px){
          .olvy-frame-popup .olvy-frame{
            height: 60%;
            position: fixed;
            ${popupFinalPosition}
            padding-bottom: 1rem;
            filter: drop-shadow(0px 2px 20px rgba(220,220,220,1));
            background: var(--widget-background);
          }

          .olvy-popup, .popup-widget{
            max-width: 480px;
          }
          #widget-close-button,
          #embed-widget-close-button{
            display:none;
          }
        }
        @media(max-width: 767px){
          .olvy-popup.visible {
            height: 100% !important;
            width: 100% !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0;
            left: 0;
            max-height: 100%;
            position: fixed !important;
            margin-top: 0;
            max-width: 100% !important;
            filter: drop-shadow(0px 2px 20px rgba(220,220,220,1));
            background: var(--widget-background);
            z-index: 2000000;
            border-radius: 8px;
          }

          #widget-close-button,
          #embed-widget-close-button{
            display:block;
          }
          #widget-close-button, .popup-close-icon{
            display:block;
          }
        }

        .popup-widget .popup-release-card{
          width: 100%;
          max-width: calc(480px - 2rem);
        }

        .olvy-unread-indicator.olvy-widget-${this.widgetInstance.alias} {
          position: absolute;
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${this.widgetInstance?.appearance?.unreadIndicatorColor};
          box-shadow: 0 0 0 ${
this.widgetInstance?.appearance?.unreadIndicatorColor
};
          animation: olvyPulse-${this.widgetInstance.alias} 2s infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #fff;
        }
        .olvy-unread-indicator.olvy-widget-${
this.widgetInstance.alias
}.top-right {
          right: -10px;
          top: -10px;
        }
        .olvy-unread-indicator.olvy-widget-${
this.widgetInstance.alias
}.top-left {
          left: -10px;
          top: -10px;
        }
        .olvy-unread-indicator.olvy-widget-${
this.widgetInstance.alias
}.bottom-left {
          bottom: -10px;
          left: -10px;
        }
        .olvy-unread-indicator.olvy-widget-${
this.widgetInstance.alias
}.bottom-right {
          bottom: -10px;
          right: -10px;
        }
        @-webkit-keyframes olvyPulse-${this.widgetInstance.alias} {
          0% {
            -webkit-box-shadow: 0 0 0 0 ${
this.widgetInstance?.appearance?.unreadIndicatorColor
};
          }
          70% {
              -webkit-box-shadow: 0 0 0 10px #0000;
          }
          100% {
              -webkit-box-shadow: 0 0 0 0 #0000;
          }
        }
        @keyframes olvyPulse-${this.widgetInstance.alias} {
          0% {
            -moz-box-shadow: 0 0 0 0 ${
this.widgetInstance?.appearance?.unreadIndicatorColor
};
            box-shadow: 0 0 0 0 ${
this.widgetInstance?.appearance?.unreadIndicatorColor
};
          }
          70% {
              -moz-box-shadow: 0 0 0 10px #0000;
              box-shadow: 0 0 0 10px #0000;
          }
          100% {
              -moz-box-shadow: 0 0 0 0 #0000;
              box-shadow: 0 0 0 0 #0000;
          }
        }
        .bouncePopup{
          animation-name: bounce;
          animation-duration: 0.2s;
          transition-timing-function: ease;
        }
        .popup-widget-fade-out-bottom {
          -webkit-mask-image: linear-gradient(180deg, #000 95%, transparent);
          mask-image: linear-gradient(90deg, #000 95%, transparent);
          -webkit-mask-size: 20px;
        }

        @-webkit-@keyframes bounce {
          0% {
            opacity: 0;
            transform: scale(0.8) translate3d(0,0,0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate3d(0,0,0);
          }
        }

        @keyframes bounce {
          0% {
            opacity: 0;
            transform: scale(0.8) translate3d(0,0,0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate3d(0,0,0);
          }
        }
      `;document.querySelector("head").appendChild(CSSElement);};this.removeCSS=()=>{let CSSElement=document.querySelector(`style#olvy-css-${this.widgetInstance.alias}`);if(CSSElement){CSSElement.remove();}};}
function OlvyFeedbackSimpleWidget(widgetInstance){this.widgetInstance=widgetInstance;this.olvyInstance=widgetInstance.olvyInstance;this.notificationPollingInterval=null;this.notificationInfo={};this.prevNotificationInfo={};this.feedbackWidgetShown=false;this.notificationShown=false;this.notificationPollingTimeout=60000;this.isDarkMode=false;const isWidgetWithoutOverlay=!this.widgetInstance.appearance.showOverlay;this.handleTargetClick=(e)=>{e.preventDefault();e.stopPropagation();this.widgetInstance.show();};this.init=()=>{};this.setup=(forceSetup)=>{let feedbackTargetElement="";if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){feedbackTargetElement=document.querySelector(this.widgetInstance.config.targetElement);}
const isTabLauncher=this.widgetInstance?.config?.widgetLauncherType?.id==="tab";if(feedbackTargetElement||forceSetup||isTabLauncher){const widgetElement=document.createElement("div");widgetElement.id=`olvy-simple-feedback-${this.widgetInstance.alias}`;widgetElement.classList.add("olvy-simple-feedback");widgetElement.classList.add(this.widgetInstance?.appearance?.widgetPosition);if(isWidgetWithoutOverlay){widgetElement.innerHTML=`
          <div class="olvy-frame-container olvy-frame-simple-feedback no-overlay" id="${`olvy-frame-container-${this.widgetInstance.alias}`}">
            <iframe class="olvy-frame no-overlay" name="olvy-frame-${
this.widgetInstance.alias
}" src="https://${this.olvyInstance.getAlias()}.olvy.co/embed/feedback?alias=${this.olvyInstance.getAlias()}&widget=${encodeURIComponent(JSON.stringify(this.widgetInstance.widgetObject))}&logo=${this.widgetInstance.organisationLogo}&isDemoWidget=${
this.widgetInstance?.isDemoWidget
}&workspaceAlias=${this.olvyInstance.getAlias()}"></iframe>
          </div>
        `;}else{widgetElement.innerHTML=`
          <div class="olvy-simple-feedback-overlay" id="${`olvy-simple-feedback-overlay-${this.widgetInstance.alias}`}"></div>
          <div class="olvy-frame-container olvy-frame-simple-feedback" id="${`olvy-frame-container-${this.widgetInstance.alias}`}">
            <iframe class="olvy-frame" name="olvy-frame-${
this.widgetInstance.alias
}" src="https://${this.olvyInstance.getAlias()}.olvy.co/embed/feedback?alias=${this.olvyInstance.getAlias()}&widget=${encodeURIComponent(JSON.stringify(this.widgetInstance.widgetObject))}&logo=${this.widgetInstance.organisationLogo}&isDemoWidget=${
this.widgetInstance?.isDemoWidget
}&workspaceAlias=${this.olvyInstance.getAlias()}"></iframe>
          </div>
        `;}
this.widgetInstance.setElement(widgetElement);document.querySelector(this.widgetInstance?.config?.appendTo).appendChild(widgetElement);this.insertCSS(this.widgetInstance);if(!isTabLauncher)this.setupEventListeners();else{if(!this.widgetInstance?.isDemoWidget)this.setupTabLauncher();}
this.setupReplies();this.autoShowWidget();}};this.autoShowWidget=()=>{if(this.widgetInstance.config&&this.widgetInstance.config.autoShowWidget&&_isLocalStorageAvailable()===true){if(this.widgetInstance.config.autoShowSnoozeEnabled){let snoozeTS=__getLocalStorage(`olvy-feedback-${this.olvyInstance.getAlias()}-snooze`);if(snoozeTS){const currentTS=new Date().getTime();snoozeTS=new Date(snoozeTS).getTime();if(currentTS>=snoozeTS)this.show();}else this.show();}else this.show();}};this.setupReplies=()=>{if(this.widgetInstance.config&&this.widgetInstance.config.repliesEnabled&&!isNotificationPopupSetup){this.setupNotificationPolling();}};this.setupEventListeners=()=>{document.addEventListener("click",(e)=>{if(e.target.id===`olvy-simple-feedback-overlay-${this.widgetInstance.alias}`||e.target.id===`olvy-frame-container-${this.widgetInstance.alias}`){e.preventDefault();e.stopPropagation();if(this.widgetInstance?.appearance?.showOverlay){this.widgetInstance.hide();}}});document.addEventListener("keydown",(e)=>{if(e.keyCode==27){this.widgetInstance.hide();}});if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){const targetElement=document.querySelector(this.widgetInstance.config.targetElement);if(targetElement){targetElement.addEventListener("click",this.handleTargetClick);}}};this.setupTabLauncher=()=>{const tabLauncher=document.createElement("div");if(this.widgetInstance?.config?.themeStyle?.id==="auto"&&!this.widgetInstance?.isDemoWidget){_listenForAutoTheme(this.updateThemeForTabLauncher);}
tabLauncher.classList.add(`${
this.widgetInstance?.config?.tabLauncher?.position==="left"?"olvy-tab-launcher-left":"olvy-tab-launcher-right"
}`);tabLauncher.classList.add("olvy-show-tab-launcher");tabLauncher.id=`olvy-tab-launcher-container-${this.widgetInstance?.alias}`;tabLauncher.innerHTML=`
      <div id="olvy-tab-launcher-${
this.widgetInstance?.alias
}" data-test="tab-launcher" class="olvy-tab-launcher-content-${
this.widgetInstance?.alias
} ${
this.widgetInstance?.config?.tabLauncher?.position==="right"?"olvy-tab-launcher-content-right tab-launcher-slide-in-right":"olvy-tab-launcher-content-left tab-launcher-slide-in-left"
}">${
this.widgetInstance?.config?.tabLauncher?.text||"Give Feedback"
}</div>
    `;document.body.append(tabLauncher);document.addEventListener("click",(e)=>{if(e.target.id===`olvy-simple-feedback-overlay-${this.widgetInstance.alias}`||e.target.id===`olvy-frame-container-${this.widgetInstance.alias}`){e.preventDefault();e.stopPropagation();if(this.widgetInstance?.appearance?.showOverlay){this.showTabLauncher();this.hide();}}});tabLauncher.addEventListener("click",this.handleTabLauncherClickEvent);};this.handleTabLauncherClickEvent=(e)=>{if(e.target.id===`olvy-tab-launcher-${this.widgetInstance?.alias}`){this.handleTargetClick(e);this.hideTabLauncher();}};this.updateThemeForTabLauncher=(type)=>{const tabElement=document.getElementById(`olvy-tab-launcher-${this.widgetInstance?.alias}`);if(tabElement){if(type==="light"){if(tabElement)
tabElement.style.background=this.widgetInstance?.appearance?.theme?.brandColor;}else{tabElement.style.background=this.widgetInstance?.appearance?.darkTheme?.brandColor;}}else{if(type==="dark"){this.isDarkMode=true;}}};this.updateTabLauncher=(updatedData)=>{if(document.getElementById(`olvy-tab-launcher-${this.widgetInstance?.alias}`)){document.getElementById(`olvy-tab-launcher-${this.widgetInstance?.alias}`).style.cssText=`background-color: ${
updatedData?.config?.themeStyle?.id==="auto"&&updatedData?.config?.themeToShow==="auto-dark"?updatedData?.appearance?.darkTheme?.brandColor:updatedData?.appearance?.theme?.brandColor
}`;document.getElementById(`olvy-tab-launcher-${this.widgetInstance?.alias}`).innerHTML=updatedData.config.tabLauncher.text.length>0?updatedData.config.tabLauncher.text:"Give Feedback";}};this.showTabLauncher=()=>{if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab"){if(document.getElementById(`olvy-tab-launcher-container-${this.widgetInstance?.alias}`)){document.getElementById(`olvy-tab-launcher-container-${this.widgetInstance?.alias}`).classList.remove("olvy-hide-tab-launcher");document.getElementById(`olvy-tab-launcher-container-${this.widgetInstance?.alias}`).classList.add("olvy-show-tab-launcher");}}};this.hideTabLauncher=()=>{if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab"){if(document.getElementById(`olvy-tab-launcher-container-${this.widgetInstance?.alias}`)){document.getElementById(`olvy-tab-launcher-container-${this.widgetInstance?.alias}`).classList.add("olvy-hide-tab-launcher");}}};this.setupNotificationPolling=async()=>{const alias=this.olvyInstance.getAlias();const userInLocalStorage=__getLocalStorage(`olvy-user-${alias}`);let userObject={};if(userInLocalStorage){userObject=JSON.parse(userInLocalStorage);}
if(this.olvyInstance?.organisationId&&userObject?.email){if(this.widgetInstance.config&&this.widgetInstance.config.replyNotifications){this.setupNotificationPopup();isNotificationPopupSetup=true;}
await this.processNotificationCount(userObject);this.notificationPollingInterval=setInterval(async()=>{await this.processNotificationCount(userObject);},this.notificationPollingTimeout);}};this.refreshRepliesCount=async()=>{const userInLocalStorage=__getLocalStorage(`olvy-user-${this.olvyInstance.getAlias()}`);let userObject={};if(userInLocalStorage){userObject=JSON.parse(userInLocalStorage);}
if(this.olvyInstance?.organisationId&&userObject?.email){await this.processNotificationCount(userObject);}};this.processNotificationCount=async(userObject)=>{await this.fetchNotificationCount(userObject?.email);if(this.feedbackWidgetShown===false&&this.notificationInfo?.newReplyCount>0&&this.notificationInfo?.newReplyCount!==this.prevNotificationInfo?.newReplyCount&&this.notificationInfo?.latestReplyText!==this.prevNotificationInfo?.latestReplyText){this.prevNotificationInfo=this.notificationInfo;if(this.widgetInstance.config&&this.widgetInstance.config.replyNotifications){this.showNotificationPopup();window.frames[`olvy-feeback-notify-popup-${this.widgetInstance.alias}`].postMessage({key:`olvy-setNotificationInfo`,value:this.notificationInfo,},"*");}}
window.frames[`olvy-frame-${this.widgetInstance.alias}`].postMessage({key:`olvy-setNotificationInfo`,value:this.notificationInfo,},"*");};this.setupNotificationPopup=(isBuilder=false)=>{const element=document.createElement("div");element.id=`olvy-feeback-notify-popup-${this.widgetInstance.alias}`;element.innerHTML=`
        <div data-test="feeback-notify-popup" class="olvy-frame-notify-popup" id="${`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`}">
      <iframe data-test="feeback-notify-popup-iframe" class="olvy-frame" name="olvy-feeback-notify-popup-${
this.widgetInstance.alias
}" src="https://${this.olvyInstance.getAlias()}.olvy.co/embed/notification?alias=${this.olvyInstance.getAlias()}&widget=${encodeURIComponent(JSON.stringify(this.widgetInstance.widgetObject))}&workspaceAlias=${this.olvyInstance.getAlias()}&logo=${
this.widgetInstance.organisationLogo
}&builder=${isBuilder}"></iframe>
        </div>
      `;document.querySelector(this.widgetInstance?.config?.appendTo).appendChild(element);window.addEventListener("message",(e)=>{if(e.data===`olvy-open-feedback-widget-${this.widgetInstance.alias}`){if(this.notificationShown)this.hideNotificationPopup();this.show();this.hideTabLauncher();window.frames[`olvy-frame-${this.widgetInstance.alias}`].postMessage({key:`olvy-widget-auto-open-replies`,},"*");}else if(e.data===`olvy-close-notification-popup-${this.widgetInstance.alias}`){if(this.notificationShown)this.hideNotificationPopup();}else if(e.data===`olvy-loaded-${this.widgetInstance.alias}`){window.frames[`olvy-feeback-notify-popup-${this.widgetInstance.alias}`].postMessage({key:`olvy-setNotificationInfo`,value:this.notificationInfo,},"*");}});};this.setupNotificationPopupForBuilder=(hideWidget=true)=>{this.setupNotificationPopup(true);this.showNotificationPopup();if(hideWidget)this.hide();};this.captureScreenshot=()=>{if(!this.widgetInstance?.isDemoWidget){this.hide();_allowScreenshot(this.widgetInstance);if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab")
this.hideTabLauncher();}};this.captureScreenRecord=()=>{if(!this.widgetInstance?.isDemoWidget){this.hide();_screenRecord(this.widgetInstance);if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab")
this.hideTabLauncher();}};this.fetchNotificationCount=async(userEmail)=>{var myHeaders=new Headers();myHeaders.append("Content-Type","application/json");var requestOptions={method:"GET",headers:myHeaders,};var lastReplyOpenedTime=__getLocalStorage(`olvy-reply-lastOpened-${this.olvyInstance.getAlias()}`)?localStorage.getItem(`olvy-reply-lastOpened-${this.olvyInstance.getAlias()}`).replaceAll('"',""):"null";var params=new URLSearchParams({org_id:this.olvyInstance.organisationId,contact_email:userEmail,compare_time:lastReplyOpenedTime,});await fetch(`${this.olvyInstance.API_URL}/widget_reply_count?`+params,requestOptions).then((response)=>{return response.json();}).then((result)=>{if(result?.status==="success"){this.notificationInfo=result;}else{console.warn("[Olvy] - There are no new feedback replies for this user");}}).catch((error)=>console.warn("[Olvy] - Error fetching feedback reply ",error));};this.showNotificationPopup=()=>{document.getElementById(`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`).classList.add("olvy-notify-popup-visible");const bodyElement=document.querySelector(`body`);bodyElement.classList.add("olvy-simple-feedback-open");document.getElementById(`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`).classList.add(this.widgetInstance?.appearance?.widgetPosition+"-animation");this.notificationShown=true;};this.hideNotificationPopup=()=>{if(document.getElementById(`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`)){document.getElementById(`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`).classList.remove("olvy-notify-popup-visible");}
const bodyElement=document.querySelector(`body`);if(bodyElement){bodyElement.classList.remove("olvy-simple-feedback-open");}
this.notificationShown=false;};this.teardown=()=>{this.removeCSS();if(document.querySelector(`#${`olvy-simple-feedback-${this.widgetInstance.alias}`}`)&&document.querySelector(this.widgetInstance?.config?.appendTo)){document.querySelector(this.widgetInstance?.config?.appendTo).removeChild(document.querySelector(`#${`olvy-simple-feedback-${this.widgetInstance.alias}`}`));}
if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){const targetElement=document.querySelector(this.widgetInstance.config.targetElement);if(targetElement){targetElement.removeEventListener("click",this.handleTargetClick);}}
if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab"){if(document.querySelector(`#${`olvy-tab-launcher-container-${this.widgetInstance?.alias}`}`)){document.querySelector(`#${`olvy-tab-launcher-container-${this.widgetInstance?.alias}`}`).removeEventListener("click",this.handleTabLauncherClickEvent);document.querySelector("body").removeChild(document.querySelector(`#${`olvy-tab-launcher-container-${this.widgetInstance?.alias}`}`));}}
this.isDarkMode=false;window.removeEventListener("message",(e)=>{if(e.data===this.widgetInstance.eventKeys.close){this.widgetInstance.hide();}else if(e.data===this.widgetInstance.eventKeys.loaded){this.widgetInstance.contentLoaded=true;}},false);this.widgetInstance.setElement(null);if(this.notificationPollingInterval!=null)
clearInterval(this.notificationPollingInterval);};this.show=()=>{if(!this.widgetInstance.elementRef){this.setup(true);}
this.widgetInstance.elementRef.classList.add("visible");const bodyElement=document.querySelector(`body`);if(bodyElement&&!isWidgetWithoutOverlay){bodyElement.classList.add("olvy-simple-feedback-open");}
if(isWidgetWithoutOverlay){window.frames[`olvy-frame-${this.widgetInstance.alias}`].postMessage({key:`olvy-widget-get-height`,},"*");}
document.getElementById(`olvy-frame-container-${this.widgetInstance.alias}`).classList.add(this.widgetInstance?.appearance?.widgetPosition+"-animation");window.frames[`olvy-frame-${this.widgetInstance.alias}`].postMessage({key:`olvy-widget-adjust-height`,},"*");this.widgetInstance.visible=true;this.feedbackWidgetShown=true;if(this.notificationShown)this.hideNotificationPopup();if(this.widgetInstance?.isDemoWidget&&this.widgetInstance?.cbForSectionUpdateFW){this.widgetInstance.cbForSectionUpdateFW("feedback-tab");}
this.olvyInstance.registerEvent("widget_open",this.widgetInstance.widgetObject.widgetId,this.olvyInstance.organisationId,null,null);};this.hide=()=>{if(this.widgetInstance.elementRef){this.widgetInstance.elementRef.classList.remove("visible");}
const bodyElement=document.querySelector(`body`);if(bodyElement){bodyElement.classList.remove("olvy-simple-feedback-open");}
this.widgetInstance.visible=false;this.feedbackWidgetShown=false;if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab"){this.showTabLauncher();if(this.widgetInstance?.isDemoWidget&&this.widgetInstance?.cbForSectionUpdateFW){this.widgetInstance.cbForSectionUpdateFW("selector-tab");}}};this.setSnoozeTimestamp=()=>{if(this.widgetInstance.config&&this.widgetInstance.config?.autoShowSnoozeEnabled&&this.widgetInstance.config?.snoozeValues){const days=this.widgetInstance?.config?.snoozeValues?.days||0;const hrs=this.widgetInstance?.config?.snoozeValues?.hours||0;const currentTime=new Date();let finalTime=new Date(currentTime);finalTime.setDate(currentTime.getDate()+parseInt(days));finalTime.setHours(currentTime.getHours()+parseInt(hrs));__setLocalStorage(`olvy-feedback-${this.olvyInstance.getAlias()}-snooze`,finalTime.toISOString());}};this.insertCSS=()=>{window.addEventListener("message",(e)=>{if(e.data.key===`olvy-widget-set-height-${this.widgetInstance.alias}`){document.getElementById(`${`olvy-frame-container-${this.widgetInstance.alias}`}`).style.height=`${e.data.value===0?"370":e.data.value}px`;document.getElementById(`${`olvy-frame-container-${this.widgetInstance.alias}`}`).style.position="fixed";}});let CSSElement=document.querySelector(`style#olvy-css-${this.widgetInstance.alias}`);if(CSSElement){CSSElement.remove();}
const styleEl=document.createElement("style");styleEl.id=`olvy-css-${this.widgetInstance.alias}`;CSSElement=styleEl;CSSElement.innerHTML=`
        ${this.widgetInstance?.config?.targetElement} {
          position: relative;
        }

        .olvy-hide-tab-launcher {
          display: none !important;
        }

        .olvy-show-tab-launcher {
          display: block;
        }

        .olvy-tab-launcher-left{
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          left: ${this.widgetInstance?.isDemoWidget?"41.5%":"0"};
          z-index: 1999999;
        }

        .olvy-tab-launcher-right{
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          right: 0;
          z-index: 1999999;
        }


        .olvy-tab-launcher-content-right{
          transform: rotate(180deg);
          -webkit-transform: rotate(180deg);
          -moz-transform: rotate(180deg);
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .olvy-tab-launcher-content-left{
          border-radius: 0  0.5rem 0.5rem 0;
        }

        .olvy-simple-feedback {
          display: none;
          transition: display 0.5s ease-in-out;
        }

        .olvy-simple-feedback-open {
          overflow: hidden !important;
        }

        .olvy-simple-feedback-overlay {
          width: 100%;
          height: 100%;
          background-color: ${
this.widgetInstance.appearance&&this.widgetInstance?.appearance?.showOverlay?"#000000bf":"transparent"
};
          z-index: 2000000;
        }

        .olvy-simple-feedback.visible {
          display: block;
          ${
!isWidgetWithoutOverlay?"position: fixed; top: 0; right: 0; left: 0; bottom: 0; z-index: 2000000;":"position: initial;"
}
        }

        .olvy-simple-feedback.visible.top-right .olvy-frame-container {
          right: 1rem;
          top: 1rem;
        }

        .olvy-simple-feedback.visible.top-left .olvy-frame-container {
          left: 1rem;
          top: 1rem;
        }

        .olvy-simple-feedback.visible.bottom-left .olvy-frame-container {
          left: 1rem;
          bottom: 1rem;
        }
        .olvy-simple-feedback.visible.bottom-right .olvy-frame-container {
          right: 1rem;
          bottom: 1rem;
        }
        .olvy-simple-feedback.visible.center .olvy-frame-container {
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
        }
        .olvy-simple-feedback.center .olvy-frame-container {
          max-height:640px;
          margin: 0px auto;
          max-width: 360px;
        }

        .olvy-frame-simple-feedback .olvy-frame {
          height: 100%;
          width: 100%;
         
          max-width: 360px;
          border-radius: 8px;
          overflow: hidden;
          border: none;
          // box-shadow: 0px 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .olvy-frame-notify-popup .olvy-frame {
          height: 100%;
          width: 100%;
          max-height: 130px;
          max-width: 400px;
          border-radius: 8px;
          overflow: hidden;
          border: none;
        }

        .olvy-frame-notify-popup {
          display: none;
          align-items: center;
          justify-content: center;
          position: absolute;
          height: 100%;
          width: 100%;
          z-index: 2000002;
          max-height: 130px;
          max-width: 400px;
          border-radius: 8px;     
        }

        .olvy-notify-popup-visible {
          display: block !important;
          position: fixed;
          right: 1rem;
          bottom: 1rem;
          z-index: 2000000;
          height: 130px;
          width: 400px;
          border: 1px solid #CBD5E1;
          box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1);
        }

        .olvy-frame-container.olvy-frame-simple-feedback {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          max-height: 640px;
          width: 100%;
          z-index: 2000002;
          
          max-width: 360px;
          border-radius: 8px;
        }

        .bottom-right-animation {
          animation-name: rightSlide;
          animation-duration: 0.2s;
          transition-timing-function: ease;
        }

        .bottom-left-animation {
          animation-name: leftSlide;
          animation-duration: 0.2s;
          transition-timing-function: ease;
        }

        .top-left-animation {
          animation-name: leftSlide;
          animation-duration: 0.2s;
          transition-timing-function: ease;
        }

        .top-right-animation {
          animation-name: rightSlide;
          animation-duration: 0.2s;
          transition-timing-function: ease;
        }

        .center-animation {
          animation-name: bounce;
          animation-duration: 0.3s;
          transition-timing-function: ease;
        }
         
        
        @-webkit-keyframes tab-launcher-slide-in-left {
          from {
            -webkit-transform: translate3d(-100%, 0, 0);
            transform: translate3d(-100%, 0, 0);
            visibility: visible;
          }
        
          to {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes tab-launcher-slide-in-left {
          from {
            -webkit-transform: translate3d(-100%, 0, 0);
            transform: translate3d(-100%, 0, 0);
            visibility: visible;
          }
        
          to {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
        }

        .tab-launcher-slide-in-left {
          -webkit-animation: tab-launcher-slide-in-left 100ms ease-in-out;
          animation: tab-launcher-slide-in-left 100ms ease-in-out;
        }


        @-webkit-keyframes tab-launcher-slide-in-right {
          from {
            -webkit-transform: translate3d(100%, 0, 0) rotate(180deg);
            transform: translate3d(100%, 0, 0) rotate(180deg);        
            visibility: visible;
          }
        
          to {
            -webkit-transform: translate3d(0, 0, 0)  rotate(180deg);
            transform: translate3d(0, 0, 0)  rotate(180deg);
          }
        }
        @keyframes tab-launcher-slide-in-right {
          from {
            -webkit-transform: translate3d(100%, 0, 0) rotate(180deg);
            transform: translate3d(100%, 0, 0)  rotate(180deg);
            visibility: visible;
          }
        
          to {
            -webkit-transform: translate3d(0, 0, 0)  rotate(180deg);
            transform: translate3d(0, 0, 0)  rotate(180deg);
          }
        }
        
        .tab-launcher-slide-in-right {
          -webkit-animation: tab-launcher-slide-in-right 100ms ease-in-out;
          animation: tab-launcher-slide-in-right 100ms ease-in-out;
        }


        @keyframes rightSlide {
            0% {
              right: -450px;
            }
            100% {
              right: 1rem;
            }
        }

        @keyframes leftSlide {
          0% {
            left: -450px;
          }
          100% { 
            left: 1rem; 
          }
        }
  
        @keyframes bounce {
          0% {
            opacity: 0;
            transform: scale(0.8) translate3d(0,0,0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate3d(0,0,0);
          }
        }

        @media only screen and (max-width: 600px) {
          .olvy-frame-notify-popup{
            display: none !important;
          }
        }
        
        @media only screen and (max-width: 480px) {
          .olvy-frame-container.olvy-frame-simple-feedback{
            bottom: 1rem !important;
            top: auto !important;
            left: 0 !important;
            right: 0 !important;
            margin: auto !important;
          }
        }

        .olvy-tab-launcher-content-${this.widgetInstance?.alias}{
          font-size: 1rem;
          cursor: pointer;
          color: white;
          padding: 0.75rem 0.5rem;
          writing-mode: vertical-lr;
          -webkit-writing-mode: vertical-lr;
          -moz-writing-mode: vetical-lr;
          background-color: ${
this.isDarkMode?this.widgetInstance?.appearance?.darkTheme?.brandColor||"#DB2777":this.widgetInstance?.appearance?.theme?.brandColor||"#DB2777"
};
        }

      `;document.querySelector("head").appendChild(CSSElement);};this.removeCSS=()=>{let CSSElement=document.querySelector(`style#olvy-css-${this.widgetInstance.alias}`);if(CSSElement){CSSElement.remove();}};}
function OlvyFeedbackRatingWidget(widgetInstance){this.widgetInstance=widgetInstance;this.olvyInstance=widgetInstance.olvyInstance;this.notificationPollingInterval=null;this.notificationInfo={};this.prevNotificationInfo={};this.feedbackWidgetShown=false;this.notificationShown=false;this.notificationPollingTimeout=60000;this.showOlvyBranding=true;this.isDarkMode=false;const isWidgetWithoutOverlay=!this.widgetInstance.appearance.showOverlay;this.handleTargetClick=(e)=>{e.preventDefault();e.stopPropagation();this.widgetInstance.show();};this.init=()=>{};this.setup=()=>{const isTabLauncher=this.widgetInstance?.config?.widgetLauncherType?.id==="tab";const widgetElement=document.createElement("div");widgetElement.id=`olvy-rating-feedback-${this.widgetInstance.alias}`;widgetElement.classList.add("olvy-rating-feedback");widgetElement.classList.add(this.widgetInstance?.appearance?.widgetPosition);if(isWidgetWithoutOverlay){widgetElement.innerHTML=`
        <div class="olvy-frame-container olvy-frame-rating-feedback no-overlay" id="${`olvy-frame-container-${this.widgetInstance.alias}`}">
          <iframe class="olvy-frame no-overlay" name="olvy-frame-${
this.widgetInstance.alias
}"  id="olvy-frame-${
this.widgetInstance.alias
}" src="https://${this.olvyInstance.getAlias()}.olvy.co/embed/feedback/rating?alias=${this.olvyInstance.getAlias()}&widget=${encodeURIComponent(JSON.stringify(this.widgetInstance.widgetObject))}&logo=${this.widgetInstance.organisationLogo}&isDemoWidget=${
this.widgetInstance?.isDemoWidget
}&workspaceAlias=${this.olvyInstance.getAlias()}"></iframe>
        </div>
      `;}else{widgetElement.innerHTML=`
        <div class="olvy-rating-feedback-overlay" id="${`olvy-rating-feedback-overlay-${this.widgetInstance.alias}`}"></div>
        <div class="olvy-frame-container olvy-frame-rating-feedback" id="${`olvy-frame-container-${this.widgetInstance.alias}`}">
          <iframe class="olvy-frame" name="olvy-frame-${
this.widgetInstance.alias
}"  id="olvy-frame-${
this.widgetInstance.alias
}" src="https://${this.olvyInstance.getAlias()}.olvy.co/embed/feedback/rating?alias=${this.olvyInstance.getAlias()}&widget=${encodeURIComponent(JSON.stringify(this.widgetInstance.widgetObject))}&logo=${this.widgetInstance.organisationLogo}&isDemoWidget=${
this.widgetInstance?.isDemoWidget
}&workspaceAlias=${this.olvyInstance.getAlias()}"></iframe>
        </div>
      `;}
this.widgetInstance.setElement(widgetElement);document.querySelector(this.widgetInstance?.config?.appendTo).appendChild(widgetElement);this.insertCSS();if(!isTabLauncher)this.setupEventListeners();else{if(!this.widgetInstance?.isDemoWidget)this.setupTabLauncher();}
this.setupReplies();this.autoShowWidget();};this.setupTabLauncher=()=>{if(this.widgetInstance?.config?.themeStyle?.id==="auto"&&!this.widgetInstance?.isDemoWidget){_listenForAutoTheme(this.updateThemeForTabLauncher);}
const tabLauncher=document.createElement("div");tabLauncher.classList.add(`${
this.widgetInstance?.config?.tabLauncher?.position==="left"?"olvy-tab-launcher-left":"olvy-tab-launcher-right"
}`);tabLauncher.classList.add("olvy-show-tab-launcher");tabLauncher.id=`olvy-tab-launcher-container-${this.widgetInstance?.alias}`;tabLauncher.innerHTML=`
      <div id="olvy-tab-launcher-${
this.widgetInstance?.alias
}" data-test="tab-launcher" class="olvy-tab-launcher-content-${
this.widgetInstance?.alias
} ${
this.widgetInstance?.config?.tabLauncher?.position==="right"?"olvy-tab-launcher-content-right tab-launcher-slide-in-right":"olvy-tab-launcher-content-left tab-launcher-slide-in-left"
}">${
this.widgetInstance?.config?.tabLauncher?.text||"Give Feedback"
}</div>
    `;document.body.append(tabLauncher);document.addEventListener("click",(e)=>{if(e.target.id===`olvy-rating-feedback-overlay-${this.widgetInstance.alias}`||e.target.id===`olvy-frame-container-${this.widgetInstance.alias}`){e.preventDefault();e.stopPropagation();if(this.widgetInstance?.appearance?.showOverlay){this.showTabLauncher();this.hide();this.setSnoozeTimestamp();}}});tabLauncher.addEventListener("click",this.handleTabLauncherClickEvent);};this.handleTabLauncherClickEvent=(e)=>{if(e.target.id===`olvy-tab-launcher-${this.widgetInstance?.alias}`){this.handleTargetClick(e);this.hideTabLauncher();}};this.updateThemeForTabLauncher=(type)=>{const tabElement=document.getElementById(`olvy-tab-launcher-${this.widgetInstance?.alias}`);if(tabElement){if(type==="light"){if(tabElement)
tabElement.style.background=this.widgetInstance?.appearance?.theme?.brandColor;}else{tabElement.style.background=this.widgetInstance?.appearance?.darkTheme?.brandColor;}}else{if(type==="dark"){this.isDarkMode=true;}}};this.updateTabLauncher=(updatedData)=>{if(document.getElementById(`olvy-tab-launcher-${this.widgetInstance?.alias}`)){document.getElementById(`olvy-tab-launcher-${this.widgetInstance?.alias}`).style.cssText=`background-color: ${
updatedData?.config?.themeStyle?.id==="auto"&&updatedData?.config?.themeToShow==="auto-dark"?updatedData?.appearance?.darkTheme?.brandColor:updatedData?.appearance?.theme?.brandColor
}`;document.getElementById(`olvy-tab-launcher-${this.widgetInstance?.alias}`).innerHTML=updatedData.config.tabLauncher.text.length>0?updatedData.config.tabLauncher.text:"Give Feedback";}};this.showTabLauncher=()=>{if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab"){if(document.getElementById(`olvy-tab-launcher-container-${this.widgetInstance?.alias}`)){document.getElementById(`olvy-tab-launcher-container-${this.widgetInstance?.alias}`).classList.remove("olvy-hide-tab-launcher");document.getElementById(`olvy-tab-launcher-container-${this.widgetInstance?.alias}`).classList.add("olvy-show-tab-launcher");}}};this.hideTabLauncher=()=>{if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab"){if(document.getElementById(`olvy-tab-launcher-container-${this.widgetInstance?.alias}`)){document.getElementById(`olvy-tab-launcher-container-${this.widgetInstance?.alias}`).classList.add("olvy-hide-tab-launcher");}}};this.autoShowWidget=()=>{if(_isLocalStorageAvailable()===true){const isSnoozeDisabled=__getLocalStorage(`olvy-rating-${this.olvyInstance.getAlias()}-disable-autoSnooze`);if(!isSnoozeDisabled&&this.widgetInstance.config&&this.widgetInstance.config.autoShowWidget){if(this.widgetInstance.config.autoShowSnoozeEnabled){let snoozeTS=__getLocalStorage(`olvy-rating-${this.olvyInstance.getAlias()}-snooze`);if(snoozeTS){const currentTS=new Date().getTime();snoozeTS=new Date(snoozeTS).getTime();if(currentTS>=snoozeTS)this.show();}else this.show();}else this.show();}}};this.setupReplies=()=>{if(this.widgetInstance.config&&this.widgetInstance.config.repliesEnabled&&!isNotificationPopupSetup){this.setupNotificationPolling();}};this.setupEventListeners=()=>{document.addEventListener("click",(e)=>{if(e.target.id===`olvy-rating-feedback-overlay-${this.widgetInstance.alias}`||e.target.id===`olvy-frame-container-${this.widgetInstance.alias}`){e.preventDefault();e.stopPropagation();if(this.widgetInstance?.appearance?.showOverlay)
this.widgetInstance.hide();}});document.addEventListener("keydown",(e)=>{if(e.keyCode==27){this.widgetInstance.hide();}});if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){const targetElement=document.querySelector(this.widgetInstance.config.targetElement);if(targetElement){targetElement.addEventListener("click",this.handleTargetClick);}}
this.insertCSS(this.widgetInstance);};this.setupNotificationPolling=async()=>{const userInLocalStorage=__getLocalStorage(`olvy-user-${this.olvyInstance.getAlias()}`);let userObject={};if(userInLocalStorage){userObject=JSON.parse(userInLocalStorage);}
if(this.olvyInstance?.organisationId&&userObject?.email){if(this.widgetInstance.config&&this.widgetInstance.config.replyNotifications){this.setupNotificationPopup();isNotificationPopupSetup=true;}
await this.processNotificationCount(userObject);this.notificationPollingInterval=setInterval(async()=>{await this.processNotificationCount(userObject);},this.notificationPollingTimeout);}};this.refreshRepliesCount=async()=>{const userInLocalStorage=__getLocalStorage(`olvy-user-${this.olvyInstance.getAlias()}`);let userObject={};if(userInLocalStorage){userObject=JSON.parse(userInLocalStorage);}
if(this.olvyInstance?.organisationId&&userObject?.email){await this.processNotificationCount(userObject);}};this.processNotificationCount=async(userObject)=>{await this.fetchNotificationCount(userObject?.email);if(this.feedbackWidgetShown===false&&this.notificationInfo?.newReplyCount>0&&this.notificationInfo?.newReplyCount!==this.prevNotificationInfo?.newReplyCount&&this.notificationInfo?.latestReplyText!==this.prevNotificationInfo?.latestReplyText){this.prevNotificationInfo=this.notificationInfo;if(this.widgetInstance.config&&this.widgetInstance.config.replyNotifications){this.showNotificationPopup();window.frames[`olvy-feeback-notify-popup-${this.widgetInstance.alias}`].postMessage({key:`olvy-setNotificationInfo`,value:this.notificationInfo,},"*");}}
window.frames[`olvy-frame-${this.widgetInstance.alias}`].postMessage({key:`olvy-setNotificationInfo`,value:this.notificationInfo,},"*");isNotificationPopupSetup=true;};this.setupNotificationPopup=(isBuilder=false)=>{const element=document.createElement("div");element.id=`olvy-feeback-notify-popup-${this.widgetInstance.alias}`;element.innerHTML=`
        <div data-test="feeback-notify-popup" class="olvy-frame-notify-popup" id="${`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`}">
      <iframe data-test="feeback-notify-popup-iframe" class="olvy-frame" name="olvy-feeback-notify-popup-${
this.widgetInstance.alias
}" src="https://${this.olvyInstance.getAlias()}.olvy.co/embed/notification?alias=${this.olvyInstance.getAlias()}&widget=${encodeURIComponent(JSON.stringify(this.widgetInstance.widgetObject))}&workspaceAlias=${this.olvyInstance.getAlias()}&logo=${
this.widgetInstance.organisationLogo
}&builder=${isBuilder}"></iframe>
        </div>
      `;document.querySelector(this.widgetInstance?.config?.appendTo).appendChild(element);window.addEventListener("message",(e)=>{if(e.data===`olvy-open-feedback-widget-${this.widgetInstance.alias}`){if(this.notificationShown)this.hideNotificationPopup();this.show();this.hideTabLauncher();window.frames[`olvy-frame-${this.widgetInstance.alias}`].postMessage({key:`olvy-widget-auto-open-replies`,},"*");}else if(e.data===`olvy-close-notification-popup-${this.widgetInstance.alias}`){if(this.notificationShown)this.hideNotificationPopup();}else if(e.data===`olvy-loaded-${this.widgetInstance.alias}`){window.frames[`olvy-feeback-notify-popup-${this.widgetInstance.alias}`].postMessage({key:`olvy-setNotificationInfo`,value:this.notificationInfo,},"*");}});};this.setupNotificationPopupForBuilder=(hideWidget=true)=>{this.setupNotificationPopup(true);this.showNotificationPopup();if(hideWidget)this.hide();};this.captureScreenshot=()=>{if(!this.widgetInstance?.isDemoWidget){this.hide();_allowScreenshot(this.widgetInstance);if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab")
this.hideTabLauncher();}};this.captureScreenRecord=()=>{if(!this.widgetInstance?.isDemoWidget){this.hide();_screenRecord(this.widgetInstance);if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab")
this.hideTabLauncher();}};this.fetchNotificationCount=async(userEmail)=>{var myHeaders=new Headers();myHeaders.append("Content-Type","application/json");var requestOptions={method:"GET",headers:myHeaders,};var lastReplyOpenedTime=__getLocalStorage(`olvy-reply-lastOpened-${this.olvyInstance.getAlias()}`)?localStorage.getItem(`olvy-reply-lastOpened-${this.olvyInstance.getAlias()}`).replaceAll('"',""):"null";var params=new URLSearchParams({org_id:this.olvyInstance.organisationId,contact_email:userEmail,compare_time:lastReplyOpenedTime,});await fetch(`${this.olvyInstance.API_URL}/widget_reply_count?`+params,requestOptions).then((response)=>{return response.json();}).then((result)=>{if(result?.status==="success"){this.notificationInfo=result;}else{console.warn("[Olvy] - ",result.error||result.errors[0]);}}).catch((error)=>console.warn("[Olvy] - Error fetching feedback reply",error));};this.showNotificationPopup=()=>{if(document.getElementById(`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`)){document.getElementById(`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`).classList.add("olvy-notify-popup-visible");}
const bodyElement=document.querySelector(`body`);bodyElement.classList.add("olvy-rating-feedback-open");document.getElementById(`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`).classList.add(this.widgetInstance?.appearance?.widgetPosition+"-animation");this.notificationShown=true;};this.hideNotificationPopup=()=>{if(document.getElementById(`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`))
document.getElementById(`olvy-feeback-notify-popup-container-${this.widgetInstance.alias}`).classList.remove("olvy-notify-popup-visible");const bodyElement=document.querySelector(`body`);if(bodyElement){bodyElement.classList.remove("olvy-rating-feedback-open");}
this.notificationShown=false;};this.teardown=()=>{this.removeCSS();if(document.querySelector(`#${`olvy-rating-feedback-${this.widgetInstance.alias}`}`)&&document.querySelector(this.widgetInstance?.config?.appendTo)){document.querySelector(this.widgetInstance?.config?.appendTo).removeChild(document.querySelector(`#${`olvy-rating-feedback-${this.widgetInstance.alias}`}`));}
if(this.widgetInstance.config&&this.widgetInstance.config.targetElement){const targetElement=document.querySelector(this.widgetInstance.config.targetElement);if(targetElement){targetElement.removeEventListener("click",this.handleTargetClick);}}
if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab"){if(document.querySelector(`#${`olvy-tab-launcher-container-${this.widgetInstance?.alias}`}`)){document.querySelector(`#${`olvy-tab-launcher-container-${this.widgetInstance?.alias}`}`).removeEventListener("click",this.handleTabLauncherClickEvent);document.querySelector("body").removeChild(document.querySelector(`#${`olvy-tab-launcher-container-${this.widgetInstance?.alias}`}`));}
this.isDarkMode=false;}
window.removeEventListener("message",(e)=>{if(e.data===this.widgetInstance.eventKeys.close){this.widgetInstance.hide();}else if(e.data===this.widgetInstance.eventKeys.loaded){this.widgetInstance.contentLoaded=true;}},false);this.widgetInstance.setElement(null);if(this.notificationPollingInterval!=null)
clearInterval(this.notificationPollingInterval);};this.show=()=>{if(!this.widgetInstance.elementRef){this.setup(this.widgetInstance);}
this.widgetInstance.elementRef.classList.add("visible");const bodyElement=document.querySelector(`body`);if(bodyElement&&!isWidgetWithoutOverlay){bodyElement.classList.add("olvy-rating-feedback-open");}
if(isWidgetWithoutOverlay){window.frames[`olvy-frame-${this.widgetInstance.alias}`].postMessage({key:`olvy-widget-get-height`,},"*");}
document.getElementById(`olvy-frame-container-${this.widgetInstance.alias}`).classList.add(this.widgetInstance?.appearance?.widgetPosition+"-animation");window.frames[`olvy-frame-${this.widgetInstance.alias}`].postMessage({key:`olvy-widget-adjust-height`,},"*");this.widgetInstance.visible=true;this.feedbackWidgetShown=true;if(this.notificationShown)this.hideNotificationPopup();if(this.widgetInstance?.isDemoWidget&&this.widgetInstance?.cbForSectionUpdateFW){this.widgetInstance.cbForSectionUpdateFW("rating-tab");}
this.olvyInstance.registerEvent("widget_open",this.widgetInstance.widgetObject.widgetId,this.olvyInstance.organisationId,null,null);};this.hide=()=>{if(this.widgetInstance.elementRef){this.widgetInstance.elementRef.classList.remove("visible");}
const bodyElement=document.querySelector(`body`);if(bodyElement){bodyElement.classList.remove("olvy-rating-feedback-open");}
this.widgetInstance.visible=false;this.feedbackWidgetShown=false;if(this.widgetInstance?.config?.widgetLauncherType?.id==="tab"){this.showTabLauncher();if(this.widgetInstance?.isDemoWidget){this.widgetInstance.cbForSectionUpdateFW("selector-tab");}}};this.setSnoozeTimestamp=()=>{if(this.widgetInstance.config&&this.widgetInstance.config?.autoShowSnoozeEnabled&&this.widgetInstance.config?.snoozeValues){const days=this.widgetInstance.config.snoozeValues?.days||0;const hrs=this.widgetInstance.config.snoozeValues?.hours||0;const currentTime=new Date();let finalTime=new Date(currentTime);finalTime.setDate(currentTime.getDate()+parseInt(days));finalTime.setHours(currentTime.getHours()+parseInt(hrs));__setLocalStorage(`olvy-rating-${this.olvyInstance.getAlias()}-snooze`,finalTime.toISOString());}};this.disableAutoSnooze=()=>{if(this.widgetInstance.config&&this.widgetInstance.config?.dontShowIfFeedbackIsSubmitted){__setLocalStorage(`olvy-rating-${this.olvyInstance.getAlias()}-disable-autoSnooze`,true);}};this.insertCSS=()=>{window.addEventListener("message",(e)=>{if(e.data.key===`olvy-widget-set-height-${this.widgetInstance.alias}`){document.getElementById(`${`olvy-frame-container-${this.widgetInstance.alias}`}`).style.height=`${e.data.value===0?"370":e.data.value}px`;document.getElementById(`${`olvy-frame-container-${this.widgetInstance.alias}`}`).style.position="fixed";}
if(e.data.key===`olvy-rating-center-set-maxHeight-${this.widgetInstance.alias}`){document.getElementById(`${`olvy-frame-container-${this.widgetInstance.alias}`}`).style.height=`${e.data.value===0?"370":e.data.value}px`;}});let CSSElement=document.querySelector(`style#olvy-css-${this.widgetInstance.alias}`);if(CSSElement){CSSElement.remove();}
const styleEl=document.createElement("style");styleEl.id=`olvy-css-${this.widgetInstance.alias}`;CSSElement=styleEl;CSSElement.innerHTML=`
        ${this.widgetInstance?.config?.targetElement} {
          position: relative;
        } 
        .olvy-hide-tab-launcher {
          display: none !important;
        }

        .olvy-show-tab-launcher {
          display: block;
        }

        .olvy-tab-launcher-left{
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          left: ${this.widgetInstance?.isDemoWidget?"41.5%":"0"};
          display: flex;
          height: 100vh;
          align-items: center;
          z-index: 1999999;
        }

        .olvy-tab-launcher-right{
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          right: 0;
          z-index: 1999999;
        }

        .olvy-tab-launcher-content-right{
          transform: rotate(180deg);
          -webkit-transform: rotate(180deg);
          -moz-transform: rotate(180deg);
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .olvy-tab-launcher-content-left{
          border-radius: 0  0.5rem 0.5rem 0;
        }

        .olvy-rating-feedback {
          display: none;
          transition: display 0.5s ease-in-out;
        }

        .olvy-rating-feedback-open {
          // overflow: hidden !important;
        }

        .olvy-rating-feedback-overlay {
          width: 100%;
          height: 100%;
          background-color: ${
this.widgetInstance.appearance&&this.widgetInstance?.appearance?.showOverlay?"#000000bf":"transparent"
};
          z-index: 2000000;
        }

        .olvy-rating-feedback.visible {
          display: block;
          ${
!isWidgetWithoutOverlay?"position: fixed; top: 0; right: 0; left: 0; bottom: 0; z-index: 2000000;":"position: initial;"
}
        }

        .olvy-rating-feedback.visible.top-right .olvy-frame-container {
          right: 1rem;
          top: 1rem;
        }

        .olvy-rating-feedback.visible.top-left .olvy-frame-container {
          left: 1rem;
          top: 1rem;
        }

        .olvy-rating-feedback.visible.bottom-left .olvy-frame-container {
          left: 1rem;
          bottom: 1rem;
        }
        .olvy-rating-feedback.visible.bottom-right .olvy-frame-container {
          right: 1rem;
          bottom: 1rem;
        }
        .olvy-rating-feedback.visible.center .olvy-frame-container {
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          height: 100%;
          width: 100%;
          max-height: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          height: 360px;
        }
        .olvy-rating-feedback.center .olvy-frame-container {
          max-height: ${
!this.widgetInstance?.config?.repliesEnabled?"322px":"376px"
};
          margin: 0px auto;
          max-width: 360px;
        }


        .olvy-frame-rating-feedback .olvy-frame {
          height: 100%;
          width: 100%;
          max-width: 360px;
          border-radius: 8px;
          overflow: hidden;
          border: none;
        }

        
        .olvy-frame-notify-popup .olvy-frame {
          height: 100%;
          width: 100%;
          max-height: 130px;
          max-width: 400px;
          border-radius: 8px;
          overflow: hidden;
          border: none;
        }

        .olvy-frame-notify-popup {
          display: none;
          align-items: center;
          justify-content: center;
          position: absolute;
          height: 100%;
          width: 100%;
          z-index: 2000002;
          max-height: 130px;
          max-width: 400px;
          border-radius: 8px;     
        }

        .olvy-notify-popup-visible {
          display: block !important;
          position: fixed;
          right: 1rem;
          bottom: 1rem;
          z-index: 2000000;
          height: 130px;
          width: 400px;
          border: 1px solid #CBD5E1;
          box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1);
        }



        .olvy-frame-container.olvy-frame-rating-feedback {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          // height: 100%;
          max-height: 640px;
          width: 100%;
          z-index: 2000002;
          max-width: 360px;
          border-radius: 8px;
          position: absolute;
        }

        .translateContainerHeightUp {
          max-height: 640px !important;
          animation: 250ms ease translateUp forwards;
        }

        .translateContainerHeightUpWithoutOlvyBranding {
          max-height: 600px !important;
          animation: 250ms ease translateUp forwards;
        }

        .translateFrameMaxHeightUp {
          animation: 250ms ease translateMaxHeightUp forwards;
        }

        .bottom-right-animation {
          animation-name: rightSlide;
          animation-duration: 0.2s;
          transition-timing-function: ease;
        }

        .bottom-left-animation {
          animation-name: leftSlide;
          animation-duration: 0.2s;
          transition-timing-function: ease;
        }

        .top-left-animation {
          animation-name: leftSlide;
          animation-duration: 0.2s;
          transition-timing-function: ease;
        }

        .top-right-animation {
          animation-name: rightSlide;
          animation-duration: 0.2s;
          transition-timing-function: ease;
        }

        .center-animation {
          animation-name: bounce;
          animation-duration: 0.3s;
          transition-timing-function: ease;
        }
              
        @keyframes rightSlide {
            0% {
              right: -450px;
            }
            100% {
              right: 1rem;
            }
        }

        @keyframes leftSlide {
          0% {
            left: -450px;
          }
          100% { 
            left: 1rem; 
          }
        }
  
        @keyframes bounce {
          0% {
            opacity: 0;
            transform: scale(0.8) translate3d(0,0,0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate3d(0,0,0);
          }
        }

        @keyframes translateUp {
          0% {
            height: 322px;
          }
          100% {
            height: 640px;
          }
        }

        @keyframes translateMaxHeightUp {
          0% {
            max-height: 322px;
          }
          100% {
            max-height: 640px;
          }
        } 

        @-webkit-keyframes tab-launcher-slide-in-left {
          from {
            -webkit-transform: translate3d(-100%, 0, 0);
            transform: translate3d(-100%, 0, 0);
            visibility: visible;
          }
        
          to {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes tab-launcher-slide-in-left {
          from {
            -webkit-transform: translate3d(-100%, 0, 0);
            transform: translate3d(-100%, 0, 0);
            visibility: visible;
          }
        
          to {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
        }

        .tab-launcher-slide-in-left {
          -webkit-animation: tab-launcher-slide-in-left 100ms ease-in-out;
          animation: tab-launcher-slide-in-left 100ms ease-in-out;
        }


        @-webkit-keyframes tab-launcher-slide-in-right {
          from {
            -webkit-transform: translate3d(100%, 0, 0) rotate(180deg);
            transform: translate3d(100%, 0, 0) rotate(180deg);        
            visibility: visible;
          }
        
          to {
            -webkit-transform: translate3d(0, 0, 0)  rotate(180deg);
            transform: translate3d(0, 0, 0)  rotate(180deg);
          }
        }
        @keyframes tab-launcher-slide-in-right {
          from {
            -webkit-transform: translate3d(100%, 0, 0) rotate(180deg);
            transform: translate3d(100%, 0, 0)  rotate(180deg);
            visibility: visible;
          }
        
          to {
            -webkit-transform: translate3d(0, 0, 0)  rotate(180deg);
            transform: translate3d(0, 0, 0)  rotate(180deg);
          }
        }
        
        .tab-launcher-slide-in-right {
          -webkit-animation: tab-launcher-slide-in-right 100ms ease-in-out;
          animation: tab-launcher-slide-in-right 100ms ease-in-out;
        }

        @media only screen and (max-width: 600px) {
          .olvy-frame-notify-popup{
            display: none !important;
          }
        }
        
        @media only screen and (max-width: 480px) {
          .olvy-frame-container.olvy-frame-rating-feedback{
            bottom: 1rem !important;
            top: auto !important;
            left: 0 !important;
            right: 0 !important;
            margin: auto !important;
          }
        }

        .olvy-tab-launcher-content-${this.widgetInstance?.alias}{
          font-size: 1rem;
          cursor: pointer;
          color: white;
          padding: 0.75rem 0.5rem;
          writing-mode: vertical-lr;
          -webkit-writing-mode: vertical-lr;
          -moz-writing-mode: vetical-lr;
          background-color: ${
this.isDarkMode?this.widgetInstance?.appearance?.darkTheme?.brandColor||"#DB2777":this.widgetInstance?.appearance?.theme?.brandColor||"#DB2777"
};
        }
      `;document.querySelector("head").appendChild(CSSElement);};this.removeCSS=()=>{let CSSElement=document.querySelector(`style#olvy-css-${this.widgetInstance.alias}`);if(CSSElement){CSSElement.remove();}};}
function OlvyWidget(olvyInstance,settings,logo){settings=__deepMerge({},DEFAULT_WIDGET_CONFIG,settings);this.olvyInstance=olvyInstance;this.id=settings.id;this.name=settings.name;this.description=settings.description;this.alias=settings.alias;this.type=settings.type;this.subType=settings.subType;this.targeting=settings.targeting;this.appearance=settings.appearance;this.content=settings.content;this.config=settings.config;this.widgetObject=settings;this.organisationLogo=logo;this.isDemoWidget=settings?.isDemoWidget;this.userObject=olvyInstance.userObject;this.feedbackMetaInfo=null;this.widgetTypeInstance=null;this.contentLoaded=false;this.elementRef=null;this.visible=false;this.cbForSectionUpdateFW=null;this.eventKeys={close:`olvy-close-${this.alias}`,loaded:`olvy-loaded-${this.alias}`,downloadLink:`olvy-download-link-${this.alias}-`,download:`olvy-feedback-widget-download-link-${this.alias}`,refreshReplyCount:`olvy-refresh-reply-${this.alias}`,setNotificationPolling:`olvy-set-replies-polling-${this.alias}`,setItemToLocalStorage:`olvy-setItemLC-${this.alias}`,getItemFromLocalStorage:`olvy-getItemLC-${this.alias}`,reduceWidgetHeightForBranding:`olvy-reduce-branding-widget-height-${this.alias}`,setSnoozeTimestamp:`olvy-set-snooze-${this.alias}`,disableAutoSnooze:`olvy-set-disable-autosnooze-${this.alias}`,captureScreenshot:`olvy-capture-screenshot-${this.alias}`,captureScreenRecord:`olvy-capture-screenrecording-${this.alias}`,updateBuilderSection:`olvy-update-builder-section-${this.alias}`,};this.previewFeedbackNotificationPopup=(hideWidget=true)=>{if(this.widgetTypeInstance&&this.widgetTypeInstance.setupNotificationPopupForBuilder)
this.widgetTypeInstance.setupNotificationPopupForBuilder(hideWidget);};this.teardownPreviewFeedbackNotificationPopup=()=>{if(this.widgetTypeInstance&&this.widgetTypeInstance.hideNotificationPopup){this.widgetTypeInstance.hideNotificationPopup();this.widgetTypeInstance.teardown();}};this.setElement=(elementRef)=>{this.elementRef=elementRef;};this.getOrganisationLogo=()=>{return this.organisationLogo;};this.setWidgetTypeInstance=()=>{if(this.type===OLVY_WIDGET_TYPE_RELEASES){if(this.subType===OLVY_WIDGET_RELEASES_SUB_TYPE_MODAL){this.widgetTypeInstance=new OlvyReleasesModalWidget(this);}
if(this.subType===OLVY_WIDGET_RELEASES_SUB_TYPE_SIDEBAR){this.widgetTypeInstance=new OlvyReleasesSidebarWidget(this);}
if(this.subType===OLVY_WIDGET_RELEASES_SUB_TYPE_EMBED){this.widgetTypeInstance=new OlvyReleasesEmbedWidget(this);}
if(this.subType===OLVY_WIDGET_RELEASES_SUB_TYPE_POPUP){this.widgetTypeInstance=new OlvyReleasesPopupWidget(this);}}else if(this.type===OLVY_WIDGET_TYPE_FEEDBACK){if(this.subType===OLVY_WIDGET_FEEDBACK_SUB_TYPE_SIMPLE)
this.widgetTypeInstance=new OlvyFeedbackSimpleWidget(this);if(this.subType===OLVY_WIDGET_FEEDBACK_SUB_TYPE_RATING)
this.widgetTypeInstance=new OlvyFeedbackRatingWidget(this);}};this.setWidgetTypeInstance();this.init=()=>{if(this.widgetTypeInstance){this.widgetTypeInstance.init();}
window.addEventListener("message",(e)=>{if(e.data===this.eventKeys.close){this.hide();}else if(e.data===this.eventKeys.loaded){this.contentLoaded=true;if(window.frames[`olvy-frame-${this.alias}`]){if(this.userObject===null){this.userObject=_isLocalStorageAvailable()?JSON.parse(__getLocalStorage("olvy-user-"+this.olvyInstance.workspaceAlias)):null;}
if(this.userObject){window.frames[`olvy-frame-${this.alias}`].postMessage({key:`olvy-setUser`,value:this.userObject,},"*");}
if(this.feedbackMetaInfo){window.frames[`olvy-frame-${this.alias}`].postMessage({key:`olvy-setFeedbackMetaInfo`,value:this.feedbackMetaInfo,},"*");}
window.frames[`olvy-frame-${this.alias}`].postMessage({key:`olvy-setPageInfo`,value:{url:window.location.toString(),title:document.title,},},"*");window.frames[`olvy-frame-${this.alias}`].postMessage({key:`olvy-widget-isLocalStorageAvailable`,value:_isLocalStorageAvailable(),},"*");window.frames[`olvy-frame-${this.alias}`].postMessage({key:`olvy-widget-localStorageValues`,value:_getLocalStorageValues(this.olvyInstance.workspaceAlias),},"*");}}else if(e.data.key===this.eventKeys.refreshReplyCount){if(this.widgetTypeInstance&&this.widgetTypeInstance.refreshRepliesCount){this.widgetTypeInstance.refreshRepliesCount();}}else if(e.data.key===this.eventKeys.setNotificationPolling){if(this.widgetTypeInstance&&this.widgetTypeInstance.setupReplies){this.widgetTypeInstance.setupReplies();}}else if(e.data.key===this.eventKeys.download){if(e.data.value){_triggerFileDownload(e.data.value?.link,e.data.value?.name);}}else if(e.data.key===this.eventKeys.setItemToLocalStorage){if(e.data.value){__setLocalStorage(e.data.value?.keyName,e.data.value?.value);}}else if(e.data.key===this.eventKeys.getItemFromLocalStorage){if(e.data.value){const value=_isLocalStorageAvailable()?JSON.parse(__getLocalStorage(e.data.value.keyName)):null;if(value){window.frames[`olvy-frame-${this.alias}`].postMessage({key:`olvy-localStorage-value`,value:{keyName:e.data.value.keyName,value:value,},},"*");}}}
else if(e.data.key===this.eventKeys.setSnoozeTimestamp){if(this.widgetTypeInstance&&this.widgetTypeInstance.setSnoozeTimestamp){this.widgetTypeInstance.setSnoozeTimestamp();}}else if(e.data.key===this.eventKeys.disableAutoSnooze){if(this.widgetTypeInstance&&this.widgetTypeInstance.disableAutoSnooze){this.widgetTypeInstance.disableAutoSnooze();}}else if(e.data.key===this.eventKeys.captureScreenshot){if(this.type===OLVY_WIDGET_TYPE_FEEDBACK&&this.widgetTypeInstance&&this.widgetTypeInstance.captureScreenshot)
this.widgetTypeInstance.captureScreenshot();}else if(e.data.key===this.eventKeys.captureScreenRecord){if(this.type===OLVY_WIDGET_TYPE_FEEDBACK&&this.widgetTypeInstance&&this.widgetTypeInstance.captureScreenRecord)
this.widgetTypeInstance.captureScreenRecord();}else if(e.data.key===this.eventKeys.updateBuilderSection){if(this.cbForSectionUpdateFW!==null&&this.isDemoWidget){this.cbForSectionUpdateFW(e.data.value);}}},false);};this.setup=()=>{if(this.widgetTypeInstance){this.widgetTypeInstance.setup();if(window.OlvyConfig&&window.OlvyConfig.onWidgetReady){window.OlvyConfig.onWidgetReady(this);}
if(this.olvyInstance.onWidgetReady){this.olvyInstance.onWidgetReady(this);}
if(this.config&&this.config.targetElement&&!document.querySelector(this.config.targetElement)&&this.config?.widgetLauncherType?.id!=="tab"){__waitForElement(this.config.targetElement).then(()=>{this.teardownEventListeners();this.setupEventListeners();}).catch(()=>{console.warn("[Olvy] - couldn't setup the target element. Does it exist in the DOM?");});}}};this.setupTabLauncher=()=>{if(this.widgetObject?.config?.widgetLauncherType?.id==="tab"){if(this.widgetTypeInstance?.setupTabLauncher)
this.widgetTypeInstance.setupTabLauncher();}};this.showTabLauncher=()=>{if(this.widgetObject?.config?.widgetLauncherType?.id==="tab"){if(this.widgetTypeInstance&&this.widgetTypeInstance.showTabLauncher)
this.widgetTypeInstance.showTabLauncher();}};this.hideTabLauncher=()=>{if(this.widgetObject?.config?.widgetLauncherType?.id==="tab"){if(this.widgetTypeInstance&&this.widgetTypeInstance.hideTabLauncher)
this.widgetTypeInstance.hideTabLauncher();}};this.show=()=>{if(this.widgetTypeInstance){this.widgetTypeInstance.show();}};this.hide=()=>{if(this.widgetTypeInstance&&this.olvyInstance.options.preventClose!==true){this.widgetTypeInstance.hide();}};this.hideNotificationPopup=()=>{if(this.widgetTypeInstance&&this.widgetTypeInstance.hideNotificationPopup){this.widgetTypeInstance.hideNotificationPopup();}};this.teardown=()=>{if(this.widgetTypeInstance){this.widgetTypeInstance.teardown();}
if(this.pathChangeListener){__removePathChangeListener(this.pathChangeListener);}};this.isEnabled=()=>{return true;};this.setupEventListeners=()=>{if(this.widgetTypeInstance&&this.widgetTypeInstance.setupEventListeners){this.widgetTypeInstance.setupEventListeners();}};this.teardownEventListeners=()=>{if(this.widgetTypeInstance&&this.widgetTypeInstance.teardownEventListeners){this.widgetTypeInstance.teardownEventListeners();}};this.refresh=()=>{this.teardown();new Olvy((window.OlvyConfig||OlvyConfig).workspaceAlias);};this.refreshUnreadCount=async()=>{const lastOpened=__getLocalStorage(`olvy-${this.olvyInstance.getAlias()}-lastOpened`);if(lastOpened){const unreadReleases=await this.getUnreadReleasesCount(lastOpened);if(unreadReleases>0&&!this.appearance.autoShowWidget){this.addUnreadIndicatorElement(unreadReleases);}}else{this.addUnreadIndicatorElement(1);}};this.getCurrentUnreadReleaseCount=async()=>{const lastOpened=__getLocalStorage(`olvy-${this.olvyInstance.getAlias()}-lastOpened`);if(lastOpened){const unreadReleases=await this.getUnreadReleasesCount(lastOpened);return unreadReleases;}
return 0;};this.getUnreadReleasesCount=(timestamp)=>{return this.olvyInstance.unreadReleasesCount;};this.addUnreadIndicatorElement=(count)=>{this.removeUnreadIndicatorElement();const throbber=document.createElement("div");throbber.classList.add("olvy-unread-indicator",`olvy-widget-${this.alias}`,this.appearance.unreadIndicatorPosition);if(count!==undefined){throbber.innerText=count>9?9:count;}
if(document.querySelector(this.config.targetElement)){document.querySelector(this.config.targetElement).appendChild(throbber);}};this.removeUnreadIndicatorElement=()=>{if(document.querySelector(this.config.targetElement)&&document.querySelector(this.config.targetElement).querySelector(`.olvy-unread-indicator.olvy-widget-${this.alias}`)){document.querySelector(this.config.targetElement).removeChild(document.querySelector(this.config.targetElement).querySelector(`.olvy-unread-indicator.olvy-widget-${this.alias}`));}};this.setUser=(userObject)=>{if(window.frames[`olvy-frame-${this.alias}`]&&this.contentLoaded){window.frames[`olvy-frame-${this.alias}`].postMessage({key:`olvy-setUser`,value:userObject,},"*");}else{this.userObject=userObject;}
this.olvyInstance.registerEvent("set_user",this.id,this.olvyInstance.organisationId,null,userObject);};this.setFeedbackMetaInfo=(metaInfo)=>{if(window.frames[`olvy-frame-${this.alias}`]&&this.contentLoaded){window.frames[`olvy-frame-${this.alias}`].postMessage({key:`olvy-setFeedbackMetaInfo`,value:metaInfo,},"*");}else{this.feedbackMetaInfo=metaInfo;}};const widgetIndex=this.olvyInstance.widgets.findIndex((w)=>w.id===this.id);this.pathChangeListener=__addPathChangeListener(()=>{if(_checkPageRules(this.config?.pageRules||[])){if(this.elementRef&&document.contains(this.elementRef)){this.teardownEventListeners();this.setupEventListeners();}else{this.setup();}}else{if(this.widgetTypeInstance){this.widgetTypeInstance.teardown();}
this.teardownEventListeners();}});this.updateConfig=(config,type="widget")=>{if(this.widgetTypeInstance){const clonedConfig=JSON.parse(JSON.stringify(config));if(config?.config?.widgetLauncherType?.id==="tab"&&this.widgetTypeInstance.updateTabLauncher){this.widgetTypeInstance.updateTabLauncher(config);}
const frameName=type==="notification"?`olvy-feeback-notify-popup-${this.alias}`:`olvy-frame-${this.alias}`;window.frames[frameName].postMessage({key:`olvy-update-widget-config`,value:clonedConfig,},"*");}};this.setCallbackForAutoSectionUpdateFeedbackWidget=(cb)=>{this.cbForSectionUpdateFW=cb;};}
function Olvy(workspaceAlias,options={fetchWidgets:true,preventClose:false,user:null,feedbackMetaInfo:null,onDataLoaded:()=>{},onReady:()=>{},onWidgetReady:()=>{},}){this.workspaceAlias=workspaceAlias;this.widgets=[];this.API_URL="https://app.olvy.co/api/v2";this.unreadReleasesCount=0;this.options=options;this.organisationId=null;this.userObject=options.user;if(!options.user&&window.OlvyUtils.__OLVY_USER_OBJECT__){this.userObject=window.OlvyUtils.__OLVY_USER_OBJECT__;}
this.feedbackMetaInfo=options.feedbackMetaInfo;this.widgetYetToLoad=[];this.onDataLoaded=options.onDataLoaded;this.onReady=options.onReady;this.onWidgetReady=options.onWidgetReady;this.currentLoadedWidgetCount=0;this.getAlias=()=>{return this.workspaceAlias;};this.getLastOpenedTimestamp=()=>{try{const lastOpened=__getLocalStorage(`olvy-${this.workspaceAlias}-lastOpened`);return lastOpened;}catch(e){return "";}};this.afterWidgetsFetched=()=>{if(this.userObject){this.widgets.forEach((wdgt)=>{wdgt.setUser(this.userObject);});}
if(this.feedbackMetaInfo){this.widgets.forEach((wdgt)=>{wdgt.setFeedbackMetaInfo(this.feedbackMetaInfo);});}
if(this.organisationId){this.registerEvent("script_load",null,this.organisationId,null,null);}};if(options.fetchWidgets===undefined||options.fetchWidgets){var myHeaders=new Headers();myHeaders.append("Content-Type","application/json");var graphql=JSON.stringify({operationName:"GetOrganisationWidgets",query:"query GetOrganisationWidgets ($workspaceAlias: String! $timestamp: String){ organisation(id: $workspaceAlias){ id logo meta liveWidgets{ id name widgetId alias type subType targeting{ device{ key operator value } page{ key operator value } user{ key operator value } } content appearance config } publishedReleasesSince(timestamp: $timestamp) } }",variables:{workspaceAlias:workspaceAlias,timestamp:this.getLastOpenedTimestamp()||null,},});var requestOptions={method:"POST",headers:myHeaders,body:graphql,redirect:"follow",};fetch(`${this.API_URL}/graphql`,requestOptions).then((response)=>{return response.json();}).then((result)=>{if(window.OlvyConfig&&window.OlvyConfig.onDataLoaded){window.OlvyConfig.onDataLoaded(result);}
if(this.onDataLoaded){this.onDataLoaded(result);}
if(!result.error&&!result.errors?.length){if(result.data.organisation){this.unreadReleasesCount=result.data.organisation.publishedReleasesSince;const logo=result?.data?.organisation?.logo;organisationMeta=result?.data?.organisation?.meta;this.organisationId=result.data.organisation.id;(result.data.organisation.liveWidgets||[]).forEach((wSettings)=>{const widget=new OlvyWidget(this,wSettings,logo);this.widgets.push(widget);widget.init();});__onPageReady(()=>{this.widgets.forEach((widget)=>{if(widget.isEnabled()){const pageRules=widget?.config?.pageRules||[];const isPageValid=_checkPageRules(pageRules);const isFeedbackWidgetWithTabSelector=widget?.type===OLVY_WIDGET_TYPE_FEEDBACK&&widget?.config?.widgetLauncherType?.id==="tab";if(isFeedbackWidgetWithTabSelector){if(isPageValid){widget.setup();}}else{const targetID=widget?.config?.targetElement?widget.config.targetElement.slice(1,widget.config.targetElement.length):"";if(document.getElementById(targetID)!=null){if(isPageValid)widget.setup();}else
this.widgetYetToLoad.push(widget?.config?.targetElement);}}});if(this.widgetYetToLoad.length>0){_triggerOnIdle(()=>{this.widgets.forEach((widget)=>{if(this.widgetYetToLoad.indexOf(widget?.config?.targetElement)>-1){if(_checkPageRules(widget?.config?.pageRules||[])){widget.setup();}}});});}});this.afterWidgetsFetched();}else{console.warn("[Olvy] - couldn't get organisation data.");}}else{console.warn("[Olvy] - ",result.error||result.errors[0]);}
if(window.OlvyConfig&&window.OlvyConfig.onReady){window.OlvyConfig.onReady();}
if(this.onReady){this.onReady();}}).catch((error)=>console.warn("[Olvy] - Error fetching your widgets",error));}
this.teardown=()=>{this.widgets.forEach((widget)=>{widget.teardown();});};this.registerEvent=(eventType,value,organisationId,userId,meta)=>{if(["localhost","127.0.0.1","","::1"].includes(window.location.hostname)||window.location.hostname.startsWith("192.168.")||window.location.hostname.startsWith("10.0.")||window.location.hostname.endsWith(".local")){console.warn("[Olvy] - not registering script events on localhost");}
if(eventType=="script_load"&&window!==undefined){try{const timestamp=__getLocalStorage(`olvy-script-load-${this.workspaceAlias}`);if(timestamp){const lastTimestamp=new Date(timestamp);const lastString=`${lastTimestamp.getDate()}${lastTimestamp.getMonth()}${lastTimestamp.getFullYear()}`;const now=new Date();const nowString=`${now.getDate()}${now.getMonth()}${now.getFullYear()}`;if(lastString==nowString){return;}}
__setLocalStorage(`olvy-script-load-${this.workspaceAlias}`,new Date().toISOString());}catch(e){console.error("[Olvy] - error logging script load event");}}
var myHeaders=new Headers();myHeaders.append("Content-Type","application/json");var requestOptions={method:"POST",headers:myHeaders,body:JSON.stringify({eventType,value,organisationId,userId,meta,}),redirect:"follow",};fetch(`${this.API_URL}/register_event`,requestOptions);};this.insertGlobalCSS=()=>{let CSSElement=document.querySelector(`style#olvy-css-shared`);if(!CSSElement){const styleEl=document.createElement("style");styleEl.id=`olvy-css-shared`;CSSElement=styleEl;}
CSSElement.innerHTML=``;document.querySelector("head").appendChild(CSSElement);};this.insertGlobalCSS();this.showWidget=(aliasOrID)=>{const wdgt=this.widgets.find((w)=>w.id===aliasOrID||w.alias===aliasOrID);if(wdgt){wdgt.show();}};this.hideWidget=(aliasOrID)=>{const wdgt=this.widgets.find((w)=>w.id===aliasOrID||w.alias===aliasOrID);if(wdgt){wdgt.hide();}};this.setUser=(userObject)=>{this.userObject=userObject;this.widgets.forEach((wdgt)=>{wdgt.setUser(userObject);});};this.setFeedbackMetaInfo=(metaInfo)=>{this.feedbackMetaInfo=metaInfo;this.widgets.forEach((wdgt)=>{wdgt.setFeedbackMetaInfo(metaInfo);});};this.refresh=(aliasOrID)=>{const wdgt=this.widgets.find((w)=>w.id===aliasOrID||w.alias===aliasOrID);if(wdgt){wdgt.refresh();}};this.refreshUnreadCount=(aliasOrID)=>{const wdgt=this.widgets.find((w)=>w.id===aliasOrID||w.alias===aliasOrID);if(wdgt){wdgt.refreshUnreadCount();}};this.getCurrentUnreadReleaseCount=(aliasOrID)=>{const wdgt=this.widgets.find((w)=>w.id===aliasOrID||w.alias===aliasOrID);if(wdgt){return wdgt.getCurrentUnreadReleaseCount();}};this.getUnreadReleasesCount=(aliasOrID)=>{const wdgt=this.widgets.find((w)=>w.id===aliasOrID||w.alias===aliasOrID);if(wdgt){return wdgt.getUnreadReleasesCount();}};this.addUnreadIndicatorElement=(aliasOrID,count)=>{const wdgt=this.widgets.find((w)=>w.id===aliasOrID||w.alias===aliasOrID);if(wdgt){wdgt.addUnreadIndicatorElement(count);}};this.removeUnreadIndicatorElement=(aliasOrID)=>{const wdgt=this.widgets.find((w)=>w.id===aliasOrID||w.alias===aliasOrID);if(wdgt){wdgt.removeUnreadIndicatorElement();}};const olvyInstanceIndex=(window.OlvyInstances||[]).findIndex((w)=>w.workspaceAlias===this.workspaceAlias);if(olvyInstanceIndex<0){window.OlvyInstances.push(this);}
this.fetchOrganisationId=async()=>{var myHeaders=new Headers();myHeaders.append("Content-Type","application/json");var graphql=JSON.stringify({operationName:"GetOrganisationWidgets",query:"query GetOrganisationWidgets ($workspaceAlias: String! ){ organisation(id: $workspaceAlias){ id } }",variables:{workspaceAlias:this.workspaceAlias,},});var requestOptions={method:"POST",headers:myHeaders,body:graphql,redirect:"follow",};await fetch(`${this.API_URL}/graphql`,requestOptions).then((response)=>{return response.json();}).then((result)=>{if(!result.error&&!result.errors?.length){this.organisationId=result.data.organisation.id;}});};__checkAndAddMetaViewPort();this.createFeedback=async(params)=>{if(this.organisationId===null){await this.fetchOrganisationId();}
const feedbackCreationParams={body:params?.text||"",title:params?.title||"",type:params?.type||"",resourceId:"",resourceType:"widgets",source:{type:"olvy_api",app:"olvy-external",timestamp:new Date().toISOString(),url:"",title:"",},contact:{},meta:params?.metaDetails!==null?params.metaDetails:this.feedbackMetaInfo!=null?this.feedbackMetaInfo:null,};const myHeaders=new Headers();myHeaders.append("Content-Type","application/json");const createFeedbackBody=JSON.stringify({query:`
      mutation ($organisationId: String!, $params: CreateFeedbackInput!) {
        createFeedback(organisationId: $organisationId, params: $params)
      }`,variables:{organisationId:this.organisationId,params:feedbackCreationParams,},});let createdFeedbackId="";await fetch(`${this.API_URL}/graphql`,{method:"POST",headers:myHeaders,body:createFeedbackBody,redirect:"follow",}).then((response)=>{return response.json();}).then((result)=>{if(!result.error&&!result.errors?.length){createdFeedbackId=result?.data?.createFeedback;if(!(params?.contact&&Object.keys(params.contact).length>0))
console.info("[Olvy] - feedback pushed!");}else console.warn("[Olvy] - ",result.error||result.errors[0]);});if(params?.contact&&Object.keys(params.contact).length>0&&params?.contact?.name!==null&&params?.contact?.email!==null){const contactParams={name:params?.contact?.name||null,email:params?.contact?.email||null,meta:params?.contact?.metaDetails||null,designation:params?.contact?.designation||null,};const contactMutationBody=JSON.stringify({query:`
          mutation (
            $organisationId: String!
            $feedbackId: String!
            $params: CreateFeedbackContactParams!
          ) {
            addContactToFeedback(
              organisationId: $organisationId
              feedbackId: $feedbackId
              params: $params
            )
          }`,variables:{organisationId:this.organisationId,feedbackId:createdFeedbackId,params:contactParams,},});await fetch(`${this.API_URL}/graphql`,{method:"POST",headers:myHeaders,body:contactMutationBody,redirect:"follow",}).then((response)=>{return response.json();}).then((result)=>{if(!result.error&&!result.errors?.length){console.info("[Olvy] - feedback pushed!");}else console.warn("[Olvy] - ",result.error||result.errors[0]);});}};}
(function(){"use strict";try{window.OlvyUtils={showWidget:(workspaceAlias,widgetAliasOrID)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){olvyInstance.showWidget(widgetAliasOrID);}},hideWidget:(workspaceAlias,widgetAliasOrID)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){olvyInstance.hideWidget(widgetAliasOrID);}},setUser:(workspaceAlias,userObject)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){olvyInstance.setUser(userObject);}
window.OlvyUtils.__OLVY_USER_OBJECT__=userObject;},setFeedbackMetaInfo:(workspaceAlias,metaInfo)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){olvyInstance.setFeedbackMetaInfo(metaInfo);}},refreshUnreadCount:(workspaceAlias,widgetAliasOrID)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){olvyInstance.refreshUnreadCount(widgetAliasOrID);}},getCurrentUnreadReleaseCount:async(workspaceAlias,widgetAliasOrID)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){return olvyInstance.getCurrentUnreadReleaseCount(widgetAliasOrID);}},getUnreadReleasesCount:(workspaceAlias,widgetAliasOrID)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){return olvyInstance.getUnreadReleasesCount(widgetAliasOrID);}},addUnreadIndicatorElement:(workspaceAlias,widgetAliasOrID,count)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){olvyInstance.addUnreadIndicatorElement(widgetAliasOrID,count);}},removeUnreadIndicatorElement:(workspaceAlias,widgetAliasOrID)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){olvyInstance.removeUnreadIndicatorElement(widgetAliasOrID);}},getLastOpenedTimestamp:(workspaceAlias,widgetAliasOrID)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){return olvyInstance.getLastOpenedTimestamp(widgetAliasOrID);}},refresh:(workspaceAlias,widgetAliasOrID)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){olvyInstance.refresh(widgetAliasOrID);}},teardown:(workspaceAlias,widgetAliasOrID)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){olvyInstance.teardown(widgetAliasOrID);}},createFeedback:(workspaceAlias,params)=>{const olvyInstance=window.OlvyInstances.find((o)=>o.workspaceAlias===workspaceAlias);if(olvyInstance){olvyInstance.createFeedback(params);}},defaultWorkspace:{showWidget:(widgetAliasOrID)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];defaultWorkspaceInstance.showWidget(widgetAliasOrID);},hideWidget:(widgetAliasOrID)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];defaultWorkspaceInstance.hideWidget(widgetAliasOrID);},setUser:(widgetAliasOrID,userObject)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];defaultWorkspaceInstance.setUser(widgetAliasOrID,userObject);window.OlvyUtils.__OLVY_USER_OBJECT__=userObject;},setFeedbackMetaInfo:(widgetAliasOrID,metaInfo)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];defaultWorkspaceInstance.setFeedbackMetaInfo(widgetAliasOrID,metaInfo);},refreshUnreadCount:(widgetAliasOrID)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];defaultWorkspaceInstance.refreshUnreadCount(widgetAliasOrID);},getCurrentUnreadReleaseCount:async(widgetAliasOrID)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];return defaultWorkspaceInstance.getCurrentUnreadReleaseCount(widgetAliasOrID);},getUnreadReleasesCount:(widgetAliasOrID)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];return defaultWorkspaceInstance.getUnreadReleasesCount(widgetAliasOrID);},removeUnreadIndicatorElement:(widgetAliasOrID)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];defaultWorkspaceInstance.removeUnreadIndicatorElement(widgetAliasOrID);},addUnreadIndicatorElement:(widgetAliasOrID,count)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];defaultWorkspaceInstance.addUnreadIndicatorElement(widgetAliasOrID,count);},getLastOpenedTimestamp:(widgetAliasOrID)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];return defaultWorkspaceInstance.getLastOpenedTimestamp(widgetAliasOrID);},refresh:(widgetAliasOrID)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];defaultWorkspaceInstance.refresh(widgetAliasOrID);},teardown:(widgetAliasOrID)=>{let defaultWorkspaceInstance=window.OlvyInstances[0];defaultWorkspaceInstance.teardown(widgetAliasOrID);},createFeedback:(params)=>{if(window.OlvyConfig||typeof OlvyConfig!=="undefined"){let defaultWorkspaceInstance=window.OlvyInstances[0];defaultWorkspaceInstance.createFeedback(params);}},},};__onPageReady(()=>{if(window.OlvyConfig||typeof OlvyConfig!=="undefined"){new Olvy((window.OlvyConfig||OlvyConfig).workspaceAlias);}});}catch(e){console.warn("[Olvy] - Ran into an issue initialising your widgets from Olvy Config",e);}})();