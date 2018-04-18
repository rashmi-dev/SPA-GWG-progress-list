/*
  * Copyright 2018 Study Buddies
  *  Notes [Sachin-3/22/2018]
  *  @Node class is used to represent checklist node
  *  Code is divided into different namespaces.
  *  SBP.Enums - stores fixed enums.
  *  SBP.Consts - stores constants.
  *  SBP.Data - stores common data required for page.
  *  SBP.UI - code for top level UI related calls. <try-catch layer>
  *  SBP.UIHelper - helper code for UI layer. Only called from SBP.UI
  *  SBP.Events - code to bind events and handle callbacks. <try-catch layer>
  *  SBP.EventsHelper - helper code for Event layer.  Only called from SBP.Events
  *  SBP.Helper - Generic helper code which do not belong to UI and Events layer
  *  localStorage api's are used for client side storage.
 */

SBP = {};

let Node = function (parent, isChecked) {
    let privateMembers = {
        parent: parent,
        children: [],
        isChecked: isChecked,
        group: SBP.Enums.Groups.NONE,
        status: SBP.Enums.Status.NOTCOMPLETED
    }

    return {
        get: function (property) {
            if (privateMembers.hasOwnProperty(property)) {
                return privateMembers[property];
            }
        },

        set: function (property, value) {
            if (privateMembers.hasOwnProperty(property)) {
                privateMembers[property] = value;
            }
        }
    }
};

SBP.Enums = {
    Groups: Object.freeze({
        NONE: 'none',
        HTML: 'html',
        CSS: 'css',
        JAVASCRIPT: 'javascript',
        JQUERY: 'jquery',
        PROJECTS: 'projects'
    }),
    Status: Object.freeze({
        NOTCOMPLETED: 0,
        PENDING: 1,
        COMPLETED: 2
    })

};

SBP.Consts = {
    DATA_ATTR_CATEGORY: 'data-category-type',
    ATTR_CATEGORY: 'category-type',
    LAST_PAGE_STATE: 'study-buddies-project-progress'

}

SBP.Data = {
    checkListMap: new Object()
}

SBP.UI = {
    bindPage: function () {
        try {
            SBP.UIHelper.loadData();
            $('#main-container').find('li input').each(function () {
                let id = $(this).attr("id");
                if (SBP.Data.checkListMap[id]) {
                    let isChecked = SBP.Data.checkListMap[id].isChecked;
                    $(this).prop('checked', isChecked);
                }
            });
            // Update Progress Bars
            initializeBars();
        }
        catch (ex) {
            console.log(ex.message);
        }
    },

    refreshPage: function () {
        try {
            //SBP.UI.bindPage();
            //SBP.Events.bindEvents();
        }
        catch (ex) {
            console.log(ex.message);
        }
    },

    savePage: function () {
        try {
            localStorage[SBP.Consts.LAST_PAGE_STATE] = JSON.stringify(SBP.Data.checkListMap);
        }
        catch (ex) {
            console.log(ex.message);
        }
    },

    showError: function (error) {
        if (error.message) {
            console.log(ex.message);
        } else {
            console.log(error);
        }
    }
};

SBP.UIHelper = {
    loadData: function () {
        let data = localStorage[SBP.Consts.LAST_PAGE_STATE];
        if (data) {
            let checkListMap = JSON.parse(data);
            if (checkListMap) {
                SBP.Data.checkListMap = checkListMap;
            }
        }
    },

    fillNode: function (target, node) {
        let category = target.attr(SBP.Consts.DATA_ATTR_CATEGORY);
        node.group = category;
        let isChecked = target.is(':checked');
        node.isChecked = isChecked;
    }
};

