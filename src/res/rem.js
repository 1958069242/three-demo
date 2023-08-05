window.onresize=function(){
  Resize();
}
Resize();
setTimeout(() => {
    Resize();
},200)

function Resize(){
  let sw=document.body.clientWidth || document.documentElement.clientWidth;
  let sh=document.body.clientHeight || document.documentElement.clientHeight;
  let defw=1920;
  let defh=1080;
  let xScale=sw/defw;
  let yScale=sh/defh;
  var style1=document.createElement('style');
  style1.innerHTML='#app{transform:scale('+xScale+','+yScale+')}';
  document.head.appendChild(style1);
 

}