var helper = {
	numero:function(obj){
		obj.value=obj.value.replace(/[^.,0-9]/g, '');
	},
	alfaNum:function(obj){
		obj.value=obj.value.replace(/[^.,0-9a-z]/gi, '');
	},
	alfa:function(obj){
		obj.value=obj.value.replace(/[€}@#$=_\-\+\*\|!:;?£¤,<>&"%{£¤]/gi, '');
	},
	data:function(obj){
		obj.value=obj.value.replace(/[^0-9\-]/gi, '');
	},
	_ajax:function(_url,_method,_data,_dataType,_sucess){
		$.ajax({
			url:_url,
			data:_data,
			type:_method,
			dataType:_dataType,
			//async:false,
			success:_sucess
		});
	},
	setInfo:function(value,idField,obj,oValue,oIdField){
		$("#"+oIdField).val(oValue);
		$("#"+idField).val(value);
		$(obj).remove();
	},
	pesquisa:function(idField,idResult,url,paramName){
		var value = $("#"+idField).val(), sucesso=function(html){
			$("#"+idResult).html(html);
		};
		if(value != undefined && value.length > 1)
			this._ajax(url,"GET",paramName+"="+value,"text",sucesso);
	},
	validate:function(campo, valid){
		if(valid){
			var _valid = true;
			if(jQuery("#"+campo).val()==null){
	      _valid = false;
	      jQuery("#"+campo).parent().addClass("has-error");
	    }else{
	      if(jQuery("#"+campo).val().length==0){
	        _valid = false;
	        jQuery("#"+campo).parent().addClass("has-error");
	      }else{
	      	jQuery("#"+campo).parent().removeClass("has-error");
	      }
	    }
			return _valid;
		}else{
			return valid;
		}
	},
	validate2:function(campo, valid){
		if(valid){
			var _valid = true;
			if(jQuery("#"+campo).val()==null){
				_valid = false;
				jQuery("#"+campo).parent().parent().addClass("has-error");
			}else{
				if(jQuery("#"+campo).val().length==0){
					_valid = false;
					jQuery("#"+campo).parent().parent().addClass("has-error");
				}else{
					jQuery("#"+campo).parent().parent().removeClass("has-error");
				}
			}
			return _valid;
		}else{
			return valid;
		}
	},
	mensage:function(msg,tipo){
		var alert ='<div class="alert alert-'+tipo+' alert-dismissible" role="alert">';
		alert = alert+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
		alert = alert+ msg + '</div>';
		return alert;
	}
};
