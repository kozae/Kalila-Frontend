import { IDisseminationMapState } from './init-state';
import { TransitionLike, zoomIdentity, Selection, ZoomTransform } from 'd3';
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

const transitionDelay = 100;
export function changePhase(step: number, state: IDisseminationMapState) {
  const { zoom, svg, globe, cities, geoPath } = state;
  if (zoom === null || svg === null || globe === null) {
    return;
  }
  let lines;
  switch (step) {
    case 0:
      zoomTo(zoom, svg, resetZoom);
      [
        'Nagpur',
        'Yazd',
        'Baghdad',
        'Sanliurfa',
        ...phase5NearEastCities,
        ...phase5EuropeCities,
        ...phase4Cities,
      ].forEach((cityName) => hideLanguage(cityName, globe));
      removeLines(globe);
      break;
    case 1:
      zoomTo(zoom, svg, zoomToIndia);
      addLanguage('Nagpur', globe);
      break;
    case 2:
      zoomTo(zoom, svg, zoomToIndiaIran);
      addLanguage('Yazd', globe);
      addline('Nagpur-Yazd', state);
      break;
    case 3:
      zoomTo(zoom, svg, zoomToIndiaIranArabia);
      addLanguage('Baghdad', globe);
      addLanguage('Sanliurfa', globe);
      addline('Yazd-Baghdad', state);
      addline('Yazd-Sanliurfa', state);
      addline('Baghdad-Sanliurfa', state);
      break;
    case 4:
      zoomTo(zoom, svg, zoomEuropeAndNearEast);
      phase4Cities.forEach((cityName) => addLanguage(cityName, globe));
      lines = Object.values(Arrows).filter((item) => item.phase === 4);
      lines.forEach((item) => addline(item.path, state));
      break;
    case 5:
      zoomTo(zoom, svg, zoomToEurope);
      phase5EuropeCities.forEach((cityName) => addLanguage(cityName, globe));
      lines = Object.values(Arrows).filter((item) => item.phase === 5);
      lines.forEach((item) => addline(item.path, state));
      break;
    case 6:
      zoomTo(zoom, svg, zoomToNearEast);
      phase5NearEastCities.forEach((cityName) => addLanguage(cityName, globe));
      lines = Object.values(Arrows).filter((item) => item.phase === 6);
      lines.forEach((item) => addline(item.path, state));
      break;
    case 7:
      zoomTo(zoom, svg, resetZoom);
      break;
  }
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
    .attr('class', `arrow orthodome-p${Arrows[lineId].phase}`)
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

function addLanguage(
  cityName: string,
  globe: Selection<SVGGElement, any, any, any>
) {
  globe.select(`#${cityName}`).attr('visibility', 'visible');
}

function hideLanguage(
  cityName: string,
  globe: Selection<SVGGElement, any, any, any>
) {
  globe.select(`#${cityName}`).attr('visibility', 'hidden');
}

function zoomTo(zoom: any, svg: any, transform: ZoomTransform) {
  zoom.transform(svg.transition().duration(transitionDelay), transform);
}
