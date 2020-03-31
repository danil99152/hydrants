ymaps.ready(init);

function init () {
    let multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: [],
        // Параметры маршрутизации.
        params: {
            // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
            results: 2
        }
    }, {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
    });

    let myMap = new ymaps.Map('map', {
            center: [56.849283, 53.205247],
            zoom: 12,
            controls: ['zoomControl', 'searchControl', 'typeSelector', 'routeButtonControl']
        }, {
            searchControlProvider: 'yandex#search',
            buttonMaxWidth: 200
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 32,
            clusterDisableClickZoom: true
        });

    // Создадим элемент управления "Пробки".
    let trafficControl = new ymaps.control.TrafficControl({
        state: {
            providerKey: 'traffic#actual',
            trafficShown: false
        }
    });
    // Добавим контрол на карту.
    myMap.controls.add(trafficControl);
    // Получим ссылку на провайдер пробок "Сейчас" и включим показ инфоточек.
    trafficControl.getProvider('traffic#actual').state.set('infoLayerShown', true);

    // Создаем кнопку для управления мультимаршрутом.
    let trafficButton = new ymaps.control.Button({
        data: {content: "Учитывать пробки"},
        options: {selectOnClick: true}
    });
    // Объявляем обработчики для кнопок.
    trafficButton.events.add('select', function () {
        multiRoute.model.setParams({ avoidTrafficJams: true }, true);
    });
    trafficButton.events.add('deselect', function () {
        multiRoute.model.setParams({ avoidTrafficJams: false }, true);
    });
    // Добавим контрол на карту.
    myMap.controls.add(trafficButton);

    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);
    myMap.geoObjects.add(multiRoute);

    const areas = ["Industrialny", "Ustinovsky", "Leninsky", "Oktyabrsky", "Pervomaysky"];
    const macroUrl = "data.json";
    let id = 0;
    function uniteData(area, i){
        i++;
        let microUrl = "Izhevsk/" + area + "/" + i + ".json";
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
                macroData.features[0].id = id++;
                macroData.features[0].geometry.coordinates = coordinates;
                macroData.features[0].properties.balloonContentHeader = "Адрес: " + address;
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
            uniteData(area, i);
        });
    }
    areas.forEach(area => uniteData(area, 0));
}