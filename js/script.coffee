$(document).ready(->
    render()

    if not localStorage.labels
      localStorage.labels = "[]"
    render_color_labels()

    $("#new-color-holder").spectrum
      color: "green"
      
)

initial_settings = ->
  if not localStorage.settings
    localStorage.settings = "{}"
  settings = JSON.parse localStorage.settings
  $("#disable-color-labels").prop("checked", settings.disable_color_coding)
  if settings.disable_color_coding
    $(".item-labels-box").addClass "hide"
  else
    $(".item-labels-box").removeClass "hide"


$("#list-name-input").live
    keyup: (e)->
        if(e.keyCode == 13)
            create_new_list()


$(".item-input input").live
    keyup: (e)->
        if(e.keyCode != 13)
            return

        item_value = $(this).val()
        if item_value.trim().length == 0
          return
        id = $(this).closest(".list")[0].id
        list_num = id.split("-")[1]
        oldobj = JSON.parse localStorage.lists
        items = oldobj[list_num].items
        items_count = Object.keys(items).length
        oldobj[list_num].items[items_count] = [item_value]
        localStorage.lists = JSON.stringify oldobj
        render()
        $("#"+@.id).focus()


create_new_list = ->
    
    list_name = validate_list_name_input()
    if (list_name.length ==  0)
        return

    list = {}
    list['name'] = list_name
    list['items'] = {}

    if (localStorage.lists == undefined)
        localStorage.lists = "{}"

    oldobj = JSON.parse(localStorage.lists)
    len = Object.keys(oldobj).length
    oldobj[len] = list
    localStorage.lists = JSON.stringify(oldobj)
    render()
    $("#list-name-input").val("")


$('.list-header-text').live
  keydown: (e)->
    if e.keyCode == 27
      oldobj  = JSON.parse localStorage.lists
      listid = Number $(@).closest(".list")[0].id.split("-")[1]
      $(@).text oldobj[listid]['name']
    if e.keyCode == 13
      e.preventDefault()
  keyup: (e) ->
    if e.keyCode != 13
      return
    e.preventDefault()
    update_listname(e, @)
  blur: (e) ->
    update_listname(e, @)


update_listname = (e, that) ->
    listid = Number $(that).closest(".list")[0].id.split("-")[1]
    oldobj = JSON.parse localStorage.lists
    oldobj[listid]['name'] = $(that).text()
    localStorage.lists = JSON.stringify oldobj
    render()


$(".list-header-text").live
  keydown: (e) ->
    if $(@).text().length > 20
      if e.keyCode not in [8, 46, 13, 27, 37, 39]
        e.preventDefault()


$('.item-text').live
  keydown: (e) ->
    if e.keyCode == 27
      oldobj = JSON.parse localStorage.lists
      listid = Number $(@).closest(".list")[0].id.split("-")[1]
      items = oldobj[listid].items
      itemid = Number $(@).closest("li").attr('class').split("-")[1]
      $(@).text(items[itemid])

    if e.keyCode == 13
      e.preventDefault()
  keyup: (e) ->
    if e.keyCode != 13
      return
    e.preventDefault()
    update_item(e, @)
  blur: (e) ->
    update_item(e, @)


update_item = (e, that) ->
    listid = Number $(that).closest(".list")[0].id.split("-")[1]
    oldobj = JSON.parse localStorage.lists
    items = oldobj[listid].items
    itemid = Number $(that).closest("li").attr('class').split("-")[1]
    items[itemid][0] = $(that).text()
    oldobj[listid].items = items
    localStorage.lists = JSON.stringify oldobj
    render()


$(".cb_item").live
  change: (e) ->
    listid = Number $(@).closest(".list")[0].id.split("-")[1]
    oldobj = JSON.parse localStorage.lists
    items = oldobj[listid].items
    itemid = Number $(@).closest("li").attr('class').split("-")[1]
    if $(@).attr("checked")
      items[itemid][1] = "yes"
      oldobj[listid].items = items
      localStorage.lists = JSON.stringify oldobj
    else
      items[itemid].splice 1,1
      oldobj[listid].items = items
      localStorage.lists = JSON.stringify oldobj
    render()


