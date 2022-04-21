import { IDisseminationMapState } from './init-state';
import { zoomIdentity } from 'd3';
import { Arrows } from '../data/arrows';

const resetZoom = zoomIdentity.translate(0, 0).scale(1),
  zoomToIndia = zoomIdentity.translate(-1900, -1200).scale(3),
  zoomToIndiaIran = zoomIdentity.translate(-1500, -1100).scale(2.9),
  zoomToIndiaIranArabia = zoomIdentity.translate(-1200, -1000).scale(2.7),
  zoomEuropeAndNearEast = zoomIdentity.translate(-480, -500).scale(2.5),
  zoomToEurope = zoomIdentity.translate(0, 0).scale(1.5),
  zoomToNearEast = zoomIdentity.translate(-400, -380).scale(1.5),
  phase4Cities = [
    'Mashhad',
    'Rome',
    'Florence',
    'Edirne',
    'Madrid',
    'Belgrade',
    'Yerevan',
  ],
  phase5EuropeCities = [
    'Stuttgart',
    'Bursa',
    'Berlin',
    'Paris',
    'Stockholm',
    'Tbilisi',
    'Warsaw',
    'Budapest',
    'Kobenhavn',
    'Reykjavik',
    'Amsterdam',
    'Prague',
    'Milan',
    'Agadir',
    'London',
    'Kazan',
    'Oslo',
    'Moscow',
  ],
  phase5NearEastCities = [
    'Agra',
    'Ulaanbaatar',
    'Karachi',
    'Dhaka',
    // "Kabul",
    'Khost',
    'Qarshi',
    'Aksum',
    'Kochi',
    'Kuala Lumpur',
    'Jakarta',
    'Surabaya',
  ];

export function changePhase(step: number, {}: IDisseminationMapState) {
  let lines;
}

function addline(
  lineId: string,
  { globe, cities, geoPath }: IDisseminationMapState
) {
  // Line starts thick than
  globe
    ?.append('svg:defs')
    .append('svg:marker')
    .attr('id', `${lineId}`)
    .attr('refX', 6)
    .attr('refY', 6)
    .attr('markerWidth', 30)
    .attr('markerHeight', 30)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('orient', 'auto')
    .attr('class', 'arrow-head')
    .append('path')
    .attr('d', 'M 0 0 12 6 0 12 3 6');

  globe
    ?.append('g')
    .datum(lineString(Arrows[lineId], cities))
    .attr(
      'class',
      `arrow orthodome-p${Arrows[lineId].phase} animated fadeIn delay-${
        Arrows[lineId].order + 1
      }s`
    )
    .attr('marker-end', `url(#${lineId})`)
    .append('path')
    //@ts-ignore
    .attr('d', geoPath);
}

function lineString(d: any, cities: any[]) {
  const source = cities.find((item) => item.city_ascii === d.source);
  const target = cities.find((item) => item.city_ascii === d.target);

  return {
    id: d.id,
    type: 'LineString',
    coordinates: [
      [source.lng, source.lat],
      [target.lng, target.lat - 0.5],
    ],
  };
}

function removeLines(globe: any) {
  globe.selectAll('g.arrow').remove();
}
