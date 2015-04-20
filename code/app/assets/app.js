
$(function() {
  $("#btn-publish").on('click', function() {
    $("#publish-result").html('<div class="loader">').prepend('Publicando...');
    $.get('/deploy', function(result) {
      $("#publish-result").html(result);
    });
  });
});
