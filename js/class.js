/*

 x-Kampf n-Runden
 AK8-AK14  Pflicht/Kür/Finale

 AK8-14 Männer
 AK8-14 / komplett - Männer
 Kür 6 Kampf Männer
 Kür 4 Kampf Frauen
 6 Kampf N-Runden Männer

 DefaultVal
 DefaultOpt
 MakeOptForm
 MakeValForm

 */
var oClass = {
  // -------------------------------------------------------------------
  // definition of default classes
  // key:   name of class
  // value: array of rounds
  //    name: name of round
  //    A:    array of devices
  //      g: name of device
  //      v: >= 0 gewicht/wertigkeeit
  //         <  0 max
  //      r: roll
  DefaultOpt: {
    "6 Kampf Männer / 1 Runde": [{
      name:"6 Kampf", A:[
        {g:"Boden", v:1,r:"1"},{g:"Pferd", v:1,r:"2"},
        {g:"Ringe", v:1,r:"3"},{g:"Sprung",v:1,r:"4"},
        {g:"Barren",v:1,r:"5"},{g:"Reck",  v:1,r:"6"}
      ]
    }],
    "6 Kampf Männer / 4 Runden": [{
      name:"1.Runde", A:[
        {g:"Boden", v:1,r:"1"},{g:"Pferd", v:1,r:"2"},
        {g:"Ringe", v:1,r:"3"},{g:"Sprung",v:1,r:"4"},
        {g:"Barren",v:1,r:"5"},{g:"Reck",  v:1,r:"6"}
      ]
    },{
      name:"2.Runde", A:[
        {g:"Boden", v:1,r:"1"},{g:"Pferd", v:1,r:"2"},
        {g:"Ringe", v:1,r:"3"},{g:"Sprung",v:1,r:"4"},
        {g:"Barren",v:1,r:"5"},{g:"Reck",  v:1,r:"6"}
      ]
    },{
      name:"3.Runde", A:[
        {g:"Boden", v:1,r:"1"},{g:"Pferd", v:1,r:"2"},
        {g:"Ringe", v:1,r:"3"},{g:"Sprung",v:1,r:"4"},
        {g:"Barren",v:1,r:"5"},{g:"Reck",  v:1,r:"6"}
      ]
    },{
      name:"4.Runde", A:[
        {g:"Boden", v:1,r:"1"},{g:"Pferd", v:1,r:"2"},
        {g:"Ringe", v:1,r:"3"},{g:"Sprung",v:1,r:"4"},
        {g:"Barren",v:1,r:"5"},{g:"Reck",  v:1,r:"6"}
      ]
    }],
    "8 Kampf AK8-16 Männer / 1 Runde": [{
      name:"Pflicht",  A:[
        {g:"Boden", v:1,r:"1"},{g:"Pferd", v:0.5,r:"2,2a"},
        {g:"Pilz", v:0.5,r:"2,2b"},
        {g:"Ringe", v:1,r:"3"},{g:"Sprung",v:0.5,r:"4,4a"},
        {g:"Methodisch", v:0.5,r:"4,4b"},
        {g:"Barren",v:1,r:"5"},{g:"Reck",  v:1,r:"6"}
      ]
    }],
    "8 Kampf AK8-16 Männer / Komplett": [{
      name:"Pflicht", A:[
        {g:"Boden", v:1,r:"1"},{g:"Pferd", v:0.5,r:"2,2a"},
        {g:"Pilz", v:0.5,r:"2,2b"},
        {g:"Ringe", v:1,r:"3"},{g:"Sprung",v:0.5,r:"4,4a"},
        {g:"Methodisch", v:0.5,r:"4,4b"},
        {g:"Barren",v:1,r:"5"},{g:"Reck",  v:1,r:"6"}
      ]
    },{
      name:"Kür", A:[
        {g:"Boden", v:1,r:"1"},{g:"Pferd", v:1,r:"2"},
        {g:"Ringe", v:1,r:"3"},
        {g:"1.Sprung",v:-1,r:"4"},{g:"2.Sprung",v:-1,r:"4"},
        {g:"Barren",v:1,r:"5"},{g:"Reck",  v:1,r:"6"}
      ]
    },{
      name:"Finale", A:[
        {g:"Boden", v:1,r:"1"},{g:"Pferd", v:1,r:"2"},
        {g:"Ringe", v:1,r:"3"},
        {g:"1.Sprung",v:0.5,r:"4"},{g:"2.Sprung",v:0.5,r:"4"},
        {g:"Barren",v:1,r:"5"},{g:"Reck",  v:1,r:"6"}
      ]
    }],
    "4 Kampf Frauen / 1 Runde": [{
      name:"4 Kampf", A:[
        {g:"Sprung",v:1,r:"1"},{g:"Barren",v:1,r:"2"},
        {g:"Balken",v:1,r:"3"},{g:"Boden", v:1,r:"4"}
      ]
    }],
    "4 Kampf Frauen / 1 Runde / 2 Sprünge": [{
      name:"4 Kampf", A:[
        {g:"1.Sprung",v:-1,r:"1"},{g:"2.Sprung",v:-1,r:"1"},
        {g:"Barren",v:1,r:"2"},
        {g:"Balken",v:1,r:"3"},{g:"Boden", v:1,r:"4"}
      ]
    }]
  },
  // -------------------------------------------------------------------
  // get default values
  // aC: class =  array of rounds
  //    name: name of round
  //    A:    array of devices
  //      g: name of device
  //      v: >= 0 gewicht/wertigkeeit
  //         <  0 max
  //      r: roll
  // aG: array of devices with values
  //    D: dificulty
  //    E: Ex
  //    N: neutral
  //    V: "x"-valid, "-" not valid
  DefaultVal: function(aC, aG, empty){
    if(typeof aC == "undefined"){
      for(var x in this.DefaultOpt){
        aC = this.DefaultOpt[x];
        break;
      }
    }
    var one = empty ? {} : {D:"", E:"", N:"", V:"x"},
        R   = [],
        I   = aC.length; // rounds
    for(var i = 0;i < I;i++){
      var J = aC[i].A.length, // devices
          r = [];
      for(var j = 0;j < J;j++){
        r.push(
          aG && aG[i] && aG[i][j] ?
          $.extend(true, {}, one, aG[i][j]):
          $.extend(true, {}, one)
        );
      }
      R.push(r);
    }
    return R;
  },
  // -------------------------------------------------------------------
  /*
  [
    [   Runde 1
      {D,E,N,S,V,X}, Gerät 1, S-Summe, V-Valid, X-Streichwert
      {D,E,N,S,V,X}, Gerät 2
      ...
      {D,E,N,S,V,X}, Gerät n
      S              Summe
    ],
    [   Runde 2
    ],
    ...
    [   Runde m
    ]
  ]
  */
  // -------------------------------------------------------------------
  // oC: class
  //  name: class name
  //  type: class type
  //  r:
  //  sex:
  //  bscores:
  //  tscores:
  //  val: array of rounds
  //    name: name of round
  //    A:    array of devices
  //      g: name of device
  //      v: >= 0 gewicht/wertigkeeit
  //         <  0 max
  //      r: roll
  // oA:  competitor data
  //  val: array of rounds
  //    A: devices with values
  //      D: dificulty
  //      E: abzüge
  //      N: neutral
  //      V: "x"-valid, "-" not valid
  //      X: strike value
  //      T: strike valeu for team
  //      S: value of device (D - E - N)
  //    S: sum of devices
  CalcOne: function(oC, oA, iR){
    // !!!!!!!!!
    if(typeof oC == "undefined" || oC.val == "" || $.isEmptyObject(oC.val)){
      aError.push(_("Class")+"?");
      return _("Class")+"?";
    }
    if(typeof oC.rounds != "undefined")
      oC = oC.rounds;
    if(typeof oA == "undefined"){
      aError.push(_("Round")+"?");
      return null;
    }
    var R  = oC.val.length; // number of rounds
    // loop over rounds ................................................
    if(typeof iR == "undefined")
      var iRmin = 0, iRmax = R;
    else {
      iR = Math.max(iR, 0);
      var iRmin = iR, iRmax = iR + 1;
    }
    var val = this.DefaultVal(oC.val, oA.val);
//    oA.val = val;
    $.extend(true, oA.val, val);
    for(var r = iRmin;r < iRmax;r++){
      var aSort = [];
          aC = oC.val[r].A,
          aG = oA.val[r],
          G  = aC.length;     // number of devices
      // make value of every device
      for(var g = 0;g < G;g++){
        aG[g].S =
          aG[g].D === "" && aG[g].E === "" && aG[g].N === "" ?
          "" :
          Math.round(
            Math.max(0.0,
              parseFloat(aG[g].D === "" ? 0 : aG[g].D) +
              parseFloat(aG[g].E === "" ? 0 : aG[g].E) +
              parseFloat(aG[g].N === "" ? 0 : aG[g].N)
            ) * 1000// * Math.abs(aC[g].v)
          ) / 1000;
        aG[g].X = aG[g].V != "-"; // Wertung für Einzeln
        aG[g].T = aG[g].V == "x"; // Wertung für Team
        aSort.push(g);
      }
      // looking for negative v <=> max <=> strike value
      for(var g = 0;g < G;g++){
        if(aC[g].v >= 0 || !aG[g].X)
          continue;
        var gMax = g,
            vMax = aC[g].v,
            sMax = aG[g].S;
        aG[g].X = true;
        for(var gM = g + 1;gM < G;gM++){
          if(aC[gM].v != vMax || !aG[gM].X)
            continue;
          if(aG[gM].S > sMax){
            aG[gMax].X = false;
            gMax = gM;
            sMax = aG[gM].S;
          } else {
            aG[gM].X = false;
          }
        }
      }
      var bscores = oC.bscores == null || oC.bscores == "" ? G : oC.bscores;
      // find best "bscores" devices and make sum
      aSort.sort(function(a, b){
        if(!aG[a].X && !aG[b].X)
          return 0;
        else if(!aG[a].X)
          return 1;
        else if(!aG[b].X)
          return -1;
        return aG[b].S - aG[a].S;
      });
      var S  = 0.0,
          gs = 0;
      for(var g = 0;g < G;g++){
        var i = aSort[g];
        if(gs < bscores && aG[i].S !== "" && aG[i].X){
          S = S + aG[i].S * Math.abs(aC[i].v);
          gs++;
        } else {
          oA.val[r][i].X =  false;
        }
      }
      oA.val[r].S = gs ? Math.round(S * 1000) / 1000 : "";
    }
  },
  // -------------------------------------------------------------------
  // oC - class
  // aA - array of oA competitors
  // aR - array of rounds
  // V  - valid
  // -------------------------------------------------------------------
  CalcAll: function(oC, aA, aR, V){
    // calculate every competitors with valid == V
    for(var i in aA){
      aA[i].SS = "";
      if(aA[i].valid === V){
        aA[i].SS = 0;
        for(var r in aR){
          this.CalcOne(oC, aA[i], aR[r]);
          aA[i].SS += aA[i].val[aR[r]].S == "" ? 0 : aA[i].val[aR[r]].S;
        }
      }
    }
    // sort only valid == V
    aA.sort(function(a, b){
      if(a.valid != V && b.valid != V)
        return 0;
      else if(a.valid != V)
        return 1;
      else if(b.valid != V)
        return -1;
      return b.SS - a.SS;
    });
    // calculate rating
    var iRang = 0,
        S       = "";
    for(var i in aA){
      if(aA[i].SS != S){
        S = aA[i].SS;
        iRang = parseInt(i) + 1;
      }
      aA[i].Rang = iRang;
    }
  },
  // -------------------------------------------------------------------
  // oC - class
  // aA - array of oA competitors
  // iR - round
  // V  - valid
  // return aG - array group by roll [[index in aA, sum, rang],...]
  // -------------------------------------------------------------------
  CalcDevices: function(oC, aA, iR){
    this.GroupRoll(oC);
    var aG = [],
        aC = oC.val[iR].A;
    for(var gr in oC.aGR[iR]){
      for(var i in aA){
        if(aA[i].valid === "-")
          continue;
        this.CalcOne(oC, aA[i], iR);
        var SS = 0.0,
            W  = false;
        for(var gi in oC.aGR[iR][gr]){
          var g = oC.aGR[iR][gr][gi],
              S = aA[i].val[iR][g].S,
              V = aC[g].v;
          if(S !== ""){
            W = true;
            if(V < 0)
              SS = Math.max(SS, Math.abs(V) * S);
            else
              SS += Math.abs(V) * S;
          }
        }
        if(!W)
          SS = "";
        if($.isArray(aG[gr]))
          aG[gr].push([i, SS]);
        else
          aG[gr] = [[i, SS]];
      }
      // calculate rang for all gr
      aG[gr].sort(function(a, b){
        return b[1] - a[1];
      });
      var S = "",
          R = 0;
      for(var i in aG[gr]){
        if(S != aG[gr][i][1]){
          S = aG[gr][i][1];
          R = parseInt(i) + 1;
        }
        aG[gr][i][2] = R;
      }
    }
    return aG;
  },
  // -------------------------------------------------------------------
  // oC - class  => oC.aGR
  // -------------------------------------------------------------------
  GroupRoll: function(oC){
    var aGR = [],
        xSw;
    // Group by roll
    for(var r in oC.val){
      aGR[r] = [];
      var aRTmp = [];
      for(var g in oC.val[r].A){
        xSw = true;
        aRoll = oC.val[r].A[g].r.split(",");
        for(var iTmp in aRTmp){
          if(aRTmp[iTmp].filter(
            function(n){
              return aRoll.indexOf(n) != -1;
            }).length)
          {
            xSw = false;
            aGR[r][iTmp].push(parseInt(g));
            aRTmp[iTmp].push.apply(aRTmp[iTmp], aRoll);
            break;
          }
        }
        if(xSw){
          aRTmp.push(aRoll);
          aGR[r].push([parseInt(g)]);
        }
      }
    }
    oC.aGR = aGR;
  },
  // -------------------------------------------------------------------
  // oC - class
  // aA - array of oA competitors
  // aT - array of teams
  // aR - array of rounds
  // -------------------------------------------------------------------
  CalcTeam: function(oC, aA, aT, aR){
    this.GroupRoll(oC);
    this.CalcAll(oC, aA, aR, "x");
    // all teams
//console.log(aA);
    for(var t in aT){
      aT[t].SG = {}; // rounds sums of device's groups {{[s,...],S:},...]
      aT[t].SS = 0.0;
      // find team's members
      aT[t].comps = [];
      aT[t].members = [];
      for(var i in aA){
        if(typeof aA[i].SS == "undefined" || aA[i].SS == "")
          break;
        if(aA[i].team_id == aT[t].id){
          aT[t].comps.push(parseInt(i));
          aT[t].members.push(aA[i].surename+" "+aA[i].forename);
        }
      }
      // all rounds
      for(var rx in aR){
        var r = aR[rx];
        aT[t].SG[r] = {};
        aT[t].SG[r].S = 0.0;
        // all groups of devices
        for(var gr in oC.aGR[r]){
          var aMS = []; // [[i, s],...]
          // all members of team
          for(var ix in aT[t].comps){
            var i = aT[t].comps[ix],
                s = 0.0,
                W = false;
            // all devices in group
            for(var gi in oC.aGR[r][gr]){
              var g = oC.aGR[r][gr][gi],
                  S = aA[i].val[r][g].S,
                  V = aC[g].v;
              if(S !== "" && aA[i].val[r][g].V == "x"){
                W = true;
                if(V < 0)
                  s = Math.max(s, Math.abs(V) * S);
                else
                  s += Math.abs(V) * S;
              }
            }
            if(!W){
              s = "";
              // all devices in group
              for(var gi in oC.aGR[r][gr]){
                var g = oC.aGR[r][gr][gi];
                aA[i].val[r][g].T = false;
              }
            }
            aMS.push([i, s]);
          }
          // sort
          aMS.sort(function(a, b){
            if(a[1] === "" && b[1] === "")
              return 0;
            else if(a[1] === "")
              return 1;
            else if(b[1] === "")
              return -1;
            return b[1] - a[1];
          });
          // filter & sum
          var S = 0.0;
          for(var ms in aMS){
            if(ms >= oC.tscores){
              // all devices in group
              for(var gi in oC.aGR[r][gr]){
                var g = oC.aGR[r][gr][gi];
                aA[aMS[ms][0]].val[r][g].T = false;
              }
            } else
              S += aMS[ms][1] == "" ? 0 : aMS[ms][1];
          }
          S = Math.round(S * 1000) / 1000;
          aT[t].SG[r][gr] = S;
          aT[t].SG[r].S += S;
        }
        aT[t].SG[r].S = Math.round(aT[t].SG[r].S * 1000) / 1000;
        aT[t].SS += aT[t].SG[r].S;
        // out of concurence
        if(aT[t].valid == "" || aT[t].valid == "x")
          aT[t].SG[r].SSv = true;
        else
          aT[t].SG[r].SSv = aT[t].valid.split(",").indexOf((r + 1).toString()) >= 0;
      }
    }
    // rang of rounds
    for(var rx in aR){
      var r = aR[rx];
      aT.sort(function(a, b){
        if(a.SG[r].SSv && b.SG[r].SSv)
          return b.SG[r].S - a.SG[r].S;
        return b.SG[r].SSv - a.SG[r].SSv;
      });
      var S = 0.0;
          R = 0;
      // rang
      for(var t in aT){
        if(S != aT[t].SG[r].S){
          S = aT[t].SG[r].S;
          R = parseInt(t) + 1;
        }
        aT[t].SG[r].R = R;
      }
    }
    // end rang
    aT.sort(function(a, b){
        if(a.SSv && b.SSv)
          return b.SS - a.SS;
        if(!a.SSv  &&  !b.SSv)
          return 0;
        return b.SSv - a.SSv;
    });
    var S = 0.0;
        R = 0;
    // rang
    for(var t in aT){
      if(S != aT[t].SS){
        S = aT[t].SS;
        R = parseInt(t) + 1;
      }
      aT[t].rang = R;
    }
  },
  // -------------------------------------------------------------------
  MakeForm: function(iR, oC){
    if(typeof oC == "undefined" || oC.val == "" || $.isEmptyObject(oC.val)){
      aError.push(_("Class")+"?");
      return _("Class")+"?";
    }
    iR = Math.max(iR, 0);
    var aC = oC.val[iR].A,
        tr = [
      ['<td class="ui-widget-header">'+oC.val[iR].name+'</td>'],
      ['<td class="ui-widget-header">D</td>'],
      ['<td class="ui-widget-header">E</td>'],
      ['<td class="ui-widget-header">N</td>'],
      ['<td class="ui-widget-header">D+E+N</td>']
    ],
    TabIndx = 100;
    for(var g in aC){
      var C = aC[g],
          sC = C.r.replace(",", " ");
      tr[0].push(
        $.sprintf(
          '<td class="ui-widget-content ui-state-disabled %s">'+
            '<input data-enum=\'["x","o","-"]\' data-r=\''+C.r+'\' type="button" tabindex="-1" class="enum lang-title" title="Valid">'+
          '</td>'+
          '<td class="ui-widget-header ui-state-disabled dev %s"><div>%s</div></td>',
          sC, sC, C.g
        )
      );
      tr[1].push($.sprintf('<td class="ui-widget-content ui-state-disabled %s" colspan="2"><input type="text" tabindex="%i" data-r=\''+C.r+'\'></td>', sC, TabIndx  + 0));
      tr[2].push($.sprintf('<td class="ui-widget-content ui-state-disabled %s" colspan="2"><input type="text" tabindex="%i" data-r=\''+C.r+'\'></td>', sC, TabIndx  + 1));
      tr[3].push($.sprintf('<td class="ui-widget-content ui-state-disabled %s" colspan="2"><input type="text" tabindex="%i" data-r=\''+C.r+'\'></td>', sC, TabIndx  + 2));
      tr[4].push('<td class="ui-widget-content" colspan="2"><input type="text" disabled></td>');
      TabIndx  += 3;
    }
    tr[4].push('<td class="ui-widget-content"><input type="text" disabled class="sum"></td>');
    return ''+
      '<tr data-v="V">'+tr[0].join("")+'<td class="ui-widget-header" colspan="2"></td></tr>'+
      '<tr data-v="D">'+tr[1].join("")+'<td class="ui-widget-header" colspan="2"></td></tr>'+
      '<tr data-v="E">'+tr[2].join("")+'<td class="ui-widget-header" colspan="2"></td></tr>'+
      '<tr data-v="N">'+tr[3].join("")+'<td class="ui-widget-header">'+_("Sum")+'</td><td class="ui-widget-header"></td></tr>'+
      '<tr data-v="S">'+tr[4].join("")+'<td class="ui-widget-header"></td></tr>';
  },
  // -------------------------------------------------------------------
}
// nodejs --------------------------------------------------------------
if(typeof exports != "undefined")
  exports.oClass = oClass;
// ---------------------------------------------------------------------