$(".delete-list").live
  click: (e) ->
    ans = confirm "Are you sure want to delete this list ?"
    if not ans
      return
    listid = Number $(@).closest(".list")[0].id.split("-")[1]
    oldobj = JSON.parse localStorage.lists
    i = Number listid
    len = Object.keys(oldobj).length
    while i<len-1
      oldobj[i] = oldobj[i+1]
      i++
    delete oldobj[len-1]
    localStorage.lists = JSON.stringify oldobj
    render()
  mouseenter: (e) ->
    $(@).closest('.list-header').find('.list-header-text').css('color', 'red')
  mouseleave: (e) ->
    $(@).closest('.list-header').find('.list-header-text').css('color', '')


$(".delete-item").live
  click: (e) ->
    itemid = Number $(@).closest("li").attr('class').split("-")[1]
    listid = Number $(@).closest(".list")[0].id.split("-")[1]
    oldobj = JSON.parse localStorage.lists
    i = itemid
    len = Object.keys(oldobj[listid].items).length
    while i<len-1
      oldobj[listid]['items'][i] = oldobj[listid]['items'][i+1]
      i++
    delete oldobj[listid]['items'][len-1]
    localStorage.lists = JSON.stringify oldobj
    render()
  mouseenter: (e) ->
    $(@).closest('li').find('.item-text').css('color', 'red')
  mouseleave: (e) ->
    $(@).closest('li').find('.item-text').css('color', '')


render = ->
    oldobj = JSON.parse(localStorage.lists)
    $("#list-row").html("")
    for key of oldobj
        if(oldobj.hasOwnProperty(key))

            ele = "<div id='list-"+key+"' class='well list span3' >
                <div class='header_to_well'>
                  <div class='list-header'>
                    <span class='header-icons pull-right'>
                      <i class='icon-wrench icon-white'></i>
                      <i class='icon-move icon-white move-list '></i><i class='icon-remove icon-white delete-list'></i>
                    </span>
                    <span contentEditable='true' class='list-header-text'> "+oldobj[key].name+"</span>
                  </div>
                </div>
                <div class='nano'><div class='content'><ul class='unstyled ul-items'>"

            done_item_class = ""
            checked = ""
            for item_key, item_val of oldobj[key].items
                done_item_class = ""
                checked = ""
                labels_html = ""
                if item_val[1]
                  if item_val[1] == "yes"
                    done_item_class = "done_item"
                    checked = "checked"
                if item_val[2]
                  linked_labels = item_val[2]
                  labels = JSON.parse localStorage.labels
                  label_objs = {}
                  for obj in labels
                    label_objs[obj.label] = obj

                  for linked_label in linked_labels
                    labels_html += "<span class='item-color-label' style='background-color: #{label_objs[linked_label].color}'></span>"
                  if labels_html
                    labels_html = "<div class='item-labels-box'>#{labels_html}</div>"

                    



                ele += "<li class='item-"+item_key+"'>#{labels_html}
                  <input type='checkbox' class='cb_item' "+checked+" />
                  <div class='item-icons pull-right'><i class='icon-wrench update-item-li'></i><i class='icon-move move-item' ></i><i class='icon-remove delete-item'></i></div>
                  <span contentEditable='true' class='item-text "+done_item_class+"' maxlength='15' >"+item_val[0]+"</span>
                  </li>"

            ele += "</ul></div></div><div class='item-input'><input type='text' class='span3' id='item-input-"+key+"' placeholder='Enter todo and hit enter' /></div></div>"


            $("#list-row").append(ele)
    $(".nano").nanoScroller()
    $("#list-row").sortable({handle: '.move-list', items: '.list'})
    $(".content ul").sortable({handle: '.move-item', items: 'li', containment: 'parent'})
    initial_settings()


$("#create-list").live
    click: ->
        create_new_list()


