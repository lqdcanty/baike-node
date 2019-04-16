var express = require('express');
var request = require('request');
var api="http://192.168.0.27:18080";
module.exports={
   getIndex:function () {

   },
   getUnread:function () {

   },
};
function getForm(url, form, callback) {
  var apiUrl=api+url;
  request(apiUrl, function (error, response, body) {
    resultFunction(callback,error,response,body);
  });
};

function postForm(url,form,callback) {
  var apiUrl=api+url;
  request.post({url:apiUrl, form:form}, function (error, response, body) {
    resultFunction(callback,error,response,body);
  });
};

function resultFunction(callback,error, response, body){
  if (!error && response.statusCode === 200) {
    callback({success: true, msg: body});
    console.log('request is success ');
  } else {
    console.log('request is error', error);
    callback({success: false, msg: error});
  }
}

