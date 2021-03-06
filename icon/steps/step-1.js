function init(step) {

	var parser = document.createElement('a');
	parser.href = Wizard.config.pageUrl;
	console.log(parser);

	var dataRequest = Wizard.config.baseUrl + 'site/data.json?page='
			+ parser.pathname + '&' + location.hash.substring(1);// 'edit-block-0-type-icon';

	promise.get(dataRequest).then(function(error, text, xhr) {
		if (error) {
			alert('Error ' + xhr.status);
			return;
		}
		console.log("result block data json : " + text);
		var json = JSON.parse(text);
		getData(dataRequest);
	});

	console.log(Wizard.config.pageUrl + location.hash);
	function getData(dataRequest) {

		var req = dataRequest;
		if(req == ""){
			req = Wizard.config.baseUrl + 'site/blocks/block-video/icon/data/icon.json';
		}
		promise
				.get(req)
				.then(
						function(error, text, xhr) {
							if (error) {
								alert('Error ' + xhr.status);
								return;
							}
							var starting_value = JSON.parse(text).data;

							if(typeof(starting_value) == "undefined"){
								starting_value = JSON.parse(text);
							}
							// Initialize the editor
							var editor = new JSONEditor(document
									.getElementById('editor_holder-' + step), {
								// Enable fetching schemas via ajax
								ajax : true,
								// The schema for the editor
								schema : {
									type : "object",
									title : "Icon",
									"properties" : {
										"title" : {
											"type" : "string"
										},
										"icon" : {
											"type" : "string",
											"enum" : [ "rocket", "sign",
													"flag", "office",
													"employees", "hands",
													"bubble", "money", "lamp",
													"patent", "scale",
													"milestone", "roadmap" ],
											"default" : "rocket",
										},
										"background" : {
											"type" : "string",
											"enum" : [ "green", "blue", "red",
													"purple", "pink" ],
											"default" : "green",
										},
										"categories" : {
											"type" : "string",
											"default" : "cat-one cat-all"
										},
										"num" : {
											"type" : "number",
											"default" : 12,
										},
										"txt" : {
											"type" : "string",
											"default" : "",
										},
										"width" : {
											"type" : "number",
											"default" : 340,
										},
										"height" : {
											"type" : "number",
											"default" : 340,
										}
									}
								},
								// Seed the form with a starting value
								startval : starting_value,
								// Disable additional properties
								no_additional_properties : true,
								disable_edit_json : true,
								disable_properties : true,
								disable_collapse : true,
								// Require all properties by default
								required_by_default : true
							});
							// Hook up the submit button to log to the console
							document
									.getElementById('submit-' + step)
									.addEventListener(
											'click',
											function(event) {
												event.stopPropagation();
												console.log(editor.validate());
												Wizard.goToNextStep(event);
												console
														.log('sending to swagger api');
												console.log(editor.getValue());

												var hash = location.hash
														.split('=');
												var data = hash[1].split('-');
												var meta = {
													"absolute-url" : document
															.getElementById(
																	'iframe')
															.getAttribute('src'),
													"state" : data[0],
													"block" : data[2],
													"type" : data[4],
													"template" : Wizard.widgetJson[data[4]].template
												}
												console.log(meta);

												var fullData = {
													"meta" : meta,
													"editor" : editor
															.getValue(),
												}

												var jsonString = JSON
														.stringify(fullData);

												var data = {
													"id" : 112,
													"data" : jsonString
												};

												promise
														.post(
																'http://localhost:8080/api/block',
																data)
														.then(
																function(error,
																		text,
																		xhr) {
																	if (error) {
																		alert('Error '
																				+ xhr.status);
																		return;
																	}
																	console
																			.log(text);
																	document
																			.getElementById('iframe').contentWindow.location = location.href;
																});

											});

						});
	}
}