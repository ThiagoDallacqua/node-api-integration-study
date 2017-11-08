const Authentication = require('../middlewares/Authentication')
const logger = require('../services/logger.js');

const styles = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 13
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#144b53"
            },
            {
                "lightness": 14
            },
            {
                "weight": 1.4
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#34495e"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#566777"
            },
            {
                "lightness": 5
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "labels.icon",
        "stylers": [
            {
                "color": "#98acbf"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "labels.icon",
        "stylers": [
            {
                "color": "#7ca2c7"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#4d5a67"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#3d5165"
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2e3944"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#52606f"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#445d75"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "color": "#146474"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#5a748d"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.icon",
        "stylers": [
            {
                "color": "#5a748d"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#021019"
            }
        ]
    }
]

module.exports = app => {
  app.get('/map/styles', (req, res) => res.json({ styles: styles }));

  app.get('/map/markers', (req, res) => {
    let mapModel = app.models.map;
    let connect = app.infra.connectionFactory;
    let MapLocation = new app.infra.MapDAO(mapModel, connect);

    MapLocation.list((err, markers) => {
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }

      let locations = markers.map(marker => {
        return { title: marker.party.partyName, location: marker.location }
      })

      res.json(locations)
      return
    })

    // res.json(locations)
  })
}
