ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [56.849283, 53.205247],
            zoom: 12
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32,
            clusterDisableClickZoom: true
        });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);

    var url = "data.json";

    $.getJSON(url,function(data){
        for (i = 0; i < data.features.length; i++) {
            defaultObject = data.features[i].properties.balloonContentBody;
            data.features[i].properties.balloonContentBody = [];
            data.features[i].properties.balloonContentBody = "<b>Тип гидранта:</b> "+ defaultObject.type + "<br>"
            + "<b>Дата последней проверки:</b> " + defaultObject.last_date + "<br>"
            + "<b>Мощность гидранта:</b> " + defaultObject.power + "<br>"
            + "<b>Статус гидранта:</b > " + defaultObject.status + "<br>"
            + "<img src=\"images/" + defaultObject.img + "\" width=\"150\" height=\"200\"><br>"
            + "<b>Примечание:</b> " + defaultObject.notation;
        }
        objectManager.add(data);
    });
}