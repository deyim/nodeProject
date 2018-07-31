//common
$(function(){
    $('.reload').click(function() {
        location.reload();
    });
});
//make numbers for list_table '번호'cell 
$(document).ready(function(){
    var rows = $('.list_table > tbody > tr'); 
    var text = 'textContent' in document ? 'textContent' : 'innerText';

    for (var i = 0, len = rows.length; i < len; i++){
        rows[i].children[1][text] = i+1;
    }
})

//smart editor submit contents
function submitContents(elClickedObj) {
	oEditors.getById["content"].exec("UPDATE_CONTENTS_FIELD", []);	// 에디터의 내용이 textarea에 적용됩니다.
	// 에디터의 내용에 대한 값 검증은 이곳에서 document.getElementById("ir1").value를 이용해서 처리하면 됩니다.
	
	try {
		//elClickedObj.form.submit();
        document.forms[0].submit();
	} catch(e) {}
}	

$(document).ready(function(){
    $("#m1").hide();
}); 


(function($){
    $(window).on("load",function(){
        $(".menuarea").mCustomScrollbar();
    });
})(jQuery);

function changeInputValue(value) {
    document.getElementById("changedInput").name = value
}

function chooseAll() {
    checkboxes = document.getElementsByName('checked');
    for(i=0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked){
            checkboxes[i].checked = false;
        }
        else{
            checkboxes[i].checked = true;
        }
    }
}


$(document).ready(function(){
    $(document).on('change', '#change_date', function(){
        if($(this).val()==0){
            $('#src_date').val('');
            $('#target_date').val('');
            return;
        }        
        var mydate = $('#src_date').val().split('-');
        mydate = new Date(mydate[0], mydate[1]-1, mydate[2]);
        
        mydate.setMonth(mydate.getMonth()+Number($(this).val()));

        var mm = mydate.getMonth() + 1; // getMonth() is zero-based
        var dd = mydate.getDate();

        var targetDate = [mydate.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd,
        
        ].join('-');

        $('#target_date').val(targetDate);

    });
}); 

$(function(){
    let mytype = $('#type_selector').val();
    $('#type').attr('name', mytype);
    $(document).on('change', '#type_selector', function(){
        let mytype = $(this).val();
        $('#type').attr('name', mytype);
    });
    
})

$(function(){
    $(".modify").click(function(){
        $(".alert_modify").show();
    });
});

$(function(){
    $(".delete").click(function(){
        $(".alert_delete").show();
    });
});


$(function(){
    $(".close").click(function(){
        $(".alert_modify").hide();
        $(".alert_delete").hide();
        $(".order_view").hide();
        $(".add_view").hide();
        $(".message_show").hide();
        $(".message_list").hide();
        $(".message_list").hide();
        $(".order_info_show").hide();
        $(".message_window").hide();
        $(".paidChk_alert").hide();
        $(".denyChk_alert").hide();
        $(".cancelReason_alert").hide();
		$(".cancelDeny_alert").hide();
        $(".cancelAllow_alert").hide();
        $(".placeChk_alert").hide();
        $(".fileUpload_alert").hide();

    });
});

//admin,master - orders
$(function(){
    $("#order_code").click(function(){
        $(".order_view").show();
    });
});

$(document).ready(function(){
    $(".paidChk_alert").hide();
    $(".denyChk_alert").hide();
    $(".placeChk_alert").hide();
    $(".fileUpload_alert").hide();
}); 

$(function(){
    $(".fileUpload").click(function(){
        $(".fileUpload_alert").show();
    });
});

$(function(){
    $(".paidChk").click(function(){
        $(".paidChk_alert").show();
    });
});

$(function(){
    $(".denyChk").click(function(){
        $(".denyChk_alert").show();
    });
});

$(function(){
    $(".placeChk").click(function(){
        $(".placeChk_alert").show();
    });
});

$(document).ready(function(){
    $('.fileUpload').click(function(e){
        $('.fileUpload_alert #store_id').val(e.target.id[0]);
        $('.fileUpload_alert #img_or_logo').attr('name',e.target.id.slice(2,));
        $('.fileUpload_alert input:submit').attr('name',e.target.id.slice(2,));
    })
});


$(function(){
   let periodType = $("#checkPeriodType").val();
   let periodTarget = "periodType_"+periodType;
   $('#'+periodTarget).prop('checked', true);
   let countType = $("#checkPeriodType").val();
   let countTarget = "countType_"+countType;
   $('#'+countTarget).prop('checked', true);
});

$(function(){
    $("#this_add").click(function(){
        $(".add_view").show();
    });
});


//message index
$(function(){
    $(".message_title").click(function(){
        $(".message_show").show();
    });
});

$(function(){
    $(".message_num").click(function(){
        $(".message_list").show();
    });
});
$(function(){
    $(".info_view").click(function(){
        $(".order_info_show").show();
    });
});


//admin - members index
$(function(){
    $(".message_write").click(function(){
        $(".message_window").show();
    });
})


//admin - members show

// $(function(){
//     $(".message_write").click(function(){
//         $(".message_window").show();
//     });
// })

// $(function(){
//     $(".close").click(function(){
//         $(".message_window").hide();
//     });
// });