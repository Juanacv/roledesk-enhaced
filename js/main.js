function createSelect(id, tipo) {
	var sele = document.createElement('select');
	sele.name = 'As'+ id;
	var len = (tipo !== undefined) ? tipo.length : 10;
	for (var i=0; i<len; i++) {
		var opt = document.createElement('option');
		opt.value = i;
		if (tipo !== undefined && tipo[i] !== undefined) {
			opt.text = tipo[i];
		}
		sele.appendChild(opt);
	}
	return sele;
}
function addLog(htmlMessage) {
	var now = new Date();
	var timeStr = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);
	var $log = $('#combat-log');
	$log.prepend('<div class="log-entry">[' + timeStr + '] ' + htmlMessage + '</div>');
}
function loadSelectOptions(actionId, selectSelector) {
	$.ajax({
		url: "ajax_files.php",
		method: "POST",
		data: { id: actionId },
		dataType: "json"
	})
	.done(function(files) {
		files.sort();
		var $select = $(selectSelector);
		$.each(files, function (i, file) {
			$select.append($('<option>', { 
				value: file,
				text : file 
			}));
		});
	});
}
function getSelectFormValues() {
	loadSelectOptions("BACKGROUND", "#sel_background");
	loadSelectOptions("GETTEMPLATE", "#sel_plantilla");
}
function uploadImageForm(formElement, actionId, selectSelector) {
	var params = new FormData(formElement);
	params.append("id", actionId);
	$.ajax({
		url: "ajax_files.php",
		method: "POST",
		data: params,
		contentType: false,      
		cache: false,             
		processData: false,  
		dataType: "json"
	})
	.done(function(file) {
		$(selectSelector).append($('<option>', { 
			value: file.message,
			text : file.message,
			selected: true
		}));
		addLog('Subido nuevo recurso: <b>' + file.message + '</b>');
	})
	.fail(function(msg) {
		alert(msg.responseText);
	});
}
$(document).ready(function() {
	var states1 = ['...','Bien', 'Herido', 'Herido Grave', 'Herido de Muerte','Aturdido','Envenedado','Paralizado','Pánico','Hechizado','Muerto'];
	var states2 = ['...','Puño', 'Espada corta', 'Espada larga', 'Mandoble', 'Arco','Flecha', 'Ballesta', 'Virote','Hechizo','Daga','Honda','Patada'];
	var states3 = ['...','Sin Defensa','Escudo','Armadura','Esquivar','Hechizo','Clemencia','Contrataque','Desaparecer'];
	
	var csele = 0;
	var selectA = createSelect(csele++, states2.sort()); 
	var selectB = createSelect(csele++, states3.sort()); 
	var selectC = createSelect(csele++, states1.sort());
	var cline = 0;
	var abox = 0;
	var imagen = 0;
	var aoeCount = 0;
	var gridVisible = true;
	var svgCnv;
	
	getSelectFormValues();
	
	svgCnv = new SVGCanvas(window.interact, 1250, 975,'A','C','B','svg-edit','marco',selectA,selectB,selectC);
	$('#svg-edit').css('background-image','url(images/background/default.jpg)');
	svgCnv.toggleGrid(gridVisible);

	$("#background").on("submit", function(e) {
		e.preventDefault();
		uploadImageForm(this, "SAVEBACKGROUND", "#sel_background");
	});
	
	$("#character").on("submit", function(e) {
		e.preventDefault();
		uploadImageForm(this, "SAVECHARACTER", "#sel_character");
	});
	
	$("#sel_background").on("change", function() {
		var backimage = $(this).val();
		if (backimage !== ".." && backimage != "") {
			$('#svg-edit').css('background-image','url(images/background/'+backimage+')');
			addLog('Mapa cambiado a <b>' + backimage + '</b>');
		}
	});
	
	$("#back").on("change",function(e) {
		var file = this.files[0];
		if (!file) return;
		var match = ["image/jpeg","image/png","image/jpg","image/gif"];
		if (match.indexOf(file.type) !== -1) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#svg-edit').css('background-image','url('+e.target.result+')');
			};
			reader.readAsDataURL(file);
		}
		else {
			alert("Tipo de archivo no válido");
		}
	});
	
	$("#save-template").on("click", function() {
		var name = $("#name_template").val();
		if (name !== "" && name !== undefined) {
	 		$("g").each(function (index) {	
            	if($(this).attr('data-signal') !== undefined && $(this).attr('data-signal') === "0") {                       
                    var group = $(this)[0];
                    if (group.id.indexOf('A') != -1) {
                        svgCnv.removeNodes(group.firstChild.points.numberOfItems, group.firstChild.id);
                        var rotNode = document.getElementById(group.firstChild.id + 'rot');
                        if (rotNode) {
                            svgCnv.removeChild(rotNode);
                        }
                        svgCnv.removeChild(group);
                    }
                    else {
                        svgCnv.removeChild(group);
                    }
                }
            });
			var svg = svgCnv.toPrint();
			$.ajax({
				url: "ajax_files.php",
				method:"POST",
				data: {id:"SAVETEMPLATE", svg: svg, name: name },
				dataType:"json"
			})
			.done(function(file) {
				if (file.message !== "") {
			    	$('#sel_plantilla').append($('<option>', { 
        				value: file.message,
        				text : file.message,
        				selected: true
   		 			}));
   		 		}
   		 		addLog('Plantilla <b>' + name + '</b> guardada correctamente.');
			})
			.fail(function(msg) {
				alert(msg.responseText);
			});
		}
		else {
			alert("Debes introducir un nombre de plantilla");
		}
	});
	
	$('#sel_plantilla').on("change", function() {
		var template_name = $(this).val();
		if (!template_name || template_name === "..") return;
		var date = new Date();
		$.get('templates/' + template_name+'?'+date.getTime(), function(data) {
        	$('#marco').html('');
        	document.getElementById('marco').appendChild(data.firstChild);
        	if (svgCnv !== undefined) {
        		svgCnv.refresh();
        		svgCnv.toggleGrid(gridVisible);
        	}
        	var template_arr = template_name.split(".");
        	$('#name_template').val(template_arr[0]);
        	var groups = $('g');
        	$.each(groups, function(i, group) {
        		if (group.id.startsWith('A')) {
        			cline+=1;
        		}
        		else if (group.id.startsWith('B')) {
        			imagen+=1; 
        		}
        		else if (group.id.startsWith('C')) {
        			abox+=1;
        		}
        		else if (group.id.startsWith('D')) {
        			aoeCount+=1;
        		}
        	});
        	addLog('Plantilla cargada: <b>' + template_name + '</b>');
        });
	});
	
	$("#add-line").on("click", function() { 
		cline+=1; 	
		svgCnv.flexyLine(cline, "#38bdf8", "#00ff00"); 
		addLog('Añadida línea de <b>Ataque #' + cline + '</b>');
	});
	
	$("#add-rectangle").on("click",function() { 
		abox+=1; 
		svgCnv.analogBox(abox); 
		addLog('Añadida etiqueta de <b>Defensa #' + abox + '</b>');
	});
	
	// Estadísticas base de HP y bonificador de Iniciativa según Manual de Monstruos / Clases D&D
	var DEFAULT_STATS = {
		paladin:      { hp: 36, mod: 0,  isEnemy: false },
		mago:         { hp: 22, mod: 2,  isEnemy: false },
		hechicero:    { hp: 24, mod: 2,  isEnemy: false },
		guerrero:     { hp: 38, mod: 1,  isEnemy: false },
		picaro:       { hp: 28, mod: 4,  isEnemy: false },
		clerigo:      { hp: 31, mod: 0,  isEnemy: false },
		explorador:   { hp: 32, mod: 3,  isEnemy: false },
		barbaro:      { hp: 45, mod: 1,  isEnemy: false },
		bardo:        { hp: 27, mod: 3,  isEnemy: false },
		druida:       { hp: 29, mod: 1,  isEnemy: false },
		monje:        { hp: 30, mod: 4,  isEnemy: false },
		brujo:        { hp: 28, mod: 2,  isEnemy: false },
		trasgo:       { hp: 7,  mod: 2,  isEnemy: true },
		orco:         { hp: 15, mod: 1,  isEnemy: true },
		kobold:       { hp: 5,  mod: 2,  isEnemy: true },
		bandido:      { hp: 11, mod: 1,  isEnemy: true },
		cultista:     { hp: 9,  mod: 1,  isEnemy: true },
		esqueleto:    { hp: 13, mod: 2,  isEnemy: true },
		zombi:        { hp: 22, mod: -2, isEnemy: true },
		vampiro:      { hp: 144,mod: 4,  isEnemy: true },
		liche:        { hp: 135,mod: 3,  isEnemy: true },
		lobo:         { hp: 11, mod: 2,  isEnemy: true },
		arana:        { hp: 26, mod: 3,  isEnemy: true },
		mimico:       { hp: 58, mod: 1,  isEnemy: true },
		cubo:         { hp: 84, mod: -4, isEnemy: true },
		troll:        { hp: 84, mod: 1,  isEnemy: true },
		contemplador: { hp: 180,mod: 2,  isEnemy: true },
		azotamentes:  { hp: 71, mod: 1,  isEnemy: true },
		demonio:      { hp: 110,mod: 2,  isEnemy: true },
		elemental:    { hp: 90, mod: 2,  isEnemy: true },
		dragon:       { hp: 256,mod: 0,  isEnemy: true }
	};

	// ORDEN DE INICIATIVA Y PUNTOS DE GOLPE (HP)
	var combatants = [];
	var currentTurnIndex = 0;
	var currentRound = 1;

	function addCombatantToInitiative(name, initVal, hpVal, isEnemy, tokenId) {
		combatants.push({ name: name, init: initVal, hp: hpVal, isEnemy: !!isEnemy, tokenId: tokenId || null });
		combatants.sort(function(a, b) { return b.init - a.init; });
		renderInitiative();
	}

	$("#add-hero").on("click", function() { 
		imagen += 1; 
		var classKey = $("#sel_class").val() || "paladin";
		var classLabel = $("#sel_class option:selected").text();
		var cleanClassName = $.trim(classLabel.replace(/^[^\wÁÉÍÓÚáéíóúÑñ]+/, ''));
		var customName = $.trim($("#hero_name").val());
		var stats = DEFAULT_STATS[classKey] || { hp: 20, mod: 0, isEnemy: false };
		var finalName = customName ? customName : (stats.isEnemy ? (cleanClassName + ' #' + imagen) : cleanClassName);

		svgCnv.heroToken(imagen, classKey, finalName);
		$("#hero_name").val('');

		if (stats.isEnemy) {
			var rollInit = Math.max(1, (Math.floor(Math.random() * 20) + 1) + stats.mod);
			addCombatantToInitiative(finalName, rollInit, stats.hp, true, 'B' + imagen);
			addLog('Invocado enemigo <b>' + finalName + '</b> (Ini: <b>' + rollInit + '</b>, <b>' + stats.hp + ' HP</b>) en el mapa y añadido a Iniciativa.');
		} else {
			addLog('Invocado héroe <b>' + finalName + '</b> en el centro del mapa.');
		}
	});

	// ÁREAS DE CONJURO (AoE)
	$("#add-aoe").on("click", function() {
		aoeCount += 1;
		var val = $("#sel_aoe").val().split('|');
		var radius = parseInt(val[0], 10) || 50;
		var color = val[1] || '#ef4444';
		var label = val[2] || 'Área';
		svgCnv.spellArea(aoeCount, radius, color, label);
		addLog('Invocada <b>' + label + '</b> en el tablero.');
	});

	// CUADRÍCULA TÁCTICA D&D
	$("#toggle-grid").on("click", function() {
		gridVisible = !gridVisible;
		$(this).toggleClass("active", gridVisible);
		svgCnv.toggleGrid(gridVisible);
	});

	// LIMPIAR TABLERO
	$("#clear-board").on("click", function() {
		if (!confirm("¿Seguro que deseas eliminar todos los elementos del tablero actual?")) return;
		$("g").each(function() {
			var group = this;
			if (group.id.indexOf('A') !== -1 && group.firstChild && group.firstChild.points) {
				svgCnv.removeNodes(group.firstChild.points.numberOfItems, group.firstChild.id);
				var rotNode = document.getElementById(group.firstChild.id + 'rot');
				if (rotNode) svgCnv.removeChild(rotNode);
			}
			if (group.parentNode) group.parentNode.removeChild(group);
		});
		addLog('Tablero limpiado.');
	});

	// LANZADOR DE DADOS D&D
	var diceAudio = new Audio('sounds/alarm.mp3');
	$(".btn-die").on("click", function() {
		var sides = parseInt($(this).attr("data-sides"), 10);
		var qty = parseInt($("#dice-qty").val(), 10) || 1;
		var mod = parseInt($("#dice-mod").val(), 10) || 0;
		qty = Math.max(1, Math.min(20, qty));

		var rolls = [];
		var sum = 0;
		for (var i = 0; i < qty; i++) {
			var r = Math.floor(Math.random() * sides) + 1;
			rolls.push(r);
			sum += r;
		}
		var total = sum + mod;
		var modStr = mod > 0 ? (' + ' + mod) : (mod < 0 ? (' - ' + Math.abs(mod)) : '');
		var formula = qty + 'd' + sides + modStr;

		var critHtml = '';
		if (sides === 20 && qty === 1) {
			if (rolls[0] === 20) {
				critHtml = ' <span class="crit-hit">¡CRÍTICO NAT 20!</span>';
				try { diceAudio.currentTime = 0; diceAudio.play(); } catch(e) {}
			} else if (rolls[0] === 1) {
				critHtml = ' <span class="crit-fail">¡PIFIA NAT 1!</span>';
			}
		}

		$("#dice-result-banner").html('<span><b>' + formula + '</b> = [' + rolls.join(', ') + ']' + modStr + ' ➔ <strong style="font-size:15px;color:#f3e5ab">' + total + '</strong>' + critHtml + '</span>');
		addLog('🎲 Tirada <b>' + formula + '</b>: [' + rolls.join(', ') + '] = <b>' + total + '</b>' + critHtml);
	});

	function renderInitiative() {
		var $list = $("#init-list");
		$list.empty();
		$("#round-counter").text("Ronda " + currentRound);

		$.each(combatants, function(idx, c) {
			var isActive = (idx === currentTurnIndex);
			var isDead = (c.hp <= 0);
			var $li = $('<li class="init-item' + (isActive ? ' active-turn' : '') + '"></li>');
			var badgeColor = c.isEnemy ? ' style="background:#7f1d1d;color:#fecaca;border:1px solid #ef4444"' : '';
			$li.append('<span class="init-badge"' + badgeColor + '>' + c.init + '</span>');
			$li.append('<span class="init-name-lbl">' + (c.isEnemy ? '💀 ' : '🛡️ ') + c.name + '</span>');

			var $hpCtrl = $('<div class="init-hp-controls"></div>');
			$hpCtrl.append('<span class="hp-pill' + (isDead ? ' dead' : '') + '">' + c.hp + ' HP</span>');
			var $btnMinus = $('<button type="button" class="btn-hp" title="Restar 1 HP">-</button>');
			var $btnPlus = $('<button type="button" class="btn-hp" title="Sumar 1 HP">+</button>');
			var $btnDel = $('<button type="button" class="btn-hp" title="Eliminar">×</button>');

			$btnMinus.on("click", function() { c.hp -= 1; renderInitiative(); });
			$btnPlus.on("click", function() { c.hp += 1; renderInitiative(); });
			$btnDel.on("click", function() {
				combatants.splice(idx, 1);
				if (currentTurnIndex >= combatants.length) currentTurnIndex = 0;
				renderInitiative();
			});

			$hpCtrl.append($btnMinus, $btnPlus, $btnDel);
			$li.append($hpCtrl);
			$list.append($li);
		});
	}

	$("#add-init").on("click", function() {
		var name = $.trim($("#init-name").val());
		if (!name) return;
		var initVal = parseInt($("#init-val").val(), 10);
		if (isNaN(initVal)) {
			initVal = Math.floor(Math.random() * 20) + 1;
		}
		var hpVal = parseInt($("#init-hp").val(), 10);
		if (isNaN(hpVal)) hpVal = 20;

		combatants.push({ name: name, init: initVal, hp: hpVal });
		combatants.sort(function(a, b) { return b.init - a.init; });
		$("#init-name").val('');
		$("#init-val").val('');
		$("#init-hp").val('');
		renderInitiative();
		addLog('⚡ <b>' + name + '</b> entra en iniciativa (' + initVal + ', ' + hpVal + ' HP).');
	});

	$("#next-turn").on("click", function() {
		if (combatants.length === 0) return;
		currentTurnIndex += 1;
		if (currentTurnIndex >= combatants.length) {
			currentTurnIndex = 0;
			currentRound += 1;
			addLog('🔔 Comienza la <b>Ronda ' + currentRound + '</b>.');
		}
		var active = combatants[currentTurnIndex];
		renderInitiative();
		addLog('▶ Turno de <b>' + active.name + '</b> (' + active.hp + ' HP).');
	});

	$("#clear-init").on("click", function() {
		combatants = [];
		currentTurnIndex = 0;
		currentRound = 1;
		renderInitiative();
	});
});
