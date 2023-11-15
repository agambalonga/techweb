// Funzione per gestire la ricerca in live search con jQuery UI autocomplete
$(document).ready(function() {
    var artists = [];

    $.ajax({
        url: '/artists',
        type: 'GET',
        success: function(data) {
            console.log(data);
            data.artists.map(function(artist) {
                artists.push({ id: artist._id, label: artist.artist_name }); // Utilizza 'label' invece di 'artist_name'
            });
            console.log(artists);

            // Inizializza l'autocomplete solo dopo che la chiamata AJAX ha avuto successo
            $("#searchInput").autocomplete({
                source: artists,
                minLength: 0,
                select: function (event, ui) {
                    var artistId = ui.item.id;
                    window.location.href = '/artist?id=' + artistId;
                }
            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li class='ui-menu-item'>")
                    .append(item.label)
                    .appendTo(ul);
            };
        }
    });
});