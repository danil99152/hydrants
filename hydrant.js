ymaps.ready(init);

function init () {
    let myMap = new ymaps.Map('map', {
            center: [56.849283, 53.205247],
            zoom: 12
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 32,
            clusterDisableClickZoom: true
        });

    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);

    let i = 0;
    const macroUrl = "data.json";
    function uniteData(){
        i++;
        let microUrl = "hydrants/" + i + ".json";
        $.getJSON(microUrl, function (microData) {
            let coordinates = microData.coordinates;
            let address = microData.address;
            let type = microData.type;
            let last_date = microData.last_date;
            let power = microData.power;
            let status = microData.status;
            let img = microData.img;
            let notation = microData.notation;
            $.getJSON(macroUrl, function (macroData) {
                macroData.features[0].id = i;
                macroData.features[0].geometry.coordinates = coordinates;
                macroData.features[0].properties.balloonContentHeader = address;
                macroData.features[0].properties.balloonContentBody = [];
                macroData.features[0].properties.balloonContentBody = "<b>Тип гидранта:</b> " + type + "<br>"
                    + "<b>Дата последней проверки:</b> " + last_date + "<br>"
                    + "<b>Мощность гидранта:</b> " + power + "<br>"
                    + "<b>Статус гидранта:</b > " + status + "<br>"
                    + "<img src=\"images/" + img + "\" width=\"150\" height=\"200\"><br>"
                    + "<b>Примечание:</b> " + notation;
                objectManager.add(macroData);
            });
        }).done(function () {
            uniteData();
        }).fail(function() {
            console.log("Если это сообщение вышло дважды, то, возможно, проблема в синтаксисе нового json-файла");
        });
    }
    uniteData();
}