validate_list_name_input= ->
    if ($("#list-name-input").val().trim().length == 0)
        return ""
    else
        $("#list-name-input").val()


move_list_start = ""

$("#list-row").live
  sortstart: (e, ui) ->
    if ui.item[0].localName != "div"
      return
    move_list_start = ui.item.index()
  sortstop: (e, ui) ->
    if ui.item[0].localName != "div"
      return
    move_list_end = ui.item.index()
    oldobj = JSON.parse localStorage.lists
    if move_list_start < move_list_end
      i = move_list_start
      temp = oldobj[move_list_start]
      while i<move_list_end
        oldobj[i] = oldobj[i+1]
        i++
      oldobj[move_list_end] = temp
    else if move_list_end < move_list_start
      i = move_list_start
      temp = oldobj[i]
      while i > move_list_end
        oldobj[i] = oldobj[i-1]
        i--
      oldobj[move_list_end] = temp

    localStorage.lists = JSON.stringify oldobj
    render()


move_item_start = "" 
$(".list .content").live
  sortstart: (e, ui) ->
    move_item_start = ui.item.index()
    if ui.item[0].localName != "li"
      return
  sortstop: (e, ui) ->
    if ui.item[0].localName != "li"
      return
    listid = Number $(@).closest(".list")[0].id.split("-")[1]
    move_item_end = ui.item.index()
    oldobj = JSON.parse localStorage.lists
    items = oldobj[listid].items
    if move_item_start < move_item_end
      i = move_item_start
      temp = items[move_item_start]
      while i<move_item_end
        items[i] = items[i+1]
        i++
      items[move_item_end] = temp
    else if move_item_end < move_item_start
      i = move_item_start
      temp = items[i]
      while i > move_item_end
        items[i] = items[i-1]
        i--
      items[move_item_end] = temp
    oldobj[listid].items = items
    localStorage.lists = JSON.stringify oldobj
    render()


$("#export_modal").on "show", ->
  $("#export_modal textarea").val localStorage.lists
  
$("#show-settings").on "click", ->
  $(".settings").slideDown('slow')

$(".hide-settings").on 'click', ->
  $(".settings").slideUp("slow")

$("#import_data").on 'click', ->
  data = ''
  try
    data =  $("#import_modal textarea").val()
    JSON.parse data
  catch e
    alert "The data you have pasted is in invalid format. Please check again"
    return
  if $("input[name=import-type]:checked").length == 0
    alert "Please select import type"
    return
  import_type = $("input[name=import-type]:checked").val()
  if import_type == 'add'
    old_data = JSON.parse localStorage.lists
    data = JSON.parse data
    old_len = Object.keys(old_data).length
    for k, v of data
      old_data[old_len] = v
      old_len++
    localStorage.lists = JSON.stringify old_data

  else if import_type == 'replace'
    localStorage.lists = data
  alert 'Data imported successfully'
  window.location.reload()


upload_and_replace_with_current_data = ->
  ans = confirm "This will completely remove data on the server by replacing with current local data. Are you sure?"
  if ans
    chrome.storage.sync.set "lists": localStorage.lists, ->
      alert "Current data successfully saved to server."

download_and_replace_current_data = ->
  ans = confirm "This will completely remove local data by replacing with data from server. Are you sure?"
  if ans
    chrome.storage.sync.get "lists", (res) ->
      localStorage.lists = res.lists
      render()
      

$("#upload_sync").click ->
  upload_and_replace_with_current_data()

$("#download_sync").click ->
  download_and_replace_current_data()

$("#add-color-label").click ->
  $("#new-coding-label-container").toggle()

$("#submit-new-label").click ->
  new_label = $("#new-color-label-holder").val()
  new_color = $("#new-color-holder").val()
  if new_label.trim().length == 0
    $("#new-color-label-holder").focus()
    return
  if new_color.trim().length == 0
    return
  old_labels = JSON.parse localStorage.labels
  found = old_labels.filter (e) ->
    e.label == new_label
  if found.length
    alert "Label '#{new_label}' already exists"
    return
  old_labels.push {'color': new_color, 'label': new_label}
  localStorage.labels = JSON.stringify old_labels
  render_color_labels()

