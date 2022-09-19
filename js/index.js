var canvas = document.getElementById('canvas');		
var ctx = canvas.getContext('2d');
ctx.lineWidth = 1; 
ctx.strokeStyle="red";
var run = false;
var moduleList = [];
var path = [];
var $baseImg = '';
 
var $saveBtn = $("#saveBtn");
var $getDataBtn = $("#getDataBtn");
var $seeBtn = $("#seeBtn");
var $cover = $(".cover");
var $urlAddress = $('#urlAddress');
var $dec = $("#dec");
 
var $baseWidth = $('#width');
var $baseHeight = $('#height');
let pointIdx = 0;
 
 
canvas.onmousedown = function(e){
	//console.log(e.clientX);
	//console.log(e.offsetX);	
	pointIdx = 0;
	ctx.beginPath(); 
	ctx.moveTo(e.offsetX, e.offsetY);
	path.push({
		x:e.offsetX,
		y:e.offsetY
	});
	run = true;
}
 
canvas.onmousemove = function(e){
	//var x = e.offsetX;		
	pointIdx ++;
	if(run){
		ctx.lineTo(e.offsetX, e.offsetY); 
		ctx.stroke();
		//if(pointIdx%10 == 0){
			path.push({
				x:e.offsetX,
				y:e.offsetY
			});
		//}
	}
}
canvas.onmouseup = function(e){
	run = false;
	ctx.closePath();
	if(path.length > 10){
		$cover.removeClass('hide');
	}else{
		path = [];	
	}
}
 
 
//保存数据
$saveBtn.on('click', function (){
	console.log('saveData');
	var data = {
		"dec":"图片点击",
		"version":"1",
		"img":$baseImg,
		"module":moduleList,
		"baseWidth":$baseWidth.val(),
		"baseHeight":$baseHeight.val()
	}
	console.log(JSON.stringify(data));
	localStorage.setItem("data",JSON.stringify(data));
});

$seeBtn.on('click', function (){
	seeData(true);
});


//查看数据
function seeData(flag){
	var data = {
		"dec":"图片点击",
		"version":"1",
		"img":$baseImg,
		"module":moduleList,
		"baseWidth":$baseWidth.val(),
		"baseHeight":$baseHeight.val()
	}
	if(flag){
		console.log(JSON.stringify(data));
	}
	return data;
}
 
 
//图片背景
$('#imgload').on('change',function(){
		imgToBase64(this.files[0],function(result){
			console.log(result);
			var base64Data = 'url(' + result + ')';
			$(canvas).css({'background-image': base64Data});
			$baseImg = result;
		});
		
});
 
//转化为base64
function imgToBase64(file,callback){
	 var reader = new FileReader();
 
    reader.onload = function (e) {
        callback(e.target.result);
    };
    reader.readAsDataURL(file); // 读取完后会调用onload方法
}
 
//确认信息
$cover.on('click','.contain',function(){
	if($urlAddress.val() == ''){
		alert('地址不能为空');
	}else{
		moduleList.push({
			id:getName(),
			path:path,
			url:$urlAddress.val(),
			dec:$dec.val()
		});
		path = [];	
		$cover.addClass('hide');
	}
});
 
 
//修改高度和宽度
$baseWidth.on('change',function(){
	$(canvas).css({'width': $(this).val()});
});
$baseHeight.on('change',function(){
	$(canvas).css({'height': $(this).val()});
});
 
 
//随机获取名称
function getName(){
	var timer = new Date();
	var arr = JSON.stringify(timer).replace(/:|-|"/g ,'').split('.');
	var str = arr.join('');
	return str;
}
 
 
//导入模板
$getDataBtn.on('click', function (){
	var data = JSON.parse(localStorage.getItem("data"));
	if(data){
		moduleList = data.module;;
		$baseImg = data.img;
		drawn(data);
	}else{
		alert('没有模板数据.');
	}
});
 
//撤销
function reduo(){
	moduleList.pop();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawn(seeData());
}
 
 
//清除所有
function clearAll(){
	moduleList = [];
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
 
//给数据，画出来
function drawn(data){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
		var module = data.module;
		var base64Data = 'url(' + data.img + ')';
		$(canvas).css({'background-image': base64Data});
		$baseWidth.val(data.baseWidth);
		$baseHeight.val(data.baseHeight);
		$(canvas).css({'width': data.baseWidth,'height':data.baseHeight});
		
		//开始画
		for(var i = 0; i < module.length;i++){	
			var path = module[i].path;
			ctx.beginPath();
			ctx.moveTo(path[0].x, path[0].y); 
			for(var j = 1; j < path.length; j++){
				ctx.lineTo(path[j].x, path[j].y);
				ctx.stroke(); 	
			}
			ctx.closePath();	
		}
}
