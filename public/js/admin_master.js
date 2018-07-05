//common
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
    });
});

$(function(){
    $("#order_code").click(function(){
        $(".order_view").show();
    });
});


$(function(){
    $(".close").click(function(){
        $(".order_view").hide();
    });
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


$(function(){
    $(".close").click(function(){
        $(".add_view").hide();
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
    $(".close").click(function(){
        $(".message_show").hide();
    });
});

$(function(){
    $(".close").click(function(){
        $(".message_list").hide();
    });
});

$(function(){
    $(".info_view").click(function(){
        $(".order_info_show").show();
    });
});


$(function(){
    $(".close").click(function(){
        $(".order_info_show").hide();
    });
});


