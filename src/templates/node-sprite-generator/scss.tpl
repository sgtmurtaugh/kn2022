@use '../../mixins/sprite-mixins';

// private sprite
$_<%= spriteName %>-url: '<%= options.spritePath %>';
$_<%= spriteName %>-height: <%= getCSSValue(layout.width) %>;
$_<%= spriteName %>-width: <%= getCSSValue(layout.height) %>;
$_<%= spriteName %>-size: $_<%= spriteName %>-width $_<%= spriteName %>-height;

<% layout.images.forEach(function (image) { %>
$_<%= image.className %>-x: <%= getCSSValue(-image.x) %>;
$_<%= image.className %>-y: <%= getCSSValue(-image.y) %>;
$<%= image.className %>-width: <%= getCSSValue(image.width) %>;
$<%= image.className %>-height: <%= getCSSValue(image.height) %>;
$<%= image.className %>: $_<%= spriteName %>-url $_<%= image.className %>-x $_<%= image.className %>-y $<%= image.className %>-width $<%= image.className %>-height $_<%= spriteName %>-size;
<% }); %>

@mixin <%= spriteName %>($sprite) {
    @include sprite-mixins.sprite($sprite);

    // Uncomment following include to use the private mixins instead of external sprite functions/mixins
    // @include _<%= spriteName %>-image;<% if (options.pixelRatio !== 1) { %>
    // @include _<%= spriteName %>-size;<% } %>
    // @include _<%= spriteName %>-position($sprite);
    // @include _<%= spriteName %>-width($sprite);
    // @include _<%= spriteName %>-height($sprite);
}
@mixin _<%= spriteName %>-image {
    background-image: url("#{$_<%= spriteName %>-url}");
    background-repeat: no-repeat;
}<% if (options.pixelRatio !== 1) { %>
@mixin _<%= spriteName %>-size {
    background-size: #{$_<%= spriteName %>-size};
}<% } %>
@mixin _<%= spriteName %>-position($sprite) {
    @if $sprite and length($sprite) > 2 {
        background-position: nth($sprite, 2) nth($sprite, 3);
    }
}
@mixin _<%= spriteName %>-width($sprite) {
    @if $sprite and length($sprite) > 3 {
        width: nth($sprite, 4);
    }
}
@mixin _<%= spriteName %>-height($sprite) {
    @if $sprite and length($sprite) > 4 {
        height: nth($sprite, 5);
    }
}
@mixin <%= spriteName %>-utilities {
<% layout.images.forEach(function (image) { %>
    .<%= image.className %> {
        @include sprite-mixins.sprite($<%= image.className %>);

        // Use the following includes to use the private mixins instead of external sprite mixins
        // @include _<%= spriteName %>-image;<% if (options.pixelRatio !== 1) { %>
        // @include _<%= spriteName %>-size;<% } %>
        // @include _<%= spriteName %>-position($<%= image.className %>);
        // @include _<%= spriteName %>-width($<%= image.className %>);
        // @include _<%= spriteName %>-height($<%= image.className %>);
    }

    .<%= image.className %>--dimensions {
        @include sprite-mixins.sprite($<%= image.className %>);

        // Use the following includes to use the private mixins instead of external sprite mixins
        // @include _<%= spriteName %>-image;<% if (options.pixelRatio !== 1) { %>
        // @include _<%= spriteName %>-size;<% } %>
        // @include _<%= spriteName %>-position($<%= image.className %>);
        // @include _<%= spriteName %>-width($<%= image.className %>);
        // @include _<%= spriteName %>-height($<%= image.className %>);
    }
<% }); %>
}

