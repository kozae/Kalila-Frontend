import {
  Selection,
  select,
  geoMercator,
  geoPath as d3GeoPath,
  GeoProjection,
  zoom as d3Zoom,
  ZoomBehavior,
  csvParse,
  DSVRowString,
  GeoPath,
} from 'd3';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { continents } from '../data/continents';
import { worldCities } from '../data/world-cities';
import { citiesAndLanguages } from '../data/cities-and-languages';

const width = 1366,
  height = 768,
  scale = 445,
  center = [60, 50] as [number, number],
  angles = [30, 0, 0] as [number, number, number];

export type CityTableColumns =
  | 'city'
  | 'city_ascii'
  | 'lat'
  | 'lng'
  | 'iso3'
  | 'population'
  | 'continent';

export interface IDisseminationMapState {
  svg: Selection<SVGSVGElement | null, any, any, any> | null;
  globe: Selection<SVGGElement, any, any, any> | null;
  zoom: ZoomBehavior<Element, any> | null;
  projection: GeoProjection | null;
  geoPath: GeoPath | null;
  map: { features?: any };
  cities: DSVRowString<CityTableColumns>[] | [];
}

export function InitState(
  ref: RefObject<SVGSVGElement>,
  setter: Dispatch<SetStateAction<IDisseminationMapState>>
) {
  const svg = select(ref.current).attr('width', width).attr('height', height);
  const projection = geoMercator().scale(scale).center(center).rotate(angles);
  const geoPath = d3GeoPath(projection);
  const globe = svg.append('g');
  const zoom = d3Zoom()
    .scaleExtent([1, 30])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on('zoom', (event) => {
      globe.attr('transform', event.transform);
    });
  const testParseCities: DSVRowString<CityTableColumns>[] =
    csvParse(worldCities);
  const features = JSON.parse(continents).features;
  const cities = testParseCities.filter((item) =>
    Object.keys(citiesAndLanguages).includes(item.city_ascii as string)
  );
  setter({
    svg,
    globe,
    zoom,
    projection,
    geoPath,
    map: { features },
    cities,
  });
}
