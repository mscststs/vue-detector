export default {
  bind: function (el, binding){
    const SAFE = binding.modifiers.safe; // 是否安全模式

    if(binding.modifiers.anchor){
      el.dataset.anchor = "";
      return;
    }
    if(binding.modifiers.ignore){
      el.dataset.ignore = "";
      return;
    }

    el.onmousedown = function(e){
      if(e.target.closest('[data-ignore]')){
        return ;
      }
      // 检查祖先元素是否有 data-anchor
      if(!e.target.closest('[data-anchor]')){
        return ;
      }
      //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
      var divx = e.clientX - el.offsetLeft;
      var divy = e.clientY - el.offsetTop;
      //包含在onmousedown里，表示点击后才移动，为防止鼠标移出div，使用document.onmousemove
      document.onmousemove = function(e){
          //获取移动后div的位置：鼠标位置-divx/divy
          var l = e.clientX - divx;
          var t = e.clientY - divy;
          if(SAFE){ // 安全模式, 防止超出边界
            if(t <= 0){ //上边界
              el.style.top = 0+'px';
            }else if(t+el.getBoundingClientRect().height > window.innerHeight){ //下边界
              el.style.top = window.innerHeight-el.getBoundingClientRect().height+'px';
            }else{ //正常
              el.style.top = t+'px';
            }
            if(l <= 0){ //左边界
              el.style.left = 0+'px';
            }else if(l+el.getBoundingClientRect().width > window.innerWidth){ //右边界
              el.style.left = window.innerWidth-el.getBoundingClientRect().width+'px';
            }else{ //正常
              el.style.left = l+'px';
            }
          }else{
            el.style.top=t+'px';
            el.style.left=l+'px';
          }
      }
      document.onmouseup = function(){
          document.onmousemove = null;
          document.onmouseup = null;
      }
    }
  }
}