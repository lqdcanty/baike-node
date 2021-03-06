// version: 2017-12-14
    /**
    ** 版权关系链而设计。 
    */
  
    // Define the RGraph global variable
    RGraph         = window.RGraph || {isRGraph: true};
    RGraph.Drawing = RGraph.Drawing || {};
	RG = RGraph;
    RG.measureText =
    RG.MeasureText = function (text, bold, font, size, color)
    {
        // Add the sizes to the cache as adding DOM elements is costly and causes slow downs
        if (typeof RG.measuretext_cache === 'undefined') {
            RG.measuretext_cache = [];
        }

        var str = text + ':' + bold + ':' + font + ':' + size;
        if (typeof RG.measuretext_cache == 'object' && RG.measuretext_cache[str]) {
            return RG.measuretext_cache[str];
        }
        
        if (!RG.measuretext_cache['text-div']) {
            var div = document.createElement('DIV');
                div.style.position = 'absolute';
                div.style.top = '-100px';
                div.style.left = '-100px';
            document.body.appendChild(div);
            
            // Now store the newly created DIV
            RG.measuretext_cache['text-div'] = div;

        } else if (RG.measuretext_cache['text-div']) {
            var div = RG.measuretext_cache['text-div'];
        }

        div.innerHTML        = text.replace(/\r\n/g, '<br />');
        div.style.fontFamily = font;
        div.style.fontWeight = bold ? 'bold' : 'normal';
        div.style.fontSize   = (size || 12) + 'pt';
        div.style.color  = color;

        var size = [div.offsetWidth, div.offsetHeight];

        //document.body.removeChild(div);
        RG.measuretext_cache[str] = size;
        
        return size;
    };

    /**
    * The constructor. This function sets up the object. It takes the ID (the HTML attribute) of the canvas as the
    * first argument and the data as the second. If you need to change this, you can.
    * 
    */
    RGraph.Relation = function (conf)
    {
    
        // id, x, y, w, h
        this.id                = conf.id;
        this.canvas            = document.getElementById(this.id);

        this.context           = this.canvas.getContext('2d');
        this.colorsParsed      = false;
        this.canvas.__object__ = this;
        this.firstDraw         = true; // After the first draw this will be false
		this.parseConfObjectForOptions = true;
        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.relation';
        /**
        * This facilitates easy object identification, and should always be true
        */
        this.isRGraph = true;
		this.nodes = [];
		this.lineInfos = [];


        /**
        * This adds a uid to the object that you can use for identification purposes
        */
       // this.uid = RGraph.createUID();


        /**
        * This adds a UID to the canvas for identification purposes
        */
      //  this.canvas.uid = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();

        /**
        * Some example background properties
        */
        this.properties =
        {
             
        }
		
        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.relation] No canvas support');
            return;
        }
        this.width = this.canvas.width;
		this.height = this.canvas.height;
		
		imgArray = [
			"icon_dm.png",
			"icon_gs.png",
			"icon_gs_1.png",
			"icon_rw.png",
			"icon_rw_1.png",
			"icon_wz.png",
			"icon_xs.png",
			"icon_xx.png",
			"icon_yj.png",
			"icon_ys.png",
			"icon_yy.png",
			"img_bg.png",
			"img_bg_1.png",
			"img_bgsa.png",
			"img_bgsa_1.png",
			"img_gs.png",
			"img_gs_1.png",
			"img_rw.png",
			"img_rw_1.png",
			"img_bg_1a.png",
			"img_bga.png"
		];
		//节点间半径距离 ;
		this.radiusLength = 250;
		this.context.mozImageSmoothingEnabled = false;
		this.context.webkitImageSmoothingEnabled = false;
		this.context.msImageSmoothingEnabled = false;
		this.context.imageSmoothingEnabled = false;
		this.images = {};
		for(var i=0; i<imgArray.length; i++){
			
			var imgName = imgArray[i];
			var tempImg= new Image();
			tempImg.src ="../../images/bql/"+imgName;
			this.images[imgName]  = tempImg;
		}
		 
		//当前移动相对坐标 x,y
		this.relativeX=0;
		this.relativeY=0;
		//缩放比例 x
		this.zoom=1.0;
      
		//绘图数据
        this.data={};
        
        /**
        * Create the dollar object so that functions can be added to them
        */
        this.$0 = {};
		//存储鼠标按下按钮键后移动位置。 
		this.mouseMoveInfo={startPos:{"x":0,"y":0},endPos:{"x":0,"y":0}};

        /**
        * Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        * done already
        */
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            this.canvas.__rgraph_aa_translated__ = true;
        }



        // Short variable names
        var RG   = RGraph,
            ca   = this.canvas,
            co   = ca.getContext('2d'),
            prop = this.properties,
            win  = window,
            doc  = document,
            ma   = Math;
        
        
        
        /**
        * "Decorate" the object with the generic effects if the effects library has been included
        */
        if (RG.Effects && typeof RG.Effects.decorate === 'function') {
            RG.Effects.decorate(this);
        }




        /**
        * A setter method for setting graph properties. It can be used like this: obj.Set('chart.strokestyle', '#666');
        * 
        * @param name  string The name of the property to set
        * @param value mixed  The value of the property
        */
        this.set =
        this.Set = function (name)
        {
            var value = typeof arguments[1] === 'undefined' ? null : arguments[1];


            // Convert uppercase letters to dot+lower case letter
            while(name.match(/([A-Z])/)) {
                name = name.replace(/([A-Z])/, '.' + RegExp.$1.toLowerCase());
            }

            prop[name] = value;
    
            return this;
        };




        /**
        * A getter method for retrieving graph properties. It can be used like this: obj.Get('chart.strokestyle');
        * 
        * @param name  string The name of the property to get
        */
        this.get =
        this.Get = function (name)
        {
            /**
            * This should be done first - prepend the property name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }

            // Convert uppercase letters to dot+lower case letter
            while(name.match(/([A-Z])/)) {
                name = name.replace(/([A-Z])/, '.' + RegExp.$1.toLowerCase());
            }
    
            return prop[name.toLowerCase()];
        };

		//数据初始化
		this.init = function(){

		}
		
		this.setData = function(data){
			
			var newNodes = [];
            for(var i=0; i<data.length; i++){
                var node = {};
                node.id = i+"";
                node.isCurrentWork = i%4==0?true:false;
                node.name = data[i].name; //作品节点body内容说明，权利人节点WORK标题
                node.label=data[i].name;

                node.subLabel=[node.name]; //换回输出作品节点的body区域内容。 subLabel[1]为第2行
                if(data[i].title){
                    var str_length=Math.ceil(data[i].title.length/12);
                    console.log(str_length)
                    for(var j=0;j<str_length;j++){
                        node.subLabel.push(data[i].title.substring(12*j,12*(j+1)))
					}
				}


                node.subLabel[0] = node.name;  //换回输出作品节点的body区域内容。 subLabel[0]内容为第一行,
                node.typeName=data[i].workType;  //显示在作品类型节点 头部标题文字信息
                node.workType=data[i].workType;    //作品类型
                //节点类型： 作品节点WORK, 权利人节点 OBBLIGE
                node.nodeType=data[i].nodeType=='WORK'?"WORK":"OBBLIGE";
                node.obs={};
                //绘制到权利人节点 权利人信息. label[0]绘制到节点头; label[1],..label[n]依次绘制到权利人节点底部.
                node.obs.label = ['测试公司','权利归属公司2(权利归属公司11111111111111111111111111111)','畅元国讯北京科技有限公司'];
                node.obs.label[0] = node.name;  //权利人节点WORK标题
                //true,绘制所有权利人信息; false,只绘制权利人节点头部,绘制第一条权利人信息
                node.obs.showall = true;
                //权利人类型,company作为企业节点, people作为 自然人节点. 影响节点样式.
                node.obbligeType=i%4==1?"company":"people";
                //parentId为父节点Id
                newNodes[i] = node;
                if(i>0){
                    node.parentId = newNodes[(i-1)%4].id;
                    //node.parentId ="0";
                    // if(i==4){
                    //	node.parentId = "1";
                    //}
                }else{
                    node.parentId = null;
                }
            }
			
			this.nodes = newNodes;
            console.log(this.nodes)
		}
        /**
        * Draws the rectangle
        */
        this.draw =
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
           // RG.fireCustomEvent(this, 'onbeforedraw');
    
		    //test 
			//pa2(this.context, 'b r 0 0 50 50 f red');
            /**
            * This installs the event listeners
            */
          //  RG.installEventListeners(this);
    
            /**
            * Fire the onfirstdraw event
            */
            if (this.firstDraw) {
				this.init();
                this.firstDraw = false;
                //RG.fireCustomEvent(this, 'onfirstdraw');
                this.firstDrawFunc();
            }
			
			var nodes = this.nodes;
			this.computePosition();
			//生成
			for(var i = 0;  i<nodes.length ; i++){
				
				 this.drawNode(nodes[i]);				
			}
			
			this.drawLine();

            /**
            * Fire the ondraw event
            */
           // RG.fireCustomEvent(this, 'ondraw');

            return this;
        };
        
		this.computePosition = function(){
			
			if(this.nodes==null||this.nodes.length<1){
				return ;
			}
 

			for(var i = 0; i<this.nodes.length; i++){
				
				var node = this.nodes[i];
			    this.nodes[i] = this.computeNodePos(node);
			}
			
			this.computeCenterPos(this.nodes[0], this.width/2, this.height/2);
			//绘制中心坐标；
			for(var i = 1; i < this.nodes.length; i++){
				var  tn= this.nodes[i];
				var parentNode =  this.findNodeById(tn.parentId);
				if(parentNode == null){
					console.log("error, find parent node null !");
					continue;
				}
				
				var pcentx = parentNode.centerx;
				var pcenty = parentNode.centery;
				var tnAngle = parentNode.relateAngle[tn.id];
				
				var tnPos = this.getRadiusEndPoint(pcentx, pcenty, tnAngle, this.radiusLength);
				tn.centerx =  tnPos[0];
				tn.centery = tnPos[1];
				this.computeCenterPos(tn, tn.centerx, tn.centery);

			   }

			//设置划线坐标
			this.computeLine();
		}
		
		this.computeLine = function(){
			
			//绘制中心坐标；
			var lineInfo = [];
			for(var i = 0; i < this.nodes.length; i++){
				var  tn= this.nodes[i];
				var parentNode =  this.findNodeById(tn.parentId);
				if(parentNode == null){
					continue;
				}
				
				//父节点坐标
				var x1 = parentNode.centerx;
				var y1 = parentNode.centery;
				var tnAngle = parentNode.relateAngle[tn.id] ;
			
				var x2 = tn.centerx;
				var y2 = tn.centery;
				//父亲节点和当前节点直线为: y = (y2-y1)*x/(x2-x1)+(y1*x2-y2*x1)/(x2-x1)
				// x = (y -(y1*x2 -y2*x1)/(x2-x1)) * (x2-x1) /(y2-y1)
				var start= this.findStartPointByLine(x1, y1, x2, y2, tn);
				var end =  this.findEndPointByLine(x1, y1, x2, y2, parentNode);
				
				var line = {};
				line.centerx = x2;
				line.centery = y2;
				line.angle = tnAngle;
				line.content = tn.lineText;
				line.start = start;
				line.end = end;
				line.color = "#FF0000";
				
				
				 // text;
				 	//
				var textObj = {};
			 	var tempAngle = 0;
				if(start.x<end.x){
					textObj.start = start;
					textObj.end = end;
				}else if(start.x==end.x){
					if(start.y>end.y){
						textObj.start = start;
						textObj.end = end;						
					}else{
						textObj.start = end;
						textObj.end = start;
					}
				}else{
					textObj.start = end;
					textObj.end = start;					
				}
				if(end.x==start.x){
					tempAngle = 1.5*Math.PI;
				}else if(end.y == start.y){
					tempAngle = 0;
				}else{
					var ll = (end.y-start.y)/(end.x-start.x);
					tempAngle = Math.atan(ll);	
				}
							
				textObj.angle = tempAngle;
 				textObj.topy = 0;
				textObj.topx = 0;
				var ll = Math.pow((start.x -end.x),2) + Math.pow((start.y - end.y),2);
				textObj.width = Math.sqrt(ll);
				textObj.height = 20;
				textObj.textAlign = "center";
				textObj.textBaseline = "middle";
			
				textObj.label = line.content;
				
				//箭头绘制. 
				var arrow = {};
				if(end.x==start.x){
					if(end.y>start.y){
						arrow.angle = 0.5*Math.PI;
					}else{
						arrow.angle = 1.5*Math.PI;
					}
				}else{
					if(start.x>end.x){
						arrow.angle = Math.PI + textObj.angle;						
					}else{
						arrow.angle = textObj.angle;												
					}
				
				}				

				arrow.point1 = {};
				arrow.point1.x = textObj.width;
				arrow.point1.y = 0;
				arrow.point2 = {};
				arrow.point2.x = textObj.width - 6;
				arrow.point2.y = -5;
				arrow.point3 = {};
				arrow.point3.x = textObj.width - 6;
				arrow.point3.y = 5;
				line.arrow = arrow;
				//
				line.textObj = textObj;
				 //
				
				lineInfo.push(line);

			   }
			  
			   this.lineInfos = lineInfo;
		}
				
		this.drawLine = function(node){
			 
			var lines = this.lineInfos;
			var ctx = this.context;
			this.context.save();
			this.context.translate(this.relativeX,this.relativeY);	
				
			for(var i = 0; i<lines.length; i++){
				
				var line = lines[i];
				ctx.lineWidth = "1";  
				//起始一条路径，或重置当前路径  
				ctx.beginPath();  
				//设置画笔颜色  
				ctx.strokeStyle=line.color;  
				ctx.moveTo(line.start.x, line.start.y);
				ctx.lineTo(line.end.x, line.end.y); 
			 
				ctx.closePath();  
				//绘制已定义的路径  
				ctx.stroke(); 
				
				this.context.save();
				var to = line.textObj;
				ctx.translate(to.start.x, to.start.y);
				ctx.rotate(to.angle);
				this.drawTextObj(line.textObj, "14px Arial", "#FF0000");
				this.context.restore();
				
				//draw line
				this.context.save();
				var arrow = line.arrow;
				ctx.translate(line.start.x, line.start.y);
				ctx.rotate(arrow.angle);
				
				ctx.lineWidth = "1";  
				//起始一条路径，或重置当前路径  
				ctx.beginPath();  
				//设置画笔颜色  
				ctx.strokeStyle=line.color;  
				ctx.moveTo(arrow.point1.x, arrow.point1.y);
				ctx.lineTo(arrow.point2.x, arrow.point2.y); 
				ctx.lineTo(arrow.point3.x, arrow.point3.y); 
				ctx.lineTo(arrow.point1.x, arrow.point1.y); 
			 
				ctx.closePath();  
				//绘制已定义的路径  
				ctx.stroke(); 
 				this.context.restore();

			}	
	 
			this.context.restore();
		}
		
		//x1,y1 父节点，终节点； x2,y2 启始节点
		this.findEndPointByLine = function(x1, y1, x2, y2, tn){
			
     			var end ={};				
				if(y1==y2){
					if(x2>x1){
						end.x = tn.topx + tn.width;
					}else{
						end.x = tn.topx;
					}
					end.y = y1;
					return end;
				}
				
				if(x1==x2){
					
					end.x = x1;
 					if(y2>y1){
						end.y = tn.topy + tn.height;
					}else{
						end.y = tn.topy;
					}
					
					return end;
				}
				
				// 计算直线与矩形横线的交点;
				var y3 = y1+tn.height/2;	
				if(y2 < y1){
					y3 = y1 - tn.height/2;
				}
				var x3 =  (y3 -(y1*x2 -y2*x1)/(x2-x1)) * (x2-x1) /(y2-y1);
				if(x3+1 >= tn.topx &&  x3-1 <= tn.topx+tn.width){
					end.x = x3;
					end.y = y3;
					return end;
				}
				x3 =  tn.topx;
				if(x2>x1){
					x3 = tn.topx + tn.width;
				}
				y3 = (y2-y1)*x3/(x2-x1)+(y1*x2-y2*x1)/(x2-x1);
				
				end.x = x3;
				end.y = y3;
				
				return end;
		}
		
		this.findStartPointByLine = function(x1, y1, x2, y2, tn){
			
				//父亲节点和当前节点直线为: y = (y2-y1)*x/(x2-x1)+(y1*x2-y2*x1)/(x2-x1)
				// x = (y -(y1*x2 -y2*x1)/(x2-x1)) * (x2-x1) /(y2-y1)
				var start={};
				// 计算直线与矩形横线的交点;

				if(y1==y2){
					start.x = tn.topx;
					if(x2<x1){
						start.x = tn.topx + tn.width;
					}
					start.y = y1;
					return start;
				}
				
				if(x1==x2){
					
					start.x = x1;
					start.y = tn.topy;
					if(y2<y1){
						start.y = tn.topy + tn.height;
					}
					
					return start;
				}
				
				var y3 = y2-tn.height/2;	
				if(y2< y1){
					y3 = y2 + tn.height/2;
				}
				var x3 =  (y3 -(y1*x2 -y2*x1)/(x2-x1)) * (x2-x1) /(y2-y1);
				if(x3+1 >= tn.topx &&  x3-1 <= tn.topx+tn.width){
					
					start.x = x3;
					start.y = y3;
					
					return start;
				}
				
				x3 =  x2 + tn.width/2;
				if(x2>x1){
					x3 = x2 - tn.width/2;
				}
				y3 = (y2-y1)*x3/(x2-x1)+(y1*x2-y2*x1)/(x2-x1);
				
				start.x = x3;
				start.y = y3;
				
				return start;
		}
		
		
		//通过id查找节点;
		this.findNodeById = function(id){
			for(var i = 0; i<this.nodes.length; i++){
				
				var node = this.nodes[i];
				if(node.id == id){
					return node;
				}
			}				
				
			return null;
		}
		
		//计算每个节点的中心位置坐标及相对父亲节点弧度；
		// relatePos:相对上一个节点序号：1,2,3
		//stratAngle:相对父节点开始绘制第一个子节点角度；
		//relateAngle[id]: id节点相对父节点的弧度；
		this.computeNodePos = function(node){
			
			var parentId = node.parentId;
			var parentNode = this.findNodeById(parentId);
			var nodeId = node.id;
			node.relatePos = {};
			node.relateAngle = {};
			
			 //确定节点开始绘图角度；
			 if(parentNode!=null){
				var relatePos = parentNode.relatePos[nodeId];
				var relateAngle = parentNode.relateAngle[nodeId];
				node.startAngle = Math.PI + relateAngle;
			 }else{
				 
				 node.startAngle = -Math.PI/2; 
			 }
		    var total = 0;
			var relatePos = 1;
			//有父节点 关联度从1开始;没有的从0开始;
			if(parentNode!=null){
				total++;
				relatePos++;
			}
			//计算关联个数;
			for(var i = 0; i<this.nodes.length; i++){
				var  tn= this.nodes[i];
				if(tn.parentId == nodeId){
				   node.relatePos[tn.id] = relatePos;
				   relatePos++;
				   total++;
				}
			}				
			node.relateTotal = total;
			//确定弧度
		  	for(var i = 0; i<this.nodes.length; i++){
				var  tn = this.nodes[i];
				if(tn.parentId == nodeId){
					node.relateAngle[tn.id] = node.startAngle +  2*Math.PI*( node.relatePos[tn.id]-1)/node.relateTotal;						
				}
			}	
			//console.log(node.relateAngle);
			return node;
			
		}

		//圆心坐标计算  cx,cy ,
		//angle:角度
		//radius:半径
		this.getRadiusEndPoint = function (cx, cy, angle, radius)
		{
			var x = cx + (Math.cos(angle) * radius);
			var y = cy + (Math.sin(angle) * radius);
			
			return [x, y];
		}
	

		
        this.drawNode=function(node){
			var ctx = this.context;
			var width = node.width;
			var height = node.height;
			
			ctx.beginPath(); // 开始路径绘制
			ctx.fillStyle = 'yellow'; 
			//ctx.fillRect(topx, topy, width, height); 
			
			// 设置字体
			ctx.font = "Bold 20px Arial"; 
			// 设置对齐方式
			ctx.textAlign = "center";
			// 设置填充颜色
			ctx.fillStyle = "#008600"; 
			// 设置字体内容，以及在画布上的位置
			
			this.drawNodeBackGround(node);
			 

		}
		
		this.computeCenterPos = function(node, centx, centy){
			
			node.topx = centx;
			node.topy = centy;
			//第一次计算获取宽度;
			this.computePos(node);
			//第二次重新定位作为到中心位置. 
			node.topx = node.topx - node.width/2;
			node.topy = node.topy - node.height/2;
 			
			return this.computePos(node);
		}
		
        this.computePos = function(node){
			
			if(node.nodeType=='WORK'){
				return this.computeWorkPos(node);
 			}else if(node.nodeType=='OBBLIGE'){
				return this.computeOblsPos(node);
			}
			
			return node;
		}
		
		this.computeWorkPos = function(node){
			
				node.head=node.head||{};	
				var img = this.images["img_bg.png"];
				node.head=node.head||{};
				node.head.topx = node.topx;
				node.head.topy = node.topy;
				node.head.height = img.height;
				node.head.width = img.width;
				if(node.width==null){
					node.width = node.head.width;
				}
				node.head.img = img;
 
				//
				node.head.img1 = node.head.img1||{};
				node.head.body = node.head.body||{};
 			 
			     var measurements = RG.measureText(node.typeName, "bold", "Arial", "12px",'#FFFFFF');
				 var textWidth = measurements[0];
				 var textHeight = measurements[1];
				 //16*16 像素
				 img = null;
				 if(node.workType == '电影' || node.workType == '电视剧' || node.workType == '体育赛事' || node.workType == '综艺' || node.workType == '短视频' || node.workType == '纪录片'){
					img = this.images["icon_ys.png"];
				 }else if(node.workType=='录音制品' || node.workType == 'MV' || node.workType == '词谱' || node.workType == '曲谱' || node.workType == '词曲谱'){
					img = this.images["icon_yy.png"];
				 }else if(node.workType=='漫画' || node.workType == '动画片' || node.workType == '卡通电影'){
                     img = this.images["icon_dm.png"];
                 }else if(node.workType=='小说' || node.workType == '剧本' || node.workType == '诗歌' || node.workType == '杂志' || node.workType == '字体' || node.workType == '古籍文化' || node.workType == '其他'){
                     img = this.images["icon_wz.png"];
                 }else if(node.workType=='移动APP' || node.workType == '操作系统' || node.workType == 'PC软件'){
                     img = this.images["icon_yj.png"];
                 }
				 node.head.img1.img = null;
				 if(img!=null){
					var imgX = node.topx+(node.width-textWidth-img.width)/2;					 
					var imgY = node.topy+(node.head.height - img.height)/2;
 					node.head.img1.topx = imgX;
					node.head.img1.topy = imgY;
					node.head.img1.width = img.width;
					node.head.img1.height = img.height;
					node.head.img1.img = img;
					var textX = imgX+img.width;
					var textY = node.topy+node.head.height/2;
					
					node.head.body.label = node.typeName;
					node.head.body.topx = textX;
					node.head.body.topy = node.topy + (node.topy - textHeight)/2;
					node.head.body.centery = textY;
					node.head.body.width = textWidth;
					node.head.body.height = textHeight;

 				 }else{
					var textX = node.topx+node.width/2;
					var textY = node.topy+ node.head.height/2;
				 	node.head.body.label = node.typeName;
					node.head.body.topx = textX;
					node.head.body.topy = node.topy + (node.topy - textHeight)/2;
					node.head.body.centery = textY;
					node.head.body.width = textWidth;
					node.head.body.height = textHeight;
				 }
				node.head.body.textAlign="left";
				node.head.body.textBaseline = "middle";
				
				//body
				node.body = node.body||{};
				node.body.topx = node.topx;
				node.body.topy = node.topy+node.head.height;
				node.body.width = node.width;
				
			   if(node.isCurrentWork){
					img = this.images["img_bg_1a.png"];					
				}else{
					img = this.images["img_bga.png"];					
				}
				
				var tempHeight = 4+ this.getSubTextHeight()* node.subLabel.length;

				var items = [];
 				var topy  = node.body.topy + 2;
				for(var tt=0; tt<node.subLabel.length; tt++){
						
						var label = node.subLabel[tt];
						var item = {};
						item.label  = label;
						item.topx = node.body.topx;
						item.topy = node.body.topy + tt*this.getSubTextHeight();
						item.width = node.body.width;
						item.height = this.getSubTextHeight();
						item.centery = item.topy + item.height/2;
						item.centerx = item.topx + item.width/2;
						item.textAlign="center";

 						items[tt] = item;
					 
				}
				node.body.items = items;
				node.body.img = img;
				node.body.height = tempHeight;
				node.height = node.head.height+node.body.height+4;	
				node.centerx = node.topx + node.width/2;
				node.centery = node.topy + node.height/2;
				return node;
		}
		/**
		**  head : 5像素 + img1 + 5+body + 4 + tail+2;
		**/
		this.computeOblsPos = function(node){
			
				node.head = node.head||{};
				node.head.img1={};
				node.head.body ={};
				node.head.tail ={};
				node.body = node.body ||{};
				
				if(node.obbligeType=='people'){
 					node.head.img1.img=this.images["icon_gs.png"];
					//icon_gs_1.png
				}else{
 					node.head.img1.img=this.images["icon_rw.png"];
					//icon_rw_1.png
				}
				if(node.obs.label.length>1){
					if(node.obs.showall){
						node.head.tail.img = this.images["icon_xs.png"];
						node.body.img=this.images["img_bg_1a.png"];
					}else{
						//展开
						node.head.tail.img = this.images["icon_xx.png"];						
						node.body.img = null;
					}
				}else{
					node.head.tail.img = null;
					node.body.img=null;
				}
				
				var temp = node.obs.label[0];
				if(node.obs.label.length>1){
					temp+="("+node.obs.label.length+")";
				}
				node.head.body.label = temp;
				node.head.body.textAlign="left";
				node.head.textLength = this.getTextLength(node.head.body.label);
 				if(node.obs.label.length>1){
						var maxlen = this.findMaxTextLength(node.obs.label);
						node.body.maxTextLen = maxlen;
						maxlen = maxlen-4-node.head.tail.img.width - 20;
						if(maxlen>node.head.textLength){
							node.head.textLength = maxlen;
						}
				}
				node.head.width = 5+node.head.img1.img.width+5+node.head.textLength+2;
				if(node.head.tail.img!=null){
					node.head.width += node.head.tail.img.width +4;							
				}

				// head img
				node.head.img1.topx = node.topx +5;
				node.head.img1.topy = node.topy+2;
				node.head.img1.width = node.head.img1.img.width;
				node.head.img1.height = node.head.img1.img.height;

				//head
				node.head.img = this.images["img_bga.png"];
				node.head.topx = node.topx;
				node.head.topy = node.topy;
				node.head.height = this.getTextHeight()+4;
				//
				node.head.body.topx = node.head.img1.topx+ node.head.img1.width+5;
				node.head.body.topy  = node.head.topy;
				node.head.body.width = node.head.textLength;
				node.head.body.height = node.head.height;
				node.head.body.centery = node.head.body.topy+ node.head.body.height/2; 
 
				//
				if(node.head.tail.img!=null){
					node.head.tail.topx = node.head.body.topx+ node.head.body.width+2;
					node.head.tail.topy = node.head.topy + (node.head.height-node.head.tail.img.height)/2;
					node.head.tail.width = node.head.tail.img.width;
					node.head.tail.height = node.head.tail.img.height;
				}
				
				if(node.body.img!=null){
					node.body.topx = node.head.topx
					node.body.topy = node.head.topy+node.head.height;
					node.body.width = node.head.width;
					node.body.height = 8+ (node.obs.label.length-1)*this.getSubTextHeight();
				}
				
				node.width = node.head.width;
				node.height = node.head.height;
				if(node.body.img!=null){
					node.height += node.body.height;
				}
				var items = [];
				if(node.body.img!=null){
					var topy  = node.body.topy + 4;
					for(var tt=1; tt<node.obs.label.length; tt++){
						
						var label = node.obs.label[tt];
						var item = {};
						item.label  = label;
						item.topx = node.head.body.topx;
						item.topy = node.body.topy + (tt-1)*this.getSubTextHeight();

						//文本中最大长度值
						item.width = node.body.maxTextLen;
						item.height = this.getSubTextHeight();
						item.centery = item.topy + item.height/2;
						item.textAlign="left";
						items[tt-1] = item;
					}
				}

				node.body.items = items;
				
				node.centerx = node.topx + node.width/2;
				node.centery = node.topy  + node.height/2;
				
				return node;
		}
		
		this.findMaxTextLength = function(labels){
			 
			 var max = 0;
			 for(var i =1; i<labels.length; i++){
				  var len = this.getSubTextLength(labels[i]);
				  if(len>max){
					  max = len;
				  }
			 }
			 return max;
		}
					
		this.drawNodeBackGround=function(node){
				this.context.save();
				this.context.translate(this.relativeX,this.relativeY);	
				this.computePos(node);
			//作品
			if(node.nodeType=='WORK'){
			   this.drawWorks(node);
 			}else {
			//权利人
				this.drawObs(node);
			}
			this.context.restore();
		}
		this.drawWorks = function(node){
			
			    this.drawImg(node.head);
				this.drawImg(node.head.img1);
 				this.drawTextObj(node.head.body, "12px Arial", "#FFFFFF");
				 //body
				 this.drawImg(node.body);
			 
				for(var i = 0; i<node.body.items.length; i++){
					if(i==0){
                        this.drawTextObj(node.body.items[i], "12px Arial", "#333333");
					}else{
                        this.drawTextObj(node.body.items[i], "12px Arial", "#666666");
					}

				}
				 //
		}

		this.drawObs = function(node){
			var img = node.head.img;
			this.drawImg(node.head);
			this.drawImg(node.head.img1);
			this.context.font = "12px Arial";
			this.context.fillStyle="#000000";
 			//this.drawText(node.head.body.label, node.head.body.topx, node.head.body.centery);	
			this.drawTextObj(node.head.body, "12px Arial", "#000000");
			this.drawImg(node.head.tail);
			this.drawImg(node.body);
			for(var i = 0; i<node.body.items.length; i++){
				//权利人展开绘制；
				this.drawTextObj(node.body.items[i], "12px Arial", "#000000");
			}
		}
		
		this.drawImg = function(imgObj){
			if(imgObj==null||imgObj.img==null){
				return;
			}
			var img = imgObj.img;
			this.context.drawImage(img, 0,0, img.width, img.height, imgObj.topx, imgObj.topy, imgObj.width, imgObj.height);	
		}
		
		
		/**
		** topx,topy, width, heigth, centery, label;
		**
		**/
		this.drawTextObj = function(obj, font, fillStyle){
			if(obj==null||obj.label==null){
				return ;
			}
			this.context.textAlign="left";
			this.context.textBaseline = "middle";
			if(font!=null){
				this.context.font = font;
			}else{
				this.context.font = "12px Arial";
			}
			if(fillStyle!=null){
				this.context.fillStyle= fillStyle;
			}else{
				this.context.fillStyle="#000000";
			}
			if(obj.textAlign!=null){
				this.context.textAlign = obj.textAlign;
			}
			if(obj.textBaseline !=null){
				
				this.context.textBaseline = obj.textBaseline;
			}
			var rx = obj.topx;
 			if(this.context.textAlign == "center"){
				rx = obj.centerx;
				if(rx==null){
					rx = obj.topx+obj.width/2;
				}
			}
			if(obj.centery==null){
				obj.centery = obj.topy + obj.height/2;
			}
			
  			this.context.fillText(obj.label, rx, obj.centery);
		}
		
		this.drawText = function(content, topx, centy){
			this.context.textAlign="left";
			this.context.textBaseline = "middle";
 			this.context.fillText(content, topx, centy);
		}
		
		this.drawTextCenter = function(content, centx, centy){
			this.context.textAlign="center";
			this.context.textBaseline = "middle";
 			this.context.fillText(content, centx, centy);
		}
		
		this.getTextHeight = function(){
			
			 var m1 = RG.measureText("测试", "bold", "Arial", "12px", '#666666');
			 return m1[1]; 
		}
		
		this.getTextLength = function(content){
			var m1 = RG.measureText(content, "bold", "Arial", "12px", '#666666');
			 return m1[0]; 	
		}
		
	    this.getSubTextLength = function(content){
			var m1 = RG.measureText(content, "bold", "Arial", "12px", '#666666');
			 return m1[0]; 	
		}
		
	   this.getSubTextHeight = function(){
			
			 var m1 = RG.measureText("测试", "bold", "Arial", "12px", '#666666');
			 return m1[1]; 
		}
		
		this.mousedown = function(pageX, pageY){
			if(pageX<0){
				pageX = 0;
			}
			if(pageY<0){
				pageY = 0;
			}
			if(pageX>this.width){
				pageX = this.width;
			}
			if(pageY>this.height){
				pageY = this.height;
			}
			this.mouseMoveInfo.startPos = {"x":pageX, "y":pageY};
			this.mouseMoveInfo.endPos = {"x":pageX, "y":pageY};
			 
			this.isMousedown = true;
		};
		
		this.mouseup = function(pageX, pageY){
			this.isMousedown = false;
 			this.mouseMoveInfo.endPos = {x:pageX, y:pageY};
			this.computeRelativePos();
		};
		
		this.mousemove = function(pageX, pageY){
			
		
 			this.mouseMoveInfo.endPos = {x:pageX, y:pageY};
			if(this.isMousedown){
				this.computeRelativePos();				
			}
		};
 		
		this.computeRelativePos = function(){
				
			var offsetx =  this.mouseMoveInfo.endPos.x-this.mouseMoveInfo.startPos.x;			
 			this.relativeX += offsetx;				
			 
			var offsety =  this.mouseMoveInfo.endPos.y-this.mouseMoveInfo.startPos.y;
			this.relativeY += offsety;
			this.mouseMoveInfo.startPos.x = this.mouseMoveInfo.endPos.x;
			this.mouseMoveInfo.startPos.y = this.mouseMoveInfo.endPos.y;

						
			if(this.relativeX>this.width){
				//this.relativeX = this.width;
			}
			if(this.relativeX < -this.width){
				//this.relativeX = -this.width;
			}
			
			if(this.relativeY > this.height){
				//this.relativeY = this.height;
			}
			
			if(this.relativeY < -this.height){
				//this.relativeY  = -this.height;
			}
			if(offsetx!=0||offsety!=0){
				//alert("draw will be called relativeX:"+this.relativeX+",relativeY:"+this.relativeY);
				//this.context.clearRect(0,0,this.width, this.height);
				this.redraw();
			}
		}
		
		this.redraw = function(){
			
			    this.context.clearRect(0,0,this.width, this.height);
				this.draw();
		}
		/**
        * Used in chaining. Runs a function there and then - not waiting for
        * the events to fire (eg the onbeforedraw event)
        * 
        * @param function func The function to execute
        */
        this.exec = function (func)
        {
            func(this);
            
            return this;
        };

		


        /**
        * The getObjectByXY() worker method
        */
        this.getObjectByXY = function (e)
        {
            if (this.getShape(e)) {
                return this;
            }
        };




        /**
        * Not used by the class during creating the graph, but is used by event handlers
        * to get the coordinates (if any) of the selected bar
        * 
        * @param object e The event object
        * @param object   OPTIONAL You can pass in the bar object instead of the
        *                          function using "this"
        */
        this.getShape = function (e)
        {
            var mouseXY = RG.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1];
    
            for (var i=0,len=this.coords.length; i<len; i++) {
            
                var coords = this.coords[i];

                var left   = coords[0],
                    top    = coords[1],
                    width  = coords[2],
                    height = coords[3];
    
                if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height)) {
                    
                    return {
                        0: this, 1: left, 2: top, 3: width, 4: height, 5: 0,
                        'object': this, 'x': left, 'y': top, 'width': width, 'height': height, 'index': 0, 'tooltip': prop['chart.tooltips'] ? prop['chart.tooltips'][0] : null
                    };
                }
            }
            
            return null;
        };




        /**
        * Each object type has its own Highlight() function which highlights the appropriate shape
        * 
        * @param object shape The shape to highlight
        */
        this.highlight =
        this.Highlight = function (shape)
        {
            if (typeof prop['chart.highlight.style'] === 'function') {
                (prop['chart.highlight.style'])(shape);
            } else {
                RG.Highlight.rect(this, shape);
            }
        };




        /**
        * Use this function to reset the object to the post-constructor state. Eg reset colors if
        * need be etc
        */
        this.reset = function ()
        {
        };



        /**
        * This parses a single color value
        */
        this.parseSingleColorForGradient = function (color)
        {
            if (!color) {
                return color;
            }
    
            if (typeof color === 'string' && color.match(/^gradient\((.*)\)$/i)) {
    
                var parts = RegExp.$1.split(':'),
                    grad = co.createLinearGradient(0,0,ca.width,0),
                    diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        };




        /**
        * Using a function to add events makes it easier to facilitate method chaining
        * 
        * @param string   type The type of even to add
        * @param function func 
        */
        this.on = function (type, func)
        {
            if (type.substr(0,2) !== 'on') {
                type = 'on' + type;
            }
            
            if (typeof this[type] !== 'function') {
                this[type] = func;
            } else {
                RG.addCustomEventListener(this, type, func);
            }
    
            return this;
        };


	  this.click = function(pageX, pageY){
			
			if(pageX<0||pageX>this.width){
				return ;
			}
			
			if(pageY<0||pageY>this.height){
				return ;
			}
			
			for(var i = 0; i<this.nodes.length; i++){
				
				var node = this.nodes[i];
				if(node.nodeType!='OBBLIGE'){
					continue;
				}
				if(this.isInRange(node.head.tail, pageX, pageY)){
 					 node.obs.showall =  !node.obs.showall;
					 this.redraw();
				}				 
			}	
			
		};
		
	    this.dbclick = function(pageX, pageY){
			
			if(pageX<0||pageX>this.width){
				return ;
			}
			
			if(pageY<0||pageY>this.height){
				return ;
			}
			
			for(var i = 0; i<this.nodes.length; i++){
				
				var node = this.nodes[i];
				if(this.isInRange(node, pageX, pageY)){
					//alert("in node :"+i+",node name:"+node.name);
				}				 
			}
			
			
		}
		
		this.isInRange = function(node, pageX, pageY){
				
				pageX = pageX - this.relativeX;
				pageY = pageY - this.relativeY;
				if(pageX<node.topx){
					return false;
				}
				if(pageX>node.topx+node.width){
					return false;	
				}
				
				if(pageY< node.topy){
					return false;
				}
				if(pageY > node.topy+node.height){
					return false;
				}
				
				return true;
		}
        /**
        * This function runs once only
        * (put at the end of the file (before any effects))
        */
        this.firstDrawFunc = function ()
        {
        };




        /**
        * Objects are now always registered so that the chart is redrawn if need be.
        */
       // RG.register(this);

        /**
        * This is the 'end' of the constructor so if the first argument
        * contains configuration data - handle that.
        */
        if (this.arseConfObjectForOptions) {
         //   RG.parseObjectStyleConfig(this, conf.options);
        }
    };