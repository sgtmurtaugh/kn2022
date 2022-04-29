@use '../../functions/sprite_functions';
@use '../../mixins/sprite_mixins';

$-<%= spriteName %>-url: '<%= options.spritePath %>';
$-<%= spriteName %>-height: <%= getCSSValue(layout.width) %>;
$-<%= spriteName %>-width: <%= getCSSValue(layout.height) %>;
$-<%= spriteName %>-size: $-<%= spriteName %>-width $-<%= spriteName %>-height;

<% layout.images.forEach(function (image) { %>$<%= image.className %>-x: <%= getCSSValue(-image.x) %>;
$<%= image.className %>-y: <%= getCSSValue(-image.y) %>;
$<%= image.className %>-width: <%= getCSSValue(image.width) %>;
$<%= image.className %>-height: <%= getCSSValue(image.height) %>;
$<%= image.className %>: $<%= image.className %>-x $<%= image.className %>-y $<%= image.className %>-width $<%= image.className %>-height;
<% }); %>
<% if (options.pixelRatio !== 1) { %>
@mixin <%= spriteName %>-size {
  background-size: <%= getCSSValue(layout.width) %> <%= getCSSValue(layout.height) %>;
}
<% } %>
@mixin <%= spriteName %>($sprite) {
  @include sprite_mixins.sprite($sprite, $-<%= spriteName %>-url<% if (options.pixelRatio !== 1) { %>, $-<%= spriteName %>-size<% } %>);
}
