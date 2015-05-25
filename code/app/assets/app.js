
$(function() {
  $("a.button").on('click', function(e) {
    $(document.body).append('<div class="overlay"><div class="loader" /></div>');
  });
});