render_color_labels = ->
  labels = JSON.parse localStorage.labels
  html = ""
  for label, ind in labels
    html += "<div class='each-label' ind='"+ind+"'><span class='color-label' style='background-color: "+label.color+"'></span>"+
      "<input type='text' class='updated-color-holder' value='"+label.color+"' /><input type='text' class='label-name input-small' value='"+label.label+"'>"+
      "<button class='submit-updated-color btn btn-primary'>Update</button></div>"
  $(".color-labels").html html


$(".color-label").live
  click: ->
    $(this).closest(".each-label").find(".updated-color-holder").spectrum()

$(".submit-updated-color").live 
  click: ->
    $each_label = $(this).closest ".each-label"
    lid = $each_label.attr("ind")
    updated_color = $each_label.find(".updated-color-holder").val()
    updated_label = $each_label.find(".label-name").val()
    if updated_color.trim().length == 0
      alert "Please select color before submitting"
      return
    if updated_label.trim().length == 0
      alert "Please enter label name before submitting"
      $each_label.find(".label-name").focus()
      return
    labels = JSON.parse localStorage.labels
    labels[lid] = {'color': updated_color, 'label': updated_label}
    localStorage.labels = JSON.stringify labels
    render_color_labels()
    alert "Updated"

$(".ul-items li .icon-wrench.update-item-li").live
  click: (e) ->
    itemid = Number $(@).closest("li").attr('class').split("-")[1]
    listid = Number $(@).closest(".list")[0].id.split("-")[1]
    lists = JSON.parse localStorage.lists
    item_labels = []
    obj = lists[listid]
    item = obj.items[itemid]
    if item.length > 2
      item_labels = obj.items[itemid][2]
    if obj.length > 2
      item_labels = obj[2]

    $("#update-item-modal").modal()
    $("#update-item-modal").attr("itemid", itemid).attr("listid", listid)

    labels = JSON.parse localStorage.labels
    label_html = ""
    $(labels).each ->
      temp_html = "<span class='label-color' style='background-color: #{this.color}'></span><span class='label-name'>#{this.label}</span>"
      if this.label in item_labels
        temp_html = "<i class='icon-ok'></i>" + temp_html
      label_html += "<div label-name='#{this.label}'>"+temp_html+"</div>"

    $("#item-color-labels").html label_html

$(".label-color").live
  click: ->
    itemid = $("#update-item-modal").attr("itemid")
    listid = $("#update-item-modal").attr("listid")
    label_name = $(this).closest("div").attr("label-name")
    lists = JSON.parse localStorage.lists
    item_labels = []
    obj = lists[listid]
    item = obj.items[itemid]
    if item.length > 2
      item_labels = obj.items[itemid][2]

    if $(this).closest("div").find(".icon-ok").length
      if label_name in item_labels
        ind = item_labels.indexOf label_name
        item_labels.splice ind, 1
      if item.length > 2
        item[2] = item_labels
      else
        item.push item_labels
      obj.items[itemid] = item
      lists[itemid] = obj
      localStorage.lists = JSON.stringify lists
      $(this).closest("div").find(".icon-ok").remove()
    else
      if label_name not in item_labels
        item_labels.push label_name
      if item.length > 2
        item[2] = item_labels
      else
        item.push item_labels
      obj.items[itemid] = item
      lists[listid] = obj
      localStorage.lists = JSON.stringify lists
      $(this).closest("div").prepend "<i class='icon-ok'></i>"

$("#update-item-modal").on "hide", (e) ->
  render()


$("#disable-color-labels").change ->
  checked = $(this).prop("checked")
  settings = JSON.parse localStorage.settings
  settings.disable_color_coding = checked
  localStorage.settings = JSON.stringify settings
  $(".item-labels-box").addClass "hide"