SBP.Events = {
    bindEvents: function () {
        try {
            $('#main-container').on("click", "li input", function (e) {
                SBP.Events.onListItemClicked($(e.target));
            });
        }
        catch (ex) {
            SBP.UI.showError(ex);
        }
    },

    onListItemClicked: function (target) {
        try {
            // Create node and store in map
            let id = target.attr("id");
            SBP.Helpers.updateCheckListMap(id, target);
            var grandParent = target.parent().parent();
            if (grandParent.hasClass('lesson-title')) {
                grandParent.find('li input').each(function () {
                    let childId = $(this).attr("id");
                    SBP.Helpers.updateCheckListMap(childId, $(this));
                });
            }

            // Refresh Page
            SBP.UI.refreshPage();
            // Save Page
            SBP.UI.savePage();
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
};

SBP.EventsHelper = {

};

SBP.Helpers = {
    updateCheckListMap: function (id, target) {
        let node = null;
        if (!SBP.Data.checkListMap[id]) {
            node = new Node(null, false);
            if (node) {
                SBP.Data.checkListMap[id] = node;
            }
        } else {
            node = SBP.Data.checkListMap[id];
        }
        SBP.UIHelper.fillNode(target, node);
        return node;
    }
};

$(function () {


/*Angel & Steve*/
$(function () {
  try{

      SBP.UI.bindPage();
      SBP.Events.bindEvents();
  }
  catch (ex) {
      console.log(ex.message);
  }
  $(".tabs-nav li:first-child a").click();
  $(".lesson-title").each(function() {
    if($(this).find(".exercise-list input").length === $(this).find(".exercise-list input:checked").length) {
      $(this).find(".check-box-label input").first().prop("checked", true);
      $(this).find(".check-box-label .muted").addClass("active");
    } else {
      $(this).find(".check-box-label input").first().prop("checked", false);
      $(this).find(".check-box-label .muted").removeClass("active");
    }
  });
  $(".login-area form").addClass("no-display");
  if(localStorage.getItem("isLoggedIn")==="yes"){
            $(".login-area form").addClass("no-display");
            $(".study-alt").addClass("no-display");
            $("div.login-area").removeClass("display-flex");
            $(".user-info .user-name").html(localStorage.getItem("username"));
            $(".user-info .user-email").html(localStorage.getItem("email"));
            $("main").addClass("display-flex");
            $(".user-avatar, .logo").removeClass("no-display");
            if(localStorage.getItem("theme") === "lighter") {
              $("body").addClass("lighter");
              $(".tabs-nav li a.active").click();
            } else {
              $("body").removeClass("lighter");
              $(".tabs-nav li a.active").click();
            }
            $("#theme-selector").val(localStorage.getItem("theme"));

    }
    else{
            $(".login-area form").removeClass("no-display");
            $(".study-alt").removeClass("no-display");
            $(".login-area").addClass("display-flex");
            $("main").removeClass("display-flex");
            $(".user-avatar, .logo").addClass("no-display");

    }

});
});


$(".tabs-nav a").on("click",function(){
  let toggle = $(this).attr("data-toggle");
  $(".tab-panel .panels").removeClass("active");
  $("#panel-" + toggle).addClass("active");
  $(".tabs-nav a").removeClass("active");
  $(this).addClass("active");
  $(".tabs-nav").css("border-bottom-color",$(this).css("background-color"));
  $(".progress[data-panel-ref]").attr("class", "progress");
  $(".progress[data-panel-ref=" + toggle + "]").addClass($(this).attr("data-class-ref"));
});


$("input[id*=lesson]").on("click", function(){
	
	let parent = $(this).parents(".lesson-title");
	const category = $(this).attr("data-category-type");
	const bar = $("[data-panel-ref="+category+"]");
	const overallBar = $("[data-panel-ref='overall']");

  if(parent.find(":checkbox").prop("checked")) {
    parent.find(":checkbox").prop( "checked", true );
		parent.find("span").addClass("active");
		updateBar(bar);
		updateBar(overallBar);
  } else {
    parent.find(":checkbox").prop( "checked", false );
		parent.find("span").removeClass("active");
		updateBar(bar);
		updateBar(overallBar);
  } });

$("input[id*=-]").on("click", function(){
	
  let parent = $(this).parents(".exercise-list");
	let lessonNumber = $(this).attr("id").split("-");
	const category = $(this).attr("data-category-type");
	const bar = $("[data-panel-ref="+category+"]");
	const overallBar = $("[data-panel-ref='overall']");

  if(parent.find(":checked").length === parent.find("[type=checkbox]").length) {
    $("#lesson" + lessonNumber[0]).prop("checked", true);
		$(this).parents(".lesson-title").find("span").addClass("active");
		updateBar(bar);
		updateBar(overallBar);
  } else {
    $("#lesson" + lessonNumber[0]).prop("checked", false);
		updateBar(bar);
		updateBar(overallBar);
  }

});

$("[data-trigger=collapse]").on("click",function(){
  $("#" + $(this).attr("data-toggle")).toggleClass("active");
  if($("#" + $(this).attr("data-toggle")).hasClass("active")) {
    $(this).find("i").removeClass("fa-plus");
    $(this).find("i").addClass("fa-minus");
    $(this).removeClass($(this).attr("data-button-class"));
  } else {
    $(this).find("i").removeClass("fa-minus");
    $(this).find("i").addClass("fa-plus");
    $(this).addClass($(this).attr("data-button-class"));
  }
});

$("[data-toggle=dropdown]").on("click",function(e){
  e.stopPropagation();
  let toggleRef = "#" + $(this).attr("data-toggle-ref");
  $(toggleRef).toggleClass("active");
  $(toggleRef).css({
    "right": 20,
    "top" : 0,
  });
  $(".user-avatar img").toggleClass("zoom");
});
$(".dropdown li:first-child").on("click", function(e){
  e.stopPropagation();
});
$(document).on("click", function() {
  $(".dropdown").removeClass("active");
  $(".user-avatar img.zoom").removeClass("zoom");
});

//on click event session start
$(".login-area form").submit(function(e){
    e.preventDefault();
    localStorage.setItem("username",$("#user-name").val());
    localStorage.setItem("email",$("#user-email").val());
    localStorage.setItem("theme","darker");
    //For page refresh storing the page name
    localStorage.setItem("isLoggedIn","yes");

    $(".login-area form").addClass("no-display");//added by rashmi
    $(".study-alt").addClass("no-display");
    $(".user-info .user-name").html(localStorage.getItem("username"));
    $(".user-info .user-email").html(localStorage.getItem("email"));
    $(".login-area").removeClass("display-flex");
    $("main").addClass("display-flex");
    $(".user-avatar, .logo").removeClass("no-display");
});
//logout on click event
$(".dropdown li:last-child").on("click", function(){
    $(".login-area form").removeClass("no-display");
    $(".study-alt").removeClass("no-display");
    $(".login-area").addClass("display-flex");
    $("main").removeClass("display-flex");
    $(".user-avatar, .logo").addClass("no-display");

    localStorage.removeItem("isLoggedIn");
    //remove the user info on logout
    localStorage.removeItem("name");
    localStorage.removeItem("email");

});

//  Modal
$("[data-toggle=modal]").on("click", function(){
  let refElement = "#" + $(this).attr("data-toggle-modal");
  $("#user-name-changer").val($(".user-info .user-name").html());
  $("#user-email-changer").val($(".user-info .user-email").html());
  $(refElement).addClass("active");
});
$("#changer-accept").on("click", function(e) {
  e.preventDefault();
  localStorage.setItem("username",$("#user-name-changer").val());
  localStorage.setItem("email",$("#user-email-changer").val());
  localStorage.setItem("theme",$("#theme-selector").val());
  $(".user-info .user-name").html($("#user-name-changer").val());
  $(".user-info .user-email").html($("#user-email-changer").val());
  if($("#theme-selector").val() === "lighter") {
    $("body").addClass("lighter");
    $(".tabs-nav li a.active").click();
  } else {
    $("body").removeClass("lighter");
    $(".tabs-nav li a.active").click();
  }
  $(".modal").removeClass("active");
});
$("#changer-discard").on("click", function(e) {
  e.preventDefault();
  $(".modal").removeClass("active");
  $("#user-name-changer").val($(".user-info .user-name").html());
  $("#user-email-changer").val($(".user-info .user-email").html());
});




function getBarProgress(barCategory) {

	if (barCategory === 'overall') {
		return {
			'checkedBoxes': $('.exercise-list input:checked').length,
			'totalBoxes': $('.exercise-list input').length
		};
	}
	else {
		return {
			'checkedBoxes': $('.exercise-list input[data-category-type='+barCategory+']:checked').length,
			'totalBoxes': $('.exercise-list input[data-category-type='+barCategory+']').length
		};
	}
}


function getBarPercent(barProgress) {

  return Math.round((barProgress.checkedBoxes / barProgress.totalBoxes) * 100);
}


function getBarWidth(bar) {

	if (bar.width() === 0) {
		return 0;
	}
	else {
		return Math.round((bar.width() / bar.parent().width()) * 100); 
	}
}


function updateBarText(barCategory, barProgress) {

	const spanID = '#' + barCategory + '-span';
	$(spanID).text(barProgress.checkedBoxes + '/' + barProgress.totalBoxes + ' Completed' ).css('display','block');
}


// update progress of category bar
function updateBar(bar, barFillSpeed=1) {

	const barCategory = bar.attr('data-panel-ref');
	const barProgress = getBarProgress(barCategory);
	const barPercent = getBarPercent(barProgress);
	let barWidth = getBarWidth(bar); // initial width
	let time = setInterval(fillBar, barFillSpeed); // control bar animation

  function fillBar() {
	
    if (barWidth === barPercent) {
      clearInterval(time); // stop interval
		}
    else if (barWidth <= barPercent) { // increase bar
      barWidth++;
			bar.css('width', barWidth + '%'); 
			bar.text(barWidth + '%');
		}  
		else if (barWidth >= barPercent) { // decrease bar
			barWidth--;
			bar.css('width', barWidth + '%'); 
			bar.text(barWidth + '%');
		}  
	}
	updateBarText(barCategory, barProgress);
}


function initializeBars() {

	const barFillSpeed = 10;

	$('[data-panel-ref]').each(function(i,obj) {
		updateBar($(this), barFillSpeed);
	})
}


//Testing the info button//
$("<i class='fas fa-info-circle'></i>").prependTo(".user-avatar");
$(".fa-info-circle").css({
  'position': 'absolute',
  'color':'white',
  'list-style':'none',
  'font-size': '25px',
  'margin-left': '75px',
  'margin-top': '-4px',
  'display': 'flex',
  'cursor':'pointer'});

$(".fa-info-circle").click(function() {
  $("#info-modal").addClass("active");
});
$("[data-close=modal]").on("click", function() {
  $(this).parents(".modal").removeClass("active");
});
