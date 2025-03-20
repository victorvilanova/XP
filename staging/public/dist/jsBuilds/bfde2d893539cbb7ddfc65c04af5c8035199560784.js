"use strict";var SubscriptionsSettings={selectedSubID:null,redirectTo:'subscriptions',confirmSubCancelation:function(subIDToCancel,redirectTo='subscriptions'){SubscriptionsSettings.redirectTo=redirectTo;SubscriptionsSettings.selectedSubID=subIDToCancel;$('#subscription-cancel-dialog').modal('show');},cancelSubscription:function(){updateButtonState('loading',$('#subscription-cancel-dialog .btn'),trans('Confirm'));window.location.href=app.baseUrl+'/subscriptions/'+SubscriptionsSettings.selectedSubID+'/cancel/'+SubscriptionsSettings.redirectTo;}};"use strict";$(function(){});$(window).scroll(function(){initStickyComponent('.settings-menu-wrapper','sticky-sm');});var GeneralSettings={updateFlagSetting:function(key,value){$.ajax({type:'POST',data:{'key':key,'value':value},dataType:'json',url:app.baseUrl+'/my/settings/flags/save',success:function(result){if(result.success){launchToast('success',trans('Success'),trans('Setting saved'));}
else{launchToast('danger',trans('Error'),trans('Setting save failed'));}},error:function(){launchToast('danger',trans('Error'),trans('Setting save failed'));}});}};"use strict";var AiSuggestions={targetedClass:null,suggestionType:null,initAISuggestions:function(selector,type){this.setTargetedClass(selector);this.setSuggestionType(type);AiSuggestions.setDefaultDescription(type);},suggestDescriptionDialog:function(){$('#suggest-description-dialog').modal('show');if(this.suggestionType==='stream'){$('#stream-update-dialog').modal('hide');}},setTargetedClass(className){this.targetedClass=className;},setSuggestionType(type){this.suggestionType=type;},saveSuggestion:function(){let description=$('#ai-request').val();let validDescription=this.validateDescription();if(validDescription){$('#ai-request').removeClass('is-invalid');$('#suggest-description-dialog').modal('hide');if(this.suggestionType==='profile'){if(app.allow_profile_bio_markdown){ProfileSettings.mdeEditor.value(description);}
else{$(this.targetedClass).val(description);}}
else{$(this.targetedClass).val(description);}
if(this.suggestionType==='stream'){$('#stream-update-dialog').modal('show');}
$('#ai-request').removeClass('is-invalid');}},clearSuggestion:function(){$('#ai-request').val('');},suggestDescription:function(){let validDescription=this.validateDescription();if(validDescription){$('#ai-request').removeClass('is-invalid');updateButtonState('loading',$('.suggest-description'),trans('Suggest'),'light');let route=app.baseUrl+'/suggestions/generate';let data={'text':$('#ai-request').val()+trans('Do not include any explanation.'),};$.ajax({type:'POST',data:data,url:route,success:function(response){if(response.message){$('#ai-request').val(response.message);}
updateButtonState('loaded',$('.suggest-description'),trans('Suggest'));},error:function(result){if(result.status===422||result.status===500){launchToast('danger',trans('Error'),result.responseJSON.message);}
else if(result.status===403){launchToast('danger',trans('Error'),'Something went wrong, please try again');}
updateButtonState('loaded',$('.suggest-description'),trans('Suggest'));}});}},validateDescription:function(){let description=$('#ai-request').val();if(description.length<5){$('#ai-request').addClass('is-invalid');return false;}
return true;},setDefaultDescription:function(type){let description;if(type==='post'){description=trans('Write me a short post description to post on my profile',{'siteName':app.siteName});}else if(type==='profile'){description=trans('Write me a short profile bio description',{'siteName':app.siteName});}
else if(type==='stream'){description=trans('Write me a shot stream title',{'siteName':app.siteName});}
if(description){$('#ai-request').val(description);}}};