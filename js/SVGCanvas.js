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
	
        function logGroupCombatAction(groupEl) {
            if (!groupEl || typeof window.addLog !== 'function') return;
            var idEl = groupEl.getAttribute('id') || '';
            var actionSel = document.getElementById(idEl + 's');
            var selText = (actionSel && actionSel.selectedIndex >= 0) ? actionSel.options[actionSel.selectedIndex].text : '';
            if (!selText || selText === '...') return;

            var actorName = groupEl.getAttribute('data-actor') || '';
            var targetName = groupEl.getAttribute('data-target') || '';

            if (idEl.indexOf(that.flexiName) === 0) {
                if (actorName && targetName) {
                    window.addLog('⚔️ <b>' + actorName + '</b> ataca a <b>' + targetName + '</b> con <b>' + selText + '</b>.');
                } else if (actorName) {
                    window.addLog('⚔️ <b>' + actorName + '</b> realiza ataque: <b>' + selText + '</b>.');
                } else if (targetName) {
                    window.addLog('⚔️ Ataque <b>' + selText + '</b> contra <b>' + targetName + '</b>.');
                } else {
                    window.addLog('⚔️ Ataque seleccionado: <b>' + selText + '</b>.');
                }
            } else if (idEl.indexOf(that.analogName) === 0) {
                if (actorName && targetName) {
                    if (actorName === targetName) {
                        window.addLog('🛡️ <b>' + actorName + '</b> usa <b>' + selText + '</b> sobre sí mismo.');
                    } else {
                        window.addLog('🛡️ <b>' + actorName + '</b> usa <b>' + selText + '</b> sobre <b>' + targetName + '</b>.');
                    }
                } else if (actorName) {
                    window.addLog('🛡️ <b>' + actorName + '</b> usa defensa: <b>' + selText + '</b>.');
                } else if (targetName) {
                    window.addLog('🛡️ Defensa <b>' + selText + '</b> recibe: <b>' + targetName + '</b>.');
                } else {
                    window.addLog('🛡️ Defensa seleccionada: <b>' + selText + '</b>.');
                }
            }
        }

		function onChangeAction(event, clTarget) {
            var target = event.target;
            var idEl = target.getAttribute('class');
            var groupEl = document.getElementById(idEl);
            if (groupEl) that.bringToFront(groupEl);
            var selectedOpt = target.options[target.selectedIndex];
            groupEl.setAttribute('data-signal', selectedOpt.value);
            var selText = selectedOpt.text;

            // Si se escoge 'Pergamino mágico' (o una opción marcada como pergamino), usar el pergamino activo en #sel_scroll
            if (selText === 'Pergamino mágico' || selectedOpt.getAttribute('data-scroll-opt') === '1') {
                selectedOpt.setAttribute('data-scroll-opt', '1');
                var scrollSelect = document.getElementById('sel_scroll');
                var activeScroll = (scrollSelect && scrollSelect.value) ? scrollSelect.value : '';
                if (activeScroll) {
                    selText = 'Pergamino: ' + activeScroll;
                    selectedOpt.text = selText;
                    groupEl.setAttribute('data-scroll', activeScroll);
                }
            }

            var textEl = document.getElementById(idEl+clTarget);
            if (textEl) {
            	textEl.textContent = selText;
            }
            if (typeof window.addLog === 'function' && selText && selText !== '...') {
                if (idEl.indexOf(that.flexiName) === 0 || idEl.indexOf(that.analogName) === 0) {
                    logGroupCombatAction(groupEl);
                } else if (idEl.indexOf(that.gifName) === 0) {
                    var tokenTitle = (groupEl && groupEl.getAttribute('data-name')) ? groupEl.getAttribute('data-name') : idEl;
                    window.addLog('🩸 Estado de <b>' + tokenTitle + '</b>: <b>' + selText + '</b>.');
                }
            }
		}

        function attachRepeatSelectSupport(selEl, onRepeatCallback) {
            selEl._isOpen = false;
            selEl._changedWhileOpen = false;
            selEl.addEventListener('mousedown', function() {
                selEl._changedWhileOpen = false;
            });
            selEl.addEventListener('change', function() {
                selEl._changedWhileOpen = true;
                selEl._isOpen = false;
            });
            selEl.addEventListener('blur', function() {
                selEl._isOpen = false;
            });
            selEl.addEventListener('click', function(e) {
                if (!selEl._isOpen) {
                    selEl._isOpen = true;
                } else {
                    selEl._isOpen = false;
                    if (!selEl._changedWhileOpen && selEl.selectedIndex > 0) {
                        onRepeatCallback(e);
                    }
                }
            });
        }

        function createActorSelect(groupEl) {
            var idEl = groupEl.getAttribute('id');
            var actorSel = document.createElement('select');
            actorSel.setAttribute('id', idEl + 'actor');
            actorSel.setAttribute('class', 'actor-select');
            actorSel.setAttribute('data-group', idEl);
            actorSel.addEventListener('change', function(e) {
                var chosenActor = e.target.value;
                that.bringToFront(groupEl);
                groupEl.setAttribute('data-actor', chosenActor);
                if (chosenActor) {
                    logGroupCombatAction(groupEl);
                }
            });
            attachRepeatSelectSupport(actorSel, function() {
                if (actorSel.value) {
                    that.bringToFront(groupEl);
                    logGroupCombatAction(groupEl);
                }
            });
            return actorSel;
        }

        function createTargetSelect(groupEl) {
            var idEl = groupEl.getAttribute('id');
            var targetSel = document.createElement('select');
            targetSel.setAttribute('id', idEl + 'target');
            targetSel.setAttribute('class', 'target-select');
            targetSel.setAttribute('data-group', idEl);
            targetSel.addEventListener('change', function(e) {
                var chosenTarget = e.target.value;
                that.bringToFront(groupEl);
                groupEl.setAttribute('data-target', chosenTarget);
                if (chosenTarget) {
                    logGroupCombatAction(groupEl);
                }
            });
            attachRepeatSelectSupport(targetSel, function() {
                if (targetSel.value) {
                    that.bringToFront(groupEl);
                    logGroupCombatAction(groupEl);
                }
            });
            return targetSel;
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
            if (html.nodeName && html.nodeName.toLowerCase() === 'select') {
                attachRepeatSelectSupport(html, function() {
                    onChangeAction({ target: html }, 'label');
                });
            }
            foreignEl.appendChild(html);
            group.appendChild(foreignEl);
            return foreignEl;
		}

        function addActionWithActorHtml(group, actionHtml, width, height, x, y, includeTargetInline) {
            var idEl = group.getAttribute('id');
            var foreignEl = foreign(idEl + 'f', width, height, x, y);
            var actorSel = createActorSelect(group);
            actionHtml.setAttribute('id', idEl + 's');
            actionHtml.setAttribute('name', idEl + 's');
            actionHtml.setAttribute('class', idEl);
            actionHtml.setAttribute('xhtml', xhtml);
            attachRepeatSelectSupport(actionHtml, function() {
                onChangeAction({ target: actionHtml }, 'label');
            });

            var actionRow = document.createElement('div');
            actionRow.setAttribute('class', 'action-select-row');
            var repeatBtn = document.createElement('button');
            repeatBtn.setAttribute('type', 'button');
            repeatBtn.setAttribute('class', 'btn-repeat-action');
            repeatBtn.setAttribute('title', 'Repetir acción en la crónica');
            repeatBtn.textContent = '🔄';
            repeatBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (actionHtml.selectedIndex > 0) {
                    onChangeAction({ target: actionHtml }, 'label');
                }
            });
            actionRow.appendChild(actionHtml);
            actionRow.appendChild(repeatBtn);

            foreignEl.appendChild(actorSel);
            foreignEl.appendChild(actionRow);
            if (includeTargetInline) {
                var targetSel = createTargetSelect(group);
                foreignEl.appendChild(targetSel);
            }
            group.appendChild(foreignEl);
            return foreignEl;
        }

        function addTargetAtTipHtml(group, width, height, x, y) {
            var idEl = group.getAttribute('id');
            var foreignEl = foreign(idEl + 'ft', width, height, x, y);
            var targetSel = createTargetSelect(group);
            foreignEl.appendChild(targetSel);
            group.appendChild(foreignEl);
            return foreignEl;
        }

        this.refreshActorSelects = function() {
            if (!that.svg) return;
            var actors = [];
            var groups = that.svg.getElementsByTagName('g');
            for (var i = 0; i < groups.length; i++) {
                var g = groups[i];
                if (g.id && g.id.indexOf(that.gifName) === 0) {
                    var aName = g.getAttribute('data-name') || g.id;
                    actors.push(aName);
                }
            }
            var actorSelects = that.svg.querySelectorAll('select.actor-select');
            for (var j = 0; j < actorSelects.length; j++) {
                var sel = actorSelects[j];
                var grpId = sel.getAttribute('data-group');
                var grpEl = grpId ? document.getElementById(grpId) : null;
                var savedActor = grpEl ? (grpEl.getAttribute('data-actor') || '') : sel.value;
                while (sel.firstChild) {
                    sel.removeChild(sel.firstChild);
                }
                var optDefault = document.createElement('option');
                optDefault.value = '';
                optDefault.text = '👤 Quién lo hace...';
                sel.appendChild(optDefault);
                for (var k = 0; k < actors.length; k++) {
                    var opt = document.createElement('option');
                    opt.value = actors[k];
                    opt.text = '👤 ' + actors[k];
                    if (actors[k] === savedActor) {
                        opt.selected = true;
                    }
                    sel.appendChild(opt);
                }
            }
            var targetSelects = that.svg.querySelectorAll('select.target-select');
            for (var t = 0; t < targetSelects.length; t++) {
                var tSel = targetSelects[t];
                var tGrpId = tSel.getAttribute('data-group');
                var tGrpEl = tGrpId ? document.getElementById(tGrpId) : null;
                var savedTarget = tGrpEl ? (tGrpEl.getAttribute('data-target') || '') : tSel.value;
                while (tSel.firstChild) {
                    tSel.removeChild(tSel.firstChild);
                }
                var optTargetDef = document.createElement('option');
                optTargetDef.value = '';
                optTargetDef.text = '🎯 Quién recibe...';
                tSel.appendChild(optTargetDef);
                for (var m = 0; m < actors.length; m++) {
                    var optT = document.createElement('option');
                    optT.value = actors[m];
                    optT.text = '🎯 ' + actors[m];
                    if (actors[m] === savedTarget) {
                        optT.selected = true;
                    }
                    tSel.appendChild(optT);
                }
            }
        };

        this.updateTokenName = function(tokenId, newName, oldName) {
            if (!tokenId || !newName) return;
            var groupEl = document.getElementById(tokenId);
            if (groupEl) {
                groupEl.setAttribute('data-name', newName);
                var nameTxt = document.getElementById(tokenId + 'ntxt');
                if (nameTxt) {
                    nameTxt.textContent = newName;
                }
                var badgeBg = document.getElementById(tokenId + 'bbg');
                var baseCircle = document.getElementById(tokenId + 'ring');
                if (badgeBg && baseCircle) {
                    var cx = parseFloat(baseCircle.getAttribute('cx')) || 637.5;
                    var badgeWidth = Math.max(88, newName.length * 6.8 + 14);
                    badgeBg.setAttribute('width', badgeWidth);
                    badgeBg.setAttribute('x', cx - (badgeWidth / 2));
                }
            }
            if (oldName && that.svg) {
                var allGroups = that.svg.getElementsByTagName('g');
                for (var i = 0; i < allGroups.length; i++) {
                    if (allGroups[i].getAttribute('data-actor') === oldName) {
                        allGroups[i].setAttribute('data-actor', newName);
                    }
                    if (allGroups[i].getAttribute('data-target') === oldName) {
                        allGroups[i].setAttribute('data-target', newName);
                    }
                }
            }
            that.refreshActorSelects();
        };
	
		function appendChild(node) {
			that.svg.appendChild(node);
		}

        this.bringToFront = function(targetNode) {
            if (!that.svg || !targetNode) return;
            var node = targetNode.correspondingUseElement || targetNode;
            if (node.nodeType !== 1) return;

            // Si se ha pulsado un punto de control (.point-handle o .point-rotation) que cuelga de that.svg
            var parentAttr = node.getAttribute ? node.getAttribute('data-parent') : null;
            if (parentAttr) {
                var parentShape = document.getElementById(parentAttr);
                if (parentShape) {
                    node = parentShape;
                }
            }

            // Subir hasta el grupo <g> hijo directo de that.svg
            var groupNode = node;
            while (groupNode && groupNode.parentNode && groupNode.parentNode !== that.svg) {
                groupNode = groupNode.parentNode;
            }
            if (!groupNode || groupNode.parentNode !== that.svg || groupNode.nodeName !== 'g') {
                return;
            }

            // Localizar todos los controles externos (<use data-parent="...">) asociados a la figura de este grupo
            var shapeId = (groupNode.firstChild && groupNode.firstChild.id) ? groupNode.firstChild.id : '';
            var handles = [];
            if (shapeId) {
                var allUses = that.svg.getElementsByTagName('use');
                for (var i = 0; i < allUses.length; i++) {
                    if (allUses[i].getAttribute('data-parent') === shapeId) {
                        handles.push(allUses[i]);
                    }
                }
            }

            // Comprobar si ya es el último <g> en primer plano
            var allGroups = that.svg.getElementsByTagName('g');
            var isLastGroup = (allGroups.length > 0 && allGroups[allGroups.length - 1] === groupNode);
            if (!isLastGroup) {
                that.svg.appendChild(groupNode);
            }
            for (var j = 0; j < handles.length; j++) {
                if (that.svg.lastElementChild !== handles[j]) {
                    that.svg.appendChild(handles[j]);
                }
            }
        };
	
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
	
	    function getPolygonCentroid(poly) {
            var sx = 0, sy = 0, n = poly.points.numberOfItems;
            for (var k = 0; k < n; k++) {
                var pt = poly.points.getItem(k);
                sx += pt.x;
                sy += pt.y;
            }
            return { x: sx / (n || 1), y: sy / (n || 1) };
        }

        function rotatePolygonEvent(handleRot, polyEl) {
            that.interact(handleRot).gestureable = that.interact(handleRot).draggable({
                onstart: function(event) {
                    if (!that.rootMatrix) {
                        applyTransforms(event);
                    }
                    var c = getPolygonCentroid(polyEl);
                    polyEl._rotCenter = c;
                    polyEl._origPts = [];
                    for (var k = 0; k < polyEl.points.numberOfItems; k++) {
                        var pt = polyEl.points.getItem(k);
                        polyEl._origPts.push({ x: pt.x, y: pt.y });
                    }
                    var p0 = polyEl._origPts[0];
                    polyEl._startAngle = Math.atan2(p0.y - c.y, p0.x - c.x);
                },
                onmove: function(event) {
                    if (!that.rootMatrix) {
                        that.rootMatrix = that.svg.getScreenCTM();
                    }
                    var c = polyEl._rotCenter || getPolygonCentroid(polyEl);
                    var svgX = ((event.pageX - window.pageXOffset) - that.rootMatrix.e) / that.rootMatrix.a;
                    var svgY = ((event.pageY - window.pageYOffset) - that.rootMatrix.f) / that.rootMatrix.d;
                    var curAngle = Math.atan2(svgY - c.y, svgX - c.x);
                    var deltaAngle = curAngle - (polyEl._startAngle || 0);
                    var cosA = Math.cos(deltaAngle), sinA = Math.sin(deltaAngle);

                    for (var k = 0; k < polyEl.points.numberOfItems; k++) {
                        var orig = polyEl._origPts[k];
                        var dx = orig.x - c.x, dy = orig.y - c.y;
                        var nx = c.x + (dx * cosA - dy * sinA);
                        var ny = c.y + (dx * sinA + dy * cosA);
                        var pt = polyEl.points.getItem(k);
                        pt.x = nx;
                        pt.y = ny;
                        var useP = document.getElementById(polyEl.id + k);
                        if (useP) {
                            useP.setAttribute('x', nx);
                            useP.setAttribute('y', ny);
                            useP.x.baseVal.value = nx;
                            useP.y.baseVal.value = ny;
                        }
                    }
                    var p0Now = polyEl.points.getItem(0);
                    var ang0 = Math.atan2(p0Now.y - c.y, p0Now.x - c.x);
                    var rx = p0Now.x + 14 * Math.cos(ang0);
                    var ry = p0Now.y + 14 * Math.sin(ang0);
                    handleRot.setAttribute('x', rx);
                    handleRot.setAttribute('y', ry);
                    handleRot.x.baseVal.value = rx;
                    handleRot.y.baseVal.value = ry;
                }
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
                                if (foreign) {
                                    foreign.setAttribute('x',point.x-30);
                                    foreign.setAttribute('y',point.y+5);
                                }
                            }
                            if (i === len - 1) {
                                var foreignTip = document.getElementById(parent.parentNode.id+'ft');
                                if (foreignTip) {
                                    foreignTip.setAttribute('x',point.x-20);
                                    foreignTip.setAttribute('y',point.y+6);
                                }
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
                if (i === Math.floor(item.points.numberOfItems / 2) && item.nodeName === 'polyline') {
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
            if (item.nodeName === 'polygon') {
                var polyId = item.getAttribute('id');
                var polyRot = document.getElementById(polyId + 'rot');
                if (!polyRot) {
                    polyRot = document.createElementNS(svgNS, 'use');
                    polyRot.setAttributeNS(xns, 'href', '#point-rotation');
                    polyRot.setAttribute('class', 'point-rotation');
                    polyRot.setAttribute('id', polyId + 'rot');
                    polyRot.setAttribute('data-parent', polyId);
                    appendChild(polyRot);
                }
                var c = getPolygonCentroid(item);
                var p0 = item.points.getItem(0);
                var ang0 = Math.atan2(p0.y - c.y, p0.x - c.x);
                var rx = p0.x + 14 * Math.cos(ang0);
                var ry = p0.y + 14 * Math.sin(ang0);
                polyRot.setAttribute('x', rx);
                polyRot.setAttribute('y', ry);
                polyRot.x.baseVal.value = rx;
                polyRot.y.baseVal.value = ry;
                rotatePolygonEvent(polyRot, item);
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
                    that.bringToFront(event.target);
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
                    that.bringToFront(event.target);
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
                        if (foreign) {
                            var x = parseFloat(foreign.getAttribute('x'));
                            var y = parseFloat(foreign.getAttribute('y'));
                            x += event.dx / that.rootMatrix.a;
                            y += event.dy / that.rootMatrix.d;
                            foreign.setAttribute('x',x);
                            foreign.setAttribute('y',y);
                        }
                        var foreignTip = document.getElementById(parentId+'ft');
                        if (foreignTip) {
                            var tx = parseFloat(foreignTip.getAttribute('x'));
                            var ty = parseFloat(foreignTip.getAttribute('y'));
                            tx += event.dx / that.rootMatrix.a;
                            ty += event.dy / that.rootMatrix.d;
                            foreignTip.setAttribute('x',tx);
                            foreignTip.setAttribute('y',ty);
                        }
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
                        if (target.nodeName === 'polygon') {
                            rotatePolygonEvent(handleRot, target);
                            return;
                        }
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
            that.svg.addEventListener('click', function(e) {
                var t = e.target;
                if (!t) return;
                var tag = t.nodeName ? t.nodeName.toLowerCase() : '';
                if (tag === 'select' || tag === 'option') return;
                that.bringToFront(t);
            });

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
                    that.bringToFront(event.target);
                    that.svg.setAttribute('class', 'dragging');
                },
                onmove: function (event) {
                    if (!that.rootMatrix) {
                        that.rootMatrix = that.svg.getScreenCTM();
                    }
                    var target = event.target;
                    var parent = target.getAttribute('data-parent');
                    var parentEl = document.getElementById(parent);
                    if (parentEl && parentEl.nodeName === 'ellipse') {
                        var axis = target.getAttribute('data-axis');
                        var rx = parseFloat(parentEl.getAttribute('rx')) || 37.5;
                        var ry = parseFloat(parentEl.getAttribute('ry')) || 22;
                        var minR = 18.75; // Radio mínimo = diámetro de 0.5 celdas (37.5 px)
                        var maxRx = ((that.width || 1200) - 150) / 2; // Fondo total - 2 celdas
                        var maxRy = ((that.height || 975) - 150) / 2;
                        if (axis === 'rx-right') {
                            rx = Math.max(minR, Math.min(maxRx, rx + event.dx / that.rootMatrix.a));
                        } else if (axis === 'rx-left') {
                            rx = Math.max(minR, Math.min(maxRx, rx - event.dx / that.rootMatrix.a));
                        } else if (axis === 'ry-bottom') {
                            ry = Math.max(minR, Math.min(maxRy, ry + event.dy / that.rootMatrix.d));
                        } else if (axis === 'ry-top') {
                            ry = Math.max(minR, Math.min(maxRy, ry - event.dy / that.rootMatrix.d));
                        }
                        parentEl.setAttribute('rx', rx);
                        parentEl.setAttribute('ry', ry);
                        that.updateEllipseHandles(parentEl);
                        return;
                    }
                    if (parentEl && parentEl.nodeName === 'path' && parentEl.getAttribute('data-semicircle') === '1') {
                        var idx = parseInt(target.getAttribute('data-index'), 10) || 0;
                        var dx = event.dx / that.rootMatrix.a;
                        var dy = event.dy / that.rootMatrix.d;
                        var curX = parseFloat(parentEl.getAttribute('data-x' + idx)) || 600;
                        var curY = parseFloat(parentEl.getAttribute('data-y' + idx)) || 506.25;
                        parentEl.setAttribute('data-x' + idx, curX + dx);
                        parentEl.setAttribute('data-y' + idx, curY + dy);
                        that.updateSemicircle(parentEl);
                        return;
                    }
                    var i = parseInt(target.getAttribute('data-index'),10) || 0;
                    var point = parentEl.points.getItem(i);

                    point.x += event.dx / that.rootMatrix.a;
                    point.y += event.dy / that.rootMatrix.d;

                    target.setAttribute('x', point.x);
                    target.setAttribute('y', point.y);
                    target.x.baseVal.value = point.x;
                    target.y.baseVal.value = point.y;

                    if (parentEl.nodeName === 'polygon') {
                        var polyRot = document.getElementById(parent + 'rot');
                        if (polyRot) {
                            var c = getPolygonCentroid(parentEl);
                            var p0 = parentEl.points.getItem(0);
                            var ang0 = Math.atan2(p0.y - c.y, p0.x - c.x);
                            var rX = p0.x + 14 * Math.cos(ang0);
                            var rY = p0.y + 14 * Math.sin(ang0);
                            polyRot.setAttribute('x', rX);
                            polyRot.setAttribute('y', rY);
                            polyRot.x.baseVal.value = rX;
                            polyRot.y.baseVal.value = rY;
                        }
                    }

                    if (parent.indexOf(that.flexiName) !== -1) {
                        if (i === 0) {
                            var foreignId = parentEl.parentNode.id + 'f',
                            foreignEl = document.getElementById(foreignId);
                            if (foreignEl) {
                                foreignEl.setAttribute('x', point.x - 30);
                                foreignEl.setAttribute('y', point.y + 5);
                            }
                        }
                        if (i === 0 || i === Math.floor(parentEl.points.numberOfItems / 2)) {
                            var useRot = document.getElementById(parent + 'rot');
                            if (useRot) {
                                var pStart = parentEl.points.getItem(0),
                                center = parentEl.points.getItem(Math.floor(parentEl.points.numberOfItems / 2)),
                                angle = Math.atan2(center.y - pStart.y, center.x - pStart.x),
                                newX = pStart.x - (10 * Math.cos(angle)),
                                newY = pStart.y - (10 * Math.sin(angle));
                                useRot.setAttribute('x', newX);
                                useRot.setAttribute('y', newY);
                                useRot.x.baseVal.value = newX;
                                useRot.y.baseVal.value = newY;

                                var radius = Math.sqrt(Math.pow(center.x - newX, 2) + Math.pow(center.y - newY, 2));
                                var elementCenter = { pageX: center.x, pageY: center.y };
                                rotateEvent(useRot, radius, elementCenter);
                            }
                        }
                        if (i === parentEl.points.numberOfItems - 1) {
                            var foreignTipEl = document.getElementById(parentEl.parentNode.id + 'ft');
                            if (foreignTipEl) {
                                foreignTipEl.setAttribute('x', point.x - 20);
                                foreignTipEl.setAttribute('y', point.y + 6);
                            }
                        }
                    }

                },
                onend: function (event) {
                    that.svg.setAttribute('class', '');
                    var parent = event.target.getAttribute('data-parent'),
                        item = document.getElementById(parent);
                    if (!item || !item.points) {
                        return;
                    }
                    redoPoints();
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
                        if (!item || item.nodeName !== 'polyline') {
                            return;
                        }
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
                            else if (target.parentNode.id.indexOf('M') === 0) {
                                var mapGroup = target.parentNode;
                                var shapeNode = mapGroup.firstChild;
                                if (shapeNode) {
                                    var numH = shapeNode.points ? shapeNode.points.numberOfItems : (shapeNode.nodeName === 'ellipse' ? 4 : (shapeNode.nodeName === 'path' ? 5 : 0));
                                    if (numH > 0) {
                                        that.removeNodes(numH, shapeNode.id);
                                    }
                                    var rotH = document.getElementById(shapeNode.id + 'rot');
                                    if (rotH && rotH.parentNode) {
                                        rotH.parentNode.removeChild(rotH);
                                    }
                                }
                                that.removeChild(mapGroup);
                            }
                            else {
                            	var parentName = target.classList.item(0) || target.getAttribute('class');
                            	if (parentName !== undefined && parentName !== null && parentName !== "") { 
                            		var nodeTargetToRemove = document.getElementById(parentName);
                                	if (nodeTargetToRemove) {
                                		var removedId = nodeTargetToRemove.id;
                                		that.removeChild(nodeTargetToRemove);
                                		that.refreshActorSelects();
                                		if (typeof window.removeCombatantByToken === 'function') {
                                			window.removeCombatantByToken(removedId);
                                		}
                                	}
                                }
                            }
                        }
                    }
                }
                document.body.style.cursor = "";
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
            var removable = svgToPrint.querySelectorAll('.point-handle, .point-rotation, .token-rotation, foreignObject, .delete');
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
                var oldForeigns = groupSVG.querySelectorAll('foreignObject');
                Array.prototype.forEach.call(oldForeigns, function(fn) {
                    if (fn.parentNode) fn.parentNode.removeChild(fn);
                });
                var rChild = groupSVG.querySelector('rect');
                if (rChild) {
                    bx = parseFloat(rChild.getAttribute('x')) || 560;
                    by = parseFloat(rChild.getAttribute('y')) || 470;
                    rChild.setAttribute('width', '164');
                    rChild.setAttribute('height', '86');
                    rChild.style.cursor = 'move';
                }
            }
            else {
                id = that.analogName+id;
                groupSVG = group(id);		
                groupSVG.setAttribute('data-signal',0);
                groupSVG.setAttribute('data-actor','');
                groupSVG.setAttribute('data-target','');
                var abox = rect(bx,by,164,86,"#1b2330","0.92","#d4af37","2",id+'r');
                abox.setAttributeNS(null, "rx", "6");
                abox.setAttributeNS(null, "ry", "6");
                abox.setAttribute('class',groupSVG.id);
                abox.style.cursor = 'move';
                groupSVG.appendChild(abox);
                               
            }
            
            var html = that.selectB.cloneNode(true);
            if (html !== undefined) {
                html.addEventListener('change',function(e) { onChangeAction(e,'label') });
                addActionWithActorHtml(groupSVG, html, 152, 78, bx+6, by+5, true);
            }	
                            
            appendChild(groupSVG);
            that.refreshActorSelects();
            addEvents(groupSVG.firstChild);
            if (groupRecovered) {
            	var optionNumber = parseInt(groupSVG.getAttribute('data-signal'),10) || 0;
            	var actSel = document.getElementById(groupSVG.id + 's');
            	if (actSel && actSel.options[optionNumber]) {
            		actSel.options[optionNumber].selected = 'selected';
                    var savedScroll = groupSVG.getAttribute('data-scroll');
                    if (savedScroll && actSel.options[optionNumber].text === 'Pergamino mágico') {
                        actSel.options[optionNumber].setAttribute('data-scroll-opt', '1');
                        actSel.options[optionNumber].text = 'Pergamino: ' + savedScroll;
                    }
            	}
            }
            return groupSVG;
		}
	
		this.flexyLine = function(id, primaryColor, secundaryColor, groupRecovered) { 
            var groupSVG;                        
            
            if (groupRecovered) {
                groupSVG = groupRecovered;
                var oldForeigns = groupSVG.querySelectorAll('foreignObject');
                Array.prototype.forEach.call(oldForeigns, function(fn) {
                    if (fn.parentNode) fn.parentNode.removeChild(fn);
                });
                if (groupSVG.firstChild) {
                    groupSVG.firstChild.setAttributeNS(null, "marker-end", "url(#arrow-attack)");
                    groupSVG.firstChild.style.cursor = 'move';
                }
            }
            else {
                id = that.flexiName+id;
                groupSVG = group(id);
                groupSVG.setAttribute('data-signal',0);
                groupSVG.setAttribute('data-actor','');
                groupSVG.setAttribute('data-target','');
                var flex = polyline("540, 485, 637, 485, 735, 485", id+'pl',"none","1",primaryColor, "4");
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
                flex.style.cursor = 'move';
                groupSVG.appendChild(flex); 
            }
            var html = that.selectA.cloneNode(true);
            if (html !== undefined) {
                var x = 0, y = 0, tx = 0, ty = 0;
                html.addEventListener('change',function(e) { onChangeAction(e)});
                var polyPts = groupSVG.firstChild.points;
                var p0 = polyPts.getItem(0);
                var pLast = polyPts.getItem(polyPts.numberOfItems - 1);
                x = p0.x - 30;
                y = p0.y + 5;
                tx = pLast.x - 20;
                ty = pLast.y + 6;
                addActionWithActorHtml(groupSVG, html, 150, 54, x, y, false);
                addTargetAtTipHtml(groupSVG, 145, 28, tx, ty);
            }
            appendChild(groupSVG);
            that.refreshActorSelects();
            addHandles(groupSVG.firstChild, false);
            addHandlesEvents(groupSVG.firstChild);
            if (groupRecovered) {
            	var optionNumber = parseInt(groupSVG.getAttribute('data-signal'),10) || 0;
            	var actSel = document.getElementById(groupSVG.id + 's');
            	if (actSel && actSel.options[optionNumber]) {
            		actSel.options[optionNumber].selected = 'selected';
                    var savedScroll = groupSVG.getAttribute('data-scroll');
                    if (savedScroll && actSel.options[optionNumber].text === 'Pergamino mágico') {
                        actSel.options[optionNumber].setAttribute('data-scroll-opt', '1');
                        actSel.options[optionNumber].text = 'Pergamino: ' + savedScroll;
                    }
            	}
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
                    { d: 'M 5.2 -8.8 L 8.8 -5.2 L -10.5 14.1 L -15.5 15.5 L -14.1 10.5 Z', fill: '#f1f5f9', stroke: '#94a3b8', sw: 1.2 },
                    { d: 'M 7.3 -9.7 L 11.8 -14.2 L 14.2 -11.8 L 9.7 -7.3 Z', fill: '#92400e', stroke: '#fde047', sw: 1.1 },
                    { d: 'M 11.6 -13.8 A 2.2 2.2 0 1 0 16 -13.8 A 2.2 2.2 0 1 0 11.6 -13.8', fill: '#fbbf24', stroke: '#fef08a', sw: 1.1 },
                    { d: 'M 3.5 -13.5 L 13.5 -3.5 L 11.5 -1.5 L 1.5 -11.5 Z', fill: '#fbbf24', stroke: '#fef08a', sw: 1.1 },
                    { d: 'M 0 -6 C 4.5 -6 9 -4.8 10.5 -3.5 L 10.5 3.5 C 10.5 9.5 5 13.8 0 16.5 C -5 13.8 -10.5 9.5 -10.5 3.5 L -10.5 -3.5 C -9 -4.8 -4.5 -6 0 -6 Z', fill: '#991b1b', stroke: '#e2e8f0', sw: 2.2 },
                    { d: 'M 0 -4.2 L 0 14.5', fill: 'none', stroke: '#fca5a5', sw: 1.2 },
                    { d: 'M -2.8 2.5 A 2.8 2.8 0 1 0 2.8 2.5 A 2.8 2.8 0 1 0 -2.8 2.5', fill: '#e2e8f0', stroke: '#94a3b8', sw: 1 }
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
                    { d: 'M 0 -17 L 2.5 -6 L 12 -12 L 6 -2.5 L 17 0 L 6 2.5 L 12 12 L 2.5 6 L 0 17 L -2.5 6 L -12 12 L -6 2.5 L -17 0 L -6 -2.5 L -12 -12 L -2.5 -6 Z', fill: '#eab308', stroke: '#fef9c3', sw: 1.4 },
                    { d: 'M -4.5 0 A 4.5 4.5 0 1 0 4.5 0 A 4.5 4.5 0 1 0 -4.5 0', fill: '#fef08a', stroke: '#ca8a04', sw: 1.4 }
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
                name: 'Trasgo', bg: '#3f6212', border: '#a3e635', size: 0.78,
                paths: [
                    { d: 'M -18 -8 L -9 -4 L -9 6 L 0 12 L 9 6 L 9 -4 L 18 -8 L 10 -12 L 0 -10 L -10 -12 Z', fill: '#65a30d', stroke: '#ecfccb', sw: 1.8 },
                    { d: 'M -6 -2 L -2 0 M 6 -2 L 2 0', fill: 'none', stroke: '#ef4444', sw: 2.5 }
                ]
            },
            orco: {
                name: 'Orco', bg: '#14532d', border: '#84cc16', size: 1.05,
                paths: [
                    { d: 'M -13 -8 L 13 -8 L 11 10 L 0 14 L -11 10 Z', fill: '#3f6212', stroke: '#bef264', sw: 1.8 },
                    { d: 'M -9 10 L -6 2 L -3 10 M 9 10 L 6 2 L 3 10', fill: '#fef9c3', stroke: '#ca8a04', sw: 1.2 },
                    { d: 'M -7 -3 L -2 -1 M 7 -3 L 2 -1', fill: 'none', stroke: '#ef4444', sw: 2.5 }
                ]
            },
            kobold: {
                name: 'Kobold', bg: '#7c2d12', border: '#fb923c', size: 0.75,
                paths: [
                    { d: 'M -11 -16 L -5 -6 L 5 -6 L 11 -16 L 9 4 L 0 14 L -9 4 Z', fill: '#c2410c', stroke: '#fed7aa', sw: 1.6 },
                    { d: 'M -5 0 L -2 2 M 5 0 L 2 2', fill: 'none', stroke: '#fde047', sw: 2.2 }
                ]
            },
            bandido: {
                name: 'Bandido', bg: '#1f2937', border: '#9ca3af', size: 1.0,
                paths: [
                    { d: 'M 0 -17 C 10 -17 15 -10 15 -2 L 11 12 L 0 16 L -11 12 L -15 -2 C -15 -10 -10 -17 0 -17 Z', fill: '#111827', stroke: '#9ca3af', sw: 1.6 },
                    { d: 'M -11 -9.5 C -6 -12.5 6 -12.5 11 -9.5 L 12 -2 L -12 -2 Z', fill: '#e2b887', stroke: '#78350f', sw: 1 },
                    { d: 'M -8 -8 L -2.5 -6.2 M 8 -8 L 2.5 -6.2', fill: 'none', stroke: '#1f2937', sw: 2.2 },
                    { d: 'M -6.2 -5.5 L -3.5 -5.5 M 3.5 -5.5 L 6.2 -5.5', fill: 'none', stroke: '#111827', sw: 2.2 },
                    { d: 'M -13 -2 L 0 -5.2 L 13 -2 L 10 11.5 L 0 16 L -10 11.5 Z', fill: '#991b1b', stroke: '#fca5a5', sw: 1.5 },
                    { d: 'M 0 -4.8 L 0 15.2', fill: 'none', stroke: '#7f1d1d', sw: 1.4 }
                ]
            },
            cultista: {
                name: 'Cultista', bg: '#31102f', border: '#e879f9', size: 1.0,
                paths: [
                    { d: 'M 0 -17 L 14 4 L 9 14 L -9 14 L -14 4 Z', fill: '#4a044e', stroke: '#f0abfc', sw: 1.8 },
                    { d: 'M 0 -9 L 6 8 L -6 8 Z', fill: '#090b10', stroke: '#c084fc', sw: 1.2 },
                    { d: 'M -3 3 L -1 3 M 1 3 L 3 3', fill: 'none', stroke: '#ef4444', sw: 2 }
                ]
            },
            esqueleto: {
                name: 'Esqueleto', bg: '#27272a', border: '#d4d4d8', size: 1.0,
                paths: [
                    { d: 'M -11 -4 A 11 10 0 1 1 11 -4 L 7 12 L -7 12 Z', fill: '#52525b', stroke: '#f4f4f5', sw: 2 },
                    { d: 'M -5 -4 L -3 -4 M 3 -4 L 5 -4 M -4 7 L 4 7', fill: 'none', stroke: '#18181b', sw: 2.8 }
                ]
            },
            zombi: {
                name: 'Zombi', bg: '#1e293b', border: '#65a30d', size: 1.0,
                paths: [
                    { d: 'M -11 -4 A 11 10 0 1 1 11 -4 L 8 12 L -8 12 Z', fill: '#4d7c0f', stroke: '#bef264', sw: 1.8 },
                    { d: 'M -6 -4 L -2 -4 M 3 -5 L 6 -2 M 6 -5 L 3 -2 M -5 7 Q 0 4 5 8', fill: 'none', stroke: '#1a2e05', sw: 2.2 }
                ]
            },
            vampiro: {
                name: 'Vampiro', bg: '#2a0815', border: '#f43f5e', size: 1.05,
                paths: [
                    { d: 'M -16 -12 L -7 -4 L 7 -4 L 16 -12 L 12 10 L 0 16 L -12 10 Z', fill: '#881337', stroke: '#fda4af', sw: 1.6 },
                    { d: 'M -6 4 L -3 11 L 0 4 M 6 4 L 3 11 L 0 4', fill: '#ffffff', stroke: '#e11d48', sw: 1 },
                    { d: 'M -6 -2 L -2 0 M 6 -2 L 2 0', fill: 'none', stroke: '#fb7185', sw: 2.2 }
                ]
            },
            liche: {
                name: 'Liche', bg: '#0f172a', border: '#22d3ee', size: 1.15,
                paths: [
                    { d: 'M -12 -8 L -8 -17 L -3 -10 L 0 -18 L 3 -10 L 8 -17 L 12 -8 Z', fill: '#eab308', stroke: '#fef08a', sw: 1.5 },
                    { d: 'M -9 -8 L 9 -8 L 7 12 L -7 12 Z', fill: '#334155', stroke: '#67e8f9', sw: 1.8 },
                    { d: 'M -5 -2 L -2 -2 M 2 -2 L 5 -2', fill: 'none', stroke: '#22d3ee', sw: 3 }
                ]
            },
            lobo: {
                name: 'Lobo Huargo', bg: '#1f2937', border: '#94a3b8', size: 1.35,
                paths: [
                    { d: 'M -13 -16 L -7 -5 L 7 -5 L 13 -16 L 14 2 L 0 15 L -14 2 Z', fill: '#475569', stroke: '#cbd5e1', sw: 1.8 },
                    { d: 'M -6 0 L -2 2 M 6 0 L 2 2 M -3 10 L 3 10', fill: 'none', stroke: '#facc15', sw: 2.2 }
                ]
            },
            arana: {
                name: 'Araña Gigante', bg: '#18181b', border: '#a855f7', size: 1.4,
                paths: [
                    { d: 'M -17 -10 L -6 -2 M -18 0 L -6 0 M -17 10 L -6 4 M 17 -10 L 6 -2 M 18 0 L 6 0 M 17 10 L 6 4', fill: 'none', stroke: '#d8b4fe', sw: 2 },
                    { d: 'M 0 -10 A 6 6 0 1 0 0 2 A 6 6 0 1 0 0 -10 M 0 0 A 8 9 0 1 0 0 16 A 8 9 0 1 0 0 0', fill: '#3b0764', stroke: '#e9d5ff', sw: 1.6 },
                    { d: 'M -3 -5 L -1 -5 M 1 -5 L 3 -5', fill: 'none', stroke: '#ef4444', sw: 2 }
                ]
            },
            mimico: {
                name: 'Cofre Mímico', bg: '#451a03', border: '#f59e0b', size: 1.0,
                paths: [
                    { d: 'M -14 -10 L 14 -10 L 14 10 L -14 10 Z', fill: '#78350f', stroke: '#fbbf24', sw: 2 },
                    { d: 'M -14 0 L 14 0', fill: 'none', stroke: '#1c1917', sw: 3 },
                    { d: 'M -10 -1 L -7 4 L -4 -1 L -1 4 L 2 -1 L 5 4 L 8 -1 L 11 4', fill: '#fef3c7', stroke: 'none', sw: 0 },
                    { d: 'M 0 2 C 4 8 10 14 6 17 C 2 18 -2 10 0 2 Z', fill: '#ec4899', stroke: '#f43f5e', sw: 1.2 }
                ]
            },
            cubo: {
                name: 'Cubo Gelatinoso', bg: '#064e3b', border: '#34d399', size: 1.75,
                paths: [
                    { d: 'M -13 -13 L 13 -13 L 13 13 L -13 13 Z', fill: '#10b981', stroke: '#a7f3d0', sw: 2 },
                    { d: 'M -8 -8 L 8 -8 L 8 8 L -8 8 Z', fill: 'none', stroke: '#d1fae5', sw: 1.2 },
                    { d: 'M -5 -3 L 5 5 M 5 -3 L -3 5', fill: 'none', stroke: '#ecfdf5', sw: 2 }
                ]
            },
            troll: {
                name: 'Troll', bg: '#365314', border: '#f97316', size: 1.55,
                paths: [
                    { d: 'M -14 -8 A 14 12 0 1 1 14 -8 L 12 12 L -12 12 Z', fill: '#4d7c0f', stroke: '#fdba74', sw: 2 },
                    { d: 'M -2 -3 L 0 4 L 2 -3', fill: '#fb923c', stroke: '#9a3412', sw: 1.2 },
                    { d: 'M -8 -4 L -4 -4 M 4 -4 L 8 -4 M -7 8 L 7 8', fill: 'none', stroke: '#fef08a', sw: 2.4 }
                ]
            },
            basilisco: {
                name: 'Basilisco', bg: '#14532d', border: '#a3e635', size: 1.35,
                paths: [
                    { d: 'M -10 -7 L -15 -16 L -5 -11 L 0 -19 L 5 -11 L 15 -16 L 10 -7 Z', fill: '#a3e635', stroke: '#ecfccb', sw: 1.2 },
                    { d: 'M -13 -8 L 13 -8 L 15 3 L 7 15 L 0 17 L -7 15 L -15 3 Z', fill: '#15803d', stroke: '#86efac', sw: 1.8 },
                    { d: 'M -9 -2 L -3 1 L -6 3.5 L -10 0.5 Z M 9 -2 L 3 1 L 6 3.5 L 10 0.5 Z', fill: '#bef264', stroke: '#fef08a', sw: 1 },
                    { d: 'M -6 10 L -4 14 L -2 10 M 2 10 L 4 14 L 6 10', fill: '#fef9c3', stroke: '#ca8a04', sw: 0.9 }
                ]
            },
            contemplador: {
                name: 'Contemplador', bg: '#4c1d95', border: '#e879f9', size: 1.65,
                paths: [
                    { d: 'M -8 -10 L -15 -17 M 0 -12 L 0 -19 M 8 -10 L 15 -17 M -11 -4 L -18 -8 M 11 -4 L 18 -8', fill: 'none', stroke: '#f0abfc', sw: 2.2 },
                    { d: 'M 0 -11 A 12 12 0 1 0 0 13 A 12 12 0 1 0 0 -11', fill: '#701a75', stroke: '#f5d0fe', sw: 2 },
                    { d: 'M 0 -6 A 5 5 0 1 0 0 4 A 5 5 0 1 0 0 -6', fill: '#fef08a', stroke: '#dc2626', sw: 1.8 },
                    { d: 'M -7 7 Q 0 12 7 7', fill: 'none', stroke: '#ffffff', sw: 2 }
                ]
            },
            azotamentes: {
                name: 'Azotamentes', bg: '#312e81', border: '#818cf8', size: 1.05,
                paths: [
                    { d: 'M 0 -15 A 10 9 0 1 1 0.1 -15 Z', fill: '#4f46e5', stroke: '#c7d2fe', sw: 1.8 },
                    { d: 'M -6 1 C -10 8 -12 14 -8 16 M -2 2 C -4 9 -4 15 -2 17 M 2 2 C 4 9 4 15 2 17 M 6 1 C 10 8 12 14 8 16', fill: 'none', stroke: '#a5b4fc', sw: 2.2 },
                    { d: 'M -5 -6 L -2 -5 M 5 -6 L 2 -5', fill: 'none', stroke: '#fde047', sw: 2.2 }
                ]
            },
            demonio: {
                name: 'Demonio', bg: '#450a0a', border: '#ef4444', size: 1.85,
                paths: [
                    { d: 'M -8 -8 C -16 -16 -18 -4 -10 0 M 8 -8 C 16 -16 18 -4 10 0', fill: 'none', stroke: '#fca5a5', sw: 2.8 },
                    { d: 'M -10 -8 L 10 -8 L 7 13 L 0 17 L -7 13 Z', fill: '#dc2626', stroke: '#fecaca', sw: 1.8 },
                    { d: 'M -5 -1 L -2 1 M 5 -1 L 2 1', fill: 'none', stroke: '#fef08a', sw: 2.4 }
                ]
            },
            elemental: {
                name: 'Elemental', bg: '#0c4a6e', border: '#38bdf8', size: 1.6,
                paths: [
                    { d: 'M 0 -18 L 12 0 L 0 18 L -12 0 Z', fill: '#0284c7', stroke: '#e0f2fe', sw: 2 },
                    { d: 'M 0 -10 L 6 0 L 0 10 L -6 0 Z', fill: '#7dd3fc', stroke: '#ffffff', sw: 1.2 }
                ]
            },
            dragon: {
                name: 'Dragón', bg: '#450a0a', border: '#f59e0b', size: 2.35,
                paths: [
                    { d: 'M -16 -15 L -8 -4 L -15 6 L 0 16 L 15 6 L 8 -4 L 16 -15 L 5 -8 L 0 -14 L -5 -8 Z', fill: '#dc2626', stroke: '#fde047', sw: 2 },
                    { d: 'M -8.5 -1.5 L -2.5 1.2 L -5.2 3.2 L -9.2 0.5 Z M 8.5 -1.5 L 2.5 1.2 L 5.2 3.2 L 9.2 0.5 Z', fill: '#fef08a', stroke: '#78350f', sw: 0.8 },
                    { d: 'M -2.5 9.5 L -1.5 11 M 2.5 9.5 L 1.5 11', fill: 'none', stroke: '#450a0a', sw: 1.5 }
                ]
            }
        };

        var HERO_CLASS_KEYS = {
            paladin: 1, mago: 1, hechicero: 1, guerrero: 1, picaro: 1, clerigo: 1,
            explorador: 1, barbaro: 1, bardo: 1, druida: 1, monje: 1, brujo: 1
        };

        this.heroToken = function(id, classKey, customName, groupRecovered) {
            var groupSVG;
            var cx = 637.5, cy = 487.5;
            var preset = CLASS_PRESETS[classKey] || CLASS_PRESETS.paladin;
            var sz = preset.size || 1.0;
            var outerR = Math.round(36 * sz);

            if (groupRecovered) {
                groupSVG = groupRecovered;
                classKey = groupSVG.getAttribute('data-class') || classKey || 'paladin';
                preset = CLASS_PRESETS[classKey] || CLASS_PRESETS.paladin;
                sz = preset.size || 1.0;
                var oldForeigns = groupSVG.querySelectorAll('foreignObject');
                Array.prototype.forEach.call(oldForeigns, function(fn) {
                    if (fn.parentNode) fn.parentNode.removeChild(fn);
                });
                var oldRot = document.getElementById(groupSVG.id + 'rot');
                if (oldRot && oldRot.parentNode) {
                    oldRot.parentNode.removeChild(oldRot);
                }
                var baseCircle = groupSVG.querySelector('circle');
                if (baseCircle) {
                    cx = parseFloat(baseCircle.getAttribute('cx')) || 637.5;
                    cy = parseFloat(baseCircle.getAttribute('cy')) || 487.5;
                    outerR = parseFloat(baseCircle.getAttribute('r')) || Math.round(36 * sz);
                }
            }
            else {
                var innerR = Math.round(30 * sz);
                var displayTitle = customName ? customName : preset.name;
                id = that.gifName + id;
                groupSVG = group(id);
                groupSVG.setAttribute('data-signal', 0);
                groupSVG.setAttribute('data-class', classKey);
                groupSVG.setAttribute('data-name', displayTitle);

                // Tamaño base (sz=1.0): diámetro 72px (radio 36px = 1 celda de 1,5m); criaturas pequeñas/grandes/enormes escalan proporcionalmente
                var outerRing = circle(outerR, cx, cy, id + 'ring', preset.bg, "0.95", preset.border, "3");
                outerRing.setAttribute('class', id);
                outerRing.style.cursor = 'move';
                groupSVG.appendChild(outerRing);

                var innerRing = circle(innerR, cx, cy, id + 'iring', "none", "0", "rgba(255,255,255,0.22)", "1.2");
                innerRing.setAttribute('class', id);
                innerRing.style.pointerEvents = 'none';
                groupSVG.appendChild(innerRing);

                var iconScale = (1.22 * sz).toFixed(2);
                preset.paths.forEach(function(pSpec, idx) {
                    var iconPath = document.createElementNS(svgNS, 'path');
                    iconPath.setAttribute('d', pSpec.d);
                    iconPath.setAttribute('transform', 'translate(' + cx + ',' + (cy - 3 * sz) + ') scale(' + iconScale + ')');
                    iconPath.setAttribute('fill', pSpec.fill);
                    iconPath.setAttribute('stroke', pSpec.stroke);
                    iconPath.setAttribute('stroke-width', pSpec.sw);
                    iconPath.setAttribute('stroke-linecap', 'round');
                    iconPath.setAttribute('stroke-linejoin', 'round');
                    iconPath.setAttribute('class', id);
                    iconPath.style.pointerEvents = 'none';
                    groupSVG.appendChild(iconPath);
                });

                var badgeWidth = Math.max(88, displayTitle.length * 6.8 + 14);
                var badgeY = cy + outerR - 15;
                var badgeBg = rect(cx - (badgeWidth / 2), badgeY, badgeWidth, 18, "#0b0d13", "0.92", preset.border, "1.2", id + 'bbg');
                badgeBg.setAttributeNS(null, "rx", "4");
                badgeBg.setAttributeNS(null, "ry", "4");
                badgeBg.setAttribute('class', id);
                badgeBg.style.pointerEvents = 'none';
                groupSVG.appendChild(badgeBg);

                var nameTxt = text(id + 'ntxt');
                nameTxt.setAttribute('x', cx);
                nameTxt.setAttribute('y', badgeY + 12.5);
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

            // Héroes: select de estado abajo, pegado al nombre (cy + outerR + 4)
            // Monstruos: select de estado arriba, pegado al personaje (cy - outerR - 23)
            var isHero = !!HERO_CLASS_KEYS[classKey];
            var selectY = isHero ? (cy + outerR + 4) : (cy - outerR - 23);

            var html = that.selectC.cloneNode(true);
            if (html !== undefined) {
                html.addEventListener('change', function(e) { onChangeAction(e, 'label'); });
                addHtml(groupSVG, html, 115, 24, cx - 57.5, selectY, 's', 2);
            }
            appendChild(groupSVG);
            that.refreshActorSelects();
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
        };

        this.insertMapGroup = function(groupSVG) {
            var gridRect = document.getElementById('dnd-grid-overlay');
            if (gridRect && gridRect.parentNode === that.svg) {
                that.svg.insertBefore(groupSVG, gridRect);
            } else {
                appendChild(groupSVG);
            }
        };

        this.updateEllipseHandles = function(ellipseEl) {
            var cx = parseFloat(ellipseEl.getAttribute('cx')) || 637.5;
            var cy = parseFloat(ellipseEl.getAttribute('cy')) || 487.5;
            var rx = parseFloat(ellipseEl.getAttribute('rx')) || 95;
            var ry = parseFloat(ellipseEl.getAttribute('ry')) || 55;
            var id = ellipseEl.getAttribute('id');
            var coords = [
                { x: cx + rx, y: cy, axis: 'rx-right' },
                { x: cx - rx, y: cy, axis: 'rx-left' },
                { x: cx, y: cy + ry, axis: 'ry-bottom' },
                { x: cx, y: cy - ry, axis: 'ry-top' }
            ];
            for (var k = 0; k < 4; k++) {
                var h = document.getElementById(id + k);
                if (!h) {
                    h = document.createElementNS(svgNS, 'use');
                    h.setAttributeNS(xns, 'href', '#point-handle');
                    h.setAttribute('class', 'point-handle');
                    h.setAttribute('id', id + k);
                    h.setAttribute('data-parent', id);
                    h.setAttribute('data-index', k);
                    h.setAttribute('data-axis', coords[k].axis);
                    appendChild(h);
                }
                h.setAttribute('x', coords[k].x);
                h.setAttribute('y', coords[k].y);
                h.x.baseVal.value = coords[k].x;
                h.y.baseVal.value = coords[k].y;
            }
        };

        this.addEllipseDrag = function(ellipseEl) {
            that.interact(ellipseEl).gestureable = that.interact(ellipseEl).draggable({
                onstart: function(event) {
                    if (!that.rootMatrix) {
                        applyTransforms(event);
                    }
                    that.bringToFront(ellipseEl);
                    that.svg.setAttribute('class', 'dragging');
                },
                onmove: function(event) {
                    if (!that.rootMatrix) {
                        that.rootMatrix = that.svg.getScreenCTM();
                    }
                    var cx = (parseFloat(ellipseEl.getAttribute('cx')) || 637.5) + event.dx / that.rootMatrix.a;
                    var cy = (parseFloat(ellipseEl.getAttribute('cy')) || 487.5) + event.dy / that.rootMatrix.d;
                    ellipseEl.setAttribute('cx', cx);
                    ellipseEl.setAttribute('cy', cy);
                    that.updateEllipseHandles(ellipseEl);
                },
                onend: function() {
                    that.svg.setAttribute('class', '');
                }
            });
        };

        this.updateSemicircle = function(pathEl) {
            var x0 = parseFloat(pathEl.getAttribute('data-x0')) || 600;
            var y0 = parseFloat(pathEl.getAttribute('data-y0')) || 506.25;
            var x1 = parseFloat(pathEl.getAttribute('data-x1')) || 675;
            var y1 = parseFloat(pathEl.getAttribute('data-y1')) || 506.25;
            var x2 = parseFloat(pathEl.getAttribute('data-x2')) || 656.25;
            var y2 = parseFloat(pathEl.getAttribute('data-y2')) || 473.77;
            var x3 = parseFloat(pathEl.getAttribute('data-x3')) || 618.75;
            var y3 = parseFloat(pathEl.getAttribute('data-y3')) || 473.77;
            var x4 = parseFloat(pathEl.getAttribute('data-x4')) || 637.5;
            var y4 = parseFloat(pathEl.getAttribute('data-y4')) || 506.25;

            // Interpolación cúbica exacta de Bézier para el arco (P0 -> P3 -> P2 -> P1) y quinto punto P4 en mitad de la recta base
            var c1x = (-5 * x0 + 18 * x3 - 9 * x2 + 2 * x1) / 6;
            var c1y = (-5 * y0 + 18 * y3 - 9 * y2 + 2 * y1) / 6;
            var c2x = (2 * x0 - 9 * x3 + 18 * x2 - 5 * x1) / 6;
            var c2y = (2 * y0 - 9 * y3 + 18 * y2 - 5 * y1) / 6;

            var dStr = 'M ' + x0 + ' ' + y0 + ' C ' + c1x + ' ' + c1y + ', ' + c2x + ' ' + c2y + ', ' + x1 + ' ' + y1 + ' L ' + x4 + ' ' + y4 + ' Z';
            pathEl.setAttribute('d', dStr);

            var pts = [
                { x: x0, y: y0 },
                { x: x1, y: y1 },
                { x: x2, y: y2 },
                { x: x3, y: y3 },
                { x: x4, y: y4 }
            ];
            var id = pathEl.getAttribute('id');
            for (var k = 0; k < 5; k++) {
                var handle = document.getElementById(id + k);
                if (!handle) {
                    handle = document.createElementNS(svgNS, 'use');
                    handle.setAttributeNS(xns, 'href', '#point-handle');
                    handle.setAttribute('class', 'point-handle');
                    handle.setAttribute('id', id + k);
                    handle.setAttribute('data-parent', id);
                    handle.setAttribute('data-index', k);
                    appendChild(handle);
                }
                handle.setAttribute('x', pts[k].x);
                handle.setAttribute('y', pts[k].y);
                handle.x.baseVal.value = pts[k].x;
                handle.y.baseVal.value = pts[k].y;
            }

            // Punto de rotación naranja (#point-rotation) ubicado 14px hacia afuera del vértice 0 respecto al centroide
            var cx = 0.2 * (x0 + x1 + x2 + x3 + x4);
            var cy = 0.2 * (y0 + y1 + y2 + y3 + y4);
            var ang0 = Math.atan2(y0 - cy, x0 - cx);
            var rX = x0 + 14 * Math.cos(ang0);
            var rY = y0 + 14 * Math.sin(ang0);
            var rotHandle = document.getElementById(id + 'rot');
            if (!rotHandle) {
                rotHandle = document.createElementNS(svgNS, 'use');
                rotHandle.setAttributeNS(xns, 'href', '#point-rotation');
                rotHandle.setAttribute('class', 'point-rotation');
                rotHandle.setAttribute('id', id + 'rot');
                rotHandle.setAttribute('data-parent', id);
                appendChild(rotHandle);
                that.addSemicircleRotation(rotHandle, pathEl);
            }
            rotHandle.setAttribute('x', rX);
            rotHandle.setAttribute('y', rY);
            rotHandle.x.baseVal.value = rX;
            rotHandle.y.baseVal.value = rY;
        };

        this.addSemicircleRotation = function(rotHandle, pathEl) {
            var rotState = null;
            that.interact(rotHandle).gestureable = that.interact(rotHandle).draggable({
                onstart: function(event) {
                    if (!that.rootMatrix) {
                        applyTransforms(event);
                    }
                    that.svg.setAttribute('class', 'dragging');
                    var x0 = parseFloat(pathEl.getAttribute('data-x0')) || 600;
                    var y0 = parseFloat(pathEl.getAttribute('data-y0')) || 506.25;
                    var x1 = parseFloat(pathEl.getAttribute('data-x1')) || 675;
                    var y1 = parseFloat(pathEl.getAttribute('data-y1')) || 506.25;
                    var x2 = parseFloat(pathEl.getAttribute('data-x2')) || 656.25;
                    var y2 = parseFloat(pathEl.getAttribute('data-y2')) || 473.77;
                    var x3 = parseFloat(pathEl.getAttribute('data-x3')) || 618.75;
                    var y3 = parseFloat(pathEl.getAttribute('data-y3')) || 473.77;
                    var x4 = parseFloat(pathEl.getAttribute('data-x4')) || 637.5;
                    var y4 = parseFloat(pathEl.getAttribute('data-y4')) || 506.25;
                    var cx = 0.2 * (x0 + x1 + x2 + x3 + x4);
                    var cy = 0.2 * (y0 + y1 + y2 + y3 + y4);
                    var pt = that.svg.createSVGPoint();
                    pt.x = event.clientX;
                    pt.y = event.clientY;
                    var svgP = pt.matrixTransform(that.svg.getScreenCTM().inverse());
                    rotState = {
                        cx: cx,
                        cy: cy,
                        lastAngle: Math.atan2(svgP.y - cy, svgP.x - cx)
                    };
                },
                onmove: function(event) {
                    if (!rotState) return;
                    var pt = that.svg.createSVGPoint();
                    pt.x = event.clientX;
                    pt.y = event.clientY;
                    var svgP = pt.matrixTransform(that.svg.getScreenCTM().inverse());
                    var curAngle = Math.atan2(svgP.y - rotState.cy, svgP.x - rotState.cx);
                    var delta = curAngle - rotState.lastAngle;
                    rotState.lastAngle = curAngle;
                    var cosD = Math.cos(delta);
                    var sinD = Math.sin(delta);
                    for (var k = 0; k < 5; k++) {
                        var px = parseFloat(pathEl.getAttribute('data-x' + k)) || 600;
                        var py = parseFloat(pathEl.getAttribute('data-y' + k)) || 506.25;
                        var dx = px - rotState.cx;
                        var dy = py - rotState.cy;
                        pathEl.setAttribute('data-x' + k, rotState.cx + dx * cosD - dy * sinD);
                        pathEl.setAttribute('data-y' + k, rotState.cy + dx * sinD + dy * cosD);
                    }
                    that.updateSemicircle(pathEl);
                },
                onend: function() {
                    rotState = null;
                    that.svg.setAttribute('class', '');
                }
            });
        };

        this.addSemicircleDrag = function(pathEl) {
            that.interact(pathEl).gestureable = that.interact(pathEl).draggable({
                onstart: function(event) {
                    if (!that.rootMatrix) {
                        applyTransforms(event);
                    }
                    that.bringToFront(pathEl);
                    that.svg.setAttribute('class', 'dragging');
                },
                onmove: function(event) {
                    if (!that.rootMatrix) {
                        that.rootMatrix = that.svg.getScreenCTM();
                    }
                    var dx = event.dx / that.rootMatrix.a;
                    var dy = event.dy / that.rootMatrix.d;
                    for (var k = 0; k < 5; k++) {
                        pathEl.setAttribute('data-x' + k, (parseFloat(pathEl.getAttribute('data-x' + k)) || 600) + dx);
                        pathEl.setAttribute('data-y' + k, (parseFloat(pathEl.getAttribute('data-y' + k)) || 506.25) + dy);
                    }
                    that.updateSemicircle(pathEl);
                },
                onend: function() {
                    that.svg.setAttribute('class', '');
                }
            });
        };

        this.addShapeWheelResize = function(shapeEl, shapeType) {
            shapeEl.addEventListener('wheel', function(e) {
                e.preventDefault();
                var factor = (e.deltaY < 0) ? 1.12 : 0.89;
                // Límites: mínimo = media celda (37.5 px), máximo = fondo total menos 2 celdas (150 px)
                var cellPx = 75;
                var minSpan = cellPx * 0.5; // 37.5 px
                var maxW = (that.width || 1200) - (cellPx * 2); // 1050 px
                var maxH = (that.height || 975) - (cellPx * 2); // 825 px

                if (shapeType === 'circle') {
                    var currentR = parseFloat(shapeEl.getAttribute('r')) || 37.5;
                    var minR = minSpan / 2; // 18.75 px (diámetro = 37.5 px = 0.5 celdas)
                    var maxR = Math.min(maxW, maxH) / 2; // 412.5 px (diámetro = 825 px = alto - 2 celdas)
                    var newR = Math.max(minR, Math.min(maxR, currentR * factor));
                    shapeEl.setAttribute('r', newR);
                } else if (shapeType === 'ellipse') {
                    var rx = parseFloat(shapeEl.getAttribute('rx')) || 37.5;
                    var ry = parseFloat(shapeEl.getAttribute('ry')) || 22;
                    var spanW = 2 * rx;
                    var spanH = 2 * ry;
                    var maxAxisSpan = Math.max(spanW, spanH) || 1;
                    if (factor < 1) {
                        if (maxAxisSpan <= minSpan) return;
                        factor = Math.max(factor, minSpan / maxAxisSpan);
                    } else {
                        if (spanW >= maxW || spanH >= maxH) return;
                        factor = Math.min(factor, maxW / spanW, maxH / spanH);
                    }
                    shapeEl.setAttribute('rx', rx * factor);
                    shapeEl.setAttribute('ry', ry * factor);
                    that.updateEllipseHandles(shapeEl);
                } else if (shapeType === 'semicircle') {
                    var x0 = parseFloat(shapeEl.getAttribute('data-x0')) || 600;
                    var y0 = parseFloat(shapeEl.getAttribute('data-y0')) || 506.25;
                    var x1 = parseFloat(shapeEl.getAttribute('data-x1')) || 675;
                    var y1 = parseFloat(shapeEl.getAttribute('data-y1')) || 506.25;
                    var x2 = parseFloat(shapeEl.getAttribute('data-x2')) || 656.25;
                    var y2 = parseFloat(shapeEl.getAttribute('data-y2')) || 473.77;
                    var x3 = parseFloat(shapeEl.getAttribute('data-x3')) || 618.75;
                    var y3 = parseFloat(shapeEl.getAttribute('data-y3')) || 473.77;
                    var x4 = parseFloat(shapeEl.getAttribute('data-x4')) || 637.5;
                    var y4 = parseFloat(shapeEl.getAttribute('data-y4')) || 506.25;
                    var pts = [[x0, y0], [x1, y1], [x2, y2], [x3, y3], [x4, y4]];
                    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                    for (var b = 0; b < 5; b++) {
                        if (pts[b][0] < minX) minX = pts[b][0];
                        if (pts[b][0] > maxX) maxX = pts[b][0];
                        if (pts[b][1] < minY) minY = pts[b][1];
                        if (pts[b][1] > maxY) maxY = pts[b][1];
                    }
                    var scSpanX = (maxX - minX) || 1;
                    var scSpanY = (maxY - minY) || 1;
                    var scMaxSpan = Math.max(scSpanX, scSpanY);
                    if (factor < 1) {
                        if (scMaxSpan <= minSpan) return;
                        factor = Math.max(factor, minSpan / scMaxSpan);
                    } else {
                        if (scSpanX >= maxW || scSpanY >= maxH) return;
                        factor = Math.min(factor, maxW / scSpanX, maxH / scSpanY);
                    }
                    var cx = 0.2 * (x0 + x1 + x2 + x3 + x4);
                    var cy = 0.2 * (y0 + y1 + y2 + y3 + y4);
                    for (var s = 0; s < 5; s++) {
                        shapeEl.setAttribute('data-x' + s, cx + (pts[s][0] - cx) * factor);
                        shapeEl.setAttribute('data-y' + s, cy + (pts[s][1] - cy) * factor);
                    }
                    that.updateSemicircle(shapeEl);
                } else if (shapeEl.points) {
                    var pMinX = Infinity, pMaxX = -Infinity, pMinY = Infinity, pMaxY = -Infinity;
                    for (var m = 0; m < shapeEl.points.numberOfItems; m++) {
                        var ptB = shapeEl.points.getItem(m);
                        if (ptB.x < pMinX) pMinX = ptB.x;
                        if (ptB.x > pMaxX) pMaxX = ptB.x;
                        if (ptB.y < pMinY) pMinY = ptB.y;
                        if (ptB.y > pMaxY) pMaxY = ptB.y;
                    }
                    var polySpanX = (pMaxX - pMinX) || 1;
                    var polySpanY = (pMaxY - pMinY) || 1;
                    var polyMaxSpan = Math.max(polySpanX, polySpanY);
                    if (factor < 1) {
                        if (polyMaxSpan <= minSpan) return;
                        factor = Math.max(factor, minSpan / polyMaxSpan);
                    } else {
                        if (polySpanX >= maxW || polySpanY >= maxH) return;
                        factor = Math.min(factor, maxW / polySpanX, maxH / polySpanY);
                    }
                    var c = getPolygonCentroid(shapeEl);
                    for (var k = 0; k < shapeEl.points.numberOfItems; k++) {
                        var pt = shapeEl.points.getItem(k);
                        pt.x = c.x + (pt.x - c.x) * factor;
                        pt.y = c.y + (pt.y - c.y) * factor;
                        var useP = document.getElementById(shapeEl.id + k);
                        if (useP) {
                            useP.setAttribute('x', pt.x);
                            useP.setAttribute('y', pt.y);
                            useP.x.baseVal.value = pt.x;
                            useP.y.baseVal.value = pt.y;
                        }
                    }
                    var polyRot = document.getElementById(shapeEl.id + 'rot');
                    if (polyRot) {
                        var p0 = shapeEl.points.getItem(0);
                        var ang0 = Math.atan2(p0.y - c.y, p0.x - c.x);
                        var rX = p0.x + 14 * Math.cos(ang0);
                        var rY = p0.y + 14 * Math.sin(ang0);
                        polyRot.setAttribute('x', rX);
                        polyRot.setAttribute('y', rY);
                        polyRot.x.baseVal.value = rX;
                        polyRot.y.baseVal.value = rY;
                    }
                }
            });
        };

        this.mapShape = function(id, shapeType, colorVal, isFilled, groupRecovered) {
            var groupSVG;
            if (groupRecovered) {
                groupSVG = groupRecovered;
                shapeType = groupSVG.getAttribute('data-shape') || 'square';
            } else {
                id = 'M' + id;
                groupSVG = group(id);
                groupSVG.setAttribute('data-signal', '1');
                groupSVG.setAttribute('data-shape', shapeType);
                var fillVal = isFilled ? colorVal : '#ffffff';
                var fillOp = isFilled ? '0.65' : '0.02';

                // Tamaño inicial = 1 celda (75x75 px) centrada en (637.5, 487.5) -> de 600 a 675 en X, y de 450 a 525 en Y
                if (shapeType === 'circle') {
                    var c = circle(37.5, 637.5, 487.5, id + 'sh', fillVal, fillOp, colorVal, '3.5');
                    c.setAttribute('class', groupSVG.id);
                    c.style.cursor = 'move';
                    groupSVG.appendChild(c);
                } else if (shapeType === 'ellipse') {
                    var elp = document.createElementNS(svgNS, 'ellipse');
                    elp.setAttribute('id', id + 'sh');
                    elp.setAttribute('cx', 637.5);
                    elp.setAttribute('cy', 487.5);
                    elp.setAttribute('rx', 37.5);
                    elp.setAttribute('ry', 22);
                    elp.setAttribute('fill', fillVal);
                    elp.setAttribute('fill-opacity', fillOp);
                    elp.setAttribute('stroke', colorVal);
                    elp.setAttribute('stroke-width', '3.5');
                    elp.setAttribute('class', groupSVG.id);
                    elp.style.cursor = 'move';
                    groupSVG.appendChild(elp);
                } else if (shapeType === 'semicircle') {
                    var sc = document.createElementNS(svgNS, 'path');
                    sc.setAttribute('id', id + 'sh');
                    sc.setAttribute('data-semicircle', '1');
                    sc.setAttribute('data-x0', '600');
                    sc.setAttribute('data-y0', '506.25');
                    sc.setAttribute('data-x1', '675');
                    sc.setAttribute('data-y1', '506.25');
                    sc.setAttribute('data-x2', '656.25');
                    sc.setAttribute('data-y2', '473.77');
                    sc.setAttribute('data-x3', '618.75');
                    sc.setAttribute('data-y3', '473.77');
                    sc.setAttribute('data-x4', '637.5');
                    sc.setAttribute('data-y4', '506.25');
                    sc.setAttribute('fill', fillVal);
                    sc.setAttribute('fill-opacity', fillOp);
                    sc.setAttribute('stroke', colorVal);
                    sc.setAttribute('stroke-width', '3.5');
                    sc.setAttribute('stroke-linejoin', 'round');
                    sc.setAttribute('class', groupSVG.id);
                    sc.style.cursor = 'move';
                    groupSVG.appendChild(sc);
                } else {
                    var pts = '600,450 675,450 675,525 600,525';
                    if (shapeType === 'triangle') {
                        pts = '637.5,450 600,525 675,525';
                    } else if (shapeType === 'trapezoid') {
                        pts = '615,450 660,450 675,525 600,525';
                    }
                    var poly = polygon(pts, id + 'sh', fillVal, fillOp, colorVal, '3.5');
                    poly.setAttributeNS(null, 'stroke-linejoin', 'round');
                    poly.setAttribute('class', groupSVG.id);
                    poly.style.cursor = 'move';
                    groupSVG.appendChild(poly);
                }
            }

            that.insertMapGroup(groupSVG);
            var shapeEl = groupSVG.firstChild;
            if (shapeType === 'circle') {
                addEvents(shapeEl);
            } else if (shapeType === 'ellipse') {
                that.updateEllipseHandles(shapeEl);
                that.addEllipseDrag(shapeEl);
            } else if (shapeType === 'semicircle') {
                that.updateSemicircle(shapeEl);
                that.addSemicircleDrag(shapeEl);
            } else {
                addHandles(shapeEl, false);
                addHandlesEvents(shapeEl);
            }
            that.addShapeWheelResize(shapeEl, shapeType);
            return groupSVG;
        };

        this.setBackgroundColor = function(colorHex) {
            var bgRect = document.getElementById('dnd-bg-color');
            if (!colorHex) {
                if (bgRect && bgRect.parentNode) {
                    bgRect.parentNode.removeChild(bgRect);
                }
                return;
            }
            if (!bgRect) {
                bgRect = rect(0, 0, that.width, that.height, colorHex, '1', 'none', '0', 'dnd-bg-color');
                var defs = document.getElementById('definitions');
                if (defs && defs.nextSibling) {
                    that.svg.insertBefore(bgRect, defs.nextSibling);
                } else {
                    appendChild(bgRect);
                }
            } else {
                bgRect.setAttribute('fill', colorHex);
            }
        };

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
                    else if (groupItem.id.indexOf('M') === 0) {
                        that.mapShape(groupItem.id, null, null, null, groupItem);
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
                var bgRect = document.getElementById('dnd-bg-color');
                var insertAfter = bgRect || that.svg.firstChild;
                if (insertAfter && insertAfter.nextSibling) {
                    that.svg.insertBefore(gridRect, insertAfter.nextSibling);
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


