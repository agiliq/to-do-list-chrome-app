(function() {
  var create_new_list, download_and_replace_current_data, initial_settings, move_item_start, move_list_start, render, update_item, update_listname, upload_and_replace_with_current_data, validate_list_name_input,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(document).ready(function() {
    var initial_labels, initial_lists;
    if (localStorage.lists === void 0) {
      initial_lists = {
        "0": {
          "name": "Today's Todo",
          "items": {
            "0": ["Brush my teeth", "yes"],
            "1": ["Have breakfast", "yes"],
            "2": ["Learn about the todo app"]
          }
        },
        "1": {
          "name": "Learn about this app",
          "items": {
            "0": ["You can add lists and todos", "yes"],
            "1": ["You can reorder things. Go ahead, click on the move icon."],
            "2": ["You can delete lists and items.", "yes"],
            "3": ["Sigin to chrome and sync your todos"]
          }
        },
        "2": {
          "name": "Life Goals",
          "items": {
            "0": ["Read 100 books", "yes"],
            "1": ["Run a marathon"]
          }
        }
      };
      localStorage.lists = JSON.stringify(initial_lists);
    }
    if (!localStorage.labels) {
      initial_labels = [
        {
          "color": "#2AAC75",
          "label": "Green"
        }, {
          "label": "Red",
          "color": " #CE4545"
        }, {
          "label": "Purple",
          "color": "#9D31D3"
        }, {
          "label": "Yellow",
          "color": "#CCCC4A"
        }, {
          "label": "Blue",
          "color": "#4874CE"
        }, {
          "label": "Orange",
          "color": "#DF9348"
        }
      ];
      localStorage.labels = JSON.stringify(initial_labels);
    }
    render();
    return $("#new-color-holder").spectrum({
      color: "green"
    });
  });

  initial_settings = function() {
    var settings;
    if (!localStorage.settings) localStorage.settings = "{}";
    settings = JSON.parse(localStorage.settings);
    $("#disable-color-labels").prop("checked", settings.disable_color_coding);
    if (settings.disable_color_coding) {
      $(".item-labels-box").addClass("hide");
      return $(".item-color-labels").addClass("hide");
    } else {
      $(".item-labels-box").removeClass("hide");
      return $(".item-color-labels").removeClass("hide");
    }
  };

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
    },
    click: function(e) {
      return $(this).attr("contentEditable", true);
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
      $(this).removeAttr("contentEditable");
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
        items[itemid][1] = "no";
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
    var checked, done_item_class, ele, item_key, item_val, key, label_objs, labels, labels_html, linked_label, linked_labels, obj, oldobj, _i, _j, _len, _len2, _ref;
    oldobj = JSON.parse(localStorage.lists);
    $("#list-row").html("");
    for (key in oldobj) {
      if (oldobj.hasOwnProperty(key)) {
        ele = "<div id='list-" + key + "' class='well list span3' >                <div class='header_to_well'>                  <div class='list-header'>                    <span class='header-icons pull-right'>                      <i class='icon-move icon-white move-list '></i><i class='icon-remove icon-white delete-list'></i>                    </span>                    <span class='list-header-text'> " + oldobj[key].name + "</span>                  </div>                </div>                <div class='nano'><div class='content'><ul class='unstyled ul-items'>";
        done_item_class = "";
        checked = "";
        _ref = oldobj[key].items;
        for (item_key in _ref) {
          item_val = _ref[item_key];
          done_item_class = "";
          checked = "";
          labels_html = "";
          if (item_val[1]) {
            if (item_val[1] === "yes") {
              done_item_class = "done_item";
              checked = "checked";
            }
          }
          if (item_val[2]) {
            linked_labels = item_val[2];
            labels = JSON.parse(localStorage.labels);
            label_objs = {};
            for (_i = 0, _len = labels.length; _i < _len; _i++) {
              obj = labels[_i];
              label_objs[obj.label] = obj;
            }
            for (_j = 0, _len2 = linked_labels.length; _j < _len2; _j++) {
              linked_label = linked_labels[_j];
              labels_html += "<span class='item-color-label' style='background-color: " + label_objs[linked_label].color + "'></span>";
            }
            if (labels_html) {
              labels_html = "<div class='item-labels-box'>" + labels_html + "</div>";
            }
          }
          ele += "<li class='item-" + item_key + ("'><div class='item-div'>" + labels_html + "                  <input type='checkbox' class='cb_item' ") + checked + " />                  <div class='item-icons pull-right'><i class='icon-move move-item' ></i><i class='icon-remove delete-item'></i></div>                  <span class='item-text " + done_item_class + "' maxlength='15' >" + item_val[0] + "</span></div>                  <div class='item-color-labels'></div>                  </li>";
        }
        ele += "</ul></div></div><div class='item-input'><input type='text' class='span3' id='item-input-" + key + "' placeholder='Enter todo and hit enter' /></div></div>";
        $("#list-row").append(ele);
      }
    }
    $(".nano").nanoScroller();
    $("#list-row").sortable({
      handle: '.move-list',
      items: '.list'
    });
    $(".content ul").sortable({
      handle: '.move-item',
      items: 'li',
      containment: 'parent'
    });
    return initial_settings();
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
    } else if (import_type === 'replace') {
      localStorage.lists = data;
    }
    alert('Data imported successfully');
    return window.location.reload();
  });

  upload_and_replace_with_current_data = function() {
    var ans;
    ans = confirm("This will completely remove data on the server by replacing with current local data. Are you sure?");
    if (ans) {
      return chrome.storage.sync.set({
        "lists": localStorage.lists,
        "labels": localStorage.labels,
        "settings": localStorage.settings
      }, function() {
        return alert("Current data successfully saved to server.");
      });
    }
  };

  download_and_replace_current_data = function() {
    var ans;
    ans = confirm("This will completely remove local data by replacing with data from server. Are you sure?");
    if (ans) {
      return chrome.storage.sync.get(["lists", "labels", "settings"], function(res) {
        localStorage.lists = res.lists;
        localStorage.labels = res.labels;
        localStorage.settings = res.settings;
        return render();
      });
    }
  };

  $("#upload_sync").click(function() {
    return upload_and_replace_with_current_data();
  });

  $("#download_sync").click(function() {
    return download_and_replace_current_data();
  });

  $("#add-color-label").click(function() {
    return $("#new-coding-label-container").toggle();
  });

  $("#submit-new-label").click(function() {
    var found, new_color, new_label, old_labels;
    new_label = $("#new-color-label-holder").val();
    new_color = $("#new-color-holder").val();
    if (new_label.trim().length === 0) {
      $("#new-color-label-holder").focus();
      return;
    }
    if (new_color.trim().length === 0) return;
    old_labels = JSON.parse(localStorage.labels);
    found = old_labels.filter(function(e) {
      return e.label === new_label;
    });
    if (found.length) {
      alert("Label '" + new_label + "' already exists");
      return;
    }
    old_labels.push({
      'color': new_color,
      'label': new_label
    });
    return localStorage.labels = JSON.stringify(old_labels);
  });

  $(".color-label").live({
    click: function() {
      return $(this).closest(".each-label").find(".updated-color-holder").spectrum();
    }
  });

  $(".submit-updated-color").live({
    click: function() {
      var $each_label, labels, lid, updated_color, updated_label;
      $each_label = $(this).closest(".each-label");
      lid = $each_label.attr("ind");
      updated_color = $each_label.find(".updated-color-holder").val();
      updated_label = $each_label.find(".label-name").val();
      if (updated_color.trim().length === 0) {
        alert("Please select color before submitting");
        return;
      }
      if (updated_label.trim().length === 0) {
        alert("Please enter label name before submitting");
        $each_label.find(".label-name").focus();
        return;
      }
      labels = JSON.parse(localStorage.labels);
      labels[lid] = {
        'color': updated_color,
        'label': updated_label
      };
      localStorage.labels = JSON.stringify(labels);
      return alert("Updated");
    }
  });

  $("span.item-text").live({
    click: function(e) {
      var $closest_li, $labels_div, editable, item, item_labels, itemid, label_html, labels, listid, lists, obj;
      editable = $(this).attr("contentEditable");
      if (!editable) $(this).attr("contentEditable", true);
      $closest_li = $(this).closest("li");
      $labels_div = $closest_li.find(".item-color-labels");
      if ($labels_div.attr("status") === "visible") {
        $labels_div.html("").attr("status", "hidden");
        return;
      }
      itemid = Number($closest_li.attr('class').split("-")[1]);
      listid = Number($(this).closest(".list")[0].id.split("-")[1]);
      lists = JSON.parse(localStorage.lists);
      item_labels = [];
      obj = lists[listid];
      item = obj.items[itemid];
      if (item.length > 2) item_labels = obj.items[itemid][2];
      if (obj.length > 2) item_labels = obj[2];
      labels = JSON.parse(localStorage.labels);
      label_html = "";
      $(labels).each(function() {
        var temp_html, _ref;
        temp_html = "<span class='label-color' style='background-color: " + this.color + "'>";
        if (_ref = this.label, __indexOf.call(item_labels, _ref) >= 0) {
          temp_html += "<i class='icon-ok icon-white'></i>";
        }
        temp_html += "</span>";
        return label_html += ("<span class='each-label' label-name='" + this.label + "'>") + temp_html + "</span>";
      });
      return $labels_div.html(label_html).attr("status", "visible");
    }
  });

  $(".label-color").live({
    click: function() {
      var ind, item, item_labels, itemid, label_name, listid, lists, obj;
      itemid = Number($(this).closest("li").attr('class').split("-")[1]);
      listid = Number($(this).closest(".list")[0].id.split("-")[1]);
      label_name = $(this).closest(".each-label").attr("label-name");
      lists = JSON.parse(localStorage.lists);
      item_labels = [];
      obj = lists[listid];
      item = obj.items[itemid];
      if (item.length > 2) item_labels = obj.items[itemid][2];
      if ($(this).find(".icon-ok").length) {
        if (__indexOf.call(item_labels, label_name) >= 0) {
          ind = item_labels.indexOf(label_name);
          item_labels.splice(ind, 1);
        }
        item[2] = item_labels;
        obj.items[itemid] = item;
        lists[listid] = obj;
        localStorage.lists = JSON.stringify(lists);
        $(this).find(".icon-ok").remove();
      } else {
        if (__indexOf.call(item_labels, label_name) < 0) {
          item_labels.push(label_name);
        }
        item[2] = item_labels;
        obj.items[itemid] = item;
        lists[listid] = obj;
        localStorage.lists = JSON.stringify(lists);
        $(this).find(".label-color").html("<i class='icon-ok icon-white'></i>");
      }
      return render();
    }
  });

  $("#update-item-modal").on("hide", function(e) {
    return render();
  });

  $("#disable-color-labels").change(function() {
    var checked, settings;
    checked = $(this).prop("checked");
    settings = JSON.parse(localStorage.settings);
    settings.disable_color_coding = checked;
    localStorage.settings = JSON.stringify(settings);
    if (checked) {
      $(".item-labels-box").addClass("hide");
      return $(".item-color-labels").addClass("hide");
    } else {
      $(".item-labels-box").removeClass("hide");
      return $(".item-color-labels").removeClass("hide");
    }
  });

}).call(this);
