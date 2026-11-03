/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//****** SVGCanvas Object
		
function SVGCanvas(interact, width, height, flexiName, analogName, gifName, id, container, selectA, selectB, selectC) {
		'use strict';
		this.interact = interact;
		this.flexiName = flexiName;
		this.analogName = analogName;
        this.gifName = gifName;
		this.rootMatrix;
		this.svg;
		this.id = id;
		this.container = container;	
		this.width = width;
		this.height = height; 
        this.selectA = selectA;
        this.selectB = selectB;
        this.selectC = selectC;
    	var that = this,
		svgNS = 'http://www.w3.org/2000/svg',			
		xns="http://www.w3.org/1999/xlink",
		xhtml="http://www.w3.org/1999/xhtml",
		originalPoints = [],
		transformedPoints = [];
        
 		function linearGradient(id, x1, y1, offset1, stc1, x2, y2, offset2, stc2) {
            var linearGradientEl = document.createElementNS(svgNS, "linearGradient");
            linearGradientEl.setAttribute("id", id);
            linearGradientEl.setAttribute("x1", x1);            
            linearGradientEl.setAttribute("y1", y1);
            linearGradientEl.setAttribute("x2", x2);
            linearGradientEl.setAttribute("y2", y2);    
            
            var stop1 = document.createElementNS(svgNS, "stop");
            stop1.setAttribute("id", id+'st1');
            stop1.setAttribute("offset", offset1);
            stop1.setAttribute("stop-color", stc1);
            linearGradientEl.appendChild(stop1);
            
            var stop2 = document.createElementNS(svgNS, "stop");
            stop2.setAttribute("id", id+'st2');
            stop2.setAttribute("offset", offset2);
            stop2.setAttribute("stop-color", stc2);
            linearGradientEl.appendChild(stop2);            
            
            return linearGradientEl;
        }
        
		function polygon(points, id, fill, opacity, stroke, width) {
            var shape = document.createElementNS(svgNS,'polygon');
            shape.setAttributeNS(null, "points", points);
            shape.setAttributeNS(null,"id", id);
            shape.setAttributeNS(null,"fill", fill);
            shape.setAttributeNS(null,"fill-opacity", opacity);
            shape.setAttributeNS(null,"stroke", stroke);
            shape.setAttributeNS(null,"stroke-width", width);		
            return shape;
		}
		
	    function polyline(points, id, fill, opacity, stroke, width) {
            var shape = document.createElementNS(svgNS, "polyline");
            shape.setAttributeNS(null, "points", points);
            shape.setAttributeNS(null,"id", id);
            shape.setAttributeNS(null,"fill", fill);
            shape.setAttributeNS(null,"fill-opacity", opacity);
            shape.setAttributeNS(null,"stroke", stroke);
            shape.setAttributeNS(null,"stroke-width", width);
            shape.setAttributeNS(null,"marker-end", "url(#arrow-attack)");
            return shape;
		}
	
		function circle(r, x, y, id, fill, opacity, stroke, width) {
            var shape = document.createElementNS(svgNS, "circle");
            shape.setAttributeNS(null, "cx", x);
            shape.setAttributeNS(null, "cy", y);
            shape.setAttributeNS(null, "r",  r);
            shape.setAttributeNS(null, "fill",fill);
            shape.setAttributeNS(null, "fill-opacity", opacity);	
            shape.setAttributeNS(null,"stroke",stroke);		
            shape.setAttributeNS(null, "stroke-width",width);
            shape.dragX = 0;
            shape.dragY = 0;		
            shape.id = id;
            return shape;
		}
	
	 	function rect(x, y, width, height, fill, opacity, stroke, swidth, id) {
            var shape = document.createElementNS(svgNS, "rect");
            shape.setAttributeNS(null, "x", x);
            shape.setAttributeNS(null, "y", y);
            shape.setAttributeNS(null, "width",  width);
            shape.setAttributeNS(null, "height", height);
            shape.setAttributeNS(null, "fill",fill);
            shape.setAttributeNS(null, "fill-opacity", opacity);	
            shape.setAttributeNS(null,"stroke",stroke);		
            shape.setAttributeNS(null, "stroke-width",swidth);
            shape.dragX = 0;
            shape.dragY = 0;			
            shape.id = id;

            return shape;
		}
        
		function path(id, trace, opacity, fill, fillRule, stroke, strokeWidth, strokeLineCap, strokeMiterLimit, strokeDashOffset) {
            var shape = document.createElementNS(svgNS, "path");
            shape.setAttributeNS(null, "d", trace);
            shape.setAttributeNS(null, "opacity", opacity);
            shape.setAttributeNS(null, "fill", fill);
            shape.setAttributeNS(null, "fill-rule", fillRule);
            shape.setAttributeNS(null, "stroke", stroke);
            shape.setAttributeNS(null, "stroke-width", strokeWidth);
            shape.setAttributeNS(null, "stroke-linecap", strokeLineCap);
            shape.setAttributeNS(null, "stroke-miterlimit", strokeMiterLimit);
            shape.setAttributeNS(null, "stroke-dashoffset", strokeDashOffset);
            shape.dragX = 0;
            shape.dragY = 0;			
            shape.id = id;            
            return shape;
        }

		function group(id) {
            var groupEl = document.createElementNS(svgNS, 'g');
            groupEl.setAttribute('id',id);
            return groupEl;
		}
		
	 	function text(id) {
            var textEl = document.createElementNS(svgNS, 'text');
            textEl.setAttribute('id',id);
            return textEl;
		}
	
		function img(id, src, width, height, x, y) {
            var image = document.createElementNS(svgNS, 'image');
            image.setAttribute('id',id);
            image.setAttributeNS(xns,'xlink:href',src);
            image.setAttribute('href',src);
            image.setAttribute('width',width);
            image.setAttribute('height',height);
            image.setAttribute('x',x);
            image.setAttribute('y',y);            
            return image;
		}
        
        
	 	function foreign(id, width, height, x, y) {
            var foreignEl = document.createElementNS(svgNS, "foreignObject");
            foreignEl.setAttribute('id',id);
            foreignEl.setAttributeNS(null,'width',width);
            foreignEl.setAttributeNS(null,'height',height);
            foreignEl.setAttributeNS(null,'x', x);
            foreignEl.setAttributeNS(null,'y', y);
            return foreignEl;
		}
	
		function onChangeAction(event, clTarget) {
            var target = event.target;
            var idEl = target.getAttribute('class');
            var groupEl = document.getElementById(idEl);
            groupEl.setAttribute('data-signal', target.options[target.selectedIndex].value);
            var textEl = document.getElementById(idEl+clTarget);
            var selText = target.options[target.selectedIndex].text;
            if (textEl) {
            	textEl.textContent = selText;
            }
		}
	
		function addHtml(group, html, width, height, x, y, type, num) {
            var idEl = group.getAttribute('id');
            var idForeign = '';
            if (num) {
                idForeign = idEl+'f'+num;
            }
            else {
                idForeign = idEl+'f';
            }
            var foreignEl = foreign(idForeign,width,height,x,y);
            html.setAttribute('id',idEl+type);
            html.setAttribute('name',idEl+type);
            html.setAttribute('class',idEl);		
            html.setAttribute('xhtml',xhtml);
            foreignEl.appendChild(html);
            group.appendChild(foreignEl);
            return foreignEl;
		}
	
		function appendChild(node) {
			that.svg.appendChild(node);
		}
	
		function applyTransforms(event) {
            that.rootMatrix = that.svg.getScreenCTM();

            transformedPoints = originalPoints.map(function(point) {
                return point.matrixTransform(that.rootMatrix);
            });

            that.interact('.point-handle').snap({
                anchors: transformedPoints,
                range: 20 * Math.max(that.rootMatrix.a, that.rootMatrix.d)
            });
		}
	
	    function rotateEvent(handleRot, radius, elementCenter) {
            that.interact(handleRot).gestureable = that.interact(handleRot).draggable({
                    onstart: function (event) {
                        if (!that.rootMatrix) {
                            applyTransforms(event);
                        }
                        var target = document.getElementById(handleRot.getAttribute('data-parent'));
                        if (target.initAngle === null || target.initAngle === undefined || isNaN(target.initAngle)) {
                            var initX = 0, initY = 0, i = 0, len = target.points.numberOfItems;
                            while (i < len) {
                                var point = target.points.getItem(i);
                                if (i===0) {
                                    initX = point.x;
                                    initY = point.y;
                                }
                                if (i!==0 && i !== Math.floor(target.points.numberOfItems/2)) { 
                                    //rule of the cosenos, given three points, find the angle
                                    var p0c = Math.sqrt(Math.pow(elementCenter.pageX-initX,2)+ Math.pow(elementCenter.pageY-initY,2)); 
                                    var p1c = Math.sqrt(Math.pow(elementCenter.pageX-point.x,2)+Math.pow(elementCenter.pageY-point.y,2));
                                    var p0p1 = Math.sqrt(Math.pow(initX-point.x,2)+ Math.pow(initY-point.y,2));
                                    var cosVal = (p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c);
                                    cosVal = Math.max(-1, Math.min(1, cosVal));
                                    var initAngle = Math.acos(cosVal);
                                        
                                    var atan1Point = Math.atan2(elementCenter.pageY-initY,elementCenter.pageX-initX);
                                    var atan2Point = Math.atan2(elementCenter.pageY-point.y,elementCenter.pageX-point.x);                                                                                
                                        
                                    var diffAtan = atan2Point - atan1Point;
                                    var absAngle = Math.abs(diffAtan) * 180/Math.PI;
                                    if ((diffAtan < 0 &&  absAngle < 180) || (point.y < elementCenter.pageY && ( atan2Point < atan1Point)) || (point.y <= elementCenter.pageY && (atan1Point<0 && atan2Point > 0) && (atan2Point >= Math.PI))) {                                                                                
                                        initAngle = (2 * Math.PI) - initAngle;
                                    }                                        
                                    target.initAngle = initAngle;
                                } 
                                i+=1;
                            }
                        }
                    },
                    onmove : function (event) {        
                        var parent = document.getElementById(handleRot.getAttribute('data-parent')),
                        center = parent.points.getItem(Math.floor(parent.points.numberOfItems/2)),
                        centerX = center.x,
                        centerY = center.y,
                        baseAngle = parent.angle;
                            
			var i = 0, len = parent.points.numberOfItems;
                        while (i < len) {
                            var point = parent.points.getItem(i),
                            radiusP = Math.sqrt(Math.pow(centerX-point.x,2)+Math.pow(centerY -point.y,2)),
                            useP = document.getElementById(parent.getAttribute('id')+i);                            
                            if (i!==0 && i !== Math.floor(parent.points.numberOfItems/2)) { 
                                parent.angle += parent.initAngle;
                            }                                                                
                            point.x = (centerX + radiusP * Math.cos(parent.angle));
                            point.y = (centerY + radiusP * Math.sin(parent.angle));

                            useP.setAttribute('x', point.x);
                            useP.setAttribute('y', point.y);
                            useP.x.baseVal.value = point.x;
                            useP.y.baseVal.value = point.y; 
                                
                            if (i === 0) {
                                var foreign = document.getElementById(parent.parentNode.id+'f');
                                foreign.setAttribute('x',point.x-30);
                                foreign.setAttribute('y',point.y+5);
                            }
                            i+=1;
                        }
                        var rotX = parent.points.getItem(0).x + (10 * Math.cos(baseAngle));
                        var rotY = parent.points.getItem(0).y + (10 * Math.sin(baseAngle));
                        event.target.setAttribute('x', rotX);
                        event.target.setAttribute('y', rotY);
                        event.target.x.baseVal.value = rotX;                    
                        event.target.y.baseVal.value = rotY; 
                    },
                    onend  : function (event) {
                    }
                }).snap({
                mode : 'path',
                paths: [function (x, y) {
                    if (!that.rootMatrix) {
                        that.rootMatrix = that.svg.getScreenCTM();
                    }
                    var svgX = ((x - window.pageXOffset) - that.rootMatrix.e) / that.rootMatrix.a,
                    svgY = ((y - window.pageYOffset) - that.rootMatrix.f) / that.rootMatrix.d,
                    deltaX = svgX - elementCenter.pageX,
                    deltaY = svgY - elementCenter.pageY,
                    angle = Math.atan2(deltaY, deltaX),
                    parent = document.getElementById(handleRot.getAttribute('data-parent'));
                    parent.angle = angle;
                    return {
                        x: (elementCenter.pageX + radius * Math.cos(angle)) * that.rootMatrix.a + that.rootMatrix.e + window.pageXOffset,
                        y: (elementCenter.pageY + radius * Math.sin(angle)) * that.rootMatrix.d + that.rootMatrix.f + window.pageYOffset,
                        range: Infinity
                    };
                }]
            }); 
        }
        
    	function addHandles(item, unclon) {
            var initY = 0, initX = 0, i = 0, len = item.points.numberOfItems;
            while (i < len) {
                var handle = document.createElementNS(svgNS, 'use'),
                point = item.points.getItem(i),
                newPoint = that.svg.createSVGPoint(),
                id = item.getAttribute('id');					
                handle.setAttributeNS(xns, 'href', '#point-handle');
                handle.setAttribute('class', 'point-handle');
                handle.x.baseVal.value = newPoint.x = point.x;
                handle.y.baseVal.value = newPoint.y = point.y;
                handle.setAttribute('id', id+i);
                handle.setAttribute('data-parent', id);
                handle.setAttribute('data-index',i);
                if (i===0) {
                    initX = point.x;
                    initY = point.y;
                }                
                if (i===1 && item.points.numberOfItems === 3) {
                    var handleRot = document.getElementById(id+'rot');
                    if (!handleRot) {
                        var handleRot = document.createElementNS(svgNS, 'use');
                        handleRot.setAttributeNS(xns, 'href', '#point-rotation');
                        handleRot.setAttribute('class', 'point-rotation');
                        
                        var angle = Math.atan2(point.y-initY,point.x-initX);

                        handleRot.x.baseVal.value = initX - (10 * Math.cos(angle));                    
                        handleRot.y.baseVal.value = initY - (10 * Math.sin(angle));                        
                                    
                        handleRot.setAttribute('id', id+'rot');
                        handleRot.setAttribute('data-parent', id);
                        appendChild(handleRot);
                        var elementCenter  = { pageX: point.x, pageY: point.y };
                        var radius =Math.sqrt(Math.pow(elementCenter.pageX-handleRot.x.baseVal.value,2) + Math.pow(elementCenter.pageY-handleRot.y.baseVal.value,2));
                        rotateEvent(handleRot,radius, elementCenter);
                    }
                }                

                originalPoints.push(newPoint);
                appendChild(handle);
				i+=1;
            }
            if (unclon) {
            	var i = 0;
                while (i < item.points.numberOfItems) {				
                    var node = document.getElementById(item.getAttribute('id') + i);
                    if (i % 2 === 0) {
                            node.setAttribute('data-unclon','1');
                    }
                    i+=1;
                }					
            }
		}
	
		function redoPoints() {
            originalPoints = [];
            var nodes = document.getElementsByTagName('use');
            var nodesArray = Array.prototype.slice.call(nodes,0);
            nodesArray.forEach(function(node) {
                if (node.getAttribute('class') === "point-handle") {
                    var newPoint = that.svg.createSVGPoint();
                    newPoint.x = parseFloat(node.getAttribute('x')) || node.x.baseVal.value;
                    newPoint.y = parseFloat(node.getAttribute('y')) || node.y.baseVal.value;
                    originalPoints.push(newPoint);
                }
            });
            that.interact('.point-handle').snap({
                    anchors: originalPoints,
                    range: 10
            });					
		}
	
		function addEvents(item) {	
            that.interact(item).gestureable = that.interact(item).draggable({
                onstart : function (event) {
                    if (!that.rootMatrix) {
                        applyTransforms(event);
                    }
                    that.svg.setAttribute('class', 'dragging');
                },
                onmove: function (event) {
                    if (!that.rootMatrix) {
                        that.rootMatrix = that.svg.getScreenCTM();
                    }
                    var target = event.target;
                    var groupNode = target;
                    while (groupNode && groupNode.parentNode && groupNode.parentNode.getAttribute && groupNode.parentNode.getAttribute('id') !== that.id) {
                        groupNode = groupNode.parentNode;
                    }
                    if (!groupNode || groupNode === that.svg) {
                        groupNode = target;
                    }
                    if (isNaN(groupNode.dragX)) groupNode.dragX = 0;
                    if (isNaN(groupNode.dragY)) groupNode.dragY = 0;
                    
                    var scaleX = (that.rootMatrix && that.rootMatrix.a) ? that.rootMatrix.a : 1;
                    var scaleY = (that.rootMatrix && that.rootMatrix.d) ? that.rootMatrix.d : 1;
                    groupNode.dragX += event.dx / scaleX;
                    groupNode.dragY += event.dy / scaleY;
                    groupNode.setAttribute('transform', ['translate(', groupNode.dragX, groupNode.dragY, ')'].join(' '));
                },
                onend: function (event) {
                    that.svg.setAttribute('class', '');
                }
            });
		}
	
		function addHandlesEvents(item) {	
            that.interact(item).gestureable = that.interact(item).draggable({
                onstart : function (event) {
                    if (!that.rootMatrix) {
                        applyTransforms(event);
                    }
                    that.svg.setAttribute('class', 'dragging');

                },
                onmove: function (event) {
                    if (!that.rootMatrix) {
                        that.rootMatrix = that.svg.getScreenCTM();
                    }
                    var target = event.target;
                    var parentId = target.parentNode.getAttribute('id');
                    var fY = 0, fX = 0;
                    if (parentId !== that.id) {
                        var foreign = document.getElementById(parentId+'f');
                        var x = parseFloat(foreign.getAttribute('x'));
                        var y = parseFloat(foreign.getAttribute('y'));
                        x += event.dx / that.rootMatrix.a;
                        y += event.dy / that.rootMatrix.d;
                        foreign.setAttribute('x',x);
                        foreign.setAttribute('y',y);
                    }
					var i = 0;
                    while (i < target.points.numberOfItems) {
                        var point = target.points.getItem(i);
                        var useP = document.getElementById(target.getAttribute('id')+i);

                        point.x += event.dx / that.rootMatrix.a;
                        point.y += event.dy / that.rootMatrix.d;

                        useP.setAttribute('x', point.x);
                        useP.setAttribute('y', point.y);
                        useP.x.baseVal.value = point.x;
                        useP.y.baseVal.value = point.y;                                                             
                        i +=1;
                    }                    
                    
                    var useRot = document.getElementById(target.getAttribute('id')+'rot');  
                    if (useRot) {
                        var curRotX = useRot.getAttribute('x') !== null ? parseFloat(useRot.getAttribute('x')) : useRot.x.baseVal.value;
                        var curRotY = useRot.getAttribute('y') !== null ? parseFloat(useRot.getAttribute('y')) : useRot.y.baseVal.value;
                        var newX = curRotX + event.dx / that.rootMatrix.a;
                        var newY = curRotY + event.dy / that.rootMatrix.d;

                        useRot.setAttribute('x',newX);
                        useRot.setAttribute('y',newY);
                        useRot.x.baseVal.value = newX;
                        useRot.y.baseVal.value = newY;
                    }            
                    redoPoints();
                },
                onend: function (event) {
                    that.svg.setAttribute('class', '');
                    var handleRot = document.getElementById(event.target.getAttribute('id')+'rot');
                    if (handleRot) {
                        var target = event.target;
                        var newY = 0, newX = 0, i = 0;
                        while (i <= Math.floor(target.points.numberOfItems/2)) {
                            var point = target.points.getItem(i);

                            if (i === 0) {
                                newY = point.y;   
                                newX = point.x;
                            }

                            if (i === Math.floor(target.points.numberOfItems/2)) {                         
                                var angle = Math.atan2(point.y-newY,point.x-newX),
                                elementCenter  = { pageX: point.x, pageY: point.y };
                                newX = newX - (10 * Math.cos(angle));                    
                                newY = newY - (10 * Math.sin(angle));                                
                                    
                                var radius = Math.sqrt(Math.pow(elementCenter.pageX-newX,2) + Math.pow((elementCenter.pageY - newY),2));
                                rotateEvent(handleRot,radius, elementCenter);
                            }
                            i+=1;
                        } 
                    }
                }
        	});		
		}
	
		function addGeneralEvents() {
            that.interact(that.svg)
                .on('down', function(e) { applyTransforms(e) })
                .on('pointerdown', function(e) { applyTransforms(e) })
                .on('mousedown', function(e) { applyTransforms(e) })
                .on('touchstart', function(e) { applyTransforms(e) });	

            that.interact('.point-handle').gestureable = that.interact('.point-handle')
            .draggable({
                onstart: function (event) {
                    if (!that.rootMatrix) {
                        applyTransforms(event);
                    }
                    that.svg.setAttribute('class', 'dragging');
                },
                onmove: function (event) {
                    if (!that.rootMatrix) {
                        that.rootMatrix = that.svg.getScreenCTM();
                    }
                    var target = event.target;
                    var i = parseInt(target.getAttribute('data-index'),10) || 0;
                    var parent = target.getAttribute('data-parent');
                    var parentEl = document.getElementById(parent);
                    var point = parentEl.points.getItem(i);

                    point.x += event.dx / that.rootMatrix.a;
                    point.y += event.dy / that.rootMatrix.d;

                    target.setAttribute('x', point.x);
                    target.setAttribute('y', point.y);
                    target.x.baseVal.value = point.x;
                    target.y.baseVal.value = point.y;

                    if (parent.indexOf(that.flexiName) !== -1) {
                        if (i===0) {
                            var foreignId = parentEl.parentNode.id + 'f',
                            foreignEl = document.getElementById(foreignId);
                            foreignEl.setAttribute('x',point.x-30);
                            foreignEl.setAttribute('y',point.y+5);   
                            
                            var useRot = document.getElementById(parent+'rot');  
                            if (useRot) {
                                var center = parentEl.points.getItem(Math.floor(parentEl.points.numberOfItems/2)),
                                angle = Math.atan2(center.y-point.y,center.x-point.x),
                                newX = point.x - (10 * Math.cos(angle)),
                                newY = point.y - (10 * Math.sin(angle));
                                useRot.setAttribute('x',newX);
                                useRot.setAttribute('y',newY);
                                useRot.x.baseVal.value = newX;
                                useRot.y.baseVal.value = newY;

                                var radius = Math.sqrt(Math.pow(center.x-newX,2)+Math.pow(center.y -newY,2));
                                var elementCenter  = { pageX: center.x, pageY: center.y };
                                rotateEvent(useRot, radius, elementCenter);
                            }
                        }
                    }

                },
                onend: function (event) {
                    that.svg.setAttribute('class', '');

                    var index = parseInt(event.target.getAttribute('data-index'),10)|| 0,
                        parent = event.target.getAttribute('data-parent'),
                        item = document.getElementById(parent),
                        points = item.points,                        
                        originalNumberOfPoints = points.numberOfItems,
                        point = points.getItem(index),
                        x = 0,
                        y = 0,
                        insertBefore = 0,
                        pointAfter = null,
                        pointBefore = null,
                        unclonable = event.target.getAttribute('data-unclon') || "";

                    if ((item.nodeName === "polyline") && (event.dx !== 0) && (event.dy !== 0)) {							
                        if (index !== 0 && index !== (points.numberOfItems -1) && unclonable === "") {
                            pointAfter = points.getItem(index+1);
                            pointBefore = points.getItem(index-1);
                            insertBefore = index+1;	

                            var newPoint = that.svg.createSVGPoint(), newPoint2 = that.svg.createSVGPoint();

                            x = (0.5 * (point.x + pointAfter.x));
                            y = (0.5 * (point.y + pointAfter.y));

                            newPoint.x = x;
                            newPoint.y = y;
                            item.points.insertItemBefore(newPoint,insertBefore);

                            x = (0.5 * (point.x + pointBefore.x));
                            y = (0.5 * (point.y + pointBefore.y));

                            newPoint2.x = x;
                            newPoint2.y = y;							
                            item.points.insertItemBefore(newPoint2,index);

                            that.removeNodes(originalNumberOfPoints,parent);
                            var handleRot = document.getElementById(item.id+'rot');
                            if (handleRot) {
                                that.svg.removeChild(handleRot);
                            }
                            addHandles(item, true);
                            redoPoints();                            
                        }								
                    }
                    item.initAngle = null;
                }
            })
            .snap({
                    mode: 'anchor',
                    anchors: originalPoints,
                    range: 10
            })
            .styleCursor(true);	
            
        	that.interact(that.svg).on('dblclick',function(event) { 		   
                var target = event.target.correspondingUseElement || event.target;
                if (target.id !== that.id) {
                    if (target.getAttribute('class') === 'point-handle') {
                        var parent = target.getAttribute('data-parent');
                        var item = document.getElementById(parent);
                        var numberOfItems = item.points.numberOfItems;
                        var indice = parseInt(target.getAttribute('data-index'), 10);
                        if (indice !== 0 && indice !== (numberOfItems - 1)) {
                            that.removeNodes(numberOfItems, item.id);
                            item.points.removeItem(indice);
                            var handleRot = document.getElementById(item.id+'rot');
                            if (handleRot) {
                                that.svg.removeChild(handleRot);
                            }
                            addHandles(item);
                            redoPoints();

                        }
                    }
                    else if (target.getAttribute('class') === 'point-rotation') {
                        that.svg.removeChild(target);
                    }
                    else {
                        if (target.parentNode.id !== that.id) {
                            if (target.parentNode.id.indexOf(that.flexiName) !== -1) {
                                var parentId = target.parentNode.getAttribute('id');
                                var flexiLine = document.getElementById(parentId+'pl');
                                that.removeNodes(flexiLine.points.numberOfItems, parentId+'pl');
                                var rot = document.getElementById(parentId+'plrot');
                                if (rot) {
                                    that.svg.removeChild(rot);
                                }
                                that.removeChild(target.parentNode);                                
                            }
                            else {
                            	var parentName = target.classList.item(0) || target.getAttribute('class');
                            	if (parentName !== undefined && parentName !== null && parentName !== "") { 
                            		var nodeTargetToRemove = document.getElementById(parentName);
                                	if (nodeTargetToRemove) {
                                		that.removeChild(nodeTargetToRemove);
                                	}
                                }
                            }
                        }
                    }
                }
                document.body.style.cursor = "default";
            });    
        }
        
        this.removeNodes = function(numberOfNodes, parentId) {
        	var i = 0;
            while (i < numberOfNodes) {				
                var node = document.getElementById(parentId + i);
                if (node) {
                    that.removeChild(node);
                }
                i +=1;
            }
		}
		
        this.removeChild = function(node) {
			that.svg.removeChild(node);
		}
		
    	this.toPrint = function() {
            var svgToPrint = document.getElementById(that.container).cloneNode(true);
            var removable = svgToPrint.querySelectorAll('.point-handle, .point-rotation, foreignObject, .delete');
            Array.prototype.forEach.call(removable, function(node) {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            });
            return svgToPrint.innerHTML;
        }
        
		this.analogBox = function(id, groupRecovered) { 
            var groupSVG;
            var bx = 560, by = 470;
            if (groupRecovered) {
                groupSVG = groupRecovered;
                var rChild = groupSVG.querySelector('rect');
                if (rChild) {
                    bx = parseFloat(rChild.getAttribute('x')) || 560;
                    by = parseFloat(rChild.getAttribute('y')) || 470;
                }
            }
            else {
                id = that.analogName+id;
                groupSVG = group(id);		
                groupSVG.setAttribute('data-signal',0);
                var abox = rect(bx,by,126,36,"#1b2330","0.92","#d4af37","2",id+'r');
                abox.setAttributeNS(null, "rx", "6");
                abox.setAttributeNS(null, "ry", "6");
                abox.setAttribute('class',groupSVG.id);
                groupSVG.appendChild(abox);
                               
            }
            
            var html = that.selectB.cloneNode(true);
            if (html !== undefined) {
                html.addEventListener('change',function(e) { onChangeAction(e,'label') });
                addHtml(groupSVG, html, 114,24,bx+6,by+6,'s');
            }	
                            
            appendChild(groupSVG);
            addEvents(groupSVG.firstChild);
            if (groupRecovered) {
            	var optionNumber = parseInt(groupSVG.getAttribute('data-signal'),10);
            	groupSVG.querySelector('foreignObject').firstChild.options[optionNumber].selected = 'selected';
            }
            return groupSVG;
		}
	
		this.flexyLine = function(id, primaryColor, secundaryColor, groupRecovered) { 
            var groupSVG;                        
            
            if (groupRecovered) {
                groupSVG = groupRecovered;
                if (groupSVG.firstChild) {
                    groupSVG.firstChild.setAttributeNS(null, "marker-end", "url(#arrow-attack)");
                }
            }
            else {
                id = that.flexiName+id;
                groupSVG = group(id);
                groupSVG.setAttribute('data-signal',0);
                var flex = polyline("575, 485, 625, 485, 675, 485", id+'pl',"none","1",primaryColor, "4");
                flex.setAttributeNS(null,"stroke-linejoin", "round");
                flex.setAttributeNS(null,"stroke-linecap", "round");
                flex.setAttribute('data-primary',primaryColor);
                if (secundaryColor === "") {
                    flex.setAttribute('data-secundary','#C8C8D2');
                }
                else  {
                    flex.setAttribute('data-secundary',secundaryColor);
                }
                flex.angle = 0;
                groupSVG.appendChild(flex); 
            }
            var html = that.selectA.cloneNode(true);
            if (html !== undefined) {
                var x=0, y=0;
                html.addEventListener('change',function(e) { onChangeAction(e)});
                if (groupRecovered){
                    var point = groupSVG.firstChild.points.getItem(0);
                    x = point.x - 30;
                    y = point.y + 5;
                }
                else {
                    x = 545;
                    y = 490;
                }
                addHtml(groupSVG, html,115,24,x,y,'s');
            }
            appendChild(groupSVG);
            addHandles(groupSVG.firstChild, false);
            addHandlesEvents(groupSVG.firstChild);
            if (groupRecovered) {
            	var optionNumber = parseInt(groupSVG.getAttribute('data-signal'),10);
            	groupSVG.querySelector('foreignObject').firstChild.options[optionNumber].selected = 'selected';
            }
            return groupSVG;
		}
        
        
		this.imageEle = function(id, groupRecovered, src, src2, x, y, width, height, addText) {
            var groupSVG;
            var selX = 15, selY = 0;
            if (groupRecovered) {
                groupSVG = groupRecovered;
                var srcRec = groupSVG.getAttribute('image-source1');
                var images = groupSVG.querySelectorAll('image');
                Array.prototype.forEach.call(images, function(image) {
                    image.setAttributeNS(xns, 'xlink:href', srcRec);
                    image.setAttribute('href', srcRec);
                });
                var imgChild = images[0];
                var rx = imgChild ? (parseFloat(imgChild.getAttribute('x')) || 60) : 60;
                var ry = imgChild ? (parseFloat(imgChild.getAttribute('y')) || 60) : 60;
                var rw = imgChild ? (parseFloat(imgChild.getAttribute('width')) || 60) : 60;
                var rh = imgChild ? (parseFloat(imgChild.getAttribute('height')) || 92) : 92;

                var fImag = document.createElement('img');
                fImag.src = srcRec;
                fImag.style.width = rw + 'px';
                fImag.style.height = rh + 'px';
                fImag.style.display = 'block';
                fImag.style.cursor = 'move';
                var frgn = addHtml(groupSVG, fImag, rw, rh, rx, ry, 'img', 1);
                addEvents(frgn);
                selX = rx - 10;
                selY = Math.max(0, ry - 26);
            }
            else {
                id = that.gifName+id;
                groupSVG = group(id);		
                groupSVG.setAttribute('data-signal',0);
                groupSVG.setAttribute('image-source1',src);
                
                var fImag = document.createElement('img');
                fImag.src = src;
                fImag.style.width = width + 'px';
                fImag.style.height = height + 'px';
                fImag.style.display = 'block';
                fImag.style.cursor = 'move';
                var frgn = addHtml(groupSVG, fImag, width, height, x, y, 'img', 1); 
                addEvents(frgn);   
                var imgEl = img(id+'img', src, width, height, x, y);  
                imgEl.setAttribute('class', id);
                imgEl.style.cursor = 'move';
                groupSVG.appendChild(imgEl);
                addEvents(imgEl);
                selX = x - 10;
                selY = Math.max(0, y - 26);
            }
                                   
            var html = that.selectC.cloneNode(true);
            if (html !== undefined) {
                html.addEventListener('change',function(e) { onChangeAction(e,'label') });
                addHtml(groupSVG, html, 130, 24, selX, selY, 's', 2);
            }		
            appendChild(groupSVG);
            var imgNode = groupSVG.querySelector('image');
            if (imgNode) {
                addEvents(imgNode);
            }
            if (groupRecovered) {
            	var optionNumber = parseInt(groupSVG.getAttribute('data-signal'),10) || 0;
            	var selects = groupSVG.querySelectorAll('foreignObject select');
            	var selNode = selects[selects.length - 1];
            	if (selNode && selNode.options[optionNumber]) {
            		selNode.options[optionNumber].selected = 'selected';
            	}
            }
            return groupSVG;
		}	
		
        var CLASS_PRESETS = {
            paladin: {
                name: 'Paladín', bg: '#1e3a8a', border: '#fbbf24',
                paths: [
                    { d: 'M 0 -17 L 14 -11 L 14 2 C 14 12 0 18 0 18 C 0 18 -14 12 -14 2 L -14 -11 Z', fill: '#1d4ed8', stroke: '#fbbf24', sw: 2 },
                    { d: 'M 0 -12 L 0 12 M -8 -2 L 8 -2', fill: 'none', stroke: '#fef08a', sw: 3 }
                ]
            },
            mago: {
                name: 'Mago', bg: '#3b0764', border: '#c084fc',
                paths: [
                    { d: 'M -16 8 L 0 -18 L 16 8 Z', fill: '#6b21a8', stroke: '#e9d5ff', sw: 2 },
                    { d: 'M -20 8 Q 0 14 20 8 Q 0 4 -20 8 Z', fill: '#581c87', stroke: '#e9d5ff', sw: 2 },
                    { d: 'M 0 -6 L 2 -1 L 7 -1 L 3 2 L 4 7 L 0 4 L -4 7 L -3 2 L -7 -1 L -2 -1 Z', fill: '#fde047', stroke: 'none', sw: 0 }
                ]
            },
            hechicero: {
                name: 'Hechicero', bg: '#7f1d1d', border: '#f97316',
                paths: [
                    { d: 'M 0 -19 C 8 -8 15 -2 13 8 C 11 16 -11 16 -13 8 C -15 -2 -8 -8 0 -19 Z', fill: '#ea580c', stroke: '#fde047', sw: 1.8 },
                    { d: 'M 0 -8 C 5 -2 7 3 5 9 C 4 13 -4 13 -5 9 C -7 3 -5 -2 0 -8 Z', fill: '#fef08a', stroke: 'none', sw: 0 }
                ]
            },
            guerrero: {
                name: 'Guerrero', bg: '#7f1d1d', border: '#f87171',
                paths: [
                    { d: 'M -13 -13 L 13 13 M -16 10 L -10 16 M 13 -13 L -13 13 M 10 16 L 16 10', fill: 'none', stroke: '#e2e8f0', sw: 3.5 },
                    { d: 'M 0 -9 L 8 0 L 0 9 L -8 0 Z', fill: '#b91c1c', stroke: '#fca5a5', sw: 2 }
                ]
            },
            picaro: {
                name: 'Pícaro', bg: '#111827', border: '#10b981',
                paths: [
                    { d: 'M -14 -4 Q 0 -14 14 -4 Q 10 6 0 4 Q -10 6 -14 -4 Z', fill: '#065f46', stroke: '#34d399', sw: 1.8 },
                    { d: 'M -8 -4 L -3 -4 M 3 -4 L 8 -4', fill: 'none', stroke: '#a7f3d0', sw: 2.5 },
                    { d: 'M 0 1 L 4 16 L 0 13 L -4 16 Z', fill: '#cbd5e1', stroke: '#94a3b8', sw: 1 }
                ]
            },
            clerigo: {
                name: 'Clérigo', bg: '#78350f', border: '#fde047',
                paths: [
                    { d: 'M 0 -17 L 4 -6 L 15 -6 L 6 1 L 10 12 L 0 5 L -10 12 L -6 1 L -15 -6 L -4 -6 Z', fill: '#eab308', stroke: '#fef9c3', sw: 1.5 },
                    { d: 'M -5 0 A 5 5 0 1 0 5 0 A 5 5 0 1 0 -5 0', fill: '#fef08a', stroke: '#ca8a04', sw: 1.5 }
                ]
            },
            explorador: {
                name: 'Explorador', bg: '#14532d', border: '#4ade80',
                paths: [
                    { d: 'M -8 -16 C 10 -10 10 10 -8 16', fill: 'none', stroke: '#a16207', sw: 3 },
                    { d: 'M -8 -16 L -8 16', fill: 'none', stroke: '#d9f99d', sw: 1.2 },
                    { d: 'M -14 0 L 14 0 M 8 -5 L 14 0 L 8 5', fill: 'none', stroke: '#86efac', sw: 2.5 }
                ]
            },
            barbaro: {
                name: 'Bárbaro', bg: '#451a03', border: '#fb923c',
                paths: [
                    { d: 'M 0 -16 L 0 17', fill: 'none', stroke: '#a16207', sw: 3.5 },
                    { d: 'M -15 -12 Q -3 -4 -15 6 Q -6 8 0 0 Q 6 8 15 6 Q 3 -4 15 -12 Q 6 -14 0 -6 Q -6 -14 -15 -12 Z', fill: '#cbd5e1', stroke: '#f8fafc', sw: 1.5 }
                ]
            },
            bardo: {
                name: 'Bardo', bg: '#701a75', border: '#f472b6',
                paths: [
                    { d: 'M -10 -14 C -14 0 -10 14 0 14 C 10 14 14 0 10 -14', fill: 'none', stroke: '#f472b6', sw: 2.8 },
                    { d: 'M -13 -14 L 13 -14', fill: 'none', stroke: '#fbcfe8', sw: 2.5 },
                    { d: 'M -4 -14 L -4 13 M 0 -14 L 0 14 M 4 -14 L 4 13', fill: 'none', stroke: '#fde047', sw: 1.2 }
                ]
            },
            druida: {
                name: 'Druida', bg: '#064e3b', border: '#2dd4bf',
                paths: [
                    { d: 'M 0 -16 C 14 -8 14 8 0 16 C -14 8 -14 -8 0 -16 Z', fill: '#0d9488', stroke: '#99f6e4', sw: 2 },
                    { d: 'M 0 -13 L 0 14 M 0 -2 L 7 -7 M 0 4 L -7 -1', fill: 'none', stroke: '#ccfbf1', sw: 2 }
                ]
            },
            monje: {
                name: 'Monje', bg: '#0c4a6e', border: '#38bdf8',
                paths: [
                    { d: 'M 0 -14 A 14 14 0 1 0 0 14 A 14 14 0 1 0 0 -14', fill: '#0284c7', stroke: '#bae6fd', sw: 2 },
                    { d: 'M 0 -14 A 7 7 0 0 1 0 0 A 7 7 0 0 0 0 14 A 14 14 0 0 1 0 -14 Z', fill: '#e0f2fe', stroke: 'none', sw: 0 }
                ]
            },
            brujo: {
                name: 'Brujo', bg: '#2e1065', border: '#a855f7',
                paths: [
                    { d: 'M -16 0 Q 0 -14 16 0 Q 0 14 -16 0 Z', fill: '#4c1d95', stroke: '#d8b4fe', sw: 2 },
                    { d: 'M 0 -6 C 3 -6 3 6 0 6 C -3 6 -3 -6 0 -6 Z', fill: '#f0abfc', stroke: '#fae8ff', sw: 1.5 }
                ]
            },
            trasgo: {
                name: 'Trasgo', bg: '#3f6212', border: '#a3e635',
                paths: [
                    { d: 'M -18 -8 L -9 -4 L -9 6 L 0 12 L 9 6 L 9 -4 L 18 -8 L 10 -12 L 0 -10 L -10 -12 Z', fill: '#65a30d', stroke: '#ecfccb', sw: 1.8 },
                    { d: 'M -6 -2 L -2 0 M 6 -2 L 2 0', fill: 'none', stroke: '#ef4444', sw: 2.5 }
                ]
            },
            orco: {
                name: 'Orco', bg: '#14532d', border: '#84cc16',
                paths: [
                    { d: 'M -13 -8 L 13 -8 L 11 10 L 0 14 L -11 10 Z', fill: '#3f6212', stroke: '#bef264', sw: 1.8 },
                    { d: 'M -9 10 L -6 2 L -3 10 M 9 10 L 6 2 L 3 10', fill: '#fef9c3', stroke: '#ca8a04', sw: 1.2 },
                    { d: 'M -7 -3 L -2 -1 M 7 -3 L 2 -1', fill: 'none', stroke: '#ef4444', sw: 2.5 }
                ]
            },
            kobold: {
                name: 'Kobold', bg: '#7c2d12', border: '#fb923c',
                paths: [
                    { d: 'M -11 -16 L -5 -6 L 5 -6 L 11 -16 L 9 4 L 0 14 L -9 4 Z', fill: '#c2410c', stroke: '#fed7aa', sw: 1.6 },
                    { d: 'M -5 0 L -2 2 M 5 0 L 2 2', fill: 'none', stroke: '#fde047', sw: 2.2 }
                ]
            },
            bandido: {
                name: 'Bandido', bg: '#1f2937', border: '#9ca3af',
                paths: [
                    { d: 'M -14 -4 L 14 -4 L 10 12 L 0 16 L -10 12 Z', fill: '#991b1b', stroke: '#fca5a5', sw: 1.5 },
                    { d: 'M -15 -4 L 15 -4', fill: 'none', stroke: '#e5e7eb', sw: 3 },
                    { d: 'M -7 -8 L -3 -8 M 3 -8 L 7 -8', fill: 'none', stroke: '#f8fafc', sw: 2.2 }
                ]
            },
            cultista: {
                name: 'Cultista', bg: '#31102f', border: '#e879f9',
                paths: [
                    { d: 'M 0 -17 L 14 4 L 9 14 L -9 14 L -14 4 Z', fill: '#4a044e', stroke: '#f0abfc', sw: 1.8 },
                    { d: 'M 0 -9 L 6 8 L -6 8 Z', fill: '#090b10', stroke: '#c084fc', sw: 1.2 },
                    { d: 'M -3 3 L -1 3 M 1 3 L 3 3', fill: 'none', stroke: '#ef4444', sw: 2 }
                ]
            },
            esqueleto: {
                name: 'Esqueleto', bg: '#27272a', border: '#d4d4d8',
                paths: [
                    { d: 'M -11 -4 A 11 10 0 1 1 11 -4 L 7 12 L -7 12 Z', fill: '#52525b', stroke: '#f4f4f5', sw: 2 },
                    { d: 'M -5 -4 L -3 -4 M 3 -4 L 5 -4 M -4 7 L 4 7', fill: 'none', stroke: '#18181b', sw: 2.8 }
                ]
            },
            zombi: {
                name: 'Zombi', bg: '#1e293b', border: '#65a30d',
                paths: [
                    { d: 'M -11 -4 A 11 10 0 1 1 11 -4 L 8 12 L -8 12 Z', fill: '#4d7c0f', stroke: '#bef264', sw: 1.8 },
                    { d: 'M -6 -4 L -2 -4 M 3 -5 L 6 -2 M 6 -5 L 3 -2 M -5 7 Q 0 4 5 8', fill: 'none', stroke: '#1a2e05', sw: 2.2 }
                ]
            },
            vampiro: {
                name: 'Vampiro', bg: '#2a0815', border: '#f43f5e',
                paths: [
                    { d: 'M -16 -12 L -7 -4 L 7 -4 L 16 -12 L 12 10 L 0 16 L -12 10 Z', fill: '#881337', stroke: '#fda4af', sw: 1.6 },
                    { d: 'M -6 4 L -3 11 L 0 4 M 6 4 L 3 11 L 0 4', fill: '#ffffff', stroke: '#e11d48', sw: 1 },
                    { d: 'M -6 -2 L -2 0 M 6 -2 L 2 0', fill: 'none', stroke: '#fb7185', sw: 2.2 }
                ]
            },
            liche: {
                name: 'Liche', bg: '#0f172a', border: '#22d3ee',
                paths: [
                    { d: 'M -12 -8 L -8 -17 L -3 -10 L 0 -18 L 3 -10 L 8 -17 L 12 -8 Z', fill: '#eab308', stroke: '#fef08a', sw: 1.5 },
                    { d: 'M -9 -8 L 9 -8 L 7 12 L -7 12 Z', fill: '#334155', stroke: '#67e8f9', sw: 1.8 },
                    { d: 'M -5 -2 L -2 -2 M 2 -2 L 5 -2', fill: 'none', stroke: '#22d3ee', sw: 3 }
                ]
            },
            lobo: {
                name: 'Lobo / Huargo', bg: '#1f2937', border: '#94a3b8',
                paths: [
                    { d: 'M -13 -16 L -7 -5 L 7 -5 L 13 -16 L 14 2 L 0 15 L -14 2 Z', fill: '#475569', stroke: '#cbd5e1', sw: 1.8 },
                    { d: 'M -6 0 L -2 2 M 6 0 L 2 2 M -3 10 L 3 10', fill: 'none', stroke: '#facc15', sw: 2.2 }
                ]
            },
            arana: {
                name: 'Araña Gigante', bg: '#18181b', border: '#a855f7',
                paths: [
                    { d: 'M -17 -10 L -6 -2 M -18 0 L -6 0 M -17 10 L -6 4 M 17 -10 L 6 -2 M 18 0 L 6 0 M 17 10 L 6 4', fill: 'none', stroke: '#d8b4fe', sw: 2 },
                    { d: 'M 0 -10 A 6 6 0 1 0 0 2 A 6 6 0 1 0 0 -10 M 0 0 A 8 9 0 1 0 0 16 A 8 9 0 1 0 0 0', fill: '#3b0764', stroke: '#e9d5ff', sw: 1.6 },
                    { d: 'M -3 -5 L -1 -5 M 1 -5 L 3 -5', fill: 'none', stroke: '#ef4444', sw: 2 }
                ]
            },
            mimico: {
                name: 'Mímico', bg: '#451a03', border: '#f59e0b',
                paths: [
                    { d: 'M -14 -10 L 14 -10 L 14 10 L -14 10 Z', fill: '#78350f', stroke: '#fbbf24', sw: 2 },
                    { d: 'M -14 0 L 14 0', fill: 'none', stroke: '#1c1917', sw: 3 },
                    { d: 'M -10 -1 L -7 4 L -4 -1 L -1 4 L 2 -1 L 5 4 L 8 -1 L 11 4', fill: '#fef3c7', stroke: 'none', sw: 0 },
                    { d: 'M 0 2 C 4 8 10 14 6 17 C 2 18 -2 10 0 2 Z', fill: '#ec4899', stroke: '#f43f5e', sw: 1.2 }
                ]
            },
            cubo: {
                name: 'Cubo Gelatinoso', bg: '#064e3b', border: '#34d399',
                paths: [
                    { d: 'M -13 -13 L 13 -13 L 13 13 L -13 13 Z', fill: '#10b981', stroke: '#a7f3d0', sw: 2 },
                    { d: 'M -8 -8 L 8 -8 L 8 8 L -8 8 Z', fill: 'none', stroke: '#d1fae5', sw: 1.2 },
                    { d: 'M -5 -3 L 5 5 M 5 -3 L -3 5', fill: 'none', stroke: '#ecfdf5', sw: 2 }
                ]
            },
            troll: {
                name: 'Ogro / Troll', bg: '#365314', border: '#f97316',
                paths: [
                    { d: 'M -14 -8 A 14 12 0 1 1 14 -8 L 12 12 L -12 12 Z', fill: '#4d7c0f', stroke: '#fdba74', sw: 2 },
                    { d: 'M -2 -3 L 0 4 L 2 -3', fill: '#fb923c', stroke: '#9a3412', sw: 1.2 },
                    { d: 'M -8 -4 L -4 -4 M 4 -4 L 8 -4 M -7 8 L 7 8', fill: 'none', stroke: '#fef08a', sw: 2.4 }
                ]
            },
            contemplador: {
                name: 'Contemplador', bg: '#4c1d95', border: '#e879f9',
                paths: [
                    { d: 'M -8 -10 L -15 -17 M 0 -12 L 0 -19 M 8 -10 L 15 -17 M -11 -4 L -18 -8 M 11 -4 L 18 -8', fill: 'none', stroke: '#f0abfc', sw: 2.2 },
                    { d: 'M 0 -11 A 12 12 0 1 0 0 13 A 12 12 0 1 0 0 -11', fill: '#701a75', stroke: '#f5d0fe', sw: 2 },
                    { d: 'M 0 -6 A 5 5 0 1 0 0 4 A 5 5 0 1 0 0 -6', fill: '#fef08a', stroke: '#dc2626', sw: 1.8 },
                    { d: 'M -7 7 Q 0 12 7 7', fill: 'none', stroke: '#ffffff', sw: 2 }
                ]
            },
            azotamentes: {
                name: 'Azotamentes', bg: '#312e81', border: '#818cf8',
                paths: [
                    { d: 'M 0 -15 A 10 9 0 1 1 0.1 -15 Z', fill: '#4f46e5', stroke: '#c7d2fe', sw: 1.8 },
                    { d: 'M -6 1 C -10 8 -12 14 -8 16 M -2 2 C -4 9 -4 15 -2 17 M 2 2 C 4 9 4 15 2 17 M 6 1 C 10 8 12 14 8 16', fill: 'none', stroke: '#a5b4fc', sw: 2.2 },
                    { d: 'M -5 -6 L -2 -5 M 5 -6 L 2 -5', fill: 'none', stroke: '#fde047', sw: 2.2 }
                ]
            },
            demonio: {
                name: 'Demonio', bg: '#450a0a', border: '#ef4444',
                paths: [
                    { d: 'M -8 -8 C -16 -16 -18 -4 -10 0 M 8 -8 C 16 -16 18 -4 10 0', fill: 'none', stroke: '#fca5a5', sw: 2.8 },
                    { d: 'M -10 -8 L 10 -8 L 7 13 L 0 17 L -7 13 Z', fill: '#dc2626', stroke: '#fecaca', sw: 1.8 },
                    { d: 'M -5 -1 L -2 1 M 5 -1 L 2 1', fill: 'none', stroke: '#fef08a', sw: 2.4 }
                ]
            },
            elemental: {
                name: 'Elemental', bg: '#0c4a6e', border: '#38bdf8',
                paths: [
                    { d: 'M 0 -18 L 12 0 L 0 18 L -12 0 Z', fill: '#0284c7', stroke: '#e0f2fe', sw: 2 },
                    { d: 'M 0 -10 L 6 0 L 0 10 L -6 0 Z', fill: '#7dd3fc', stroke: '#ffffff', sw: 1.2 }
                ]
            },
            dragon: {
                name: 'Dragón / Jefe', bg: '#450a0a', border: '#f59e0b',
                paths: [
                    { d: 'M -16 -15 L -8 -4 L -15 6 L 0 16 L 15 6 L 8 -4 L 16 -15 L 5 -8 L 0 -14 L -5 -8 Z', fill: '#dc2626', stroke: '#fde047', sw: 2 }
                ]
            }
        };

        this.heroToken = function(id, classKey, customName, groupRecovered) {
            var groupSVG;
            var cx = 637.5, cy = 487.5;
            if (groupRecovered) {
                groupSVG = groupRecovered;
                var baseCircle = groupSVG.querySelector('circle');
                if (baseCircle) {
                    cx = parseFloat(baseCircle.getAttribute('cx')) || 637.5;
                    cy = parseFloat(baseCircle.getAttribute('cy')) || 487.5;
                }
            }
            else {
                var preset = CLASS_PRESETS[classKey] || CLASS_PRESETS.paladin;
                var displayTitle = customName ? customName : preset.name;
                id = that.gifName + id;
                groupSVG = group(id);
                groupSVG.setAttribute('data-signal', 0);
                groupSVG.setAttribute('data-class', classKey);
                groupSVG.setAttribute('data-name', displayTitle);

                // Diámetro 72px (radio 36px) para encajar exactamente en una casilla de 75x75px de la rejilla
                var outerRing = circle(36, cx, cy, id + 'ring', preset.bg, "0.95", preset.border, "3");
                outerRing.setAttribute('class', id);
                outerRing.style.cursor = 'move';
                groupSVG.appendChild(outerRing);

                var innerRing = circle(30, cx, cy, id + 'iring', "none", "0", "rgba(255,255,255,0.22)", "1.2");
                innerRing.setAttribute('class', id);
                innerRing.style.pointerEvents = 'none';
                groupSVG.appendChild(innerRing);

                preset.paths.forEach(function(pSpec, idx) {
                    var iconPath = document.createElementNS(svgNS, 'path');
                    iconPath.setAttribute('d', pSpec.d);
                    iconPath.setAttribute('transform', 'translate(' + cx + ',' + (cy - 3) + ') scale(1.22)');
                    iconPath.setAttribute('fill', pSpec.fill);
                    iconPath.setAttribute('stroke', pSpec.stroke);
                    iconPath.setAttribute('stroke-width', pSpec.sw);
                    iconPath.setAttribute('stroke-linecap', 'round');
                    iconPath.setAttribute('stroke-linejoin', 'round');
                    iconPath.setAttribute('class', id);
                    iconPath.style.pointerEvents = 'none';
                    groupSVG.appendChild(iconPath);
                });

                var badgeBg = rect(cx - 36, cy + 21, 72, 16, "#0b0d13", "0.92", preset.border, "1.2", id + 'bbg');
                badgeBg.setAttributeNS(null, "rx", "4");
                badgeBg.setAttributeNS(null, "ry", "4");
                badgeBg.setAttribute('class', id);
                badgeBg.style.pointerEvents = 'none';
                groupSVG.appendChild(badgeBg);

                var nameTxt = text(id + 'ntxt');
                nameTxt.setAttribute('x', cx);
                nameTxt.setAttribute('y', cy + 32);
                nameTxt.setAttribute('text-anchor', 'middle');
                nameTxt.setAttribute('fill', '#f8fafc');
                nameTxt.setAttribute('font-size', '10.5');
                nameTxt.setAttribute('font-weight', 'bold');
                nameTxt.setAttribute('font-family', 'Cinzel, Georgia, serif');
                nameTxt.setAttribute('class', id);
                nameTxt.style.pointerEvents = 'none';
                nameTxt.textContent = displayTitle;
                groupSVG.appendChild(nameTxt);
            }

            var html = that.selectC.cloneNode(true);
            if (html !== undefined) {
                html.addEventListener('change', function(e) { onChangeAction(e, 'label'); });
                addHtml(groupSVG, html, 115, 24, cx - 57.5, cy - 64, 's', 2);
            }
            appendChild(groupSVG);
            addEvents(groupSVG.firstChild);
            if (groupRecovered) {
                var optionNumber = parseInt(groupSVG.getAttribute('data-signal'), 10) || 0;
                var selNode = groupSVG.querySelector('foreignObject select');
                if (selNode && selNode.options[optionNumber]) {
                    selNode.options[optionNumber].selected = 'selected';
                }
            }
            return groupSVG;
        };

		this.spellArea = function(id, radiusVal, colorVal, labelVal, groupRecovered) {
            var groupSVG;
            if (groupRecovered) {
                groupSVG = groupRecovered;
            }
            else {
                id = 'D' + id;
                groupSVG = group(id);
                groupSVG.setAttribute('data-signal', '1');
                var areaCircle = circle(radiusVal, 637.5, 487.5, id + 'c', colorVal, "0.28", colorVal, "2.5");
                areaCircle.setAttributeNS(null, "stroke-dasharray", "8,4");
                areaCircle.setAttribute('class', groupSVG.id);
                groupSVG.appendChild(areaCircle);

                var labelEl = text(id + 'lbl');
                labelEl.setAttribute('x', 637.5);
                labelEl.setAttribute('y', 492);
                labelEl.setAttribute('text-anchor', 'middle');
                labelEl.setAttribute('fill', '#ffffff');
                labelEl.setAttribute('font-size', '12');
                labelEl.setAttribute('font-family', 'Cinzel, Georgia, serif');
                labelEl.setAttribute('class', groupSVG.id);
                labelEl.style.pointerEvents = 'none';
                labelEl.textContent = labelVal || 'Área';
                groupSVG.appendChild(labelEl);
            }
            appendChild(groupSVG);
            addEvents(groupSVG.firstChild);
            return groupSVG;
        }

		this.refresh = function() {
		    this.svg = document.getElementById(this.id);
            var defs = document.getElementById('definitions');
            if (defs && !document.getElementById('arrow-attack')) {
                that.ensureExtraDefs(defs);
            }
            var groups = document.getElementsByTagName('g'),
            groupsArray = Array.prototype.slice.call(groups,0); 
            groupsArray.forEach(function(groupItem) {                
                if (groupItem.id.indexOf(that.flexiName) !== -1) {
                    that.flexyLine(groupItem.id, null, null, groupItem);
                }
                else  {
					if (groupItem.id.indexOf(that.analogName) !== -1) {
                        that.analogBox(groupItem.id, groupItem);
                    }
                    else if (groupItem.id.indexOf(that.gifName) !== -1) {                        
                        if (groupItem.getAttribute('data-class')) {
                            that.heroToken(groupItem.id, groupItem.getAttribute('data-class'), groupItem.getAttribute('data-name'), groupItem);
                        } else {
                            that.imageEle(groupItem.id, groupItem);
                        }                        
                    }
                    else if (groupItem.id.indexOf('D') === 0) {
                        that.spellArea(groupItem.id, null, null, null, groupItem);
                    }                     
                    if (groupItem.transform.baseVal.numberOfItems > 0) {
                        var mat = groupItem.transform.baseVal.getItem(0).matrix;
                        groupItem.dragX = mat.e;
                        groupItem.dragY = mat.f;
                        if (groupItem.firstChild) {
                            groupItem.firstChild.dragX = mat.e;
                            groupItem.firstChild.dragY = mat.f;
                        }
                    }
                }
            }); 
            addGeneralEvents();
		}

        this.ensureExtraDefs = function(defs) {
            var marker = document.createElementNS(svgNS, 'marker');
            marker.setAttribute('id', 'arrow-attack');
            marker.setAttribute('viewBox', '0 0 10 10');
            marker.setAttribute('refX', '7');
            marker.setAttribute('refY', '5');
            marker.setAttribute('markerWidth', '5');
            marker.setAttribute('markerHeight', '5');
            marker.setAttribute('orient', 'auto');
            var arrowPath = document.createElementNS(svgNS, 'path');
            arrowPath.setAttribute('d', 'M 0 1 L 10 5 L 0 9 z');
            arrowPath.setAttribute('fill', '#38bdf8');
            marker.appendChild(arrowPath);
            defs.appendChild(marker);

            var gridPattern = document.createElementNS(svgNS, 'pattern');
            gridPattern.setAttribute('id', 'dnd-grid-pattern');
            gridPattern.setAttribute('width', '75');
            gridPattern.setAttribute('height', '75');
            gridPattern.setAttribute('patternUnits', 'userSpaceOnUse');
            var gridPath = document.createElementNS(svgNS, 'path');
            gridPath.setAttribute('d', 'M 75 0 L 0 0 0 75');
            gridPath.setAttribute('fill', 'none');
            gridPath.setAttribute('stroke', 'rgba(0, 0, 0, 0.65)');
            gridPath.setAttribute('stroke-width', '1.5');
            gridPattern.appendChild(gridPath);
            defs.appendChild(gridPattern);
        };

        this.toggleGrid = function(show) {
            var gridRect = document.getElementById('dnd-grid-overlay');
            if (!gridRect) {
                var defs = document.getElementById('definitions');
                if (defs && !document.getElementById('dnd-grid-pattern')) {
                    that.ensureExtraDefs(defs);
                }
                gridRect = rect(0, 0, that.width, that.height, "url(#dnd-grid-pattern)", "1", "none", "0", "dnd-grid-overlay");
                gridRect.setAttribute('class', 'delete');
                gridRect.style.pointerEvents = 'none';
                if (that.svg.firstChild) {
                    that.svg.insertBefore(gridRect, that.svg.firstChild.nextSibling);
                } else {
                    appendChild(gridRect);
                }
            }
            gridRect.style.display = show ? 'block' : 'none';
        };
		
        //Constructor
        if (!document.getElementById(this.id)) {
            this.svg = document.createElementNS(svgNS, 'svg');
            this.svg.id = this.id;
            this.svg.setAttribute('viewBox', '0 0 1250 975');
            this.svg.setAttribute('width', this.width);
            this.svg.setAttribute('height', this.height);
            this.svg.setAttribute('xmlns', svgNS);
            this.svg.setAttribute('xmlns:xlink',xns);
            this.svg.setAttribute('preserveAspectRatio','xMinYMax meet');
            if (this.container === undefined) { 
                document.body.appendChild(this.svg);
            }
            else {
                var container = document.getElementById(this.container);
                container.appendChild(this.svg);
            }
            var defs = document.createElementNS(svgNS, 'defs');	
            defs.setAttribute('id','definitions');
            var newCircle = circle(4,0,0,"point-handle","#ffffff","0.85","#d4af37","2");
            defs.appendChild(newCircle);
	    	var rotcircle = circle(5,0,0, "point-rotation", "#f97316", "0.9", "#ffffff", "2");
	    	defs.appendChild(rotcircle);
            this.ensureExtraDefs(defs);
	    	appendChild(defs);
	    	addGeneralEvents();
        }	
        else {
        	this.refresh();
        }			
       
}


