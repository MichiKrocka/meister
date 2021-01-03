window.winner = true;
// #####################################################################
var AccessDir = window.location.pathname.substr(
      1,
      window.location.pathname.lastIndexOf("/")
    ),
    DIR_LANG      = "locale",     // directory with languages
    DIR_THEMES    = "themes",     // directory with themes

    SQL_BASE_DIR  = "data/meister_sql/",
    SQL_SYS_BASE  = SQL_BASE_DIR + "m4_sys.sqlite",
    SQL_COMP_BASE = SQL_BASE_DIR + "competition/",

    REFRESH_TIME  = 500,  // ms

    comp_id  = "",
    class_id = "",
    aComp    = [];
// #####################################################################
function start(){
  $(window).resize(set_scroll);
  set_lang("de-de", function(){
    load_competition();
  });
  $("button.help")
  .button()
  .click(function(ev){
    help();
  });
  // choice competition ------------------------------------------------
  $("#id_Comp").delegate("div", "click", function(ev){
    $("div", "#id_Comp").removeClass("ui-state-active");
    $(this).addClass("ui-state-active");
    $("#id_Info").text(aComp[$(this).index()].info);
    CompBase = aComp[$(this).index()].CompBase+".sqlite";
    comp_id = aComp[$(this).index()].id;
    load_class();
  });
  // hover competition + class -----------------------------------------
  $("#id_Comp,#id_Class").delegate("div", "mouseenter", function(ev){
    $(this).addClass("ui-state-hover");
  });
  $("#id_Comp,#id_Class").delegate("div", "mouseleave", function(ev){
    $(this).removeClass("ui-state-hover");
  });
  // choice class ------------------------------------------------------
  $("#id_Class").delegate("div", "click", function(ev){
    $("div", "#id_Class").removeClass("ui-state-active");
    $(this).addClass("ui-state-active");
    class_id = aClass[$(this).index()].id;
    make_list();
  });
  // Refresh -----------------------------------------------------------
  setTimeout(refresh, REFRESH_TIME);
  set_scroll();
}
// #####################################################################
// load competitions
function load_competition(){
  var o = {
    base: SQL_SYS_BASE,
    cmd:  [{
      sgn:   "COMP",
      query: "SELECT id,datum,code,info,REPLACE(datum, '-', '_') || '_' || code AS CompBase FROM competition WHERE s IN ('X','W','U') ORDER BY datum DESC,code",
      para: []
    }]
  };
  o.cmd = JSON.stringify(o.cmd);
  $.post("/sql", o, function(D){
    if(D.COMP.length){
      aComp = D.COMP;
      var TD = [];
      for(var c in aComp){
        TD.push('<div>'+aComp[c].datum+' '+aComp[c].code+'</div>');
      }
      $("#id_Comp").html(TD.join(""));
    } else {
      $("#id_Comp").text("");
      $("#id_Msg").text(_("No rows to display"));
    }
  });
}
// #####################################################################
// load classes
function load_class(){
  var o = {
    base: SQL_COMP_BASE + CompBase,
    cmd:  [{
      sgn:   "CLASS",
      query: "SELECT id,sex,name FROM class ORDER BY name",
      para: []
    }]
  };
  o.cmd = JSON.stringify(o.cmd);
  $.post("/sql", o, function(D){
    if(D.CLASS.length){
      aClass = D.CLASS;
      var TD = [];
      for(var c in aClass){
        TD.push($.sprintf(
          '<div>%s %s</div>',
          aClass[c].sex,
          aClass[c].name          
        ));
      }
      $("#id_Class").html(TD.join(""));
    } else {
      $("#id_Class").text("");
      $("#id_Msg").text(_("No rows to display"));
    }
  });
}
// #####################################################################
function make_list(){
  if(window.W != null && !window.W.closed)
    window.W.close();
  var report = {
    dbuser:       "",
    type:         "ONE",
    open:         true,
    recId:        comp_id,
    class_id:     class_id,
    lang:         "de-de",//oUser.lang,
    DIR_LANG:     DIR_LANG,
    SQL_BASE_DIR: SQL_BASE_DIR,
    SQL_SYS_BASE: SQL_SYS_BASE,
    SQL_COMP_BASE:SQL_COMP_BASE
  };
  window.W = window.open(
    "list.htm"+window.route,
    JSON.stringify(report),
    'scrollbars=yes,toolbar=no,width=900,height=700,resizable=yes'
  );
  window.W.focus();
}
// #####################################################################
function set_scroll(){
  $("#id_Comp").height(100);
  var H = $("#id_Comp").parent().height();
  $("#id_Comp").height(H);
}
// #####################################################################
var Tpre = "";
function refresh(){
  var T = date_time();
  T = $.sprintf("%s %s", T.D, T.T);
  if(T != Tpre){
    $("#id_Time").text(T);
    Tpre = T;
  }
  delete T;
  setTimeout(refresh, REFRESH_TIME);
}
// #####################################################################
function help(){
  var $dialog = $('<div id="menu">');
  $dialog
  .load('winner_help.htm', function(){
    $(this)
    .dialog({
      resizable: false,
      height:   "auto",
      width:    "80%",
      title:    _("Help"),
      modal:    true,
      buttons:  [{
        text: _("Close"),
        click: function(ev){
          $(this).dialog("close");
        }
      }],
      open: function(){
      },
      close: function(){
        $(this).dialog("destroy");
      }
    });
  });
}
// #####################################################################
