(function(){function jispCompile(src){var _ref,_ref0;if("undefined"!=typeof src&&src.length>0){try{_ref=js_beautify(jisp.compile($("<div/>").html(src).text(),{wrap:!1}),{indent_size:2})}catch(err){console.log(err.stack),_ref=err.message}_ref0=_ref}else _ref0="";return _ref0}return angular.module("jispApp",["ngAnimate","mgcrea.ngStrap","jispApp.controller"]).config(function($provide){return $provide.decorator("$browser",function($delegate){return $delegate.onUrlChange=function(){},$delegate.url=function(){return""},$delegate})}).directive("modelInit",function($compile){return{restrict:"A",priority:1010,link:function(scope,elem,attrs){return scope[attrs.modelInit]=elem.text().trim(),elem.attr("ng-model",attrs.modelInit),elem.removeAttr("model-init"),$compile(elem)(scope),scope.$watch("exampleCode",function(input){return scope.compiledCode=jispCompile(input)}),scope.evalJS=function(){var res,consoleLog;res="",consoleLog=console.log,console.log=function(){var s,_i,_i0,_ref,str=1<=arguments.length?[].slice.call(arguments,0,_i=arguments.length-0):(_i=0,[]);for(_ref=str,_i0=0;_i0<_ref.length;++_i0)s=_ref[_i0],res+=s+=" ";return res=res.slice(0,-1),res+="\n"};try{eval(scope.compiledCode)}catch(err){err.message}return scope.evalJSOutput=res,console.log=consoleLog,scope.showJSOutput=!0}}}}).directive("isolatedCode",function(){return{priority:1020,restrict:"E",template:"<div ng-transclude></div>",transclude:!0}}),angular.module("jispApp.controller",[]).controller("MainControl",function($scope,$location,$anchorScroll){return $scope.gotoTop=function(){return $location.hash("top"),$anchorScroll(),$location.hash("")},console.log(jisp.eval('(console.log "If we’re seeing this, jisp.eval works.")'))})}).call(this);