import { IDisseminationMapState } from './init-state';
import { citiesAndLanguages } from '../data/cities-and-languages';
import styles from '../styles.module.scss';

export function createMap({
  globe,
  map,
  cities,
  projection,
  geoPath,
}: IDisseminationMapState) {
  if (globe !== null && geoPath !== null && projection !== null) {
    globe
      .selectAll('path.country')
      .data(map.features)
      .enter()
      .append('path')
      .attr('class', styles['country'])
      .attr('id', (d: any) => d.id)
      //@ts-ignore
      .attr('d', geoPath);

    globe
      .selectAll('text')
      .data(cities)
      .enter()
      .append('svg:text')
      .text((d) => citiesAndLanguages[d.city_ascii as string])
      //@ts-ignore
      .attr('x', (d) => projection([d.lng, d.lat])[0] + 4)
      //@ts-ignore
      .attr('y', (d) => projection([d.lng, d.lat])[1] + 4)
      .attr('text-anchor', 'middle')
      .attr('id', (d) => d.city_ascii as string)
      .attr('font-size', '12pt')
      .attr('font-weight', 'bold')
      .attr('fill', 'black')
      .attr('visibility', 'hidden');
  }
}
