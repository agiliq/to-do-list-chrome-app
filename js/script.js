(function() {
  var create_new_list, move_item_start, move_list_start, render, update_item, update_listname, validate_list_name_input;

  $(document).ready(function() {
    return render();
  });

  $("#list-name-input").live({
    keyup: function(e) {
      if (e.keyCode === 13) return create_new_list();
    }
  });

  $(".item-input input").live({
    keyup: function(e) {
      var id, item_value, items, items_count, list_num, oldobj;
      if (e.keyCode !== 13) return;
      item_value = $(this).val();
      if (item_value.trim().length === 0) return;
      id = $(this).closest(".list")[0].id;
      list_num = id.split("-")[1];
      oldobj = JSON.parse(localStorage.lists);
      items = oldobj[list_num].items;
      items_count = Object.keys(items).length;
      oldobj[list_num].items[items_count] = [item_value];
      localStorage.lists = JSON.stringify(oldobj);
      render();
      return $("#" + this.id).focus();
    }
  });

  create_new_list = function() {
    var len, list, list_name, oldobj;
    list_name = validate_list_name_input();
    if (list_name.length === 0) return;
    list = {};
    list['name'] = list_name;
    list['items'] = {};
    if (localStorage.lists === void 0) localStorage.lists = "{}";
    oldobj = JSON.parse(localStorage.lists);
    len = Object.keys(oldobj).length;
    oldobj[len] = list;
    localStorage.lists = JSON.stringify(oldobj);
    render();
    return $("#list-name-input").val("");
  };

  $('.list-header-text').live({
    keydown: function(e) {
      var listid, oldobj;
      if (e.keyCode === 27) {
        oldobj = JSON.parse(localStorage.lists);
        listid = Number($(this).closest(".list")[0].id.split("-")[1]);
        $(this).text(oldobj[listid]['name']);
      }
      if (e.keyCode === 13) return e.preventDefault();
    },
    keyup: function(e) {
      if (e.keyCode !== 13) return;
      e.preventDefault();
      return update_listname(e, this);
    },
    blur: function(e) {
      return update_listname(e, this);
    }
  });

  update_listname = function(e, that) {
    var listid, oldobj;
    listid = Number($(that).closest(".list")[0].id.split("-")[1]);
    oldobj = JSON.parse(localStorage.lists);
    oldobj[listid]['name'] = $(that).text();
    localStorage.lists = JSON.stringify(oldobj);
    return render();
  };

  $(".list-header-text").live({
    keydown: function(e) {
      var _ref;
      if ($(this).text().length > 20) {
        if ((_ref = e.keyCode) !== 8 && _ref !== 46 && _ref !== 13 && _ref !== 27 && _ref !== 37 && _ref !== 39) {
          return e.preventDefault();
        }
      }
    }
  });

  $('.item-text').live({
    keydown: function(e) {
      var itemid, items, listid, oldobj;
      if (e.keyCode === 27) {
        oldobj = JSON.parse(localStorage.lists);
        listid = Number($(this).closest(".list")[0].id.split("-")[1]);
        items = oldobj[listid].items;
        itemid = Number($(this).closest("li").attr('class').split("-")[1]);
        $(this).text(items[itemid]);
      }
      if (e.keyCode === 13) return e.preventDefault();
    },
    keyup: function(e) {
      if (e.keyCode !== 13) return;
      e.preventDefault();
      return update_item(e, this);
    },
    blur: function(e) {
      return update_item(e, this);
    }
  });

  update_item = function(e, that) {
    var itemid, items, listid, oldobj;
    listid = Number($(that).closest(".list")[0].id.split("-")[1]);
    oldobj = JSON.parse(localStorage.lists);
    items = oldobj[listid].items;
    itemid = Number($(that).closest("li").attr('class').split("-")[1]);
    items[itemid][0] = $(that).text();
    oldobj[listid].items = items;
    localStorage.lists = JSON.stringify(oldobj);
    return render();
  };

  $(".cb_item").live({
    change: function(e) {
      var itemid, items, listid, oldobj;
      listid = Number($(this).closest(".list")[0].id.split("-")[1]);
      oldobj = JSON.parse(localStorage.lists);
      items = oldobj[listid].items;
      itemid = Number($(this).closest("li").attr('class').split("-")[1]);
      if ($(this).attr("checked")) {
        items[itemid][1] = "yes";
        oldobj[listid].items = items;
        localStorage.lists = JSON.stringify(oldobj);
      } else {
        items[itemid].splice(1, 1);
        oldobj[listid].items = items;
        localStorage.lists = JSON.stringify(oldobj);
      }
      return render();
    }
  });

  $(".delete-list").live({
    click: function(e) {
      var ans, i, len, listid, oldobj;
      ans = confirm("Are you sure want to delete this list ?");
      if (!ans) return;
      listid = Number($(this).closest(".list")[0].id.split("-")[1]);
      oldobj = JSON.parse(localStorage.lists);
      i = Number(listid);
      len = Object.keys(oldobj).length;
      while (i < len - 1) {
        oldobj[i] = oldobj[i + 1];
        i++;
      }
      delete oldobj[len - 1];
      localStorage.lists = JSON.stringify(oldobj);
      return render();
    },
    mouseenter: function(e) {
      return $(this).closest('.list-header').find('.list-header-text').css('color', 'red');
    },
    mouseleave: function(e) {
      return $(this).closest('.list-header').find('.list-header-text').css('color', '');
    }
  });

  $(".delete-item").live({
    click: function(e) {
      var i, itemid, len, listid, oldobj;
      itemid = Number($(this).closest("li").attr('class').split("-")[1]);
      listid = Number($(this).closest(".list")[0].id.split("-")[1]);
      oldobj = JSON.parse(localStorage.lists);
      i = itemid;
      len = Object.keys(oldobj[listid].items).length;
      while (i < len - 1) {
        oldobj[listid]['items'][i] = oldobj[listid]['items'][i + 1];
        i++;
      }
      delete oldobj[listid]['items'][len - 1];
      localStorage.lists = JSON.stringify(oldobj);
      return render();
    },
    mouseenter: function(e) {
      return $(this).closest('li').find('.item-text').css('color', 'red');
    },
    mouseleave: function(e) {
      return $(this).closest('li').find('.item-text').css('color', '');
    }
  });

  render = function() {
    var checked, done_item_class, ele, item_key, item_val, key, oldobj, _ref;
    oldobj = JSON.parse(localStorage.lists);
    $("#list-row").html("");
    for (key in oldobj) {
      if (oldobj.hasOwnProperty(key)) {
        ele = "<div id='list-" + key + "' class='well list span3' >                <div class='header_to_well'>                  <div class='list-header'>                    <span class='header-icons pull-right'>                      <i class='icon-move icon-white move-list '></i><i class='icon-remove icon-white delete-list'></i>                    </span>                    <span contentEditable='true' class='list-header-text'> " + oldobj[key].name + "</span>                  </div>                </div>                <div class='nano'><div class='content'><ul class='unstyled ul-items'>";
        done_item_class = "";
        checked = "";
        _ref = oldobj[key].items;
        for (item_key in _ref) {
          item_val = _ref[item_key];
          done_item_class = "";
          checked = "";
          if (item_val[1]) {
            if (item_val[1] === "yes") {
              done_item_class = "done_item";
              checked = "checked";
            }
          }
          ele += "<li class='item-" + item_key + "'>                  <input type='checkbox' class='cb_item' " + checked + " />                  <div class='item-icons pull-right'><i class='icon-move move-item' ></i><i class='icon-remove delete-item'></i></div>                  <span contentEditable='true' class='item-text " + done_item_class + "' maxlength='15' >" + item_val[0] + "</span>                  </li>";
        }
        ele += "</ul></div></div><div class='item-input'><input type='text' class='input-large' id='item-input-" + key + "' placeholder='Enter todo and hit enter' /></div></div>";
        $("#list-row").append(ele);
      }
    }
    $(".nano").nanoScroller();
    $("#list-row").sortable({
      handle: '.move-list',
      items: '.list'
    });
    return $(".content ul").sortable({
      handle: '.move-item',
      items: 'li',
      containment: 'parent'
    });
  };

  $("#create-list").live({
    click: function() {
      return create_new_list();
    }
  });

  validate_list_name_input = function() {
    if ($("#list-name-input").val().trim().length === 0) {
      return "";
    } else {
      return $("#list-name-input").val();
    }
  };

  move_list_start = "";

  $("#list-row").live({
    sortstart: function(e, ui) {
      if (ui.item[0].localName !== "div") return;
      return move_list_start = ui.item.index();
    },
    sortstop: function(e, ui) {
      var i, move_list_end, oldobj, temp;
      if (ui.item[0].localName !== "div") return;
      move_list_end = ui.item.index();
      oldobj = JSON.parse(localStorage.lists);
      if (move_list_start < move_list_end) {
        i = move_list_start;
        temp = oldobj[move_list_start];
        while (i < move_list_end) {
          oldobj[i] = oldobj[i + 1];
          i++;
        }
        oldobj[move_list_end] = temp;
      } else if (move_list_end < move_list_start) {
        i = move_list_start;
        temp = oldobj[i];
        while (i > move_list_end) {
          oldobj[i] = oldobj[i - 1];
          i--;
        }
        oldobj[move_list_end] = temp;
      }
      localStorage.lists = JSON.stringify(oldobj);
      return render();
    }
  });

  move_item_start = "";

  $(".list .content").live({
    sortstart: function(e, ui) {
      move_item_start = ui.item.index();
      if (ui.item[0].localName !== "li") {}
    },
    sortstop: function(e, ui) {
      var i, items, listid, move_item_end, oldobj, temp;
      if (ui.item[0].localName !== "li") return;
      listid = Number($(this).closest(".list")[0].id.split("-")[1]);
      move_item_end = ui.item.index();
      oldobj = JSON.parse(localStorage.lists);
      items = oldobj[listid].items;
      if (move_item_start < move_item_end) {
        i = move_item_start;
        temp = items[move_item_start];
        while (i < move_item_end) {
          items[i] = items[i + 1];
          i++;
        }
        items[move_item_end] = temp;
      } else if (move_item_end < move_item_start) {
        i = move_item_start;
        temp = items[i];
        while (i > move_item_end) {
          items[i] = items[i - 1];
          i--;
        }
        items[move_item_end] = temp;
      }
      oldobj[listid].items = items;
      localStorage.lists = JSON.stringify(oldobj);
      return render();
    }
  });

  $("#export_modal").on("show", function() {
    return $("#export_modal textarea").val(localStorage.lists);
  });

  $("#show-settings").on("click", function() {
    return $(".settings").slideDown('slow');
  });

  $(".hide-settings").on('click', function() {
    return $(".settings").slideUp("slow");
  });

  $("#import_data").on('click', function() {
    var data, import_type, k, old_data, old_len, v;
    data = '';
    try {
      data = $("#import_modal textarea").val();
      JSON.parse(data);
    } catch (e) {
      alert("The data you have pasted is in invalid format. Please check again");
      return;
    }
    if ($("input[name=import-type]:checked").length === 0) {
      alert("Please select import type");
      return;
    }
    import_type = $("input[name=import-type]:checked").val();
    if (import_type === 'add') {
      old_data = JSON.parse(localStorage.lists);
      data = JSON.parse(data);
      old_len = Object.keys(old_data).length;
      for (k in data) {
        v = data[k];
        old_data[old_len] = v;
        old_len++;
      }
      localStorage.lists = JSON.stringify(old_data);
      return render();
    } else if (import_type === 'replace') {
      localStorage.lists = data;
      return render();
    }
  });

}).call(this);
