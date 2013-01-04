$(document).ready(->
    render()
)

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
                if item_val[1]
                  if item_val[1] == "yes"
                    done_item_class = "done_item"
                    checked = "checked"
                ele += "<li class='item-"+item_key+"'>
                  <input type='checkbox' class='cb_item' "+checked+" />
                  <div class='item-icons pull-right'><i class='icon-move move-item' ></i><i class='icon-remove delete-item'></i></div>
                  <span contentEditable='true' class='item-text "+done_item_class+"' maxlength='15' >"+item_val[0]+"</span>
                  </li>"

            ele += "</ul></div></div><div class='item-input'><input type='text' class='input-large' id='item-input-"+key+"' placeholder='Enter todo and hit enter' /></div></div>"


            $("#list-row").append(ele)
    $(".nano").nanoScroller()
    $("#list-row").sortable({handle: '.move-list', items: '.list'})
    $(".content ul").sortable({handle: '.move-item', items: 'li', containment: 'parent'})


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


