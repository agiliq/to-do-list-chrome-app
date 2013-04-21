(function() {
  var random_string;

  $(document).ready(function() {
    localStorage.lists = "{}";
    module("App functionality");
    test("Create list - by clicking on create", function() {
      var list_name;
      list_name = random_string(8);
      $("#list-name-input").val(list_name);
      $("#create-list").trigger("click");
      equal($("#list-row .list").length, 1);
      return equal($("#list-0 .list-header-text").text().trim(), list_name);
    });
    test("Create list - by Enter on input", function() {
      var e, list_name;
      e = $.Event("keyup");
      e.which = 13;
      e.keyCode = 13;
      list_name = random_string(8);
      $("#list-name-input").val(list_name);
      $("#list-name-input").trigger(e);
      equal($("#list-row .list").length, 2);
      return equal($("#list-1 .list-header-text").text().trim(), list_name);
    });
    test("Add list item", function() {
      var e, item_text;
      e = $.Event("keyup");
      e.which = 13;
      e.keyCode = 13;
      item_text = random_string(10);
      $("#item-input-0").val(item_text);
      $("#item-input-0").trigger(e);
      equal($("#list-0 .item-0 .item-text").text().trim(), item_text);
      return equal($("#list-0 .ul-items li").length, 1);
    });
    test("Add another list item", function() {
      var e, item_text;
      e = $.Event("keyup");
      e.which = 13;
      e.keyCode = 13;
      item_text = random_string(10);
      $("#item-input-0").val(item_text);
      $("#item-input-0").trigger(e);
      equal($("#list-0 .item-1 .item-text").text().trim(), item_text);
      return equal($("#list-0 .ul-items li").length, 2);
    });
    return test("Delete item", function() {
      equal($("#list-0 .ul-items li").length, 2);
      $("#list-0 .item-1 .delete-item").trigger("click");
      return equal($("#list-0 .ul-items li").length, 1);
    });
  });

  random_string = function(len) {
    var i, possible, text;
    text = "";
    possible = "abcdefghijklmnopqrstuvwxyz";
    i = 0;
    while (i < len) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      i++;
    }
    return text;
  };

}).call(this);
