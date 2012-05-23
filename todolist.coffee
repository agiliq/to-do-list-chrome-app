
  
$(document).ready ->
  todolistapp2987 = {}
  
  
  renderToDoList = ->
  
    if "todolist" of localStorage
      todolist = JSON.parse(localStorage.todolist)
      
      
      output = "<table id='table_todolist' >"
      i=0
      
      for singlelist of todolist
        #html_listitem = "<input type='text' id='listitem_0' />"
        html_listitem = "<div id='listcontainer_"+singlelist+"' class='listcontainer' listindex='"+singlelist+"'><div id='listname_"+singlelist+"' class='listname' data='"+singlelist+"' listindex='"+singlelist+"'>"+todolist[singlelist].name+"</div><div id='divlist_"+singlelist+"' class='divlist' data='"+singlelist+"' listindex='"+singlelist+"' ></div><center><input type='text' id='listitem_"+singlelist+"' class='listitem_input' placeholder='Type and hit enter' listindex='"+singlelist+"' /></center><div id='list_icons_"+singlelist+"' class='list_icons' listindex='"+singlelist+"' style='display:none' ><img src='images/move.png' listindex='"+singlelist+"' class='list_icons_move' /><img src='images/trash2.png' style='height:30px;width:35px' listindex='"+singlelist+"'  class='list_icons_trash' /></div>"
        if "details" of todolist[singlelist]
          html_listitem = "<div id='listcontainer_"+singlelist+"' class='listcontainer' listindex='"+singlelist+"'><div id='listname_"+singlelist+"' class='listname' data='"+singlelist+"' listindex='"+singlelist+"'>"+todolist[singlelist].name+"</div><div id='divlist_"+singlelist+"' class='divlist' data='"+singlelist+"' listindex='"+singlelist+"'><ul>"  
          detailsindex = 0
          for listitem of todolist[singlelist]["details"]
            item = todolist[singlelist]["details"][listitem].item
            checked = todolist[singlelist]["details"][listitem].checked
            addedClass = ""
            if checked is "true"
              checked = 'checked'
              addedClass = " lichecked"
            else
              checked = ''  
            html_listitem+= "<li  listindex='"+singlelist+"'  itemindex='"+listitem+"' id='listitemli_"+singlelist+"_"+listitem+"' class='listitem_class"+addedClass+"'><input type='checkbox' id='li_cb_"+singlelist+"_"+listitem+"' class='li_cb'  "+checked+" listindex='"+singlelist+"' itemindex='"+listitem+"' /><span  listindex='"+singlelist+"' itemindex='"+listitem+"'>"+item+"</span><img id='handle_move_"+singlelist+"_"+listitem+"' class='handle_move' src='images/move.png' listindex='"+singlelist+"'  itemindex='"+listitem+"' style='display:none'/><img id='listitem_image_"+singlelist+"_"+listitem+"' listindex='"+singlelist+"'  itemindex='"+listitem+"' src='images/trash2.png'  class='listitem_image' style='display:none;width:25px;height:20px;' /></li>"  
           
          html_listitem+="</div><center><input placeholder='Type and hit enter' type='text' id='listitem_"+singlelist+"' class='listitem_input' listindex='"+singlelist+"' /></center><div listindex='"+singlelist+"' id='list_icons_"+singlelist+"' class='list_icons' style='display:none' ><img src='images/move.png' listindex='"+singlelist+"' class='list_icons_move' /><img src='images/trash2.png'  listindex='"+singlelist+"' class='list_icons_trash' /></div></div>" 
          
        if i==0
          output+="<tr><td listindex='"+singlelist+"'><div class='singlelist' listindex='"+singlelist+"' id='singlelist_"+singlelist+"' >"+html_listitem+"</div></td>"
          i++
        else if i==2  
          output+="<td listindex='"+singlelist+"' ><div class='singlelist' id='singlelist_"+singlelist+"'>"+html_listitem+"</div></td></tr>"
          i=0 
        else
          output+="<td listindex='"+singlelist+"' ><div class='singlelist' listindex='"+singlelist+"' id='singlelist_"+singlelist+"'>"+html_listitem+"</div></td>"
          i++
      if output.substr(output.length-5,5) == "</td>"      
        output+="</tr>"
      output+="</table>"
      $("#todolist").html output
      $("ul").sortable {connectWith : 'ul',handle : '.handle_move'}
      $("table").sortable({
        items : "td",
        handle : '.list_icons_move'
      })
      #$("table td").sortable {connectWith : 'table' , containment : "table" , handle : '.list_icons_move'}
      #$("table").sortable()
      #$("table tbody").sortable({ handle : '.list_icons_move'}).disableSelection()
      
    else
      #console.log "todolist not in localStorage"
  
  renderToDoList()
  
  #events : 
  
  onEnter_newlist = ->
    input_newlist = $("#input_newlist")
    
    if input_newlist.val().trim().length > 0
      #$("#mylist").append '<li>'+$("#input_newlist").val()+'</li>'
      obj = {}
      obj.name = input_newlist.val()
      if "todolist" of localStorage
        i=0
        oldobj = JSON.parse localStorage.todolist
        for key of oldobj
          i++
        #console.log i  
        if i>0  
          #console.log "todolist already there"
          oldobj[i] = obj
          localStorage.setItem "todolist",JSON.stringify(oldobj)
        else
          #console.log "new todolist"
          newobj = {}
          newobj[0] = obj
          localStorage.setItem "todolist",JSON.stringify(newobj)
       else
         #console.log "todolist not in localstorage" 
         #console.log "new todolist"
         newobj = {}
         newobj[0] = obj
         localStorage.setItem "todolist",JSON.stringify(newobj)  
    renderToDoList()     
    input_newlist.val("")
      
    
  
  $(".listitem_input").live 'keypress', (e)->
    if e.keyCode is 13
      #console.log e.target.id
      id = e.target.id
      if $("#"+id).val().trim().length < 1 
        return
      singlelist = id.substr(id.indexOf("_")+1)
      oldobj = {}
      
      oldobj = JSON.parse(localStorage.todolist)
      i=0
      if "details" of oldobj[singlelist]
        
        for key of oldobj[singlelist]["details"]
          i++
      #oldobj[singlelist].details = {} if "details" not in oldobj[singlelist]    
      if "details" not of oldobj[singlelist]
        oldobj[singlelist].details = {}
      oldobj[singlelist].details[i] = {}
      oldobj[singlelist].details[i].checked = 'false'  
      oldobj[singlelist].details[i].item = $("#"+id).val()
      localStorage.setItem "todolist",JSON.stringify(oldobj)
      renderToDoList()
      $("#"+id).focus()       
      
      

          
  $("#btn_newlist").bind 'click', ->
    
    return onEnter_newlist()
    
  
  #$("#divlist").live "blur",(e) ->
    #console.log e.keyCode
    #if e.keyCode != 13
    #  return
    #saveListItem(e)
    
  $(".divlist").live "keypress blur" , (e) ->
    if e.type is "keypress"
      #console.log "keypress"
    #keypress : (e) ->
      if e.keyCode == 13
        saveListItem(e)
        e.stopPropagation()
    else  
      #console.log "Sdf"   
    #blur : (e) ->
      saveListItem(e)      
      
  saveListItem = (e)->  
    val = $("#"+e.target.id).val()
    listindex =  $(e.target).attr "listindex"
    itemindex = $(e.target).attr "itemindex"
    
    if val.trim().length < 1
    
      newele = $("<span listindex='"+listindex+"' itemindex='"+itemindex+"' >"+todolistapp2987.oldlistitem+"</span>")
      $("#"+e.target.id).replaceWith newele
      return
    oldobj = JSON.parse(localStorage.todolist)
    id = e.target.id
    fi = id.indexOf "_"
    li = id.lastIndexOf "_"
    singlelist = id.substr(fi+1,li-fi-1)
    itemindex = id.substr(li+1)
    oldobj[singlelist].details[itemindex].item = val
    
    localStorage.todolist = JSON.stringify oldobj
    
    newele = $("<span listindex='"+listindex+"' itemindex='"+itemindex+"'  >"+val+"</span>")
    $("#"+e.target.id).replaceWith newele  
  
  $(".divlist span").live "click", (e)->
   
    if e.target.id
      return
    
    listindex =  $(e.target).attr "listindex"
    itemindex = $(e.target).attr "itemindex"
    
    newele = $("<input type='text' id='inputlistitem_"+listindex+"_"+itemindex+"' listindex='"+listindex+"' itemindex='"+itemindex+"' class='inputlistitem_class' />")  
    newele.val $("#listitemli_"+listindex+"_"+itemindex+" span").text()
    todolistapp2987.oldlistitem = $("#"+e.target.id).text()
    #$("#"+e.target.id).replaceWith newele
    #$("#"+e.target.id).focus()
    $("#listitemli_"+listindex+"_"+itemindex+" span").replaceWith newele
    newele.focus()
      
  $("#input_newlist").bind "keypress", (e)->
    if e.keyCode == 13
      onEnter_newlist()
      
  saveListName = (e)->  
    val = $("#"+e.target.id).val()
    if val.trim().length < 1
    
      newele = $("<div id='"+e.target.id+"' class='listname'>"+todolistapp2987.oldlistname+"</div>")
      $("#"+e.target.id).replaceWith newele
      return
      
    oldobj = JSON.parse(localStorage.todolist)
    id = e.target.id
    #fi = id.indexOf "_"
    singlelist = id.substr(id.indexOf("_")+1)
    oldobj[singlelist].name = val
    
    localStorage.todolist = JSON.stringify oldobj
    
    newele = $("<div id='"+e.target.id+"' class='listname'>"+val+"</div>")
    $("#"+e.target.id).replaceWith newele
  
      
  $(".listname").live 
    click : (e) ->
      id = e.target.id
      newele = $("<input type='text' id='"+id+"' class='listname' size='10' maxlength='25'  />")
      newele.val $("#"+id).text()
      todolistapp2987.oldlistname = $("#"+id).text()
      $("#"+id).replaceWith newele
      $("#"+id).focus()
      
    keypress : (e) ->
      #console.log e.keyCode
      if e.keyCode != 13
        return
      saveListName(e)
        
      
    blur : (e)->
      saveListName(e)    
 
 
  $(".singlelist").live 
    mouseenter : (e) ->
      #console.log "entere3d"
      singlelist = $(e.target).attr("singlelist") || $(e.target).attr("listindex")
      #console.log "entere : "+singlelist
      $(".list_icons_"+singlelist).show()
    mouseleave : (e) ->
      #console.log "eft"
      singlelist = $(e.target).attr "singlelist" || $(e.target).attr("listindex")
      #console.log "Left : "+singlelist
      $(".list_icons_"+singlelist).hide()    
 
  
  $("div.listcontainer").live
    mouseenter : (e)->
      id = e.target.id
      i=0
      listindex = 0
      for key of id
        i++ if id[key]=="_"
      if i is 1  
        listindex = id.substr(id.indexOf("_")+1)
      else
        fi = id.indexOf "_"
        li = id.lastIndexOf "_"
        
        listindex = id.substr(fi+1,li-fi-1)  
      $("#list_icons_"+listindex).show()  
    mouseleave : (e) ->
      $("div.list_icons").hide(500)
     
  $(".list_icons_trash").live 
    'click' : (e) ->
      listindex = $(e.target).attr "listindex"
      oldobj = JSON.parse localStorage.todolist
      
      len = 0
      
      for i of oldobj
        len++
        
      ind = parseInt(listindex)+1  
      #console.log ind+" : "+len
      while ind < len
        oldobj[parseInt(ind - 1)+""] = oldobj[ind+""]
        ind++
      delete oldobj[ind-1]  
      localStorage.setItem "todolist",JSON.stringify(oldobj)
      renderToDoList()
      
      
      
  $(".list_icons_trash").live 
    mouseenter : (e) ->
      #console.log "---------------"
      listindex = $(e.target).attr "listindex"
      $("#list_icons_"+listindex).show()
      #console.log listindex 
      
  $(".listitem_class span").live
  
    mouseenter : (e) ->
      listindex = $(e.target).attr "listindex"
      $("#list_icons_"+listindex).show()
    
      
  $(".listitem_class").live
    mouseenter : (e) ->
      listindex = $(e.target).attr "listindex"
      itemindex = $(e.target).attr "itemindex"
      $("#listitem_image_"+listindex+"_"+itemindex).show()
      $("#handle_move_"+listindex+"_"+itemindex).show()
      $("#list_icons_"+listindex).show()
    mouseleave : (e) ->
      listindex = $(e.target).attr "listindex"
      itemindex = $(e.target).attr "itemindex"
      $("#listitem_image_"+listindex+"_"+itemindex).hide() 
      $("#handle_move_"+listindex+"_"+itemindex).hide()  
      
  $(".handle_move").live
    mouseenter : (e) ->
      listindex = $(e.target).attr "listindex"
      itemindex = $(e.target).attr "itemindex"
      $("#listitem_image_"+listindex+"_"+itemindex).show()
      
  
  $(".listitem_image").live
    
    'click' : (e) ->
      oldobj = JSON.parse localStorage.todolist
      listindex = $(e.target).attr "listindex"
      itemindex = $(e.target).attr "itemindex"
      len = 0
      
      for i of oldobj[listindex].details
        len++
        
      ind = parseInt(itemindex)+1  
      while ind < len
        oldobj[listindex].details[parseInt(ind - 1)+""] = oldobj[listindex].details[ind+""]
        ind++
      delete oldobj[listindex].details[ind-1]  
      localStorage.setItem "todolist",JSON.stringify(oldobj)
      renderToDoList()
          
  $(".li_cb").live
    'click' : (e) ->
       checked = $(e.target).is(":checked")
       listindex = $(e.target).attr "listindex"
       itemindex = $(e.target).attr "itemindex"
       if checked
         checked = "true"
         
         $("#listitemli_"+listindex+"_"+itemindex).addClass "lichecked"
       else
         checked = "false"
         $("#listitemli_"+listindex+"_"+itemindex).removeClass "lichecked"
       oldobj = JSON.parse localStorage.todolist    
       
       oldobj[listindex]["details"][itemindex].checked = checked
       localStorage.setItem "todolist",JSON.stringify(oldobj)
  
  $("table").live "sortstop" , (e,ui) ->
    console.log e
    if e.target.localName is "ul"
      return
    newindex = ui.item.index()
    oldindex = ui.item.attr "listindex"
    oldobj = JSON.parse localStorage.todolist
    temp = oldobj[newindex]
    oldobj[newindex] = oldobj[oldindex]
    oldobj[oldindex] = temp
    localStorage.setItem "todolist",JSON.stringify(oldobj)
    renderToDoList()   
  
  $("ul").live "sortstop", (e,ui) ->
    if e.target.id is "table_todolist"
      return
    listindex = ui.item.attr "listindex"
    itemindex = ui.item.attr "itemindex"
    oldindex = ui.item.index()
    oldobj = JSON.parse localStorage.todolist
    temp = {}
    temp = oldobj[listindex]['details'][itemindex]
    oldobj[listindex]['details'][itemindex] = oldobj[listindex]['details'][oldindex]
    oldobj[listindex]['details'][oldindex] = temp
    localStorage.setItem "todolist",JSON.stringify(oldobj)
    renderToDoList()     
          
