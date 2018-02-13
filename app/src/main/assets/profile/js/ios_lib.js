/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function openCustomURLinIFrame(src)
{
    var rootElm = document.documentElement;
    var newFrameElm = document.createElement("IFRAME");
    newFrameElm.setAttribute("src",src);
    rootElm.appendChild(newFrameElm);
    //remove the frame now
    newFrameElm.parentNode.removeChild(newFrameElm);
}

function calliOSFunction(functionName, args, successCallback, errorCallback)
{
    var url = "js2ios://";

    var callInfo = {};
    callInfo.functionname = functionName;
    if (successCallback)
    {
        callInfo.success = successCallback;
    }
    if (errorCallback)
    {
        callInfo.error = errorCallback;
    }
    if (args)
    {
        callInfo.args = args;
    }

    url += JSON.stringify(callInfo)

    openCustomURLinIFrame(url);
}


calliOSFunction("sayHello", ["Ram"], "onSuccess", "onError");

function onSuccess (ret)
{
    if (ret)
    {
        var obj = JSON.parse(ret);
        document.write(obj.result);
    }
}

function onError (ret)
{
    if (ret)
    {
        var obj = JSON.parse(ret);
        document.write(obj.error);
    }
}


