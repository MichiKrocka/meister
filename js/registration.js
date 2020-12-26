window.reigstration = true;
// #####################################################################
var AccessDir = window.location.pathname.substr(
      1,
      window.location.pathname.lastIndexOf("/")
    ),
    DIR_LANG      = "locale",     // directory with languages
    DIR_THEMES    = "themes",     // directory with themes

    SQL_BASE_DIR  = "database/meister_sql/",
    SQL_SYS_BASE  = SQL_BASE_DIR + "m4_sys.sqlite",
    SQL_COMP_BASE = SQL_BASE_DIR + "competition/",

    REFRESH_TIME  = 500,  // ms

    sTabCnt = "A",
    $tabs   = null,
    iComp   = "",
    aComp   = [],
    ClassHtml = "";
// #####################################################################
$(window)
.resize(set_scroll);
// #####################################################################
function start(){
  set_lang("de-de", function(){
    // email
    $("input[name=email]")
    .keyup(function(ev){
      change_email();
    })
    .change(function(ev){
      change_email();
    })
    .focus();
    // buttons
    $("button", "table.layout")
    .button()
    .click(function(ev){
      choice(this);
    });
    $tabs = $("#id_tabs").tabs({
      heightStyle: "fill"
    });
    get_competitions();
  });
  // Refresh -----------------------------------------------------------
  setTimeout(refresh, REFRESH_TIME);
  set_scroll();
}
// #####################################################################
function choice(el){
  var $tab = $(el).closest("table.c_data");
  switch($(el).data("choice")){
    case "HELP":
      help();
      break;
    case "SEND":
      if(send_check())
        send_message();
      break;
    case "DELETE":
      remove_all(el);
      break;
    case "ADD":
      add($tab);
      break;
    case "DEL":
      remove(el);
      break;
    case "CLASS":
      var iClass = el.value,
          sClass = $("option:selected", el).text();
      $("li.ui-state-active a", $tabs).text(sClass);
      if(aComp[iComp].s == "U"){
        get_team(iClass, function(html){
        $("select[name=team]", $tab)
          .html(html)
          .selectmenu("refresh")
        });
      }
      break;
    case "TEAM":
      break;
    case "LIST":
      if(iComp == ""){
        $("select[name=comp]")
        .selectmenu("open");
        return;
      }
      var $class = $("select[name=class]", $tab);
      if($class.val() == ""){
        $class
        .selectmenu("open");
        return;
      }
      var $team = $("select[name=team]", $tab);
      var iTeam = $team.val();
      if(iTeam == ""){
        $team
        .selectmenu("open");
        return;
      }
      make_list(iTeam);
      break;
    case "CLASS_DEL":
      var ix = $tabs.tabs("option", "active"),
          id = $("li.ui-state-active a", "#id_tabs").prop("hash");
      if(typeof id == "undefined")
        return;
      $(id + ",li.ui-state-active", "#id_tabs").remove();
      var n = $("li a", "#id_tabs").length;
      if(n == 0){
        sTabCnt = String.fromCharCode("A".charCodeAt(0) - 1);
        add_class();
        return;
      }
      if(ix >= n - 1)
        ix = n - 1;
      $tabs
      .tabs("refresh")
      .tabs("option", "active", ix)
      .tabs("refresh");
      break;
    case "CLASS_ADD":
      add_class();
      break
    default:
      console.log($(el).data("choice"));
  }
}
// #####################################################################
function set_scroll(){
  $("#id_tabs")
  .height(100);
  var h = $("#id_tabs").parent().height();
  $("#id_tabs")
  .height(h);
}
// #####################################################################
function send_check(){
  var OK = true;
  // email
  var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i),
      dateRegex  = new RegExp(/^[12][90][0-9]{2}-[01][0-9]-[0-3][0-9]$/);
  if(!emailRegex.test($("input[name=email]").val())){
    $("input[name=email]").focus();
    return false;
  }
  // competition
  if(iComp == ""){
    $("select[name=comp]").selectmenu("open");
    return false;
  }
  // iteration over tabs
  $("div.ui-tabs-panel", "#id_tabs").each(function(ix){
    if(!OK)
      return;
    // class
    if($("select[name=class]", this).val() == ""){
      $("a", $tabs)[ix].click()
      $("select[name=class]", this).selectmenu("open");
      OK = false;
    }
    // team
    if(OK && aComp[iComp].s == "U" && $("select[name=team]", this).val() == ""){
      $("a", $tabs)[ix].click()
      $("select[name=team]", this).selectmenu("open");
      OK = false;
    }
    // 1. row
    $("tbody tr:first-child input[type=text]", this).each(function(){
      if(OK && this.value == ""){
        $("a", $tabs)[ix].click()
        this.focus();
        OK = false;
      }
      if($(this).hasClass("datepicker") && !dateRegex.test(this.value)){
        $("a", $tabs)[ix].click()
        this.focus();
        OK = false;
      }
    });
    // all
    $("tbody tr input.datepicker[type=text]", this).each(function(){
      if($(this).hasClass("datepicker") && !dateRegex.test(this.value)){
        $("a", $tabs)[ix].click()
        this.focus();
        OK = false;
      }
    });
  });
  return OK;
}
// #####################################################################
function send_message(){
  $("#id_dialog")
  .html('<textarea style="width:600px;height:400px;background:white" class="ui-widget-content"></textarea>')
  .dialog({
    height:   "auto",
    width:    "auto",
    modal:    true,
    title:    _("Message") + " - " + _("optional"),
    buttons: [{
      text: _("Send"),
      click: function(ev){
        $("input[name=message]").val($("textarea", this).val());
        send_data();
        $(this).dialog("close");
      }
    },{
      text: _("Cancel"),
      click: function(ev){
        $(this).dialog("close");
      }
    }],
    close: function(ev){
      $(this).dialog("destroy");
    }
  });
}
// #####################################################################
// OK
function send_data(){
  var o = {},
      text = "";
  text = $.sprintf(
    '%s\n'+
    '\n'+
    '%-15s: %s\n'+
    '%-15s: %s\n'+
    '%-15s: %s\n'+
    '',
    _("Registration").toUpperCase(),
    _("Email"), $("input[name=email]").val(),
    _("Competition"), aComp[iComp].label,
    _("Judge"), $("input[name=judge]").val()
  );
  // iteration over tabs
  $("div.ui-tabs-panel", "#id_tabs").each(function(ix){
    var val = [],
        val_string = [];
    var iClass = $("select[name=class]", this).val(),
        iTeam  = $(".U select[name=team]", this).val(),
        sTeam  = $(".R input[name=team]", this).val();
    if(iTeam != "")
      sTeam = aComp[iComp].aTeam[iTeam].Team;
    $("tbody tr", this).each(function(ix){
      var v = {};
      $("input", this).each(function(){
        v[this.name] = this.value;
      });
      if(v.surename != "" && v.forename != ""){
        val.push(v);
        val_string.push($.sprintf(
          '%02i %5i %s %s %s %s',
          ix + 1, v.aid, v.surename, v.forename, v.birthday, v.club
        ));
      }
    });
    o = {
      base: SQL_COMP_BASE + aComp[iComp].base,
      cmd:  [{
        sgn:   "SEND",
        query: "INSERT INTO registration (datum,class_id,team,email,judge,message,valid,val) VALUES(?,?,?,?,?,?,?,?)",
        para: [
          date_time().E+" "+date_time().T,
          aComp[iComp].aClass[iClass].id,
          sTeam,
          $("input[name=email]").val(),
          $("input[name=judge]").val(),
          $("input[name=message]").val(),
          '-',
          JSON.stringify(val)
        ]
      }]
    };
    o.cmd = JSON.stringify(o.cmd);
    $.post("/sql", o, function(D){
    }, "json");
    text = text + $.sprintf(
      '\n'+
      '%-15s: %s\n'+
      '%-15s: %s\n'+
      '%s\n'+
      '%s\n'+
      '',
      _("Class"), aComp[iComp].aClass[iClass].Class,
      _("Team"), sTeam,
      _("Competitors"),
      val_string.join("\n")
    );
  });

  var msg = $("input[name=message]").val();
  if(msg != "")
    text = text + $.sprintf(
      '\n'+
      '%s\n'+
      '\n'+
      '%s\n'+
      '',
      _("Message"), msg
    );

  $.post("/eml", {
    text:    text,
    to:      $("input[name=email]").val(),
    cc:      aComp[iComp].advice,
    subject: _("Registration")+" - "+aComp[iComp].label,
  }, function(D){
    send_ok(D);
  }, "json");
}
// #####################################################################
function send_ok(msg){
  var EmailOK = "OK";
  if(msg.state != "OK"){
    setTimeout(function(){
      $("#id_Msg").text("");
    }, 10000);
    $("#id_Msg").text(msg.state);
    EmailOK = _("failed");
  }
  $("#id_dialog")
  .html(
    '<ul>'+
      '<li>'+_("Registration")+' - OK</li>'+
      '<li>'+_("Email")+' - '+EmailOK+'</li>'+
    '</ul>'
  )
  .dialog({
    height:   "auto",
    width:    "auto",
    modal:    true,
    title:    _("Message"),
    buttons: [{
      text: _("Close"),
      click: function(ev){
        $(this).dialog("close");
      }
    }],
    close: function(ev){
      $(this).dialog("destroy");
    }
  });
}
// #####################################################################
// OK
function add($tab){
  $tr = $("table.c_tr tr").clone();
  // surename
  $("input[name=surename]", $tr)
  .autocomplete({
    minLength: 2,
    position: {
      my: "left top",
      at: "left bottom",
      collision: "flip"
    },
    source: function(request, response){
      var o = {
        base: SQL_BASE_DIR + "m4_athlete.sqlite",
        cmd:  [{
          sgn:   "MEMBER",
          query: "SELECT id,surename||' '||forename||' '||birthday||'  '||IFNULL((SELECT club FROM club WHERE club.id=cid),'') AS label,surename AS value,forename,birthday,IFNULL((SELECT club FROM club WHERE club.id=cid),'') AS club FROM athlete WHERE label LIKE(?) ORDER BY surename LIMIT 100",
          para: ["%"+request.term+"%"]
        }]
      };
      o.cmd = JSON.stringify(o.cmd);
      $.post("/sql", o, function(D){
        response(D.MEMBER);
      });
    },
    select: function(ev, ui){
      var $tr = $(this).parent().parent();
      $("input[name=forename]", $tr).val(ui.item.forename);
      $("input[name=birthday]", $tr).val(ui.item.birthday);
      $("input[name=club]",     $tr).val(ui.item.club);
      $("input[name=aid]",      $tr).val(ui.item.id);
      if($tr.is(":last-child"))
        add($tab);
      else
        $("input[name=surename]", $tr.next()).focus();
    }
  });
  // club
  $("input[name=club]", $tr)
  .autocomplete({
    minLength: 2,
    position: {
      my: "left top",
      at: "left bottom",
      collision: "flip"
    },
    source: function(request, response){
      var o = {
        base: SQL_BASE_DIR + "m4_athlete.sqlite",
        cmd:  [{
          sgn:   "CLUB",
          query: "SELECT club AS value FROM club WHERE club LIKE(?) ORDER BY club LIMIT 100",
          para: ["%"+request.term+"%"]
        }]
      };
      o.cmd = JSON.stringify(o.cmd);
      $.post("/sql", o, function(D){
        response(D.CLUB);
      });
    },
    select: function(ev, ui){
      var $tr = $(this).parent().parent();
      $("input[name=club]", $tr).val(ui.item.value);
    }
  });
  // birthday
  $("input[name=birthday]", $tr)
  .val(date_time().E)
  .datepicker({
    dateFormat:"yy-mm-dd"
  });
  // remove button
  $("button", $tr)
  .button({
  })
  .click(function(ev){
    choice(this);
  });
  $("tbody", $tab).append($tr);
  $("input[name=surename]", $tr).focus();
}
// #####################################################################
function remove(el){
  var $tab = $(el).closest("table.c_data");
  $(el).parent().parent().remove();
  if($("tbody tr", $tab).length == 0)
    add($tab);
}
// #####################################################################
function remove_all(el){
  var $tab = $(el).closest("table.c_data");
  $("tbody tr", $tab).remove();
  add($tab);
}
// #####################################################################
function make_list(iTeam){
// OK
  var o = {
    base: SQL_COMP_BASE + aComp[iComp].base,
    cmd:  [{
      sgn:   "TEAM",
      query: "SELECT surename||' '||forename AS Name,birthday,club FROM competitor WHERE team_id=? ORDER BY nr,Name ASC",
      para: [aComp[iComp].aTeam[iTeam].id]
    }]
  };
  o.cmd = JSON.stringify(o.cmd);
  $.post("/sql", o, function(D){
    D = D.TEAM;
    if(D.length == 0)
      return;
    var tr = [];
    for(var i in D)
      tr.push($.sprintf(
        '<tr class="ui-widget-content">'+
          '<td style="text-align:right">%i.</td>'+
          '<td>%s</td>'+
          '<td>%s</td>'+
          '<td>%s</td>'+
        '</tr>',
        parseInt(i) + 1,
        D[i].Name, D[i].birthday, D[i].club
      ));
    $("#id_dialog")
    .html(
      '<table class="c_list">'+
        '<tr class="ui-widget-header">'+
          '<th>#</th>'+
          '<th>'+_("Name")+'</th>'+
          '<th>'+_("Birthday")+'</th>'+
          '<th>'+_("Club")+'</th>'+
        '</tr>'+
        tr.join("")+
      '</table>'
    )
    .dialog({
      height:   "auto",
      width:    "auto",
      modal:    true,
      title:    aComp[iComp].aTeam[iTeam].Team,
      buttons: [{
        text: _("Cancel"),
        click: function(ev){
          $(this).dialog("close");
        }
      }],
      close: function(ev){
        $(this).dialog("destroy");
      }
    });
  });
}
// #####################################################################
function change_email(){
  $("select[name=comp]").selectmenu(this.value != "" ? "enable":"disable");
}
// #####################################################################
// OK
function change_competition(ev, ui){
  iComp  = ui.item.value;
  if(iComp == ""){
    $tabs.hide();
    return;
  }
  if(aComp[iComp].s == "R"){
    $(".R").show();
    $(".U").hide();
  } else {
    $(".R").hide();
    $(".U").show();
  }
  $tabs
  .find("li, div.ui-tabs-panel")
  .remove();
  $tabs
  .show();
  sTabCnt = String.fromCharCode("A".charCodeAt(0) - 1);
  get_class(function(){
    add_class();
  });
}
// #####################################################################
function add_class(){
// OK
  sTabCnt = String.fromCharCode(sTabCnt.charCodeAt(0) + 1);
  $tabs
  .find(".ui-tabs-nav")
  .append($.sprintf('<li><a href="#tab-%s">%s</a></li>', sTabCnt, _("Class")));
  $tabs
  .append($.sprintf('<div id="tab-%s"></div>', sTabCnt))
  .tabs("refresh");

  $($.sprintf('a[href="#tab-%s"]', sTabCnt))
  .click();
  var $table = $("table.c_data").last().clone();
  $table = $("table.c_data").last().clone();

  $("button", $table)
  .button()
  .click(function(ev){
    choice(this);
  });
  $("select[name=class]", $table)
  .html(ClassHtml)
  .selectmenu({
    change: function(){
      choice(this);
    }
  })
  .selectmenu("menuWidget")
  .css("max-height", "300px");
  $("select[name=team]", $table)
  .selectmenu({
    change: function(){
      choice(this);
    }
  });
  $table
  .show();
  add($table);
  $("#tab-" + sTabCnt)
  .append($table);
  $("select[name=class]", "#tab-" + sTabCnt)
  .selectmenu("open");
}
// #####################################################################
// OK
function get_competitions(){
  var o = {
    base: SQL_SYS_BASE,
    cmd:  [{
      sgn:   "COMP",
      query: "SELECT id,s,advice,code,datum,info,strftime('%Y',datum) AS Year FROM competition WHERE s IN ('R','U') ORDER BY datum DESC",
      para: []
    }]
  };
  o.cmd = JSON.stringify(o.cmd);
  $.post("/sql", o, function(D){
    var CompBase = "",
        Datum    = "",
        Label    = "";
    D = D.COMP;
    for(var i in D){
      Datum = D[i].datum.split("-");
      Datum = Datum[2]+"."+Datum[1]+"."+Datum[0];
      Label = $.sprintf('%s %s', Datum, D[i].info);
      CompBase = $.sprintf(
        "%s_%s.sqlite", D[i].datum.replace(/-/g, "_"), D[i].code
      );
      aComp.push({
        id:     D[i].id,
        s:      D[i].s,
        advice: D[i].advice,
        label:  Label,
        base:   CompBase,
        aClass: [],
        aTeam:  []
      });
      $("select[name=comp]").append(
        '<option value="'+i+'">'+Label+'</option>'
      );
      // competition selectmenu
      $("select[name=comp]").selectmenu({
        disabled: $("input[name=email]").val() == "",
        change: change_competition
      });
    }
  }, "json");
}
// #####################################################################
// OK
function get_class(callBack){
  var aTmp = ['<option value="" class="lang">'+_("Class")+'</option>'];
  var o = {
    base: SQL_COMP_BASE + aComp[iComp].base,
    cmd:  [{
      sgn:   "CLASS",
      query: "SELECT id,sex||' '||name AS Class FROM class ORDER BY Class",
      para: []
    }]
  };
  o.cmd = JSON.stringify(o.cmd);
  $.post("/sql", o, function(D){
    aComp[iComp].aClass = [];
    D = D.CLASS;
    for(var i in D){
      aComp[iComp].aClass.push({
        id:    D[i].id,
        Class: D[i].Class
      });
      aTmp.push('<option value="'+i+'">'+D[i].Class+'</option>');
    }
    ClassHtml = aTmp.join("");
    callBack();
  }, "json");
}
// #####################################################################
function get_team(iClass, callBack){
// OK
  var aTmp = ['<option value="" class="lang">'+_("Team")+'</option>'];
  if(iClass == ""){
    callBack(aTmp.join(""));
    return;
  }
  var o = {
    base: SQL_COMP_BASE + aComp[iComp].base,
    cmd:  [{
      sgn:   "TEAM",
      query: "SELECT id,name AS Team,class_id FROM team WHERE class_id=? ORDER BY Team",
      para: [aComp[iComp].aClass[iClass].id]
    }]
  };
  o.cmd = JSON.stringify(o.cmd);
  $.post("/sql", o, function(D){
    D = D.TEAM;
    aComp[iComp].aTeam = [];
    for(var i in D){
      aComp[iComp].aTeam.push(D[i]);
      aTmp.push('<option value="'+i+'">'+D[i].Team+'</option>');
    }
    callBack(aTmp.join(""));
  }, "json");
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
  .load('registration_help.htm', function(){
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
