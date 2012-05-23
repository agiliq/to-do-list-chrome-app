(function() {

  $(document).ready(function() {
    var onEnter_newlist, renderToDoList, saveListItem, saveListName, todolistapp2987;
    todolistapp2987 = {};
    renderToDoList = function() {
      var addedClass, checked, detailsindex, html_listitem, i, item, listitem, output, singlelist, todolist;
      if ("todolist" in localStorage) {
        todolist = JSON.parse(localStorage.todolist);
        output = "<table id='table_todolist' >";
        i = 0;
        for (singlelist in todolist) {
          html_listitem = "<div id='listcontainer_" + singlelist + "' class='listcontainer' listindex='" + singlelist + "'><div id='listname_" + singlelist + "' class='listname' data='" + singlelist + "' listindex='" + singlelist + "'>" + todolist[singlelist].name + "</div><div id='divlist_" + singlelist + "' class='divlist' data='" + singlelist + "' listindex='" + singlelist + "' ></div><center><input type='text' id='listitem_" + singlelist + "' class='listitem_input' placeholder='Type and hit enter' listindex='" + singlelist + "' /></center><div id='list_icons_" + singlelist + "' class='list_icons' listindex='" + singlelist + "' style='display:none' ><img src='images/move.png' listindex='" + singlelist + "' class='list_icons_move' /><img src='images/trash2.png' style='height:30px;width:35px' listindex='" + singlelist + "'  class='list_icons_trash' /></div>";
          if ("details" in todolist[singlelist]) {
            html_listitem = "<div id='listcontainer_" + singlelist + "' class='listcontainer' listindex='" + singlelist + "'><div id='listname_" + singlelist + "' class='listname' data='" + singlelist + "' listindex='" + singlelist + "'>" + todolist[singlelist].name + "</div><div id='divlist_" + singlelist + "' class='divlist' data='" + singlelist + "' listindex='" + singlelist + "'><ul>";
            detailsindex = 0;
            for (listitem in todolist[singlelist]["details"]) {
              item = todolist[singlelist]["details"][listitem].item;
              checked = todolist[singlelist]["details"][listitem].checked;
              addedClass = "";
              if (checked === "true") {
                checked = 'checked';
                addedClass = " lichecked";
              } else {
                checked = '';
              }
              html_listitem += "<li  listindex='" + singlelist + "'  itemindex='" + listitem + "' id='listitemli_" + singlelist + "_" + listitem + "' class='listitem_class" + addedClass + "'><input type='checkbox' id='li_cb_" + singlelist + "_" + listitem + "' class='li_cb'  " + checked + " listindex='" + singlelist + "' itemindex='" + listitem + "' /><span  listindex='" + singlelist + "' itemindex='" + listitem + "'>" + item + "</span><img id='handle_move_" + singlelist + "_" + listitem + "' class='handle_move' src='images/move.png' listindex='" + singlelist + "'  itemindex='" + listitem + "' style='display:none'/><img id='listitem_image_" + singlelist + "_" + listitem + "' listindex='" + singlelist + "'  itemindex='" + listitem + "' src='images/trash2.png'  class='listitem_image' style='display:none;width:25px;height:20px;' /></li>";
            }
            html_listitem += "</div><center><input placeholder='Type and hit enter' type='text' id='listitem_" + singlelist + "' class='listitem_input' listindex='" + singlelist + "' /></center><div listindex='" + singlelist + "' id='list_icons_" + singlelist + "' class='list_icons' style='display:none' ><img src='images/move.png' listindex='" + singlelist + "' class='list_icons_move' /><img src='images/trash2.png'  listindex='" + singlelist + "' class='list_icons_trash' /></div></div>";
          }
          if (i === 0) {
            output += "<tr><td listindex='" + singlelist + "'><div class='singlelist' listindex='" + singlelist + "' id='singlelist_" + singlelist + "' >" + html_listitem + "</div></td>";
            i++;
          } else if (i === 2) {
            output += "<td listindex='" + singlelist + "' ><div class='singlelist' id='singlelist_" + singlelist + "'>" + html_listitem + "</div></td></tr>";
            i = 0;
          } else {
            output += "<td listindex='" + singlelist + "' ><div class='singlelist' listindex='" + singlelist + "' id='singlelist_" + singlelist + "'>" + html_listitem + "</div></td>";
            i++;
          }
        }
        if (output.substr(output.length - 5, 5) === "</td>") output += "</tr>";
        output += "</table>";
        $("#todolist").html(output);
        $("ul").sortable({
          connectWith: 'ul',
          handle: '.handle_move'
        });
        return $("table").sortable({
          items: "td",
          handle: '.list_icons_move'
        });
      } else {

      }
    };
    renderToDoList();
    onEnter_newlist = function() {
      var i, input_newlist, key, newobj, obj, oldobj;
      input_newlist = $("#input_newlist");
      if (input_newlist.val().trim().length > 0) {
        obj = {};
        obj.name = input_newlist.val();
        if ("todolist" in localStorage) {
          i = 0;
          oldobj = JSON.parse(localStorage.todolist);
          for (key in oldobj) {
            i++;
          }
          if (i > 0) {
            oldobj[i] = obj;
            localStorage.setItem("todolist", JSON.stringify(oldobj));
          } else {
            newobj = {};
            newobj[0] = obj;
            localStorage.setItem("todolist", JSON.stringify(newobj));
          }
        } else {
          newobj = {};
          newobj[0] = obj;
          localStorage.setItem("todolist", JSON.stringify(newobj));
        }
      }
      renderToDoList();
      return input_newlist.val("");
    };
    $(".listitem_input").live('keypress', function(e) {
      var i, id, key, oldobj, singlelist;
      if (e.keyCode === 13) {
        id = e.target.id;
        if ($("#" + id).val().trim().length < 1) return;
        singlelist = id.substr(id.indexOf("_") + 1);
        oldobj = {};
        oldobj = JSON.parse(localStorage.todolist);
        i = 0;
        if ("details" in oldobj[singlelist]) {
          for (key in oldobj[singlelist]["details"]) {
            i++;
          }
        }
        if (!("details" in oldobj[singlelist])) oldobj[singlelist].details = {};
        oldobj[singlelist].details[i] = {};
        oldobj[singlelist].details[i].checked = 'false';
        oldobj[singlelist].details[i].item = $("#" + id).val();
        localStorage.setItem("todolist", JSON.stringify(oldobj));
        renderToDoList();
        return $("#" + id).focus();
      }
    });
    $("#btn_newlist").bind('click', function() {
      return onEnter_newlist();
    });
    $(".divlist").live("keypress blur", function(e) {
      if (e.type === "keypress") {
        if (e.keyCode === 13) {
          saveListItem(e);
          return e.stopPropagation();
        }
      } else {
        return saveListItem(e);
      }
    });
    saveListItem = function(e) {
      var fi, id, itemindex, li, listindex, newele, oldobj, singlelist, val;
      val = $("#" + e.target.id).val();
      listindex = $(e.target).attr("listindex");
      itemindex = $(e.target).attr("itemindex");
      if (val.trim().length < 1) {
        newele = $("<span listindex='" + listindex + "' itemindex='" + itemindex + "' >" + todolistapp2987.oldlistitem + "</span>");
        $("#" + e.target.id).replaceWith(newele);
        return;
      }
      oldobj = JSON.parse(localStorage.todolist);
      id = e.target.id;
      fi = id.indexOf("_");
      li = id.lastIndexOf("_");
      singlelist = id.substr(fi + 1, li - fi - 1);
      itemindex = id.substr(li + 1);
      oldobj[singlelist].details[itemindex].item = val;
      localStorage.todolist = JSON.stringify(oldobj);
      newele = $("<span listindex='" + listindex + "' itemindex='" + itemindex + "'  >" + val + "</span>");
      return $("#" + e.target.id).replaceWith(newele);
    };
    $(".divlist span").live("click", function(e) {
      var itemindex, listindex, newele;
      if (e.target.id) return;
      listindex = $(e.target).attr("listindex");
      itemindex = $(e.target).attr("itemindex");
      newele = $("<input type='text' id='inputlistitem_" + listindex + "_" + itemindex + "' listindex='" + listindex + "' itemindex='" + itemindex + "' class='inputlistitem_class' />");
      newele.val($("#listitemli_" + listindex + "_" + itemindex + " span").text());
      todolistapp2987.oldlistitem = $("#" + e.target.id).text();
      $("#listitemli_" + listindex + "_" + itemindex + " span").replaceWith(newele);
      return newele.focus();
    });
    $("#input_newlist").bind("keypress", function(e) {
      if (e.keyCode === 13) return onEnter_newlist();
    });
    saveListName = function(e) {
      var id, newele, oldobj, singlelist, val;
      val = $("#" + e.target.id).val();
      if (val.trim().length < 1) {
        newele = $("<div id='" + e.target.id + "' class='listname'>" + todolistapp2987.oldlistname + "</div>");
        $("#" + e.target.id).replaceWith(newele);
        return;
      }
      oldobj = JSON.parse(localStorage.todolist);
      id = e.target.id;
      singlelist = id.substr(id.indexOf("_") + 1);
      oldobj[singlelist].name = val;
      localStorage.todolist = JSON.stringify(oldobj);
      newele = $("<div id='" + e.target.id + "' class='listname'>" + val + "</div>");
      return $("#" + e.target.id).replaceWith(newele);
    };
    $(".listname").live({
      click: function(e) {
        var id, newele;
        id = e.target.id;
        newele = $("<input type='text' id='" + id + "' class='listname' size='10' maxlength='25'  />");
        newele.val($("#" + id).text());
        todolistapp2987.oldlistname = $("#" + id).text();
        $("#" + id).replaceWith(newele);
        return $("#" + id).focus();
      },
      keypress: function(e) {
        if (e.keyCode !== 13) return;
        return saveListName(e);
      },
      blur: function(e) {
        return saveListName(e);
      }
    });
    $(".singlelist").live({
      mouseenter: function(e) {
        var singlelist;
        singlelist = $(e.target).attr("singlelist") || $(e.target).attr("listindex");
        return $(".list_icons_" + singlelist).show();
      },
      mouseleave: function(e) {
        var singlelist;
        singlelist = $(e.target).attr("singlelist" || $(e.target).attr("listindex"));
        return $(".list_icons_" + singlelist).hide();
      }
    });
    $("div.listcontainer").live({
      mouseenter: function(e) {
        var fi, i, id, key, li, listindex;
        id = e.target.id;
        i = 0;
        listindex = 0;
        for (key in id) {
          if (id[key] === "_") i++;
        }
        if (i === 1) {
          listindex = id.substr(id.indexOf("_") + 1);
        } else {
          fi = id.indexOf("_");
          li = id.lastIndexOf("_");
          listindex = id.substr(fi + 1, li - fi - 1);
        }
        return $("#list_icons_" + listindex).show();
      },
      mouseleave: function(e) {
        return $("div.list_icons").hide(500);
      }
    });
    $(".list_icons_trash").live({
      'click': function(e) {
        var i, ind, len, listindex, oldobj;
        listindex = $(e.target).attr("listindex");
        oldobj = JSON.parse(localStorage.todolist);
        len = 0;
        for (i in oldobj) {
          len++;
        }
        ind = parseInt(listindex) + 1;
        while (ind < len) {
          oldobj[parseInt(ind - 1) + ""] = oldobj[ind + ""];
          ind++;
        }
        delete oldobj[ind - 1];
        localStorage.setItem("todolist", JSON.stringify(oldobj));
        return renderToDoList();
      }
    });
    $(".list_icons_trash").live({
      mouseenter: function(e) {
        var listindex;
        listindex = $(e.target).attr("listindex");
        return $("#list_icons_" + listindex).show();
      }
    });
    $(".listitem_class span").live({
      mouseenter: function(e) {
        var listindex;
        listindex = $(e.target).attr("listindex");
        return $("#list_icons_" + listindex).show();
      }
    });
    $(".listitem_class").live({
      mouseenter: function(e) {
        var itemindex, listindex;
        listindex = $(e.target).attr("listindex");
        itemindex = $(e.target).attr("itemindex");
        $("#listitem_image_" + listindex + "_" + itemindex).show();
        $("#handle_move_" + listindex + "_" + itemindex).show();
        return $("#list_icons_" + listindex).show();
      },
      mouseleave: function(e) {
        var itemindex, listindex;
        listindex = $(e.target).attr("listindex");
        itemindex = $(e.target).attr("itemindex");
        $("#listitem_image_" + listindex + "_" + itemindex).hide();
        return $("#handle_move_" + listindex + "_" + itemindex).hide();
      }
    });
    $(".handle_move").live({
      mouseenter: function(e) {
        var itemindex, listindex;
        listindex = $(e.target).attr("listindex");
        itemindex = $(e.target).attr("itemindex");
        return $("#listitem_image_" + listindex + "_" + itemindex).show();
      }
    });
    $(".listitem_image").live({
      'click': function(e) {
        var i, ind, itemindex, len, listindex, oldobj;
        oldobj = JSON.parse(localStorage.todolist);
        listindex = $(e.target).attr("listindex");
        itemindex = $(e.target).attr("itemindex");
        len = 0;
        for (i in oldobj[listindex].details) {
          len++;
        }
        ind = parseInt(itemindex) + 1;
        while (ind < len) {
          oldobj[listindex].details[parseInt(ind - 1) + ""] = oldobj[listindex].details[ind + ""];
          ind++;
        }
        delete oldobj[listindex].details[ind - 1];
        localStorage.setItem("todolist", JSON.stringify(oldobj));
        return renderToDoList();
      }
    });
    $(".li_cb").live({
      'click': function(e) {
        var checked, itemindex, listindex, oldobj;
        checked = $(e.target).is(":checked");
        listindex = $(e.target).attr("listindex");
        itemindex = $(e.target).attr("itemindex");
        if (checked) {
          checked = "true";
          $("#listitemli_" + listindex + "_" + itemindex).addClass("lichecked");
        } else {
          checked = "false";
          $("#listitemli_" + listindex + "_" + itemindex).removeClass("lichecked");
        }
        oldobj = JSON.parse(localStorage.todolist);
        oldobj[listindex]["details"][itemindex].checked = checked;
        return localStorage.setItem("todolist", JSON.stringify(oldobj));
      }
    });
    $("table").live("sortstop", function(e, ui) {
      var newindex, oldindex, oldobj, temp;
      console.log(e);
      if (e.target.localName === "ul") return;
      newindex = ui.item.index();
      oldindex = ui.item.attr("listindex");
      oldobj = JSON.parse(localStorage.todolist);
      temp = oldobj[newindex];
      oldobj[newindex] = oldobj[oldindex];
      oldobj[oldindex] = temp;
      localStorage.setItem("todolist", JSON.stringify(oldobj));
      return renderToDoList();
    });
    return $("ul").live("sortstop", function(e, ui) {
      var itemindex, listindex, oldindex, oldobj, temp;
      if (e.target.id === "table_todolist") return;
      listindex = ui.item.attr("listindex");
      itemindex = ui.item.attr("itemindex");
      oldindex = ui.item.index();
      oldobj = JSON.parse(localStorage.todolist);
      temp = {};
      temp = oldobj[listindex]['details'][itemindex];
      oldobj[listindex]['details'][itemindex] = oldobj[listindex]['details'][oldindex];
      oldobj[listindex]['details'][oldindex] = temp;
      localStorage.setItem("todolist", JSON.stringify(oldobj));
      return renderToDoList();
    });
  });

}).call(this);
